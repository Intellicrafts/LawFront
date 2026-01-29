import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare,
    Calendar,
    FileText,
    Shield,
    Brain,
    Zap,
    CheckCircle,
    Star,
    ArrowRight,
    Lock,
    Users,
    Award,
    ChevronRight,
    Scale,
    Gavel,
    FileCheck,
    TrendingUp
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [activeService, setActiveService] = useState(null);
    const heroRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

    // Core Services
    const coreServices = [
        {
            id: 'ai-chatbot',
            icon: Brain,
            title: 'AI Legal Adviser',
            subtitle: 'Intelligent Legal Consultation',
            description: 'Get instant legal guidance powered by advanced AI technology. Our smart chatbot understands complex legal queries and provides accurate advice 24/7.',
            features: [
                'Natural language understanding',
                'Case law references & precedents',
                'Multi-lingual support (10+ languages)',
                'Instant document analysis',
                'Voice interaction enabled'
            ],
            gradient: 'from-blue-600 via-indigo-600 to-purple-600',
            iconGradient: 'from-blue-500 to-purple-600',
            route: '/chatbot'
        },
        {
            id: 'consultation',
            icon: Users,
            title: 'Expert Consultation',
            subtitle: 'Connect with Top Lawyers',
            description: 'Book video consultations with verified, experienced lawyers across India. Get personalized legal advice tailored to your specific case.',
            features: [
                'Verified lawyer profiles with ratings',
                'Instant or scheduled appointments',
                'HD video/audio consultation',
                'Secure payment gateway',
                'Digital case records & history'
            ],
            gradient: 'from-purple-600 via-pink-600 to-rose-600',
            iconGradient: 'from-purple-500 to-pink-600',
            route: '/legal-consoltation'
        },
        {
            id: 'documents',
            icon: FileCheck,
            title: 'Document Drafting',
            subtitle: 'AI-Powered Legal Documents',
            description: 'Create professional legal documents in minutes. Our AI generates customized, legally sound templates with your information pre-filled.',
            features: [
                '500+ legal templates library',
                'Smart auto-fill technology',
                'Expert lawyer review option',
                'E-signature integration',
                'Instant download & sharing'
            ],
            gradient: 'from-orange-600 via-amber-600 to-yellow-600',
            iconGradient: 'from-orange-500 to-yellow-600',
            route: '/legal-documents-review'
        }
    ];

    // Stats
    const stats = [
        { value: '50K+', label: 'Happy Clients', icon: Users, color: 'from-blue-400 to-blue-600' },
        { value: '1000+', label: 'Expert Lawyers', icon: Award, color: 'from-purple-400 to-purple-600' },
        { value: '99%', label: 'Success Rate', icon: TrendingUp, color: 'from-pink-400 to-pink-600' },
        { value: '24/7', label: 'Available Support', icon: MessageSquare, color: 'from-amber-400 to-amber-600' }
    ];

    return (
        <div className="w-full min-h-screen bg-white dark:bg-[#0A0A0A] overflow-x-hidden">


            {/* Hero Section - Extra top margin */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity }}
                className="relative pt-36 pb-20 px-4 md:px-6 min-h-[90vh] flex items-center"
            >
                <div className="max-w-6xl mx-auto w-full">
                    <div className="text-center space-y-5 max-w-3xl mx-auto">

                        {/* Main Headline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-2"
                        >
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                                <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                                    LAW MEETS
                                </span>
                                <span className="block mt-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                    TECHNOLOGY
                                </span>
                            </h1>

                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mt-3">
                                India's most advanced legal marketplace. Get instant AI-powered legal advice,
                                consult with top lawyers, and create professional documents.
                            </p>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-3 flex-wrap"
                        >
                            <button
                                onClick={() => navigate('/chatbot')}
                                className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden text-sm"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Try AI Chatbot Free
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>

                            <button
                                onClick={() => navigate('/legal-consoltation')}
                                className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 text-sm"
                            >
                                Book Consultation
                            </button>

                            <button
                                onClick={() => navigate('/legal-documents-review')}
                                className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 text-sm"
                            >
                                Draft Documents
                            </button>
                        </motion.div>

                        {/* Trust Indicators with Pricing Link */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-wrap items-center justify-center gap-3 md:gap-5 pt-4 text-xs text-gray-600 dark:text-gray-400"
                        >
                            <div className="flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                <span>Verified Lawyers</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-blue-500" />
                                <span>End-to-End Encrypted</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span>4.9/5 Rating</span>
                            </div>
                            <button
                                onClick={() => navigate('/pricing')}
                                className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                            >
                                <span>View Pricing</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.section>


            {/* Core Services Section */}
            <section className="relative py-12 md:py-16 px-4 md:px-6">
                <div className="max-w-6xl mx-auto">

                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-2 mb-10"
                    >
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            Our Premium Services
                        </h2>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Comprehensive legal solutions powered by AI and expert human lawyers
                        </p>
                    </motion.div>

                    {/* Service Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {coreServices.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onHoverStart={() => setActiveService(service.id)}
                                    onHoverEnd={() => setActiveService(null)}
                                    onClick={() => navigate(service.route)}
                                    className="group relative cursor-pointer"
                                >
                                    <div className="relative h-full bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-800 p-5 md:p-6 shadow-sm hover:shadow-xl dark:shadow-gray-900/50 transition-all duration-500 overflow-hidden">

                                        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`} />

                                        <div className="relative mb-4">
                                            <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${service.iconGradient} shadow-md group-hover:scale-110 transition-transform duration-500`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                        </div>

                                        <div className="relative space-y-3">
                                            <div className="space-y-0.5">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300">
                                                    {service.title}
                                                </h3>
                                                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                                    {service.subtitle}
                                                </p>
                                            </div>

                                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {service.description}
                                            </p>

                                            <div className="space-y-1">
                                                {service.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-600 dark:text-gray-400">
                                                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span className="leading-tight">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pt-2">
                                                <button className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-xs group-hover:gap-2 transition-all duration-300">
                                                    Get Started
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${service.gradient} opacity-5 dark:opacity-10 rounded-bl-full`} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Section - Moved here to appear after scrolling */}
            <section className="relative py-20 px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 100,
                                        delay: index * 0.1
                                    }}
                                    className="group relative"
                                >
                                    <div className="relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-xl transition-all duration-500">

                                        {/* Animated background glow */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />

                                        <div className="relative text-center space-y-3">
                                            <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.color} p-2.5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                                <Icon className="w-full h-full text-white" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className={`text-3xl md:text-4xl font-extrabold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                                                    {stat.value}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold tracking-wide uppercase">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative py-12 px-4 md:px-6 bg-gray-50/50 dark:bg-gray-900/20">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-2 mb-8"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            Why Choose Mera Vakil?
                        </h2>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Built with cutting-edge technology and your security in mind
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { icon: Shield, title: 'Military-Grade Security', description: 'End-to-end encryption protects all your legal data.', color: 'green' },
                            { icon: Brain, title: 'Advanced AI', description: 'Powered by AI trained on millions of legal cases.', color: 'blue' },
                            { icon: Zap, title: 'Lightning Fast', description: 'Get instant answers without waiting days.', color: 'yellow' },
                            { icon: Users, title: 'Expert Network', description: 'Access India\'s top verified lawyers.', color: 'purple' },
                            { icon: Scale, title: 'Transparent Pricing', description: 'No hidden fees. Know costs upfront.', color: 'indigo' },
                            { icon: Gavel, title: 'Legal Compliance', description: 'Fully compliant with Indian regulations.', color: 'red' }
                        ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.08 }}
                                    className="group bg-white dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300"
                                >
                                    <Icon className={`w-7 h-7 mb-2.5 text-${feature.color}-500 group-hover:scale-110 transition-transform duration-300`} />
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative py-12 md:py-16 px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center space-y-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-2"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            Ready to Get Started?
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Join thousands of users who trust Mera Vakil for their legal needs.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-2.5"
                    >
                        <button
                            onClick={() => navigate('/chatbot')}
                            className="group px-5 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm"
                        >
                            <span className="flex items-center gap-2">
                                Start Free Trial
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>

                        <button
                            onClick={() => navigate('/pricing')}
                            className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 text-sm"
                        >
                            View Pricing
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 text-[11px] pt-3"
                    >
                        <Lock className="w-3 h-3" />
                        <span>Your data is protected with 256-bit encryption</span>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
