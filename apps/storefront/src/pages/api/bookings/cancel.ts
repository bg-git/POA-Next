import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '';

interface ShopifyOrder {
  id: string;
  total_price: string;
  currency: string;
  line_items: Array<{ id: string; quantity: number }>;
  transactions: Array<{ id: string; status: string; kind: string }>;
}

// Process refund through Shopify Admin API
async function processShopifyRefund(orderId: string): Promise<boolean> {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
    console.warn('Shopify credentials not configured');
    return false;
  }

  try {
    // Extract numeric ID from orderId if it's in format "gid://shopify/Order/123456789"
    const numericId = orderId.includes('gid://') ? orderId.split('/').pop() : orderId;

    // First, get the order details
    const orderResponse = await fetch(
      `https://${SHOPIFY_DOMAIN}/admin/api/2024-07/orders/${numericId}.json`,
      {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!orderResponse.ok) {
      console.error(`Failed to fetch order: ${orderResponse.status}`);
      return false;
    }

    const orderData = await orderResponse.json();
    const order: ShopifyOrder = orderData.order;

    if (!order) {
      console.error('Order not found in Shopify');
      return false;
    }

    // Create refund for full order amount
    const refundPayload = {
      refund: {
        note: 'Customer cancelled booking appointment',
        notify: true,
        line_items: order.line_items?.map((item: { id: string; quantity: number }) => ({
          id: item.id,
          quantity: item.quantity,
        })) || [],
        transactions: order.transactions
          ?.filter((t: { status: string; kind: string }) => t.status === 'success' && t.kind === 'sale')
          .map((t: { id: string }) => ({
            parent_id: t.id,
            user_id: null,
            processed_at: new Date().toISOString(),
          })) || [],
      },
    };

    const refundResponse = await fetch(
      `https://${SHOPIFY_DOMAIN}/admin/api/2024-07/orders/${numericId}/refunds.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refundPayload),
      }
    );

    if (!refundResponse.ok) {
      const errorData = await refundResponse.json();
      console.error(`Refund failed: ${JSON.stringify(errorData)}`);
      return false;
    }

    console.log(`Refund processed successfully for order ${numericId}`);
    return true;
  } catch (error) {
    console.error('Error processing refund:', error);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'Booking ID required' });
  }

  try {
    // Get the booking to check the date, status, and order ID
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('appointment_date, status, shopify_draft_order_id')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if appointment is more than 24 hours away
    const appointmentDate = new Date(booking.appointment_date + 'T00:00:00');
    const now = new Date();
    const hoursDiff = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff <= 24) {
      return res.status(400).json({ error: 'Cannot cancel within 24 hours of appointment' });
    }

    // Don't allow cancellation of already cancelled bookings
    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    // Process refund if booking has a paid Shopify order
    let refundProcessed = false;
    let refundError = '';

    if (booking.shopify_draft_order_id) {
      // Check if this is an actual order (not just a cart ID)
      // Order IDs are typically numeric strings, cart IDs are UUIDs
      const isOrderId = /^\d+$/.test(booking.shopify_draft_order_id) || 
                        booking.shopify_draft_order_id.includes('gid://shopify/Order');

      if (isOrderId) {
        const refundSuccess = await processShopifyRefund(booking.shopify_draft_order_id);
        refundProcessed = refundSuccess;
        if (!refundSuccess) {
          refundError = 'Refund processing failed, but booking will be cancelled anyway';
        }
      }
    }

    // Update booking status to cancelled
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error cancelling booking:', updateError);
      return res.status(500).json({ error: 'Failed to cancel booking' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Booking cancelled' + (refundProcessed ? ' and refund processed' : ''),
      refundProcessed,
      refundError: refundError || null,
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
