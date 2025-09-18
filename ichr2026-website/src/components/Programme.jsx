import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Mic, Coffee, Award } from 'lucide-react';

const Programme = () => {
  const [selectedDay, setSelectedDay] = useState('day1');

  const programmeData = {
    day1: {
      date: 'January 28, 2026 (Wednesday)',
      events: [
        {
          time: '08:00 - 09:00',
          title: 'Registration & Welcome Coffee',
          type: 'registration',
          icon: Coffee,
          location: 'Main Lobby',
          description: 'Participant registration and networking over coffee'
        },
        {
          time: '09:00 - 09:30',
          title: 'Opening Ceremony',
          type: 'ceremony',
          icon: Mic,
          location: 'Main Auditorium',
          description: 'Welcome address by Prof. A. Atputharajah, Vice-Chancellor'
        },
        {
          time: '09:30 - 10:30',
          title: 'Keynote Address 1',
          type: 'keynote',
          icon: Mic,
          location: 'Main Auditorium',
          speaker: 'Dr. [To be announced]',
          topic: 'Digital Transformation and Social Harmony'
        },
        {
          time: '10:30 - 11:00',
          title: 'Coffee Break',
          type: 'break',
          icon: Coffee,
          location: 'Conference Lounge'
        },
        {
          time: '11:00 - 12:30',
          title: 'Technical Session 1A: Digital Governance',
          type: 'technical',
          icon: Users,
          location: 'Hall A',
          description: 'Papers on digital governance and social inclusion'
        },
        {
          time: '11:00 - 12:30',
          title: 'Technical Session 1B: Ethics & Equity',
          type: 'technical',
          icon: Users,
          location: 'Hall B',
          description: 'Papers on ethics, equity, and social impact'
        },
        {
          time: '12:30 - 13:30',
          title: 'Lunch Break',
          type: 'break',
          icon: Coffee,
          location: 'Dining Hall'
        },
        {
          time: '13:30 - 15:00',
          title: 'Technical Session 2A: Literature for Peace',
          type: 'technical',
          icon: Users,
          location: 'Hall A',
          description: 'Papers on literature for peace and reconciliation'
        },
        {
          time: '13:30 - 15:00',
          title: 'Technical Session 2B: Technology & Conflict Resolution',
          type: 'technical',
          icon: Users,
          location: 'Hall B',
          description: 'Papers on technology-driven conflict resolution'
        },
        {
          time: '15:00 - 15:30',
          title: 'Tea Break',
          type: 'break',
          icon: Coffee,
          location: 'Conference Lounge'
        },
        {
          time: '15:30 - 16:30',
          title: 'Panel Discussion',
          type: 'panel',
          icon: Users,
          location: 'Main Auditorium',
          topic: 'Future of Digital Peacebuilding'
        },
        {
          time: '16:30 - 17:00',
          title: 'Day 1 Closing & Announcements',
          type: 'ceremony',
          icon: Mic,
          location: 'Main Auditorium'
        }
      ]
    },
    day2: {
      date: 'January 29, 2026 (Thursday)',
      events: [
        {
          time: '08:30 - 09:00',
          title: 'Registration & Morning Coffee',
          type: 'registration',
          icon: Coffee,
          location: 'Main Lobby'
        },
        {
          time: '09:00 - 10:00',
          title: 'Keynote Address 2',
          type: 'keynote',
          icon: Mic,
          location: 'Main Auditorium',
          speaker: 'Prof. [To be announced]',
          topic: 'Community Resilience in the Digital Age'
        },
        {
          time: '10:00 - 10:30',
          title: 'Coffee Break',
          type: 'break',
          icon: Coffee,
          location: 'Conference Lounge'
        },
        {
          time: '10:30 - 12:00',
          title: 'Technical Session 3A: Media & Community Building',
          type: 'technical',
          icon: Users,
          location: 'Hall A',
          description: 'Papers on media narratives and community building'
        },
        {
          time: '10:30 - 12:00',
          title: 'Technical Session 3B: Sustainable Development',
          type: 'technical',
          icon: Users,
          location: 'Hall B',
          description: 'Papers on sustainable development & peacebuilding'
        },
        {
          time: '12:00 - 13:00',
          title: 'Lunch Break',
          type: 'break',
          icon: Coffee,
          location: 'Dining Hall'
        },
        {
          time: '13:00 - 14:30',
          title: 'Technical Session 4A: Entrepreneurship for Harmony',
          type: 'technical',
          icon: Users,
          location: 'Hall A',
          description: 'Papers on entrepreneurship for social harmony'
        },
        {
          time: '13:00 - 14:30',
          title: 'Technical Session 4B: Community Resilience',
          type: 'technical',
          icon: Users,
          location: 'Hall B',
          description: 'Papers on community resilience & recovery'
        },
        {
          time: '14:30 - 15:00',
          title: 'Tea Break',
          type: 'break',
          icon: Coffee,
          location: 'Conference Lounge'
        },
        {
          time: '15:00 - 15:30',
          title: 'Best Paper Awards',
          type: 'award',
          icon: Award,
          location: 'Main Auditorium',
          description: 'Recognition of outstanding research contributions'
        },
        {
          time: '15:30 - 16:30',
          title: 'Closing Ceremony',
          type: 'ceremony',
          icon: Mic,
          location: 'Main Auditorium',
          description: 'Closing remarks and vote of thanks'
        },
        {
          time: '16:30 - 18:00',
          title: 'Ecotourism Activity (Optional)',
          type: 'entertainment',
          icon: MapPin,
          location: 'Vavuniya Area',
          description: 'Guided tour of local cultural and environmental sites'
        }
      ]
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      registration: 'bg-green-100 text-green-800',
      ceremony: 'bg-purple-100 text-purple-800',
      keynote: 'bg-blue-100 text-blue-800',
      technical: 'bg-orange-100 text-orange-800',
      panel: 'bg-indigo-100 text-indigo-800',
      break: 'bg-gray-100 text-gray-800',
      award: 'bg-yellow-100 text-yellow-800',
      entertainment: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const keynoteSpeekers = [
    {
      name: 'Dr. [To be announced]',
      title: 'Expert in Digital Transformation',
      topic: 'Digital Transformation and Social Harmony',
      bio: 'Renowned researcher in the field of digital governance and social inclusion with over 15 years of experience.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Prof. [To be announced]',
      title: 'Community Resilience Specialist',
      topic: 'Community Resilience in the Digital Age',
      bio: 'Leading expert in post-conflict recovery and community building through technological innovation.',
      image: '/api/placeholder/150/150'
    }
  ];

  return (
    <section id="programme" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[var(--brand-navy)] mb-6">Conference Programme</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Two days of inspiring presentations, panel discussions, and networking opportunities 
            focused on harmony, reconciliation, and digital transformation.
          </p>
        </motion.div>

        {/* Day Selector */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="bg-[var(--brand-light-gray)] rounded-lg p-2 flex">
            <button
              onClick={() => setSelectedDay('day1')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedDay === 'day1'
                  ? 'bg-[var(--brand-blue)] text-white shadow-lg'
                  : 'text-gray-600 hover:text-[var(--brand-blue)]'
              }`}
            >
              Day 1 - Jan 28
            </button>
            <button
              onClick={() => setSelectedDay('day2')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedDay === 'day2'
                  ? 'bg-[var(--brand-blue)] text-white shadow-lg'
                  : 'text-gray-600 hover:text-[var(--brand-blue)]'
              }`}
            >
              Day 2 - Jan 29
            </button>
          </div>
        </motion.div>

        {/* Programme Schedule */}
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="bg-[var(--brand-light-gray)] rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center">
              <Calendar className="text-[var(--brand-blue)] mr-3" size={24} />
              <h3 className="text-2xl font-bold text-[var(--brand-navy)]">
                {programmeData[selectedDay].date}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {programmeData[selectedDay].events.map((event, index) => {
              const IconComponent = event.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-center gap-4 lg:w-1/4">
                      <div className="w-12 h-12 bg-[var(--brand-blue)] rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="text-white" size={20} />
                      </div>
                      <div className="flex items-center text-[var(--brand-navy)] font-medium">
                        <Clock size={16} className="mr-2" />
                        {event.time}
                      </div>
                    </div>

                    <div className="lg:w-2/4">
                      <h4 className="text-lg font-bold text-[var(--brand-navy)] mb-2">{event.title}</h4>
                      {event.speaker && (
                        <p className="text-[var(--brand-blue)] font-medium mb-1">Speaker: {event.speaker}</p>
                      )}
                      {event.topic && (
                        <p className="text-gray-700 font-medium mb-1">Topic: {event.topic}</p>
                      )}
                      {event.description && (
                        <p className="text-gray-600 text-sm">{event.description}</p>
                      )}
                    </div>

                    <div className="lg:w-1/4 flex flex-col items-start lg:items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                      {event.location && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin size={14} className="mr-1" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Keynote Speakers */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-[var(--brand-navy)] text-center mb-8">Keynote Speakers</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {keynoteSpeekers.map((speaker, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-navy)] rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="text-white" size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[var(--brand-navy)] mb-1">{speaker.name}</h4>
                    <p className="text-[var(--brand-blue)] font-medium mb-2">{speaker.title}</p>
                    <p className="text-gray-700 font-medium mb-2">"{speaker.topic}"</p>
                    <p className="text-gray-600 text-sm">{speaker.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Conference Brochure */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-[var(--brand-navy)] text-center mb-8">Conference Brochure</h3>
          <div className="bg-[var(--brand-light-gray)] rounded-xl p-6">
            <div className="text-center mb-6">
              <p className="text-lg text-gray-700 mb-4">
                Explore our interactive conference brochure with detailed information about sessions, speakers, and venue details.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <iframe 
                allowFullScreen="allowfullscreen" 
                allow="clipboard-write" 
                scrolling="no" 
                className="fp-iframe w-full rounded-lg shadow-lg" 
                src="https://heyzine.com/flip-book/16b2bde552.html" 
                style={{ border: '1px solid lightgray', height: '400px' }}
                title="ICHR2026 Conference Brochure"
              ></iframe>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Click and drag to flip through pages, or use the navigation controls
              </p>
            </div>
          </div>
        </motion.div>

        {/* Entertainment */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] rounded-xl p-8 text-white text-center">
            <MapPin className="mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold mb-4">Ecotourism Experience</h3>
            <p className="text-lg mb-6">
              Join us for an optional guided tour of Vavuniya's cultural heritage sites and environmental attractions. 
              Experience the natural beauty and rich history of the region while networking with fellow participants.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Duration:</strong> 1.5 hours
              </div>
              <div>
                <strong>Date:</strong> January 29, 2026
              </div>
              <div>
                <strong>Time:</strong> 4:30 PM - 6:00 PM
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Programme;

