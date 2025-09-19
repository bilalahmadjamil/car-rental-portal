// Mock data for the car rental application
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

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const companyInfo = {
  name: 'Khan Car Rentals',
  description: 'Your trusted partner for premium car rental and sales services. We provide reliable, well-maintained vehicles with exceptional customer service and competitive pricing.',
  abn: '12 345 678 901',
  address: '123 Main Street, Sydney NSW 2000',
  phone: '+61 2 9876 5432',
  email: 'info@khancarrentals.com.au',
  hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM, Sun: 10AM-2PM'
};

export const services = [
  {
    id: '1',
    title: 'Car Rental',
    description: 'Flexible daily, weekly, and monthly rentals for your convenience',
    icon: 'Car',
    features: ['Daily rates from $60', 'Weekly rates from $350', 'Flexible terms', '24/7 support']
  },
  {
    id: '2',
    title: 'Car Sales',
    description: 'Premium vehicles available for purchase with financing options',
    icon: 'Car',
    features: ['Quality guaranteed', 'Financing available', 'Warranty included', 'Trade-in accepted']
  },
  {
    id: '3',
    title: 'Accident Replacement',
    description: 'Immediate replacement vehicles for insurance claims',
    icon: 'Wrench',
    features: ['Same-day availability', 'Insurance partnerships', 'Seamless process', 'No excess fees']
  }
];

// Vehicles available for rental
export const vehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    color: 'Pearl White',
    mileage: 15000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 120,
    pricePerWeek: 750,
    status: 'available',
    images: ['/images/tesla-model-3.jpg'],
    features: ['Autopilot', 'Premium Sound', 'Glass Roof', 'Supercharging'],
    location: 'Sydney, NSW',
    registration: 'ABC123',
    insuranceExcess: 2000,
    deposit: 500
  },
  {
    id: '2',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    color: 'Silver',
    mileage: 25000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 80,
    pricePerWeek: 500,
    status: 'available',
    images: ['/images/toyota-camry.jpg'],
    features: ['Bluetooth', 'Backup Camera', 'Cruise Control', 'Keyless Entry'],
    location: 'Melbourne, VIC',
    registration: 'DEF456',
    insuranceExcess: 1500,
    deposit: 300
  },
  {
    id: '3',
    make: 'Mitsubishi',
    model: 'Outlander',
    year: 2023,
    color: 'Black',
    mileage: 12000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 7,
    pricePerDay: 90,
    pricePerWeek: 550,
    status: 'available',
    images: ['/images/mitsubishi-outlander.jpg'],
    features: ['AWD', '7 Seats', 'Touchscreen', 'Parking Sensors'],
    location: 'Brisbane, QLD',
    registration: 'GHI789',
    insuranceExcess: 1800,
    deposit: 400
  },
  {
    id: '4',
    make: 'Tesla',
    model: 'Model Y',
    year: 2023,
    color: 'Midnight Silver',
    mileage: 8000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    seats: 7,
    pricePerDay: 140,
    pricePerWeek: 850,
    status: 'available',
    images: ['/images/tesla-model-y.jpg'],
    features: ['Autopilot', 'Premium Sound', 'Glass Roof', 'Supercharging'],
    location: 'Perth, WA',
    registration: 'JKL012',
    insuranceExcess: 2500,
    deposit: 600
  },
  {
    id: '5',
    make: 'Toyota',
    model: 'RAV4',
    year: 2022,
    color: 'Blue',
    mileage: 18000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 95,
    pricePerWeek: 580,
    status: 'available',
    images: ['/images/toyota-rav4.jpg'],
    features: ['AWD', 'Bluetooth', 'Backup Camera', 'Cruise Control'],
    location: 'Adelaide, SA',
    registration: 'MNO345',
    insuranceExcess: 1600,
    deposit: 350
  },
  {
    id: '6',
    make: 'Mitsubishi',
    model: 'Eclipse Cross',
    year: 2023,
    color: 'Red',
    mileage: 10000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 85,
    pricePerWeek: 520,
    status: 'available',
    images: ['/images/mitsubishi-eclipse.jpg'],
    features: ['AWD', 'Touchscreen', 'Parking Sensors', 'Keyless Entry'],
    location: 'Hobart, TAS',
    registration: 'PQR678',
    insuranceExcess: 1400,
    deposit: 300
  }
];

// Vehicles available for purchase
export const vehiclesForSale: Vehicle[] = [
  {
    id: 's1',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    color: 'Alpine White',
    mileage: 22000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 0, // Not applicable for sales
    pricePerWeek: 0, // Not applicable for sales
    status: 'available',
    images: ['/images/bmw-x5.jpg'],
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Premium Sound'],
    location: 'Sydney, NSW',
    registration: 'BMW001',
    insuranceExcess: 3000,
    deposit: 1000
  },
  {
    id: 's2',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2023,
    color: 'Obsidian Black',
    mileage: 15000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 0,
    pricePerWeek: 0,
    status: 'available',
    images: ['/images/mercedes-c-class.jpg'],
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Premium Sound'],
    location: 'Melbourne, VIC',
    registration: 'MBZ002',
    insuranceExcess: 3500,
    deposit: 1200
  },
  {
    id: 's3',
    make: 'Audi',
    model: 'A4',
    year: 2022,
    color: 'Mythos Black',
    mileage: 18000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 0,
    pricePerWeek: 0,
    status: 'available',
    images: ['/images/audi-a4.jpg'],
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Premium Sound'],
    location: 'Brisbane, QLD',
    registration: 'AUD003',
    insuranceExcess: 3200,
    deposit: 1100
  },
  {
    id: 's4',
    make: 'BMW',
    model: '3 Series',
    year: 2023,
    color: 'Mineral Grey',
    mileage: 12000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 0,
    pricePerWeek: 0,
    status: 'available',
    images: ['/images/bmw-3series.jpg'],
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Premium Sound'],
    location: 'Perth, WA',
    registration: 'BMW004',
    insuranceExcess: 2800,
    deposit: 900
  },
  {
    id: 's5',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2022,
    color: 'Diamond White',
    mileage: 20000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 0,
    pricePerWeek: 0,
    status: 'available',
    images: ['/images/mercedes-e-class.jpg'],
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Premium Sound'],
    location: 'Adelaide, SA',
    registration: 'MBZ005',
    insuranceExcess: 4000,
    deposit: 1500
  },
  {
    id: 's6',
    make: 'Audi',
    model: 'Q5',
    year: 2023,
    color: 'Florett Silver',
    mileage: 10000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 0,
    pricePerWeek: 0,
    status: 'available',
    images: ['/images/audi-q5.jpg'],
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Premium Sound'],
    location: 'Hobart, TAS',
    registration: 'AUD006',
    insuranceExcess: 3300,
    deposit: 1300
  }
];
