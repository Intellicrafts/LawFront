import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';

const PracticeAreas = () => {
  const [activeTab, setActiveTab] = useState('all');

  const areas = [
    {
      id: 'corporate',
      name: 'Corporate Legal Assistance',
      image: 'https://i0.wp.com/lawbhoomi.com/wp-content/uploads/2022/07/Corporate-Law3.jpg?fit=450%2C300&ssl=1',
      description: 'Business formation, mergers, acquisitions, and corporate compliance matters.',
      categories: ['all', 'corporate'],
    },
    {
      id: 'intellectual',
      name: 'Intellectual Property Protection',
      image: 'https://i0.wp.com/lawpavilion.com/blog/wp-content/uploads/2023/09/banner1-01-1-1024x630-1.jpg?fit=1024%2C630&ssl=1',
      description: 'Patents, trademarks, copyrights, and trade secret protection strategies.',
      categories: ['all', 'corporate'],
    },
    {
      id: 'criminal',
      name: 'Criminal Defense Consultation',
      image: 'https://www.totallylegal.com/getasset/c3ee2a89-b973-445f-9337-1ca05736c950/',
      description: 'Defense against charges, investigations, and prosecution of criminal cases.',
      categories: ['all', 'criminal'],
    },
    {
      id: 'family',
      name: 'Family Legal Matters',
      image: 'https://indialegallive.com/wp-content/uploads/2020/11/Family-Law.jpg',
      description: 'Divorce, child custody, alimony, and other domestic relationship matters.',
      categories: ['all', 'family'],
    },
    {
      id: 'property',
      name: 'Real Estate Legal Services',
      image: 'https://media.licdn.com/dms/image/v2/D4D12AQE23HHXOl_RLQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1698257414336?e=2147483647&v=beta&t=7_hkat0LMYLfcd9e6eGgk7x2J3YtpTeFUoS-7gnNidU',
      description: 'Real estate transactions, property disputes, and easement rights.',
      categories: ['all', 'property'],
    },
    {
      id: 'tenants',
      name: 'Tenant & Landlord Issues',
      image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiDr60Qf5yKj_SIdUlQxnfbj3Fce9U8_Se8O3eZwabj2O2UvrcvnO4Iy5c-3FRJRbTpnVE-iwmxs5cSoubwHN-Yd8qK3pOt_QMrazRQ_mC68BohW1BKYrbfXjYImFd2Q1DGt7ASR6P1W_h4/s1600/tenant-landlord1.jpg',
      description: 'Lease agreements, evictions, security deposits, and tenant rights.',
      categories: ['all', 'property'],
    },
  ];

  const tabs = [
    { id: 'all', name: 'All Areas' },
    { id: 'corporate', name: 'Corporate Law' },
    { id: 'criminal', name: 'Criminal Law' },
    { id: 'family', name: 'Family Law' },
    { id: 'property', name: 'Property Law' },
  ];

  const filteredAreas = areas.filter(area => area.categories.includes(activeTab));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 h-64 w-64 bg-gradient-to-bl from-[#5cacde]/10 to-transparent rounded-full transform translate-x-1/3 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 bg-gradient-to-tr from-[#22577a]/10 to-transparent rounded-full transform -translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4">
            <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-gradient-to-r from-[#22577a]/10 to-[#5cacde]/10 text-[#22577a] dark:from-[#22577a]/20 dark:to-[#5cacde]/20 dark:text-[#5cacde]">
              Expertise
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#22577a] to-[#5cacde] inline-block text-transparent bg-clip-text">
            Our Practice Areas
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-16">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-full p-1 flex flex-wrap justify-center overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 text-sm font-medium rounded-full mx-1 transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#22577a] to-[#5cacde] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredAreas.map(area => (
              <motion.div
                key={area.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#22577a]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <img
                    src={area.image}
                    alt={area.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{area.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{area.description}</p>

                  <div className="flex items-center justify-between">
                    <a
                      href={`/practice-areas/${area.id}`}
                      className="inline-flex items-center text-[#22577a] dark:text-[#5cacde] font-medium group/link"
                    >
                      <span className="group-hover/link:underline">Learn more</span>
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover/link:translate-x-1" />
                    </a>

                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-[#22577a]/10 to-[#5cacde]/10 text-[#22577a] dark:text-[#5cacde] group-hover:from-[#22577a] group-hover:to-[#5cacde] group-hover:text-white transition-all duration-300">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Call to action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <a
            href="/practice-areas"
            className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-[#22577a] to-[#5cacde] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Explore All Practice Areas
            <ChevronRight size={18} className="ml-2" />
          </a>
        </motion.div>
      </div>

      {/* Hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default PracticeAreas;
