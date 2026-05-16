
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'family.test@carecircle.test') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      'family.test@carecircle.test',
      crypt('TestFamily123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"first_name":"Test","last_name":"Family","role":"family"}'::jsonb,
      now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      new_user_id,
      jsonb_build_object('sub', new_user_id::text, 'email', 'family.test@carecircle.test', 'email_verified', true),
      'email',
      new_user_id::text,
      now(), now(), now()
    );

    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = new_user_id) THEN
      INSERT INTO public.profiles (user_id, email, first_name, last_name, role, profile_completed)
      VALUES (new_user_id, 'family.test@carecircle.test', 'Test', 'Family', 'family', true);
    END IF;
  END IF;
END $$;
