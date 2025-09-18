import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, BookOpen, Upload, Award } from 'lucide-react';

const CallForPapers = () => {
  const tracks = [
    "Digital governance and social inclusion",
    "Ethics, equity, and social impact",
    "Literature for peace and reconciliation",
    "Technology-driven conflict resolution",
    "Media narratives and community building",
    "Sustainable development & peacebuilding",
    "Entrepreneurship for social harmony",
    "Community resilience & recovery"
  ];

  const importantDates = [
    { event: "Call for papers", date: "15/Aug/2025", status: "completed" },
    { event: "Full paper submission", date: "23/Sep/2025", status: "upcoming" },
    { event: "Notification", date: "15/Nov/2025", status: "upcoming" },
    { event: "Camera-ready submission", date: "20/Nov/2025", status: "upcoming" },
    { event: "Registration", date: "28/Nov/2025", status: "upcoming" },
    { event: "Conference", date: "28–29/Jan/2026", status: "upcoming" }
  ];

  return (
    <section id="call-for-papers" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[var(--brand-navy)] mb-6">Call for Papers</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We invite researchers, academics, and practitioners to submit original research papers 
            that contribute to our understanding of harmony, reconciliation, and digital transformation.
          </p>
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-blue)] rounded-xl p-8 text-white mb-16"
        >
          <div className="flex items-center mb-4">
            <BookOpen className="mr-3" size={32} />
            <h3 className="text-2xl font-bold">Conference Theme</h3>
          </div>
          <p className="text-xl font-semibold">
            "Fostering unity for social cohesion through adaptive digital landscapes"
          </p>
        </motion.div>

        {/* Conference Tracks */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-[var(--brand-navy)] text-center mb-8">Conference Tracks</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[var(--brand-light-gray)] rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[var(--brand-gold)] rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-gray-800 font-medium">{track}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Important Dates */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center justify-center mb-8">
            <Calendar className="text-[var(--brand-blue)] mr-3" size={32} />
            <h3 className="text-3xl font-bold text-[var(--brand-navy)]">Important Dates</h3>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-[var(--brand-navy)] text-white p-4">
                <div className="grid grid-cols-2 gap-4 font-bold">
                  <div>Event</div>
                  <div>Date</div>
                </div>
              </div>
              {importantDates.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`grid grid-cols-2 gap-4 p-4 border-b border-gray-200 ${
                    item.status === 'completed' ? 'bg-gray-50 text-gray-500' : 'hover:bg-[var(--brand-light-gray)]'
                  }`}
                >
                  <div className="font-medium">{item.event}</div>
                  <div className={`font-semibold ${
                    item.status === 'upcoming' ? 'text-[var(--brand-blue)]' : 'text-gray-500'
                  }`}>
                    {item.date}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Publication & Submission */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <Award className="text-[var(--brand-gold)] mr-3" size={32} />
              <h3 className="text-2xl font-bold text-[var(--brand-navy)]">Publication</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              All accepted full papers will be included in the Conference Proceedings with ISBN and 
              archived in the Research Repository of the University of Vavuniya. The copyright of 
              the published material will be held by the University of Vavuniya.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <FileText className="text-[var(--brand-blue)] mr-3" size={32} />
              <h3 className="text-2xl font-bold text-[var(--brand-navy)]">Submission Guidelines</h3>
            </div>
            <ul className="text-gray-700 space-y-2">
              <li>• Papers should be original and not published elsewhere</li>
              <li>• Follow the conference template for formatting</li>
              <li>• Maximum length: 8 pages including references</li>
              <li>• Submit through the official submission portal</li>
              <li>• All papers will undergo peer review</li>
            </ul>
          </motion.div>
        </div>

        {/* Submission Portal */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] rounded-xl p-8 text-white">
            <Upload className="mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold mb-4">Ready to Submit Your Paper?</h3>
            <p className="text-lg mb-6">
              Join researchers from around the world in advancing harmony and reconciliation through digital innovation.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[var(--brand-gold)] text-[var(--brand-navy)] px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors duration-200"
            >
              Access Submission Portal
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallForPapers;

