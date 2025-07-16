using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

/// <summary>
/// Data Access Layer for Clothes Rental Application
/// </summary>
public class DataAccess
{
    private string connectionString = ConfigurationManager.ConnectionStrings["ClothesRentalConnectionString"].ConnectionString;

    #region Product Methods

    public List<Product> GetProducts(string searchTerm = "", string category = "", string status = "")
    {
        List<Product> products = new List<Product>();
        
        string query = @"SELECT Id, Code, Name, Description, ImageUrl, PricePerDay, Category, Size, Color, Status, WashingDays, CreatedAt 
                        FROM Products WHERE 1=1";
        
        List<SqlParameter> parameters = new List<SqlParameter>();
        
        if (!string.IsNullOrEmpty(searchTerm))
        {
            query += " AND (Name LIKE @SearchTerm OR Code LIKE @SearchTerm)";
            parameters.Add(new SqlParameter("@SearchTerm", "%" + searchTerm + "%"));
        }
        
        if (!string.IsNullOrEmpty(category) && category != "all")
        {
            query += " AND Category = @Category";
            parameters.Add(new SqlParameter("@Category", category));
        }
        
        if (!string.IsNullOrEmpty(status) && status != "all")
        {
            query += " AND Status = @Status";
            parameters.Add(new SqlParameter("@Status", status));
        }
        
        query += " ORDER BY Name";

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddRange(parameters.ToArray());
                conn.Open();
                
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        products.Add(new Product
                        {
                            Id = (int)reader["Id"],
                            Code = reader["Code"].ToString(),
                            Name = reader["Name"].ToString(),
                            Description = reader["Description"].ToString(),
                            ImageUrl = reader["ImageUrl"].ToString(),
                            PricePerDay = (decimal)reader["PricePerDay"],
                            Category = reader["Category"].ToString(),
                            Size = reader["Size"].ToString(),
                            Color = reader["Color"].ToString(),
                            Status = reader["Status"].ToString(),
                            WashingDays = (int)reader["WashingDays"],
                            CreatedAt = (DateTime)reader["CreatedAt"]
                        });
                    }
                }
            }
        }
        
        return products;
    }

    public Product GetProductById(int id)
    {
        string query = "SELECT * FROM Products WHERE Id = @Id";
        
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();
                
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new Product
                        {
                            Id = (int)reader["Id"],
                            Code = reader["Code"].ToString(),
                            Name = reader["Name"].ToString(),
                            Description = reader["Description"].ToString(),
                            ImageUrl = reader["ImageUrl"].ToString(),
                            PricePerDay = (decimal)reader["PricePerDay"],
                            Category = reader["Category"].ToString(),
                            Size = reader["Size"].ToString(),
                            Color = reader["Color"].ToString(),
                            Status = reader["Status"].ToString(),
                            WashingDays = (int)reader["WashingDays"],
                            CreatedAt = (DateTime)reader["CreatedAt"]
                        };
                    }
                }
            }
        }
        
        return null;
    }

    public List<string> GetCategories()
    {
        List<string> categories = new List<string>();
        string query = "SELECT DISTINCT Category FROM Products ORDER BY Category";
        
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        categories.Add(reader["Category"].ToString());
                    }
                }
            }
        }
        
        return categories;
    }

    public bool IsProductAvailable(int productId, DateTime startDate, DateTime endDate)
    {
        string query = @"SELECT COUNT(*) FROM Bookings 
                        WHERE ProductId = @ProductId 
                        AND Status NOT IN ('Cancelled', 'Completed')
                        AND (
                            (@StartDate BETWEEN StartDate AND DATEADD(day, (SELECT WashingDays FROM Products WHERE Id = @ProductId), EndDate))
                            OR (@EndDate BETWEEN StartDate AND DATEADD(day, (SELECT WashingDays FROM Products WHERE Id = @ProductId), EndDate))
                            OR (StartDate BETWEEN @StartDate AND @EndDate)
                        )";
        
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@ProductId", productId);
                cmd.Parameters.AddWithValue("@StartDate", startDate);
                cmd.Parameters.AddWithValue("@EndDate", endDate);
                conn.Open();
                
                int count = (int)cmd.ExecuteScalar();
                return count == 0;
            }
        }
    }

    #endregion

    #region Booking Methods

    public List<Booking> GetBookings(string status = "")
    {
        List<Booking> bookings = new List<Booking>();
        
        string query = @"SELECT b.*, p.Name as ProductName, p.Code as ProductCode, p.ImageUrl as ProductImageUrl 
                        FROM Bookings b 
                        INNER JOIN Products p ON b.ProductId = p.Id";
        
        if (!string.IsNullOrEmpty(status) && status != "all")
        {
            query += " WHERE b.Status = @Status";
        }
        
        query += " ORDER BY b.CreatedAt DESC";

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                if (!string.IsNullOrEmpty(status) && status != "all")
                {
                    cmd.Parameters.AddWithValue("@Status", status);
                }
                
                conn.Open();
                
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        bookings.Add(new Booking
                        {
                            Id = (int)reader["Id"],
                            ProductId = (int)reader["ProductId"],
                            StartDate = (DateTime)reader["StartDate"],
                            EndDate = (DateTime)reader["EndDate"],
                            TotalPrice = (decimal)reader["TotalPrice"],
                            Status = reader["Status"].ToString(),
                            CustomerName = reader["CustomerName"].ToString(),
                            CustomerEmail = reader["CustomerEmail"].ToString(),
                            CustomerPhone = reader["CustomerPhone"].ToString(),
                            CustomerAddress = reader["CustomerAddress"].ToString(),
                            CreatedAt = (DateTime)reader["CreatedAt"],
                            ProductName = reader["ProductName"].ToString(),
                            ProductCode = reader["ProductCode"].ToString(),
                            ProductImageUrl = reader["ProductImageUrl"].ToString()
                        });
                    }
                }
            }
        }
        
        return bookings;
    }

    public int CreateBooking(Booking booking)
    {
        string query = @"INSERT INTO Bookings (ProductId, StartDate, EndDate, TotalPrice, Status, CustomerName, CustomerEmail, CustomerPhone, CustomerAddress)
                        VALUES (@ProductId, @StartDate, @EndDate, @TotalPrice, @Status, @CustomerName, @CustomerEmail, @CustomerPhone, @CustomerAddress);
                        SELECT SCOPE_IDENTITY();";
        
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@ProductId", booking.ProductId);
                cmd.Parameters.AddWithValue("@StartDate", booking.StartDate);
                cmd.Parameters.AddWithValue("@EndDate", booking.EndDate);
                cmd.Parameters.AddWithValue("@TotalPrice", booking.TotalPrice);
                cmd.Parameters.AddWithValue("@Status", booking.Status);
                cmd.Parameters.AddWithValue("@CustomerName", booking.CustomerName);
                cmd.Parameters.AddWithValue("@CustomerEmail", booking.CustomerEmail);
                cmd.Parameters.AddWithValue("@CustomerPhone", booking.CustomerPhone);
                cmd.Parameters.AddWithValue("@CustomerAddress", booking.CustomerAddress);
                
                conn.Open();
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
        }
    }

    public decimal CalculateTotalPrice(int productId, DateTime startDate, DateTime endDate)
    {
        Product product = GetProductById(productId);
        if (product != null)
        {
            int totalDays = (endDate - startDate).Days + 1;
            return product.PricePerDay * totalDays;
        }
        return 0;
    }

    #endregion
}