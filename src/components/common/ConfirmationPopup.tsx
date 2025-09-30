'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Trash2, 
  Info, 
  CheckCircle, 
  X, 
  AlertCircle,
  Shield
} from 'lucide-react';

export type ConfirmationType = 'warning' | 'delete' | 'info' | 'success' | 'danger';

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  isLoading?: boolean;
}

const ConfirmationPopup = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false
}: ConfirmationPopupProps) => {
  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const getTypeConfig = (type: ConfirmationType) => {
    switch (type) {
      case 'delete':
      case 'danger':
        return {
          icon: Trash2,
          iconColor: 'text-red-600',
          iconBg: 'bg-red-100',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          borderColor: 'border-red-200',
          titleColor: 'text-red-900'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          iconBg: 'bg-yellow-100',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
          borderColor: 'border-yellow-200',
          titleColor: 'text-yellow-900'
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-100',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          borderColor: 'border-blue-200',
          titleColor: 'text-blue-900'
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          iconBg: 'bg-green-100',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          borderColor: 'border-green-200',
          titleColor: 'text-green-900'
        };
      default:
        return {
          icon: AlertCircle,
          iconColor: 'text-gray-600',
          iconBg: 'bg-gray-100',
          buttonColor: 'bg-gray-600 hover:bg-gray-700',
          borderColor: 'border-gray-200',
          titleColor: 'text-gray-900'
        };
    }
  };

  const config = getTypeConfig(type);
  const IconComponent = config.icon;

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={`bg-white rounded-2xl shadow-2xl max-w-md w-full border ${config.borderColor}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${config.iconBg}`}>
                <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
              </div>
              <h3 className={`text-lg font-semibold ${config.titleColor}`}>
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed mb-6">
              {message}
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 px-4 py-3 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.buttonColor}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmationPopup;
