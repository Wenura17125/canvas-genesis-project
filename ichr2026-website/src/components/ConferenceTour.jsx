import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Camera, 
  TreePine, 
  Fish, 
  Anchor, 
  Mountain, 
  Building, 
  Landmark,
  Heart,
  Mail,
  Globe,
  Star,
  Users,
  Calendar
} from 'lucide-react';
import tourImage1 from '../assets/tour-image-1.jpg';
import tourImage2 from '../assets/tour-image-2.jpg';
import tourImage3 from '../assets/tour-image-3.jpg';
import tourImage4 from '../assets/tour-image-4.jpg';

const ConferenceTour = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState('mannar'); // 'mannar' or 'trincomalee'

  const tourDestinations = {
    mannar: {
      name: 'Mannar',
      tagline: 'Discover Mannar – A first-time experience!',
      description: 'Combine knowledge-sharing with unforgettable travel experiences during your stay at ICHR2026.',
      images: [tourImage1, tourImage2],
      imageAlts: ['Mannar Eco-Tourism Destinations', 'Rich Cultural Heritage'],
      activities: [
        {
          id: 'birdwatch',
          title: 'Bird Watching',
          icon: Camera,
          description: 'Experience the spectacular sight of flamingos and migratory species in their natural habitat',
          details: 'Mannar is home to over 200 bird species, including the famous Greater Flamingo. The best viewing times are early morning and late afternoon.',
          location: 'Mannar Wetlands'
        },
        {
          id: 'mangrove',
          title: 'Mangrove Walk',
          icon: TreePine,
          description: 'Explore pristine coastal ecosystems through guided mangrove walks',
          details: 'Walk through the unique mangrove forests that protect the coastline and provide habitat for diverse marine life.',
          location: 'Mannar Coastal Area'
        },
        {
          id: 'fishtherapy',
          title: 'Fish Therapy',
          icon: Fish,
          description: 'Relax with natural fish therapy in crystal-clear streams',
          details: 'Experience the therapeutic benefits of natural fish therapy in the clean, flowing waters of Mannar.',
          location: 'Natural Streams'
        },
        {
          id: 'boating',
          title: 'Boating at Giant\'s Tank',
          icon: Anchor,
          description: 'Enjoy peaceful boating experiences at the historic Giant\'s Tank',
          details: 'Giant\'s Tank is an ancient reservoir built in the 6th century, offering serene boating experiences surrounded by history.',
          location: 'Giant\'s Tank'
        },
        {
          id: 'fishing',
          title: 'Sea Boat Fishing',
          icon: Fish,
          description: 'Join local fishermen for authentic sea boat fishing adventures',
          details: 'Experience traditional fishing methods with local fishermen and enjoy the fresh catch of the day.',
          location: 'Mannar Coast'
        },
        {
          id: 'cultural',
          title: 'Cultural Visits',
          icon: Building,
          description: 'Explore ancient temples and cultural sites rich in history',
          details: 'Visit Thiruketheswaram Temple, Thanthiramalle, and Madu Matha to experience the diverse cultural heritage.',
          location: 'Various Cultural Sites'
        },
        {
          id: 'heritage',
          title: 'Heritage Sites',
          icon: Landmark,
          description: 'Discover Adam\'s Bridge and Thalaimannar Lighthouse',
          details: 'Explore the legendary Adam\'s Bridge and the historic Thalaimannar Lighthouse with breathtaking coastal views.',
          location: 'Thalaimannar'
        }
      ],
      culturalSites: [
        {
          name: 'Thiruketheswaram Temple',
          description: 'Ancient Hindu temple with rich spiritual significance',
          significance: 'One of the Pancha Ishwarams of Sri Lanka'
        },
        {
          name: 'Thanthiramalle',
          description: 'Archaeological site with ancient Buddhist ruins',
          significance: 'Historical Buddhist monastery complex'
        },
        {
          name: 'Madu Matha',
          description: 'Sacred Catholic shrine with healing powers',
          significance: 'Important pilgrimage site for Christians'
        },
        {
          name: 'Adam\'s Bridge',
          description: 'Legendary chain of limestone shoals',
          significance: 'Mythological and geological wonder'
        },
        {
          name: 'Thalaimannar Lighthouse',
          description: 'Historic lighthouse with panoramic views',
          significance: 'Maritime heritage landmark'
        }
      ],
      whyVisit: {
        title: 'Why Visit Mannar?',
        text: 'Mannar offers the perfect blend of nature, culture, food, and hospitality in true Sri Lankan style. Whether it\'s exploring national parks, enjoying the coastal breeze, or immersing yourself in centuries of history and tradition, this destination promises an enriching experience.'
      },
      packageFeatures: [
        'Affordable pricing for conference participants',
        'Trusted local guides and services',
        'Transportation arrangements',
        'Cultural immersion experiences',
        'Photography opportunities',
        'Traditional Sri Lankan meals',
        'Safety and insurance coverage',
        'Flexible timing options'
      ]
    },
    trincomalee: {
      name: 'Trincomalee',
      tagline: 'Discover Trincomalee – A first-time experience!',
      description: 'Explore the coastal charm of Trincomalee. Known for its pristine beaches and rich marine life, Trinco offers a unique eco-touristic destination to blend your academic journey with memorable travel experiences.',
      images: [tourImage3, tourImage4],
      imageAlts: ['Trincomalee Eco-Tourism Destinations', 'Rich Cultural Heritage in Trincomalee'],
      activities: [
        {
          id: 'corals',
          title: 'Coral Watching',
          icon: Fish,
          description: 'Observe vibrant coral reefs and diverse marine life',
          details: 'Trincomalee is famous for its pristine coral reefs, perfect for snorkeling and diving to witness colorful marine ecosystems.',
          location: 'Pigeon Island National Park'
        },
        {
          id: 'whales',
          title: 'Whale Watching',
          icon: Anchor,
          description: 'Witness majestic whales and dolphins in their natural habitat',
          details: 'The waters off Trincomalee are a prime location for whale and dolphin watching, especially during migration seasons.',
          location: 'Indian Ocean'
        },
        {
          id: 'underwaterfish',
          title: 'Underwater Fish Watching',
          icon: Fish,
          description: 'Enjoy snorkeling or glass-bottom boat tours to see underwater fish',
          details: 'Explore the shallow, clear waters teeming with a variety of tropical fish, ideal for all ages.',
          location: 'Nilaveli Beach'
        },
        {
          id: 'scubadiving',
          title: 'Scuba Diving',
          icon: Anchor,
          description: 'Embark on thrilling scuba diving adventures',
          details: 'Trincomalee offers excellent diving spots for both beginners and experienced divers, with shipwrecks and diverse marine life.',
          location: 'Various Dive Sites'
        },
        {
          id: 'deers',
          title: 'Deer in Parks',
          icon: TreePine,
          description: 'Spot deer roaming freely in local parks',
          details: 'Experience the unique sight of deer freely roaming in urban and park areas of Trincomalee.',
          location: 'Fort Frederick'
        },
        {
          id: 'culturaltrinco',
          title: 'Cultural Visits',
          icon: Building,
          description: 'Visit ancient temples and historical sites',
          details: 'Explore Koneswaram Temple, a historic Hindu temple, and other cultural landmarks in Trincomalee.',
          location: 'Koneswaram Temple'
        },
        {
          id: 'heritagetrinco',
          title: 'Heritage Visits',
          icon: Landmark,
          description: 'Discover ancient Sri Lankan history through heritage sites',
          details: 'Delve into the rich history of Trincomalee by visiting its ancient forts and colonial-era buildings.',
          location: 'Fort Frederick'
        },
        {
          id: 'beaches',
          title: 'Pristine Beaches',
          icon: Mountain,
          description: 'Relax and unwind on the beautiful beaches of Trincomalee',
          details: 'Enjoy the golden sands and clear waters of Nilaveli and Uppuveli beaches, perfect for relaxation and water sports.',
          location: 'Nilaveli & Uppuveli'
        },
        {
          id: 'boatingtrinco',
          title: 'Boating Excursions',
          icon: Anchor,
          description: 'Scenic coastal boating tours',
          details: 'Take a boat trip along the stunning coastline, exploring hidden coves and enjoying the sea breeze.',
          location: 'Trincomalee Coast'
        }
      ],
      culturalSites: [
        {
          name: 'Koneswaram Temple',
          description: 'Ancient Hindu temple dedicated to Lord Shiva',
          significance: 'One of the Pancha Ishwarams, perched on Swami Rock'
        },
        {
          name: 'Fort Frederick',
          description: 'Historic fort built by the Portuguese',
          significance: 'Offers panoramic views and houses Koneswaram Temple'
        },
        {
          name: 'Kanniya Hot Springs',
          description: 'Seven natural hot water wells',
          significance: 'Believed to have therapeutic properties'
        },
        {
          name: 'Marble Beach',
          description: 'Secluded beach with calm, clear waters',
          significance: 'Ideal for swimming and relaxation'
        },
        {
          name: 'Pigeon Island National Park',
          description: 'Marine national park famous for coral reefs',
          significance: 'Excellent for snorkeling and diving'
        }
      ],
      whyVisit: {
        title: 'Why Visit Trincomalee?',
        text: 'Trincomalee is one of Sri Lanka’s most breathtaking coastal towns, famous for its natural harbors, crystal-clear waters, and cultural diversity. Whether it\'s watching majestic whales, diving among coral reefs, or enjoying the tranquility of sandy beaches, Trinco is the perfect getaway.'
      },
      packageFeatures: [
        'Affordable packages for conference participants',
        'Trusted local guides and services',
        'Transportation arrangements',
        'Marine life exploration',
        'Cultural and historical tours',
        'Photography opportunities',
        'Fresh seafood experiences',
        'Safety and insurance coverage'
      ]
    }
  };

  const currentDestination = tourDestinations[selectedDestination];

  return (
    <section id="conference-tour" className="py-20 bg-gradient-to-br from-[var(--brand-light-gray)] to-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
                <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-[var(--brand-navy)] mb-6">Conference Tour</h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8">
            {currentDestination.tagline} {currentDestination.description}
          </p>
          <div className="flex items-center justify-center gap-4 text-[var(--brand-blue)] mb-8">
            <Calendar size={24} />
            <span className="text-lg font-medium">January 28-29, 2026</span>
            <MapPin size={24} />
            <span className="text-lg font-medium">{currentDestination.name}, Sri Lanka</span>
          </div>

          {/* Destination Selection Buttons */}
          <div className="flex justify-center gap-4 mb-16">
            <button
              onClick={() => setSelectedDestination("mannar")}
              className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300
                ${selectedDestination === "mannar"
                  ? "bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] text-white shadow-lg"
                  : "bg-white text-[var(--brand-navy)] border border-[var(--brand-blue)] hover:bg-[var(--brand-light-gray)]"}
              `}
            >
              Explore Mannar
            </button>
            <button
              onClick={() => setSelectedDestination("trincomalee")}
              className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300
                ${selectedDestination === "trincomalee"
                  ? "bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] text-white shadow-lg"
                  : "bg-white text-[var(--brand-navy)] border border-[var(--brand-blue)] hover:bg-[var(--brand-light-gray)]"}
              `}
            >
              Explore Trincomalee
            </button>
          </div>
        </motion.div>

        {/* Hero Images */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6 mb-16"
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <img 
              src={currentDestination.images[0]} 
              alt={currentDestination.imageAlts[0]} 
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold mb-2">Explore Eco-Touristic Destinations</h3>
              <p className="text-sm">First time in {currentDestination.name} - Various places you can explore</p>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <img 
              src={currentDestination.images[1]} 
              alt={currentDestination.imageAlts[1]} 
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold mb-2">Rich Cultural Heritage</h3>
              <p className="text-sm">Our locals represent the entire Sri Lanka to you!</p>
            </div>
          </div>
        </motion.div>

        {/* Tour Activities */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-[var(--brand-navy)] text-center mb-12">
            Join With Us To Enjoy
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentDestination.activities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedActivity(selectedActivity === activity.id ? null : activity.id)}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-navy)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="text-white" size={24} />
                    </div>
                    <h4 className="font-bold text-[var(--brand-navy)] text-lg mb-2">{activity.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
                    <div className="text-xs text-[var(--brand-blue)] font-medium flex items-center justify-center">
                      <MapPin size={12} className="mr-1" />
                      {activity.location}
                    </div>
                  </div>
                  
                  {selectedActivity === activity.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <p className="text-sm text-gray-700">{activity.details}</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Cultural Heritage Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-[var(--brand-navy)] mb-4">We Are Rich In Cultures</h3>
              <p className="text-lg text-gray-700">
                Our locals represent the entire Sri Lanka to you! Experience the island's harmony in practice.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentDestination.culturalSites.map((site, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border-l-4 border-[var(--brand-gold)] pl-4 py-2"
                >
                  <h4 className="font-bold text-[var(--brand-navy)] mb-1">{site.name}</h4>
                  <p className="text-gray-700 text-sm mb-1">{site.description}</p>
                  <p className="text-[var(--brand-blue)] text-xs font-medium">{site.significance}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Why Visit Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] rounded-xl p-8 text-white">
            <div className="text-center mb-8">
              <Heart className="mx-auto mb-4" size={48} />
              <h3 className="text-3xl font-bold mb-4">{currentDestination.whyVisit.title}</h3>
              <p className="text-lg opacity-90 max-w-3xl mx-auto">
                {currentDestination.whyVisit.text}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentDestination.packageFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center text-sm"
                >
                  <Star className="text-[var(--brand-gold)] mr-2 flex-shrink-0" size={16} />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-[var(--brand-light-gray)] rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[var(--brand-navy)] mb-4">Plan Your Journey With Us</h3>
            <p className="text-lg text-gray-700 mb-6">
              Affordable packages and trusted services are available for participants, making it easy to explore 
              your dream destinations while attending the conference.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <div className="flex items-center text-[var(--brand-blue)]">
                <Mail className="mr-2" size={20} />
                <a href="mailto:ichr2026@vau.ac.lk" className="hover:underline font-medium">
                  ichr2026@vau.ac.lk
                </a>
              </div>
              <div className="flex items-center text-[var(--brand-blue)]">
                <Globe className="mr-2" size={20} />
                <a href="https://www.vau.ac.lk/ichr2026/" className="hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                  www.vau.ac.lk/ichr2026/
                </a>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <a
                href="#registration"
                className="bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-200 inline-flex items-center"
              >
                <Users className="mr-2" size={20} />
                Register for Tour Package
              </a>
            </motion.div>
            
            <div className="mt-6 p-4 bg-[var(--brand-gold)]/10 rounded-lg">
              <p className="text-[var(--brand-navy)] font-medium italic">
                "The best way to pay for a lovely moment is to enjoy it."
              </p>
              <p className="text-sm text-gray-600 mt-1">Come, join us at ICHR2026 and let Mannar inspire you!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConferenceTour;
