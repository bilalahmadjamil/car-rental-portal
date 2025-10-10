// src/components/features/ContactSection.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, User, Mail as MailIcon, Phone, Clock } from 'lucide-react';
import { ContactFormData } from '@/types';
import { designSystem, getSectionStyling } from '@/utils/designSystem';
import Dropdown from '../common/Dropdown';

const ContactSection = () => {
  const styling = getSectionStyling('contact');
  const { containerVariants, itemVariants } = designSystem.animations;

  // Simplified animations for better performance
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
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
    alert('Thank you for your message! We will get back to you soon.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden pt-32 pb-20">
      {/* Company Building Background */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/company-building.png)',
            backgroundPosition: 'center right',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-900/80 via-blue-900/75 to-indigo-900/80"></div>
      </div>
      
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
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
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              variants={itemVariants}
            >
              Contact Us
            </motion.h2>
            
            <motion.p 
              className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Get in touch with us for any inquiries about our vehicle rental and sales services.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="flex justify-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Contact Form */}
            <motion.div 
              className="relative w-full max-w-6xl"
              variants={formVariants}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent text-center">
                  Send us a Message
                </h3>
                <motion.form 
                  onSubmit={handleSubmit}
                  className="space-y-8"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                {/* First Row - Name Fields */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={itemVariants}
                >
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-white flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-300" />
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-white flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-300" />
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                      placeholder="Last name"
                    />
                  </div>
                </motion.div>
                
                {/* Second Row - Email and Phone */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={itemVariants}
                >
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-white flex items-center">
                      <MailIcon className="w-4 h-4 mr-2 text-green-300" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                      placeholder="Email address"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-white flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-purple-300" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                      placeholder="Phone number"
                    />
                  </div>
                </motion.div>
                
                {/* Third Row - Service Type */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={itemVariants}
                >
                  <div className="space-y-3">
                    <Dropdown
                      label="Service Type"
                      options={[
                        { 
                          value: 'general', 
                          label: 'General Inquiry', 
                          description: 'General questions or information',
                          icon: <MessageCircle className="w-4 h-4" />
                        },
                        { 
                          value: 'rental', 
                          label: 'Car Rental', 
                          description: 'Rent a vehicle for your needs',
                          icon: <Clock className="w-4 h-4" />
                        },
                        { 
                          value: 'sale', 
                          label: 'Vehicle Sale', 
                          description: 'Purchase a vehicle from us',
                          icon: <User className="w-4 h-4" />
                        },
                        { 
                          value: 'purchase', 
                          label: 'Vehicle Purchase', 
                          description: 'Sell your vehicle to us',
                          icon: <User className="w-4 h-4" />
                        }
                      ]}
                      value={formData.serviceType}
                      onChange={(value) => setFormData(prev => ({ ...prev, serviceType: value as any }))}
                      placeholder="Select service type"
                      size="md"
                      variant="filled"
                      className="bg-white/90 backdrop-blur-sm text-gray-900 shadow-lg hover:shadow-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    {/* Empty div for spacing */}
                  </div>
                </motion.div>
                
                {/* Fourth Row - Message */}
                <motion.div 
                  className="space-y-3"
                  variants={itemVariants}
                >
                  <label className="block text-sm font-semibold text-white flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-orange-300" />
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white resize-none transition-all duration-300 shadow-lg hover:shadow-xl"
                    placeholder="Tell us about your requirements..."
                  />
                </motion.div>
                
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    className="group bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white py-4 px-12 rounded-xl font-bold text-lg hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center min-w-[200px]"
                  >
                    <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Send Message
                  </button>
                </div>
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