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
    Phone
} from 'lucide-react';

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

    const plans = [
        {
            name: 'Starter',
            subtitle: 'For individuals',
            price: '₹0',
            period: '/month',
            description: 'Perfect for trying out our AI legal services',
            icon: Sparkles,
            gradient: 'from-blue-500 to-cyan-500',
            popular: false,
            features: [
                '5 AI chatbot queries/month',
                'Basic legal document templates',
                'Email support',
                'Community access',
                'Legal news updates'
            ],
            cta: 'Start Free',
            route: '/chatbot'
        },
        {
            name: 'Professional',
            subtitle: 'Most popular',
            price: '₹999',
            period: '/month',
            description: 'Ideal for professionals and small businesses',
            icon: Crown,
            gradient: 'from-purple-500 to-pink-500',
            popular: true,
            features: [
                'Unlimited AI chatbot queries',
                '500+ premium document templates',
                '2 video consultations/month',
                'Priority support (24/7)',
                'Document review service',
                'Legal case tracking',
                'Expert lawyer network access',
                'Mobile app access'
            ],
            cta: 'Get Started',
            route: '/signup'
        },
        {
            name: 'Enterprise',
            subtitle: 'For teams',
            price: '₹4,999',
            period: '/month',
            description: 'Complete legal solution for businesses',
            icon: Zap,
            gradient: 'from-orange-500 to-amber-500',
            popular: false,
            features: [
                'Everything in Professional',
                'Unlimited video consultations',
                'Dedicated account manager',
                'Custom document templates',
                'API access',
                'Team collaboration tools',
                'Advanced analytics',
                'White-label option',
                'On-premise deployment'
            ],
            cta: 'Contact Sales',
            route: '/contact'
        }
    ];

    const addOns = [
        {
            icon: MessageSquare,
            title: 'AI Chat Add-on',
            price: '₹199/month',
            description: '50 additional AI queries'
        },
        {
            icon: Calendar,
            title: 'Consultation Pack',
            price: '₹799/session',
            description: '1-hour video consultation'
        },
        {
            icon: FileText,
            title: 'Document Review',
            price: '₹499/document',
            description: 'Expert lawyer review'
        },
        {
            icon: Phone,
            title: 'Priority Support',
            price: '₹299/month',
            description: '24/7 phone support'
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
                                Pricing
                            </h1>
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
                                <span>7-day money-back guarantee</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-blue-500" />
                                <span>Cancel anytime</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span>Trusted by 50K+ users</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="py-8 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {plans.map((plan, index) => {
                                const Icon = plan.icon;
                                return (
                                    <motion.div
                                        key={plan.name}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className={`relative group ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''
                                            }`}
                                    >
                                        {/* Popular Badge */}
                                        {plan.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                                <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg">
                                                    MOST POPULAR
                                                </div>
                                            </div>
                                        )}

                                        {/* Card */}
                                        <div className={`relative h-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${plan.popular
                                            ? 'border-2 border-purple-500 dark:border-purple-400'
                                            : 'border border-gray-200 dark:border-gray-800'
                                            }`}>

                                            {/* Gradient Overlay */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`} />

                                            {/* Content */}
                                            <div className="relative space-y-4">
                                                {/* Icon */}
                                                <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${plan.gradient} shadow-md`}>
                                                    <Icon className="w-5 h-5 text-white" />
                                                </div>

                                                {/* Plan Name */}
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                        {plan.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {plan.subtitle}
                                                    </p>
                                                </div>

                                                {/* Price */}
                                                <div className="flex items-baseline gap-1">
                                                    <span className={`text-4xl font-extrabold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                                                        {plan.price}
                                                    </span>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {plan.period}
                                                    </span>
                                                </div>

                                                {/* Description */}
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    {plan.description}
                                                </p>

                                                {/* CTA Button */}
                                                <button
                                                    onClick={() => navigate(plan.route)}
                                                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 ${plan.popular
                                                        ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg hover:shadow-xl`
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {plan.cta}
                                                </button>

                                                {/* Features */}
                                                <div className="pt-4 space-y-2 border-t border-gray-200 dark:border-gray-800">
                                                    {plan.features.map((feature, idx) => (
                                                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                            <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                                                            <span className="leading-tight">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Corner Accent */}
                                            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${plan.gradient} opacity-5 dark:opacity-10 rounded-bl-full`} />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Add-ons Section */}
                <section className="py-12 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center space-y-2 mb-8"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                Add-ons & Extras
                            </h2>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Enhance your plan with these optional add-ons
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {addOns.map((addon, index) => {
                                const Icon = addon.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300"
                                    >
                                        <Icon className="w-6 h-6 mb-2 text-blue-500" />
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                                            {addon.title}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                            {addon.description}
                                        </p>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                                            {addon.price}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
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
