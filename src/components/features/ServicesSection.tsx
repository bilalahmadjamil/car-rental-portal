// src/components/features/ServicesSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Car, Calendar, Wrench, Headphones, CheckCircle, Star } from 'lucide-react';
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
  
  return (
    <section id="services" className={`${styling.section} relative overflow-hidden`}>
      {/* Happy Customers Background */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/happy-customers.png)',
            backgroundPosition: 'center left'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/85 to-white/90"></div>
      </div>
      
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
        
      </div>
    </section>
  );
};

export default ServicesSection;