'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, CreditCard, CheckCircle, AlertCircle, LogIn, User, Car, Shield } from 'lucide-react';
import { apiClient } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../../components/auth/AuthModal';
import TermsModal from '../../components/common/TermsModal';
import Dropdown from '../../components/common/Dropdown';
import Logo from '../../components/common/Logo';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  dailyRate?: number;
  weeklyRate?: number;
  salePrice?: number;
  type: 'rental' | 'sale' | 'both';
  images?: string[];
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

const BookingPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, user, login } = useAuth();
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [mode, setMode] = useState<'rental' | 'sale'>('rental');
  const [selectedDates, setSelectedDates] = useState({
    startDate: searchParams?.get('startDate') || '',
    endDate: searchParams?.get('endDate') || ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [userHasBooking, setUserHasBooking] = useState<{ hasRental: boolean; hasSale: boolean }>({ hasRental: false, hasSale: false });

  // Payment method options
  const paymentMethodOptions = [
    {
      value: 'card',
      label: 'Credit/Debit Card'
    },
    {
      value: 'cash',
      label: 'Cash Payment'
    },
    {
      value: 'bank_transfer',
      label: 'Bank Transfer'
    }
  ];
  
  const [formData, setFormData] = useState<BookingFormData>({
    startDate: selectedDates.startDate,
    endDate: selectedDates.endDate,
    paymentMethod: 'cash',
    notes: '',
    agreeToTerms: false
  });
  
  const [guestData, setGuestData] = useState<GuestFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: ''
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const vehicleId = searchParams?.get('vehicleId');
        const bookingMode = searchParams?.get('mode') as 'rental' | 'sale';
        
        
        if (!vehicleId || !bookingMode) {
          router.push('/');
          return;
        }

        setMode(bookingMode);
        
        // Fetch vehicle details only (no bookings data needed)
        const response = await apiClient.get(`/vehicles/${vehicleId}`);
        if (response.success && response.data) {
          const vehicleData = response.data as any;
          setVehicle({
            ...vehicleData,
            images: typeof vehicleData.images === 'string' 
              ? JSON.parse(vehicleData.images) 
              : vehicleData.images || []
          });
          
          // For now, assume user doesn't have existing bookings
          // This will be validated by the backend
          setUserHasBooking({
            hasRental: false,
            hasSale: false
          });
        } else {
          setError('Vehicle not found');
        }
      } catch (err) {
        setError('Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [searchParams, router]);

  // No need for availability checking - handled by vehicle detail page and backend


  const calculateCost = () => {
    if (mode === 'sale') {
      return Number(vehicle?.salePrice) || 0;
    }

    if (!formData.startDate || !formData.endDate || !vehicle) return 0;
    
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

  // Availability checking removed - handled by vehicle detail page and backend validation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let response;
      
      if (mode === 'rental') {
        const bookingData = {
          vehicleId: vehicle.id,
          startDate: formData.startDate,
          endDate: formData.endDate,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
          agreeToTerms: formData.agreeToTerms
        };

        if (!isAuthenticated) {
          (bookingData as any).guestInfo = guestData;
        }

        response = await apiClient.post('/bookings/rentals', bookingData);
      } else {
        const bookingData = {
          vehicleId: vehicle.id,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
          agreeToTerms: formData.agreeToTerms
        };

        if (!isAuthenticated) {
          (bookingData as any).guestInfo = guestData;
        }

        response = await apiClient.post('/bookings/sales', bookingData);
      }


      // Only show success if API call was successful
      if (response && response.success && response.data) {
        setSuccess(true);
        
        // Wait for success message to be shown, then navigate to main page
        setTimeout(() => {
          router.push('/');
        }, 3000); // Show success for 3 seconds
      } else {
        setError(response?.error || 'Booking request failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
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

  const isFormValid = () => {
    
    // Check terms agreement
    if (!formData.agreeToTerms) {
      return false;
    }
    
    // Check guest fields if not authenticated
    if (!isAuthenticated) {
      const { firstName, lastName, email, phone, address, licenseNumber } = guestData;
      if (!firstName || !lastName || !email || !phone || !address || !licenseNumber) {
        return false;
      }
    }
    
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error || 'Vehicle not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {mode === 'rental' ? 'Rent Vehicle' : 'Purchase Vehicle'}
                </h1>
                <p className="text-gray-600">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
              </div>
            </div>
            
            {/* Clickable Logo - Centered */}
            <button
              onClick={() => router.push('/')}
              className="hover:opacity-80 transition-opacity"
            >
              <Logo className="h-10 w-auto" showText={false} />
            </button>
            
            {/* Spacer for balance */}
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Vehicle Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center space-x-6">
              {vehicle.images && vehicle.images.length > 0 && (
                <img
                  src={vehicle.images[0]}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-32 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Car className="w-4 h-4 mr-1" />
                    {vehicle.type === 'both' ? 'Rent & Sale' : vehicle.type}
                  </span>
                  {mode === 'rental' && formData.startDate && formData.endDate && (
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(calculateCost())}
                </div>
                <div className="text-sm text-gray-500">
                  {mode === 'rental' ? 'Total Cost' : 'Sale Price'}
                </div>
              </div>
            </div>
          </motion.div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              </motion.div>
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {mode === 'rental' ? 'Rental Request Submitted!' : 'Purchase Request Submitted!'}
              </motion.h2>
              <motion.p 
                className="text-gray-600 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Your booking request has been successfully submitted and is being processed.
              </motion.p>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back Now
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {/* Login Option */}
              {!isAuthenticated && (
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Want to login?</h3>
                      <p className="text-sm text-gray-600">Login for faster checkout and order tracking</p>
                    </div>
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </button>
                  </div>
                </div>
              )}

              {/* User Info Display */}
              {isAuthenticated && (
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Logged in as</span>
                  </div>
                  <p className="text-gray-700">
                    {user?.firstName} {user?.lastName} ({user?.email})
                  </p>
                </div>
              )}

              {/* Existing Booking Warning */}
              {isAuthenticated && user?.id && (userHasBooking.hasRental || userHasBooking.hasSale) && (
                <div className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Existing Booking Found</span>
                  </div>
                  <p className="text-yellow-700">
                    {userHasBooking.hasRental && mode === 'rental' && 
                      "You already have a rental booking for this vehicle. You cannot make another rental request."}
                    {userHasBooking.hasSale && mode === 'sale' && 
                      "You already have a purchase request for this vehicle. You cannot make another purchase request."}
                    {userHasBooking.hasRental && mode === 'sale' && 
                      "You already have a rental booking for this vehicle. You cannot make a purchase request."}
                    {userHasBooking.hasSale && mode === 'rental' && 
                      "You already have a purchase request for this vehicle. You cannot make a rental request."}
                  </p>
                </div>
              )}

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
                  </div>
                )}

                {/* Availability Check */}
                {/* Availability status removed - handled by vehicle detail page */}


                {/* Guest Information Form */}
                {!isAuthenticated && (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Your Information
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
                  <Dropdown
                    label="Payment Method"
                    options={paymentMethodOptions}
                    value={formData.paymentMethod}
                    onChange={(value) => setFormData({ ...formData, paymentMethod: value as any })}
                    placeholder="Select payment method"
                    required
                    className="w-full"
                  />
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
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                    >
                      Terms and Conditions
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => setShowPrivacyModal(true)}
                      className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                    >
                      Privacy Policy
                    </button>
                  </label>
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
                    onClick={() => router.back()}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !isFormValid()}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Request...</span>
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
            </motion.div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        type="terms"
      />

      {/* Privacy Policy Modal */}
      <TermsModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        type="privacy"
      />
    </div>
  );
};

export default BookingPage;
