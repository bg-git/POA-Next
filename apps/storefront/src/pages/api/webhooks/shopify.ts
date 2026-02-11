import type { NextApiRequest, NextApiResponse } from 'next';
import { createHmac } from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '';

interface WebhookRequest extends NextApiRequest {
  rawBody?: string;
}

function verifyWebhookSignature(signature: string, body: string): boolean {
  if (!SHOPIFY_WEBHOOK_SECRET) {
    console.error('SHOPIFY_WEBHOOK_SECRET not configured');
    return false;
  }

  const hash = createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('base64');

  return hash === signature;
}

export default async function handler(
  req: WebhookRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const hmacHeader = req.headers['x-shopify-hmac-sha256'] as string;
    const rawBody = req.rawBody || JSON.stringify(req.body);

    if (!hmacHeader) {
      console.error('Missing HMAC header');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the webhook is from Shopify
    if (!verifyWebhookSignature(hmacHeader, rawBody)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const topic = req.headers['x-shopify-topic'] as string;
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    console.log('Shopify webhook received:', topic);

    if (topic === 'orders/create' || topic === 'orders/paid') {
      // Order was created/paid - mark booking as confirmed
      const orderId = data.id;
      const orderName = data.name;
      const customerEmail = data.customer?.email;
      const checkoutId = data.cart_token; // Cart ID is included in order

      if (!checkoutId && !customerEmail) {
        console.log('Missing checkout ID and customer email, skipping');
        return res.status(200).json({ success: true });
      }

      // Find booking by cart ID or customer email
      let query = supabase.from('bookings').select('id, status');

      if (checkoutId) {
        query = query.eq('shopify_draft_order_id', checkoutId).limit(1);
      } else if (customerEmail) {
        query = query.eq('customer_email', customerEmail).neq('status', 'cancelled').limit(1);
      }

      const { data: bookings, error: selectError } = await query;

      if (selectError) {
        console.error('Error finding booking:', selectError);
        return res.status(200).json({ success: true }); // Don't fail webhook
      }

      if (!bookings || bookings.length === 0) {
        console.log('No pending booking found for this order');
        return res.status(200).json({ success: true });
      }

      const booking = bookings[0];

      // Update booking status to confirmed and store order ID
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          shopify_draft_order_id: orderId.toString(),
        })
        .eq('id', booking.id);

      if (updateError) {
        console.error('Error updating booking:', updateError);
        return res.status(200).json({ success: true }); // Don't fail webhook
      }

      console.log(`Booking ${booking.id} confirmed with order ${orderName}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(200).json({ success: true }); // Always return 200 for webhooks
  }
}

// Disable body parser for webhooks (Shopify needs raw body for signature verification)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Capture raw body for signature verification
export function middleware(req: WebhookRequest) {
  if (!req.rawBody) {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      req.rawBody = body;
    });
  }
}
