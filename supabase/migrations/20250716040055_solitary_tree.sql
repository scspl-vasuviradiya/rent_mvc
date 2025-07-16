-- Create Database
CREATE DATABASE ClothesRental;
GO

USE ClothesRental;
GO

-- Create Products Table
CREATE TABLE Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(20) NOT NULL UNIQUE,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    ImageUrl NVARCHAR(500) NOT NULL,
    PricePerDay DECIMAL(10,2) NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    Size NVARCHAR(10) NOT NULL,
    Color NVARCHAR(50) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Available',
    WashingDays INT NOT NULL DEFAULT 2,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);

-- Create Bookings Table
CREATE TABLE Bookings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    DeliveryDate DATETIME NULL,
    ReturnDate DATETIME NULL,
    WashingStartDate DATETIME NULL,
    WashingEndDate DATETIME NULL,
    TotalPrice DECIMAL(10,2) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Confirmed',
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CustomerName NVARCHAR(200) NOT NULL,
    CustomerEmail NVARCHAR(200) NOT NULL,
    CustomerPhone NVARCHAR(20) NOT NULL,
    CustomerAddress NVARCHAR(500) NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

-- Insert Sample Products
INSERT INTO Products (Code, Name, Description, ImageUrl, PricePerDay, Category, Size, Color, Status, WashingDays) VALUES
('ED-001', 'Elegant Evening Dress', 'Stunning black evening dress perfect for formal events', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400', 45.00, 'Formal', 'M', 'Black', 'Available', 2),
('CD-002', 'Designer Cocktail Dress', 'Chic red cocktail dress for special occasions', 'https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=400', 35.00, 'Cocktail', 'S', 'Red', 'Available', 2),
('TX-003', 'Classic Tuxedo', 'Premium black tuxedo for formal events', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400', 60.00, 'Formal', 'L', 'Black', 'Available', 3),
('WD-004', 'Summer Wedding Dress', 'Light blue wedding guest dress', 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400', 40.00, 'Wedding', 'M', 'Blue', 'Available', 2),
('BS-005', 'Business Suit', 'Professional navy business suit', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400', 50.00, 'Business', 'L', 'Navy', 'Available', 3),
('BM-006', 'Bohemian Maxi Dress', 'Flowing bohemian dress perfect for outdoor events', 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400', 30.00, 'Casual', 'S', 'Floral', 'Available', 1);

-- Insert Sample Bookings
INSERT INTO Bookings (ProductId, StartDate, EndDate, TotalPrice, Status, CustomerName, CustomerEmail, CustomerPhone, CustomerAddress) VALUES
(1, '2025-01-15', '2025-01-17', 135.00, 'Confirmed', 'Sarah Johnson', 'sarah@example.com', '+1-555-0123', '123 Main St, New York, NY'),
(2, '2025-01-20', '2025-01-22', 105.00, 'Delivered', 'Emily Davis', 'emily@example.com', '+1-555-0456', '456 Oak Ave, Los Angeles, CA'),
(3, '2025-01-25', '2025-01-27', 180.00, 'Active', 'Michael Brown', 'michael@example.com', '+1-555-0789', '789 Pine St, Chicago, IL');