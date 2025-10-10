'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Car, AlertCircle, Eye, ShoppingCart, Timer } from 'lucide-react';
import { apiClient } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Dropdown from '../../../components/common/Dropdown';
import BookingDetailsModal from '../../../components/modals/BookingDetailsModal';
import CancellationModal from '../../../components/modals/CancellationModal';
import { useConfirmation } from '../../../hooks/useConfirmation';

// Static dropdown options
const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'rental', label: 'Rentals' },
  { value: 'sale', label: 'Sales' }
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const RENTAL_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const SALE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' }
];

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
}

interface Booking {
  id: string;
  type: 'rental' | 'sale';
  status: string;
  paymentStatus: string;
  totalPrice?: number;
  salePrice?: number;
  startDate?: string;
  endDate?: string;
  paymentMethod: string;
  guestInfo?: GuestInfo | null;
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  createdAt: string;
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    images?: string[];
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

const BookingsPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { confirm } = useConfirmation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'rental' | 'sale'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'>('all');
  const [cancellationModal, setCancellationModal] = useState<{
    isOpen: boolean;
    bookingId: string;
    vehicleName: string;
  }>({
    isOpen: false,
    bookingId: '',
    vehicleName: ''
  });
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  // Calculate user role
  const isAdmin = useMemo(() => 
    user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN', 
    [user?.role]
  );

  // Utility functions
  const parseVehicleImages = (images: any): string[] => {
    if (typeof images === 'string') {
      try {
        return JSON.parse(images);
      } catch {
        return [];
      }
    }
    return images || [];
  };

  const processBookingData = useCallback((booking: any, isAdmin: boolean, currentUser: any) => ({
    ...booking,
    // Keep the original type from the API instead of hardcoding 'rental'
    type: booking.type || 'rental',
    vehicle: {
      ...booking.vehicle,
      images: parseVehicleImages(booking.vehicle.images)
    },
    user: booking.user || (isAdmin ? null : {
      id: currentUser?.id,
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      email: currentUser?.email
    })
  }), []);

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = isAdmin ? '/bookings/admin/all' : '/bookings/all';
      const response = await apiClient.get(endpoint);
      
      if (response.success) {
        const bookingsData = isAdmin 
          ? (Array.isArray(response.data) ? response.data : (response.data as any)?.data || [])
          : (response.data as any)?.bookings || [];
        
        const processedBookings = bookingsData.map((booking: any) => 
          processBookingData(booking, isAdmin, user)
        );
        
        setBookings(processedBookings);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin, processBookingData]);

  // Color utility functions
  const getStatusColor = useCallback((status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800 border border-red-200'
    };
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }, []);

  const getPaymentStatusColor = useCallback((status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }, []);

  const getStatusDropdownColor = useCallback((status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'border-yellow-300 bg-yellow-50 focus:border-yellow-400 focus:ring-yellow-200',
      confirmed: 'border-green-300 bg-green-50 focus:border-green-400 focus:ring-green-200',
      active: 'border-blue-300 bg-blue-50 focus:border-blue-400 focus:ring-blue-200',
      completed: 'border-gray-300 bg-gray-50 focus:border-gray-400 focus:ring-gray-200',
      cancelled: 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
    };
    return statusMap[status.toLowerCase()] || 'border-gray-300 bg-gray-50 focus:border-gray-400 focus:ring-gray-200';
  }, []);

  const getPaymentDropdownColor = useCallback((status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'border-yellow-300 bg-yellow-50 focus:border-yellow-400 focus:ring-yellow-200',
      paid: 'border-green-300 bg-green-50 focus:border-green-400 focus:ring-green-200',
      failed: 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
    };
    return statusMap[status.toLowerCase()] || 'border-gray-300 bg-gray-50 focus:border-gray-400 focus:ring-gray-200';
  }, []);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Memoized filtered bookings
  const filteredBookings = useMemo(() => {
    const filtered = (bookings || []).filter(booking => {
      const typeMatch = filter === 'all' || booking.type === filter;
      const statusMatch = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter;
      return typeMatch && statusMatch;
    });
    
    
    return filtered;
  }, [bookings, filter, statusFilter]);

  // Action handlers
  const handleViewDetails = useCallback((bookingId: string) => {
    // TODO: Implement booking details modal/page
    alert('Booking details feature coming soon!');
  }, []);

  const handleStatusUpdate = useCallback(async (bookingId: string, newBookingStatus: string, newPaymentStatus: string) => {
    try {
      const confirmed = await confirm({
        title: 'Update Booking Status',
        message: `Are you sure you want to update this booking status to "${newBookingStatus.toUpperCase()}" and payment status to "${newPaymentStatus.toUpperCase()}"?`,
        confirmText: 'Update Status',
        cancelText: 'Cancel',
        type: 'warning'
      });

      if (!confirmed) return;

      const response = await apiClient.patch(`/bookings/admin/rentals/${bookingId}/status`, {
        status: newBookingStatus.toUpperCase(),
        paymentStatus: newPaymentStatus.toUpperCase()
      });
      
      if (response.success) {
        fetchBookings();
      } else {
        setError('Failed to update booking status');
      }
    } catch (error) {
      setError('Failed to update booking status');
    }
  }, [confirm, fetchBookings]);

  const handleCancelBooking = useCallback((bookingId: string, vehicleName: string) => {
    setCancellationModal({
      isOpen: true,
      bookingId,
      vehicleName
    });
  }, []);

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const handleConfirmCancellation = useCallback(async (reason: string) => {
    try {
      const endpoint = isAdmin 
        ? `/bookings/admin/rentals/${cancellationModal.bookingId}/status`
        : `/bookings/rentals/${cancellationModal.bookingId}/cancel`;
      
      const payload = isAdmin 
        ? {
            status: 'CANCELLED',
            paymentStatus: 'PENDING',
            cancellationReason: reason
          }
        : { cancellationReason: reason };
      
      const response = await apiClient.patch(endpoint, payload);
      
      if (response.success) {
        fetchBookings();
      } else {
        setError('Failed to cancel booking');
      }
    } catch (error) {
      setError('Failed to cancel booking');
    }
  }, [isAdmin, cancellationModal.bookingId, fetchBookings]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, fetchBookings]);

  if (isLoading || loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout 
      title={isAdmin ? "Bookings Management" : "My Bookings"} 
      userRole={(user?.role as 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN') || 'CUSTOMER'}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isAdmin ? 'Bookings Management' : 'My Bookings'}
          </h1>
          <p className="text-gray-600">
            {isAdmin ? 'Manage all rental and sale bookings' : 'View and manage your rental bookings'}
          </p>
        </div>

          {/* Professional Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Filter Controls */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Type Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Booking Type
                  </label>
                  <Dropdown
                    options={TYPE_OPTIONS}
                    value={filter}
                    onChange={(value) => setFilter(value as any)}
                    placeholder="All Types"
                    size="md"
                    variant="outline"
                    className="w-full"
                  />
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Booking Status
                  </label>
                  <Dropdown
                    options={STATUS_OPTIONS}
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value as any)}
                    placeholder="All Statuses"
                    size="md"
                    variant="outline"
                    className="w-full"
                  />
                </div>

                {/* Clear Filters */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Actions
                  </label>
                  <button
                    onClick={() => {
                      setFilter('all');
                      setStatusFilter('all');
                    }}
                    className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>

              </div>
            </div>

            {/* Booking Statistics */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Rentals: <span className="text-blue-600 font-semibold">{(bookings || []).filter(b => b.type === 'rental').length}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Sales: <span className="text-purple-600 font-semibold">{(bookings || []).filter(b => b.type === 'sale').length}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Total: <span className="text-gray-900 font-semibold">{(bookings || []).length}</span>
                    </span>
                  </div>
                </div>
                
                {/* Filtered Results Count */}
                <div className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{filteredBookings.length}</span> of <span className="font-semibold text-gray-900">{(bookings || []).length}</span> bookings
                </div>
              </div>
            </div>
          </div>

        {/* Bookings List - Simple List View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-500 mb-6">No bookings match your current filters.</p>
            {!isAdmin && (
              <button
                onClick={() => router.push('/vehicles')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Car className="w-4 h-4 mr-2" />
                Browse Vehicles
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {isAdmin ? (
              // Admin List View
              <div className="divide-y divide-gray-200 overflow-x-auto">
                {/* Header Row - Always visible for admin */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 uppercase tracking-wide min-w-[1200px]">
                    <div className="col-span-1"></div> {/* Image spacer */}
                    <div className="col-span-2">Vehicle</div>
                    <div className="col-span-1 text-center">Start Date</div>
                    <div className="col-span-1 text-center">End Date</div>
                    <div className="col-span-1 text-center">Duration</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1 text-center">Payment</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-center">Actions</div>
                  </div>
                </div>
                
                <div className="min-w-[1200px]">
                  {filteredBookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      {/* Admin List Layout */}
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Vehicle Image */}
                        <div className="col-span-1">
                          <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mx-auto">
                            {booking.vehicle.images && booking.vehicle.images.length > 0 && booking.vehicle.images[0] ? (
                              <img
                                src={booking.vehicle.images[0]}
                                alt={`${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`w-full h-full flex items-center justify-center text-gray-400 ${booking.vehicle.images && booking.vehicle.images.length > 0 && booking.vehicle.images[0] ? 'hidden' : ''}`}>
                              <Car className="w-6 h-6" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Vehicle Details */}
                        <div className="col-span-2 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              booking.type === 'sale'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {booking.type === 'sale' ? 'Sale' : 'Rental'}
                            </span>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Booked: {formatDate(booking.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Start Date Column */}
                        <div className="col-span-1 text-center">
                          <div className="text-xs text-gray-900 font-medium">
                            {booking.type === 'rental' && booking.startDate ? (
                              new Date(booking.startDate).toLocaleDateString()
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </div>
                        </div>

                        {/* End Date Column */}
                        <div className="col-span-1 text-center">
                          <div className="text-xs text-gray-900 font-medium">
                            {booking.type === 'rental' && booking.endDate ? (
                              new Date(booking.endDate).toLocaleDateString()
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </div>
                        </div>

                        {/* Duration Column */}
                        <div className="col-span-1 text-center">
                          <div className="text-xs text-gray-900 font-medium">
                            {booking.type === 'rental' && booking.startDate && booking.endDate ? (
                              `${Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Status Column */}
                        <div className="col-span-1 text-center">
                          <Dropdown
                            options={booking.type === 'sale' ? SALE_STATUS_OPTIONS : RENTAL_STATUS_OPTIONS}
                            value={booking.status.toLowerCase()}
                            onChange={(value) => {
                              const newStatus = String(value);
                              if (newStatus !== booking.status.toLowerCase()) {
                                handleStatusUpdate(booking.id, newStatus, booking.paymentStatus.toLowerCase());
                              }
                            }}
                            placeholder="Status"
                            size="sm"
                            variant="outline"
                            className={`w-full text-xs ${getStatusDropdownColor(booking.status)}`}
                          />
                        </div>
                        
                        {/* Payment Column */}
                        <div className="col-span-1 text-center">
                          <Dropdown
                            options={PAYMENT_STATUS_OPTIONS}
                            value={booking.paymentStatus.toLowerCase()}
                            onChange={(value) => {
                              const newPaymentStatus = String(value);
                              if (newPaymentStatus !== booking.paymentStatus.toLowerCase()) {
                                handleStatusUpdate(booking.id, booking.status.toLowerCase(), newPaymentStatus);
                              }
                            }}
                            placeholder="Payment"
                            size="sm"
                            variant="outline"
                            className={`w-full text-xs ${getPaymentDropdownColor(booking.paymentStatus)}`}
                          />
                        </div>

                        {/* Price Column */}
                        <div className="col-span-2 text-right">
                          <div className="text-sm font-bold text-gray-900">
                            {formatPrice(booking.totalPrice || booking.salePrice || 0)}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {booking.paymentMethod.replace('_', ' ')}
                          </div>
                        </div>
                        
                        {/* Actions Column */}
                        <div className="col-span-2 text-center">
                          <button 
                            onClick={() => handleViewBooking(booking)}
                            className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              // Customer Hybrid Card/List View
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  >
                    {/* Vehicle Image */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      {booking.vehicle.images && booking.vehicle.images.length > 0 && booking.vehicle.images[0] ? (
                        <img
                          src={booking.vehicle.images[0]}
                          alt={`${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`absolute inset-0 flex items-center justify-center text-gray-400 ${booking.vehicle.images && booking.vehicle.images.length > 0 && booking.vehicle.images[0] ? 'hidden' : ''}`}>
                        <Car className="w-16 h-16" />
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </div>
                      </div>
                      
                      {/* Type Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          booking.type === 'sale'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {booking.type === 'sale' ? (
                            <>
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              Sale
                            </>
                          ) : (
                            <>
                              <Timer className="w-3 h-3 mr-1" />
                              Rental
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      {/* Vehicle Info */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Booked: {formatDate(booking.createdAt)}</span>
                        </div>
                      </div>

                      {/* Rental Period (for rentals only) */}
                      {booking.type === 'rental' && booking.startDate && booking.endDate && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-700 mb-2">Rental Period</div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="text-gray-500 text-xs">Start Date</div>
                              <div className="font-medium text-gray-900">{new Date(booking.startDate).toLocaleDateString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">End Date</div>
                              <div className="font-medium text-gray-900">{new Date(booking.endDate).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="text-gray-500">Duration:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Status and Payment Info */}
                      <div className="mb-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Booking Status</span>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.toUpperCase()}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Payment Status</span>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {formatPrice(booking.totalPrice || booking.salePrice || 0)}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {booking.paymentMethod.replace('_', ' ')}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        <button 
                          onClick={() => handleViewBooking(booking)}
                          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                        {booking.status.toLowerCase() === 'pending' ? (
                          <button 
                            onClick={() => handleCancelBooking(booking.id, `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`)}
                            className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            Cancel Booking
                          </button>
                        ) : booking.status.toLowerCase() !== 'cancelled' && booking.status.toLowerCase() !== 'completed' ? (
                          <button className="w-full px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 rounded-lg cursor-not-allowed">
                            Contact Support
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      </div>

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={cancellationModal.isOpen}
        onClose={() => setCancellationModal({ isOpen: false, bookingId: '', vehicleName: '' })}
        onConfirm={handleConfirmCancellation}
        vehicleName={cancellationModal.vehicleName}
        bookingId={cancellationModal.bookingId}
      />

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={showBookingDetails}
        onClose={() => setShowBookingDetails(false)}
        booking={selectedBooking}
        isAdmin={isAdmin}
      />
    </DashboardLayout>
  );
};

export default BookingsPage;
