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

// Helper function to check if a time is at least 1 hour in advance from now
function isAtLeast1HourInAdvance(date: string, timeStr: string): boolean {
  const now = new Date();
  const bookingDateTime = new Date(date + 'T00:00:00');
  
  // Parse time string (e.g., "2:30 PM")
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
  if (!match) return false;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const meridiem = match[3];
  
  // Convert to 24-hour format
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  
  bookingDateTime.setHours(hours, minutes, 0, 0);
  
  // Calculate difference in milliseconds
  const differenceMs = bookingDateTime.getTime() - now.getTime();
  const differenceHours = differenceMs / (1000 * 60 * 60);
  
  return differenceHours >= 1;
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

  // Validate time slot using location hours
  const { valid: isValidSlot, maxSlots } = isValidTimeSlot(location, date, time);
  if (!isValidSlot) {
    return res.status(400).json({ error: 'Invalid time slot' });
  }

  // Validate booking is at least 1 hour in advance
  if (!isAtLeast1HourInAdvance(date, time)) {
    return res.status(400).json({ 
      error: 'Bookings must be at least 1 hour in advance' 
    });
  }

  try {
    const locationName = LOCATION_MAP[location];

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
