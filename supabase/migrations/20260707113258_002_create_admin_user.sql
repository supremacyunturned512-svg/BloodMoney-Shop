-- Create admin user with specified credentials
-- First delete any existing admin user
DELETE FROM auth.users WHERE email = 'bloodmoneyrp6@gmail.com';

-- Create the new admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'bloodmoneyrp6@gmail.com',
  crypt('Snow_fox1615', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"username":"bmrp_admin"}'
) RETURNING id;

-- Create identity for the user
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT 
  'bloodmoneyrp6@gmail.com',
  id,
  '{"sub":"bloodmoneyrp6@gmail.com","email":"bloodmoneyrp6@gmail.com"}',
  'email',
  now(),
  now(),
  now()
FROM auth.users WHERE email = 'bloodmoneyrp6@gmail.com';

-- Create profile with Co-Owner role
INSERT INTO profiles (id, username, ingame_name, role)
SELECT id, 'bmrp_admin', 'BMRP Admin', 9
FROM auth.users WHERE email = 'bloodmoneyrp6@gmail.com';