@@ .. @@
+-- Create Database
+USE master;
+GO
+
+IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ClothesRentalDB')
+BEGIN
+    CREATE DATABASE ClothesRentalDB;
+END
+GO
+
+USE ClothesRentalDB;
+GO
+
 -- Create Products Table
 CREATE TABLE Products (