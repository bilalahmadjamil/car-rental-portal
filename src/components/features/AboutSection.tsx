// src/components/features/AboutSection.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Shield } from 'lucide-react';
import { designSystem, getSectionStyling } from '@/utils/designSystem';

const AboutSection = () => {
  const styling = getSectionStyling('about');
  const { containerVariants, itemVariants } = designSystem.animations;



  return (
    <section id="about" className={`${styling.section} relative overflow-hidden`}>
      
      <div className={`${styling.container} relative z-10`}>
        <div className="max-w-6xl mx-auto">
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
              Drive Smart — Quality Cars for Every Budget
            </motion.h2>
            
            <motion.p 
              className={designSystem.typography.sectionSubtitle}
              variants={itemVariants}
            >
              Quality cars for every budget. Simple, affordable, and reliable rentals and sales.
            </motion.p>
          </motion.div>


              <motion.div 
                className="max-w-4xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={itemVariants}>
                  <h3 className="text-3xl font-bold text-gray-900 mb-8 relative text-center">
                    Why Choose Us?
                    <motion.div 
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: 64 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {[
                          { 
                            icon: <CheckCircle className="w-6 h-6" />, 
                            title: "Affordable Rates", 
                            description: "Quality cars for every budget without compromising on value",
                            color: "blue"
                          },
                          { 
                            icon: <CheckCircle className="w-6 h-6" />, 
                            title: "Trusted Service", 
                            description: "Reliable rentals and sales with transparent pricing",
                            color: "green"
                          },
                          { 
                            icon: <CheckCircle className="w-6 h-6" />, 
                            title: "Quality Guaranteed", 
                            description: "Well-maintained vehicles with safety and comfort standards",
                            color: "purple"
                          },
                          { 
                            icon: <Shield className="w-6 h-6" />, 
                            title: "Customer Education", 
                            description: "Help you avoid fines and surcharges with proper guidance",
                            color: "orange"
                          }
                        ].map((feature, index) => (
                          <motion.div
                            key={index}
                            className="flex items-start group cursor-pointer"
                            initial={{ opacity: 0, x: -30, scale: 0.9 }}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ x: 10, scale: 1.02 }}
                          >
                            <motion.div 
                              className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 mt-1 ${
                                feature.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                feature.color === 'green' ? 'bg-green-100 text-green-600' :
                                feature.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                                'bg-orange-100 text-orange-600'
                              } group-hover:shadow-md transition-all duration-300`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              {feature.icon}
                            </motion.div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                {feature.title}
                              </h4>
                              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                          </motion.div>
                        ))}
                  </div>
                </motion.div>
              </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;