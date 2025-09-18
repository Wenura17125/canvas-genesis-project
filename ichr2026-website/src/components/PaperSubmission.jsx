import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, CheckCircle, Loader2, Calendar, Users, Award } from 'lucide-react';

const PaperSubmission = () => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    authors: '',
    affiliation: '',
    email: '',
    phone: '',
    category: 'research',
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const categories = [
    { id: 'research', name: 'Research Paper', description: 'Original research findings and analysis' },
    { id: 'review', name: 'Review Paper', description: 'Comprehensive review of existing literature' },
    { id: 'case-study', name: 'Case Study', description: 'Detailed analysis of specific cases' },
    { id: 'position', name: 'Position Paper', description: 'Argumentative papers presenting viewpoints' }
  ];

  const guidelines = [
    'Papers should be 6-8 pages in length (excluding references)',
    'Use IEEE conference paper format',
    'Include abstract (150-250 words) and 3-5 keywords',
    'All submissions must be original and unpublished',
    'Papers will undergo double-blind peer review',
    'Accepted papers will be published in conference proceedings'
  ];

  const importantDates = [
    { event: 'Paper Submission Deadline', date: 'November 15, 2025' },
    { event: 'Review Results Notification', date: 'December 20, 2025' },
    { event: 'Camera-Ready Submission', date: 'January 10, 2026' },
    { event: 'Conference Dates', date: 'January 28-29, 2026' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Simulate file upload and form submission
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Here you would typically upload the file and send data to your backend
      const submissionData = {
        ...formData,
        submissionId: `ICHR2026-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'submitted'
      };
      
      console.log('Paper submission data:', submissionData);
      setSubmitMessage('Paper submitted successfully! You will receive a confirmation email with your submission ID shortly.');
      
      // Reset form
      setFormData({
        title: '',
        abstract: '',
        keywords: '',
        authors: '',
        affiliation: '',
        email: '',
        phone: '',
        category: 'research',
        file: null
      });
      
      // Reset file input
      const fileInput = document.getElementById('paper-file');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setSubmitMessage('An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="paper-submission" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[var(--brand-navy)] mb-6">Paper Submission</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Submit your research paper for consideration at ICHR2026. All submissions will undergo 
            rigorous peer review by our expert panel.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Important Dates */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[var(--brand-light-gray)] rounded-xl p-6"
          >
            <div className="flex items-center mb-4">
              <Calendar className="text-[var(--brand-blue)] mr-3" size={24} />
              <h3 className="text-xl font-bold text-[var(--brand-navy)]">Important Dates</h3>
            </div>
            <div className="space-y-3">
              {importantDates.map((item, index) => (
                <div key={index} className="border-l-4 border-[var(--brand-blue)] pl-4">
                  <p className="font-semibold text-gray-800">{item.event}</p>
                  <p className="text-[var(--brand-blue)] font-medium">{item.date}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Submission Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-[var(--brand-light-gray)] rounded-xl p-6"
          >
            <div className="flex items-center mb-4">
              <FileText className="text-[var(--brand-blue)] mr-3" size={24} />
              <h3 className="text-xl font-bold text-[var(--brand-navy)]">Guidelines</h3>
            </div>
            <ul className="space-y-2">
              {guidelines.map((guideline, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700 text-sm">{guideline}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Paper Categories */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-[var(--brand-light-gray)] rounded-xl p-6"
          >
            <div className="flex items-center mb-4">
              <Award className="text-[var(--brand-blue)] mr-3" size={24} />
              <h3 className="text-xl font-bold text-[var(--brand-navy)]">Categories</h3>
            </div>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="border-l-4 border-[var(--brand-gold)] pl-4">
                  <p className="font-semibold text-gray-800">{category.name}</p>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Submission Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-lg border p-8">
            <div className="flex items-center mb-6">
              <Upload className="text-[var(--brand-blue)] mr-3" size={32} />
              <h3 className="text-2xl font-bold text-[var(--brand-navy)]">Submit Your Paper</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paper Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your paper title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abstract <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your abstract (150-250 words)"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all duration-200"
                    placeholder="Enter 3-5 keywords separated by commas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paper Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all duration-200"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Authors <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="authors"
                    value={formData.authors}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all duration-200"
                    placeholder="List all authors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Affiliation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="affiliation"
                    value={formData.affiliation}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all duration-200"
                    placeholder="Institution/Organization"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
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
                    placeholder="Corresponding author email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all duration-200"
                    placeholder="Contact number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Paper <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[var(--brand-blue)] transition-colors duration-200">
                  <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                  <input
                    type="file"
                    id="paper-file"
                    name="file"
                    onChange={handleInputChange}
                    accept=".pdf,.doc,.docx"
                    required
                    className="hidden"
                  />
                  <label htmlFor="paper-file" className="cursor-pointer">
                    <span className="text-[var(--brand-blue)] font-medium hover:underline">
                      Click to upload
                    </span>
                    <span className="text-gray-600"> or drag and drop</span>
                  </label>
                  <p className="text-sm text-gray-500 mt-2">PDF, DOC, or DOCX (max 10MB)</p>
                  {formData.file && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {formData.file.name}
                    </p>
                  )}
                </div>
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
                    Submitting Paper...
                  </>
                ) : (
                  'Submit Paper'
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Access Submission Portal */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-[var(--brand-navy)] text-white rounded-xl p-8 max-w-2xl mx-auto">
            <Users className="mx-auto mb-4" size={48} />
            <h4 className="text-2xl font-bold mb-4">Access Submission Portal</h4>
            <p className="mb-6">
              Already submitted a paper? Access the submission portal to check your submission status, 
              upload revised versions, or view reviewer comments.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[var(--brand-gold)] text-[var(--brand-navy)] px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors duration-200"
            >
              Access Portal
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PaperSubmission;
