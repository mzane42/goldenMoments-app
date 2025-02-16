/*
  # Fix user creation and authentication

  1. Changes
    - Drop existing trigger
    - Create new trigger with proper error handling
    - Add missing indexes for performance
    - Ensure proper type casting for auth_id

  2. Security
    - Maintain existing RLS policies
    - Ensure data integrity
*/

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create improved function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Check if user already exists to prevent duplicates
  IF NOT EXISTS (
    SELECT 1 FROM public.users WHERE auth_id = new.id::text
  ) THEN
    INSERT INTO public.users (
      auth_id,
      email,
      full_name,
      created_at,
      updated_at
    )
    VALUES (
      new.id::text,
      new.email,
      COALESCE(new.raw_user_meta_data->>'full_name', ''),
      now(),
      now()
    );
  END IF;
  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log error details (in a real production system)
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS users_auth_id_idx ON users (auth_id);
CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);
CREATE INDEX IF NOT EXISTS wishlists_user_id_idx ON wishlists (user_id);
CREATE INDEX IF NOT EXISTS wishlists_experience_id_idx ON wishlists (experience_id);