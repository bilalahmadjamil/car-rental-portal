// src/components/features/VehiclesSection.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Calendar, DollarSign } from 'lucide-react';
import { designSystem, getSectionStyling } from '@/utils/designSystem';
import { VehicleProvider } from '../../contexts/VehicleContext';
import VehicleDisplay from './VehicleDisplay';
import Logo from '../common/Logo';

interface VehiclesSectionProps {
  showAllOption?: boolean;
  removeTopPadding?: boolean;
  hideCallToAction?: boolean;
  enablePagination?: boolean;
  showLogo?: boolean;
}

const VehiclesSection = ({ showAllOption = false, removeTopPadding = false, hideCallToAction = false, enablePagination = false, showLogo = false }: VehiclesSectionProps) => {
  const [activeTab, setActiveTab] = useState<'rental' | 'sale' | 'both'>(showAllOption ? 'both' : 'both');
  const baseStyling = getSectionStyling('vehicles');
  const styling = removeTopPadding ? {
    ...baseStyling,
    section: baseStyling.section.replace('py-24', 'pt-0 pb-24')
  } : baseStyling;
  const { containerVariants, itemVariants } = designSystem.animations;

  const tabs = [
    { id: 'rental', label: 'Rental Cars', icon: Calendar, description: 'Browse our rental fleet' },
    { id: 'sale', label: 'Cars for Sale', icon: DollarSign, description: 'Find your perfect car' },
    ...(showAllOption ? [{ id: 'both', label: 'All Vehicles', icon: Car, description: 'View all vehicles' }] : [])
  ];

  return (
    <VehicleProvider>
      <section id="vehicles" className={`${styling.section} relative overflow-hidden`}>
        {/* Enhanced Hero Background */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
              backgroundImage: 'url(/hero-background.png)',
              backgroundPosition: 'center center',
              backgroundAttachment: 'fixed'
            }}
          />
          {/* Multiple gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-blue-800/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/80 to-white/70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          {/* Top gradient for smooth transition from hero */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/95 via-white/80 to-transparent"></div>
        </div>
        
        {/* Simplified background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Static decorative elements - no heavy animations */}
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 bg-gradient-to-br from-blue-400 to-blue-600" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-15 bg-gradient-to-tr from-green-400 to-blue-500" />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div 
            className="text-center mb-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {showLogo ? (
              <motion.div 
                className="flex justify-center mb-4"
                variants={itemVariants}
              >
                <Logo size="lg" showText={false} />
              </motion.div>
            ) : (
              <>
                <motion.h2 
                  className="text-xl md:text-2xl font-bold text-gray-900 mb-1"
                  variants={itemVariants}
                >
                  Find Your Perfect Ride
                </motion.h2>
                <motion.p 
                  className="text-gray-600 text-sm max-w-xl mx-auto"
                  variants={itemVariants}
                >
                  Discover our curated selection of premium vehicles
                </motion.p>
              </>
            )}
          </motion.div>

          {/* Tabs */}
          <motion.div 
            className="flex justify-center mb-6"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-md border border-gray-200">
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Vehicle Display */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <VehicleDisplay 
              key={activeTab}
              type={activeTab}
              showFilters={true}
              enablePagination={enablePagination}
              limit={showAllOption ? undefined : 6}
            />
          </motion.div>

          {/* Call to Action - Only show when not hidden */}
          {!hideCallToAction && (
            <motion.div 
              className="text-center mt-8"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.a
                href="/vehicles"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeTab === 'rental' ? 'Browse All Rentals' : 
                 activeTab === 'sale' ? 'View All Cars for Sale' : 
                 'Explore All Vehicles'}
                <Car className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.a>
            </motion.div>
          )}
        </div>
      </section>
    </VehicleProvider>
  );
};

export default VehiclesSection;