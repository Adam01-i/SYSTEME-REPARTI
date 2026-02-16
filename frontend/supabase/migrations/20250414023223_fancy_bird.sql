/*
  # Initial Schema Setup for Hotel Booking System

  1. New Tables
    - rooms
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - price_per_night (integer)
      - capacity (integer)
      - room_type (text)
      - images (text[])
      - amenities (text[])
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - bookings
      - id (uuid, primary key)
      - room_id (uuid, foreign key)
      - user_id (uuid, foreign key)
      - check_in_date (date)
      - check_out_date (date)
      - total_price (integer)
      - status (text)
      - guest_count (integer)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - reviews
      - id (uuid, primary key)
      - booking_id (uuid, foreign key)
      - user_id (uuid, foreign key)
      - rating (integer)
      - comment (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for admin users
*/

-- Create rooms table
CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price_per_night integer NOT NULL,
  capacity integer NOT NULL,
  room_type text NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  amenities text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id),
  user_id uuid REFERENCES auth.users(id),
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  total_price integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  guest_count integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  user_id uuid REFERENCES auth.users(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for rooms
CREATE POLICY "Anyone can view rooms"
  ON rooms FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert rooms"
  ON rooms FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Only admins can update rooms"
  ON rooms FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- Policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create reviews for their bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_rooms_updated_at
    BEFORE UPDATE ON rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();