import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface RescheduleRequest {
  bookingId: string;
  location: string;
  date: string;
  time: string;
}

const LOCATION_MAP: Record<string, string> = {
  chesterfield: 'Chesterfield',
  leicester: 'Leicester',
};

const SLOT_LIMITS: Record<string, number> = {
  '09:00 AM': 2,
  '10:00 AM': 2,
  '11:00 AM': 2,
  '02:00 PM': 2,
  '03:00 PM': 2,
  '04:00 PM': 1,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bookingId, location, date, time }: RescheduleRequest = req.body;

  if (!bookingId || !location || !date || !time) {
    return res.status(400).json({
      error: 'Missing required fields: bookingId, location, date, time',
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

    // Verify booking exists and get current details
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify booking belongs to authenticated user (in production, verify via session)
    // and that it's confirmed (can't reschedule cancelled bookings)
    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot reschedule a cancelled booking' });
    }

    // Check if new slot is still available (excluding this booking)
    const { data: existingBookings, error: checkError } = await supabase
      .from('bookings')
      .select('slots_booked')
      .eq('location', locationName)
      .eq('appointment_date', date)
      .eq('appointment_time', time)
      .neq('id', bookingId) // Exclude current booking
      .eq('status', 'confirmed');

    if (checkError) throw checkError;

    const slotsBooked = existingBookings?.reduce((sum, b) => sum + (b.slots_booked || 1), 0) || 0;

    if (slotsBooked >= maxSlots) {
      return res.status(409).json({
        error: 'No slots available for this time',
      });
    }

    // Update booking with new date/time
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        appointment_date: date,
        appointment_time: time,
        location: locationName,
      })
      .eq('id', bookingId)
      .select();

    if (updateError) {
      console.error('Supabase update error:', updateError);
      throw updateError;
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      booking: updatedBooking?.[0],
    });
  } catch (error) {
    console.error('Reschedule error:', error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return res.status(500).json({
      error: 'Failed to reschedule appointment',
      details: errorMessage,
    });
  }
}
