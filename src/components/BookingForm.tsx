import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { Product, UserDetails, DateRange, Booking } from '../types';
import { formatDate, calculateDays } from '../utils/dateUtils';
import { isProductAvailableForDates } from '../utils/availabilityUtils';

interface BookingFormProps {
  product: Product;
  dateRange: DateRange;
  existingBookings: Booking[];
  onBookingComplete: (booking: Booking) => void;
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  product, 
  dateRange, 
  existingBookings,
  onBookingComplete, 
  onClose 
}) => {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const totalDays = calculateDays(dateRange.start, dateRange.end);
  const totalPrice = totalDays * product.pricePerDay;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Double-check availability before booking
    if (!isProductAvailableForDates(product.id, dateRange.start, dateRange.end, existingBookings)) {
      alert('Sorry, these dates are no longer available. Please select different dates.');
      onClose();
      return;
    }
    
    const booking: Booking = {
      id: Date.now().toString(),
      productId: product.id,
      startDate: dateRange.start,
      endDate: dateRange.end,
      totalPrice,
      userDetails,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    onBookingComplete(booking);
  };

  const handleInputChange = (field: keyof UserDetails, value: string) => {
    setUserDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Complete Booking</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">✓ Dates Available</p>
              <p className="text-xs text-green-600">These dates have been verified as available</p>
            </div>
            <div className="flex items-center mb-3">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover mr-4"
              />
              <div>
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.category} • {product.size} • {product.color}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Start Date:</span>
                <p className="font-medium">{formatDate(dateRange.start)}</p>
              </div>
              <div>
                <span className="text-gray-600">End Date:</span>
                <p className="font-medium">{formatDate(dateRange.end)}</p>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <p className="font-medium">{totalDays} days</p>
              </div>
              <div>
                <span className="text-gray-600">Total Price:</span>
                <p className="font-bold text-blue-600">${totalPrice}</p>
              </div>
            </div>
          </div>

          {/* User Details Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Your Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={userDetails.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userDetails.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address
                </label>
                <input
                  type="text"
                  value={userDetails.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CreditCard className="w-5 h-5 inline mr-2" />
                Complete Booking (${totalPrice})
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;