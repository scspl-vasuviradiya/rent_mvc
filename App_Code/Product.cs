using System;

/// <summary>
/// Product Entity Class
/// </summary>
public class Product
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public decimal PricePerDay { get; set; }
    public string Category { get; set; }
    public string Size { get; set; }
    public string Color { get; set; }
    public string Status { get; set; }
    public int WashingDays { get; set; }
    public DateTime CreatedAt { get; set; }

    public string StatusColor
    {
        get
        {
            switch (Status.ToLower())
            {
                case "available": return "success";
                case "delivered": return "info";
                case "reserved": return "warning";
                case "washing": return "secondary";
                default: return "secondary";
            }
        }
    }

    public string StatusText
    {
        get
        {
            return Status;
        }
    }
}