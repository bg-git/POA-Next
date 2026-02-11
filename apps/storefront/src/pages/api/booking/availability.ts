import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface TimeSlot {
  start_time: string;
  formatedTime: string;
  slots: number;
}

interface Availability {
  date: string;
  available: boolean;
  spots: TimeSlot[];
}

const LOCATION_MAP: Record<string, string> = {
  chesterfield: 'Chesterfield',
  leicester: 'Leicester',
};

const OPERATING_HOURS = [
  { time: '09:00 AM', slots: 2 },
  { time: '10:00 AM', slots: 2 },
  { time: '11:00 AM', slots: 2 },
  { time: '02:00 PM', slots: 2 },
  { time: '03:00 PM', slots: 2 },
  { time: '04:00 PM', slots: 1 },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { location } = req.query;

  if (!location || typeof location !== 'string') {
    return res.status(400).json({ error: 'Location parameter required' });
  }

  if (!LOCATION_MAP[location]) {
    return res.status(400).json({ error: 'Invalid location' });
  }

  try {
    const locationName = LOCATION_MAP[location];
    const availabilities: Availability[] = [];

    // Generate 30 days from today
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      // Skip Sundays
      if (date.getDay() === 0) continue;

      const dateStr = date.toISOString().split('T')[0];

      // Get booked slots for this date
      const { data: bookings, error: fetchError } = await supabase
        .from('bookings')
        .select('appointment_time, slots_booked')
        .eq('location', locationName)
        .eq('appointment_date', dateStr)
        .eq('status', 'confirmed');

      if (fetchError) throw fetchError;

      // Calculate available slots per time
      const bookedByTime: Record<string, number> = {};
      if (bookings) {
        bookings.forEach((booking) => {
          bookedByTime[booking.appointment_time] =
            (bookedByTime[booking.appointment_time] || 0) + (booking.slots_booked || 1);
        });
      }

      const spots: TimeSlot[] = OPERATING_HOURS.map((hour) => ({
        start_time: hour.time,
        formatedTime: hour.time,
        slots: hour.slots - (bookedByTime[hour.time] || 0),
      })).filter((slot) => slot.slots > 0);

      availabilities.push({
        date: dateStr,
        available: spots.length > 0,
        spots,
      });
    }

    return res.status(200).json({
      success: true,
      location: locationName,
      availabilities,
    });
  } catch (error) {
    console.error('Availability fetch error:', error);
    return res.status(500).json({
      error: 'Failed to fetch availability',
      details: error instanceof Error ? error.message : '',
    });
  }
}
