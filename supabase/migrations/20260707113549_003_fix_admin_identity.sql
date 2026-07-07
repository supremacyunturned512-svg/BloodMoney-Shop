-- Fix identity record: sub must be the user's UUID
UPDATE auth.identities
SET identity_data = jsonb_build_object(
  'sub', user_id::text,
  'email', 'bloodmoneyrp6@gmail.com'
)
WHERE provider = 'email'
  AND user_id = (SELECT id FROM auth.users WHERE email = 'bloodmoneyrp6@gmail.com');