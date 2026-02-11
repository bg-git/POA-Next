import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * OAuth callback from Google Calendar
 * POST /api/bookings/calendar-auth/google-callback
 * 
 * Body:
 * {
 *   studioId: string (UUID),
 *   code: string (from Google OAuth)
 * }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { studioId, code } = req.body;

  if (!studioId || !code) {
    return res.status(400).json({ error: 'Studio ID and authorization code required' });
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/bookings/calendar-auth/google-callback`,
      }).toString(),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      console.error('Failed to get access token:', tokens);
      return res.status(400).json({ error: 'Failed to authenticate with Google' });
    }

    // Get user's primary calendar ID
    const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const calendarInfo = await calendarResponse.json();

    if (!calendarInfo.id) {
      console.error('Failed to get calendar ID:', calendarInfo);
      return res.status(400).json({ error: 'Failed to get calendar information' });
    }

    // Calculate token expiry
    const expiryTime = new Date(Date.now() + (tokens.expires_in || 3600) * 1000);

    // Save tokens to studio record
    const { error: updateError } = await supabase
      .from('studios')
      .update({
        google_calendar_id: calendarInfo.id,
        google_calendar_access_token: tokens.access_token,
        google_calendar_refresh_token: tokens.refresh_token,
        google_calendar_token_expiry: expiryTime.toISOString(),
      })
      .eq('id', studioId);

    if (updateError) {
      console.error('Failed to save tokens:', updateError);
      return res.status(500).json({ error: 'Failed to save calendar configuration' });
    }

    return res.status(200).json({
      success: true,
      message: 'Google Calendar connected successfully',
      calendarId: calendarInfo.id,
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
