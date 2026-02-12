import type { NextApiRequest, NextApiResponse } from 'next';

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

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${meridiem}`;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { location, date } = req.query;

  if (!location || !date) {
    return res.status(400).json({
      error: 'Missing location and date query params',
      example: '?location=leicester&date=2026-02-15',
    });
  }

  const locationName = LOCATION_MAP[location as string];
  if (!locationName) {
    return res.status(400).json({ error: 'Invalid location' });
  }

  try {
    const dateObj = new Date(date as string);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid date format (use YYYY-MM-DD)' });
    }

    const dayOfWeek = dateObj.getDay();
    const hours = LOCATION_HOURS_BY_DAY[locationName][dayOfWeek];

    if (!hours) {
      return res.status(200).json({
        date,
        location: locationName,
        dayOfWeek,
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
        status: 'CLOSED',
        reason: `${locationName} is closed on ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]}s`,
      });
    }

    // Generate valid slots
    const openMinutes = parseTime(hours.open);
    const closeMinutes = parseTime(hours.close);

    if (openMinutes === null || closeMinutes === null) {
      return res.status(500).json({ error: 'Failed to parse hours' });
    }

    const validSlots: string[] = [];
    let currentMinutes = openMinutes;

    while (currentMinutes + 25 <= closeMinutes) {
      validSlots.push(formatTime(currentMinutes));
      currentMinutes += 25;
    }

    return res.status(200).json({
      date,
      location: locationName,
      dayOfWeek,
      dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
      status: 'OPEN',
      hours: {
        open: hours.open,
        close: hours.close,
        openMinutes,
        closeMinutes,
        maxSlots: hours.slots,
      },
      validSlots,
      totalSlots: validSlots.length,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
