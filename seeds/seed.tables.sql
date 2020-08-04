BEGIN;

TRUNCATE
  users,
  tasks
  RESTART IDENTITY CASCADE;

INSERT INTO users (username, phone_number, password)
VALUES
  ('macadoo', '123-456-7890', '$2a$08$EoU88lsd7oe7Mz0Bo8ksJet8m2OOwwFtwFSuIOzihiLuuPqhNO4KC'), --Cableguy96
  ('byan', '234-543-4783', '$2a$08$iwCYjInck5vB7Sfy2BKDMeNtmFBODXpJ8i4ybYuvePpYDTea/CLLO'), --Shallowhal06
  ('shanders', '245-374-4732', '$2a$08$go6wyH9vdbShUZR8g5nZGuAUOxaJak24Q56pHMUmzKYuT41mFAReW'), --Norbit03
  ('haleyd', '245-237-2347', '$2a$08$uttsRTcuout1DIy1UluzEu2tQl8tbH3EudbcIjIU6XtS.b.gKBUcC'); --Diehard87

INSERT INTO tasks (user_id, name, start_time, category, duration, streak)
VALUES
  (1, '5am wake up!', '5:00am', 'Waking up', null, '20'),
  (1, 'Workout', '6:00am', 'Exercise', '1hr', '10'),
  (1, 'Meditate', '7:00am', 'Mindfulness', '20min', '30'),
  (1, 'Stick to diet plan', 'all day', 'Food', null, '0'),
  (1, 'No booze', 'all day', 'No booze', null, '0'),
  (1, 'Drink a gallon of water', 'all day', 'Hydration', null, '0'),
  (1, 'No screens', '12:00pm', 'No tech', '3hrs', '0'),
  (1, '8 hours of sleep', '9:00pm', 'sleep', null, '20');

COMMIT;