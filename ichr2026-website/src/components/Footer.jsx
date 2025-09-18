import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import logo from '../assets/ichr2026_logo_placeholder.png';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Call for Papers', href: '#call-for-papers' },
    { name: 'Registration', href: '#registration' },
    { name: 'Programme', href: '#programme' },
    { name: 'Contact', href: '#contact' }
  ];

  const importantDates = [
    { event: 'Paper Submission Deadline', date: 'Sep 23, 2025' },
    { event: 'Notification of Acceptance', date: 'Nov 15, 2025' },
    { event: 'Registration Deadline', date: 'Nov 28, 2025' },
    { event: 'Conference Dates', date: 'Jan 28-29, 2026' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  return (
    <footer className="bg-[var(--brand-navy)] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Conference Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <img src={logo} alt="ICHR2026 Logo" className="h-12 w-auto mr-3" />
              <div>
                <h3 className="text-xl font-bold">ICHR2026</h3>
                <p className="text-sm text-gray-300">Harmony & Reconciliation</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The 2nd International Conference on Harmony and Reconciliation, fostering unity 
              for social cohesion through adaptive digital landscapes.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-[var(--brand-gold)]" />
                <span>University of Vavuniya, Sri Lanka</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-[var(--brand-gold)]" />
                <span>ichr2026@vau.ac.lk</span>
              </div>
              <div className="flex items-center">
                <Globe size={16} className="mr-2 text-[var(--brand-gold)]" />
                <span>www.vau.ac.lk/ichr2026/</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-[var(--brand-gold)] transition-colors duration-200 flex items-center"
                  >
                    <span className="w-2 h-2 bg-[var(--brand-blue)] rounded-full mr-3"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Important Dates */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6">Important Dates</h3>
            <ul className="space-y-3">
              {importantDates.map((date, index) => (
                <li key={index} className="text-sm">
                  <div className="text-gray-300">{date.event}</div>
                  <div className="text-[var(--brand-gold)] font-medium">{date.date}</div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6">Connect With Us</h3>
            <p className="text-gray-300 mb-6 text-sm">
              Stay updated with the latest conference news and announcements.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-[var(--brand-blue)] rounded-full flex items-center justify-center hover:bg-[var(--brand-gold)] transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <IconComponent size={18} />
                  </motion.a>
                );
              })}
            </div>

            {/* Newsletter Signup */}
            <div className="bg-[var(--brand-blue)]/20 rounded-lg p-4">
              <h4 className="font-bold mb-2">Newsletter</h4>
              <p className="text-sm text-gray-300 mb-3">Get conference updates</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
                />
                <button className="bg-[var(--brand-gold)] text-[var(--brand-navy)] px-4 py-2 rounded-r-lg hover:bg-yellow-400 transition-colors duration-200 font-medium text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-white/20 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-300 mb-4 md:mb-0">
              © 2025 ICHR2026 - The 2nd International Conference on Harmony and Reconciliation. 
              All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-[var(--brand-gold)] transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-[var(--brand-gold)] transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-300 hover:text-[var(--brand-gold)] transition-colors duration-200">
                Code of Conduct
              </a>
            </div>
          </div>
          
          <div className="text-center mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400">
              Organized by <span className="text-[var(--brand-gold)] font-medium">Harmony Centre, University of Vavuniya</span>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

