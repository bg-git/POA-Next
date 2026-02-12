import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'Customer ID required' });
  }

  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_id', customerId)
      .neq('status', 'cancelled')
      .order('appointment_date', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }

    return res.status(200).json({ bookings: bookings || [] });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
