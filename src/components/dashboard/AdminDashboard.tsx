'use client';

import { motion } from 'framer-motion';
import { Users, Car, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Users', value: '1,247', icon: Users, color: 'blue', change: '+12%' },
    { label: 'Active Vehicles', value: '89', icon: Car, color: 'green', change: '+5%' },
    { label: 'Monthly Bookings', value: '156', icon: Calendar, color: 'purple', change: '+23%' },
    { label: 'Monthly Revenue', value: '$45,230', icon: DollarSign, color: 'orange', change: '+18%' }
  ];

  const recentBookings = [
    {
      id: 'BK001',
      customer: 'John Smith',
      vehicle: 'Toyota Camry 2023',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      status: 'Active',
      amount: '$450'
    },
    {
      id: 'BK002',
      customer: 'Sarah Johnson',
      vehicle: 'BMW X5 2023',
      startDate: '2024-01-14',
      endDate: '2024-01-18',
      status: 'Pending',
      amount: '$520'
    },
    {
      id: 'BK003',
      customer: 'Mike Wilson',
      vehicle: 'Mercedes C-Class 2023',
      startDate: '2024-01-13',
      endDate: '2024-01-16',
      status: 'Completed',
      amount: '$380'
    }
  ];

  const quickActions = [
    { title: 'Manage Vehicles', description: 'Add, edit, or remove vehicles', icon: Car, href: '/dashboard/vehicles', color: 'blue' },
    { title: 'Manage Bookings', description: 'View and manage all bookings', icon: Calendar, href: '/dashboard/bookings', color: 'green' },
    { title: 'User Management', description: 'Manage customer accounts', icon: Users, href: '/dashboard/users', color: 'purple' },
    { title: 'Analytics', description: 'View detailed analytics', icon: TrendingUp, href: '/dashboard/analytics', color: 'orange' }
  ];

  const alerts = [
    { type: 'warning', message: '3 vehicles need maintenance', icon: AlertCircle },
    { type: 'info', message: 'New booking request from premium customer', icon: Calendar },
    { type: 'success', message: 'Monthly revenue target achieved', icon: CheckCircle }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-blue-800 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-purple-100 text-lg">
          Here&apos;s your AlifDrives admin dashboard overview
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                <p className="text-sm text-green-600 font-medium mt-1">{stat.change} from last month</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-100"
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
                    <p className="font-medium text-gray-900">{booking.customer}</p>
                    <p className="text-sm text-gray-600">{booking.vehicle}</p>
                    <p className="text-xs text-gray-500">{booking.startDate} - {booking.endDate}</p>
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
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <motion.a
                key={action.title}
                href={action.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                  action.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  action.color === 'green' ? 'bg-green-100 text-green-600' :
                  action.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  'bg-orange-100 text-orange-600'
                } group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">System Alerts</h2>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-center space-x-3">
                <alert.icon className="w-5 h-5" />
                <p className="font-medium">{alert.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;