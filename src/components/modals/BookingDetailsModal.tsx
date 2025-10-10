'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Car, CreditCard, MapPin, Phone, Mail, FileText, DollarSign, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  isAdmin?: boolean;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
  isAdmin = false
}) => {
  if (!booking) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'ACTIVE':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'COMPLETED':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'FAILED':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'ACTIVE':
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-30 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Booking Details</h2>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {booking.type === 'rental' ? 'Rental' : 'Purchase'} - {booking.vehicle?.year} {booking.vehicle?.make} {booking.vehicle?.model}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Left Column - Booking Info */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Status & Payment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 bg-white">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(booking.status)}
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Booking Status</span>
                      </div>
                      <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 bg-white">
                      <div className="flex items-center space-x-2 mb-2">
                        <CreditCard className="w-4 h-4 text-gray-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Payment Status</span>
                      </div>
                      <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </div>
                    </div>
                  </div>

                  {/* Dates & Duration (for rentals) */}
                  {booking.type === 'rental' && booking.startDate && booking.endDate && (
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 bg-white">
                      <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="text-sm sm:text-base font-semibold text-gray-900">Rental Period</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">Start Date</p>
                          <p className="text-sm sm:text-base font-medium text-gray-900">{formatDate(booking.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">End Date</p>
                          <p className="text-sm sm:text-base font-medium text-gray-900">{formatDate(booking.endDate)}</p>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-gray-600">Duration</span>
                          <span className="text-sm sm:text-base font-semibold text-blue-600">
                            {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vehicle Details */}
                  <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 bg-white">
                    <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                      <Car className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <span className="text-sm sm:text-base font-semibold text-gray-900">Vehicle Details</span>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Vehicle</span>
                        <span className="text-sm sm:text-base font-medium text-gray-900 text-right">
                          {booking.vehicle?.year} {booking.vehicle?.make} {booking.vehicle?.model}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Type</span>
                        <span className="text-sm sm:text-base font-medium text-gray-900 capitalize">{booking.type}</span>
                      </div>
                      {booking.vehicle?.images && booking.vehicle.images.length > 0 && (
                        <div className="mt-3">
                          <img
                            src={typeof booking.vehicle.images === 'string' 
                              ? JSON.parse(booking.vehicle.images)[0] 
                              : booking.vehicle.images[0]
                            }
                            alt="Vehicle"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="p-4 rounded-xl border-2 bg-white">
                    <div className="flex items-center space-x-2 mb-4">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">Pricing</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          {booking.type === 'rental' ? 'Total Rental Cost' : 'Sale Price'}
                        </span>
                        <span className="font-bold text-lg text-gray-900">
                          ${booking.totalPrice || booking.salePrice}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Payment Method</span>
                        <span className="font-medium text-gray-900 capitalize">
                          {booking.paymentMethod || 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Customer & Additional Info */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Customer Information */}
                  <div className="p-4 rounded-xl border-2 bg-white">
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">Customer Information</span>
                    </div>
                    {booking.user ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Name</span>
                          <span className="font-medium text-gray-900">
                            {booking.user.firstName} {booking.user.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Email</span>
                          <span className="font-medium text-gray-900">{booking.user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Phone</span>
                          <span className="font-medium text-gray-900">{booking.user.phone}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Guest Booking</p>
                        <p className="text-xs text-gray-500 mt-1">No registered user information</p>
                      </div>
                    )}
                  </div>

                  {/* Booking Timeline */}
                  <div className="p-4 rounded-xl border-2 bg-white">
                    <div className="flex items-center space-x-2 mb-4">
                      <Clock className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold text-gray-900">Booking Timeline</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Created</span>
                        <span className="font-medium text-gray-900">
                          {formatDateTime(booking.createdAt)}
                        </span>
                      </div>
                      {booking.cancelledAt && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cancelled</span>
                          <span className="font-medium text-red-600">
                            {formatDateTime(booking.cancelledAt)}
                          </span>
                        </div>
                      )}
                      {booking.cancellationReason && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-800">
                            <strong>Reason:</strong> {booking.cancellationReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  {booking.notes && (
                    <div className="p-4 rounded-xl border-2 bg-white">
                      <div className="flex items-center space-x-2 mb-3">
                        <FileText className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold text-gray-900">Notes</span>
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {booking.notes}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingDetailsModal;
