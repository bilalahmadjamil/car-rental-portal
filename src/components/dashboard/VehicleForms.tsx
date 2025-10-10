'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Car, Tag, Layers, Trash2 } from 'lucide-react';
import Dropdown from '../common/Dropdown';

interface CategoryFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface SubcategoryFormData {
  categoryId: string;
  name: string;
  description: string;
  sortOrder: number;
}

interface VehicleFormData {
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
}

interface VehicleFormsProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'category' | 'subcategory' | 'vehicle';
  editingItem?: any;
  categories?: any[];
  onSave: (data: any) => void;
}

const VehicleForms = ({ isOpen, onClose, type, editingItem, categories = [], onSave }: VehicleFormsProps) => {
  const [formData, setFormData] = useState(() => {
    if (editingItem) {
      return {
        make: editingItem.make || '',
        model: editingItem.model || '',
        year: editingItem.year || new Date().getFullYear(),
        categoryId: editingItem.categoryId || '',
        subcategoryId: editingItem.subcategoryId || '',
        type: editingItem.type || 'rental',
        dailyRate: editingItem.dailyRate || '',
        weeklyRate: editingItem.weeklyRate || '',
        salePrice: editingItem.salePrice || '',
        description: editingItem.description || '',
        features: editingItem.features || [],
        images: (() => {
          try {
            return typeof editingItem.images === 'string' 
              ? JSON.parse(editingItem.images || '[]') 
              : editingItem.images || [];
          } catch {
            return [];
          }
        })(),
        name: editingItem.name || '',
        icon: editingItem.icon || 'Car',
        color: editingItem.color || 'blue',
        sortOrder: editingItem.sortOrder || 1,
        isActive: editingItem.isActive !== undefined ? editingItem.isActive : true
      };
    }
    
    switch (type) {
      case 'category':
        return { name: '', description: '', icon: 'Car', color: 'blue' };
      case 'subcategory':
        return { 
          categoryId: categories.length > 0 ? categories[0].id : '', 
          name: '', 
          description: '', 
          sortOrder: 1 
        };
      case 'vehicle':
        return {
          make: '',
          model: '',
          year: new Date().getFullYear(),
          categoryId: categories[0]?.id || '',
          subcategoryId: '',
          type: 'rental',
          dailyRate: '',
          weeklyRate: '',
          salePrice: '',
          description: '',
          features: [],
          images: [],
          name: '',
          icon: 'Car',
          color: 'blue',
          sortOrder: 1,
          isActive: true
        };
      default:
        return {};
    }
  });

  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');

  // Update form data when editingItem changes
  useEffect(() => {
    if (editingItem) {
      setFormData({
        make: editingItem.make || '',
        model: editingItem.model || '',
        year: editingItem.year || new Date().getFullYear(),
        categoryId: editingItem.categoryId || '',
        subcategoryId: editingItem.subcategoryId || '',
        type: editingItem.type || 'rental',
        dailyRate: editingItem.dailyRate || '',
        weeklyRate: editingItem.weeklyRate || '',
        salePrice: editingItem.salePrice || '',
        description: editingItem.description || '',
        features: (() => {
          try {
            return typeof editingItem.features === 'string' 
              ? JSON.parse(editingItem.features) 
              : editingItem.features || [];
          } catch {
            return [];
          }
        })(),
        images: (() => {
          try {
            return typeof editingItem.images === 'string' 
              ? JSON.parse(editingItem.images) 
              : editingItem.images || [];
          } catch {
            return [];
          }
        })(),
        name: editingItem.name || '',
        icon: editingItem.icon || 'Car',
        color: editingItem.color || 'blue',
        sortOrder: editingItem.sortOrder || 1,
        isActive: editingItem.isActive !== undefined ? editingItem.isActive : true
      });
    } else {
      // Reset form data for new items
      switch (type) {
        case 'category':
          setFormData({ name: '', description: '', icon: 'Car', color: 'blue' });
          break;
        case 'subcategory':
          setFormData({ 
            categoryId: categories.length > 0 ? categories[0].id : '', 
            name: '', 
            description: '', 
            sortOrder: 1 
          });
          break;
        case 'vehicle':
          setFormData({
            make: '',
            model: '',
            year: new Date().getFullYear(),
            categoryId: categories[0]?.id || '',
            subcategoryId: '',
            type: 'rental',
            dailyRate: '',
            weeklyRate: '',
            salePrice: '',
            description: '',
            features: [],
            images: [],
            name: '',
            icon: 'Car',
            color: 'blue',
            sortOrder: 1,
            isActive: true
          });
          break;
        default:
          setFormData({});
      }
    }
  }, [editingItem, type, categories]);

  // Update categoryId when categories are loaded and form is for subcategory
  useEffect(() => {
    if (type === 'subcategory' && categories.length > 0 && (!formData.categoryId || formData.categoryId === '')) {
      setFormData((prev: any) => ({
        ...prev,
        categoryId: categories[0].id
      }));
    }
  }, [categories, type, formData.categoryId]);

  // Reset subcategory when category changes for vehicle form
  useEffect(() => {
    if (type === 'vehicle' && formData.categoryId) {
      setFormData((prev: any) => ({
        ...prev,
        subcategoryId: ''
      }));
    }
  }, [formData.categoryId, type]);

  const colors = [
    { name: 'blue', class: 'bg-blue-100 text-blue-600' },
    { name: 'green', class: 'bg-green-100 text-green-600' },
    { name: 'purple', class: 'bg-purple-100 text-purple-600' },
    { name: 'orange', class: 'bg-orange-100 text-orange-600' },
    { name: 'red', class: 'bg-red-100 text-red-600' },
    { name: 'yellow', class: 'bg-yellow-100 text-yellow-600' }
  ];

  const icons = ['Car', 'Truck', 'Bus', 'Motorcycle'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter data based on type to only send required fields
    let dataToSend: any = formData;
    
    if (type === 'subcategory') {
      
      // Validate that categoryId is selected
      if (!formData.categoryId || formData.categoryId === '') {
        alert('Please select a category');
        return;
      }
      
      dataToSend = {
        categoryId: formData.categoryId,
        name: formData.name,
        description: formData.description,
        sortOrder: formData.sortOrder || 0,
        isActive: true
      };
    } else if (type === 'category') {
      dataToSend = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        color: formData.color
      };
    } else if (type === 'vehicle') {
      dataToSend = {
        make: formData.make,
        model: formData.model,
        year: formData.year,
        categoryId: formData.categoryId || undefined,
        subcategoryId: formData.subcategoryId || undefined,
        type: formData.type,
        dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : 0,
        weeklyRate: formData.weeklyRate ? parseFloat(formData.weeklyRate) : 0,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : 0,
        description: formData.description,
        features: formData.features || [],
        images: formData.images || []
      };
    }
    
    onSave(dataToSend);
    onClose();
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      // Check if the input looks like an array format
      const trimmedFeature = newFeature.trim();
      if (trimmedFeature.startsWith('[') && trimmedFeature.endsWith(']')) {
        try {
          // Parse the array and add each feature separately
          const featuresArray = JSON.parse(trimmedFeature);
          if (Array.isArray(featuresArray)) {
            setFormData((prev: any) => ({
              ...prev,
              features: [...(prev.features || []), ...featuresArray.map(f => f.trim()).filter(f => f)]
            }));
            setNewFeature('');
            return;
          }
        } catch (error) {
          // If parsing fails, treat as regular input
        }
      }
      
      // Regular single feature addition
      setFormData((prev: any) => ({
        ...prev,
        features: [...(prev.features || []), trimmedFeature]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      features: (prev.features || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      images: (prev.images || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const getSubcategories = () => {
    const category = categories.find(cat => cat.id === formData.categoryId);
    return category?.subcategories || [];
  };

  if (!isOpen) return null;

  // Check if trying to create subcategory without categories
  if (type === 'subcategory' && categories.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">No Categories Available</h2>
            <p className="text-gray-600 mb-6">
              You need to create at least one category before creating subcategories.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if trying to create subcategory but no valid categoryId is set
  if (type === 'subcategory' && (!formData.categoryId || formData.categoryId === '')) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Loading Categories...</h2>
            <p className="text-gray-600 mb-6">
              Please wait while categories are being loaded.
            </p>
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingItem ? 'Edit' : 'Add'} {type === 'category' ? 'Category' : type === 'subcategory' ? 'Subcategory' : 'Vehicle'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {type === 'category' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Dropdown
                    label="Icon"
                    options={icons.map(icon => ({
                      value: icon,
                      label: icon,
                      icon: icon === 'Car' ? <Car className="w-4 h-4" /> : undefined
                    }))}
                    value={formData.icon}
                    onChange={(value) => setFormData((prev: any) => ({ ...prev, icon: value }))}
                    placeholder="Select icon"
                    size="md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex space-x-2">
                    {colors.map(color => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setFormData((prev: any) => ({ ...prev, color: color.name }))}
                        className={`w-8 h-8 rounded-full ${color.class} ${
                          formData.color === color.name ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {type === 'subcategory' && (
            <>
              <div>
                <Dropdown
                  label="Category"
                  options={categories.map(category => ({
                    value: category.id,
                    label: category.name,
                    description: category.description,
                    icon: <Layers className="w-4 h-4" />
                  }))}
                  value={formData.categoryId}
                  onChange={(value) => setFormData((prev: any) => ({ ...prev, categoryId: value }))}
                  placeholder="Select category"
                  size="md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <input
                  type="number"
                  value={formData.sortOrder || 1}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, sortOrder: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </>
          )}

          {type === 'vehicle' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                  <input
                    type="text"
                    value={formData.make}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, make: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, model: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, year: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>
                <div>
                  <Dropdown
                    label="Category"
                    options={categories.map(category => ({
                      value: category.id,
                      label: category.name,
                      description: category.description
                    }))}
                    value={formData.categoryId}
                    onChange={(value) => setFormData((prev: any) => ({ ...prev, categoryId: value, subcategoryId: '' }))}
                    placeholder="Select category"
                    size="md"
                    required
                  />
                </div>
                <div>
                  <Dropdown
                    label="Subcategory"
                    options={getSubcategories().map((subcategory: any) => ({
                      value: subcategory.id,
                      label: subcategory.name,
                      description: subcategory.description
                    }))}
                    value={formData.subcategoryId}
                    onChange={(value) => setFormData((prev: any) => ({ ...prev, subcategoryId: value }))}
                    placeholder={getSubcategories().length === 0 
                      ? "No subcategories available - create one first"
                      : "Select subcategory"
                    }
                    size="md"
                    required
                    emptyMessage="No subcategories available - create one first"
                  />
                </div>
              </div>
              <div>
                <Dropdown
                  label="Type"
                  options={[
                    { value: 'rental', label: 'Rental', description: 'Available for rent only' },
                    { value: 'sale', label: 'Sale', description: 'Available for purchase only' },
                    { value: 'both', label: 'Both', description: 'Available for both rent and sale' }
                  ]}
                  value={formData.type}
                  onChange={(value) => setFormData((prev: any) => ({ ...prev, type: value as any }))}
                  placeholder="Select type"
                  size="md"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily Rate ($)</label>
                  <input
                    type="number"
                    value={formData.dailyRate || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, dailyRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 50.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Rate ($)</label>
                  <input
                    type="number"
                    value={formData.weeklyRate || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, weeklyRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 300.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price ($)</label>
                  <input
                    type="number"
                    value={formData.salePrice || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, salePrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 25000.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder='Add a feature or array: ["Feature1", "Feature2"]'
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.features || []).map((feature: any, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Images
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addImage();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Image
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(formData.images || []).map((image: any, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {image.length > 30 ? `${image.substring(0, 30)}...` : image}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VehicleForms;
