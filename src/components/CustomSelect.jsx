import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';
import './CustomSelect.css';

const CustomSelect = ({
  options = [],
  value,
  onChange,
  name,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize options array to { value, label }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return opt;
    }
    return { value: opt, label: String(opt) };
  });

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  const handleSelect = (optionValue) => {
    if (disabled) return;
    if (onChange) {
      onChange({
        target: {
          name: name || '',
          value: optionValue
        }
      });
    }
    setIsOpen(false);
  };

  return (
    <div 
      className={`custom-select-container ${className} ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''}`}
      ref={dropdownRef}
      id={id}
    >
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className={`selected-text ${!selectedOption ? 'placeholder' : ''}`}>
          {displayLabel}
        </span>
        <FaChevronDown className={`select-chevron-icon ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div className="custom-select-menu" role="listbox">
          <ul className="custom-select-list">
            {normalizedOptions.map((opt, idx) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <li
                  key={idx}
                  role="option"
                  aria-selected={isSelected}
                  className={`custom-select-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  <span className="item-label">{opt.label}</span>
                  {isSelected && <FaCheck className="item-check-icon" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
