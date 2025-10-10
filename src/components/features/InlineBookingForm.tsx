'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CreditCard, CheckCircle, AlertCircle, LogIn, User } from 'lucide-react';
import { apiClient } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';

interface InlineBookingFormProps {
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    dailyRate?: number;
    weeklyRate?: number;
    salePrice?: number;
    type: 'rental' | 'sale' | 'both';
  };
  mode: 'rental' | 'sale';
  selectedDates?: {
    startDate: string;
    endDate: string;
  };
  onClose: () => void;
}

interface BookingFormData {
  startDate: string;
  endDate: string;
  paymentMethod: 'card' | 'cash' | 'bank_transfer';
  notes: string;
  agreeToTerms: boolean;
}

interface GuestFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
}

const InlineBookingForm = ({ vehicle, mode, selectedDates, onClose }: InlineBookingFormProps) => {
  const { isAuthenticated, user, login } = useAuth();
  
  const [formData, setFormData] = useState<BookingFormData>({
    startDate: selectedDates?.startDate || '',
    endDate: selectedDates?.endDate || '',
    paymentMethod: 'card',
    notes: '',
    agreeToTerms: false
  });

  // Update form data when selectedDates prop changes
  useEffect(() => {
    if (selectedDates?.startDate && selectedDates?.endDate) {
      setFormData(prev => ({
        ...prev,
        startDate: selectedDates.startDate,
        endDate: selectedDates.endDate
      }));
    }
  }, [selectedDates]);

  // Reset form when component mounts or when dates change significantly
  useEffect(() => {
    setFormData({
      startDate: selectedDates?.startDate || '',
      endDate: selectedDates?.endDate || '',
      paymentMethod: 'card',
      notes: '',
      agreeToTerms: false
    });
    setGuestData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      licenseNumber: ''
    });
    setError(null);
    setSuccess(false);
    setAvailability(null);
  }, [selectedDates?.startDate, selectedDates?.endDate, mode]);
  const [guestData, setGuestData] = useState<GuestFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean; reason?: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [bookingAsGuest, setBookingAsGuest] = useState(false);

  useEffect(() => {
    if (mode === 'rental' && formData.startDate && formData.endDate) {
      checkAvailability();
    }
  }, [formData.startDate, formData.endDate, mode]);

  const checkAvailability = async () => {
    try {
      const response = await apiClient.post('/bookings/check-availability', {
        vehicleId: vehicle.id,
        startDate: formData.startDate,
        endDate: formData.endDate
      });
      setAvailability(response.data as { available: boolean; reason?: string });
    } catch (err) {
    }
  };

  const calculateCost = () => {
    if (mode === 'sale') {
      return Number(vehicle.salePrice) || 0;
    }

    if (!formData.startDate || !formData.endDate) return 0;
    
    // Convert rates to numbers (they might come as strings from API)
    const dailyRate = Number(vehicle.dailyRate) || 0;
    const weeklyRate = Number(vehicle.weeklyRate) || 0;
    
    if (dailyRate === 0) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days >= 7 && weeklyRate > 0) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      return (weeks * weeklyRate) + (remainingDays * dailyRate);
    }
    
    return days * dailyRate;
  };

  const handleAuthSuccess = (data: any) => {
    login(data);
    setShowAuthModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'rental') {
        const bookingData = {
          vehicleId: vehicle.id,
          startDate: formData.startDate,
          endDate: formData.endDate,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
          agreeToTerms: formData.agreeToTerms
        };

        // Add guest data if booking as guest
        if (bookingAsGuest) {
          (bookingData as any).guestInfo = guestData;
        }

        await apiClient.post('/bookings/rentals', bookingData);
      } else {
        const bookingData = {
          vehicleId: vehicle.id,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
          agreeToTerms: formData.agreeToTerms
        };

        // Add guest data if booking as guest
        if (bookingAsGuest) {
          (bookingData as any).guestInfo = guestData;
        }

        await apiClient.post('/bookings/sales', bookingData);
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          startDate: '',
          endDate: '',
          paymentMethod: 'card',
          notes: '',
          agreeToTerms: false
        });
        setGuestData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          licenseNumber: ''
        });
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mt-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'rental' ? 'Rent Vehicle' : 'Purchase Vehicle'}
            </h2>
            <p className="text-gray-600">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            {isAuthenticated ? (
              <p className="text-sm text-blue-600">
                Logged in as {user?.firstName} {user?.lastName}
              </p>
            ) : (
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login to continue</span>
                </button>
                <span className="text-gray-400">or</span>
                <button
                  onClick={() => setBookingAsGuest(!bookingAsGuest)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{bookingAsGuest ? 'Continue as guest' : 'Book as guest'}</span>
                </button>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {mode === 'rental' ? 'Rental Request Submitted!' : 'Purchase Request Submitted!'}
            </h3>
            <p className="text-gray-600">
              We&apos;ll review your request and get back to you shortly.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected Dates Display for Rental */}
            {mode === 'rental' && formData.startDate && formData.endDate && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Selected Rental Period
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <p className="text-gray-900 font-medium">
                      {new Date(formData.startDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <p className="text-gray-900 font-medium">
                      {new Date(formData.endDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Duration: {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            )}

            {/* Availability Check for Rental */}
            {mode === 'rental' && formData.startDate && formData.endDate && availability && (
              <div className={`p-4 rounded-lg flex items-center space-x-2 ${
                availability.available 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {availability.available ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {availability.available ? 'Available for selected dates' : availability.reason}
                </span>
              </div>
            )}

            {/* Guest Information Form */}
            {!isAuthenticated && bookingAsGuest && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Guest Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={guestData.firstName}
                      onChange={(e) => setGuestData({ ...guestData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={guestData.lastName}
                      onChange={(e) => setGuestData({ ...guestData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={guestData.email}
                      onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={guestData.phone}
                      onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={guestData.address}
                      onChange={(e) => setGuestData({ ...guestData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number *
                    </label>
                    <input
                      type="text"
                      value={guestData.licenseNumber}
                      onChange={(e) => setGuestData({ ...guestData, licenseNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special requests or notes..."
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Cost Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">
                  {mode === 'rental' ? 'Total Rental Cost' : 'Purchase Price'}
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(calculateCost())}
                </span>
              </div>
              {mode === 'rental' && formData.startDate && formData.endDate && (
                <div className="text-sm text-gray-600 mt-2">
                  {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (mode === 'rental' && (!availability?.available || !formData.agreeToTerms)) || (mode === 'sale' && !formData.agreeToTerms)}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {mode === 'rental' ? <Calendar className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                    <span>{mode === 'rental' ? 'Request Rental' : 'Request Purchase'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Auth Modal - Outside to avoid key conflicts */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default InlineBookingForm;
