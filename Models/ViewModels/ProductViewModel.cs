using System.ComponentModel.DataAnnotations;

namespace ClothesRental.Models.ViewModels
{
    public class ProductViewModel
    {
        public int Id { get; set; }
        
        [Required]
        [Display(Name = "Product Code")]
        public string Code { get; set; } = string.Empty;
        
        [Required]
        [Display(Name = "Product Name")]
        public string Name { get; set; } = string.Empty;
        
        [Display(Name = "Description")]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [Display(Name = "Image URL")]
        public string ImageUrl { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, 10000)]
        [Display(Name = "Price per Day")]
        public decimal PricePerDay { get; set; }
        
        [Required]
        [Display(Name = "Category")]
        public string Category { get; set; } = string.Empty;
        
        [Required]
        [Display(Name = "Size")]
        public string Size { get; set; } = string.Empty;
        
        [Required]
        [Display(Name = "Color")]
        public string Color { get; set; } = string.Empty;
        
        [Display(Name = "Status")]
        public ProductStatus Status { get; set; }
        
        [Range(1, 30)]
        [Display(Name = "Washing Days")]
        public int WashingDays { get; set; } = 2;
        
        public string StatusText => Status.ToString();
        public string StatusColor => GetStatusColor();
        
        private string GetStatusColor()
        {
            return Status switch
            {
                ProductStatus.Available => "success",
                ProductStatus.Delivered => "info",
                ProductStatus.Reserved => "warning",
                ProductStatus.Washing => "secondary",
                _ => "secondary"
            };
        }
    }
    
    public class ProductListViewModel
    {
        public List<ProductViewModel> Products { get; set; } = new();
        public string SearchTerm { get; set; } = string.Empty;
        public string FilterCategory { get; set; } = "all";
        public string FilterStatus { get; set; } = "all";
        public List<string> Categories { get; set; } = new();
        public DateTime SelectedDate { get; set; } = DateTime.Today;
    }
}