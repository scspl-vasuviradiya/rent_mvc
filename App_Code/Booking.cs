using System;

/// <summary>
/// Booking Entity Class
/// </summary>
public class Booking
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    public DateTime? WashingStartDate { get; set; }
    public DateTime? WashingEndDate { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Customer Details
    public string CustomerName { get; set; }
    public string CustomerEmail { get; set; }
    public string CustomerPhone { get; set; }
    public string CustomerAddress { get; set; }
    
    // Product Details (for display)
    public string ProductName { get; set; }
    public string ProductCode { get; set; }
    public string ProductImageUrl { get; set; }

    public int TotalDays
    {
        get
        {
            return (EndDate - StartDate).Days + 1;
        }
    }

    public string StatusColor
    {
        get
        {
            switch (Status.ToLower())
            {
                case "confirmed": return "primary";
                case "delivered": return "info";
                case "active": return "success";
                case "returned": return "warning";
                case "washing": return "secondary";
                case "completed": return "success";
                case "cancelled": return "danger";
                default: return "secondary";
            }
        }
    }
}