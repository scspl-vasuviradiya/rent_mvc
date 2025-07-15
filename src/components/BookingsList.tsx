import React from 'react';
import { Calendar, User, DollarSign, Clock } from 'lucide-react';
import { Booking, Product } from '../types';
import { formatDate } from '../utils/dateUtils';
import { getStatusColor, getStatusText, updateBookingStatus } from '../utils/statusUtils';

interface BookingsListProps {
  bookings: Booking[];
  products: Product[];
  onBookingUpdate?: (updatedBooking: Booking) => void;
}

const BookingsList: React.FC<BookingsListProps> = ({ bookings, products, onBookingUpdate }) => {
  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const handleStatusChange = (booking: Booking, newStatus: Booking['status']) => {
    if (onBookingUpdate) {
      const updatedBooking = updateBookingStatus(booking, newStatus);
      onBookingUpdate(updatedBooking);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
        <p className="text-gray-500">Bookings will appear here once customers make reservations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const product = getProduct(booking.productId);
        if (!product) return null;

        return (
          <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">Booking #{booking.id}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {getStatusText(booking.status)}
              </span>
              
              {/* Status Update Buttons */}
              <div className="ml-2">
                <select
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking, e.target.value as Booking['status'])}
                  className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="delivered">Delivered</option>
                  <option value="active">Active</option>
                  <option value="returned">Returned</option>
                  <option value="washing">Washing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{booking.userDetails.name}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Rental Period</p>
                  <p className="font-medium">
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="font-medium text-blue-600">${booking.totalPrice}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Booked On</p>
                  <p className="font-medium">
                    {formatDate(booking.createdAt.split('T')[0])}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Customer Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{booking.userDetails.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{booking.userDetails.phone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Address:</span>
                  <p className="font-medium">{booking.userDetails.address}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingsList;