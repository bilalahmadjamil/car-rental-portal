'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string | number | (string | number)[];
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  className?: string;
  onChange: (value: string | number | (string | number)[]) => void;
  onSearch?: (query: string) => void;
  emptyMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'filled';
  multiple?: boolean;
  maxSelections?: number;
  showSelectedCount?: boolean;
}

const Dropdown = ({
  options = [],
  value,
  placeholder = 'Select an option',
  searchable = false,
  disabled = false,
  error = false,
  errorMessage,
  label,
  required = false,
  className = '',
  onChange,
  onSearch,
  emptyMessage = 'No options available',
  size = 'md',
  variant = 'default',
  multiple = false,
  maxSelections,
  showSelectedCount = true
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Filter options based on search query
  const filteredOptions = searchable && searchQuery
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (option.description && option.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : options;

  // Handle multiselect values
  const selectedValues = multiple ? (Array.isArray(value) ? value : []) : [];
  const selectedOptions = multiple 
    ? options.filter(option => selectedValues.includes(option.value))
    : [options.find(option => option.value === value)].filter(Boolean);
  
  const isSelected = (optionValue: string | number) => {
    if (multiple) {
      return selectedValues.includes(optionValue);
    }
    return value === optionValue;
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current) {
      const highlightedElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  }, [highlightedIndex]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        if (searchable && searchRef.current) {
          searchRef.current.focus();
        }
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelect = (selectedValue: string | number) => {
    if (multiple) {
      const newValues = selectedValues.includes(selectedValue)
        ? selectedValues.filter(v => v !== selectedValue)
        : [...selectedValues, selectedValue];
      
      // Check max selections limit
      if (maxSelections && newValues.length > maxSelections) {
        return;
      }
      
      onChange(newValues);
    } else {
      onChange(selectedValue);
      setIsOpen(false);
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setHighlightedIndex(-1);
    onSearch?.(query);
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-sm px-4 py-3',
    lg: 'text-base px-4 py-3'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-white border border-gray-300 text-gray-900',
    outline: 'bg-transparent border-2 border-gray-300 text-gray-900',
    filled: 'bg-gray-50 border border-gray-200 text-gray-900'
  };

  const baseClasses = `
    w-full rounded-lg transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${className}
  `.trim();

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Dropdown Button */}
      <div
        className={`${baseClasses} cursor-pointer flex items-center justify-between ${
          isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center flex-1 min-w-0">
          {multiple ? (
            <div className="flex items-center flex-1 min-w-0">
              {selectedOptions.length > 0 ? (
                <div className="flex items-center flex-1 min-w-0">
                  {showSelectedCount && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                      {selectedOptions.length}
                    </span>
                  )}
                  <span className="text-gray-900 truncate">
                    {selectedOptions.length === 1 
                      ? selectedOptions[0]?.label || 'Selected'
                      : `${selectedOptions.length} selected`
                    }
                  </span>
                </div>
              ) : (
                <span className="text-gray-500 truncate">{placeholder}</span>
              )}
            </div>
          ) : (
            <>
              {selectedOptions[0]?.icon && (
                <span className="mr-2 flex-shrink-0 text-gray-500">
                  {selectedOptions[0].icon}
                </span>
              )}
              <span className={`truncate ${selectedOptions[0] ? 'text-gray-900' : 'text-gray-500'}`}>
                {selectedOptions[0] ? selectedOptions[0].label : placeholder}
              </span>
            </>
          )}
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-hidden"
          >
            {/* Search Input and Clear All */}
            {(searchable || (multiple && selectedValues.length > 0)) && (
              <div className="p-3 border-b border-gray-100">
                {searchable && (
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Search options..."
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                )}
                {multiple && selectedValues.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {selectedValues.length} selected
                    </span>
                    <button
                      onClick={() => onChange([])}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Options List */}
            <div ref={optionsRef} className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  {emptyMessage}
                </div>
              ) : (
                <div className="pb-2">
                  {filteredOptions.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`
                      px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center justify-between
                      ${option.disabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-blue-50'
                      }
                      ${highlightedIndex === index ? 'bg-blue-50' : ''}
                      ${isSelected(option.value) ? 'bg-blue-100' : ''}
                      ${maxSelections && selectedValues.length >= maxSelections && !isSelected(option.value) ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => {
                      if (!option.disabled && (!maxSelections || selectedValues.length < maxSelections || isSelected(option.value))) {
                        handleSelect(option.value);
                      }
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      {option.icon && (
                        <span className="mr-3 flex-shrink-0 text-gray-500">
                          {option.icon}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-xs text-gray-500 truncate">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {multiple ? (
                      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                        isSelected(option.value) 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected(option.value) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    ) : (
                      isSelected(option.value) && (
                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )
                    )}
                  </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default Dropdown;
