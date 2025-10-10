'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Car, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Tag,
  Layers,
  Settings,
  Eye,
  EyeOff,
  Grid3X3,
  List,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Power,
  PowerOff,
  X
} from 'lucide-react';
import VehicleForms from './VehicleForms';
import VehicleCard from '../common/VehicleCard';
import ToggleSwitch from '../common/ToggleSwitch';
import Dropdown from '../common/Dropdown';
import { useVehicles } from '../../contexts/VehicleContext';
import { useConfirmation } from '../../hooks/useConfirmation';
import { apiClient } from '../../utils/api';

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

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  categoryId: string;
  subcategoryId: string;
  type: 'rental' | 'sale' | 'both';
  dailyRate?: number;
  weeklyRate?: number;
  salePrice?: number;
  description: string;
  features: string[];
  images: string[];
  isActive: boolean;
  createdAt: string;
}

const VehicleManagement = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories' | 'vehicles'>('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [paginatedVehicles, setPaginatedVehicles] = useState<any[]>([]);

  const {
    categories,
    vehicles,
    loading,
    error,
    isUsingMockData,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    toggleSubcategoryStatus,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    toggleVehicleStatus,
    fetchVehicles,
    refreshData
  } = useVehicles();

  const tabs = [
    { id: 'categories', label: 'Categories', icon: Layers, count: categories.length },
    { id: 'subcategories', label: 'Subcategories', icon: Tag, count: categories.reduce((acc, cat) => acc + cat.subcategories.length, 0) },
    { id: 'vehicles', label: 'Vehicles', icon: Car, count: activeTab === 'vehicles' ? totalItems : vehicles.length }
  ];

  // Fetch vehicles with pagination
  const fetchVehiclesWithPagination = async (page: number = 1, limit: number = itemsPerPage) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        isActive: 'true'
      });
      
      // Add search filter
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      // Add category filter
      if (selectedCategory) {
        params.append('categoryId', selectedCategory);
      }
      
      // Add subcategory filter
      if (selectedSubcategory) {
        params.append('subcategoryId', selectedSubcategory);
      }
      
      const response = await apiClient.get(`/vehicles?${params.toString()}`);
      
      if (response.success && response.data) {
        const data = response.data as any;
        setTotalItems(data.pagination?.totalCount || data.data.length);
        setTotalPages(data.pagination?.totalPages || Math.ceil(data.data.length / limit));
        setPaginatedVehicles(data.data);
      }
    } catch (error) {
    }
  };

  // Load all data on component mount
  useEffect(() => {
    refreshData();
  }, []);

  // Initial fetch for vehicles when vehicles tab is active
  useEffect(() => {
    if (activeTab === 'vehicles') {
      fetchVehiclesWithPagination(currentPage, itemsPerPage);
    }
  }, [activeTab]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (activeTab === 'vehicles' && (searchTerm || selectedCategory || selectedSubcategory)) {
      setCurrentPage(1);
    }
  }, [searchTerm, selectedCategory, selectedSubcategory, activeTab]);

  // Fetch vehicles with pagination when vehicles tab is active or page/filters change
  useEffect(() => {
    if (activeTab === 'vehicles') {
      fetchVehiclesWithPagination(currentPage, itemsPerPage);
    }
  }, [activeTab, currentPage, itemsPerPage, searchTerm, selectedCategory, selectedSubcategory]);

  const getFilteredData = (): any[] => {
    const filtered = searchTerm.toLowerCase();
    
    switch (activeTab) {
      case 'categories':
        return categories.filter(cat => 
          cat.name.toLowerCase().includes(filtered) || 
          cat.description.toLowerCase().includes(filtered)
        );
      case 'subcategories':
        return categories.flatMap(cat => 
          cat.subcategories.map(sub => ({ ...sub, categoryName: cat.name }))
        ).filter(sub => 
          sub.name.toLowerCase().includes(filtered) || 
          sub.categoryName.toLowerCase().includes(filtered)
        );
      case 'vehicles':
        // For vehicles, we now use server-side pagination, so return paginated vehicles
        return paginatedVehicles;
      default:
        return [];
    }
  };

  const { confirmDelete } = useConfirmation();

  // Get subcategories for selected category
  const getSubcategories = () => {
    const category = categories.find(cat => cat.id === selectedCategory);
    return category?.subcategories || [];
  };

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory(null);
  }, [selectedCategory]);

  // Reset search and pagination
  const resetSearch = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalItems(0);
    setPaginatedVehicles([]);
  };

  const handleDelete = async (type: string, id: string, name?: string) => {
    const itemName = name || type;
    const confirmed = await confirmDelete(itemName);
    
    if (confirmed) {
      try {
        switch (type) {
          case 'category':
            await deleteCategory(id);
            break;
          case 'subcategory':
            await deleteSubcategory(id);
            break;
          case 'vehicle':
            await deleteVehicle(id);
            break;
        }
      } catch (err) {
      }
    }
  };

  const handleToggleActive = async (type: string, id: string) => {
    try {
      switch (type) {
        case 'category':
          await toggleCategoryStatus(id);
          break;
        case 'subcategory':
          await toggleSubcategoryStatus(id);
          break;
        case 'vehicle':
          await toggleVehicleStatus(id);
          break;
      }
    } catch (err) {
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingItem) {
        // Update existing item
        switch (activeTab) {
          case 'categories':
            await updateCategory(editingItem.id, data);
            break;
          case 'subcategories':
            await updateSubcategory(editingItem.id, data);
            break;
          case 'vehicles':
            await updateVehicle(editingItem.id, data);
            break;
        }
      } else {
        // Create new item
        switch (activeTab) {
          case 'categories':
            await createCategory(data);
            break;
          case 'subcategories':
            await createSubcategory(data);
            break;
          case 'vehicles':
            await createVehicle(data);
            break;
        }
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Development Mode Indicator */}
      {isUsingMockData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.725-1.36 3.49 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Development Mode
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Backend API is not available. Using mock data for development. Changes will not persist.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
          <p className="text-gray-600">Manage categories, subcategories, and vehicles</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={activeTab === 'subcategories' && categories.length === 0}
          className={`mt-4 sm:mt-0 inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'subcategories' && categories.length === 0
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {activeTab === 'categories' ? 'Category' : activeTab === 'subcategories' ? 'Subcategory' : 'Vehicle'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={resetSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {activeTab === 'vehicles' && (
            <>
              {/* Category Filter */}
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
                className="min-w-[150px]"
              />

              {/* Subcategory Filter */}
              <Dropdown
                options={[
                  { value: '', label: 'All Subcategories' },
                  ...getSubcategories().map(subcategory => ({
                    value: subcategory.id,
                    label: subcategory.name
                  }))
                ]}
                value={selectedSubcategory || ''}
                onChange={(value) => setSelectedSubcategory(value as string || null)}
                placeholder={getSubcategories().length === 0 ? "No subcategories" : "All Subcategories"}
                size="sm"
                className="min-w-[150px]"
                disabled={!selectedCategory}
              />

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'card'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'categories' && (
          <div className="p-6">
            <div className="space-y-4">
              {getFilteredData().map((category: Category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg bg-${category.color}-100 flex items-center justify-center`}>
                      <Car className={`w-5 h-5 text-${category.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500 truncate max-w-xs" title={category.description}>
                        {category.description}
                      </p>
                      <p className="text-xs text-gray-400">{category.subcategories.length} subcategories</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ToggleSwitch
                      checked={category.isActive}
                      onChange={() => handleToggleActive('category', category.id)}
                      size="sm"
                      showLabel={false}
                    />
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('category', category.id, category.name)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'subcategories' && (
          <div className="p-6">
            <div className="space-y-4">
              {getFilteredData().map((subcategory: any) => (
                <motion.div
                  key={subcategory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Tag className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{subcategory.name}</h3>
                      <p className="text-sm text-gray-500 truncate max-w-xs" title={subcategory.description}>
                        {subcategory.description}
                      </p>
                      <p className="text-xs text-gray-400">Under: {subcategory.categoryName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ToggleSwitch
                      checked={subcategory.isActive}
                      onChange={() => handleToggleActive('subcategory', subcategory.id)}
                      size="sm"
                      showLabel={false}
                    />
                    <button
                      onClick={() => handleEdit(subcategory)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit subcategory"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('subcategory', subcategory.id, subcategory.name)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete subcategory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="p-6">
            {viewMode === 'list' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehicle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pricing
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredData().map((vehicle: Vehicle) => (
                      <motion.tr
                        key={vehicle.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                              <Car className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs" title={vehicle.description}>
                                {vehicle.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {categories.find(cat => cat.id === vehicle.categoryId)?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {categories.find(cat => cat.id === vehicle.categoryId)?.subcategories.find(sub => sub.id === vehicle.subcategoryId)?.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            vehicle.type === 'rental' ? 'bg-blue-100 text-blue-800' :
                            vehicle.type === 'sale' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {vehicle.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle.dailyRate && <div>${vehicle.dailyRate}/day</div>}
                          {vehicle.weeklyRate && <div className="text-xs text-gray-600">${vehicle.weeklyRate}/week</div>}
                          {vehicle.salePrice && <div>${vehicle.salePrice} sale</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ToggleSwitch
                            checked={vehicle.isActive}
                            onChange={() => handleToggleActive('vehicle', vehicle.id)}
                            size="sm"
                            showLabel={false}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(vehicle)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('vehicle', vehicle.id, `${vehicle.year} ${vehicle.make} ${vehicle.model}`)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getFilteredData().map((vehicle: Vehicle, index: number) => {
                  const category = categories.find(cat => cat.id === vehicle.categoryId);
                  const subcategory = category?.subcategories.find(sub => sub.id === vehicle.subcategoryId);
                  
                  return (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      category={category}
                      subcategory={subcategory}
                      index={index}
                      showAdminControls={true}
                      onEdit={handleEdit}
                      onDelete={(vehicle) => handleDelete('vehicle', vehicle.id, `${vehicle.year} ${vehicle.make} ${vehicle.model}`)}
                      onToggleActive={(vehicle) => handleToggleActive('vehicle', vehicle.id)}
                      compact={false}
                    />
                  );
                })}
              </div>
            )}
            
            {/* Pagination Controls - Only for vehicles tab */}
            {activeTab === 'vehicles' && totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
                <div className="flex flex-1 justify-between md:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                
                {/* Medium screen (tablet) pagination */}
                <div className="hidden sm:flex md:hidden flex-1 items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
                
                <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
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
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
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
                        className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 min-w-[60px]"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
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
                            className={`relative inline-flex items-center px-3 py-2 text-sm font-semibold ${
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
        )}
      </div>

      {/* Forms Modal */}
      <VehicleForms
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        type={activeTab === 'categories' ? 'category' : activeTab === 'subcategories' ? 'subcategory' : 'vehicle'}
        editingItem={editingItem}
        categories={categories}
        onSave={handleSave}
      />
    </div>
  );
};

export default VehicleManagement;
