/*
  # Add new fields to experiences table

  1. Changes
    - Add date_start (timestamp)
    - Add date_end (timestamp)
    - Add company (text)
    - Add image_url (text)

  Note: Some fields like title, description, created_at, updated_at already exist
*/

DO $$ 
BEGIN
  -- Add date_start if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'experiences' AND column_name = 'date_start'
  ) THEN
    ALTER TABLE experiences ADD COLUMN date_start timestamptz;
  END IF;

  -- Add date_end if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'experiences' AND column_name = 'date_end'
  ) THEN
    ALTER TABLE experiences ADD COLUMN date_end timestamptz;
  END IF;

  -- Add company if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'experiences' AND column_name = 'company'
  ) THEN
    ALTER TABLE experiences ADD COLUMN company text;
  END IF;

  -- Add image_url if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'experiences' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE experiences ADD COLUMN image_url text;
  END IF;
END $$;