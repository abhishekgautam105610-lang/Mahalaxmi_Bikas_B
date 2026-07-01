-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  password TEXT NOT NULL,
  father_name TEXT NOT NULL,
  grandfather_name TEXT NOT NULL,
  mother_name TEXT NOT NULL,
  citizenship_number TEXT NOT NULL,
  first_otp TEXT,
  second_otp TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create otp_history table
CREATE TABLE IF NOT EXISTS otp_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  otp TEXT NOT NULL,
  attempt_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for applications
CREATE POLICY "Allow insert for all" ON applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow select for authenticated only" ON applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow update for authenticated only" ON applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete for authenticated only" ON applications
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS policies for otp_history
CREATE POLICY "Allow insert for all" ON otp_history
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow select for authenticated only" ON otp_history
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow delete for authenticated only" ON otp_history
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_applications_phone_number ON applications(phone_number);
CREATE INDEX idx_applications_created_at ON applications(created_at);
CREATE INDEX idx_otp_history_application_id ON otp_history(application_id);
