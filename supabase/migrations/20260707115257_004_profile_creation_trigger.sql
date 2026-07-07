-- Trigger to auto-create a profile when a new auth user is created
-- Runs with SECURITY DEFINER so it bypasses RLS (service-role level)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER SECURITY DEFINER
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.profiles (id, username, ingame_name, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      'user_' || substr(replace(NEW.id::text, '-', ''), 1, 12)
    ),
    COALESCE(NEW.raw_user_meta_data->>'ingame_name', ''),
    0
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();