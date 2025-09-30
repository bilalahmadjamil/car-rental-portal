// src/components/features/AboutSection.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Star, Shield, Clock, Users, Award } from 'lucide-react';
import { companyInfo } from '@/data/mockData';
import { designSystem, getSectionStyling } from '@/utils/designSystem';

const AboutSection = () => {
  const styling = getSectionStyling('about');
  const { containerVariants, itemVariants, cardVariants } = designSystem.animations;

  const featureVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
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

  const statsVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };
  return (
    <section id="about" className={`${styling.section} relative overflow-hidden`}>
      {/* Happy Customers Background */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: 'url(/happy-customers.png)',
            backgroundPosition: 'center right'
          }}
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-white via-white/95 to-transparent"></div>
      </div>
      
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
              About {companyInfo.name}
            </motion.h2>
            
            <motion.p 
              className={designSystem.typography.sectionSubtitle}
              variants={itemVariants}
            >
              {companyInfo.description}
            </motion.p>
          </motion.div>

              {/* Stats Section */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { icon: <Users className="w-8 h-8" />, number: "1000+", label: "Happy Customers", color: "blue" },
                  { icon: <Award className="w-8 h-8" />, number: "5+", label: "Years Experience", color: "green" },
                  { icon: <Shield className="w-8 h-8" />, number: "24/7", label: "Support", color: "purple" },
                  { icon: <Star className="w-8 h-8" />, number: "4.9/5", label: "Customer Rating", color: "orange" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center group"
                    variants={statsVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        stat.color === 'green' ? 'bg-green-100 text-green-600' :
                        stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                      } group-hover:shadow-lg transition-all duration-300`}
                      variants={iconVariants}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {stat.icon}
                    </motion.div>
                    <div className={`text-3xl font-bold mb-2 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'purple' ? 'text-purple-600' :
                      'text-orange-600'
                    }`}>
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Happy Customers Showcase */}
              <motion.div 
                className="mb-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div 
                  className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 md:p-12 overflow-hidden"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Happy Customers Background Image */}
                  <div className="absolute inset-0">
                    <div 
                      className="w-full h-full bg-cover bg-center bg-no-repeat opacity-20"
                      style={{
                        backgroundImage: 'url(/happy-customers.png)',
                        backgroundPosition: 'center right'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-blue-50/80 via-blue-50/60 to-transparent"></div>
                  </div>
                  
                  <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <motion.div variants={itemVariants}>
                      <motion.div 
                        className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Star className="w-4 h-4 mr-2 fill-current" />
                        Customer Satisfaction
                      </motion.div>
                      
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Happy Customers, Happy Stories
                      </h3>
                      
                      <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        Our customers are at the heart of everything we do. See the joy and satisfaction 
                        that comes from choosing AlifDrives for your automotive needs.
                      </p>
                      
                      <div className="flex items-center space-x-6">
                        <motion.div 
                          className="text-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="text-3xl font-bold text-blue-600">1000+</div>
                          <div className="text-sm text-gray-600">Happy Customers</div>
                        </motion.div>
                        <motion.div 
                          className="text-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="text-3xl font-bold text-green-600">4.9/5</div>
                          <div className="text-sm text-gray-600">Average Rating</div>
                        </motion.div>
                        <motion.div 
                          className="text-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="text-3xl font-bold text-purple-600">98%</div>
                          <div className="text-sm text-gray-600">Satisfaction Rate</div>
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="relative"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        <div 
                          className="w-full h-80 bg-cover bg-center bg-no-repeat"
                          style={{
                            backgroundImage: 'url(/happy-customers.png)',
                            backgroundPosition: 'center'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <p className="text-sm text-gray-700 font-medium">
                              &ldquo;Amazing service! The team made our car rental experience seamless and enjoyable.&rdquo;
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                className="grid md:grid-cols-2 gap-12 items-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={itemVariants}>
                  <h3 className="text-3xl font-bold text-gray-900 mb-8 relative">
                    Why Choose Us?
                    <motion.div 
                      className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: 64 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </h3>
                  <div className="space-y-6">
                    {[
                          { 
                            icon: <CheckCircle className="w-6 h-6" />, 
                            title: "Premium Fleet", 
                            description: "Well-maintained, modern vehicles from top brands",
                            color: "blue"
                          },
                          { 
                            icon: <Clock className="w-6 h-6" />, 
                            title: "Flexible Terms", 
                            description: "Daily, weekly, and monthly rental options",
                            color: "green"
                          },
                          { 
                            icon: <Shield className="w-6 h-6" />, 
                            title: "24/7 Support", 
                            description: "Round-the-clock assistance for all your needs",
                            color: "purple"
                          },
                          { 
                            icon: <Star className="w-6 h-6" />, 
                            title: "Competitive Pricing", 
                            description: "Transparent pricing with no hidden fees",
                            color: "orange"
                          }
                        ].map((feature, index) => (
                          <motion.div
                            key={index}
                            className="flex items-start group cursor-pointer"
                            variants={featureVariants}
                            whileHover={{ x: 10, scale: 1.02 }}
                            transition={{ duration: 0.2 }}
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

                <motion.div 
                  className="relative"
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200 shadow-lg">
                    <div className="absolute top-4 right-4">
                      <motion.div
                        className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Award className="w-4 h-4 text-white" />
                      </motion.div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h3>
                    <div className="space-y-4">
                      {[
                        { label: "ABN", value: companyInfo.abn, icon: <Shield className="w-4 h-4" /> },
                        { label: "Address", value: companyInfo.address, icon: <CheckCircle className="w-4 h-4" /> },
                        { label: "Phone", value: companyInfo.phone, icon: <Clock className="w-4 h-4" /> },
                        { label: "Email", value: companyInfo.email, icon: <Star className="w-4 h-4" /> },
                        { label: "Hours", value: companyInfo.hours, icon: <Users className="w-4 h-4" /> }
                      ].map((info, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center group"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            {info.icon}
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-gray-900 text-sm">
                              {info.label}:
                            </span>
                            <span className="text-gray-600 ml-2">{info.value}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;