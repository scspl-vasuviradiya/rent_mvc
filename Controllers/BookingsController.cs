using Microsoft.AspNetCore.Mvc;
using ClothesRental.Services;
using ClothesRental.Models.ViewModels;

namespace ClothesRental.Controllers
{
    public class BookingsController : Controller
    {
        private readonly IBookingService _bookingService;
        private readonly IProductService _productService;
        
        public BookingsController(IBookingService bookingService, IProductService productService)
        {
            _bookingService = bookingService;
            _productService = productService;
        }
        
        public async Task<IActionResult> Index(string filterStatus = "all", DateTime? filterStartDate = null, DateTime? filterEndDate = null)
        {
            var model = await _bookingService.GetBookingsAsync(filterStatus, filterStartDate, filterEndDate);
            return View(model);
        }
        
        public async Task<IActionResult> Details(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null)
            {
                return NotFound();
            }
            
            return View(booking);
        }
        
        [HttpGet]
        public async Task<IActionResult> Create(int productId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var product = await _productService.GetProductByIdAsync(productId);
            if (product == null)
            {
                return NotFound();
            }
            
            var model = new BookingViewModel
            {
                ProductId = productId,
                StartDate = startDate ?? DateTime.Today.AddDays(1),
                EndDate = endDate ?? DateTime.Today.AddDays(2),
                ProductName = product.Name,
                ProductCode = product.Code,
                ProductImageUrl = product.ImageUrl,
                PricePerDay = product.PricePerDay
            };
            
            return View(model);
        }
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(BookingViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Validate dates
                if (model.StartDate < DateTime.Today)
                {
                    ModelState.AddModelError("StartDate", "Start date cannot be in the past.");
                }
                else if (model.EndDate <= model.StartDate)
                {
                    ModelState.AddModelError("EndDate", "End date must be after start date.");
                }
                else
                {
                    // Check availability
                    var isAvailable = await _productService.IsProductAvailableAsync(model.ProductId, model.StartDate, model.EndDate);
                    if (!isAvailable)
                    {
                        ModelState.AddModelError("", "The selected dates are not available. Please choose different dates.");
                    }
                    else
                    {
                        var success = await _bookingService.CreateBookingAsync(model);
                        if (success)
                        {
                            TempData["Success"] = "Booking created successfully!";
                            return RedirectToAction("Confirmation", new { id = model.ProductId });
                        }
                        ModelState.AddModelError("", "Failed to create booking. Please try again.");
                    }
                }
            }
            
            // Reload product details for the view
            var product = await _productService.GetProductByIdAsync(model.ProductId);
            if (product != null)
            {
                model.ProductName = product.Name;
                model.ProductCode = product.Code;
                model.ProductImageUrl = product.ImageUrl;
                model.PricePerDay = product.PricePerDay;
            }
            
            return View(model);
        }
        
        public async Task<IActionResult> Confirmation(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            
            return View(product);
        }
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateStatus(int id, string status)
        {
            var success = await _bookingService.UpdateBookingStatusAsync(id, status);
            if (success)
            {
                TempData["Success"] = "Booking status updated successfully!";
            }
            else
            {
                TempData["Error"] = "Failed to update booking status.";
            }
            
            return RedirectToAction(nameof(Index));
        }
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _bookingService.DeleteBookingAsync(id);
            if (success)
            {
                TempData["Success"] = "Booking deleted successfully!";
            }
            else
            {
                TempData["Error"] = "Failed to delete booking.";
            }
            
            return RedirectToAction(nameof(Index));
        }
        
        [HttpPost]
        public async Task<IActionResult> CalculatePrice(int productId, DateTime startDate, DateTime endDate)
        {
            var totalPrice = await _bookingService.CalculateTotalPriceAsync(productId, startDate, endDate);
            var totalDays = (endDate - startDate).Days + 1;
            
            return Json(new { totalPrice, totalDays });
        }
    }
}