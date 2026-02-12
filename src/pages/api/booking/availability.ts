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

// Days of week that each location is closed (0=Sunday, 1=Monday, etc.)
const CLOSED_DAYS_OF_WEEK: Record<string, number[]> = {
  Chesterfield: [0, 1], // Closed on Sunday (0) and Monday (1)
  Leicester: [], // Open 7 days a week
};

// Helper function to generate 25-minute appointment slots
function generateTimeSlots(openTime: string, closeTime: string, numSlots: number): Array<{ time: string; slots: number }> {
  const slots: Array<{ time: string; slots: number }> = [];
  
  // Parse open and close times
  const parseTime = (timeStr: string): { hours: number; minutes: number } => {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
    if (!match) return { hours: 0, minutes: 0 };
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const meridiem = match[3];
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  };
  
  // Format time to 12-hour format
  const formatTime = (hours: number, minutes: number): string => {
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${meridiem}`;
  };
  
  const open = parseTime(openTime);
  const close = parseTime(closeTime);
  
  let currentMinutes = open.hours * 60 + open.minutes;
  const closeMinutes = close.hours * 60 + close.minutes;
  
  while (currentMinutes < closeMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    slots.push({
      time: formatTime(hours, minutes),
      slots: numSlots
    });
    currentMinutes += 25;
  }
  
  return slots;
}

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

// Specific dates when location is closed (holidays, etc.)
// These override the regular closed days of week
const CLOSED_DATES: Record<string, string[]> = {
  Chesterfield: [
    '2026-12-25', // Christmas
    '2026-12-26', // Boxing Day
  ],
  Leicester: [
    '2026-12-25', // Christmas
    '2026-12-26', // Boxing Day
  ],
};

// Special hours for specific dates (overrides default)
// Format: 'YYYY-MM-DD' -> array of { time, slots }
const SPECIAL_HOURS: Record<string, Record<string, Array<{ time: string; slots: number }>>> = {
  Chesterfield: {
    '2026-02-13': [ // Valentine's Eve - extended hours
      { time: '09:00 AM', slots: 3 },
      { time: '10:00 AM', slots: 3 },
      { time: '11:00 AM', slots: 3 },
      { time: '02:00 PM', slots: 3 },
      { time: '03:00 PM', slots: 3 },
      { time: '04:00 PM', slots: 2 },
      { time: '05:00 PM', slots: 1 },
    ],
  },
  Leicester: {
    // Add any special hours for Leicester here
  },
};

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

      const dayOfWeek = date.getDay();
      const dateStr = date.toISOString().split('T')[0];

      // Check if location is closed on this day of week
      const closedDaysOfWeek = CLOSED_DAYS_OF_WEEK[locationName] || [];
      if (closedDaysOfWeek.includes(dayOfWeek)) {
        continue; // Location is closed on this day of week
      }

      // Skip specific closed dates
      const closedDates = CLOSED_DATES[locationName] || [];
      if (closedDates.includes(dateStr)) {
        continue; // Location is closed on this specific date
      }

      // Determine which hours to use (special, day-of-week, or default)
      let hoursForDate: Array<{ time: string; slots: number }> = [];
      
      // Check for special hours first
      if (SPECIAL_HOURS[locationName]?.[dateStr]) {
        hoursForDate = SPECIAL_HOURS[locationName][dateStr];
      } else {
        // Use day-of-week hours
        const dayConfig = LOCATION_HOURS_BY_DAY[locationName]?.[dayOfWeek];
        if (dayConfig) {
          hoursForDate = generateTimeSlots(dayConfig.open, dayConfig.close, dayConfig.slots);
        }
      }

      if (hoursForDate.length === 0) continue; // Skip if no hours defined for this day

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

      const spots: TimeSlot[] = hoursForDate.map((hour) => ({
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
