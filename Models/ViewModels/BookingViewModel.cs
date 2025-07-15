using System.ComponentModel.DataAnnotations;

namespace ClothesRental.Models.ViewModels
{
    public class BookingViewModel
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        
        [Required]
        [Display(Name = "Start Date")]
        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }
        
        [Required]
        [Display(Name = "End Date")]
        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }
        
        [Required]
        [Display(Name = "Full Name")]
        public string CustomerName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [Display(Name = "Email Address")]
        public string CustomerEmail { get; set; } = string.Empty;
        
        [Required]
        [Phone]
        [Display(Name = "Phone Number")]
        public string CustomerPhone { get; set; } = string.Empty;
        
        [Required]
        [Display(Name = "Address")]
        public string CustomerAddress { get; set; } = string.Empty;
        
        public decimal TotalPrice { get; set; }
        public BookingStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Product details for display
        public string ProductName { get; set; } = string.Empty;
        public string ProductCode { get; set; } = string.Empty;
        public string ProductImageUrl { get; set; } = string.Empty;
        public decimal PricePerDay { get; set; }
        
        public int TotalDays => (EndDate - StartDate).Days + 1;
        public string StatusText => Status.ToString();
        public string StatusColor => GetStatusColor();
        
        private string GetStatusColor()
        {
            return Status switch
            {
                BookingStatus.Confirmed => "primary",
                BookingStatus.Delivered => "info",
                BookingStatus.Active => "success",
                BookingStatus.Returned => "warning",
                BookingStatus.Washing => "secondary",
                BookingStatus.Completed => "success",
                BookingStatus.Cancelled => "danger",
                _ => "secondary"
            };
        }
    }
    
    public class BookingListViewModel
    {
        public List<BookingViewModel> Bookings { get; set; } = new();
        public string FilterStatus { get; set; } = "all";
        public DateTime? FilterStartDate { get; set; }
        public DateTime? FilterEndDate { get; set; }
    }
}