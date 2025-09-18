import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Users, GraduationCap, Eye, CheckCircle, Loader2 } from 'lucide-react';

const Registration = () => {
  const [selectedCategory, setSelectedCategory] = useState('presenting');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    affiliation: '',
    country: '',
    paperTitle: '',
    specialRequirements: '',
    termsAccepted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const registrationFees = [
    {
      id: 'presenting',
      category: 'Presenting Author',
      localFee: '5,000',
      globalFee: '65',
      icon: Users,
      description: 'For authors presenting their research',
      features: ['Conference attendance', 'Paper presentation slot', 'Conference materials', 'Meals and refreshments', 'Certificate of participation']
    },
    {
      id: 'non-presenting',
      category: 'Non-presenting Author',
      localFee: '4,000',
      globalFee: '60',
      icon: Eye,
      description: 'For co-authors not presenting',
      features: ['Conference attendance', 'Conference materials', 'Meals and refreshments', 'Certificate of participation', 'Networking opportunities']
    },
    {
      id: 'spectator',
      category: 'Spectator',
      localFee: '3,000',
      globalFee: '50',
      icon: Eye,
      description: 'For attendees without paper submission',
      features: ['Conference attendance', 'Conference materials', 'Meals and refreshments', 'Certificate of attendance', 'Access to all sessions']
    },
    {
      id: 'student',
      category: 'University Student (Presenters)',
      localFee: 'Free',
      globalFee: 'Free',
      icon: GraduationCap,
      description: 'For university students presenting research',
      features: ['Conference attendance', 'Paper presentation slot', 'Conference materials', 'Meals and refreshments', 'Certificate of participation']
    }
  ];

  const formFields = [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'affiliation', label: 'Institution/Organization', type: 'text', required: true },
    { name: 'country', label: 'Country', type: 'text', required: true },
    { name: 'paperTitle', label: 'Paper Title (if applicable)', type: 'text', required: false },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send data to your backend
      const registrationData = {
        ...formData,
        category: selectedCategory,
        timestamp: new Date().toISOString()
      };
      
      console.log('Registration data:', registrationData);
      setSubmitMessage('Registration submitted successfully! You will receive a confirmation email shortly.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        affiliation: '',
        country: '',
        paperTitle: '',
        specialRequirements: '',
        termsAccepted: false
      });
      
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="registration" className="py-20 bg-[var(--brand-light-gray)]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[var(--brand-navy)] mb-6">Registration</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Join us for two days of inspiring presentations, networking, and collaboration. 
            Choose your registration category below.
          </p>
        </motion.div>

        {/* Registration Categories */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-[var(--brand-navy)] text-center mb-8">Registration Fees</h3>
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {registrationFees.map((fee, index) => {
              const IconComponent = fee.icon;
              return (
                <motion.div
                  key={fee.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                    selectedCategory === fee.id ? 'border-[var(--brand-blue)] ring-2 ring-[var(--brand-blue)]/20' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedCategory(fee.id)}
                >
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-navy)] rounded-full flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="text-white" size={24} />
                    </div>
                    <h4 className="font-bold text-[var(--brand-navy)] text-lg mb-2">{fee.category}</h4>
                    <p className="text-gray-600 text-sm mb-4">{fee.description}</p>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-[var(--brand-blue)] mb-1">
                      {fee.localFee === 'Free' ? 'Free' : `LKR ${fee.localFee}`}
                    </div>
                    <div className="text-lg text-gray-600">
                      {fee.globalFee === 'Free' ? 'Free' : `USD ${fee.globalFee}`}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {fee.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={16} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <CreditCard className="text-[var(--brand-blue)] mr-3" size={32} />
              <h3 className="text-2xl font-bold text-[var(--brand-navy)]">Registration Form</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {formFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      required={field.required}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all duration-200"
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Category <span className="text-red-500">*</span>
                </label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all duration-200"
                >
                  {registrationFees.map((fee) => (
                    <option key={fee.id} value={fee.id}>{fee.category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements or Dietary Restrictions
                </label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all duration-200"
                  placeholder="Please let us know if you have any special requirements..."
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  required
                  className="h-4 w-4 text-[var(--brand-blue)] focus:ring-[var(--brand-blue)] border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" className="text-[var(--brand-blue)] hover:underline">terms and conditions</a> and 
                  <a href="#" className="text-[var(--brand-blue)] hover:underline ml-1">privacy policy</a>
                </label>
              </div>

              {submitMessage && (
                <div className={`p-4 rounded-lg ${submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {submitMessage}
                </div>
              )}

              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] text-white py-4 px-8 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Payment Information */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <div className="bg-[var(--brand-navy)] text-white rounded-xl p-6">
            <h4 className="text-xl font-bold mb-4">Payment Information</h4>
            <div className="space-y-2 text-sm">
              <p>• Registration fees must be paid by November 28, 2025</p>
              <p>• Payment methods: Bank transfer, Credit/Debit card, Online payment</p>
              <p>• Confirmation will be sent via email within 24 hours</p>
              <p>• For group registrations, please contact us directly</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Registration;

