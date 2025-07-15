using Microsoft.AspNetCore.Mvc;
using ClothesRental.Services;
using ClothesRental.Models.ViewModels;

namespace ClothesRental.Controllers
{
    public class ProductsController : Controller
    {
        private readonly IProductService _productService;
        
        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }
        
        public async Task<IActionResult> Index(string searchTerm = "", string filterCategory = "all", string filterStatus = "all")
        {
            var model = await _productService.GetProductsAsync(searchTerm, filterCategory, filterStatus);
            return View(model);
        }
        
        public async Task<IActionResult> Details(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            
            var unavailableDates = await _productService.GetUnavailableDatesAsync(id);
            var nextAvailableDate = await _productService.GetNextAvailableDateAsync(id);
            
            ViewBag.UnavailableDates = unavailableDates;
            ViewBag.NextAvailableDate = nextAvailableDate;
            
            return View(product);
        }
        
        [HttpGet]
        public IActionResult Create()
        {
            return View(new ProductViewModel());
        }
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ProductViewModel model)
        {
            if (ModelState.IsValid)
            {
                var success = await _productService.CreateProductAsync(model);
                if (success)
                {
                    TempData["Success"] = "Product created successfully!";
                    return RedirectToAction(nameof(Index));
                }
                ModelState.AddModelError("", "Failed to create product. Please try again.");
            }
            
            return View(model);
        }
        
        [HttpGet]
        public async Task<IActionResult> Edit(int id)
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
        public async Task<IActionResult> Edit(ProductViewModel model)
        {
            if (ModelState.IsValid)
            {
                var success = await _productService.UpdateProductAsync(model);
                if (success)
                {
                    TempData["Success"] = "Product updated successfully!";
                    return RedirectToAction(nameof(Index));
                }
                ModelState.AddModelError("", "Failed to update product. Please try again.");
            }
            
            return View(model);
        }
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _productService.DeleteProductAsync(id);
            if (success)
            {
                TempData["Success"] = "Product deleted successfully!";
            }
            else
            {
                TempData["Error"] = "Failed to delete product.";
            }
            
            return RedirectToAction(nameof(Index));
        }
    }
}