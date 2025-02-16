/*
  # Configure Phone Authentication Settings

  1. Changes
    - Enables phone authentication provider
    - Configures SMS settings for OTP
    - Sets up verification message template
    - Configures OTP length and expiry time

  2. Security
    - Ensures secure phone authentication setup
    - Configures proper OTP parameters
    - Sets up user-friendly verification messages
*/

-- Create function to configure phone auth settings
CREATE OR REPLACE FUNCTION configure_phone_auth()
RETURNS void AS $$
BEGIN
  -- Enable phone auth provider
  PERFORM set_config('auth.phone.enabled', 'true', false);
  
  -- Configure SMS settings
  PERFORM set_config('auth.sms.enable_signup', 'true', false);
  PERFORM set_config('auth.sms.enable_otp', 'true', false);
  PERFORM set_config('auth.sms.template', 'Votre code de vérification Staycation est: {{ .Code }}. Il expire dans {{ .ExpiresIn }}.', false);
  PERFORM set_config('auth.sms.otp_length', '6', false);
  PERFORM set_config('auth.sms.otp_expiry', '300', false); -- 5 minutes
END;
$$ LANGUAGE plpgsql;

-- Execute the configuration function
SELECT configure_phone_auth();

-- Drop the function after use
DROP FUNCTION configure_phone_auth();