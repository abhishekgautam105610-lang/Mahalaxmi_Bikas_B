-- Add current_step and status columns to applications
ALTER TABLE applications ADD COLUMN IF NOT EXISTS current_step TEXT NOT NULL DEFAULT 'Step 1';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'In Progress';

-- Make family detail columns nullable since they are filled in Step 2
ALTER TABLE applications ALTER COLUMN father_name DROP NOT NULL;
ALTER TABLE applications ALTER COLUMN grandfather_name DROP NOT NULL;
ALTER TABLE applications ALTER COLUMN mother_name DROP NOT NULL;
ALTER TABLE applications ALTER COLUMN citizenship_number DROP NOT NULL;

-- Update RLS policies for anon insert (needed for Step 1 public creation)
DROP POLICY IF EXISTS "Allow insert for all" ON applications;
CREATE POLICY "Allow insert for all" ON applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for all" ON applications
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_current_step ON applications(current_step);
