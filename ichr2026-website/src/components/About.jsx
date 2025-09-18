import React from 'react';
import { motion } from 'framer-motion';
import { Target, Globe, Users, Award } from 'lucide-react';

const About = () => {
  const sdgs = [
    { number: 4, title: "Quality Education", description: "Emphasizing digital literacy for inclusive and equitable education" },
    { number: 10, title: "Reduced Inequalities", description: "Addressing digital divides and promoting inclusive digital governance" },
    { number: 16, title: "Peace, Justice, and Strong Institutions", description: "Advancing peaceful societies through digital governance and social reconciliation" },
    { number: 17, title: "Partnerships for the Goals", description: "Fostering international collaboration and interdisciplinary dialogue for sustainable peace" }
  ];

  const mainCommittee = [
    { role: "Conference Chair", name: "Prof. A. Atputharajah", designation: "Vice-Chancellor, University of Vavuniya" },
    { role: "Conference Convenor", name: "Mr. G. Naveendrakumar", designation: "Director, Harmony Centre" },
    { role: "Conference Secretary", name: "Ms. M.R.F. Aqeela", designation: "Senior Lecturer, FBS" },
    { role: "Editor-in-chief", name: "Dr. S. Shanmugathasan", designation: "Acting Librarian" }
  ];

  return (
    <section id="about" className="py-20 bg-[var(--brand-light-gray)]">
      <div className="container mx-auto px-4">
        {/* Preamble */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[var(--brand-navy)] mb-6">About ICHR2026</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            The 2nd International Conference on Harmony and Reconciliation (ICHR2026) brings together 
            researchers, practitioners, and academics to explore the intersection of social harmony, 
            reconciliation, and digital transformation. Following the 1st ICHR held in 2023, this second 
            conference continues the commitment to fostering inclusive dialogue on reconciliation.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            As societies adapt to rapid technological advancements, new challenges and opportunities 
            arise for fostering understanding, equity, and peace across diverse communities. This 
            conference will provide a platform for interdisciplinary dialogue on how digital technologies 
            can both support and hinder efforts in achieving social harmony and reconciliation.
          </p>
        </motion.div>

        {/* SDG Alignment */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-[var(--brand-navy)] text-center mb-8">
            Aligned with UN Sustainable Development Goals
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sdgs.map((sdg, index) => (
              <motion.div
                key={sdg.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[var(--brand-blue)] text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {sdg.number}
                  </div>
                  <Target className="ml-3 text-[var(--brand-gold)]" size={24} />
                </div>
                <h4 className="font-bold text-[var(--brand-navy)] mb-2">{sdg.title}</h4>
                <p className="text-gray-600 text-sm">{sdg.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Harmony Centre */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-8 shadow-lg mb-16"
        >
          <div className="flex items-center mb-6">
            <Globe className="text-[var(--brand-blue)] mr-3" size={32} />
            <h3 className="text-3xl font-bold text-[var(--brand-navy)]">Harmony Centre, University of Vavuniya</h3>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            The Harmony Centre at the University of Vavuniya serves as a hub for research and dialogue 
            on peace, reconciliation, and social harmony. Established to promote understanding and 
            collaboration across diverse communities, the centre focuses on innovative approaches to 
            conflict resolution and peacebuilding in the digital age.
          </p>
        </motion.div>

        {/* Main Committee */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-8">
            <Users className="text-[var(--brand-blue)] mr-3" size={32} />
            <h3 className="text-3xl font-bold text-[var(--brand-navy)]">Main Committee Members</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainCommittee.map((member, index) => (
              <motion.div
                key={member.role}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-navy)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-white" size={24} />
                </div>
                <h4 className="font-bold text-[var(--brand-navy)] mb-2">{member.role}</h4>
                <p className="font-semibold text-gray-800 mb-1">{member.name}</p>
                <p className="text-sm text-gray-600">{member.designation}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

