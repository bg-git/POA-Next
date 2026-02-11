import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { syncBookingToCalendar } from '@/lib/googleCalendarSync';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface CreateBookingRequest {
  studioId: string;
  location: string;
  appointmentDate: string;
  appointmentTime: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerId?: string;
  slotsBooked?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const booking: CreateBookingRequest = req.body;

  if (!booking.studioId || !booking.appointmentDate || !booking.appointmentTime || !booking.customerName) {
    return res.status(400).json({ 
      error: 'Missing required fields: studioId, appointmentDate, appointmentTime, customerName' 
    });
  }

  try {
    // Verify studio exists
    const { data: studio, error: studioError } = await supabase
      .from('studios')
      .select('id')
      .eq('id', booking.studioId)
      .single();

    if (studioError || !studio) {
      return res.status(404).json({ error: 'Studio not found' });
    }

    // Create booking
    const { data: newBooking, error: createError } = await supabase
      .from('bookings')
      .insert({
        studio_id: booking.studioId,
        location: booking.location,
        appointment_date: booking.appointmentDate,
        appointment_time: booking.appointmentTime,
        customer_name: booking.customerName,
        customer_email: booking.customerEmail,
        customer_phone: booking.customerPhone,
        customer_id: booking.customerId,
        slots_booked: booking.slotsBooked || 1,
        status: 'confirmed',
      })
      .select()
      .single();

    if (createError || !newBooking) {
      console.error('Error creating booking:', createError);
      return res.status(500).json({ error: 'Failed to create booking' });
    }

    // Sync to Google Calendar
    await syncBookingToCalendar({
      bookingId: newBooking.id,
      studioId: booking.studioId,
      location: booking.location,
      appointmentDate: booking.appointmentDate,
      appointmentTime: booking.appointmentTime,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      status: 'confirmed',
    });

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      bookingId: newBooking.id,
      booking: newBooking,
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
