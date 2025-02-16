/*
  # Create experiences table

  1. New Tables
    - `experiences`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `long_description` (text)
      - `price` (decimal)
      - `images` (text array)
      - `category` (text)
      - `location` (jsonb)
      - `rating` (decimal)
      - `review_count` (integer)
      - `items` (jsonb)
      - `check_in_info` (jsonb)
      - `transportation` (jsonb)
      - `accessibility` (jsonb)
      - `additional_info` (jsonb)
      - `schedules` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `experiences` table
    - Add policies for:
      - Public read access
      - Admin write access
*/

CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  long_description text,
  price decimal(10,2) NOT NULL,
  images text[] NOT NULL,
  category text NOT NULL,
  location jsonb NOT NULL,
  rating decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  items jsonb DEFAULT '{}'::jsonb,
  check_in_info jsonb DEFAULT '{}'::jsonb,
  transportation jsonb DEFAULT '{}'::jsonb,
  accessibility jsonb DEFAULT '{}'::jsonb,
  additional_info jsonb DEFAULT '{}'::jsonb,
  schedules jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5)
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read experiences
CREATE POLICY "Anyone can read experiences"
  ON experiences
  FOR SELECT
  TO public
  USING (true);

-- Policy: Only admins can modify experiences
CREATE POLICY "Only admins can modify experiences"
  ON experiences
  USING (auth.uid() IN (
    SELECT auth_id FROM users WHERE preferences->>'role' = 'admin'
  ));

-- Trigger to update updated_at
CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();