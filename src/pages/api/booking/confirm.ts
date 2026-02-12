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

// Operating hours by day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
const LOCATION_HOURS_BY_DAY: Record<string, Record<number, { open: string; close: string; slots: number }>> = {
  Chesterfield: {
    2: { open: '10:00 AM', close: '6:00 PM', slots: 2 }, // Tuesday
    3: { open: '10:00 AM', close: '6:00 PM', slots: 2 }, // Wednesday
    4: { open: '10:00 AM', close: '6:00 PM', slots: 2 }, // Thursday
    5: { open: '10:00 AM', close: '6:00 PM', slots: 2 }, // Friday
    6: { open: '9:00 AM', close: '6:00 PM', slots: 2 }, // Saturday
  },
  Leicester: {
    0: { open: '11:00 AM', close: '4:00 PM', slots: 1 }, // Sunday
    1: { open: '11:00 AM', close: '6:00 PM', slots: 1 }, // Monday
    2: { open: '11:00 AM', close: '6:00 PM', slots: 1 }, // Tuesday
    3: { open: '11:00 AM', close: '6:00 PM', slots: 1 }, // Wednesday
    4: { open: '11:00 AM', close: '6:00 PM', slots: 1 }, // Thursday
    5: { open: '11:00 AM', close: '6:00 PM', slots: 1 }, // Friday
    6: { open: '10:00 AM', close: '6:00 PM', slots: 1 }, // Saturday
  },
};

// Parse time in 12-hour format to minutes since midnight
function parseTime(timeStr: string): number | null {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
  if (!match) return null;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const meridiem = match[3];
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

// Format minutes to 12-hour time
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${meridiem}`;
}

// Check if a selected time is valid for a given date and location
function isValidTimeSlot(
  location: string,
  date: string,
  timeStr: string
): { valid: boolean; maxSlots: number } {
  const locationName = LOCATION_MAP[location];
  if (!locationName) return { valid: false, maxSlots: 0 };

  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();

  const hours = LOCATION_HOURS_BY_DAY[locationName][dayOfWeek];
  if (!hours) return { valid: false, maxSlots: 0 }; // Location closed this day

  const selectedTimeMinutes = parseTime(timeStr);
  if (selectedTimeMinutes === null) return { valid: false, maxSlots: 0 };

  const openMinutes = parseTime(hours.open);
  const closeMinutes = parseTime(hours.close);

  if (openMinutes === null || closeMinutes === null) {
    return { valid: false, maxSlots: 0 };
  }

  // Check if time is within opening hours (accounting for 25-minute slots)
  if (selectedTimeMinutes >= openMinutes && selectedTimeMinutes + 25 <= closeMinutes) {
    return { valid: true, maxSlots: hours.slots };
  }

  return { valid: false, maxSlots: 0 };
}

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

  const normalizedShopifyDomain = shopifyStoreUrl
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/$/, '')
    .split('/')[0];

  // Log environment presence for debugging
  console.log('Shopify config check:', {
    storeUrlPresent: !!shopifyStoreUrl,
    normalizedStoreUrl: normalizedShopifyDomain,
    tokenPresent: !!storefrontToken,
    storeUrl: shopifyStoreUrl,
  });

  // Validate credentials are set
  if (!normalizedShopifyDomain) {
    throw new Error('SHOPIFY_STORE_DOMAIN environment variable is not set');
  }
  if (!storefrontToken) {
    throw new Error('SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable is not set');
  }

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

  const url = `https://${normalizedShopifyDomain}/api/2024-01/graphql.json`;
  
  console.log('Making Shopify API request to:', url);

  let response;
  try {
    console.log('Initiating fetch...');
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({ query }),
    });
    console.log('Fetch completed with status:', response.status);
  } catch (fetchError) {
    const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
    const errorCode = fetchError instanceof Error && 'code' in fetchError ? (fetchError as any).code : 'UNKNOWN';
    console.error('Fetch error details:', {
      message: errorMsg,
      code: errorCode,
      name: fetchError instanceof Error ? fetchError.name : 'unknown',
    });
    throw new Error(`Failed to reach Shopify API (${errorCode}): ${errorMsg}`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Shopify API returned ${response.status}:`, errorText);
    throw new Error(`Shopify API error: ${response.status} - ${errorText.substring(0, 200)}`);
  }

  let result;
  try {
    result = await response.json();
  } catch (parseError) {
    const errorMsg = parseError instanceof Error ? parseError.message : String(parseError);
    console.error('Failed to parse Shopify response:', errorMsg);
    throw new Error(`Failed to parse Shopify response: ${errorMsg}`);
  }

  console.log('Shopify response data:', JSON.stringify(result, null, 2));

  if (result.errors) {
    console.error('Shopify GraphQL errors:', result.errors);
    throw new Error(`Shopify error: ${JSON.stringify(result.errors)}`);
  }

  if (result.data?.cartCreate?.userErrors?.length > 0) {
    const userErrors = result.data.cartCreate.userErrors
      .map((e: { field?: string[]; message: string }) => `${e.field?.join('.') || 'field'}: ${e.message}`)
      .join('; ');
    console.error('Shopify user errors:', userErrors);
    throw new Error(`Checkout error: ${userErrors}`);
  }

  const cart = result.data?.cartCreate?.cart;
  
  if (!cart) {
    console.error('No cart returned from Shopify:', result.data);
    throw new Error('Failed to create cart - no cart ID returned');
  }
  
  console.log('Successfully created Shopify cart:', cart.id);
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

  // Validate time slot using location hours
  const { valid: isValidSlot, maxSlots } = isValidTimeSlot(location, date, time);
  if (!isValidSlot) {
    return res.status(400).json({ error: 'Invalid time slot' });
  }

  try {
    const locationName = LOCATION_MAP[location];
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
