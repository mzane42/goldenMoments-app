/*
  # Fix user authentication and policies

  1. Changes
    - Drop all dependent policies
    - Create temporary column for auth_id
    - Copy data with proper type casting
    - Drop old column and rename new one
    - Recreate all policies with proper type casting
    - Add foreign key constraint with type casting

  2. Security
    - Maintain all existing security policies
    - Ensure no gap in policy coverage
    - Preserve data integrity during migration
*/

-- First drop all policies that depend on auth_id
DROP POLICY IF EXISTS "Only admins can modify experiences" ON experiences;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can read own wishlists" ON wishlists;
DROP POLICY IF EXISTS "Users can insert into own wishlists" ON wishlists;
DROP POLICY IF EXISTS "Users can delete from own wishlists" ON wishlists;

-- Drop the foreign key constraint if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_auth_id_fkey;

-- Create a new auth_id column with text type
ALTER TABLE users ADD COLUMN new_auth_id text;

-- Copy data with type casting
UPDATE users SET new_auth_id = auth_id::text;

-- Drop the old column and rename the new one
ALTER TABLE users DROP COLUMN auth_id;
ALTER TABLE users RENAME COLUMN new_auth_id TO auth_id;

-- Add NOT NULL constraint
ALTER TABLE users ALTER COLUMN auth_id SET NOT NULL;

-- Recreate all policies with proper type casting
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = auth_id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = auth_id)
  WITH CHECK (auth.uid()::text = auth_id);

CREATE POLICY "Only admins can modify experiences"
  ON experiences
  USING (auth.uid()::text IN (
    SELECT auth_id FROM users WHERE preferences->>'role' = 'admin'
  ));

CREATE POLICY "Users can read own wishlists"
  ON wishlists
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text IN (
    SELECT auth_id FROM users WHERE id = user_id
  ));

CREATE POLICY "Users can insert into own wishlists"
  ON wishlists
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text IN (
    SELECT auth_id FROM users WHERE id = user_id
  ));

CREATE POLICY "Users can delete from own wishlists"
  ON wishlists
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text IN (
    SELECT auth_id FROM users WHERE id = user_id
  ));

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, full_name)
  VALUES (
    new.id::text,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();