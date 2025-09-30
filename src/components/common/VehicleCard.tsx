'use client';

import { motion } from 'framer-motion';
import { Car, Star, Eye, Edit, Trash2 } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';
// Define interfaces locally to match the admin dashboard
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  categoryId: string;
  subcategoryId: string;
  type: 'rental' | 'sale' | 'both';
  dailyRate?: number;
  salePrice?: number;
  description: string;
  features: string[];
  images: string[];
  isActive: boolean;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  category?: Category;
  subcategory?: Subcategory;
  index?: number;
  showAdminControls?: boolean;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
  onToggleActive?: (vehicle: Vehicle) => void;
  onView?: (vehicle: Vehicle) => void;
  compact?: boolean;
}

const VehicleCard = ({
  vehicle,
  category,
  subcategory,
  index = 0,
  showAdminControls = false,
  onEdit,
  onDelete,
  onToggleActive,
  onView,
  compact = false
}: VehicleCardProps) => {
  // Parse images and features from JSON strings if needed
  const parsedImages = Array.isArray(vehicle.images) ? vehicle.images : 
    (typeof vehicle.images === 'string' ? JSON.parse(vehicle.images || '[]') : []);
  
  const parsedFeatures = Array.isArray(vehicle.features) ? vehicle.features : 
    (typeof vehicle.features === 'string' ? JSON.parse(vehicle.features || '[]') : []);

  const getPriceColor = (type: string) => {
    switch (type) {
      case 'rental': return 'text-green-600';
      case 'sale': return 'text-blue-600';
      case 'both': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getButtonColor = (type: string) => {
    switch (type) {
      case 'rental': return 'bg-green-600 hover:bg-green-700';
      case 'sale': return 'bg-blue-600 hover:bg-blue-700';
      case 'both': return 'bg-purple-600 hover:bg-purple-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group ${
        !vehicle.isActive ? 'opacity-60' : ''
      }`}
    >
      {/* Vehicle Image */}
      <div className={`relative ${compact ? 'h-32' : 'h-40'} bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden`}>
        {parsedImages.length > 0 && parsedImages[0] ? (
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
            <Car className={`${compact ? 'w-12 h-12' : 'w-16 h-16'} text-gray-400`} />
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
      <div className={`p-4 ${compact ? 'p-3' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className={`${compact ? 'text-base' : 'text-lg'} font-bold text-gray-900 mb-1`}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            {subcategory && (
              <p className={`text-sm text-gray-600 ${compact ? 'text-xs' : ''}`}>{subcategory.name}</p>
            )}
          </div>
        </div>

        <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'} mb-3 line-clamp-2`}>
          {vehicle.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-3">
          {parsedFeatures.slice(0, compact ? 1 : 2).map((feature: string, idx: number) => (
            <span
              key={idx}
              className={`px-2 py-1 bg-gray-100 text-gray-600 rounded-full ${compact ? 'text-xs' : 'text-xs'}`}
            >
              {feature}
            </span>
          ))}
          {parsedFeatures.length > (compact ? 1 : 2) && (
            <span className={`px-2 py-1 bg-gray-100 text-gray-600 rounded-full ${compact ? 'text-xs' : 'text-xs'}`}>
              +{parsedFeatures.length - (compact ? 1 : 2)} more
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {vehicle.type === 'rental' && vehicle.dailyRate && (
              <span className={`${compact ? 'text-sm' : 'text-lg'} font-bold ${getPriceColor(vehicle.type)}`}>
                ${vehicle.dailyRate}/day
              </span>
            )}
            {vehicle.type === 'sale' && vehicle.salePrice && (
              <span className={`${compact ? 'text-sm' : 'text-lg'} font-bold ${getPriceColor(vehicle.type)}`}>
                ${vehicle.salePrice.toLocaleString()}
              </span>
            )}
            {vehicle.type === 'both' && (
              <div className="flex flex-col">
                {vehicle.dailyRate && (
                  <span className={`${compact ? 'text-xs' : 'text-sm'} font-bold text-green-600`}>
                    ${vehicle.dailyRate}/day
                  </span>
                )}
                {vehicle.salePrice && (
                  <span className={`${compact ? 'text-xs' : 'text-sm'} font-bold text-blue-600`}>
                    ${vehicle.salePrice.toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {!showAdminControls && (
            <button
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${getButtonColor(vehicle.type)} ${
                compact ? 'text-sm px-3 py-1.5' : ''
              }`}
            >
              {vehicle.type === 'rental' ? 'Rent Now' : 
               vehicle.type === 'sale' ? 'Buy Now' : 'View Options'}
            </button>
          )}
        </div>

        {/* Admin Status and Controls */}
        {showAdminControls && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  vehicle.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {vehicle.isActive ? 'Active' : 'Inactive'}
                </span>
                <ToggleSwitch
                  checked={vehicle.isActive}
                  onChange={() => onToggleActive && onToggleActive(vehicle)}
                  size="sm"
                  showLabel={false}
                />
                {onView && (
                  <button
                    onClick={() => onView(vehicle)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(vehicle)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit Vehicle"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(vehicle)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <span className="text-gray-500 text-xs">
                ID: {vehicle.id.slice(-8)}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VehicleCard;
