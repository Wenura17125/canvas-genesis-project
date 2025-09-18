import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '../assets/hero-bg.jpg';
import ceremonyLogo from '../assets/ceremony-logo.jpeg';

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-01-28T00:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-navy)]/80 to-[var(--brand-blue)]/60"></div>
      </div>

      {/* Ceremony Logo positioned in the right side where red circle was */}
      <div className="absolute top-1/2 right-8 md:right-16 lg:right-24 transform -translate-y-1/2 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative"
        >
          <img 
            src={ceremonyLogo} 
            alt="ICHR2026 Ceremony Logo" 
            className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 object-contain rounded-full shadow-2xl border-4 border-white/30"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            The 2nd International Conference on
            <span className="block text-[var(--brand-gold)]">Harmony and Reconciliation</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Fostering unity for social cohesion through adaptive digital landscapes
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="text-[var(--brand-gold)]" size={24} />
              <span>28-29 Jan 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-[var(--brand-gold)]" size={24} />
              <span>University of Vavuniya</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.a
              href="#registration"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[var(--brand-gold)] text-[var(--brand-navy)] px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Users size={20} />
              Register Now
            </motion.a>
            <motion.a
              href="#paper-submission"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[var(--brand-navy)] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FileText size={20} />
              Submit a Paper
            </motion.a>
          </div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-semibold mb-4">Conference Countdown</h3>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[var(--brand-gold)]">
                    {value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm uppercase tracking-wide">
                    {unit}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

