import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface BookingRequest {
  location: string;
  date: string;
  time: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  customerId?: string;
}

const LOCATION_MAP: Record<string, string> = {
  chesterfield: 'Chesterfield',
  leicester: 'Leicester',
};

const SHOPIFY_PRODUCTS: Record<string, string> = {
  chesterfield: '55409569857919',
  leicester: '55409591091583',
};

const SLOT_LIMITS: Record<string, number> = {
  '09:00 AM': 2,
  '10:00 AM': 2,
  '11:00 AM': 2,
  '02:00 PM': 2,
  '03:00 PM': 2,
  '04:00 PM': 1,
};

async function createShopifyCheckout(
  email: string,
  firstName: string,
  lastName: string,
  productId: string,
  date: string,
  time: string,
  location: string,
  customerAccessToken?: string
) {
  const shopifyStoreUrl = process.env.SHOPIFY_STORE_DOMAIN || '';
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

  const query = `
    mutation {
      cartCreate(input: {
        lines: [
          {
            merchandiseId: "gid://shopify/ProductVariant/${productId}"
            quantity: 1
          }
        ]
        ${customerAccessToken ? `buyerIdentity: {
          email: "${email}"
          customerAccessToken: "${customerAccessToken}"
        }` : `buyerIdentity: {
          email: "${email}"
        }`}
        attributes: [
          { key: "Appointment Date", value: "${date}" }
          { key: "Appointment Time", value: "${time}" }
          { key: "Location", value: "${location}" }
        ]
      }) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await fetch(`https://${shopifyStoreUrl}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(`Shopify error: ${JSON.stringify(result.errors)}`);
  }

  if (result.data?.cartCreate?.userErrors?.length > 0) {
    throw new Error(
      `Checkout error: ${result.data.cartCreate.userErrors
        .map((e: { message: string }) => e.message)
        .join(', ')}`
    );
  }

  const cart = result.data?.cartCreate?.cart;
  
  if (!cart) {
    throw new Error('Failed to create cart');
  }
  
  return cart;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { location, date, time, email, phone, firstName, lastName, customerId }: BookingRequest = req.body;

  // Get customer access token from cookie for authenticated checkout
  const customerAccessToken = req.cookies['customer_session'] || '';

  // Validate required fields
  if (!location || !date || !time) {
    return res.status(400).json({
      error: 'Missing required fields: location, date, time',
    });
  }

  if (!customerId) {
    return res.status(401).json({
      error: 'Customer must be authenticated to book an appointment',
    });
  }

  if (!LOCATION_MAP[location]) {
    return res.status(400).json({ error: 'Invalid location' });
  }

  if (!SLOT_LIMITS[time]) {
    return res.status(400).json({ error: 'Invalid time slot' });
  }

  try {
    const locationName = LOCATION_MAP[location];
    const maxSlots = SLOT_LIMITS[time];
    const productId = SHOPIFY_PRODUCTS[location];

    // Check if slot is still available
    const { data: bookings, error: checkError } = await supabase
      .from('bookings')
      .select('slots_booked')
      .eq('location', locationName)
      .eq('appointment_date', date)
      .eq('appointment_time', time)
      .eq('status', 'confirmed');

    if (checkError) throw checkError;

    const slotsBooked = bookings?.reduce((sum, b) => sum + (b.slots_booked || 1), 0) || 0;

    if (slotsBooked >= maxSlots) {
      return res.status(409).json({
        error: 'No slots available for this time',
      });
    }

    // Create Shopify checkout
    let shopifyCheckoutId = '';
    let cart: { id?: string; checkoutUrl?: string } | null = null;
    try {
      cart = await createShopifyCheckout(
        email || '',
        firstName || 'Guest',
        lastName || '',
        productId,
        date,
        time,
        locationName,
        customerAccessToken
      );

      shopifyCheckoutId = cart?.id || '';
    } catch (shopifyError) {
      console.error('Shopify checkout creation failed:', shopifyError instanceof Error ? shopifyError.message : shopifyError);
      // Continue with booking even if Shopify fails, but log it
    }

    // Create booking in Supabase
    const fullName = `${firstName || 'Guest'} ${lastName || ''}`.trim();
    
    console.log('Creating booking with:', {
      location: locationName,
      date,
      time,
      customerEmail: email,
      customerId,
    });

    const { data: newBooking, error: insertError } = await supabase
      .from('bookings')
      .insert([
        {
          location: locationName,
          appointment_date: date,
          appointment_time: time,
          customer_name: fullName,
          customer_email: email || '',
          customer_phone: phone || '',
          customer_id: customerId,
          shopify_draft_order_id: shopifyCheckoutId,
          slots_booked: 1,
          status: 'confirmed',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      throw insertError;
    }

    // Construct checkout URL from Shopify cart
    const checkoutUrl = cart?.checkoutUrl || '';
    
    return res.status(201).json({
      success: true,
      message: 'Booking confirmed and checkout created',
      booking: newBooking?.[0],
      shopifyCheckoutId: shopifyCheckoutId,
      checkoutUrl: checkoutUrl,
    });
  } catch (error) {
    console.error('Booking confirmation error:', error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return res.status(500).json({
      error: 'Failed to confirm booking',
      details: errorMessage,
    });
  }
}
