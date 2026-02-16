import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Check,
    Star,
    Zap,
    Crown,
    Sparkles,
    Shield,
    MessageSquare,
    FileText,
    Users,
    Calendar,
    Phone,
    Wallet,
    CreditCard
} from 'lucide-react';
import { useSelector } from 'react-redux';

const Pricing = () => {
    const navigate = useNavigate();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Get previous URL or default to home
    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const services = [
        {
            icon: Sparkles,
            title: 'AI Legal Assistant',
            price: '₹19',
            unit: '/query',
            description: 'Instant answers to your legal queries powered by advanced AI.',
            features: ['24/7 Availability', 'Instant Responses', 'Case Law Research']
        },
        {
            icon: Calendar,
            title: 'Video Consultation',
            price: '₹799',
            unit: '/session',
            description: '1-on-1 video call with an expert lawyer for personalized advice.',
            features: ['60 Minutes', 'Expert Lawyers', 'Secure Video Call']
        },
        {
            icon: FileText,
            title: 'Document Review',
            price: '₹499',
            unit: '/document',
            description: 'Get your legal documents reviewed by professionals.',
            features: ['Risk Analysis', 'Clause Suggestions', '24h Turnaround']
        },
        {
            icon: Shield,
            title: 'Drafting Services',
            price: '₹1,499',
            unit: '/document',
            description: 'Custom legal document drafting tailored to your needs.',
            features: ['Contracts', 'Agreements', 'Notices']
        },
        {
            icon: Phone,
            title: 'Priority Support',
            price: '₹299',
            unit: '/month',
            description: 'Dedicated support line for urgent legal assistance.',
            features: ['Direct Line', 'Priority Handling', 'Case Tracking']
        },
        {
            icon: Users,
            title: 'Corporate Retainer',
            price: 'Custom',
            unit: '',
            description: 'Ongoing legal support for your business needs.',
            features: ['Dedicated Team', 'Monthly Audit', 'Compliance']
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] overflow-x-hidden">


            {/* Content Container */}
            <div className="relative z-10 scale-90 origin-top">
                {/* Back Button - Professional */}
                <div className="sticky top-0 z-50 bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-xl border-b border-transparent">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
                        <button
                            onClick={handleBack}
                            className="group flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Back</span>
                        </button>
                    </div>
                </div>

                {/* Header */}
                <section className="pt-12 pb-8 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto text-center space-y-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                Service Rates
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-2">
                                Transparent, pay-as-you-go pricing. No hidden fees, no subscriptions.
                            </p>
                        </motion.div>

                        {/* Trust Badge */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400 pt-2"
                        >
                            <div className="flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-green-500" />
                                <span>Secure Payments</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-blue-500" />
                                <span>Verified Lawyers</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span>Top Rated Service</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════
                 HOW CREDITS WORK (Moved from Landing Page)
                 ═══════════════════════════════════════════ */}
                <section className="py-8 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
                                <Wallet className="h-3 w-3" /> Wallet-Based Pricing
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                How Credits Work
                            </h2>
                            <p className="mt-3 text-sm md:text-base max-w-xl mx-auto text-gray-600 dark:text-gray-400">
                                No subscriptions. No hidden fees. Recharge your wallet and use any service.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-6 mb-16">
                            {[
                                {
                                    step: '01',
                                    icon: Wallet,
                                    title: 'Top Up Your Wallet',
                                    description: 'Recharge with any amount. New users get welcome bonus credits to try services free.',
                                },
                                {
                                    step: '02',
                                    icon: Zap,
                                    title: 'Use Any Service',
                                    description: 'AI queries, lawyer calls, document drafts, verification — all deduct from your wallet balance.',
                                },
                                {
                                    step: '03',
                                    icon: CreditCard,
                                    title: 'Pay Only For What You Use',
                                    description: 'Your balance never expires. Withdraw unused credits back to your bank account anytime.',
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="relative p-6 rounded-2xl border transition-all bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 group"
                                >
                                    <div className="text-4xl font-black mb-4 text-gray-100 dark:text-gray-800 absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                        {item.step}
                                    </div>
                                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 w-fit mb-4">
                                        <item.icon className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {item.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Service Rates Grid */}
                <section className="py-8 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {services.map((service, index) => {
                                const Icon = service.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 group"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white transition-all duration-300">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {service.price}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                    {service.unit}
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-10">
                                            {service.description}
                                        </p>

                                        <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                                            {service.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <Check className="w-3 h-3 text-green-500" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => navigate('/wallet')}
                                            className="w-full mt-6 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm border border-gray-200 dark:border-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 dark:hover:bg-blue-600 dark:hover:border-blue-600 transition-all duration-300"
                                        >
                                            Add Credits
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>

                {/* FAQ / Additional Info */}
                <section className="py-12 px-4 md:px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Still have questions?
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Our team is here to help you choose the right plan for your needs.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm"
                                >
                                    Contact Sales
                                </button>
                                <button
                                    onClick={() => navigate('/chatbot')}
                                    className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 text-sm"
                                >
                                    Try AI Chatbot
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Pricing;
