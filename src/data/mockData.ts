// Mock data for the car rental application
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  pricePerDay: number;
  pricePerWeek: number;
  features: string[];
  image?: string;
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
    pricePerDay: 120,
    pricePerWeek: 750,
    features: ['Autopilot', 'Premium Sound', 'Glass Roof', 'Supercharging']
  },
  {
    id: '2',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    color: 'Silver',
    mileage: 25000,
    pricePerDay: 80,
    pricePerWeek: 500,
    features: ['Bluetooth', 'Backup Camera', 'Cruise Control', 'Keyless Entry']
  },
  {
    id: '3',
    make: 'Mitsubishi',
    model: 'Outlander',
    year: 2023,
    color: 'Black',
    mileage: 12000,
    pricePerDay: 90,
    pricePerWeek: 550,
    features: ['AWD', '7 Seats', 'Touchscreen', 'Parking Sensors']
  },
  {
    id: '4',
    make: 'Tesla',
    model: 'Model Y',
    year: 2023,
    color: 'Midnight Silver',
    mileage: 8000,
    pricePerDay: 140,
    pricePerWeek: 850,
    features: ['Autopilot', 'Premium Sound', 'Glass Roof', 'Supercharging']
  },
  {
    id: '5',
    make: 'Toyota',
    model: 'RAV4',
    year: 2022,
    color: 'Blue',
    mileage: 18000,
    pricePerDay: 95,
    pricePerWeek: 580,
    features: ['AWD', 'Bluetooth', 'Backup Camera', 'Cruise Control']
  },
  {
    id: '6',
    make: 'Mitsubishi',
    model: 'Eclipse Cross',
    year: 2023,
    color: 'Red',
    mileage: 10000,
    pricePerDay: 85,
    pricePerWeek: 520,
    features: ['AWD', 'Touchscreen', 'Parking Sensors', 'Keyless Entry']
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
    pricePerDay: 0, // Not applicable for sales
    pricePerWeek: 0, // Not applicable for sales
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Premium Sound']
  },
  {
    id: 's2',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2023,
    color: 'Obsidian Black',
    mileage: 15000,
    pricePerDay: 0,
    pricePerWeek: 0,
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Premium Sound']
  },
  {
    id: 's3',
    make: 'Audi',
    model: 'A4',
    year: 2022,
    color: 'Mythos Black',
    mileage: 18000,
    pricePerDay: 0,
    pricePerWeek: 0,
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Premium Sound']
  },
  {
    id: 's4',
    make: 'BMW',
    model: '3 Series',
    year: 2023,
    color: 'Mineral Grey',
    mileage: 12000,
    pricePerDay: 0,
    pricePerWeek: 0,
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Premium Sound']
  },
  {
    id: 's5',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2022,
    color: 'Diamond White',
    mileage: 20000,
    pricePerDay: 0,
    pricePerWeek: 0,
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Premium Sound']
  },
  {
    id: 's6',
    make: 'Audi',
    model: 'Q5',
    year: 2023,
    color: 'Florett Silver',
    mileage: 10000,
    pricePerDay: 0,
    pricePerWeek: 0,
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Premium Sound']
  }
];
