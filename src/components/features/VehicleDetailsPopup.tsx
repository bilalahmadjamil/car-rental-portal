'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, Car, Fuel, Users, Settings, Star, MapPin, Clock, Shield, Zap } from 'lucide-react';

interface VehicleDetailsPopupProps {
  vehicle: any;
  isOpen: boolean;
  onClose: () => void;
}

const VehicleDetailsPopup = ({ vehicle, isOpen, onClose }: VehicleDetailsPopupProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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

  if (!vehicle || !mounted) return null;

  // Parse images if it's a string
  const images = (() => {
    try {
      return typeof vehicle.images === 'string' 
        ? JSON.parse(vehicle.images) 
        : vehicle.images || [];
    } catch (error) {
      return [];
    }
  })();

  // Parse features if it's a string
  const features = (() => {
    try {
      return typeof vehicle.features === 'string' 
        ? JSON.parse(vehicle.features) 
        : vehicle.features || [];
    } catch (error) {
      return [];
    }
  })();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'rental':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sale':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rental':
        return <Clock className="w-4 h-4" />;
      case 'sale':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/20 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Car className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(vehicle.type)}`}>
                      {getTypeIcon(vehicle.type)}
                      <span className="ml-1">
                        {vehicle.type === 'rental' ? 'For Rent' : 
                         vehicle.type === 'sale' ? 'For Sale' : 'Rent & Sale'}
                      </span>
                    </span>
                    {vehicle.category && (
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {vehicle.category.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)] overflow-hidden">
              {/* Image Gallery */}
              <div className="lg:w-1/2 bg-gray-50 relative">
                {images.length > 0 ? (
                  <div className="relative h-80 lg:h-full">
                    <img
                      src={images[currentImageIndex]}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Image Navigation */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Image Indicators */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {images.map((_: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-80 lg:h-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No images available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="lg:w-1/2 p-6 overflow-y-auto">
                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">4.8 (24 reviews)</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {vehicle.type === 'rental' && vehicle.dailyRate > 0 && (
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Daily Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                          {formatPrice(vehicle.dailyRate)}
                        </p>
                        <p className="text-xs text-blue-600">per day</p>
                      </div>
                    )}
                    
                    {vehicle.type === 'sale' && vehicle.salePrice > 0 && (
                      <div className="bg-green-50 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Sale Price</span>
                        </div>
                        <p className="text-2xl font-bold text-green-900">
                          {formatPrice(vehicle.salePrice)}
                        </p>
                        <p className="text-xs text-green-600">one-time payment</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Year</p>
                        <p className="font-medium text-gray-900">{vehicle.year}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Car className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Make</p>
                        <p className="font-medium text-gray-900">{vehicle.make}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Settings className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Model</p>
                        <p className="font-medium text-gray-900">{vehicle.model}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Fuel className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-medium text-gray-900 capitalize">{vehicle.type}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {vehicle.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
                  </div>
                )}

                {/* Features */}
                {features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Features & Amenities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4 border-t border-gray-200">
                  {vehicle.type === 'rental' ? (
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors">
                      Book Now
                    </button>
                  ) : (
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors">
                      Contact Seller
                    </button>
                  )}
                  <button className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default VehicleDetailsPopup;
