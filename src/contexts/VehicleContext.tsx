'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { vehicleApi, Category, Subcategory, Vehicle, CreateCategoryDto, UpdateCategoryDto, CreateSubcategoryDto, UpdateSubcategoryDto, CreateVehicleDto, UpdateVehicleDto } from '../services/vehicleApi';

// Types are now imported from vehicleApi.ts

interface VehicleContextType {
  // Data
  categories: Category[];
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  isUsingMockData: boolean;

  // Category actions
  createCategory: (category: CreateCategoryDto) => Promise<void>;
  updateCategory: (id: string, category: UpdateCategoryDto) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  toggleCategoryStatus: (id: string) => Promise<void>;

  // Subcategory actions
  createSubcategory: (subcategory: CreateSubcategoryDto) => Promise<void>;
  updateSubcategory: (id: string, subcategory: UpdateSubcategoryDto) => Promise<void>;
  deleteSubcategory: (id: string) => Promise<void>;
  toggleSubcategoryStatus: (id: string) => Promise<void>;

  // Vehicle actions
  createVehicle: (vehicle: CreateVehicleDto) => Promise<void>;
  updateVehicle: (id: string, vehicle: UpdateVehicleDto) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  toggleVehicleStatus: (id: string) => Promise<void>;

  // Utility functions
  getCategoryById: (id: string) => Category | undefined;
  getSubcategoryById: (id: string) => Subcategory | undefined;
  getVehicleById: (id: string) => Vehicle | undefined;
  getVehiclesByCategory: (categoryId: string) => Vehicle[];
  getVehiclesByType: (type: 'rental' | 'sale' | 'both') => Vehicle[];
  getActiveVehicles: () => Vehicle[];

  // Data fetching
  fetchCategories: () => Promise<void>;
  fetchVehicles: (filters?: any) => Promise<void>;
  refreshData: (filters?: any) => Promise<void>;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    refreshData();
  }, []);


  // Data fetching methods
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleApi.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
        setIsUsingMockData(false);
      } else {
        setError(response.error || 'Failed to fetch categories');
      }
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVehicles = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      // If no filters provided, get all vehicles by setting a high limit
      const apiFilters = filters || { limit: 100, isActive: true };
      const response = await vehicleApi.getVehicles(apiFilters);
      if (response.success && response.data) {
        // Handle both old format (array) and new format (paginated object)
        if (Array.isArray(response.data)) {
          setVehicles(response.data);
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          setVehicles((response.data as any).data);
        } else {
          setVehicles([]);
        }
        setIsUsingMockData(false);
      } else {
        setError(response.error || 'Failed to fetch vehicles');
      }
    } catch (err) {
      setError('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async (filters?: any) => {
    await Promise.all([fetchCategories(), fetchVehicles(filters)]);
  }, [fetchCategories, fetchVehicles]);

  // Category actions
  const createCategory = async (categoryData: CreateCategoryDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleApi.createCategory(categoryData);
      if (response.success && response.data) {
        setCategories(prev => [...prev, response.data!]);
      } else {
        setError(response.error || 'Failed to create category');
      }
    } catch (err) {
      setError('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, categoryData: UpdateCategoryDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleApi.updateCategory(id, categoryData);
      if (response.success && response.data) {
        setCategories(prev => prev.map(cat => 
          cat.id === id ? response.data! : cat
        ));
      } else {
        setError(response.error || 'Failed to update category');
      }
    } catch (err) {
      setError('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleApi.deleteCategory(id);
      if (response.success) {
        setCategories(prev => prev.filter(cat => cat.id !== id));
        // Also remove vehicles in this category
        setVehicles(prev => prev.filter(vehicle => vehicle.categoryId !== id));
      } else {
        setError(response.error || 'Failed to delete category');
      }
    } catch (err) {
      setError('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryStatus = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleApi.toggleCategoryStatus(id);
      if (response.success && response.data) {
        setCategories(prev => prev.map(cat => 
          cat.id === id ? response.data! : cat
        ));
      } else {
        setError(response.error || 'Failed to toggle category status');
      }
    } catch (err) {
      setError('Failed to toggle category status');
    } finally {
      setLoading(false);
    }
  };

  // Subcategory actions
  const createSubcategory = async (subcategoryData: CreateSubcategoryDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleApi.createSubcategory(subcategoryData);
      if (response.success && response.data) {
        setCategories(prev => prev.map(cat => 
          cat.id === subcategoryData.categoryId 
            ? { ...cat, subcategories: [...cat.subcategories, response.data!] }
            : cat
        ));
      } else {
        setError(response.error || 'Failed to create subcategory');
      }
    } catch (err) {
      setError('Failed to create subcategory');
    } finally {
      setLoading(false);
    }
  };

  const updateSubcategory = async (id: string, subcategoryData: UpdateSubcategoryDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleApi.updateSubcategory(id, subcategoryData);
      if (response.success && response.data) {
        setCategories(prev => prev.map(cat => ({
          ...cat,
          subcategories: cat.subcategories.map(sub => 
            sub.id === id ? response.data! : sub
          )
        })));
      } else {
        setError(response.error || 'Failed to update subcategory');
      }
    } catch (err) {
      setError('Failed to update subcategory');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubcategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleApi.deleteSubcategory(id);
      if (response.success) {
        setCategories(prev => prev.map(cat => ({
          ...cat,
          subcategories: cat.subcategories.filter(sub => sub.id !== id)
        })));
        // Also remove vehicles in this subcategory
        setVehicles(prev => prev.filter(vehicle => vehicle.subcategoryId !== id));
      } else {
        setError(response.error || 'Failed to delete subcategory');
      }
    } catch (err) {
      setError('Failed to delete subcategory');
    } finally {
      setLoading(false);
    }
  };

  const toggleSubcategoryStatus = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleApi.toggleSubcategoryStatus(id);
      if (response.success && response.data) {
        setCategories(prev => prev.map(cat => ({
          ...cat,
          subcategories: cat.subcategories.map(sub => 
            sub.id === id ? response.data! : sub
          )
        })));
      } else {
        setError(response.error || 'Failed to toggle subcategory status');
      }
    } catch (err) {
      setError('Failed to toggle subcategory status');
    } finally {
      setLoading(false);
    }
  };

  // Vehicle actions
  const createVehicle = async (vehicleData: CreateVehicleDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleApi.createVehicle(vehicleData);
      if (response.success && response.data) {
        setVehicles(prev => [...prev, response.data!]);
      } else {
        setError(response.error || 'Failed to create vehicle');
      }
    } catch (err) {
      setError('Failed to create vehicle');
    } finally {
      setLoading(false);
    }
  };

  const updateVehicle = async (id: string, vehicleData: UpdateVehicleDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleApi.updateVehicle(id, vehicleData);
      if (response.success && response.data) {
        setVehicles(prev => prev.map(vehicle => 
          vehicle.id === id ? response.data! : vehicle
        ));
      } else {
        setError(response.error || 'Failed to update vehicle');
      }
    } catch (err) {
      setError('Failed to update vehicle');
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleApi.deleteVehicle(id);
      if (response.success) {
        setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
      } else {
        setError(response.error || 'Failed to delete vehicle');
      }
    } catch (err) {
      setError('Failed to delete vehicle');
    } finally {
      setLoading(false);
    }
  };

  const toggleVehicleStatus = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleApi.toggleVehicleStatus(id);
      if (response.success && response.data) {
        setVehicles(prev => prev.map(vehicle => 
          vehicle.id === id ? response.data! : vehicle
        ));
      } else {
        setError(response.error || 'Failed to toggle vehicle status');
      }
    } catch (err) {
      setError('Failed to toggle vehicle status');
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const getCategoryById = (id: string) => categories.find(cat => cat.id === id);
  const getSubcategoryById = (id: string) => {
    for (const cat of categories) {
      const sub = cat.subcategories.find(sub => sub.id === id);
      if (sub) return sub;
    }
    return undefined;
  };
  const getVehicleById = (id: string) => vehicles.find(vehicle => vehicle.id === id);
  const getVehiclesByCategory = (categoryId: string) => vehicles.filter(vehicle => vehicle.categoryId === categoryId);
  const getVehiclesByType = (type: 'rental' | 'sale' | 'both') => {
    if (type === 'both') {
      return vehicles; // Return all vehicles when type is 'both'
    }
    return vehicles.filter(vehicle => vehicle.type === type);
  };
  const getActiveVehicles = () => vehicles.filter(vehicle => vehicle.isActive);

  const value: VehicleContextType = {
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
    getCategoryById,
    getSubcategoryById,
    getVehicleById,
    getVehiclesByCategory,
    getVehiclesByType,
    getActiveVehicles,
    fetchCategories,
    fetchVehicles,
    refreshData
  };

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
}
