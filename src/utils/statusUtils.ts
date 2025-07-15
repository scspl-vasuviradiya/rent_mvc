import { Product, Booking } from '../types';
import { addDays, getTodayDate } from './dateUtils';

export interface ProductStatusInfo {
  status: 'available' | 'delivered' | 'reserved' | 'washing';
  availableFrom?: string;
  currentBooking?: Booking;
  nextAvailableDate?: string;
  statusMessage: string;
}

export const getProductStatusForDate = (
  product: Product,
  checkDate: string,
  bookings: Booking[]
): ProductStatusInfo => {
  const today = getTodayDate();
  const productBookings = bookings
    .filter(booking => booking.productId === product.id)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Find active booking for the check date
  const activeBooking = productBookings.find(booking => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const checkDateTime = new Date(checkDate);
    
    return checkDateTime >= startDate && checkDateTime <= endDate && 
           ['confirmed', 'delivered', 'active'].includes(booking.status);
  });

  if (activeBooking) {
    const bookingEndDate = new Date(activeBooking.endDate);
    const washingEndDate = addDays(activeBooking.endDate, product.washingDays || 2);
    
    if (checkDate <= activeBooking.endDate) {
      if (activeBooking.status === 'delivered') {
        return {
          status: 'delivered',
          currentBooking: activeBooking,
          statusMessage: `Delivered to ${activeBooking.userDetails.name}`,
          availableFrom: washingEndDate
        };
      } else {
        return {
          status: 'reserved',
          currentBooking: activeBooking,
          statusMessage: `Reserved until ${new Date(activeBooking.endDate).toLocaleDateString()}`,
          availableFrom: washingEndDate
        };
      }
    }
  }

  // Check if item is in washing period
  const recentBooking = productBookings.find(booking => {
    const bookingEndDate = new Date(booking.endDate);
    const washingEndDate = new Date(addDays(booking.endDate, product.washingDays || 2));
    const checkDateTime = new Date(checkDate);
    
    return checkDateTime > bookingEndDate && checkDateTime <= washingEndDate &&
           booking.status !== 'cancelled';
  });

  if (recentBooking) {
    const washingEndDate = addDays(recentBooking.endDate, product.washingDays || 2);
    return {
      status: 'washing',
      currentBooking: recentBooking,
      statusMessage: `In washing, available from ${new Date(washingEndDate).toLocaleDateString()}`,
      availableFrom: washingEndDate
    };
  }

  // Find next booking to determine when it will be unavailable
  const nextBooking = productBookings.find(booking => {
    return new Date(booking.startDate) > new Date(checkDate) && 
           booking.status !== 'cancelled';
  });

  return {
    status: 'available',
    statusMessage: 'Available for booking',
    nextAvailableDate: nextBooking ? nextBooking.startDate : undefined
  };
};

export const getOverallProductStatus = (
  product: Product,
  bookings: Booking[]
): ProductStatusInfo => {
  return getProductStatusForDate(product, getTodayDate(), bookings);
};

export const updateBookingStatus = (
  booking: Booking,
  newStatus: Booking['status']
): Booking => {
  const today = new Date().toISOString();
  
  switch (newStatus) {
    case 'delivered':
      return { ...booking, status: newStatus, deliveryDate: today };
    case 'returned':
      return { ...booking, status: newStatus, returnDate: today };
    case 'washing':
      return { ...booking, status: newStatus, washingStartDate: today };
    case 'completed':
      return { ...booking, status: newStatus };
    default:
      return { ...booking, status: newStatus };
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800';
    case 'delivered':
      return 'bg-blue-100 text-blue-800';
    case 'reserved':
      return 'bg-yellow-100 text-yellow-800';
    case 'washing':
      return 'bg-purple-100 text-purple-800';
    case 'confirmed':
      return 'bg-indigo-100 text-indigo-800';
    case 'returned':
      return 'bg-orange-100 text-orange-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'delivered':
      return 'Delivered';
    case 'reserved':
      return 'Reserved';
    case 'washing':
      return 'In Washing';
    case 'confirmed':
      return 'Confirmed';
    case 'returned':
      return 'Returned';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};