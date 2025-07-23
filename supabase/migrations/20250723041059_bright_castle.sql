-- ClothesRental Database Creation Script
-- This script creates the complete database structure for the Clothes Rental System

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ClothesRentalDB')
BEGIN
    CREATE DATABASE ClothesRentalDB;
END
GO

USE ClothesRentalDB;
GO

-- Create Products Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Products' AND xtype='U')
BEGIN
    CREATE TABLE Products (
        Id int IDENTITY(1,1) PRIMARY KEY,
        Code nvarchar(50) NOT NULL UNIQUE,
        Name nvarchar(200) NOT NULL,
        Description nvarchar(1000) NULL,
        ImageUrl nvarchar(500) NULL,
        PricePerDay decimal(10,2) NOT NULL DEFAULT 0,
        Category nvarchar(100) NOT NULL,
        Size nvarchar(10) NULL DEFAULT 'M',
        Color nvarchar(50) NULL DEFAULT 'Black',
        Status nvarchar(50) NULL DEFAULT 'Available',
        WashingDays int NULL DEFAULT 2,
        CreatedAt datetime2 NULL DEFAULT GETDATE(),
        CONSTRAINT CK_Products_Status CHECK (Status IN ('Available', 'Delivered', 'Reserved', 'Washing'))
    );
END
GO

-- Create Bookings Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Bookings' AND xtype='U')
BEGIN
    CREATE TABLE Bookings (
        Id int IDENTITY(1,1) PRIMARY KEY,
        ProductId int NULL,
        StartDate date NOT NULL,
        EndDate date NOT NULL,
        DeliveryDate datetime2 NULL,
        ReturnDate datetime2 NULL,
        WashingStartDate datetime2 NULL,
        WashingEndDate datetime2 NULL,
        TotalPrice decimal(10,2) NOT NULL DEFAULT 0,
        Status nvarchar(50) NULL DEFAULT 'Confirmed',
        CustomerName nvarchar(200) NOT NULL,
        CustomerEmail nvarchar(200) NOT NULL,
        CustomerPhone nvarchar(50) NOT NULL,
        CustomerAddress nvarchar(500) NOT NULL,
        CreatedAt datetime2 NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Bookings_Products FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
        CONSTRAINT CK_Bookings_Status CHECK (Status IN ('Confirmed', 'Delivered', 'Active', 'Returned', 'Washing', 'Completed', 'Cancelled'))
    );
END
GO

-- Create Indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Products_Category')
    CREATE INDEX IX_Products_Category ON Products(Category);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Products_Status')
    CREATE INDEX IX_Products_Status ON Products(Status);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Bookings_ProductId')
    CREATE INDEX IX_Bookings_ProductId ON Bookings(ProductId);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Bookings_CustomerEmail')
    CREATE INDEX IX_Bookings_CustomerEmail ON Bookings(CustomerEmail);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Bookings_Dates')
    CREATE INDEX IX_Bookings_Dates ON Bookings(StartDate, EndDate);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Bookings_Status')
    CREATE INDEX IX_Bookings_Status ON Bookings(Status);
GO

-- Insert Sample Products
IF NOT EXISTS (SELECT * FROM Products)
BEGIN
    INSERT INTO Products (Code, Name, Description, ImageUrl, PricePerDay, Category, Size, Color, Status, WashingDays) VALUES
    ('ED-001', 'Elegant Evening Dress', 'Stunning black evening dress perfect for formal events', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400', 45.00, 'Formal', 'M', 'Black', 'Available', 2),
    ('CD-002', 'Designer Cocktail Dress', 'Chic red cocktail dress for special occasions', 'https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=400', 35.00, 'Cocktail', 'S', 'Red', 'Available', 2),
    ('TX-003', 'Classic Tuxedo', 'Premium black tuxedo for formal events', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400', 60.00, 'Formal', 'L', 'Black', 'Available', 3),
    ('WD-004', 'Summer Wedding Dress', 'Light blue wedding guest dress', 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400', 40.00, 'Wedding', 'M', 'Blue', 'Washing', 2),
    ('BS-005', 'Business Suit', 'Professional navy business suit', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400', 50.00, 'Business', 'L', 'Navy', 'Reserved', 3),
    ('BM-006', 'Bohemian Maxi Dress', 'Flowing bohemian dress perfect for outdoor events', 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400', 30.00, 'Casual', 'S', 'Floral', 'Available', 1);
END
GO

-- Insert Sample Bookings
IF NOT EXISTS (SELECT * FROM Bookings)
BEGIN
    INSERT INTO Bookings (ProductId, StartDate, EndDate, TotalPrice, Status, CustomerName, CustomerEmail, CustomerPhone, CustomerAddress) VALUES
    (1, '2024-02-15', '2024-02-17', 135.00, 'Confirmed', 'Sarah Johnson', 'sarah@example.com', '+1-555-0123', '123 Main St, New York, NY'),
    (2, '2024-02-20', '2024-02-22', 105.00, 'Delivered', 'Emily Davis', 'emily@example.com', '+1-555-0456', '456 Oak Ave, Los Angeles, CA'),
    (3, '2024-02-25', '2024-02-27', 180.00, 'Active', 'Michael Brown', 'michael@example.com', '+1-555-0789', '789 Pine St, Chicago, IL'),
    (4, '2024-01-10', '2024-01-12', 120.00, 'Completed', 'Jessica Wilson', 'jessica@example.com', '+1-555-0321', '321 Elm St, Houston, TX'),
    (5, '2024-01-20', '2024-01-23', 150.00, 'Completed', 'David Miller', 'david@example.com', '+1-555-0654', '654 Maple Ave, Phoenix, AZ');
END
GO

PRINT 'ClothesRental Database created successfully with sample data!';