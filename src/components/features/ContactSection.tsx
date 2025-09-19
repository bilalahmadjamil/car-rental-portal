// src/components/features/ContactSection.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, User, Mail as MailIcon } from 'lucide-react';
import { companyInfo } from '@/data/mockData';
import { ContactFormData } from '@/types';
import { designSystem, getSectionStyling } from '@/utils/designSystem';

const ContactSection = () => {
  const styling = getSectionStyling('contact');
  const { containerVariants, itemVariants } = designSystem.animations;

  const contactInfoVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    serviceType: 'general'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden py-20">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{ 
            y: [0, 30, 0],
            x: [0, -20, 0],
            rotate: [360, 180, 0],
            scale: [1.1, 1, 1.1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full mix-blend-multiply filter blur-2xl opacity-50"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        {/* Additional decorative elements */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-lg"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>
      
      <div className={styling.container}>
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
              Contact Us
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Ready to book your next vehicle? Contact us today for a quote or more information.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Contact Information */}
            <motion.div 
              className="relative"
              variants={contactInfoVariants}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Contact Information
                </h3>
                <motion.div 
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    { icon: <MapPin className="w-6 h-6" />, label: "Address", value: companyInfo.address, color: "from-blue-500 to-cyan-500" },
                    { icon: <Phone className="w-6 h-6" />, label: "Phone", value: companyInfo.phone, color: "from-green-500 to-emerald-500" },
                    { icon: <Mail className="w-6 h-6" />, label: "Email", value: companyInfo.email, color: "from-purple-500 to-pink-500" },
                    { icon: <Clock className="w-6 h-6" />, label: "Business Hours", value: companyInfo.hours, color: "from-orange-500 to-red-500" }
                  ].map((contact, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start group p-4 rounded-xl hover:bg-white/10 transition-all duration-300"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div 
                        className={`w-12 h-12 bg-gradient-to-r ${contact.color} rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <span className="text-white">{contact.icon}</span>
                      </motion.div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-white group-hover:text-blue-200 transition-colors duration-300 mb-1">
                          {contact.label}
                        </p>
                        <p className="text-slate-300 group-hover:text-slate-100 transition-colors duration-300 leading-relaxed">
                          {contact.value}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div 
              className="relative"
              variants={formVariants}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Send us a Message
                </h3>
                <motion.form 
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                <motion.div 
                  className="grid md:grid-cols-2 gap-6"
                  variants={itemVariants}
                >
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold mb-3 text-white flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-300" />
                      First Name *
                    </label>
                    <motion.input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                      placeholder="Enter your first name"
                      whileFocus={{ scale: 1.02, y: -2 }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold mb-3 text-white flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-300" />
                      Last Name *
                    </label>
                    <motion.input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                      placeholder="Enter your last name"
                      whileFocus={{ scale: 1.02, y: -2 }}
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-semibold mb-3 text-white flex items-center">
                    <MailIcon className="w-4 h-4 mr-2 text-green-300" />
                    Email *
                  </label>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                    placeholder="Enter your email address"
                    whileFocus={{ scale: 1.02, y: -2 }}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-semibold mb-3 text-white flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-purple-300" />
                    Phone
                  </label>
                  <motion.input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                    placeholder="Enter your phone number"
                    whileFocus={{ scale: 1.02, y: -2 }}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-semibold mb-3 text-white flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-cyan-300" />
                    Service Type
                  </label>
                  <motion.select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full px-4 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileFocus={{ scale: 1.02, y: -2 }}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="rental">Car Rental</option>
                    <option value="sale">Vehicle Sale</option>
                    <option value="purchase">Vehicle Purchase</option>
                  </motion.select>
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-semibold mb-3 text-white flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-orange-300" />
                    Message *
                  </label>
                  <motion.textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white resize-none transition-all duration-300 shadow-lg hover:shadow-xl"
                    placeholder="Tell us about your requirements..."
                    whileFocus={{ scale: 1.02, y: -2 }}
                  />
                </motion.div>
                
                <motion.button
                  type="submit"
                  className="group w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Send Message
                </motion.button>
              </motion.form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;