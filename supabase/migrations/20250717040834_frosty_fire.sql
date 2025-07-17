-- ClothesRental Database Creation Script
-- Run this script in SQL Server Management Studio connected to localhost

-- Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ClothesRentalDB')
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
        Code nvarchar(20) NOT NULL UNIQUE,
        Name nvarchar(200) NOT NULL,
        Description nvarchar(1000),
        ImageUrl nvarchar(500) NOT NULL,
        PricePerDay decimal(10,2) NOT NULL,
        Category nvarchar(50) NOT NULL,
        Size nvarchar(10) NOT NULL,
        Color nvarchar(50) NOT NULL,
        Status nvarchar(20) NOT NULL DEFAULT 'Available',
        WashingDays int NOT NULL DEFAULT 2,
        CreatedAt datetime NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Create Bookings Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Bookings' AND xtype='U')
BEGIN
    CREATE TABLE Bookings (
        Id int IDENTITY(1,1) PRIMARY KEY,
        ProductId int NOT NULL,
        StartDate datetime NOT NULL,
        EndDate datetime NOT NULL,
        DeliveryDate datetime NULL,
        ReturnDate datetime NULL,
        WashingStartDate datetime NULL,
        WashingEndDate datetime NULL,
        TotalPrice decimal(10,2) NOT NULL,
        Status nvarchar(20) NOT NULL DEFAULT 'Confirmed',
        CreatedAt datetime NOT NULL DEFAULT GETDATE(),
        CustomerName nvarchar(200) NOT NULL,
        CustomerEmail nvarchar(200) NOT NULL,
        CustomerPhone nvarchar(20) NOT NULL,
        CustomerAddress nvarchar(500) NOT NULL,
        FOREIGN KEY (ProductId) REFERENCES Products(Id)
    );
END
GO

-- Insert Sample Products
IF NOT EXISTS (SELECT * FROM Products)
BEGIN
    INSERT INTO Products (Code, Name, Description, ImageUrl, PricePerDay, Category, Size, Color, Status, WashingDays) VALUES
    ('ED-001', 'Elegant Evening Dress', 'Stunning black evening dress perfect for formal events', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400', 45.00, 'Formal', 'M', 'Black', 'Available', 2),
    ('CD-002', 'Designer Cocktail Dress', 'Chic red cocktail dress for special occasions', 'https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=400', 35.00, 'Cocktail', 'S', 'Red', 'Available', 2),
    ('TX-003', 'Classic Tuxedo', 'Premium black tuxedo for formal events', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400', 60.00, 'Formal', 'L', 'Black', 'Available', 3),
    ('WD-004', 'Summer Wedding Dress', 'Light blue wedding guest dress', 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400', 40.00, 'Wedding', 'M', 'Blue', 'Available', 2),
    ('BS-005', 'Business Suit', 'Professional navy business suit', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400', 50.00, 'Business', 'L', 'Navy', 'Available', 3),
    ('BM-006', 'Bohemian Maxi Dress', 'Flowing bohemian dress perfect for outdoor events', 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400', 30.00, 'Casual', 'S', 'Floral', 'Available', 1);
END
GO

-- Create Indexes for Performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Products_Code')
    CREATE INDEX IX_Products_Code ON Products(Code);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Products_Category')
    CREATE INDEX IX_Products_Category ON Products(Category);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Products_Status')
    CREATE INDEX IX_Products_Status ON Products(Status);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Bookings_ProductId')
    CREATE INDEX IX_Bookings_ProductId ON Bookings(ProductId);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Bookings_Status')
    CREATE INDEX IX_Bookings_Status ON Bookings(Status);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Bookings_Dates')
    CREATE INDEX IX_Bookings_Dates ON Bookings(StartDate, EndDate);
GO

PRINT 'ClothesRental Database setup completed successfully!';