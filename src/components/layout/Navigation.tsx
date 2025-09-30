// src/components/layout/Navigation.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogIn, LogOut, ChevronDown, Settings, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';
import Logo from '../common/Logo';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (data: any) => {
    // Auth context will handle the login and redirection
    login(data);
    setIsAuthModalOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isUserDropdownOpen && !target.closest('.user-dropdown')) {
        closeUserDropdown();
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isUserDropdownOpen]);

  return (
    <motion.nav
      className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24 py-2">
                  <motion.div
                    className="h-20 w-56 flex items-center justify-center -ml-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Logo size="nav" showText={false} />
                  </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex space-x-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${activeSection === item.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              ) : isAuthenticated ? (
                <motion.div
                  className="relative user-dropdown"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  {/* User Button */}
                  <motion.button
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {user?.role?.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <a
                            href="/dashboard"
                            onClick={closeUserDropdown}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                          </a>

                          <a
                            href="/dashboard/profile"
                            onClick={closeUserDropdown}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                          >
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </a>

                          <div className="border-t border-gray-100 my-2"></div>

                          <button
                            onClick={() => {
                              closeUserDropdown();
                              logout();
                            }}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 w-full text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.button
                  onClick={handleAuthClick}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Account</span>
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div
                className="flex flex-col space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-3 rounded-lg text-left transition-all duration-300 font-medium ${activeSection === item.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.label}
                  </motion.button>
                ))}

                {/* Mobile Auth Section */}
                {isAuthenticated ? (
                  <div className="mt-4 space-y-2">
                    {/* User Info */}
                    <motion.div
                      className="px-4 py-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Mobile Menu Items */}
                    <motion.a
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg transition-all duration-300 font-medium"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (navItems.length + 1) * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </motion.a>

                    <motion.a
                      href="/dashboard/profile"
                      className="flex items-center space-x-2 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg transition-all duration-300 font-medium"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (navItems.length + 2) * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </motion.a>

                    <motion.button
                      onClick={logout}
                      className="flex items-center space-x-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg transition-all duration-300 font-medium w-full"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (navItems.length + 4) * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    onClick={handleAuthClick}
                    className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-300 font-medium mt-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Account</span>
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </motion.nav>
  );
};

export default Navigation;