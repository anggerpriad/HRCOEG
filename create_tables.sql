-- users
CREATE TABLE users (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  role text NOT NULL,
  university text,
  major text,
  gpa numeric(3,2),
  expected_graduation_year integer,
  linkedin text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- cv_uploads
CREATE TABLE cv_uploads (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  filename text,
  storage_url text,
  filesize_bytes integer,
  ats_score integer,
  keywords_matched text[],
  uploaded_at timestamptz DEFAULT now()
);

-- psych_tests
CREATE TABLE psych_tests (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  test_name text,
  version text,
  started_at timestamptz,
  completed_at timestamptz,
  raw_answers jsonb,
  scores jsonb,
  report_url text
);

-- bookings
CREATE TABLE bookings (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  service text,
  provider_id uuid,
  start_time timestamptz,
  end_time timestamptz,
  timezone text,
  status text,
  created_at timestamptz DEFAULT now()
);

-- event_logs
CREATE TABLE event_logs (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  event_type text,
  metadata jsonb,
  occurred_at timestamptz DEFAULT now()
);
