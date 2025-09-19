// src/components/layout/Footer.tsx
'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full mix-blend-multiply filter blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-blue-600/10 rounded-full mix-blend-multiply filter blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full mix-blend-multiply filter blur-2xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 360, 0]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent mb-4">
                Khan Car Rentals
              </h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Your trusted partner for premium car rental and sales services across Australia. 
                Quality, reliability, and customer satisfaction guaranteed.
              </p>
              <div className="flex space-x-3">
                <motion.a 
                  href="#" 
                  className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Facebook className="w-5 h-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="p-3 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Twitter className="w-5 h-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="p-3 bg-gradient-to-r from-pink-600 to-pink-700 rounded-xl hover:from-pink-700 hover:to-pink-800 transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="p-3 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Home', section: 'home' },
                  { name: 'About Us', section: 'about' },
                  { name: 'Services', section: 'services' },
                  { name: 'Vehicles', section: 'vehicles' },
                  { name: 'Car Sales', section: 'sales' },
                  { name: 'Contact', section: 'contact' }
                ].map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <motion.button 
                      onClick={() => scrollToSection(link.section)}
                      className="text-slate-300 hover:text-green-400 transition-all duration-300 hover:translate-x-2 flex items-center group"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {link.name}
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-6">Our Services</h4>
              <ul className="space-y-3">
                {[
                  'Short-term Car Rental',
                  'Long-term Car Rental', 
                  'Car Sales & Purchase',
                  'Accident Replacement',
                  'Vehicle Valuation',
                  'Trade-in Service'
                ].map((service, index) => (
                  <motion.li 
                    key={service}
                    className="text-slate-300 hover:text-purple-400 transition-colors duration-300 flex items-center group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {service}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-6">Contact Info</h4>
              <div className="space-y-4">
                <motion.div 
                  className="flex items-start group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                      73 Besline Street<br />
                      Kuraby QLD 4127<br />
                      Australia
                    </p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <a 
                    href="tel:+61731906640" 
                    className="text-slate-300 hover:text-white transition-colors duration-300"
                  >
                    +61 7 3190 6640
                  </a>
                </motion.div>
                <motion.div 
                  className="flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <a 
                    href="mailto:info@khancarrentals.com.au" 
                    className="text-slate-300 hover:text-white transition-colors duration-300"
                  >
                    info@khancarrentals.com.au
                  </a>
                </motion.div>
                <motion.div 
                  className="flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-slate-300 text-sm group-hover:text-white transition-colors duration-300">
                    Mon-Fri: 8:00 AM - 6:00 PM<br />
                    Sat: 9:00 AM - 4:00 PM<br />
                    Sun: Closed
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Bottom Section */}
        <motion.div 
          className="mt-12 pt-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              <motion.div 
                className="text-center md:text-left"
                variants={itemVariants}
              >
                <p className="text-slate-300 text-sm mb-2">
                  &copy; {currentYear} Khan Car Rentals & Sales. All rights reserved.
                </p>
                <p className="text-slate-400 text-xs">ABN: 86883215944</p>
                <motion.p 
                  className="text-slate-400 text-xs mt-2 flex items-center justify-center md:justify-start"
                  whileHover={{ scale: 1.05 }}
                >
                  Made with <Heart className="w-3 h-3 text-red-500 mx-1" /> for our customers
                </motion.p>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap gap-6 text-sm"
                variants={itemVariants}
              >
                {[
                  { name: 'Privacy Policy', color: 'hover:text-blue-400' },
                  { name: 'Terms of Service', color: 'hover:text-green-400' },
                  { name: 'Cookie Policy', color: 'hover:text-purple-400' },
                  { name: 'Refund Policy', color: 'hover:text-orange-400' }
                ].map((link, index) => (
                  <motion.a 
                    key={link.name}
                    href="#" 
                    className={`text-slate-400 ${link.color} transition-all duration-300 hover:scale-105`}
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="mt-6 pt-6 border-t border-slate-700"
            variants={itemVariants}
          >
            <div className="text-center text-slate-500 text-xs">
              <p>
                Licensed Motor Dealer | Comprehensive Insurance | Quality Guaranteed
              </p>
              <p className="mt-2">
                This website is designed and developed with love for our valued customers
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
