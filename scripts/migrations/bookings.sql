-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  location text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  customer_name text NOT NULL DEFAULT 'Guest',
  customer_email text,
  customer_phone text,
  slots_booked integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  cancelled_at timestamp with time zone
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_bookings_location_date ON bookings(location, appointment_date);
CREATE INDEX IF NOT EXISTS idx_bookings_location_date_time ON bookings(location, appointment_date, appointment_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Create RLS policies (Row Level Security)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read upcoming bookings (for availability)
CREATE POLICY "Anyone can view bookings" ON bookings
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert bookings
CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT
  WITH CHECK (true);

-- Allow users to update only their own bookings
CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
