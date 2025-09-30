'use client';

import { useConfirmation as useConfirmationContext } from '../contexts/ConfirmationContext';

export const useConfirmation = () => {
  const confirmation = useConfirmationContext();

  return {
    // Generic confirmation
    confirm: confirmation.showConfirmation,
    
    // Specific confirmations
    confirmDelete: confirmation.showDeleteConfirmation,
    confirmWarning: confirmation.showWarning,
    confirmInfo: confirmation.showInfo,
    confirmSuccess: confirmation.showSuccess,
    
    // Legacy methods for backward compatibility
    showConfirmation: confirmation.showConfirmation,
    showDeleteConfirmation: confirmation.showDeleteConfirmation,
    showWarning: confirmation.showWarning,
    showInfo: confirmation.showInfo,
    showSuccess: confirmation.showSuccess
  };
};

export default useConfirmation;
