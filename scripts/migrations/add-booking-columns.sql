-- Add missing columns to bookings table for Shopify integration
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS customer_id text,
ADD COLUMN IF NOT EXISTS shopify_draft_order_id text;

-- Create index for customer_id lookups
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
