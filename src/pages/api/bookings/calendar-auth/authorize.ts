import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Generate Google OAuth authorization URL
 * POST /api/bookings/calendar-auth/authorize
 * 
 * Body:
 * {
 *   studioId: string (UUID)
 * }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { studioId } = req.body;

  if (!studioId) {
    return res.status(400).json({ error: 'Studio ID required' });
  }

  try {
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/bookings/calendar-auth/google-callback`;
    
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state: studioId, // Pass studio ID in state for verification
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

    return res.status(200).json({
      success: true,
      authUrl,
    });
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
