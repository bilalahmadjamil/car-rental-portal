'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Star, Calendar, DollarSign, Filter, Search, Eye } from 'lucide-react';
import { useVehicles } from '../../contexts/VehicleContext';
import VehicleDetailsPopup from './VehicleDetailsPopup';
import Dropdown from '../common/Dropdown';

interface VehicleDisplayProps {
  type?: 'rental' | 'sale' | 'both';
  limit?: number;
  showFilters?: boolean;
  enablePagination?: boolean;
}

const VehicleDisplay = ({ type = 'both', limit, showFilters = true, enablePagination = false }: VehicleDisplayProps) => {
  const { 
    categories, 
    vehicles, 
    loading,
    error,
    getVehiclesByType, 
    getCategoryById, 
    getSubcategoryById 
  } = useVehicles();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'year' | 'name'>('price');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Calculate hasMore based on current page and total vehicles
  const itemsPerPage = 6;
  const totalVehicles = getVehiclesByType(type).filter(vehicle => vehicle.isActive).length;
  const hasMore = currentPage * itemsPerPage < totalVehicles;

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
    
    // Apply pagination for vehicles page
    if (enablePagination) {
      const itemsPerPage = 6;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      filteredVehicles = filteredVehicles.slice(0, endIndex);
    } else if (limit) {
      // Apply limit for main page
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
  };

  const loadMoreVehicles = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more vehicles:', error);
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
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search - Left Aligned */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Filters - Right Aligned */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Category Filter */}
              <Dropdown
                options={[
                  { value: '', label: 'All Categories' },
                  ...categories.filter(cat => cat.isActive).map(category => ({
                    value: category.id,
                    label: category.name,
                    description: category.description
                  }))
                ]}
                value={selectedCategory || ''}
                onChange={(value) => setSelectedCategory(value as string || null)}
                placeholder="All Categories"
                size="sm"
                className="min-w-[150px]"
              />

              {/* Sort */}
              <Dropdown
                options={[
                  { value: 'price', label: 'Sort by Price', description: 'Lowest to highest price' },
                  { value: 'year', label: 'Sort by Year', description: 'Newest to oldest' },
                  { value: 'name', label: 'Sort by Name', description: 'A to Z' }
                ]}
                value={sortBy}
                onChange={(value) => setSortBy(value as any)}
                placeholder="Sort by Price"
                size="sm"
                className="min-w-[140px]"
              />

              {/* Reset Filters */}
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap"
                >
                  Clear Filters
                </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
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
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                {/* Vehicle Image */}
                <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
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
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
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

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {vehicle.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {Array.isArray(vehicle.features) && vehicle.features.slice(0, 2).map((feature, idx) => (
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
                      {vehicle.type === 'rental' && vehicle.dailyRate && (
                        <div className="flex items-center text-green-600">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span className="text-lg font-bold">{vehicle.dailyRate}</span>
                          <span className="text-sm ml-1">/day</span>
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
                          {vehicle.dailyRate && (
                            <div className="flex items-center text-green-600">
                              <DollarSign className="w-4 h-4 mr-1" />
                              <span className="text-lg font-bold">{vehicle.dailyRate}</span>
                              <span className="text-sm ml-1">/day</span>
                            </div>
                          )}
                          {vehicle.salePrice && (
                            <div className="flex items-center text-blue-600">
                              <DollarSign className="w-4 h-4 mr-1" />
                              <span className="text-lg font-bold">{vehicle.salePrice.toLocaleString()}</span>
                              <span className="text-sm ml-1">sale</span>
                            </div>
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
                  <div className="flex space-x-2">
                    <button className={`flex-1 text-white py-2 px-3 rounded-lg transition-colors font-medium text-sm ${
                      vehicle.type === 'rental' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : vehicle.type === 'sale' 
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}>
                      {vehicle.type === 'rental' ? 'Rent Now' : 
                       vehicle.type === 'sale' ? 'Buy Now' : 'View Options'}
                    </button>
                    <button 
                      onClick={() => handleViewVehicle(vehicle)}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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

          {/* Load More Button - Only show when pagination is enabled */}
          {enablePagination && hasMore && (
            <div className="text-center pt-6">
              <motion.button
                onClick={loadMoreVehicles}
                disabled={loadingMore}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loadingMore ? 1 : 1.05, y: loadingMore ? 0 : -2 }}
                whileTap={{ scale: loadingMore ? 1 : 0.95 }}
              >
                {loadingMore ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading More...
                  </>
                ) : (
                  <>
                    Load More Vehicles
                    <Car className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </motion.button>
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
