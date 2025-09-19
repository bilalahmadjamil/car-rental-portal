// src/components/features/ServicesSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Car, Calendar, Wrench, Headphones, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { services } from '@/data/mockData';
import { designSystem, getSectionStyling } from '@/utils/designSystem';

const ServiceCard = ({ service, index }: { service: { id: string; title: string; description: string; icon: string; features: string[] }; index: number }) => {
  const { cardVariants } = designSystem.animations;

  const featureVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const iconColors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600', 
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600'
  ];

  const bgGradients = [
    'from-blue-50 to-blue-100',
    'from-green-50 to-green-100',
    'from-purple-50 to-purple-100',
    'from-orange-50 to-orange-100'
  ];

  // Map service icon strings to Lucide components
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car': return <Car className="w-8 h-8" />;
      case 'Calendar': return <Calendar className="w-8 h-8" />;
      case 'Wrench': return <Wrench className="w-8 h-8" />;
      case 'Headphones': return <Headphones className="w-8 h-8" />;
      case '': return <Headphones className="w-8 h-8" />; // Handle corrupted emoji
      default: return <Car className="w-8 h-8" />;
    }
  };

  return (
    <motion.div 
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradients[index % bgGradients.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Content */}
      <div className="relative p-8">
        {/* Icon container with enhanced animation */}
        <motion.div 
          className={`w-20 h-20 bg-gradient-to-br ${iconColors[index % iconColors.length]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
          variants={iconVariants}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-white">
            {getServiceIcon(service.icon)}
          </div>
        </motion.div>
        
        <motion.h3 
          className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300"
          variants={featureVariants}
        >
          {service.title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-600 mb-6 leading-relaxed"
          variants={featureVariants}
        >
          {service.description}
        </motion.p>
        
        <motion.ul 
          className="space-y-3"
          variants={featureVariants}
        >
          {service.features.map((feature: string, featureIndex: number) => (
            <motion.li 
              key={featureIndex} 
              className="flex items-center text-gray-600 text-sm group-hover:text-gray-800 transition-colors duration-300"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <motion.div 
                className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 group-hover:bg-green-600 group-hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.2 }}
              >
                <CheckCircle className="w-3 h-3" />
              </motion.div>
              {feature}
            </motion.li>
          ))}
        </motion.ul>

        {/* Hover action indicator */}
        <motion.div 
          className="mt-6 flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          <span className="text-sm">Learn More</span>
          <motion.div
            className="ml-2"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <Star className="w-8 h-8 text-gray-400" />
      </div>
    </motion.div>
  );
};

const ServicesSection = () => {
  const styling = getSectionStyling('services');
  const { containerVariants, itemVariants } = designSystem.animations;
  
  const ctaVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };
  
  return (
    <section id="services" className={styling.section}>
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className={`${designSystem.decorativeElements.floating} bg-blue-100/30`}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div 
          className={`${designSystem.decorativeElements.floatingDelayed} bg-green-100/30`}
          style={{ animationDelay: '2s' }}
          animate={{ 
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div 
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-100/20 rounded-full blur-xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
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
            Our Services
          </motion.h2>
          
          <motion.p 
            className={designSystem.typography.sectionSubtitle}
            variants={itemVariants}
          >
            We offer comprehensive automotive solutions to meet all your transportation needs.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94] as const
              }}
            >
              <ServiceCard service={service} index={index} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Enhanced CTA section */}
        <motion.div 
          className="text-center"
          variants={ctaVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-12 shadow-2xl border border-blue-100 max-w-4xl mx-auto overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/20 rounded-full translate-y-12 -translate-x-12" />
            
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div 
                className="inline-block mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="w-8 h-8 text-yellow-500" />
              </motion.div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                Contact us today to discuss your specific requirements and discover how we can help you with your automotive needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button 
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Contact Us</span>
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
                
                <motion.button 
                  className="group border-2 border-blue-600 text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
                  onClick={() => document.getElementById('vehicles')?.scrollIntoView({ behavior: 'smooth' })}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>View Vehicles</span>
                  <motion.div
                    className="ml-2"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Car className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;