# Booking System Setup Guide

## Overview
The booking system is now connected to Supabase and ready to use. Follow these steps to finalize the setup:

## Step 1: Create the Bookings Table in Supabase

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project (boamvyltgmhfkgddzkdn)
3. Navigate to SQL Editor
4. Create a new query and copy-paste the contents of `/scripts/migrations/bookings.sql`
5. Click "Run" to execute the SQL

This will create:
- `bookings` table with all necessary columns
- Indexes for efficient queries
- Row-level security policies

## Step 2: Test the Booking Flow

1. Start the dev server: `yarn dev`
2. Navigate to `http://localhost:3000/book-a-piercing/chesterfield`
3. Try booking an appointment:
   - Select a date (any day Mon-Sat)
   - Select a time
   - Accept terms & conditions
   - Click "Confirm My Booking"

## API Endpoints

### Get Availability
```bash
GET /api/booking/availability?location=chesterfield
```

Response:
```json
{
  "success": true,
  "location": "Chesterfield",
  "availabilities": [
    {
      "date": "2026-02-11",
      "available": true,
      "spots": [
        {
          "start_time": "09:00 AM",
          "formatedTime": "9:00 AM",
          "slots": 2
        }
      ]
    }
  ]
}
```

### Confirm Booking
```bash
POST /api/booking/confirm
Content-Type: application/json

{
  "location": "chesterfield",
  "date": "2026-02-11",
  "time": "09:00 AM",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+44...
}
```

Response:
```json
{
  "success": true,
  "message": "Booking confirmed",
  "booking": {
    "id": "uuid...",
    "location": "Chesterfield",
    "appointment_date": "2026-02-11",
    "appointment_time": "09:00 AM",
    "status": "confirmed"
  }
}
```

## Available Locations

- `chesterfield` → Chesterfield location
- `leicester` → Leicester location

## Operating Hours

- 09:00 AM - 2 slots
- 10:00 AM - 2 slots
- 11:00 AM - 2 slots
- 02:00 PM - 2 slots
- 03:00 PM - 2 slots
- 04:00 PM - 1 slot

## Features

✅ Real-time availability from Supabase
✅ Automatic slot management (slots decrease as bookings increase)
✅ Sundays excluded automatically
✅ Past dates disabled
✅ Location-based appointments
✅ Fallback to mock data if API fails
✅ SSR-safe implementation using Next.js `useEffect`

## Next Steps

1. Add customer authentication (optional)
2. Add email confirmations via Resend
3. Add admin panel for managing availability
4. Integrate with Shopify for product booking (e.g., piercing appointment packages)
5. Add payment processing (Stripe) for premium appointments
