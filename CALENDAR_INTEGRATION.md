# Google Calendar Integration Setup

This guide explains how to connect your studio bookings to Google Calendar so that bookings automatically appear, update, and sync with your calendar.

## Overview

The integration allows:
- ✅ Automatic creation of calendar events when bookings are made
- ✅ Automatic updates when bookings are rescheduled
- ✅ Automatic removal when bookings are cancelled
- ✅ Per-studio calendar management (each studio can have its own calendar)

## Architecture

### Database Schema Updates

Three new tables/columns have been added:

**1. Studios Table**
```sql
CREATE TABLE studios (
  id uuid PRIMARY KEY,
  name text NOT NULL UNIQUE,
  location text NOT NULL UNIQUE,
  google_calendar_id text,
  google_calendar_access_token text,
  google_calendar_refresh_token text,
  google_calendar_token_expiry timestamp
);
```

**2. Bookings Table Updates**
```sql
ALTER TABLE bookings
ADD COLUMN studio_id uuid REFERENCES studios(id),
ADD COLUMN google_calendar_event_id text;
```

### API Endpoints

#### 1. **Create Booking** (NEW)
```
POST /api/bookings/create

Body:
{
  "studioId": "uuid",
  "location": "Studio Name",
  "appointmentDate": "2026-02-15",
  "appointmentTime": "14:00",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+44...",
  "customerId": "shopify_customer_id",
  "slotsBooked": 1
}

Response:
{
  "success": true,
  "bookingId": "uuid",
  "booking": { ... }
}
```

When a booking is created:
- ✅ Event is immediately added to studio's Google Calendar
- ✅ `google_calendar_event_id` is saved to booking record

#### 2. **Reschedule Booking** (NEW)
```
POST /api/bookings/reschedule

Body:
{
  "bookingId": "uuid",
  "appointmentDate": "2026-02-16",
  "appointmentTime": "15:00"
}

Response:
{
  "success": true,
  "message": "Booking updated and calendar synced"
}
```

When a booking is rescheduled:
- ✅ Booking date/time is updated in database
- ✅ Google Calendar event is automatically updated with new date/time

#### 3. **Cancel Booking** (UPDATED)
```
POST /api/bookings/cancel

Body:
{
  "bookingId": "uuid"
}

Response:
{
  "success": true,
  "message": "Booking cancelled"
}
```

When a booking is cancelled:
- ✅ Status is set to "cancelled"
- ✅ Event is removed from Google Calendar

#### 4. **Authorize Studio with Google Calendar** (NEW)
```
POST /api/bookings/calendar-auth/authorize

Body:
{
  "studioId": "uuid"
}

Response:
{
  "success": true,
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

This returns a Google login URL that the studio manager should visit in their browser.

#### 5. **Google OAuth Callback** (NEW)
```
POST /api/bookings/calendar-auth/google-callback

Body:
{
  "studioId": "uuid",
  "code": "authorization_code_from_google"
}

Response:
{
  "success": true,
  "message": "Google Calendar connected successfully",
  "calendarId": "primary"
}
```

## Setup Instructions

### Step 1: Set Google OAuth Credentials

In your `.env.local` file, add:

```
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_URL=https://yourdomain.com
```

**How to get Google OAuth credentials:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google Calendar API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Select **Web application**
6. Add authorized redirect URI: `https://yourdomain.com/api/bookings/calendar-auth/google-callback`
7. Copy the Client ID and Client Secret

### Step 2: Create Studios in Database

Either using Supabase dashboard or via SQL:

```sql
INSERT INTO studios (name, location) VALUES 
  ('Main Studio', 'London'),
  ('Secondary Studio', 'Manchester');
```

### Step 3: Connect Studio Calendars

For each studio, a manager can:

1. Call the authorize endpoint to get the OAuth URL:
```javascript
const response = await fetch('/api/bookings/calendar-auth/authorize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ studioId: 'studio-uuid' })
});
const { authUrl } = await response.json();
```

2. Visit the `authUrl` to sign in with Google and grant calendar permissions

3. Google redirects back to the callback endpoint which stores the credentials

### Step 4: Test the Integration

Create a test booking:

```javascript
const response = await fetch('/api/bookings/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    studioId: 'your-studio-uuid',
    location: 'Studio Name',
    appointmentDate: '2026-02-15',
    appointmentTime: '14:00',
    customerName: 'Test Customer',
    customerEmail: 'test@example.com'
  })
});

const { bookingId } = await response.json();
```

Check Google Calendar — the event should appear!

## Token Management

Google OAuth tokens expire after ~1 hour. The system automatically:

1. Checks token expiry before each calendar operation
2. Uses refresh token to get a new access token if expired
3. Saves the new token back to the database

No action needed from you — it's automatic!

## Error Handling

Common issues and solutions:

### Google Calendar not syncing
- ✅ Check that studio has `google_calendar_id` set (verify in studios table)
- ✅ Verify Google OAuth credentials are in `.env.local`
- ✅ Check console logs for specific error messages

### Bookings created but calendar event not added
- ✅ Studio may not have calendar connected yet
- ✅ System doesn't fail if calendar sync fails — booking is created anyway
- ✅ You can manually retry by rescheduling the booking

### Token refresh errors
- ✅ User needs to re-authenticate (call authorize endpoint again)
- ✅ Check that redirect URI in Google Console matches your app's URL

## File Structure

```
src/
  lib/
    googleCalendarSync.ts          # Core sync logic
  pages/api/bookings/
    create.ts                      # Create booking + sync to calendar
    reschedule.ts                  # Update booking + update calendar
    cancel.ts                      # Cancel booking + remove from calendar
    calendar-auth/
      authorize.ts                 # Generate OAuth URL
      google-callback.ts           # Handle OAuth callback
scripts/migrations/
  studios-calendar.sql             # Database schema
```

## Testing Workflow

1. **Create booking** → Check Google Calendar (event should appear)
2. **Reschedule booking** → Check Google Calendar (event should move)
3. **Cancel booking** → Check Google Calendar (event should disappear)

That's it! Your studio bookings are now synced with Google Calendar.
