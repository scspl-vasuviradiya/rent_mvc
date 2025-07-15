import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { DateRange } from '../types';
import { getTodayDate, addDays, calculateDays } from '../utils/dateUtils';

interface DateRangePickerProps {
  onDateSelect: (range: DateRange) => void;
  onClose: () => void;
  pricePerDay: number;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  onDateSelect, 
  onClose, 
  pricePerDay 
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const today = getTodayDate();
  const minEndDate = startDate ? addDays(startDate, 1) : today;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      onDateSelect({ start: startDate, end: endDate });
    }
  };

  const totalDays = startDate && endDate ? calculateDays(startDate, endDate) : 0;
  const totalPrice = totalDays * pricePerDay;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Select Dates</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={today}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={minEndDate}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {totalDays > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Duration:</span>
                <span className="font-medium">{totalDays} days</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Price per day:</span>
                <span className="font-medium">${pricePerDay}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-xl text-blue-600">${totalPrice}</span>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DateRangePicker;