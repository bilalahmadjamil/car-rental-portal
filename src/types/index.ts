export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    color: string;
    mileage: number;
    fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
    transmission: 'Manual' | 'Automatic';
    seats: number;
    pricePerWeek: number;
    pricePerDay: number;
    status: 'available' | 'rented' | 'maintenance' | 'sold';
    images: string[];
    features: string[];
    location: string;
    registration: string;
    insuranceExcess: number;
    deposit: number;
  }
  
  export interface Booking {
    id: string;
    userId: string;
    vehicleId: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    createdAt: string;
    contractSigned: boolean;
    paymentMethod: 'cash' | 'card' | 'bank_transfer';
  }
  
  export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    licenseNumber: string;
    role: 'client' | 'admin';
    createdAt: string;
  }
  
  export interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    serviceType: 'rental' | 'sale' | 'purchase' | 'general';
  }