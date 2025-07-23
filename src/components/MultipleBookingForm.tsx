import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, CreditCard, ShoppingCart } from 'lucide-react';
import { CartItem, UserDetails, Booking, BookingProduct } from '../types';
import { formatDate, calculateDays } from '../utils/dateUtils';

interface MultipleBookingFormProps {
  cartItems: CartItem[];
  onBookingComplete: (booking: Booking) => void;
  onClose: () => void;
}

const MultipleBookingForm: React.FC<MultipleBookingFormProps> = ({ 
  cartItems, 
  onBookingComplete, 
  onClose 
}) => {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const days = calculateDays(item.startDate, item.endDate);
      return total + (item.product.pricePerDay * days * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingProducts: BookingProduct[] = cartItems.map(item => {
      const days = calculateDays(item.startDate, item.endDate);
      return {
        productId: item.product.id,
        quantity: item.quantity,
        pricePerDay: item.product.pricePerDay,
        subtotal: item.product.pricePerDay * days * item.quantity
      };
    });

    // For multiple products, we'll use the earliest start date and latest end date
    const startDates = cartItems.map(item => item.startDate);
    const endDates = cartItems.map(item => item.endDate);
    const earliestStart = startDates.sort()[0];
    const latestEnd = endDates.sort().reverse()[0];

    const booking: Booking = {
      id: Date.now().toString(),
      products: bookingProducts,
      startDate: earliestStart,
      endDate: latestEnd,
      totalPrice: getTotalPrice(),
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
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ShoppingCart className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Complete Multiple Product Booking</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">✓ All Dates Available</p>
                  <p className="text-xs text-green-600">All selected dates have been verified as available</p>
                </div>
                
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const days = calculateDays(item.startDate, item.endDate);
                    const subtotal = item.product.pricePerDay * days * item.quantity;
                    
                    return (
                      <div key={item.product.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                          <p className="text-xs text-gray-600">
                            {formatDate(item.startDate)} - {formatDate(item.endDate)} ({days} days)
                          </p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">${subtotal}</div>
                          <div className="text-xs text-gray-500">${item.product.pricePerDay}/day</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Total Items:</span>
                    <span className="font-medium">{getTotalItems()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Price:</span>
                    <span className="text-xl font-bold text-blue-600">${getTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details Form */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
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
                    Complete Booking (${getTotalPrice()})
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleBookingForm;</parameter>