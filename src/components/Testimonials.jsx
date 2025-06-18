import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const testimonialsRef = useRef(null);
  
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Tenant Rights Case',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQapb9J8szYsVK8mwxhDDvPXT48dDWs9zXi5w&s',
      content: "MeraBakil's AI chatbot helped me understand my rights as a tenant in just minutes. When I needed deeper insights, the lawyer consultation was professional and affordable. Saved me so much time and stress!",
      rating: 5
    },
    {
      id: 2,
      name: 'Rahul Mehta',
      role: 'Small Business Owner',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXquGgKddUI2Ivrr1eErVH8QdkgM2RJ4RFO8nOOQU192UjdC9qDQCnPWy2z2CFuiJOaQM&usqp=CAU',
      content: "As a small business owner, legal consultation seemed out of reach financially. MeraBakil provided instant answers to my compliance questions and connected me with a corporate lawyer who perfectly fit my needs and budget.",
      rating: 5
    },
    {
      id: 3,
      name: 'Anjali Patel',
      role: 'Family Law Client',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNlbITbMknKB0aP30p_Zdj13Lp-r7iKm9LH-y2iwM5rr-ZRfB6AS1icmHzYeRPNh35ZJI&usqp=CAU', // Using placeholder for the 3rd one as the URL was empty
      content: "During my divorce proceedings, MeraBakil's platform helped me understand the process step by step. The family lawyer I consulted through the app provided compassionate and clear guidance during a difficult time.",
      rating: 4
    },
    {
      id: 4,
      name: 'Vikram Singh',
      role: 'Property Dispute Resolution',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvmhzWvZSCySYHzPa7b25w-W6g3C-iTvmSqQ&s',
      content: "The legal guidance I received through MeraBakil was exceptional. Their platform simplified complex property laws and the expert they matched me with helped resolve our boundary dispute without going to court.",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    resetAutoplayTimer();
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    resetAutoplayTimer();
  };

  const goToTestimonial = (index) => {
    setActiveIndex(index);
    resetAutoplayTimer();
  };

  const resetAutoplayTimer = () => {
    setAutoplay(false);
    setTimeout(() => !isHovering && setAutoplay(true), 1000);
  };

  useEffect(() => {
    let interval;
    if (autoplay && !isHovering) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 8000); // Slowed down to 8 seconds
    }
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length, isHovering]);

  // Card variants for animation
  const cardVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    })
  };

  // Track the slide direction
  const [[page, direction], setPage] = useState([0, 0]);

  // Update page and direction when activeIndex changes
  useEffect(() => {
    const dir = page > activeIndex ? -1 : 1;
    setPage([activeIndex, dir]);
  }, [activeIndex]);

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 h-72 w-72 bg-gradient-to-bl from-[#5cacde]/10 to-transparent rounded-full transform translate-x-1/3 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-64 w-64 bg-gradient-to-tr from-[#22577a]/10 to-transparent rounded-full transform -translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      
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
              Client Success Stories
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#22577a] to-[#5cacde] inline-block text-transparent bg-clip-text">
            What Our Clients Say
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Real experiences from people who found clarity and resolution through our legal assistance platform
          </p>
        </motion.div>

        <div 
          className="relative max-w-5xl mx-auto pb-12"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          ref={testimonialsRef}
        >
          {/* Main testimonial carousel */}
          <div className="h-full relative">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={page}
                variants={cardVariants}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row h-full">
                  {/* Left side with avatar and info */}
                  <div className="md:w-2/5 bg-gradient-to-br from-[#22577a] to-[#5cacde] p-8 flex flex-col justify-center items-center text-white">
                    <div className="mb-6 relative">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
                        <img 
                          src={testimonials[activeIndex].avatar} 
                          alt={testimonials[activeIndex].name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full shadow-md p-1">
                        <Quote className="w-5 h-5 text-[#5cacde]" />
                      </div>
                    </div>
                    
                    <h4 className="text-xl md:text-2xl font-bold text-white mb-1 text-center">
                      {testimonials[activeIndex].name}
                    </h4>
                    <p className="text-white/80 mb-4 text-center">
                      {testimonials[activeIndex].role}
                    </p>
                    
                    <div className="flex items-center justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < testimonials[activeIndex].rating ? 'text-yellow-300 fill-yellow-300' : 'text-white/30'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Right side with testimonial content */}
                  <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                      <Quote className="w-12 h-12 text-[#22577a]/20 dark:text-[#5cacde]/20 mb-4" />
                      <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed italic">
                        "{testimonials[activeIndex].content}"
                      </p>
                    </div>
                    
                    {/* Indicators for xs/sm screens */}
                    <div className="flex justify-center md:hidden mt-4">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToTestimonial(index)}
                          className={`w-2.5 h-2.5 mx-1 rounded-full transition-all duration-300 ${
                            index === activeIndex 
                              ? 'bg-gradient-to-r from-[#22577a] to-[#5cacde] w-8'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          aria-label={`Go to testimonial ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation buttons (outside the card) */}
            <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between pointer-events-none z-20 px-2 md:px-4">
              <button 
                onClick={prevTestimonial}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 pointer-events-auto"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-[#22577a] dark:text-[#5cacde]" />
              </button>
              
              <button 
                onClick={nextTestimonial}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 pointer-events-auto"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-[#22577a] dark:text-[#5cacde]" />
              </button>
            </div>
          </div>
          
          {/* Progress indicators for md+ screens */}
          <div className="hidden md:flex justify-center items-center space-x-2 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className="group flex items-center"
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <div className={`relative h-1 w-12 rounded-full overflow-hidden transition-all duration-500 ${
                  index === activeIndex 
                    ? 'bg-gradient-to-r from-[#22577a] to-[#5cacde] w-24' 
                    : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500'
                }`}>
                  {index === activeIndex && (
                    <motion.div 
                      className="absolute inset-0 bg-white/30"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ 
                        duration: 8, // Match the autoplay timing
                        ease: "linear",
                        repeat: autoplay ? Infinity : 0,
                        repeatDelay: 0
                      }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Testimonial overview boxes */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            {
              title: "Legal Knowledge",
              value: "Accessible",
              description: "Our platform demystifies legal jargon for everyone"
            },
            {
              title: "Expert Consultations",
              value: "Affordable",
              description: "Professional legal guidance that fits your budget"
            },
            {
              title: "Client Satisfaction",
              value: "98%",
              description: "Our clients recommend our services to others"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 border border-gray-100 dark:border-gray-700 text-center hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">{item.title}</h3>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#22577a] to-[#5cacde] inline-block text-transparent bg-clip-text mb-3">{item.value}</p>
              <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;