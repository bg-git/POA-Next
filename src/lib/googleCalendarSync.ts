import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface BookingEvent {
  bookingId: string;
  studioId: string;
  location: string;
  appointmentDate: string;
  appointmentTime: string;
  customerName: string;
  customerEmail?: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}

/**
 * Refresh Google Calendar access token if expired
 */
async function refreshGoogleToken(studioId: string): Promise<string | null> {
  try {
    const { data: studio } = await supabase
      .from('studios')
      .select('google_calendar_refresh_token, google_calendar_token_expiry')
      .eq('id', studioId)
      .single();

    if (!studio?.google_calendar_refresh_token) {
      console.error('No refresh token found for studio');
      return null;
    }

    const now = new Date();
    const tokenExpiry = studio.google_calendar_token_expiry 
      ? new Date(studio.google_calendar_token_expiry) 
      : new Date(0);

    // If token is still valid for 5+ minutes, use it
    if (tokenExpiry.getTime() - now.getTime() > 5 * 60 * 1000) {
      const { data: studioWithToken } = await supabase
        .from('studios')
        .select('google_calendar_access_token')
        .eq('id', studioId)
        .single();
      return studioWithToken?.google_calendar_access_token || null;
    }

    // Refresh the token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        refresh_token: studio.google_calendar_refresh_token,
        grant_type: 'refresh_token',
      }).toString(),
    });

    const tokens = await response.json();

    if (!tokens.access_token) {
      console.error('Failed to refresh Google token:', tokens);
      return null;
    }

    // Update studio with new token and expiry
    const expiryTime = new Date(Date.now() + (tokens.expires_in || 3600) * 1000);

    await supabase
      .from('studios')
      .update({
        google_calendar_access_token: tokens.access_token,
        google_calendar_token_expiry: expiryTime.toISOString(),
      })
      .eq('id', studioId);

    return tokens.access_token;
  } catch (error) {
    console.error('Error refreshing Google token:', error);
    return null;
  }
}

/**
 * Create or update a booking event in Google Calendar
 */
export async function syncBookingToCalendar(booking: BookingEvent): Promise<string | null> {
  try {
    const { data: studio } = await supabase
      .from('studios')
      .select('google_calendar_id')
      .eq('id', booking.studioId)
      .single();

    if (!studio?.google_calendar_id) {
      console.log(`No Google Calendar configured for studio: ${booking.studioId}`);
      return null;
    }

    const accessToken = await refreshGoogleToken(booking.studioId);
    if (!accessToken) {
      console.error(`Failed to get access token for studio: ${booking.studioId}`);
      return null;
    }

    // Parse appointment date and time
    const [year, month, day] = booking.appointmentDate.split('-');
    const [hours, minutes] = booking.appointmentTime.split(':');
    const startTime = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );

    // Appointment duration: 1 hour
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const eventBody = {
      summary: `Piercing: ${booking.customerName}`,
      description: `Booking ID: ${booking.bookingId}\nStatus: ${booking.status}`,
      location: booking.location,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'Europe/London', // Adjust as needed
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Europe/London',
      },
      attendees: booking.customerEmail
        ? [{ email: booking.customerEmail, responseStatus: 'tentativeResponse' }]
        : [],
      transparency: booking.status === 'cancelled' ? 'transparent' : 'opaque',
    };

    // Check if event already exists
    const { data: bookingRecord } = await supabase
      .from('bookings')
      .select('google_calendar_event_id')
      .eq('id', booking.bookingId)
      .single();

    let eventId: string | null = null;

    if (bookingRecord?.google_calendar_event_id) {
      // Update existing event
      const updateResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          studio.google_calendar_id
        )}/events/${encodeURIComponent(bookingRecord.google_calendar_event_id)}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventBody),
        }
      );

      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        console.error('Failed to update calendar event:', error);
        return null;
      }

      const event = await updateResponse.json();
      eventId = event.id;
      console.log(`Updated calendar event: ${eventId}`);
    } else {
      // Create new event
      const createResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          studio.google_calendar_id
        )}/events`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventBody),
        }
      );

      if (!createResponse.ok) {
        const error = await createResponse.json();
        console.error('Failed to create calendar event:', error);
        return null;
      }

      const event = await createResponse.json();
      eventId = event.id;
      console.log(`Created calendar event: ${eventId}`);
    }

    // Save event ID to booking record
    if (eventId) {
      await supabase
        .from('bookings')
        .update({ google_calendar_event_id: eventId })
        .eq('id', booking.bookingId);
    }

    return eventId;
  } catch (error) {
    console.error('Error syncing booking to calendar:', error);
    return null;
  }
}

/**
 * Remove a booking event from Google Calendar
 */
export async function removeBookingFromCalendar(bookingId: string): Promise<boolean> {
  try {
    const { data: booking } = await supabase
      .from('bookings')
      .select('studio_id, google_calendar_event_id')
      .eq('id', bookingId)
      .single();

    if (!booking?.google_calendar_event_id || !booking?.studio_id) {
      console.log('No calendar event to remove');
      return true;
    }

    const { data: studio } = await supabase
      .from('studios')
      .select('google_calendar_id')
      .eq('id', booking.studio_id)
      .single();

    if (!studio?.google_calendar_id) {
      console.log('No Google Calendar configured for studio');
      return true;
    }

    const accessToken = await refreshGoogleToken(booking.studio_id);
    if (!accessToken) {
      console.error('Failed to get access token for studio');
      return false;
    }

    const deleteResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        studio.google_calendar_id
      )}/events/${encodeURIComponent(booking.google_calendar_event_id)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!deleteResponse.ok && deleteResponse.status !== 404) {
      const error = await deleteResponse.json();
      console.error('Failed to delete calendar event:', error);
      return false;
    }

    console.log(`Deleted calendar event: ${booking.google_calendar_event_id}`);
    return true;
  } catch (error) {
    console.error('Error removing booking from calendar:', error);
    return false;
  }
}

/**
 * Mark a calendar event as completed
 */
export async function markBookingCompleted(bookingId: string): Promise<boolean> {
  try {
    const { data: booking } = await supabase
      .from('bookings')
      .select(
        'studio_id, google_calendar_event_id, appointment_date, appointment_time, customer_name, location'
      )
      .eq('id', bookingId)
      .single();

    if (!booking?.google_calendar_event_id) {
      return true;
    }

    // Update event with completed status
    return !!await syncBookingToCalendar({
      bookingId,
      studioId: booking.studio_id,
      location: booking.location,
      appointmentDate: booking.appointment_date,
      appointmentTime: booking.appointment_time,
      customerName: booking.customer_name,
      status: 'completed',
    });
  } catch (error) {
    console.error('Error marking booking completed:', error);
    return false;
  }
}
