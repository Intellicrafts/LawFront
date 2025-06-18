import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Shield, Clock, MessageSquare } from 'lucide-react';

const About = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 h-64 w-64 bg-gradient-to-tr from-[#22577a]/10 to-transparent rounded-full transform -translate-x-1/3 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-64 w-64 bg-gradient-to-bl from-[#5cacde]/10 to-transparent rounded-full transform translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4">
            <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-gradient-to-r from-[#22577a]/10 to-[#5cacde]/10 text-[#22577a] dark:from-[#22577a]/20 dark:to-[#5cacde]/20 dark:text-[#5cacde]">
              Our Mission
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#22577a] to-[#5cacde] inline-block text-transparent bg-clip-text">
            About MeraBakil
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Bridging the gap between complex legal systems and everyday people through innovative technology and expert guidance.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-2/5"
          >
           <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#22577a]/20 to-[#5cacde]/20 z-10"></div>
            <img 
              src="https://www.shutterstock.com/image-vector/vector-graphic-illustration-indian-lawyer-260nw-1803131155.jpg" 
              alt="MeraBakil Legal Team" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#22577a]/90 to-transparent p-6 z-20">
              <span className="text-white text-lg font-medium">Legal Assistance, Simplified</span>
            </div>
          </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-3/5"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
              Transforming Legal Services Through Technology
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              MeraBakil isn't just a legal service—we're an innovative solution that combines cutting-edge AI technology with human expertise to make legal assistance accessible, affordable, and understandable.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Our team of qualified legal professionals and tech experts work together to ensure you receive accurate legal information, practical advice, and professional consultation through our user-friendly platform—whenever and wherever you need it.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {[
                {
                  icon: <MessageSquare className="w-6 h-6 text-[#5cacde]" />,
                  title: "AI-Powered Legal Assistance",
                  description: "Get instant answers to legal questions through our advanced AI chatbot."
                },
                {
                  icon: <Users className="w-6 h-6 text-[#5cacde]" />,
                  title: "Expert Lawyer Consultations",
                  description: "Connect with specialized lawyers for personalized guidance."
                },
                {
                  icon: <Clock className="w-6 h-6 text-[#5cacde]" />,
                  title: "24/7 Legal Information Access",
                  description: "Access legal resources and guidance anytime, day or night."
                },
                {
                  icon: <Shield className="w-6 h-6 text-[#5cacde]" />,
                  title: "Secure & Confidential Platform",
                  description: "Your information remains protected with enterprise-grade security."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-start p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="mr-4 bg-gradient-to-r from-[#22577a]/10 to-[#5cacde]/10 p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="/contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-[#22577a] to-[#5cacde] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Legal Help Now
              <ArrowRight size={18} className="ml-2" />
            </motion.a>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10 px-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700"
        >
          {[
            { value: "5000+", label: "Legal Cases Resolved" },
            { value: "50+", label: "Expert Lawyers" },
            { value: "24/7", label: "Customer Support" },
            { value: "98%", label: "Client Satisfaction" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="text-center p-4"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#22577a] to-[#5cacde] inline-block text-transparent bg-clip-text mb-2">
                {stat.value}
              </div>
              <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;