'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import AdminPortal from '../../components/admin/AdminPortal';

export default function AdminPortalPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    } else if (user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || (user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  return <AdminPortal userRole={user?.role as 'ADMIN' | 'SUPER_ADMIN'} />;
}
