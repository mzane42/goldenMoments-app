/*
  # Add wishlists table

  1. New Tables
    - `wishlists`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `experience_id` (uuid, references experiences)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `wishlists` table
    - Add policies for authenticated users to manage their wishlists
*/

CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  experience_id uuid REFERENCES experiences(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, experience_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own wishlists
CREATE POLICY "Users can read own wishlists"
  ON wishlists
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT auth_id FROM users WHERE id = user_id
  ));

-- Policy: Users can insert into their own wishlists
CREATE POLICY "Users can insert into own wishlists"
  ON wishlists
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT auth_id FROM users WHERE id = user_id
  ));

-- Policy: Users can delete from their own wishlists
CREATE POLICY "Users can delete from own wishlists"
  ON wishlists
  FOR DELETE
  TO authenticated
  USING (auth.uid() IN (
    SELECT auth_id FROM users WHERE id = user_id
  ));