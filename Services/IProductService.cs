using ClothesRental.Models;
using ClothesRental.Models.ViewModels;

namespace ClothesRental.Services
{
    public interface IProductService
    {
        Task<ProductListViewModel> GetProductsAsync(string searchTerm = "", string filterCategory = "all", string filterStatus = "all", DateTime? selectedDate = null);
        Task<ProductViewModel?> GetProductByIdAsync(int id);
        Task<ProductViewModel?> GetProductByCodeAsync(string code);
        Task<bool> CreateProductAsync(ProductViewModel model);
        Task<bool> UpdateProductAsync(ProductViewModel model);
        Task<bool> DeleteProductAsync(int id);
        Task<List<string>> GetCategoriesAsync();
        Task<bool> IsProductAvailableAsync(int productId, DateTime startDate, DateTime endDate);
        Task<List<DateTime>> GetUnavailableDatesAsync(int productId, int days = 30);
        Task<DateTime> GetNextAvailableDateAsync(int productId);
    }
}