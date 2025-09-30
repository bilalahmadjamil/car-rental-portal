// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://car-rental-backend-production-d57f.up.railway.app/api/v1',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// API Endpoints
export const API_ENDPOINTS = {
  // Categories
  CATEGORIES: '/vehicles/categories',
  CATEGORY_BY_ID: (id: string) => `/vehicles/categories/${id}`,
  CATEGORY_TOGGLE_STATUS: (id: string) => `/vehicles/categories/${id}/toggle-status`,
  
  // Subcategories
  SUBCATEGORIES: '/vehicles/subcategories',
  SUBCATEGORY_BY_ID: (id: string) => `/vehicles/subcategories/${id}`,
  SUBCATEGORY_TOGGLE_STATUS: (id: string) => `/vehicles/subcategories/${id}/toggle-status`,
  
  // Vehicles
  VEHICLES: '/vehicles',
  VEHICLE_BY_ID: (id: string) => `/vehicles/${id}`,
  VEHICLE_TOGGLE_STATUS: (id: string) => `/vehicles/${id}/toggle-status`,
  VEHICLE_BULK_UPDATE: '/vehicles/bulk-update',
  VEHICLE_BULK_DELETE: '/vehicles/bulk-delete',
  VEHICLE_STATS: '/vehicles/stats',
  
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  USER_PROFILE: '/users/profile',
  
  // Bookings
  BOOKINGS: '/bookings',
  BOOKING_BY_ID: (id: string) => `/bookings/${id}`,
  BOOKING_CANCEL: (id: string) => `/bookings/${id}/cancel`,
  
  // Payments
  PAYMENTS: '/payments',
  PAYMENT_BY_ID: (id: string) => `/payments/${id}`,
  PAYMENT_CREATE_INTENT: '/payments/create-intent',
  PAYMENT_CONFIRM: '/payments/confirm',
  
  // Analytics
  ANALYTICS_DASHBOARD: '/analytics/dashboard',
  ANALYTICS_REVENUE: '/analytics/revenue',
  ANALYTICS_VEHICLES: '/analytics/vehicles',
  ANALYTICS_USERS: '/analytics/users',
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

// Response Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;
