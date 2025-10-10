// src/components/features/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Calendar, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Sync with filter section dates for bidirectional communication
  useEffect(() => {
    const loadDatesFromStorage = () => {
      const storedFromDate = localStorage.getItem('searchFromDate');
      const storedToDate = localStorage.getItem('searchToDate');
      
      // Set dates from localStorage or clear if not found
      setFromDate(storedFromDate || '');
      setToDate(storedToDate || '');
    };

    // Load dates on mount
    loadDatesFromStorage();

    // Listen for date updates from filter section
    const handleDateUpdate = () => {
      loadDatesFromStorage();
    };

    window.addEventListener('dateFilterUpdated', handleDateUpdate);

    return () => {
      window.removeEventListener('dateFilterUpdated', handleDateUpdate);
    };
  }, []);

  const scrollToVehicles = () => {
    const element = document.getElementById('vehicles');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle date search and sync with filter section
  const handleDateSearch = () => {
    if (fromDate && toDate) {
      // Calculate days between dates
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const timeDiff = to.getTime() - from.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // Store dates in localStorage for persistence
      localStorage.setItem('searchFromDate', fromDate);
      localStorage.setItem('searchToDate', toDate);
      localStorage.setItem('rentalDays', daysDiff.toString());
      
      // Notify filter section of changes
      window.dispatchEvent(new CustomEvent('dateFilterUpdated'));
    }
    
    // Scroll to vehicles section
    scrollToVehicles();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };


  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/hero-background.png)',
            backgroundAttachment: 'fixed'
          }}
        />
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Gradient Overlay for elegant transition */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-blue-800/20"></div>
        {/* Bottom gradient for smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/90 via-white/50 to-transparent"></div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Floating Elements for Elegance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 right-20 w-4 h-4 bg-white/20 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 left-20 w-6 h-6 bg-blue-400/30 rounded-full"
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <motion.div 
          className="absolute bottom-40 right-40 w-3 h-3 bg-white/40 rounded-full"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <motion.div 
            className="text-center mb-12 md:mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                Premium Car Rental
              </span>
              <br />
              <span className="text-white drop-shadow-2xl">& Car Sales</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
              variants={itemVariants}
            >
              Drive Smart — Quality Cars for Every Budget
            </motion.p>
          </motion.div>
          
          {/* Date Filter Section */}
          <motion.div 
            className="max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl"
              variants={itemVariants}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Find Available Cars</h3>
                <p className="text-white/80 text-sm md:text-base">Select your dates to see available vehicles</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-1">
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-colors duration-200"
                    placeholder="Select start date"
                  />
                </div>
                
                <div className="sm:col-span-1">
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    min={fromDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-colors duration-200"
                    placeholder="Select end date"
                  />
                </div>
                
                <div className="sm:col-span-2 lg:col-span-1">
                  <motion.button
                    onClick={handleDateSearch}
                    disabled={!fromDate || !toDate}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg text-sm md:text-base"
                    whileHover={{ scale: fromDate && toDate ? 1.02 : 1 }}
                    whileTap={{ scale: fromDate && toDate ? 0.98 : 1 }}
                  >
                    <Search className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Search Cars</span>
                    <span className="sm:hidden">Search</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <motion.button 
            onClick={scrollToVehicles}
            className="group p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl hover:shadow-white/20 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <ChevronDown size={32} className="text-white group-hover:text-blue-200 transition-colors drop-shadow-lg" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;