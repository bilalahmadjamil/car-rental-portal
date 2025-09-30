# Backend API Requirements for Vehicle Management

This document outlines the required API endpoints and data structures for the vehicle management system.

## Base URL
```
http://localhost:3001/api
```

## Authentication
All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## Data Models

### Category
```typescript
interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
}
```

### Subcategory
```typescript
interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Vehicle
```typescript
interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  categoryId: number;
  subcategoryId: number;
  type: 'rental' | 'sale' | 'both';
  dailyRate?: number;
  salePrice?: number;
  description: string;
  features: string[];
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## API Endpoints

### Categories

#### GET /categories
Get all categories with their subcategories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sedan",
      "description": "Four-door passenger cars",
      "icon": "Car",
      "color": "blue",
      "isActive": true,
      "subcategories": [...],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### POST /categories
Create a new category.

**Request Body:**
```json
{
  "name": "SUV",
  "description": "Sport Utility Vehicles",
  "icon": "Car",
  "color": "green"
}
```

#### PUT /categories/:id
Update a category.

**Request Body:**
```json
{
  "name": "Updated SUV",
  "description": "Updated description",
  "isActive": true
}
```

#### DELETE /categories/:id
Delete a category.

#### PATCH /categories/:id/toggle-status
Toggle category active status.

### Subcategories

#### GET /subcategories
Get all subcategories, optionally filtered by category.

**Query Parameters:**
- `categoryId` (optional): Filter by category ID

#### POST /subcategories
Create a new subcategory.

**Request Body:**
```json
{
  "categoryId": 1,
  "name": "Luxury",
  "description": "High-end sedans",
  "sortOrder": 3
}
```

#### PUT /subcategories/:id
Update a subcategory.

#### DELETE /subcategories/:id
Delete a subcategory.

#### PATCH /subcategories/:id/toggle-status
Toggle subcategory active status.

### Vehicles

#### GET /vehicles
Get all vehicles with optional filtering.

**Query Parameters:**
- `categoryId` (optional): Filter by category
- `subcategoryId` (optional): Filter by subcategory
- `type` (optional): Filter by type (rental, sale, both)
- `isActive` (optional): Filter by active status
- `search` (optional): Search in make, model, description

#### POST /vehicles
Create a new vehicle.

**Request Body:**
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "categoryId": 1,
  "subcategoryId": 2,
  "type": "rental",
  "dailyRate": 120,
  "description": "Reliable and comfortable sedan",
  "features": ["Air Conditioning", "Bluetooth"],
  "images": ["/vehicles/toyota-camry.jpg"]
}
```

#### PUT /vehicles/:id
Update a vehicle.

#### DELETE /vehicles/:id
Delete a vehicle.

#### PATCH /vehicles/:id/toggle-status
Toggle vehicle active status.

### Bulk Operations

#### PUT /vehicles/bulk-update
Update multiple vehicles at once.

**Request Body:**
```json
{
  "vehicleIds": [1, 2, 3],
  "updates": {
    "isActive": false
  }
}
```

#### DELETE /vehicles/bulk-delete
Delete multiple vehicles at once.

**Request Body:**
```json
{
  "vehicleIds": [1, 2, 3]
}
```

### Analytics

#### GET /vehicles/stats
Get vehicle statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVehicles": 50,
    "activeVehicles": 45,
    "vehiclesByType": {
      "rental": 30,
      "sale": 15,
      "both": 5
    },
    "vehiclesByCategory": {
      "Sedan": 20,
      "SUV": 25,
      "Hatchback": 5
    },
    "recentVehicles": [...]
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## HTTP Status Codes

- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## Database Schema Requirements

### Categories Table
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Subcategories Table
```sql
CREATE TABLE subcategories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(category_id, name)
);
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  subcategory_id INTEGER REFERENCES subcategories(id),
  type VARCHAR(10) CHECK (type IN ('rental', 'sale', 'both')) DEFAULT 'rental',
  daily_rate DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  description TEXT,
  features JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Implementation Notes

1. **Authentication**: All endpoints require valid JWT tokens
2. **Validation**: Implement proper input validation for all fields
3. **Error Handling**: Return consistent error responses
4. **Pagination**: Consider implementing pagination for large datasets
5. **Caching**: Implement appropriate caching strategies
6. **Logging**: Log all API requests and responses
7. **Rate Limiting**: Implement rate limiting to prevent abuse
8. **CORS**: Configure CORS for frontend domain
9. **File Upload**: Implement image upload functionality for vehicles
10. **Search**: Implement full-text search for vehicle descriptions

## Testing

The frontend expects the backend to be running on `http://localhost:3001/api`. You can test the integration by:

1. Starting the backend server
2. Running the frontend development server
3. Navigating to the vehicle management page
4. Testing CRUD operations for categories, subcategories, and vehicles
