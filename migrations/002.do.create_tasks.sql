CREATE TABLE tasks (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  start_time TEXT,
  duration TEXT,
  category TEXT,
  streak TEXT,
  start_date DATETIME DEFAULT now() NOT NULL,
  end_date DATETIME DEFAULT now() NOT NULL
)