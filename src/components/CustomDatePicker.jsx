import React, { useState, useRef, useEffect } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import './CustomDatePicker.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const CustomDatePicker = ({
  value = '',
  onChange,
  name = 'travelDate',
  placeholder = 'Select Travel Date',
  minDate,
  className = '',
  id,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current value or fallback to today
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  const selectedDate = parseDate(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // View state (month & year being navigated in calendar)
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const changeMonth = (delta) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1);
    setViewDate(newDate);
  };

  const formatDateToString = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleSelectDay = (day) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateStr = formatDateToString(newDate);
    if (onChange) {
      onChange({
        target: {
          name: name || '',
          value: dateStr
        }
      });
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange({
        target: {
          name: name || '',
          value: ''
        }
      });
    }
  };

  const handleToday = () => {
    const dateStr = formatDateToString(today);
    if (onChange) {
      onChange({
        target: {
          name: name || '',
          value: dateStr
        }
      });
    }
    setViewDate(new Date());
    setIsOpen(false);
  };

  // Build calendar matrix
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const minDateObj = minDate ? parseDate(minDate) : today;

  // Format display text for input trigger
  const formatDisplay = (date) => {
    if (!date) return '';
    const day = date.getDate();
    const monthShort = MONTH_NAMES[date.getMonth()].substring(0, 3);
    const yr = date.getFullYear();
    return `${day} ${monthShort} ${yr}`;
  };

  return (
    <div 
      className={`custom-datepicker-container ${className} ${isOpen ? 'is-open' : ''}`}
      ref={containerRef}
      id={id}
    >
      <button
        type="button"
        className="custom-datepicker-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <FaCalendarAlt className="datepicker-calendar-icon" />
        <span className={`selected-date-text ${!selectedDate ? 'placeholder' : ''}`}>
          {selectedDate ? formatDisplay(selectedDate) : placeholder}
        </span>
        {selectedDate && (
          <span 
            className="clear-date-btn" 
            onClick={handleClear}
            title="Clear date"
            role="button"
            tabIndex={0}
          >
            <FaTimes />
          </span>
        )}
      </button>

      {/* Hidden input for HTML form submissions if needed */}
      <input type="hidden" name={name} value={value} required={required} />

      {isOpen && (
        <div className="custom-datepicker-popup" role="dialog" aria-modal="true">
          {/* Header Month / Year Navigation */}
          <div className="datepicker-header">
            <button 
              type="button" 
              className="dp-nav-btn prev"
              onClick={() => changeMonth(-1)}
              aria-label="Previous Month"
            >
              <FaChevronLeft />
            </button>
            <div className="dp-month-year-title">
              <span className="month-name">{MONTH_NAMES[month]}</span>
              <span className="year-number">{year}</span>
            </div>
            <button 
              type="button" 
              className="dp-nav-btn next"
              onClick={() => changeMonth(1)}
              aria-label="Next Month"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Weekday Names Header */}
          <div className="datepicker-weekdays">
            {DAYS_SHORT.map((d, i) => (
              <span key={i} className="weekday-col">{d}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="datepicker-days-grid">
            {/* Prev month days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => {
              const prevDay = daysInPrevMonth - firstDayIndex + i + 1;
              return (
                <span key={`prev-${i}`} className="dp-day-cell dp-day-outside">
                  {prevDay}
                </span>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const thisDate = new Date(year, month, day);
              const isSelected = selectedDate && 
                selectedDate.getFullYear() === year && 
                selectedDate.getMonth() === month && 
                selectedDate.getDate() === day;
              const isToday = today.getFullYear() === year && 
                today.getMonth() === month && 
                today.getDate() === day;
              const isDisabled = minDateObj && thisDate < minDateObj;

              return (
                <button
                  key={`cur-${day}`}
                  type="button"
                  disabled={isDisabled}
                  className={`dp-day-cell dp-day-btn ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
                  onClick={() => handleSelectDay(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Controls */}
          <div className="datepicker-footer">
            <button 
              type="button" 
              className="dp-footer-btn clear"
              onClick={handleClear}
            >
              Clear
            </button>
            <button 
              type="button" 
              className="dp-footer-btn today"
              onClick={handleToday}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
