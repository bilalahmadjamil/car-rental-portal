'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { VehicleProvider } from '../../../contexts/VehicleContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import VehicleManagement from '../../../components/dashboard/VehicleManagement';

export default function VehiclesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

  if (!isAdmin) {
    return (
      <DashboardLayout 
        title="Access Denied" 
        userRole={user.role as 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <VehicleProvider>
      <DashboardLayout 
        title="Vehicle Management" 
        userRole={user.role as 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'}
      >
        <VehicleManagement />
      </DashboardLayout>
    </VehicleProvider>
  );
}
