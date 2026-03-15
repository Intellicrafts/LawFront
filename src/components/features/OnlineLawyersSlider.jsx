import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { lawyerAPI, tokenManager } from '../../api/apiService';

const mockOnlineLawyers = [
    {
        id: 101,
        full_name: 'Sarah Jenkins',
        specialization: 'Family Law',
        profile_picture_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
        rating: 4.9,
        reviews_count: 124,
        location: 'Mumbai, MH',
        is_online: true
    },
    {
        id: 102,
        full_name: 'David Chen',
        specialization: 'Corporate Law',
        profile_picture_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
        rating: 4.8,
        reviews_count: 89,
        location: 'Delhi, DL',
        is_online: true
    },
    {
        id: 103,
        full_name: 'Priya Sharma',
        specialization: 'Civil Litigation',
        profile_picture_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
        rating: 4.7,
        reviews_count: 56,
        location: 'Bangalore, KA',
        is_online: true
    },
    {
        id: 104,
        full_name: 'Michael Ross',
        specialization: 'Criminal Defense',
        profile_picture_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
        rating: 4.9,
        reviews_count: 210,
        location: 'Pune, MH',
        is_online: true
    },
    {
        id: 105,
        full_name: 'Anita Desai',
        specialization: 'Tax Law',
        profile_picture_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
        rating: 4.8,
        reviews_count: 145,
        location: 'Chennai, TN',
        is_online: true
    }
];

const OnlineLawyersSlider = () => {
    const { mode } = useSelector((state) => state.theme);
    const isDark = mode === 'dark';
    const navigate = useNavigate();

    const [lawyers, setLawyers] = useState(mockOnlineLawyers);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        // Attempt to fetch real online lawyers
        const fetchOnlineLawyers = async () => {
            try {
                const res = await lawyerAPI.getLawyers({ sort: 'rating', is_online: 1, per_page: 8 });
                if (res?.data?.data && res.data.data.length > 0) {
                    // Add `is_online` safely and merge with mocks if < 4 lawyers found for the slider to look good
                    const fetched = res.data.data.filter(l => l.full_name).map(l => ({ ...l, is_online: true }));
                    if (fetched.length >= 4) {
                        setLawyers(fetched);
                    } else {
                        setLawyers([...fetched, ...mockOnlineLawyers.slice(fetched.length)]);
                    }
                }
            } catch (err) {
                console.log('Failed to fetch online lawyers, using mock data.');
            }
        };
        fetchOnlineLawyers();
    }, []);

    const handleBookNow = (lawyer) => {
        const isAuth = tokenManager.isAuthenticated();
        const targetUrl = `/legal-consoltation?lawyerId=${lawyer.id}&action=book`;

        if (isAuth) {
            navigate(targetUrl);
        } else {
            navigate(`/auth?redirect=${encodeURIComponent(targetUrl)}`);
        }
    };

    // Duplicate lawyers to create a seamless infinite loop
    const duplicatedLawyers = [...lawyers, ...lawyers, ...lawyers];

    return (
        <div className="w-full overflow-hidden mt-8 mb-12 relative max-w-7xl mx-auto px-4 z-20">

            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>
                    <h3 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Online Lawyers Ready to Help
                    </h3>
                </div>
                <button
                    onClick={() => navigate('/legal-consoltation')}
                    className={`text-sm font-semibold flex items-center gap-1 transition-colors ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-brand-600 hover:text-brand-700'}`}
                >
                    View all <ArrowRight size={14} />
                </button>
            </div>

            <div
                className="w-full overflow-hidden relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Gradients to fade the edges */}
                <div className={`absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r ${isDark ? 'from-[#0A0A0A] to-transparent' : 'from-[rgb(250,250,249)] to-transparent pointer-events-none'}`}></div>
                <div className={`absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l ${isDark ? 'from-[#0A0A0A] to-transparent' : 'from-[rgb(250,250,249)] to-transparent pointer-events-none'}`}></div>

                <motion.div
                    animate={{ x: "-33.33%" }}
                    transition={{
                        duration: 50, // Reduced speed
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop",
                        // Control playback based on hover
                        repeatDelay: 0
                    }}
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        width: 'max-content',
                        padding: '0.5rem 0',
                        animationPlayState: isHovered ? 'paused' : 'running'
                    }}
                    className="flex gap-4 w-max py-2"
                >
                    {duplicatedLawyers.map((lawyer, index) => (
                        <div
                            key={`${lawyer.id}-${index}`}
                            className={`flex-shrink-0 w-[280px] rounded-2xl p-4 transition-all duration-300 transform hover:-translate-y-1 border shadow-sm hover:shadow-xl group
                ${isDark
                                    ? 'bg-[#121212]/80 border-gray-800 hover:border-cyan-500/30'
                                    : 'bg-white border-gray-100 hover:border-brand-300'}`}
                            style={{ backdropFilter: 'blur(10px)' }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="relative">
                                    <img
                                        src={lawyer.profile_picture_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=150'}
                                        alt={lawyer.full_name}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-brand-400 transition-colors"
                                    />
                                    {lawyer.is_online && (
                                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#121212] rounded-full"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-base font-bold truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                                        {lawyer.full_name}
                                    </h4>
                                    <div className={`text-xs truncate mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {lawyer.specialization}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <Star size={12} className="text-yellow-400 fill-current" />
                                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {lawyer.rating || "4.8"}
                                        </span>
                                        <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                            ({lawyer.reviews_count || 50})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 w-full border-t border-dashed border-gray-200 dark:border-gray-800">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBookNow(lawyer);
                                    }}
                                    className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors duration-200 
                    ${isDark
                                            ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                                            : 'bg-brand-50 text-brand-600 hover:bg-brand-100 hover:text-brand-700'}`}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default OnlineLawyersSlider;
