using Microsoft.EntityFrameworkCore;
using ClothesRental.Data;
using ClothesRental.Models;
using ClothesRental.Models.ViewModels;
using ClothesRental.Services;

namespace ClothesRental.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;
        
        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task<ProductListViewModel> GetProductsAsync(string searchTerm = "", string filterCategory = "all", string filterStatus = "all", DateTime? selectedDate = null)
        {
            var query = _context.Products.AsQueryable();
            
            // Apply search filter
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(p => p.Name.Contains(searchTerm) || p.Code.Contains(searchTerm));
            }
            
            // Apply category filter
            if (filterCategory != "all")
            {
                query = query.Where(p => p.Category == filterCategory);
            }
            
            // Apply status filter
            if (filterStatus != "all" && Enum.TryParse<ProductStatus>(filterStatus, true, out var status))
            {
                query = query.Where(p => p.Status == status);
            }
            
            var products = await query.OrderBy(p => p.Name).ToListAsync();
            var categories = await GetCategoriesAsync();
            
            var viewModel = new ProductListViewModel
            {
                Products = products.Select(p => new ProductViewModel
                {
                    Id = p.Id,
                    Code = p.Code,
                    Name = p.Name,
                    Description = p.Description,
                    ImageUrl = p.ImageUrl,
                    PricePerDay = p.PricePerDay,
                    Category = p.Category,
                    Size = p.Size,
                    Color = p.Color,
                    Status = p.Status,
                    WashingDays = p.WashingDays
                }).ToList(),
                SearchTerm = searchTerm,
                FilterCategory = filterCategory,
                FilterStatus = filterStatus,
                Categories = categories,
                SelectedDate = selectedDate ?? DateTime.Today
            };
            
            return viewModel;
        }
        
        public async Task<ProductViewModel?> GetProductByIdAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;
            
            return new ProductViewModel
            {
                Id = product.Id,
                Code = product.Code,
                Name = product.Name,
                Description = product.Description,
                ImageUrl = product.ImageUrl,
                PricePerDay = product.PricePerDay,
                Category = product.Category,
                Size = product.Size,
                Color = product.Color,
                Status = product.Status,
                WashingDays = product.WashingDays
            };
        }
        
        public async Task<ProductViewModel?> GetProductByCodeAsync(string code)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Code == code);
            if (product == null) return null;
            
            return new ProductViewModel
            {
                Id = product.Id,
                Code = product.Code,
                Name = product.Name,
                Description = product.Description,
                ImageUrl = product.ImageUrl,
                PricePerDay = product.PricePerDay,
                Category = product.Category,
                Size = product.Size,
                Color = product.Color,
                Status = product.Status,
                WashingDays = product.WashingDays
            };
        }
        
        public async Task<bool> CreateProductAsync(ProductViewModel model)
        {
            try
            {
                var product = new Product
                {
                    Code = model.Code,
                    Name = model.Name,
                    Description = model.Description,
                    ImageUrl = model.ImageUrl,
                    PricePerDay = model.PricePerDay,
                    Category = model.Category,
                    Size = model.Size,
                    Color = model.Color,
                    Status = ProductStatus.Available,
                    WashingDays = model.WashingDays
                };
                
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
        
        public async Task<bool> UpdateProductAsync(ProductViewModel model)
        {
            try
            {
                var product = await _context.Products.FindAsync(model.Id);
                if (product == null) return false;
                
                product.Code = model.Code;
                product.Name = model.Name;
                product.Description = model.Description;
                product.ImageUrl = model.ImageUrl;
                product.PricePerDay = model.PricePerDay;
                product.Category = model.Category;
                product.Size = model.Size;
                product.Color = model.Color;
                product.Status = model.Status;
                product.WashingDays = model.WashingDays;
                
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
        
        public async Task<bool> DeleteProductAsync(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null) return false;
                
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
        
        public async Task<List<string>> GetCategoriesAsync()
        {
            return await _context.Products
                .Select(p => p.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
        }
        
        public async Task<bool> IsProductAvailableAsync(int productId, DateTime startDate, DateTime endDate)
        {
            var bookings = await _context.Bookings
                .Where(b => b.ProductId == productId && 
                           b.Status != BookingStatus.Cancelled && 
                           b.Status != BookingStatus.Completed)
                .ToListAsync();
            
            foreach (var booking in bookings)
            {
                var bookingEnd = booking.EndDate;
                var washingEnd = bookingEnd.AddDays(await GetWashingDaysAsync(productId));
                
                if (startDate <= washingEnd && endDate >= booking.StartDate)
                {
                    return false;
                }
            }
            
            return true;
        }
        
        public async Task<List<DateTime>> GetUnavailableDatesAsync(int productId, int days = 30)
        {
            var unavailableDates = new List<DateTime>();
            var bookings = await _context.Bookings
                .Where(b => b.ProductId == productId && 
                           b.Status != BookingStatus.Cancelled && 
                           b.Status != BookingStatus.Completed)
                .ToListAsync();
            
            var washingDays = await GetWashingDaysAsync(productId);
            
            foreach (var booking in bookings)
            {
                // Add booking period dates
                for (var date = booking.StartDate.Date; date <= booking.EndDate.Date; date = date.AddDays(1))
                {
                    unavailableDates.Add(date);
                }
                
                // Add washing period dates
                var washingStart = booking.EndDate.AddDays(1);
                var washingEnd = booking.EndDate.AddDays(washingDays);
                for (var date = washingStart.Date; date <= washingEnd.Date; date = date.AddDays(1))
                {
                    unavailableDates.Add(date);
                }
            }
            
            return unavailableDates.Distinct().OrderBy(d => d).ToList();
        }
        
        public async Task<DateTime> GetNextAvailableDateAsync(int productId)
        {
            var unavailableDates = await GetUnavailableDatesAsync(productId);
            var checkDate = DateTime.Today;
            
            while (unavailableDates.Contains(checkDate))
            {
                checkDate = checkDate.AddDays(1);
            }
            
            return checkDate;
        }
        
        private async Task<int> GetWashingDaysAsync(int productId)
        {
            var product = await _context.Products.FindAsync(productId);
            return product?.WashingDays ?? 2;
        }
    }
}