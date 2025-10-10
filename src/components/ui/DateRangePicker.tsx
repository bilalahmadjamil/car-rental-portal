'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  occupiedDates: Array<{ startDate: string; endDate: string; id: string }>;
  minDate?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  occupiedDates,
  minDate = new Date().toISOString().split('T')[0]
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectingStart, setSelectingStart] = useState(true);

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const minDateObj = new Date(minDate);

    const days = [];
    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startWeekday; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Check if this date is occupied
      const isOccupied = occupiedDates.some(occupied => {
        const occupiedStart = new Date(occupied.startDate);
        const occupiedEnd = new Date(occupied.endDate);
        return date >= occupiedStart && date <= occupiedEnd;
      });

      // Check if this date is in the selected range
      const isSelected = startDate && endDate && date >= startDateObj && date <= endDateObj;
      const isStartDate = startDate && dateString === startDate;
      const isEndDate = endDate && dateString === endDate;
      const isInRange = startDate && endDate && date > startDateObj && date < endDateObj;
      
      // Check if this date is before minimum date
      const isBeforeMin = date < minDateObj;

      days.push({
        day,
        date,
        dateString,
        isOccupied,
        isSelected,
        isStartDate,
        isEndDate,
        isInRange,
        isBeforeMin
      });
    }

    return days;
  };

  const handleDateClick = (day: any) => {
    if (day.isOccupied || day.isBeforeMin) return;

    if (selectingStart) {
      onStartDateChange(day.dateString);
      setSelectingStart(false);
    } else {
      if (day.date < new Date(startDate)) {
        // If selected date is before start date, make it the new start date
        onStartDateChange(day.dateString);
        onEndDateChange('');
        setSelectingStart(false);
      } else {
        onEndDateChange(day.dateString);
        setSelectingStart(true);
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const days = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="relative">
      {/* Date Input Display */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer flex items-center justify-between"
          >
            <span className={startDate ? 'text-gray-900' : 'text-gray-500'}>
              {startDate ? new Date(startDate).toLocaleDateString() : 'Select start date'}
            </span>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer flex items-center justify-between"
          >
            <span className={endDate ? 'text-gray-900' : 'text-gray-500'}>
              {endDate ? new Date(endDate).toLocaleDateString() : 'Select end date'}
            </span>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              {getMonthName(currentMonth)}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-10" />;
              }

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  disabled={day.isOccupied || day.isBeforeMin}
                  className={`
                    h-10 w-10 rounded-lg text-sm font-medium transition-colors relative
                    ${day.isBeforeMin 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : day.isOccupied
                        ? 'text-red-500 bg-red-50 cursor-not-allowed border border-red-200'
                        : day.isStartDate || day.isEndDate
                          ? 'bg-blue-600 text-white'
                          : day.isInRange
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {day.day}
                  {day.isOccupied && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-1 bg-red-500 rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>


          {/* Close Button */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DateRangePicker;
