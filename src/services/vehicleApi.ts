// API service for vehicle management
import { API_CONFIG, API_ENDPOINTS, HTTP_METHODS, HTTP_STATUS } from '../config/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
}

interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  updatedAt: string;
  availability?: {
    available: boolean;
    reason?: string;
    conflictingRentals?: Array<{
      id: string;
      startDate: string;
      endDate: string;
    }>;
    conflictingSales?: Array<{
      id: string;
      status: string;
    }>;
  };
}

interface CreateCategoryDto {
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  isActive?: boolean;
}

interface CreateSubcategoryDto {
  categoryId: string;
  name: string;
  description: string;
  sortOrder: number;
}

interface UpdateSubcategoryDto extends Partial<CreateSubcategoryDto> {
  isActive?: boolean;
}

interface CreateVehicleDto {
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
}

interface UpdateVehicleDto extends Partial<CreateVehicleDto> {
  isActive?: boolean;
}

class VehicleApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('accessToken');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout. Please try again.',
        };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  // Category API methods
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>(API_ENDPOINTS.CATEGORIES);
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return this.request<Category>(API_ENDPOINTS.CATEGORY_BY_ID(id));
  }

  async createCategory(category: CreateCategoryDto): Promise<ApiResponse<Category>> {
    return this.request<Category>(API_ENDPOINTS.CATEGORIES, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: string, category: UpdateCategoryDto): Promise<ApiResponse<Category>> {
    return this.request<Category>(API_ENDPOINTS.CATEGORY_BY_ID(id), {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_ENDPOINTS.CATEGORY_BY_ID(id), {
      method: HTTP_METHODS.DELETE,
    });
  }

  async toggleCategoryStatus(id: string): Promise<ApiResponse<Category>> {
    return this.request<Category>(API_ENDPOINTS.CATEGORY_TOGGLE_STATUS(id), {
      method: HTTP_METHODS.PATCH,
    });
  }

  // Subcategory API methods
  async getSubcategories(categoryId?: number): Promise<ApiResponse<Subcategory[]>> {
    const endpoint = categoryId ? `${API_ENDPOINTS.SUBCATEGORIES}?categoryId=${categoryId}` : API_ENDPOINTS.SUBCATEGORIES;
    return this.request<Subcategory[]>(endpoint);
  }

  async getSubcategory(id: string): Promise<ApiResponse<Subcategory>> {
    return this.request<Subcategory>(API_ENDPOINTS.SUBCATEGORY_BY_ID(id));
  }

  async createSubcategory(subcategory: CreateSubcategoryDto): Promise<ApiResponse<Subcategory>> {
    return this.request<Subcategory>(API_ENDPOINTS.SUBCATEGORIES, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(subcategory),
    });
  }

  async updateSubcategory(id: string, subcategory: UpdateSubcategoryDto): Promise<ApiResponse<Subcategory>> {
    return this.request<Subcategory>(API_ENDPOINTS.SUBCATEGORY_BY_ID(id), {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(subcategory),
    });
  }

  async deleteSubcategory(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_ENDPOINTS.SUBCATEGORY_BY_ID(id), {
      method: HTTP_METHODS.DELETE,
    });
  }

  async toggleSubcategoryStatus(id: string): Promise<ApiResponse<Subcategory>> {
    return this.request<Subcategory>(API_ENDPOINTS.SUBCATEGORY_TOGGLE_STATUS(id), {
      method: HTTP_METHODS.PATCH,
    });
  }

  // Vehicle API methods
  async getVehicles(filters?: {
    categoryId?: number;
    subcategoryId?: number;
    type?: 'rental' | 'sale' | 'both';
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Vehicle[]>> {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters?.subcategoryId) params.append('subcategoryId', filters.subcategoryId.toString());
    if (filters?.type) params.append('type', filters.type);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const endpoint = params.toString() ? `${API_ENDPOINTS.VEHICLES}?${params.toString()}` : API_ENDPOINTS.VEHICLES;
    
    return this.request<Vehicle[]>(endpoint);
  }

  async getVehicle(id: string): Promise<ApiResponse<Vehicle>> {
    return this.request<Vehicle>(API_ENDPOINTS.VEHICLE_BY_ID(id));
  }

  async createVehicle(vehicle: CreateVehicleDto): Promise<ApiResponse<Vehicle>> {
    return this.request<Vehicle>(API_ENDPOINTS.VEHICLES, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(vehicle),
    });
  }

  async updateVehicle(id: string, vehicle: UpdateVehicleDto): Promise<ApiResponse<Vehicle>> {
    return this.request<Vehicle>(API_ENDPOINTS.VEHICLE_BY_ID(id), {
      method: HTTP_METHODS.PATCH,
      body: JSON.stringify(vehicle),
    });
  }

  async deleteVehicle(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_ENDPOINTS.VEHICLE_BY_ID(id), {
      method: HTTP_METHODS.DELETE,
    });
  }

  async toggleVehicleStatus(id: string): Promise<ApiResponse<Vehicle>> {
    return this.request<Vehicle>(API_ENDPOINTS.VEHICLE_TOGGLE_STATUS(id), {
      method: HTTP_METHODS.PATCH,
    });
  }

  // Bulk operations
  async bulkUpdateVehicles(vehicleIds: number[], updates: Partial<Vehicle>): Promise<ApiResponse<Vehicle[]>> {
    return this.request<Vehicle[]>(API_ENDPOINTS.VEHICLE_BULK_UPDATE, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify({ vehicleIds, updates }),
    });
  }

  async bulkDeleteVehicles(vehicleIds: number[]): Promise<ApiResponse<void>> {
    return this.request<void>(API_ENDPOINTS.VEHICLE_BULK_DELETE, {
      method: HTTP_METHODS.DELETE,
      body: JSON.stringify({ vehicleIds }),
    });
  }

  // Analytics
  async getVehicleStats(): Promise<ApiResponse<{
    totalVehicles: number;
    activeVehicles: number;
    vehiclesByType: Record<string, number>;
    vehiclesByCategory: Record<string, number>;
    recentVehicles: Vehicle[];
  }>> {
    return this.request(API_ENDPOINTS.VEHICLE_STATS);
  }
}

export const vehicleApi = new VehicleApiService();
export type {
  Category,
  Subcategory,
  Vehicle,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubcategoryDto,
  UpdateSubcategoryDto,
  CreateVehicleDto,
  UpdateVehicleDto,
  ApiResponse,
};
