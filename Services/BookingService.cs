using Microsoft.EntityFrameworkCore;
using ClothesRental.Data;
using ClothesRental.Models;
using ClothesRental.Models.ViewModels;
using ClothesRental.Services;

namespace ClothesRental.Services
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;
        private readonly IProductService _productService;
        
        public BookingService(ApplicationDbContext context, IProductService productService)
        {
            _context = context;
            _productService = productService;
        }
        
        public async Task<BookingListViewModel> GetBookingsAsync(string filterStatus = "all", DateTime? filterStartDate = null, DateTime? filterEndDate = null)
        {
            var query = _context.Bookings.Include(b => b.Product).AsQueryable();
            
            // Apply status filter
            if (filterStatus != "all" && Enum.TryParse<BookingStatus>(filterStatus, true, out var status))
            {
                query = query.Where(b => b.Status == status);
            }
            
            // Apply date filters
            if (filterStartDate.HasValue)
            {
                query = query.Where(b => b.StartDate >= filterStartDate.Value);
            }
            
            if (filterEndDate.HasValue)
            {
                query = query.Where(b => b.EndDate <= filterEndDate.Value);
            }
            
            var bookings = await query.OrderByDescending(b => b.CreatedAt).ToListAsync();
            
            var viewModel = new BookingListViewModel
            {
                Bookings = bookings.Select(b => new BookingViewModel
                {
                    Id = b.Id,
                    ProductId = b.ProductId,
                    StartDate = b.StartDate,
                    EndDate = b.EndDate,
                    CustomerName = b.CustomerName,
                    CustomerEmail = b.CustomerEmail,
                    CustomerPhone = b.CustomerPhone,
                    CustomerAddress = b.CustomerAddress,
                    TotalPrice = b.TotalPrice,
                    Status = b.Status,
                    CreatedAt = b.CreatedAt,
                    ProductName = b.Product.Name,
                    ProductCode = b.Product.Code,
                    ProductImageUrl = b.Product.ImageUrl,
                    PricePerDay = b.Product.PricePerDay
                }).ToList(),
                FilterStatus = filterStatus,
                FilterStartDate = filterStartDate,
                FilterEndDate = filterEndDate
            };
            
            return viewModel;
        }
        
        public async Task<BookingViewModel?> GetBookingByIdAsync(int id)
        {
            var booking = await _context.Bookings.Include(b => b.Product).FirstOrDefaultAsync(b => b.Id == id);
            if (booking == null) return null;
            
            return new BookingViewModel
            {
                Id = booking.Id,
                ProductId = booking.ProductId,
                StartDate = booking.StartDate,
                EndDate = booking.EndDate,
                CustomerName = booking.CustomerName,
                CustomerEmail = booking.CustomerEmail,
                CustomerPhone = booking.CustomerPhone,
                CustomerAddress = booking.CustomerAddress,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                CreatedAt = booking.CreatedAt,
                ProductName = booking.Product.Name,
                ProductCode = booking.Product.Code,
                ProductImageUrl = booking.Product.ImageUrl,
                PricePerDay = booking.Product.PricePerDay
            };
        }
        
        public async Task<bool> CreateBookingAsync(BookingViewModel model)
        {
            try
            {
                // Check availability
                if (!await _productService.IsProductAvailableAsync(model.ProductId, model.StartDate, model.EndDate))
                {
                    return false;
                }
                
                var totalPrice = await CalculateTotalPriceAsync(model.ProductId, model.StartDate, model.EndDate);
                
                var booking = new Booking
                {
                    ProductId = model.ProductId,
                    StartDate = model.StartDate,
                    EndDate = model.EndDate,
                    CustomerName = model.CustomerName,
                    CustomerEmail = model.CustomerEmail,
                    CustomerPhone = model.CustomerPhone,
                    CustomerAddress = model.CustomerAddress,
                    TotalPrice = totalPrice,
                    Status = BookingStatus.Confirmed
                };
                
                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();
                
                // Update product status
                var product = await _context.Products.FindAsync(model.ProductId);
                if (product != null)
                {
                    product.Status = ProductStatus.Reserved;
                    await _context.SaveChangesAsync();
                }
                
                return true;
            }
            catch
            {
                return false;
            }
        }
        
        public async Task<bool> UpdateBookingStatusAsync(int id, string status)
        {
            try
            {
                if (!Enum.TryParse<BookingStatus>(status, true, out var bookingStatus))
                {
                    return false;
                }
                
                var booking = await _context.Bookings.Include(b => b.Product).FirstOrDefaultAsync(b => b.Id == id);
                if (booking == null) return false;
                
                booking.Status = bookingStatus;
                
                // Update timestamps based on status
                switch (bookingStatus)
                {
                    case BookingStatus.Delivered:
                        booking.DeliveryDate = DateTime.UtcNow;
                        booking.Product.Status = ProductStatus.Delivered;
                        break;
                    case BookingStatus.Returned:
                        booking.ReturnDate = DateTime.UtcNow;
                        booking.Product.Status = ProductStatus.Washing;
                        break;
                    case BookingStatus.Washing:
                        booking.WashingStartDate = DateTime.UtcNow;
                        booking.Product.Status = ProductStatus.Washing;
                        break;
                    case BookingStatus.Completed:
                        booking.Product.Status = ProductStatus.Available;
                        break;
                    case BookingStatus.Cancelled:
                        booking.Product.Status = ProductStatus.Available;
                        break;
                }
                
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
        
        public async Task<bool> DeleteBookingAsync(int id)
        {
            try
            {
                var booking = await _context.Bookings.Include(b => b.Product).FirstOrDefaultAsync(b => b.Id == id);
                if (booking == null) return false;
                
                // Update product status to available
                booking.Product.Status = ProductStatus.Available;
                
                _context.Bookings.Remove(booking);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
        
        public async Task<decimal> CalculateTotalPriceAsync(int productId, DateTime startDate, DateTime endDate)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return 0;
            
            var totalDays = (endDate - startDate).Days + 1;
            return product.PricePerDay * totalDays;
        }
    }
}