-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  note TEXT,
  image_name TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  check_out_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE attendance ADD COLUMN IF NOT EXISTS image_name TEXT;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS check_out_time TIMESTAMP WITH TIME ZONE;

-- Fix existing foreign key constraints to support CASCADE ON DELETE
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_user_id_users_id_fk;
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_user_id_fkey;
ALTER TABLE attendance ADD CONSTRAINT attendance_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

