import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { syncBookingToCalendar } from '@/lib/googleCalendarSync';

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

  const { 
    bookingId, 
    appointmentDate, 
    appointmentTime,
  } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'Booking ID required' });
  }

  try {
    // Get current booking details
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('studio_id, customer_name, customer_email, location, status, appointment_date, appointment_time')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Prepare updates
    const updates: Record<string, any> = {};
    if (appointmentDate) updates.appointment_date = appointmentDate;
    if (appointmentTime) updates.appointment_time = appointmentTime;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Update booking
    const { error: updateError } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return res.status(500).json({ error: 'Failed to update booking' });
    }

    // Sync updated booking to Google Calendar
    const newDate = appointmentDate || booking.appointment_date;
    const newTime = appointmentTime || booking.appointment_time;

    await syncBookingToCalendar({
      bookingId,
      studioId: booking.studio_id,
      location: booking.location,
      appointmentDate: newDate,
      appointmentTime: newTime,
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      status: booking.status,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Booking updated and calendar synced',
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
