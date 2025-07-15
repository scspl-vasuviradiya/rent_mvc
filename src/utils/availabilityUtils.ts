import { Booking } from '../types';
import { isDateInRange, addDays, getTodayDate } from './dateUtils';

export const isProductAvailableForDates = (
  productId: string,
  startDate: string,
  endDate: string,
  bookings: Booking[]
): boolean => {
  const productBookings = bookings.filter(
    booking => booking.productId === productId && 
    !['cancelled', 'completed'].includes(booking.status)
  );

  for (const booking of productBookings) {
    // Check if the requested dates overlap with existing bookings (including washing period)
    const bookingEndDate = booking.endDate;
    const washingEndDate = addDays(bookingEndDate, 2); // Default 2 days washing
    
    if (datesOverlap(startDate, endDate, booking.startDate, washingEndDate)) {
      return false;
    }
  }

  return true;
};

export const datesOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const startDate1 = new Date(start1);
  const endDate1 = new Date(end1);
  const startDate2 = new Date(start2);
  const endDate2 = new Date(end2);

  return startDate1 <= endDate2 && endDate1 >= startDate2;
};

export const getUnavailableDates = (
  productId: string,
  bookings: Booking[]
): string[] => {
  const unavailableDates: string[] = [];
  const productBookings = bookings.filter(
    booking => booking.productId === productId && 
    !['cancelled', 'completed'].includes(booking.status)
  );

  productBookings.forEach(booking => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    
    // Add booking period dates
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      unavailableDates.push(date.toISOString().split('T')[0]);
    }
    
    // Add washing period dates (2 days after booking ends)
    const washingStart = new Date(endDate);
    washingStart.setDate(washingStart.getDate() + 1);
    const washingEnd = new Date(endDate);
    washingEnd.setDate(washingEnd.getDate() + 2);
    
    for (let date = new Date(washingStart); date <= washingEnd; date.setDate(date.getDate() + 1)) {
      unavailableDates.push(date.toISOString().split('T')[0]);
    }
  });

  // Remove duplicates and sort
  return [...new Set(unavailableDates)].sort();
};

export const getNextAvailableDate = (
  productId: string,
  bookings: Booking[]
): string => {
  const today = new Date();
  const unavailableDates = getUnavailableDates(productId, bookings);
  
  let checkDate = new Date(today);
  while (unavailableDates.includes(checkDate.toISOString().split('T')[0])) {
    checkDate.setDate(checkDate.getDate() + 1);
  }
  
  return checkDate.toISOString().split('T')[0];
};

export const getAvailabilityPeriods = (
  productId: string,
  bookings: Booking[],
  days: number = 30
): Array<{date: string, available: boolean, reason?: string}> => {
  const periods = [];
  const today = new Date();
  const unavailableDates = getUnavailableDates(productId, bookings);
  
  for (let i = 0; i < days; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const isUnavailable = unavailableDates.includes(dateStr);
    
    periods.push({
      date: dateStr,
      available: !isUnavailable,
      reason: isUnavailable ? 'Booked or washing' : undefined
    });
  }
  
  return periods;
};