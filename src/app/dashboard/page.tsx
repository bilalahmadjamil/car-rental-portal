'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import CustomerDashboard from '../../components/dashboard/CustomerDashboard';
import AdminDashboard from '../../components/dashboard/AdminDashboard';

export default function DashboardPage() {
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

  return (
    <DashboardLayout 
      title="Dashboard" 
      userRole={user.role as 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'}
    >
      {isAdmin ? <AdminDashboard /> : <CustomerDashboard />}
    </DashboardLayout>
  );
}
