'use client';

import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  className?: string;
  showLabel?: boolean;
}

const ToggleSwitch = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  className = '',
  showLabel = true
}: ToggleSwitchProps) => {
  const sizeClasses = {
    sm: {
      container: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translateDistance: 16 // 4 * 4px (w-4 = 1rem = 16px)
    },
    md: {
      container: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translateDistance: 20 // 5 * 4px (w-5 = 1.25rem = 20px)
    },
    lg: {
      container: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translateDistance: 28 // 7 * 4px (w-7 = 1.75rem = 28px)
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${currentSize.container}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${checked 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-200 hover:bg-gray-300'
          }
        `}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        aria-label={label || 'Toggle switch'}
      >
        <motion.span
          className={`
            pointer-events-none inline-block rounded-full bg-white shadow transform ring-0
            ${currentSize.thumb}
          `}
          initial={{
            x: checked ? currentSize.translateDistance : 0,
            scale: checked ? 1 : 0.9
          }}
          animate={{
            x: checked ? currentSize.translateDistance : 0,
            scale: checked ? 1 : 0.9
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      </button>
      
      {showLabel && (label || description) && (
        <div className="ml-3">
          {label && (
            <label className="text-sm font-medium text-gray-900 cursor-pointer" onClick={() => !disabled && onChange(!checked)}>
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ToggleSwitch;
