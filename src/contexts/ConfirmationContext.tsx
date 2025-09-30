'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import ConfirmationPopup, { ConfirmationType } from '../components/common/ConfirmationPopup';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
}

interface ConfirmationContextType {
  showConfirmation: (options: ConfirmationOptions) => Promise<boolean>;
  showDeleteConfirmation: (itemName: string, action?: string) => Promise<boolean>;
  showWarning: (title: string, message: string) => Promise<boolean>;
  showInfo: (title: string, message: string) => Promise<boolean>;
  showSuccess: (title: string, message: string) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};

interface ConfirmationProviderProps {
  children: ReactNode;
}

export const ConfirmationProvider = ({ children }: ConfirmationProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning'
  });
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const showConfirmation = (confirmationOptions: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'warning',
        ...confirmationOptions
      });
      setResolvePromise(() => resolve);
      setIsOpen(true);
    });
  };

  const showDeleteConfirmation = (itemName: string, action: string = 'delete'): Promise<boolean> => {
    return showConfirmation({
      title: `Delete ${itemName}`,
      message: `Are you sure you want to ${action} this ${itemName.toLowerCase()}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'delete'
    });
  };

  const showWarning = (title: string, message: string): Promise<boolean> => {
    return showConfirmation({
      title,
      message,
      confirmText: 'Continue',
      cancelText: 'Cancel',
      type: 'warning'
    });
  };

  const showInfo = (title: string, message: string): Promise<boolean> => {
    return showConfirmation({
      title,
      message,
      confirmText: 'OK',
      cancelText: 'Cancel',
      type: 'info'
    });
  };

  const showSuccess = (title: string, message: string): Promise<boolean> => {
    return showConfirmation({
      title,
      message,
      confirmText: 'OK',
      cancelText: 'Close',
      type: 'success'
    });
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (resolvePromise) {
        resolvePromise(true);
      }
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setResolvePromise(null);
    }
  };

  const handleCancel = () => {
    if (resolvePromise) {
      resolvePromise(false);
    }
    setIsOpen(false);
    setResolvePromise(null);
  };

  const contextValue: ConfirmationContextType = {
    showConfirmation,
    showDeleteConfirmation,
    showWarning,
    showInfo,
    showSuccess
  };

  return (
    <ConfirmationContext.Provider value={contextValue}>
      {children}
      <ConfirmationPopup
        isOpen={isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        type={options.type}
        isLoading={isLoading}
      />
    </ConfirmationContext.Provider>
  );
};
