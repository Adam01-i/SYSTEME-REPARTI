/*
  # Add admin role and update users table

  1. Changes
    - Add role column to auth.users
    - Add admin role check function
    - Update existing policies to use admin role
*/

-- Add role column to auth.users if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'auth' 
    AND table_name = 'users'
    AND column_name = 'role'
  ) THEN
    ALTER TABLE auth.users ADD COLUMN role text DEFAULT 'user';
  END IF;
END $$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update room policies to use admin check
CREATE POLICY "Admins can manage rooms"
  ON rooms
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Add admin policy for bookings
CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can manage bookings"
  ON bookings
  USING (public.is_admin())
  WITH CHECK (public.is_admin());