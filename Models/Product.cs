using System.ComponentModel.DataAnnotations;

namespace ClothesRental.Models
{
    public class Product
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Code { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, 10000)]
        public decimal PricePerDay { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;
        
        [Required]
        [StringLength(10)]
        public string Size { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Color { get; set; } = string.Empty;
        
        [Required]
        public ProductStatus Status { get; set; } = ProductStatus.Available;
        
        [Range(1, 30)]
        public int WashingDays { get; set; } = 2;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
    
    public enum ProductStatus
    {
        Available,
        Delivered,
        Reserved,
        Washing
    }
}