/*
  # Clothes Rental Database Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `code` (text, unique) - Product code like ED-001, CD-002
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `image_url` (text) - Product image URL
      - `price_per_day` (decimal) - Daily rental price
      - `category` (text) - Product category
      - `size` (text) - Product size
      - `color` (text) - Product color
      - `status` (text) - Current status (available, delivered, reserved, washing)
      - `washing_days` (integer) - Days needed for washing
      - `created_at` (timestamp)

    - `bookings`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `start_date` (date) - Rental start date
      - `end_date` (date) - Rental end date
      - `delivery_date` (timestamp) - When delivered to customer
      - `return_date` (timestamp) - When returned by customer
      - `washing_start_date` (timestamp) - When washing started
      - `washing_end_date` (timestamp) - When washing completed
      - `total_price` (decimal) - Total booking price
      - `status` (text) - Booking status
      - `customer_name` (text) - Customer name
      - `customer_email` (text) - Customer email
      - `customer_phone` (text) - Customer phone
      - `customer_address` (text) - Customer address
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their data
    - Add policies for public read access to products
*/

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  price_per_day decimal(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL,
  size text DEFAULT 'M',
  color text DEFAULT 'Black',
  status text DEFAULT 'available' CHECK (status IN ('available', 'delivered', 'reserved', 'washing')),
  washing_days integer DEFAULT 2,
  created_at timestamptz DEFAULT now()
);

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  delivery_date timestamptz,
  return_date timestamptz,
  washing_start_date timestamptz,
  washing_end_date timestamptz,
  total_price decimal(10,2) NOT NULL DEFAULT 0,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'delivered', 'active', 'returned', 'washing', 'completed', 'cancelled')),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read access)
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Products can be managed by authenticated users"
  ON products
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for bookings (customers can manage their own bookings)
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Authenticated users can manage all bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (true);

-- Insert sample products
INSERT INTO products (code, name, description, image_url, price_per_day, category, size, color, status, washing_days) VALUES
('ED-001', 'Elegant Evening Dress', 'Stunning black evening dress perfect for formal events', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400', 45.00, 'Formal', 'M', 'Black', 'available', 2),
('CD-002', 'Designer Cocktail Dress', 'Chic red cocktail dress for special occasions', 'https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=400', 35.00, 'Cocktail', 'S', 'Red', 'available', 2),
('TX-003', 'Classic Tuxedo', 'Premium black tuxedo for formal events', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400', 60.00, 'Formal', 'L', 'Black', 'available', 3),
('WD-004', 'Summer Wedding Dress', 'Light blue wedding guest dress', 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400', 40.00, 'Wedding', 'M', 'Blue', 'washing', 2),
('BS-005', 'Business Suit', 'Professional navy business suit', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400', 50.00, 'Business', 'L', 'Navy', 'reserved', 3),
('BM-006', 'Bohemian Maxi Dress', 'Flowing bohemian dress perfect for outdoor events', 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400', 30.00, 'Casual', 'S', 'Floral', 'available', 1)
ON CONFLICT (code) DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (product_id, start_date, end_date, total_price, status, customer_name, customer_email, customer_phone, customer_address) VALUES
((SELECT id FROM products WHERE code = 'ED-001'), '2025-01-15', '2025-01-17', 135.00, 'confirmed', 'Sarah Johnson', 'sarah@example.com', '+1-555-0123', '123 Main St, New York, NY'),
((SELECT id FROM products WHERE code = 'CD-002'), '2025-01-20', '2025-01-22', 105.00, 'delivered', 'Emily Davis', 'emily@example.com', '+1-555-0456', '456 Oak Ave, Los Angeles, CA'),
((SELECT id FROM products WHERE code = 'TX-003'), '2025-01-25', '2025-01-27', 180.00, 'active', 'Michael Brown', 'michael@example.com', '+1-555-0789', '789 Pine St, Chicago, IL')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_bookings_product_id ON bookings(product_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);