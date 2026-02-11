-- Create studios table to store calendar credentials
CREATE TABLE IF NOT EXISTS studios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  location text NOT NULL UNIQUE,
  google_calendar_id text,
  google_calendar_access_token text,
  google_calendar_refresh_token text,
  google_calendar_token_expiry timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add studio_id to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS studio_id uuid REFERENCES studios(id) ON DELETE RESTRICT;

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_bookings_studio_id ON bookings(studio_id);

-- Add calendar event tracking
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS google_calendar_event_id text;

CREATE INDEX IF NOT EXISTS idx_bookings_google_calendar_event_id ON bookings(google_calendar_event_id);

-- Create RLS policies
ALTER TABLE studios ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read studios (for booking form)
CREATE POLICY "Anyone can view studios" ON studios
  FOR SELECT
  USING (true);
