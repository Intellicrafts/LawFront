import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Linkedin, Twitter, Instagram } from 'lucide-react';

const Founders = () => {
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  const founders = [
    {
      id: 1,
      name: 'Aman Patkar',
      position: 'Founder & Chief X Officer',
      image: '/api/placeholder/400/500',
      bio: 'A seasoned legal professional with expertise in legal technology integration and accessibility.',
      socials: {
        linkedin: '#',
        twitter: '#',
        instagram: '#'
      }
    },
    {
      id: 2,
      name: 'Devesh Yadav',
      position: 'Founder & X',
      image: '/api/placeholder/400/500',
      bio: 'With a background in legal tech and AI applications for the legal industry.',
      socials: {
        linkedin: '#',
        twitter: '#',
        instagram: '#'
      }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section 
      id="founders" 
      className={`py-16 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Meet Our Founders
          </h2>
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-12 h-1 bg-blue-600"></div>
            <div className="text-blue-600">❤</div>
            <div className="w-12 h-1 bg-blue-600"></div>
          </div>
          <p className={`text-lg max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Visionary leaders with extensive experience in legal technology and accessible legal assistance solutions.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
        >
          {founders.map((founder) => (
            <motion.div
              key={founder.id}
              variants={itemVariants}
              className={`rounded-lg overflow-hidden shadow-lg 
                ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="relative overflow-hidden group">
                <img 
                  src={founder.image} 
                  alt={founder.name} 
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                  <div className="flex gap-4 p-4">
                    <motion.a 
                      href={founder.socials.linkedin} 
                      whileHover={{ y: -5 }}
                      className={`p-2 rounded-full transition ${
                        isDarkMode 
                          ? 'bg-slate-700 text-blue-400 hover:bg-slate-600' 
                          : 'bg-white text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      <Linkedin size={20} />
                    </motion.a>
                    <motion.a 
                      href={founder.socials.twitter} 
                      whileHover={{ y: -5 }}
                      className={`p-2 rounded-full transition ${
                        isDarkMode 
                          ? 'bg-slate-700 text-blue-300 hover:bg-slate-600' 
                          : 'bg-white text-blue-400 hover:bg-blue-100'
                      }`}
                    >
                      <Twitter size={20} />
                    </motion.a>
                    <motion.a 
                      href={founder.socials.instagram} 
                      whileHover={{ y: -5 }}
                      className={`p-2 rounded-full transition ${
                        isDarkMode 
                          ? 'bg-slate-700 text-pink-400 hover:bg-slate-600' 
                          : 'bg-white text-pink-600 hover:bg-pink-100'
                      }`}
                    >
                      <Instagram size={20} />
                    </motion.a>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {founder.name}
                </h3>
                <p className={`font-medium mb-4 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {founder.position}
                </p>
                <div className="w-10 h-1 bg-blue-600 mb-4"></div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {founder.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="absolute right-0 bottom-0 -z-10">
          <div className={`w-64 h-64 rounded-full opacity-20 ${
            isDarkMode ? 'bg-blue-500/30' : 'bg-blue-100'
          }`}></div>
        </div>
      </div>
    </section>
  );
};

export default Founders;