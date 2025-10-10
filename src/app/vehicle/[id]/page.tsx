'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, DollarSign, Car, Fuel, Settings, Clock, Zap } from 'lucide-react';
import { apiClient } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';
import DateRangePicker from '../../../components/ui/DateRangePicker';
import Logo from '../../../components/common/Logo';

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  type: 'rental' | 'sale' | 'both';
  dailyRate?: number;
  weeklyRate?: number;
  salePrice?: number;
  description?: string;
  features?: string[];
  images?: string[];
  isActive: boolean;
  seats?: number;
  fuelType?: string;
  transmission?: string;
  mileage?: number;
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
}


interface VehicleBooking {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
}

const VehicleDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [vehicleRentals, setVehicleRentals] = useState<any[]>([]);
  const [vehicleSales, setVehicleSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [userHasBooking, setUserHasBooking] = useState<{ hasRental: boolean; hasSale: boolean }>({ hasRental: false, hasSale: false });
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVehicleAndBookings = async () => {
      try {
        setLoading(true);
        
        // Fetch vehicle with both rentals and sales in single call
        const vehicleResponse = await apiClient.get(`/vehicles/${params?.id}`);
        
        if (vehicleResponse.success && vehicleResponse.data) {
          const vehicleData = vehicleResponse.data as any;
          
          // Parse images and features if they're strings
          const parsedImages = typeof vehicleData.images === 'string' 
            ? JSON.parse(vehicleData.images) 
            : vehicleData.images || [];
            
          const parsedFeatures = typeof vehicleData.features === 'string' 
            ? JSON.parse(vehicleData.features) 
            : vehicleData.features || [];

          setVehicle({
            ...vehicleData,
            images: parsedImages,
            features: parsedFeatures
          } as Vehicle);
          
          // Extract rentals and sales from vehicle data
          const rentals = vehicleData.rentals || [];
          const sales = vehicleData.sales || [];
          
          
          setVehicleRentals(rentals);
          setVehicleSales(sales);
          
          // Check if current user has existing bookings
          if (isAuthenticated && user?.id) {
            const userRentals = rentals.filter((rental: any) => rental.userId === user.id);
            const userSales = sales.filter((sale: any) => sale.userId === user.id);
            
            // Only block if user has a sale (one sale per vehicle), but allow multiple rentals
            setUserHasBooking({
              hasRental: false, // Allow multiple rentals for same vehicle
              hasSale: userSales.length > 0 // Only one sale per vehicle
            });
          }
          
          
        } else {
          setError('Vehicle not found');
        }
      } catch (err) {
        setError('Failed to load vehicle details');
        setVehicleRentals([]);
        setVehicleSales([]);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchVehicleAndBookings();
    }
  }, [params?.id]);

  // Auto-scroll thumbnail to center the active image
  useEffect(() => {
    if (thumbnailScrollRef.current && vehicle?.images && vehicle.images.length > 4) {
      const container = thumbnailScrollRef.current;
      const activeThumbnail = container.children[currentImageIndex] as HTMLElement;
      
      if (activeThumbnail) {
        const containerWidth = container.clientWidth;
        const thumbnailWidth = activeThumbnail.offsetWidth;
        const thumbnailLeft = activeThumbnail.offsetLeft;
        const scrollLeft = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentImageIndex, vehicle?.images]);


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };


  const calculateRentalCost = () => {
    if (!selectedDates.startDate || !selectedDates.endDate || !vehicle?.dailyRate) return 0;
    
    const start = new Date(selectedDates.startDate);
    const end = new Date(selectedDates.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days >= 7 && vehicle.weeklyRate) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      return (weeks * vehicle.weeklyRate) + (remainingDays * vehicle.dailyRate);
    }
    
    return days * vehicle.dailyRate;
  };

  const handleBooking = (mode: 'rental' | 'sale') => {
    if (!vehicle) return;
    
    
    // Build query parameters for the booking page
    const params = new URLSearchParams({
      vehicleId: vehicle.id,
      mode: mode
    });
    
    // Add dates for rental bookings
    if (mode === 'rental' && selectedDates.startDate && selectedDates.endDate) {
      params.append('startDate', selectedDates.startDate);
      params.append('endDate', selectedDates.endDate);
    }
    
    
    // Navigate to the booking page
    router.push(`/booking?${params.toString()}`);
  };

  const nextImage = () => {
    if (vehicle?.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % (vehicle.images?.length || 1));
    }
  };

  const prevImage = () => {
    if (vehicle?.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + (vehicle.images?.length || 1)) % (vehicle.images?.length || 1));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The vehicle you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/vehicles')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Vehicles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              {vehicle.images && vehicle.images.length > 0 ? (
                <div className="relative h-96 lg:h-[500px]">
                  <img
                    src={vehicle.images[currentImageIndex]}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Image Navigation */}
                  {vehicle.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Image Indicators */}
                  {vehicle.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {vehicle.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 lg:h-[500px] bg-gray-100">
                  <div className="text-center">
                    <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No images available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery with Horizontal Scroll */}
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="relative">
                {/* Scroll Container */}
                <div 
                  ref={thumbnailScrollRef}
                  className="flex space-x-2 overflow-x-auto pb-2 scroll-smooth [&::-webkit-scrollbar]:hidden"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none'
                  }}
                >
                  {vehicle.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        index === currentImageIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Active indicator */}
                      {index === currentImageIndex && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Features - Show under thumbnails on large screens */}
            <div className="lg:block hidden space-y-6">
              {/* Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            {/* Vehicle Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <div className="flex items-center space-x-3 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  vehicle.type === 'rental' ? 'bg-blue-100 text-blue-800' :
                  vehicle.type === 'sale' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {vehicle.type === 'rental' ? 'For Rent' : 
                   vehicle.type === 'sale' ? 'For Sale' : 'Rent & Sale'}
                </span>
                {vehicle.category && (
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {vehicle.category.name}
                  </span>
                )}
              </div>
            </div>

            {/* Description - Moved before specifications */}
            {vehicle.description && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
              </div>
            )}

            {/* Vehicle Specifications - Moved under image */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Specifications</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              
              {/* Additional specifications if available */}
              {(vehicle.seats || vehicle.fuelType || vehicle.transmission || vehicle.mileage) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {vehicle.seats && (
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">S</span>
                        </div>
                        <div>
                          <p className="text-sm text-blue-600">Seats</p>
                          <p className="font-medium text-blue-900">{vehicle.seats}</p>
                        </div>
                      </div>
                    )}
                    
                    {vehicle.fuelType && (
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <Fuel className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-green-600">Fuel Type</p>
                          <p className="font-medium text-green-900">{vehicle.fuelType}</p>
                        </div>
                      </div>
                    )}
                    
                    {vehicle.transmission && (
                      <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                        <Settings className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-purple-600">Transmission</p>
                          <p className="font-medium text-purple-900">{vehicle.transmission}</p>
                        </div>
                      </div>
                    )}
                    
                    {vehicle.mileage && (
                      <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-orange-600">M</span>
                        </div>
                        <div>
                          <p className="text-sm text-orange-600">Mileage</p>
                          <p className="font-medium text-orange-900">{vehicle.mileage} km</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Features - Show on smaller screens only */}
            <div className="lg:hidden space-y-6">
              {/* Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(vehicle.type === 'rental' || vehicle.type === 'both') && vehicle.dailyRate && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
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
                
                {(vehicle.type === 'rental' || vehicle.type === 'both') && vehicle.weeklyRate && (
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Weekly Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">
                      {formatPrice(vehicle.weeklyRate)}
                    </p>
                    <p className="text-xs text-purple-600">per week</p>
                  </div>
                )}
                
                {(vehicle.type === 'sale' || vehicle.type === 'both') && vehicle.salePrice && (
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
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

            {/* Date Selection for Rental */}
            {(vehicle.type === 'rental' || vehicle.type === 'both') && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Select Rental Dates</h2>
                <DateRangePicker
                  startDate={selectedDates.startDate}
                  endDate={selectedDates.endDate}
                  onStartDateChange={(date) => setSelectedDates(prev => ({ ...prev, startDate: date }))}
                  onEndDateChange={(date) => setSelectedDates(prev => ({ ...prev, endDate: date }))}
                  occupiedDates={vehicleRentals.map(rental => ({
                    startDate: rental.startDate,
                    endDate: rental.endDate,
                    id: rental.id
                  }))}
                  minDate={new Date().toISOString().split('T')[0]}
                />

                {/* Pricing Summary */}
                {selectedDates.startDate && selectedDates.endDate && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-800">Estimated Total</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {formatPrice(calculateRentalCost())}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-blue-600">
                          {Math.ceil((new Date(selectedDates.endDate).getTime() - new Date(selectedDates.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {vehicle.type === 'rental' && (
                <motion.button
                  onClick={() => handleBooking('rental')}
                  disabled={!selectedDates.startDate || !selectedDates.endDate || false || userHasBooking.hasRental || userHasBooking.hasSale}
                  className={`w-full font-bold py-4 px-6 rounded-xl transition-colors disabled:cursor-not-allowed ${
                    !selectedDates.startDate || !selectedDates.endDate || false || userHasBooking.hasRental || userHasBooking.hasSale
                      ? 'bg-gray-400 text-gray-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  whileHover={{ scale: !selectedDates.startDate || !selectedDates.endDate || false || userHasBooking.hasRental || userHasBooking.hasSale ? 1 : 1.02 }}
                  whileTap={{ scale: !selectedDates.startDate || !selectedDates.endDate || false || userHasBooking.hasRental || userHasBooking.hasSale ? 1 : 0.98 }}
                >
                  {!selectedDates.startDate || !selectedDates.endDate 
                      ? 'Select Dates to Book' 
                    : userHasBooking.hasRental
                      ? 'You Already Have a Rental Booking'
                      : userHasBooking.hasSale
                        ? 'You Already Have a Purchase Request'
                        : 'Book Now'
                  }
                </motion.button>
              )}
              
              {vehicle.type === 'sale' && (
                <motion.button
                  onClick={() => handleBooking('sale')}
                  disabled={userHasBooking.hasRental || userHasBooking.hasSale}
                  className={`w-full font-bold py-4 px-6 rounded-xl transition-colors disabled:cursor-not-allowed ${
                    userHasBooking.hasRental || userHasBooking.hasSale
                      ? 'bg-gray-400 text-gray-200'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  whileHover={{ scale: userHasBooking.hasRental || userHasBooking.hasSale ? 1 : 1.02 }}
                  whileTap={{ scale: userHasBooking.hasRental || userHasBooking.hasSale ? 1 : 0.98 }}
                >
                  {userHasBooking.hasRental
                    ? 'You Already Have a Rental Booking'
                    : userHasBooking.hasSale
                      ? 'You Already Have a Purchase Request'
                      : 'Purchase Now'
                  }
                </motion.button>
              )}
              
              {vehicle.type === 'both' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.button
                    onClick={() => handleBooking('rental')}
                    disabled={!selectedDates.startDate || !selectedDates.endDate || false || userHasBooking.hasRental || userHasBooking.hasSale}
                    className={`font-bold py-4 px-6 rounded-xl transition-colors disabled:cursor-not-allowed ${
                      !selectedDates.startDate || !selectedDates.endDate || false || userHasBooking.hasRental || userHasBooking.hasSale
                        ? 'bg-gray-400 text-gray-200'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    whileHover={{ scale: !selectedDates.startDate || !selectedDates.endDate || false || userHasBooking.hasRental || userHasBooking.hasSale ? 1 : 1.02 }}
                    whileTap={{ scale: !selectedDates.startDate || !selectedDates.endDate || false || userHasBooking.hasRental || userHasBooking.hasSale ? 1 : 0.98 }}
                  >
                    {!selectedDates.startDate || !selectedDates.endDate 
                      ? 'Select Dates to Rent' 
                      : userHasBooking.hasRental
                        ? 'You Already Have a Rental'
                        : userHasBooking.hasSale
                          ? 'You Already Have a Purchase'
                          : 'Rent Now'
                    }
                  </motion.button>
                  <motion.button
                    onClick={() => handleBooking('sale')}
                    disabled={userHasBooking.hasRental || userHasBooking.hasSale}
                    className={`font-bold py-4 px-6 rounded-xl transition-colors disabled:cursor-not-allowed ${
                      userHasBooking.hasRental || userHasBooking.hasSale
                        ? 'bg-gray-400 text-gray-200'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    whileHover={{ scale: userHasBooking.hasRental || userHasBooking.hasSale ? 1 : 1.02 }}
                    whileTap={{ scale: userHasBooking.hasRental || userHasBooking.hasSale ? 1 : 0.98 }}
                  >
                    {userHasBooking.hasRental
                      ? 'You Already Have a Rental'
                      : userHasBooking.hasSale
                        ? 'You Already Have a Purchase'
                        : 'Buy Now'
                    }
                  </motion.button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default VehicleDetailPage;
