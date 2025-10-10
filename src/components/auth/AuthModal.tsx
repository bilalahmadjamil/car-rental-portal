'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, LogIn } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Logo from '../common/Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSuccess = (data: any) => {
    onSuccess(data);
    onClose();
  };

  const switchMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] backdrop-blur-md bg-black/30 overflow-y-auto"
        onClick={onClose}
        style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'center',
          minHeight: '100vh',
          paddingTop: '2rem',
          paddingBottom: '2rem',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-md mx-4 my-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Logo Container with Background */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-1 text-center border-b border-gray-100 flex justify-center">
                    <Logo size="sm" showText={false} />
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute top-2 right-2 z-10 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 border border-gray-200"
                  >
                    <X className="h-4 w-4" />
                  </button>

          {/* Form Content Area */}
          <div className="px-4 py-3 overflow-y-auto flex-1">
            {/* Mode Toggle */}
            <div className="flex mb-3 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                  mode === 'login'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LogIn className="h-4 w-4" />
                <span className="font-medium">Sign In</span>
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                  mode === 'register'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="h-4 w-4" />
                <span className="font-medium">Sign Up</span>
              </button>
            </div>

            {/* Form Content */}
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <LoginForm
                  key="login"
                  onSuccess={handleSuccess}
                  onSwitchToRegister={switchMode}
                />
              ) : (
                <RegisterForm
                  key="register"
                  onSuccess={handleSuccess}
                  onSwitchToLogin={switchMode}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
