// src/components/features/VehiclesSection.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import { vehicles, vehiclesForSale } from '@/data/mockData';
import { Vehicle } from '@/types';
import { designSystem, getSectionStyling } from '@/utils/designSystem';

const VehicleCard = ({ vehicle, isForSale = false }: { vehicle: Vehicle; isForSale?: boolean }) => {
  const { cardVariants } = designSystem.animations;


  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-200 relative"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Status badge - always visible */}
      <div className="absolute top-4 right-4 z-20">
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          isForSale 
            ? 'bg-orange-100 text-orange-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {isForSale ? 'For Sale' : 'Available'}
        </span>
      </div>

      {/* Vehicle image placeholder */}
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Car className="w-6 h-6 text-gray-500" />
              </div>
              <span className="text-gray-500 text-sm font-medium">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </span>
            </div>
          </div>

      <div className="p-6">
        {/* Vehicle title and specs */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{vehicle.color}</span>
            <span>{vehicle.mileage.toLocaleString()} km</span>
          </div>
        </div>
        
        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          {vehicle.features.slice(0, 3).map((feature, featureIndex) => (
            <span 
              key={featureIndex} 
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {feature}
            </span>
          ))}
        </div>
        
        {/* Pricing section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          {isForSale ? (
            // Sale pricing
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                ${vehicle.pricePerDay * 100}
              </div>
              <div className="text-sm text-gray-600">Purchase Price</div>
            </div>
          ) : (
            // Rental pricing
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-blue-600">
                  ${vehicle.pricePerDay}
                </div>
                <div className="text-sm text-gray-600">per day</div>
              </div>
              <div className="w-px h-8 bg-gray-300 mx-4"></div>
              <div className="text-center flex-1">
                <div className="text-xl font-bold text-gray-900">
                  ${vehicle.pricePerWeek}
                </div>
                <div className="text-sm text-gray-600">per week</div>
              </div>
            </div>
          )}
        </div>
        
        {/* CTA button */}
        <button 
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
            isForSale 
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isForSale ? 'Buy This Vehicle' : 'Rent This Vehicle'}
        </button>
      </div>
    </motion.div>
  );
};

const VehiclesSection = () => {
  const [activeTab, setActiveTab] = useState('rental'); // 'rental' or 'sale'
  const [filter, setFilter] = useState('all');
  
  // Reset filter when switching tabs
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setFilter('all'); // Reset filter when switching tabs
  };
  
  // Also reset filter when activeTab changes (extra safety)
  React.useEffect(() => {
    setFilter('all');
  }, [activeTab]);
  const styling = getSectionStyling('vehicles');
  const { containerVariants, itemVariants } = designSystem.animations;
  
  
  const currentVehicles: Vehicle[] = activeTab === 'rental' ? vehicles : vehiclesForSale;
  
  // Dynamically get available car makes from current vehicles
  const availableMakes = Array.from(new Set(currentVehicles.map(vehicle => vehicle.make)));
  const allMakes = ['all', ...availableMakes];
  
  const filteredVehicles = filter === 'all' 
    ? currentVehicles 
    : currentVehicles.filter((vehicle: Vehicle) => vehicle.make.toLowerCase() === filter.toLowerCase());


  return (
    <section id="vehicles" className={styling.section}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`${designSystem.decorativeElements.floating} bg-blue-100/20`}></div>
        <div className={`${designSystem.decorativeElements.floatingDelayed} bg-emerald-100/20`} style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className={styling.container}>
        <motion.div 
          className={styling.header}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          
          <motion.h2 
            className={designSystem.typography.sectionTitle}
            variants={itemVariants}
          >
            Our Vehicles
          </motion.h2>
          
          <motion.p 
            className={designSystem.typography.sectionSubtitle}
            variants={itemVariants}
          >
            Choose from our premium selection of vehicles available for rental or purchase. 
            Each vehicle is meticulously maintained and selected for comfort, reliability, and exceptional performance.
          </motion.p>
        </motion.div>
        
        {/* Professional Rental vs Sale Tabs */}
        <motion.div 
          className="flex justify-center mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="bg-gray-100 rounded-lg p-1">
            <div className="flex">
              {[
                { key: 'rental', label: 'Rental Vehicles' },
                { key: 'sale', label: 'Vehicles for Sale' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  data-tab={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`px-8 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.key 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Dynamic Filter Controls */}
        {availableMakes.length > 0 && (
          <motion.div 
            className="flex justify-center mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex flex-wrap justify-center gap-2">
              {allMakes.map((make) => (
                <button
                  key={make}
                  onClick={() => setFilter(make)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filter === make 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {make === 'all' ? 'All Vehicles' : make}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Vehicle Grid or No Cars Message */}
        {filteredVehicles.length > 0 ? (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            key={filter} // Re-trigger animation when filter changes
          >
                {filteredVehicles.map((vehicle: Vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} isForSale={activeTab === 'sale'} />
                ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filter === 'all' 
                  ? `No ${activeTab === 'rental' ? 'Rental' : 'Sale'} Vehicles Available`
                  : `No ${filter} Vehicles Available`
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? `We currently don't have any vehicles available for ${activeTab === 'rental' ? 'rental' : 'sale'}. Please check back later or contact us for more information.`
                  : `We don't have any ${filter} vehicles available at the moment. Try selecting a different brand or contact us for availability.`
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => setFilter('all')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  View All Vehicles
                </button>
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* CTA section */}
        <motion.div 
          className="mt-16 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {activeTab === 'rental' 
                ? "Need a Different Vehicle?" 
                : "Looking for Something Specific?"
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'rental' 
                ? "Contact us to discuss your rental requirements."
                : "Contact us to discuss your purchase requirements."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Us
              </button>
              <button 
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                onClick={() => setActiveTab(activeTab === 'rental' ? 'sale' : 'rental')}
              >
                {activeTab === 'rental' ? 'View for Sale' : 'View for Rental'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VehiclesSection;