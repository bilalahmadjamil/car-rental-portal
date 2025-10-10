'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Car, CreditCard, Clock, CheckCircle, Star, TrendingUp, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../utils/api';

interface CustomerStats {
  activeBookings: { value: number };
  totalRentals: { value: number };
  totalSpent: { value: number };
  loyaltyPoints: { value: number };
}

interface CustomerBooking {
  id: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  status: string;
  amount: string;
}

interface CustomerDashboardData {
  stats: CustomerStats;
  recentBookings: CustomerBooking[];
  upcomingBookings: CustomerBooking[];
}

// Static data - moved outside component to avoid recreation
const QUICK_ACTIONS = [
  { title: 'Browse Vehicles', description: 'Find your perfect car', icon: Car, href: '/dashboard/vehicles', color: 'blue' },
  { title: 'My Bookings', description: 'View all your bookings', icon: Calendar, href: '/dashboard/bookings', color: 'green' },
  { title: 'Payment History', description: 'Track your payments', icon: CreditCard, href: '/dashboard/payments', color: 'purple' },
  { title: 'Profile Settings', description: 'Manage your account', icon: Star, href: '/dashboard/profile', color: 'orange' }
];

// Utility functions - moved outside component
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Completed': return 'bg-blue-100 text-blue-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<CustomerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/bookings/customer/dashboard-stats');
      
      if (response.success) {
        setDashboardData(response.data as CustomerDashboardData);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Helper function to safely get stat value
  const getStatValue = (stat: any, prefix = '') => {
    const value = stat?.value?.toLocaleString() || '0';
    return prefix ? `${prefix}${value}` : value;
  };

  // Memoized stats configuration
  const statsConfig = useMemo(() => {
    const stats = dashboardData?.stats;
    return [
      { 
        label: 'Active Bookings', 
        value: getStatValue(stats?.activeBookings), 
        icon: Calendar, 
        color: 'blue' 
      },
      { 
        label: 'Total Rentals', 
        value: getStatValue(stats?.totalRentals), 
        icon: Car, 
        color: 'green' 
      },
      { 
        label: 'Total Spent', 
        value: getStatValue(stats?.totalSpent, '$'), 
        icon: CreditCard, 
        color: 'purple' 
      },
      { 
        label: 'Loyalty Points', 
        value: getStatValue(stats?.loyaltyPoints), 
        icon: Star, 
        color: 'orange' 
      }
    ];
  }, [dashboardData]);

  const recentBookings = dashboardData?.recentBookings || [];
  const upcomingBookings = dashboardData?.upcomingBookings || [];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            Loading your AlifDrives dashboard...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            Here&apos;s what&apos;s happening with your AlifDrives account
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error Loading Dashboard</h3>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchDashboardData}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-blue-100 text-lg">
          Here&apos;s what&apos;s happening with your AlifDrives account
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                stat.color === 'green' ? 'bg-green-100 text-green-600' :
                stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <a href="/dashboard/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </a>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{booking.vehicle}</p>
                    <p className="text-sm text-gray-600">{booking.startDate} - {booking.endDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <p className="text-sm font-medium text-gray-900 mt-1">{booking.amount}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
                     {QUICK_ACTIONS.map((action, index) => (
              <motion.a
                key={action.title}
                href={action.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  action.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  action.color === 'green' ? 'bg-green-100 text-green-600' :
                  action.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  'bg-orange-100 text-orange-600'
                } group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Bookings</h2>
        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{booking.vehicle}</p>
                    <p className="text-sm text-gray-600">{booking.startDate} - {booking.endDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <p className="text-sm font-medium text-gray-900 mt-1">{booking.amount}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No upcoming bookings</p>
              <p className="text-sm">Book your next rental to see it here</p>
              <a href="/dashboard/vehicles" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Browse Vehicles
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CustomerDashboard;
