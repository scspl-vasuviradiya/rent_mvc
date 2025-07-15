using Microsoft.AspNetCore.Mvc;
using ClothesRental.Services;
using ClothesRental.Models.ViewModels;

namespace ClothesRental.Controllers
{
    public class HomeController : Controller
    {
        private readonly IProductService _productService;
        
        public HomeController(IProductService productService)
        {
            _productService = productService;
        }
        
        public async Task<IActionResult> Index(string searchTerm = "", string filterCategory = "all", string filterStatus = "all", DateTime? selectedDate = null)
        {
            var model = await _productService.GetProductsAsync(searchTerm, filterCategory, filterStatus, selectedDate);
            return View(model);
        }
        
        [HttpGet]
        public async Task<IActionResult> CheckAvailability(int id, DateTime? date = null)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            
            var unavailableDates = await _productService.GetUnavailableDatesAsync(id);
            var nextAvailableDate = await _productService.GetNextAvailableDateAsync(id);
            
            ViewBag.Product = product;
            ViewBag.UnavailableDates = unavailableDates;
            ViewBag.NextAvailableDate = nextAvailableDate;
            ViewBag.SelectedDate = date ?? DateTime.Today;
            
            return View();
        }
        
        [HttpPost]
        public async Task<IActionResult> CheckDatesAvailability(int productId, DateTime startDate, DateTime endDate)
        {
            var isAvailable = await _productService.IsProductAvailableAsync(productId, startDate, endDate);
            return Json(new { available = isAvailable });
        }
    }
}