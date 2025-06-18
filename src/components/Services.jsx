import React from 'react';
import { Bot, Gavel, FileSearch, Calendar, ListChecks, Info, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    {
      icon: <Bot size={28} />,
      title: 'AI Legal Chat',
      description: 'Get instant answers to your legal questions through our AI-powered chatbot available 24/7 for all your basic legal inquiries.',
      link: '/services/ai-chat'
    },
    {
      icon: <Gavel size={28} />,
      title: 'Legal Consultations',
      description: 'Connect with specialized lawyers for personalized consultations on specific legal matters through our secure platform.',
      link: '/services/consultations'
    },
    {
      icon: <FileSearch size={28} />,
      title: 'Document Review',
      description: 'Get your legal documents analyzed by our AI system with the option for professional review by qualified legal experts.',
      link: '/services/document-review'
    },
    {
      icon: <Calendar size={28} />,
      title: 'Lawyer Appointments',
      description: 'Book appointments with specialized lawyers across various legal domains for in-depth consultation on complex matters.',
      link: '/services/appointments'
    },
    {
      icon: <ListChecks size={28} />,
      title: 'Legal Task Automation',
      description: 'Streamline routine legal processes and paperwork through our AI-powered automation tools to save time and reduce complexity.',
      link: '/task-automation'
    },
    {
      icon: <Info size={28} />,
      title: 'Legal Information Hub',
      description: 'Access our comprehensive database of legal information, precedents, and guidelines to better understand your rights and options.',
      link: '/services/information'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30 dark:from-blue-900 dark:opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200 to-transparent rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-30 dark:from-blue-800 dark:opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="inline-block mb-4">
            <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-gradient-to-r from-[#22577a]/10 to-[#5cacde]/10 text-[#22577a] dark:from-[#22577a]/20 dark:to-[#5cacde]/20 dark:text-[#5cacde]">
              Our Solutions
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#22577a] to-[#5cacde] inline-block text-transparent bg-clip-text">
            Comprehensive Legal Services
          </h2>
          <motion.p 
            className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
          
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="relative group"
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#22577a] to-[#5cacde] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-1 translate-x-1" />
              <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 dark:border-gray-700 group-hover:translate-x-0 group-hover:-translate-y-2 z-10">
                <div className="mb-6 text-white p-4 rounded-lg inline-block bg-gradient-to-r from-[#22577a] to-[#5cacde] shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
                <a 
                  href={service.link} 
                  className="inline-flex items-center text-[#22577a] dark:text-[#5cacde] font-medium group/link"
                >
                  <span className="group-hover/link:underline">Learn more</span>
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover/link:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Added CTA section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* <div className="p-8 rounded-2xl bg-gradient-to-r from-[#22577a] to-[#5cacde] shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-white dark:bg-gray-900 opacity-10 pattern-grid-lg"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">Ready to solve your legal challenges?</h3>
            <p className="text-blue-50 mb-8 max-w-2xl mx-auto relative z-10">
              Our team of AI systems and legal experts are ready to assist you with any legal matter. 
              Get started today and experience the future of legal assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button className="px-8 py-3 bg-white text-[#22577a] font-medium rounded-full hover:shadow-lg transition-all duration-300">
                Get Started
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300">
                Book Consultation
              </button>
            </div>
          </div> */}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;