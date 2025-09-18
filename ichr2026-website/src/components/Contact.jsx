import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Globe, User } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'ichr2026@vau.ac.lk',
      description: 'Send us your inquiries'
    },
    {
      icon: Globe,
      title: 'Website',
      details: 'www.vau.ac.lk/ichr2026/',
      description: 'Visit our official website'
    },
    {
      icon: MapPin,
      title: 'Location',
      details: 'University of Vavuniya',
      description: 'Pampaimadu, Vavuniya, 43000, Sri Lanka'
    },
    {
      icon: User,
      title: 'Conference Convenor',
      details: 'Mr. G. Naveendrakumar',
      description: 'Director, Harmony Centre'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-[var(--brand-light-gray)]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[var(--brand-navy)] mb-6">Contact Us</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Have questions about the conference? We're here to help. Get in touch with our organizing team 
            for any inquiries about submissions, registration, or general information.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-[var(--brand-navy)] mb-8">Get in Touch</h3>
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-[var(--brand-blue)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <IconComponent className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--brand-navy)] text-lg mb-1">{info.title}</h4>
                        <p className="text-[var(--brand-blue)] font-medium mb-1">{info.details}</p>
                        <p className="text-gray-600 text-sm">{info.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h4 className="font-bold text-[var(--brand-navy)] text-lg mb-4">University Location</h4>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <MapPin size={48} className="mx-auto mb-2" />
                    <p>Interactive Map</p>
                    <p className="text-sm">University of Vavuniya, Sri Lanka</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Send className="text-[var(--brand-blue)] mr-3" size={24} />
                <h3 className="text-2xl font-bold text-[var(--brand-navy)]">Send us a Message</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a subject</option>
                    <option value="paper-submission">Paper Submission</option>
                    <option value="registration">Registration</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="programme">Programme</option>
                    <option value="sponsorship">Sponsorship</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all duration-200"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] text-white py-4 px-8 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                >
                  <Send className="mr-2" size={20} />
                  Send Message
                </motion.button>
              </form>
            </div>

            {/* Quick Contact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <div className="bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-blue)] rounded-xl p-6 text-white">
                <h4 className="text-lg font-bold mb-4">Need Immediate Assistance?</h4>
                <div className="space-y-2 text-sm">
                  <p>• For urgent inquiries, email us directly at ichr2026@vau.ac.lk</p>
                  <p>• Response time: Within 24 hours during business days</p>
                  <p>• For technical issues with submissions, contact our IT support</p>
                  <p>• Follow us on social media for latest updates</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

