using ClothesRental.Models.ViewModels;

namespace ClothesRental.Services
{
    public interface IBookingService
    {
        Task<BookingListViewModel> GetBookingsAsync(string filterStatus = "all", DateTime? filterStartDate = null, DateTime? filterEndDate = null);
        Task<BookingViewModel?> GetBookingByIdAsync(int id);
        Task<bool> CreateBookingAsync(BookingViewModel model);
        Task<bool> UpdateBookingStatusAsync(int id, string status);
        Task<bool> DeleteBookingAsync(int id);
        Task<decimal> CalculateTotalPriceAsync(int productId, DateTime startDate, DateTime endDate);
    }
}