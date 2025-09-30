'use client';

import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  Car, 
  Calendar, 
  User, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import Logo from '../common/Logo';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  userRole: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
}

export default function DashboardLayout({ children, title, userRole }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  // Handle window resize to close mobile sidebar when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  const customerMenuItems = [
    { id: 'overview', label: 'My Dashboard', icon: Home, href: '/dashboard' },
    { id: 'bookings', label: 'My Bookings', icon: Calendar, href: '/dashboard/bookings' },
    { id: 'vehicles', label: 'Browse Vehicles', icon: Car, href: '/dashboard/vehicles' },
    { id: 'rentals', label: 'My Rentals', icon: Calendar, href: '/dashboard/rentals' },
    { id: 'profile', label: 'Profile', icon: User, href: '/dashboard/profile' },
  ];

  const adminMenuItems = [
    { id: 'overview', label: 'Admin Dashboard', icon: Home, href: '/dashboard' },
    { id: 'vehicles', label: 'Manage Vehicles', icon: Car, href: '/dashboard/vehicles' },
    { id: 'bookings', label: 'Manage Bookings', icon: Calendar, href: '/dashboard/bookings' },
    { id: 'users', label: 'Manage Users', icon: User, href: '/dashboard/users' },
    { id: 'payments', label: 'Payments', icon: Settings, href: '/dashboard/payments' },
    { id: 'analytics', label: 'Analytics', icon: Settings, href: '/dashboard/analytics' },
    { id: 'settings', label: 'System Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  const menuItems = isAdmin ? adminMenuItems : customerMenuItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-24 px-6 py-6 border-b border-gray-200">
            <Logo size="lg" showText={false} href="/" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {userRole.toLowerCase().replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile menu button */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
