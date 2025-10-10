'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Car, Star, Calendar, DollarSign, Search, Eye } from 'lucide-react';
import { useVehicles } from '../../contexts/VehicleContext';
import VehicleDetailsPopup from './VehicleDetailsPopup';
import Dropdown from '../common/Dropdown';
import { apiClient } from '../../utils/api';

interface VehicleDisplayProps {
  type?: 'rental' | 'sale' | 'both';
  limit?: number;
  showFilters?: boolean;
  enablePagination?: boolean;
}

const VehicleDisplay = ({ type = 'both', limit, showFilters = true, enablePagination = false }: VehicleDisplayProps) => {
  const router = useRouter();
  const { 
    categories, 
    vehicles, 
    loading,
    error,
    getVehiclesByType, 
    getCategoryById, 
    getSubcategoryById,
    refreshData
  } = useVehicles();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'year' | 'name'>('price');
  const [rentalDays, setRentalDays] = useState<number | null>(null);
  const [navigatingVehicleId, setNavigatingVehicleId] = useState<string | null>(null);
  const [rentalFromDate, setRentalFromDate] = useState<string | null>(null);
  const [rentalToDate, setRentalToDate] = useState<string | null>(null);
  const [filterFromDate, setFilterFromDate] = useState<string>('');
  const [filterToDate, setFilterToDate] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [paginatedVehicles, setPaginatedVehicles] = useState<any[]>([]);
  
  // Initialize date states from localStorage and sync with hero section
  useEffect(() => {
    const loadDatesFromStorage = () => {
      const storedDays = localStorage.getItem('rentalDays');
      const storedFromDate = localStorage.getItem('searchFromDate');
      const storedToDate = localStorage.getItem('searchToDate');
      
      if (storedDays) {
        setRentalDays(parseInt(storedDays));
      }
      if (storedFromDate) {
        setRentalFromDate(storedFromDate);
        setFilterFromDate(storedFromDate);
      }
      if (storedToDate) {
        setRentalToDate(storedToDate);
        setFilterToDate(storedToDate);
      }
    };

    // Load dates on mount
    loadDatesFromStorage();

    // Listen for date updates from hero section
    const handleDateUpdate = () => {
      loadDatesFromStorage();
    };

    window.addEventListener('dateFilterUpdated', handleDateUpdate);

    return () => {
      window.removeEventListener('dateFilterUpdated', handleDateUpdate);
    };
  }, []);

  // Auto-handle date filter changes when filter inputs change
  useEffect(() => {
    handleDateFilterChange();
  }, [filterFromDate, filterToDate]);

  // Refresh vehicle data when dates change for non-paginated views
  useEffect(() => {
    if (!enablePagination && filterFromDate && filterToDate && type !== 'sale') {
      const filters = {
        startDate: filterFromDate,
        endDate: filterToDate,
        type: type
      };
      refreshData(filters);
    } else if (!enablePagination && !filterFromDate && !filterToDate) {
      // Reset to default when no dates are selected
      refreshData();
    }
  }, [filterFromDate, filterToDate, type, enablePagination, refreshData]);

  // Initial fetch for pagination-enabled pages
  useEffect(() => {
    if (enablePagination) {
      fetchVehiclesWithPagination(currentPage, itemsPerPage);
    }
  }, [enablePagination]);

  // Reset to page 1 when filters change (for vehicles page with pagination)
  useEffect(() => {
    if (enablePagination && (searchTerm || selectedCategory || sortBy || filterFromDate || filterToDate)) {
      setCurrentPage(1);
    }
  }, [searchTerm, selectedCategory, sortBy, filterFromDate, filterToDate, enablePagination]);

  // Handle type changes for both paginated and non-paginated views
  useEffect(() => {
    if (enablePagination) {
      // For paginated views, reset to page 1 and fetch new data
      setCurrentPage(1);
      fetchVehiclesWithPagination(1, itemsPerPage);
    }
    
    // Clear date filters when switching to sale cars
    if (type === 'sale') {
      clearDateFilter();
    }
    
    // For non-paginated views, the getFilteredVehicles function will handle the filtering
  }, [type, enablePagination]);

  // Fetch vehicles when filters change (for vehicles page with pagination)
  useEffect(() => {
    if (enablePagination) {
      fetchVehiclesWithPagination(currentPage, itemsPerPage);
    }
  }, [searchTerm, selectedCategory, sortBy, currentPage, itemsPerPage, enablePagination, type, filterFromDate, filterToDate]);

  // Reset navigation loading state when component unmounts or after a delay
  useEffect(() => {
    if (navigatingVehicleId) {
      const timer = setTimeout(() => {
        setNavigatingVehicleId(null);
      }, 3000); // Reset after 3 seconds as fallback
      
      return () => clearTimeout(timer);
    }
  }, [navigatingVehicleId]);

  // Format date range for display (e.g., "Oct 9, 2025 - Nov 29, 2025")
  const formatDateRange = () => {
    if (!rentalFromDate || !rentalToDate) return null;
    
    const fromDate = new Date(rentalFromDate);
    const toDate = new Date(rentalToDate);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    };
    
    return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
  };

  // Calculate estimated rental cost based on selected dates and vehicle rates
  const calculateEstimatedCost = (vehicle: any) => {
    // Only calculate for rental vehicles when dates are selected
    if (!rentalDays || vehicle.type !== 'rental') return null;
    
    const days = rentalDays;
    const dailyRate = vehicle.dailyRate;
    const weeklyRate = vehicle.weeklyRate;
    
    if (days >= 7 && weeklyRate) {
      // Use weekly rate for 7+ days (more cost-effective)
      const weeks = Math.ceil(days / 7);
      return weeks * weeklyRate;
    } else if (dailyRate) {
      // Use daily rate for less than 7 days
      return days * dailyRate;
    }
    
    return null;
  };
  
  // Fetch vehicles with pagination and filtering
  const fetchVehiclesWithPagination = async (page: number = 1, limit: number = itemsPerPage) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        isActive: 'true'
      });
      
      // Only add type filter if it's not 'both' (which means show all types)
      if (type !== 'both') {
        params.append('type', type);
      }
      
      // Add search filter
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      // Add category filter
      if (selectedCategory) {
        params.append('categoryId', selectedCategory);
      }
      
      // Add sorting
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      
      // Add date filtering for rental availability
      if (filterFromDate && filterToDate && type !== 'sale') {
        params.append('startDate', filterFromDate);
        params.append('endDate', filterToDate);
      }
      
      const response = await apiClient.get(`/vehicles?${params.toString()}`);
      
      if (response.success && response.data) {
        const data = response.data as any;
        setTotalItems(data.pagination?.totalCount || data.data.length);
        setTotalPages(data.pagination?.totalPages || Math.ceil(data.data.length / limit));
        setPaginatedVehicles(data.data);
        return data.data;
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  // Calculate hasMore based on current page and total vehicles
  const hasMore = currentPage < totalPages;

  // Popup handlers
  const handleViewVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedVehicle(null);
  };

  // Get filtered vehicles
  const getFilteredVehicles = () => {
    // For pagination-enabled pages, use API data directly
    if (enablePagination) {
      let filtered = paginatedVehicles.filter(vehicle => vehicle.isActive);
      
      // Filter by availability if dates are selected
      if (filterFromDate && filterToDate && type !== 'sale') {
        filtered = filtered.filter(vehicle => {
          // If vehicle has availability data, use it
          if (vehicle.availability) {
            return vehicle.availability.available;
          }
          // If no availability data, assume available (fallback)
          return true;
        });
      }
      
      return filtered;
    }
    
    // For main page and other non-paginated views, use local filtering
    let filteredVehicles = getVehiclesByType(type).filter(vehicle => vehicle.isActive);
    
    // Apply category filter
    if (selectedCategory) {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.categoryId === selectedCategory);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredVehicles = filteredVehicles.filter(vehicle => 
        vehicle.make.toLowerCase().includes(term) ||
        vehicle.model.toLowerCase().includes(term) ||
        vehicle.description.toLowerCase().includes(term)
      );
    }
    
    // Apply availability filter if dates are selected
    if (filterFromDate && filterToDate && type !== 'sale') {
      filteredVehicles = filteredVehicles.filter(vehicle => {
        // If vehicle has availability data, use it
        if (vehicle.availability) {
          return vehicle.availability.available;
        }
        // If no availability data, assume available (fallback)
        return true;
      });
    }
    
    // Apply sorting
    filteredVehicles.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (a.dailyRate || 0) - (b.dailyRate || 0);
        case 'year':
          return b.year - a.year;
        case 'name':
          return a.make.localeCompare(b.make);
        default:
          return 0;
      }
    });
    
    // Apply limit for main page (2 rows x 3 vehicles = 6 total)
    if (limit) {
      filteredVehicles = filteredVehicles.slice(0, limit);
    }
    
    return filteredVehicles;
  };

  const filteredVehicles = getFilteredVehicles();


  const resetFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    setSortBy('price');
    setCurrentPage(1);
    clearDateFilter();
    
    // Reset pagination for vehicles page
    if (enablePagination) {
      setTotalPages(1);
      setTotalItems(0);
      setPaginatedVehicles([]);
    }
  };

  // Handle date filter changes and sync with hero section
  const handleDateFilterChange = () => {
    if (filterFromDate && filterToDate) {
      // Calculate days between dates
      const fromDate = new Date(filterFromDate);
      const toDate = new Date(filterToDate);
      const timeDiff = toDate.getTime() - fromDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // Only proceed if daysDiff is positive (valid date range)
      if (daysDiff > 0) {
        // Update state
        setRentalDays(daysDiff);
        setRentalFromDate(filterFromDate);
        setRentalToDate(filterToDate);
        
        // Store in localStorage for persistence
        localStorage.setItem('rentalDays', daysDiff.toString());
        localStorage.setItem('searchFromDate', filterFromDate);
        localStorage.setItem('searchToDate', filterToDate);
        
        // Notify hero section of changes
        window.dispatchEvent(new CustomEvent('dateFilterUpdated'));
      } else {
        // Invalid date range, clear dates
        clearDateFilter();
      }
    } else if (!filterFromDate && !filterToDate) {
      // Both dates are empty, clear everything
      clearDateFilter();
    }
    // If only one date is set, do nothing (wait for both)
  };

  // Clear all date filters and sync with hero section
  const clearDateFilter = () => {
    // Clear localStorage
    localStorage.removeItem('rentalDays');
    localStorage.removeItem('searchFromDate');
    localStorage.removeItem('searchToDate');
    
    // Clear local state
    setRentalDays(null);
    setRentalFromDate(null);
    setRentalToDate(null);
    setFilterFromDate('');
    setFilterToDate('');
    
    // Notify hero section to clear its dates
    window.dispatchEvent(new CustomEvent('dateFilterUpdated'));
  };

  const loadMoreVehicles = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const newVehicles = await fetchVehiclesWithPagination(nextPage, itemsPerPage);
      
      if (newVehicles.length > 0) {
        setCurrentPage(nextPage);
      }
    } catch (error) {
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Compact Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 relative z-10"
        >
          <div className="space-y-4 lg:space-y-0 lg:flex lg:flex-row lg:gap-4 lg:items-center lg:justify-between">
            {/* Search - Full Width on Mobile, Left Aligned on Desktop */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base lg:text-sm"
              />
            </div>

            {/* Filters - Mobile Optimized */}
            <div className="space-y-3 lg:space-y-0 lg:flex lg:flex-row lg:gap-3 lg:items-center lg:w-auto">
              {/* Date Filter - Only show for rental cars */}
              {type !== 'sale' && (
                <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-row sm:gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 block">From</label>
                    <input
                      type="date"
                      value={filterFromDate}
                      onChange={(e) => setFilterFromDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder="From Date"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 block">To</label>
                    <input
                      type="date"
                      value={filterToDate}
                      onChange={(e) => setFilterToDate(e.target.value)}
                      min={filterFromDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder="To Date"
                    />
                  </div>
                </div>
              )}

              {/* Category Filter */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 block">Category</label>
                <Dropdown
                  options={[
                    { value: '', label: 'All Categories' },
                    ...categories.filter(cat => cat.isActive).map(category => ({
                      value: category.id,
                      label: category.name
                    }))
                  ]}
                  value={selectedCategory || ''}
                  onChange={(value) => setSelectedCategory(value as string || null)}
                  placeholder="All Categories"
                  size="sm"
                  className="w-full lg:min-w-[150px] lg:w-auto"
                />
              </div>

              {/* Sort */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 block">Sort By</label>
                <Dropdown
                  options={[
                    { value: 'price', label: 'Sort by Price' },
                    { value: 'year', label: 'Sort by Year' },
                    { value: 'name', label: 'Sort by Name' }
                  ]}
                  value={sortBy}
                  onChange={(value) => setSortBy(value as any)}
                  placeholder="Sort by Price"
                  size="sm"
                  className="w-full lg:min-w-[140px] lg:w-auto"
                />
              </div>

              {/* Reset Filters */}
              {(searchTerm || selectedCategory || filterFromDate || filterToDate) && (
                <div className="pt-2 lg:pt-0">
                  <button
                    onClick={resetFilters}
                    className="w-full lg:w-auto px-4 py-3 lg:py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}


      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading vehicles...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-600 font-medium mb-2">Error Loading Vehicles</div>
            <div className="text-red-500 text-sm">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Vehicles Grid */}
      {!loading && !error && filteredVehicles.length > 0 ? (
        <div className="space-y-4">
          <div className={`grid gap-4 justify-items-center ${
            limit ? 
              // Main page: 2 rows x 3 vehicles (6 total) - responsive grid
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 
              // Vehicles page: standard grid
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {(limit ? filteredVehicles.slice(0, limit) : filteredVehicles).map((vehicle, index) => {
            const category = getCategoryById(vehicle.categoryId);
            const subcategory = getSubcategoryById(vehicle.subcategoryId);
            
            // Images should now come as arrays from backend
            const parsedImages = Array.isArray(vehicle.images) ? vehicle.images : [];
            
            return (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group relative z-0 w-full`}
              >
                {/* Vehicle Image */}
                <div className={`relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden h-40`}>
                  {Array.isArray(parsedImages) && parsedImages.length > 0 && parsedImages[0] ? (
                    <img
                      src={parsedImages[0]}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Car className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vehicle.type === 'rental' ? 'bg-blue-100 text-blue-800' :
                      vehicle.type === 'sale' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {vehicle.type === 'rental' ? 'For Rent' : 
                       vehicle.type === 'sale' ? 'For Sale' : 'Rent & Sale'}
                    </span>
                  </div>

                  {/* Category Badge */}
                  {category && (
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${category.color}-100 text-${category.color}-800`}>
                        {category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Vehicle Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-lg">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      {subcategory && (
                        <p className="text-sm text-gray-600">{subcategory.name}</p>
                      )}
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium ml-1">4.8</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                    {vehicle.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {Array.isArray(vehicle.features) && vehicle.features.slice(0, 2).map((feature: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                    {Array.isArray(vehicle.features) && vehicle.features.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        +{vehicle.features.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      {vehicle.type === 'rental' && (
                        <div className="space-y-1">
                          {rentalDays ? (
                            // Show estimated cost when rental days are selected for rental vehicles only
                            (() => {
                              const estimatedCost = calculateEstimatedCost(vehicle);
                              return estimatedCost ? (
                                <div className="space-y-2">
                                  {/* Main estimated cost */}
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center text-green-700">
                                        <DollarSign className="w-4 h-4 mr-1" />
                                        <span className="text-lg font-bold">${estimatedCost.toFixed(2)}</span>
                                      </div>
                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                        estimated
                                      </span>
                                    </div>
                                    <div className="text-xs text-green-600 mt-1">
                                      {formatDateRange()}
                                    </div>
                                  </div>
                                  
                                  {/* Base rates in a compact format */}
                                  <div className="flex items-center justify-between text-xs text-gray-600">
                                    {vehicle.dailyRate && (
                                      <span className="flex items-center">
                                        <DollarSign className="w-3 h-3 mr-1" />
                                        {vehicle.dailyRate}/day
                                      </span>
                                    )}
                                    {vehicle.weeklyRate && (
                                      <span className="flex items-center">
                                        <DollarSign className="w-3 h-3 mr-1" />
                                        {vehicle.weeklyRate}/week
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500">Rate not available</div>
                              );
                            })()
                          ) : (
                            // Show regular rates when no dates selected
                            <>
                              {vehicle.dailyRate && (
                                <div className="flex items-center text-green-600">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  <span className="text-lg font-bold">{vehicle.dailyRate}</span>
                                  <span className="text-sm ml-1">/day</span>
                                </div>
                              )}
                              {vehicle.weeklyRate && (
                                <div className="flex items-center text-green-500">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  <span className="text-sm font-medium">{vehicle.weeklyRate}</span>
                                  <span className="text-xs ml-1">/week</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      {vehicle.type === 'sale' && vehicle.salePrice && (
                        <div className="flex items-center text-blue-600">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span className="text-lg font-bold">{vehicle.salePrice.toLocaleString()}</span>
                          <span className="text-sm ml-1">sale</span>
                        </div>
                      )}
                      {vehicle.type === 'both' && (
                        <div className="space-y-1">
                          {rentalDays ? (
                            // Show estimated rental cost when dates are selected (rental portion only)
                            (() => {
                              const estimatedCost = calculateEstimatedCost(vehicle);
                              return estimatedCost ? (
                                <div className="space-y-2">
                                  {/* Main estimated rental cost */}
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center text-green-700">
                                        <DollarSign className="w-4 h-4 mr-1" />
                                        <span className="text-lg font-bold">${estimatedCost.toFixed(2)}</span>
                                      </div>
                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                        rental
                                      </span>
                                    </div>
                                    <div className="text-xs text-green-600 mt-1">
                                      {formatDateRange()}
                                    </div>
                                  </div>
                                  
                                  {/* Base rates and sale price */}
                                  <div className="space-y-1">
                                    {/* Base rental rates */}
                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                      {vehicle.dailyRate && (
                                        <span className="flex items-center">
                                          <DollarSign className="w-3 h-3 mr-1" />
                                          {vehicle.dailyRate}/day
                                        </span>
                                      )}
                                      {vehicle.weeklyRate && (
                                        <span className="flex items-center">
                                          <DollarSign className="w-3 h-3 mr-1" />
                                          {vehicle.weeklyRate}/week
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* Sale price */}
                                    {vehicle.salePrice && (
                                      <div className="flex items-center text-blue-600 text-sm">
                                        <DollarSign className="w-3 h-3 mr-1" />
                                        <span className="font-medium">{vehicle.salePrice.toLocaleString()}</span>
                                        <span className="text-xs ml-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                          sale
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500">Rental rate not available</div>
                              );
                            })()
                          ) : (
                            // Show regular rates when no dates selected
                            <>
                              {vehicle.dailyRate && (
                                <div className="flex items-center text-green-600">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  <span className="text-lg font-bold">{vehicle.dailyRate}</span>
                                  <span className="text-sm ml-1">/day</span>
                                </div>
                              )}
                              {vehicle.weeklyRate && (
                                <div className="flex items-center text-green-500">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  <span className="text-sm font-medium">{vehicle.weeklyRate}</span>
                                  <span className="text-xs ml-1">/week</span>
                                </div>
                              )}
                              {vehicle.salePrice && (
                                <div className="flex items-center text-blue-600">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  <span className="text-lg font-bold">{vehicle.salePrice.toLocaleString()}</span>
                                  <span className="text-sm ml-1">sale</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Year</p>
                      <p className="text-sm font-medium text-gray-900">{vehicle.year}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex space-x-2 ${
                    limit ? 
                      // Main page: more compact buttons
                      'space-x-1' : 
                      // Vehicles page: standard spacing
                      'space-x-2'
                  }`}>
                    <button 
                      onClick={() => {
                        setNavigatingVehicleId(vehicle.id);
                        router.push(`/vehicle/${vehicle.id}`);
                      }}
                      disabled={navigatingVehicleId === vehicle.id}
                      className={`text-white rounded-lg transition-colors font-medium flex-1 py-2 px-3 text-sm ${
                        vehicle.type === 'rental' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : vehicle.type === 'sale' 
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-purple-600 hover:bg-purple-700'
                      } ${
                        navigatingVehicleId === vehicle.id 
                          ? 'opacity-75 cursor-not-allowed' 
                          : ''
                      }`}>
                        {navigatingVehicleId === vehicle.id ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                            <span>Loading...</span>
                          </div>
                        ) : (
                          vehicle.type === 'rental' ? 'Rent Now' : 
                          vehicle.type === 'sale' ? 'Buy Now' : 'View Options'
                        )}
                    </button>
                    <button 
                      onClick={() => handleViewVehicle(vehicle)}
                      className="border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors px-3 py-2"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </div>
          
          {/* View More Button - Only show when there's a limit and more vehicles */}
          {limit && filteredVehicles.length > limit && !enablePagination && (
            <div className="text-center pt-4">
              <motion.a
                href="/vehicles"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Vehicles ({filteredVehicles.length})
                <Car className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.a>
            </div>
          )}

          {/* Pagination Controls - Only show when pagination is enabled */}
          {enablePagination && totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{totalItems}</span>
                    {' '}results
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <label htmlFor="items-per-page" className="text-sm text-gray-700">
                      Show:
                    </label>
                    <select
                      id="items-per-page"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={18}>18</option>
                      <option value={24}>24</option>
                    </select>
                  </div>
                  <nav className="flex space-x-1" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">First</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.022 2.85a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.022 2.85a.75.75 0 01.02 1.06z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const startPage = Math.max(1, currentPage - 2);
                      const pageNum = startPage + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            pageNum === currentPage
                              ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Last</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.21 5.23a.75.75 0 011.06-.02L10 8.168l4.71-3.958a.75.75 0 111.04 1.08l-4.25 4.5a.75.75 0 010 1.08l4.25 4.5a.75.75 0 01-1.04 1.08L10 11.832l-4.71 3.958a.75.75 0 01-1.06-1.08l4.25-4.5a.75.75 0 010-1.08l-4.25-4.5a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : !loading && !error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory
              ? 'Try adjusting your filters to see more results.'
              : 'No vehicles are currently available.'}
          </p>
          {(searchTerm || selectedCategory) && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      ) : null}

      {/* Vehicle Details Popup */}
      <VehicleDetailsPopup
        vehicle={selectedVehicle}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default VehicleDisplay;
