import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { Product, Booking, DateRange } from '../types';
import { getUnavailableDates, isProductAvailableForDates } from '../utils/availabilityUtils';
import { calculateDays, getTodayDate, formatDate } from '../utils/dateUtils';

interface AvailabilityCalendarProps {
  product: Product;
  bookings: Booking[];
  preSelectedDate?: string;
  onDateSelect: (range: DateRange) => void;
  onClose: () => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  product,
  bookings,
  preSelectedDate,
  onDateSelect,
  onClose
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<string>(preSelectedDate || '');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(!!preSelectedDate);

  // Set current month to show the pre-selected date
  React.useEffect(() => {
    if (preSelectedDate) {
      const preSelectedDateObj = new Date(preSelectedDate);
      setCurrentMonth(new Date(preSelectedDateObj.getFullYear(), preSelectedDateObj.getMonth(), 1));
    }
  }, [preSelectedDate]);
  const today = getTodayDate();
  const unavailableDates = getUnavailableDates(product.id, bookings);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDateForComparison = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateUnavailable = (date: Date) => {
    const dateStr = formatDateForComparison(date);
    return unavailableDates.includes(dateStr) || dateStr < today;
  };

  const isDateInSelectedRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const dateStr = formatDateForComparison(date);
    return dateStr >= selectedStartDate && dateStr <= selectedEndDate;
  };

  const isDateSelected = (date: Date) => {
    const dateStr = formatDateForComparison(date);
    return dateStr === selectedStartDate || dateStr === selectedEndDate;
  };

  const handleDateClick = (date: Date) => {
    const dateStr = formatDateForComparison(date);
    
    if (isDateUnavailable(date)) return;

    if (!selectedStartDate || (!isSelectingEndDate && selectedStartDate)) {
      // Selecting start date
      setSelectedStartDate(dateStr);
      setSelectedEndDate('');
      setIsSelectingEndDate(true);
    } else if (isSelectingEndDate) {
      // Selecting end date
      if (dateStr < selectedStartDate) {
        // If end date is before start date, swap them
        setSelectedStartDate(dateStr);
        setSelectedEndDate(selectedStartDate);
      } else {
        setSelectedEndDate(dateStr);
      }
      setIsSelectingEndDate(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleConfirmSelection = () => {
    if (selectedStartDate && selectedEndDate) {
      if (isProductAvailableForDates(product.id, selectedStartDate, selectedEndDate, bookings)) {
        onDateSelect({ start: selectedStartDate, end: selectedEndDate });
      } else {
        alert('Selected dates are not available. Please choose different dates.');
      }
    }
  };

  const totalDays = selectedStartDate && selectedEndDate ? 
    calculateDays(selectedStartDate, selectedEndDate) : 0;
  const totalPrice = totalDays * product.pricePerDay;

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Select Rental Dates</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex items-center mb-6 p-3 bg-gray-50 rounded-lg">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover mr-3"
          />
          <div>
            <h3 className="font-medium text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-600">${product.pricePerDay}/day</p>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-10"></div>;
            }

            const isUnavailable = isDateUnavailable(day);
            const isSelected = isDateSelected(day);
            const isInRange = isDateInSelectedRange(day);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                disabled={isUnavailable}
                className={`h-10 text-sm rounded-lg transition-colors ${
                  isUnavailable
                    ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                    : isSelected
                    ? 'bg-blue-600 text-white'
                    : isInRange
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 mb-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
            <span className="text-gray-600">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
            <span className="text-gray-600">Range</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
            <span className="text-gray-600">Unavailable</span>
          </div>
        </div>

        {/* Selection Summary */}
        {selectedStartDate && selectedEndDate && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Duration:</span>
              <span className="font-medium">{totalDays} days</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Price per day:</span>
              <span className="font-medium">${product.pricePerDay}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-bold text-xl text-blue-600">${totalPrice}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedStartDate || !selectedEndDate}
            className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
              selectedStartDate && selectedEndDate
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Continue
          </button>
        </div>

        {/* Instructions */}
        <p className="text-xs text-gray-500 text-center mt-4">
          {preSelectedDate && !selectedEndDate
            ? 'Pre-selected start date. Click another date to select your end date'
            : !selectedStartDate 
            ? 'Click on a date to select your start date'
            : !selectedEndDate
            ? 'Click on another date to select your end date'
            : 'Click Continue to proceed with booking'
          }
        </p>
        
        {preSelectedDate && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              ✓ Start date pre-selected: {formatDate(preSelectedDate)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;