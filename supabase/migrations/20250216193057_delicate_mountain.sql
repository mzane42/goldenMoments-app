/*
  # Add Reservations System

  1. New Tables
    - `reservations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `experience_id` (uuid, references experiences)
      - `booking_reference` (text, unique)
      - `check_in_date` (timestamptz)
      - `check_out_date` (timestamptz)
      - `room_type` (text)
      - `guest_count` (integer)
      - `total_price` (decimal)
      - `status` (text)
      - `payment_status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `reservations` table
    - Add policies for authenticated users to:
      - Read their own reservations
      - Create new reservations
      - Update their own reservations
      - Delete their own reservations (soft delete)
*/

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  experience_id uuid REFERENCES experiences(id) ON DELETE CASCADE,
  booking_reference text UNIQUE NOT NULL,
  check_in_date timestamptz NOT NULL,
  check_out_date timestamptz NOT NULL,
  room_type text NOT NULL,
  guest_count integer NOT NULL DEFAULT 2,
  total_price decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  payment_status text NOT NULL DEFAULT 'paid',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (check_out_date > check_in_date),
  CONSTRAINT valid_guest_count CHECK (guest_count > 0),
  CONSTRAINT valid_total_price CHECK (total_price >= 0),
  CONSTRAINT valid_status CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed'))
);

-- Enable RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS reservations_user_id_idx ON reservations(user_id);
CREATE INDEX IF NOT EXISTS reservations_experience_id_idx ON reservations(experience_id);
CREATE INDEX IF NOT EXISTS reservations_booking_reference_idx ON reservations(booking_reference);
CREATE INDEX IF NOT EXISTS reservations_status_idx ON reservations(status);
CREATE INDEX IF NOT EXISTS reservations_check_in_date_idx ON reservations(check_in_date);

-- Add RLS policies
CREATE POLICY "Users can view their own reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text IN (
    SELECT auth_id FROM users WHERE id = user_id
  ));

CREATE POLICY "Users can create reservations"
  ON reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text IN (
    SELECT auth_id FROM users WHERE id = user_id
  ));

CREATE POLICY "Users can update their own reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text IN (
    SELECT auth_id FROM users WHERE id = user_id
  ))
  WITH CHECK (auth.uid()::text IN (
    SELECT auth_id FROM users WHERE id = user_id
  ));

CREATE POLICY "Users can delete their own reservations"
  ON reservations
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text IN (
    SELECT auth_id FROM users WHERE id = user_id
  ));

-- Create updated_at trigger
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();