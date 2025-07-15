import React, { useState } from 'react';
import { Calendar, Search, Clock, Package, User, AlertCircle, CheckCircle, Truck, Droplets, Filter } from 'lucide-react';
import { Product, Booking } from '../types';
import { getProductStatusForDate, getStatusColor, getStatusText } from '../utils/statusUtils';
import { getTodayDate, formatDate, addDays } from '../utils/dateUtils';
import { getUnavailableDates, getNextAvailableDate } from '../utils/availabilityUtils';

interface UnifiedAvailabilityCheckerProps {
  products: Product[];
  bookings: Booking[];
  onProductSelect?: (product: Product, preSelectedDate?: string) => void;
}

const UnifiedAvailabilityChecker: React.FC<UnifiedAvailabilityCheckerProps> = ({ 
  products, 
  bookings, 
  onProductSelect 
}) => {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product =>
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === 'all' || product.category === filterCategory) &&
    (filterStatus === 'all' || product.status === filterStatus)
  );

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const statuses = ['all', 'available', 'delivered', 'reserved', 'washing'];

  const getAvailabilityTimeline = (product: Product) => {
    const timeline = [];
    const today = new Date();
    const unavailableDates = getUnavailableDates(product.id, bookings);
    
    // Check next 30 days
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      let status: 'available' | 'delivered' | 'reserved' | 'washing';
      let booking: Booking | undefined;
      
      if (unavailableDates.includes(dateStr)) {
        // Find the booking for this date
        const activeBooking = bookings.find(b => {
          if (b.productId !== product.id) return false;
          const bookingStart = new Date(b.startDate);
          const bookingEnd = new Date(b.endDate);
          const washingEnd = new Date(bookingEnd);
          washingEnd.setDate(washingEnd.getDate() + (product.washingDays || 2));
          const checkDateTime = new Date(dateStr);
          
          return checkDateTime >= bookingStart && checkDateTime <= washingEnd;
        });
        
        if (activeBooking) {
          const bookingEnd = new Date(activeBooking.endDate);
          const checkDateTime = new Date(dateStr);
          
          if (checkDateTime <= bookingEnd) {
            status = activeBooking.status === 'delivered' ? 'delivered' : 'reserved';
          } else {
            status = 'washing';
          }
          booking = activeBooking;
        } else {
          status = 'available';
        }
      } else {
        status = 'available';
      }
      
      timeline.push({
        date: dateStr,
        status,
        booking
      });
    }
    
    return timeline;
  };

  const ProductDetailModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
    const timeline = getAvailabilityTimeline(product);
    const unavailableDates = getUnavailableDates(product.id, bookings);
    const nextAvailable = getNextAvailableDate(product.id, bookings);
    
    const handleTimelineClick = (date: string, status: string) => {
      if (status === 'available' && onProductSelect) {
        onClose();
        onProductSelect(product, date);
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover mr-4"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                  <p className="text-gray-600">{product.category} • {product.size} • {product.color}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Status & Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Current Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Price per day:</span>
                      <span className="font-bold text-blue-600">${product.pricePerDay}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Washing time:</span>
                      <span className="font-medium">{product.washingDays || 2} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Next available:</span>
                      <span className="font-medium text-green-600">
                        {nextAvailable === getTodayDate() ? 'Today' : formatDate(nextAvailable)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Unavailable Dates */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-3">Unavailable Dates</h3>
                  {unavailableDates.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {unavailableDates.slice(0, 10).map(date => (
                        <div key={date} className="text-sm text-red-700 bg-red-100 px-2 py-1 rounded">
                          {formatDate(date)}
                        </div>
                      ))}
                      {unavailableDates.length > 10 && (
                        <div className="text-sm text-red-600 col-span-2">
                          +{unavailableDates.length - 10} more dates
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-green-700">No unavailable dates in the next 30 days</p>
                  )}
                </div>
              </div>

              {/* 30-Day Timeline */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">30-Day Availability Timeline</h3>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {timeline.map(({ date, status, booking }) => {
                    const isToday = date === getTodayDate();
                    const isSelected = date === selectedDate;
                    const isClickable = status === 'available';
                    
                    return (
                      <div 
                        key={date}
                        onClick={() => isClickable && handleTimelineClick(date, status)}
                        className={`p-3 rounded-lg border transition-colors ${
                          isSelected ? 'border-blue-500 bg-blue-50' :
                          isToday ? 'border-green-500 bg-green-50' :
                          isClickable ? 'border-gray-200 hover:bg-gray-50 cursor-pointer hover:border-blue-300' :
                          'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-3">
                              {status === 'available' && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {status === 'delivered' && <Truck className="w-4 h-4 text-blue-500" />}
                              {status === 'reserved' && <User className="w-4 h-4 text-yellow-500" />}
                              {status === 'washing' && <Droplets className="w-4 h-4 text-purple-500" />}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {formatDate(date)}
                                {isToday && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Today</span>}
                              </div>
                              {booking && (
                                <div className="text-xs text-gray-600">
                                  Customer: {booking.userDetails.name}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                            {getStatusText(status)}
                            {isClickable && (
                              <span className="ml-1 text-blue-600">• Click to book</span>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Availability & Status</h2>
            <p className="text-gray-600">Check product availability and status by date with advanced filtering</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by product code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center">
            <Truck className="w-4 h-4 text-blue-500 mr-2" />
            <span className="text-sm text-gray-700">Delivered</span>
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 text-yellow-500 mr-2" />
            <span className="text-sm text-gray-700">Reserved</span>
          </div>
          <div className="flex items-center">
            <Droplets className="w-4 h-4 text-purple-500 mr-2" />
            <span className="text-sm text-gray-700">In Washing</span>
          </div>
        </div>
      </div>

      {/* Products Grid with Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          const statusInfo = getProductStatusForDate(product, selectedDate, bookings);
          const unavailableDates = getUnavailableDates(product.id, bookings);
          const nextAvailable = getNextAvailableDate(product.id, bookings);
          const isSelectedDateAvailable = statusInfo.status === 'available';
          
          return (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(statusInfo.status)}`}>
                    {getStatusText(statusInfo.status)}
                  </span>
                </div>
                {!isSelectedDateAvailable && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Available
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-1">Code: {product.code}</p>
                <p className="text-sm text-gray-600 mb-3">{product.category} • {product.size} • {product.color}</p>
                
                {/* Status for Selected Date */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Status on {formatDate(selectedDate)}:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(statusInfo.status)}`}>
                      {getStatusText(statusInfo.status)}
                    </span>
                  </div>
                  
                  {statusInfo.currentBooking && (
                    <div className="text-xs text-gray-600 mb-1">
                      <User className="w-3 h-3 inline mr-1" />
                      Customer: {statusInfo.currentBooking.userDetails.name}
                    </div>
                  )}
                  
                  {statusInfo.availableFrom && (
                    <div className="text-xs text-gray-600">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Available from: {formatDate(statusInfo.availableFrom)}
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-bold text-blue-600">${product.pricePerDay}</div>
                    <div className="text-xs text-blue-800">Per Day</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="font-bold text-purple-600">{product.washingDays || 2}</div>
                    <div className="text-xs text-purple-800">Wash Days</div>
                  </div>
                </div>

                {/* Next Available */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Next available:</span>
                  <span className={`text-sm font-medium ${
                    nextAvailable === getTodayDate() ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {nextAvailable === getTodayDate() ? 'Today' : formatDate(nextAvailable)}
                  </span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Package className="w-4 h-4 mr-2" />
                  View Details & Timeline
                </button>
                
                {/* Quick Book Button */}
                {isSelectedDateAvailable && onProductSelect && (
                  <button
                    onClick={() => onProductSelect(product, selectedDate)}
                    className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book for {formatDate(selectedDate)}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">No products match your search criteria.</p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default UnifiedAvailabilityChecker;