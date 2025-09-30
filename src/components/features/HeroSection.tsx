// src/components/features/HeroSection.tsx
'use client';

import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const scrollToVehicles = () => {
    const element = document.getElementById('vehicles');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
        duration: 0.6,
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
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
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

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div 
          className="text-center mb-16 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
              Premium Car Rental
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">& Car Sales</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed drop-shadow-lg"
            variants={itemVariants}
          >
            Experience luxury and reliability with our premium vehicle fleet. 
            From daily rentals to long-term leases, or purchase your dream car - we have the perfect solution for your needs.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            variants={itemVariants}
          >
            <motion.button 
              onClick={scrollToVehicles}
              className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-2xl shadow-blue-600/50 hover:shadow-blue-600/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Browse Vehicles</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
            
            <motion.button 
              onClick={() => {
                const vehiclesSection = document.getElementById('vehicles');
                if (vehiclesSection) {
                  vehiclesSection.scrollIntoView({ behavior: 'smooth' });
                  // Trigger the sale tab after a short delay
                  setTimeout(() => {
                    const saleTab = document.querySelector('[data-tab="sale"]') as HTMLButtonElement;
                    if (saleTab) saleTab.click();
                  }, 500);
                }
              }}
              className="group border-2 border-white/80 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 hover:border-white transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Cars for Sale
            </motion.button>
          </motion.div>
        </motion.div>
        

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.button 
            onClick={scrollToVehicles}
            className="group p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl hover:shadow-white/20 transition-all duration-300"
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