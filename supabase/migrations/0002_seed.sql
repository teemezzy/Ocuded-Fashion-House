-- O_Cubed — seed defaults. Safe to re-run (upserts).

insert into admin_settings (id, consultation_price, slot_duration, buffer_time,
  booking_window_days, business_name, business_email, business_phone,
  studio_address, timezone)
values (1, 50000, 60, 15, 60, 'O_Cubed Fashion House', 'hello@ocubed.com',
  '+234 800 000 0000', '12 Kingsway Road, Ikoyi, Lagos, Nigeria', 'Africa/Lagos')
on conflict (id) do nothing;

insert into weekly_schedule (day, weekday, active, start_time, end_time) values
  ('Sunday',    0, false, '10:00', '14:00'),
  ('Monday',    1, true,  '10:00', '16:00'),
  ('Tuesday',   2, true,  '10:00', '16:00'),
  ('Wednesday', 3, true,  '10:00', '16:00'),
  ('Thursday',  4, true,  '10:00', '16:00'),
  ('Friday',    5, true,  '10:00', '16:00'),
  ('Saturday',  6, false, '10:00', '14:00')
on conflict (day) do nothing;

-- IMPORTANT: add your own login email here (and any team members) so you can
-- access the /admin panel after signing in with Google.
insert into allowed_admins (email) values
  ('marveltoms2014@gmail.com')
on conflict (email) do nothing;
