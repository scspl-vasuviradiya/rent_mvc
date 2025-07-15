using System.ComponentModel.DataAnnotations;

namespace ClothesRental.Models
{
    public class Booking
    {
        public int Id { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        [Required]
        public DateTime EndDate { get; set; }
        
        public DateTime? DeliveryDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public DateTime? WashingStartDate { get; set; }
        public DateTime? WashingEndDate { get; set; }
        
        [Required]
        [Range(0.01, 100000)]
        public decimal TotalPrice { get; set; }
        
        [Required]
        public BookingStatus Status { get; set; } = BookingStatus.Confirmed;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Customer Details
        [Required]
        [StringLength(200)]
        public string CustomerName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(200)]
        public string CustomerEmail { get; set; } = string.Empty;
        
        [Required]
        [Phone]
        [StringLength(20)]
        public string CustomerPhone { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string CustomerAddress { get; set; } = string.Empty;
        
        // Navigation properties
        public virtual Product Product { get; set; } = null!;
    }
    
    public enum BookingStatus
    {
        Confirmed,
        Delivered,
        Active,
        Returned,
        Washing,
        Completed,
        Cancelled
    }
}