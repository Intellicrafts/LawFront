import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSelector } from 'react-redux';
import { tokenManager } from '../../api/apiService';
import {
    Bot, Scale, FileText, Shield, CheckCircle, ArrowRight,
    Wallet, Phone, Search, Star, Users, Clock, Lock,
    Sparkles, BadgeCheck, CreditCard, Zap, Briefcase,
    IndianRupee, TrendingUp, Banknote
} from 'lucide-react';

/* ──────────────────────────────────────────────────
   Landing Page — Mera Vakil
   Sections: Hero, How Credits Work, Core Services,
   Lawyer Verification, Trust Badges, Testimonials,
   Stats, Why Choose Us
   ────────────────────────────────────────────────── */

const LandingPage = () => {
    const navigate = useNavigate();
    const { mode } = useSelector((state) => state.theme);
    const isDark = mode === 'dark';
    const heroRef = useRef(null);
    const [activeService, setActiveService] = useState(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

    /* ── Data ──────────────────────────────────── */

    // Core services offered
    const coreServices = [
        {
            icon: Bot,
            title: 'AI Legal Assistant',
            description: 'Get instant, practical answers to legal queries. Our AI understands Indian law and guides you step-by-step.',
            color: 'brand',
            creditCost: 'From ₹2/query',
            route: '/chatbot',
        },
        {
            icon: Phone,
            title: 'Expert Consultation',
            description: 'Talk to verified lawyers via audio or internet call. Per-minute billing — pay only for the time you use.',
            color: 'verified',
            creditCost: 'Per-minute billing',
            route: '/legal-consoltation',
        },
        {
            icon: FileText,
            title: 'Document Drafting',
            description: 'AI-powered legal document templates. Generate contracts, agreements, and legal notices in minutes.',
            color: 'accent',
            creditCost: 'From ₹50/document',
            route: '/legal-documents-review',
        },
    ];

    // How the credit system works


    // Trust badges
    const trustBadges = [
        { icon: BadgeCheck, label: 'Bar Council Verified Lawyers', color: 'text-verified-500' },
        { icon: Lock, label: '256-bit Encrypted', color: 'text-brand-500' },
        { icon: Sparkles, label: 'AI-Powered Platform', color: 'text-accent-500' },
    ];

    // Stats
    const stats = [
        { value: '500+', label: 'Verified Lawyers', icon: Users },
        { value: '10K+', label: 'Legal Queries Resolved', icon: Bot },
        { value: '<2min', label: 'Average Response Time', icon: Clock },
        { value: '4.8★', label: 'User Rating', icon: Star },
    ];

    // Testimonials
    const testimonials = [
        {
            name: 'Priya Sharma',
            role: 'Small Business Owner',
            text: 'The AI assistant helped me understand my lease agreement in 5 minutes. When I needed a lawyer, I found one within seconds and paid only for a 10-minute call.',
            rating: 5,
        },
        {
            name: 'Rajesh Patel',
            role: 'Startup Founder',
            text: 'The wallet system is brilliant — no subscriptions, no hidden fees. I topped up ₹500 and got AI guidance, a verified lawyer consultation, and a drafted NDA.',
            rating: 5,
        },
        {
            name: 'Adv. Meera Iyer',
            role: 'Family Law Specialist',
            text: 'As a lawyer on the platform, I love the per-minute billing. I get paid fairly, clients get transparency, and the research tools help me serve better.',
            rating: 5,
        },
    ];

    // Why Choose Us features
    const whyFeatures = [
        {
            icon: Bot,
            title: 'AI That Understands Indian Law',
            description: 'Not a generic chatbot — our AI is trained on Indian legal codes, precedents, and practical guidance.',
        },
        {
            icon: BadgeCheck,
            title: 'Verify Any Lawyer',
            description: 'Use our verification service to check any lawyer\'s Bar Council credentials before you engage them.',
        },
        {
            icon: Wallet,
            title: 'No Subscriptions, No Lock-in',
            description: 'Wallet credits never expire. Recharge when you need, withdraw earned balance anytime.',
        },
        {
            icon: Phone,
            title: 'Per-Minute Consultations',
            description: 'Talk to lawyers and pay by the minute. No flat fees for 5 minutes when you only needed 2.',
        },
        {
            icon: Search,
            title: 'Case Status Checking',
            description: 'Track your court case status directly from the platform. Stay updated without visiting courts.',
        },
        {
            icon: Shield,
            title: 'End-to-End Encrypted',
            description: 'All communications, documents, and payment data are encrypted with bank-grade security.',
        },
    ];

    /* ── Render ────────────────────────────────── */

    return (
        <div className={`w-full min-h-screen overflow-x-hidden ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>

            {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity }}
                className="relative pt-28 md:pt-36 pb-16 md:pb-24 px-4 md:px-6 min-h-[85vh] flex items-center"
            >
                {/* Background gradient */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl opacity-20
            ${isDark ? 'bg-brand-500' : 'bg-brand-200'}`}
                    />
                    <div className={`absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-10
            ${isDark ? 'bg-accent-500' : 'bg-accent-200'}`}
                    />
                </div>

                <div className="relative max-w-6xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6"
                    >
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium
              ${isDark
                                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                                : 'bg-brand-50 text-brand-600 border border-brand-200'}`}
                        >
                            <Sparkles className="h-4 w-4" />
                            India's AI-Powered Legal Marketplace
                        </span>
                    </motion.div>

                    {/* Headline — role-based */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className={`text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6
              ${isDark ? 'text-white' : 'text-brand-900'}`}
                    >
                        {(() => {
                            const user = tokenManager.getUser();
                            if (!tokenManager.isAuthenticated()) return (
                                <>
                                    Your AI Legal Partner
                                    <br />
                                    <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                                        Describe. Match. Resolve.
                                    </span>
                                </>
                            );
                            if (user?.user_type === 2) return (
                                <>
                                    Welcome Back, Advocate
                                    <br />
                                    <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                                        Your Practice Hub
                                    </span>
                                </>
                            );
                            return (
                                <>
                                    Welcome Back!
                                    <br />
                                    <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                                        What can we help with?
                                    </span>
                                </>
                            );
                        })()}
                    </motion.h1>

                    {/* Subtitle — role-based */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed
              ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                        {(() => {
                            const user = tokenManager.getUser();
                            if (!tokenManager.isAuthenticated())
                                return 'Describe your legal situation to our AI — it analyzes your case and recommends the right verified lawyer. Book instantly, consult per-minute, or browse lawyers directly. Pay only for what you use.';
                            if (user?.user_type === 2)
                                return 'Manage your appointments, track earnings, and connect with clients who need your expertise.';
                            return 'Continue where you left off — chat with AI, connect with lawyers, or manage your wallet.';
                        })()}
                    </motion.p>

                    {/* CTAs — role-based */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                    >
                        {(() => {
                            const user = tokenManager.getUser();
                            const outlineBtnClass = `group flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-lg transition-all border-2 ${isDark ? 'border-gray-700 text-white hover:bg-gray-800' : 'border-gray-300 text-brand-900 hover:bg-gray-50'}`;
                            const primaryBtnClass = "group flex items-center gap-2 px-8 py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40";

                            // Lawyer experience
                            if (tokenManager.isAuthenticated() && user?.user_type === 2) return (
                                <>
                                    <button onClick={() => navigate('/lawyer-admin')} className={primaryBtnClass}>
                                        <Briefcase className="h-5 w-5" />
                                        Dashboard
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button onClick={() => navigate('/profile')} className={outlineBtnClass}>
                                        <Users className="h-5 w-5" />
                                        My Profile
                                    </button>
                                </>
                            );

                            // Client experience
                            if (tokenManager.isAuthenticated()) return (
                                <>
                                    <button onClick={() => navigate('/chatbot')} className={primaryBtnClass}>
                                        <Bot className="h-5 w-5" />
                                        AI Assistant
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button onClick={() => navigate('/legal-consoltation')} className={outlineBtnClass}>
                                        <Scale className="h-5 w-5" />
                                        Find a Lawyer
                                    </button>
                                </>
                            );

                            // Visitor experience
                            return (
                                <>
                                    <button onClick={() => navigate('/chatbot')} className={primaryBtnClass}>
                                        <Bot className="h-5 w-5" />
                                        Talk to AI Assistant
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button onClick={() => navigate('/legal-consoltation')} className={outlineBtnClass}>
                                        <Scale className="h-5 w-5" />
                                        Find a Lawyer
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </>
                            );
                        })()}
                    </motion.div>

                    {/* Trust badges strip */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-wrap items-center justify-center gap-6"
                    >
                        {trustBadges.map((badge, i) => (
                            <div key={i} className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                <badge.icon className={`h-4 w-4 ${badge.color}`} />
                                <span>{badge.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* ═══════════════════════════════════════════
          HOW CREDITS WORK — 3-step visual flow
          ═══════════════════════════════════════════ */}


            {/* ═══════════════════════════════════════════
          CORE SERVICES
          ═══════════════════════════════════════════ */}
            <section className="py-16 md:py-20 px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-brand-900'}`}>
                            Everything You Need, One Platform
                        </h2>
                        <p className={`mt-3 text-lg max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            AI guidance, expert consultations, and legal documents — all pay-per-use.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {coreServices.map((service, i) => {
                            const colorMap = {
                                brand: { bg: 'bg-brand-500/10', text: 'text-brand-500', border: 'border-brand-500/20', hoverBorder: 'hover:border-brand-500/40' },
                                verified: { bg: 'bg-verified-500/10', text: 'text-verified-500', border: 'border-verified-500/20', hoverBorder: 'hover:border-verified-500/40' },
                                accent: { bg: 'bg-accent-500/10', text: 'text-accent-500', border: 'border-accent-500/20', hoverBorder: 'hover:border-accent-500/40' },
                            };
                            const colors = colorMap[service.color];

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    onClick={() => navigate(service.route)}
                                    className={`group cursor-pointer p-8 rounded-2xl border transition-all
                    ${isDark
                                            ? `bg-dark-bg ${colors.border} ${colors.hoverBorder}`
                                            : `bg-white border-gray-200 hover:shadow-xl ${colors.hoverBorder}`}`}
                                >
                                    <div className={`p-3 rounded-xl ${colors.bg} w-fit mb-5`}>
                                        <service.icon className={`h-7 w-7 ${colors.text}`} />
                                    </div>
                                    <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {service.title}
                                    </h3>
                                    <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {service.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${colors.text}`}>
                                            {service.creditCost}
                                        </span>
                                        <ArrowRight className={`h-4 w-4 ${colors.text} group-hover:translate-x-1 transition-transform`} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          LAWYER VERIFICATION — standalone paid feature
          ═══════════════════════════════════════════ */}
            <section className={`py-16 md:py-20 px-4 md:px-6 ${isDark ? 'bg-dark-bg-secondary' : 'bg-verified-50/50'}`}>
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="badge-verified mb-4 inline-flex">
                                <BadgeCheck className="h-3 w-3" /> Free Verification Service
                            </span>
                            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-brand-900'}`}>
                                Verify Any Lawyer's Credentials
                            </h2>
                            <p className={`text-lg mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Before you hire, verify. Our platform checks a lawyer's Bar Council enrollment number,
                                practice areas, and standing — giving you confidence in your legal representation.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Cross-reference Bar Council of India records',
                                    'Verify enrollment number & practice status',
                                    'Check years of experience & specializations',
                                    'Instant results — completely free',
                                ].map((item, i) => (
                                    <li key={i} className={`flex items-center gap-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <CheckCircle className="h-4 w-4 text-verified-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => navigate('/verify-lawyer')}
                                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-verified-500 hover:bg-verified-600 text-white rounded-xl font-semibold transition-all"
                            >
                                <BadgeCheck className="h-5 w-5" />
                                Verify a Lawyer
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`p-8 rounded-2xl border ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-white border-gray-200 shadow-lg'}`}
                        >
                            {/* Mock verification result card */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="p-2 rounded-full bg-verified-100 dark:bg-verified-500/20">
                                        <BadgeCheck className="h-6 w-6 text-verified-500" />
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Verification Result</p>
                                        <p className="text-xs text-verified-500 font-medium">✓ Verified & Active</p>
                                    </div>
                                </div>
                                {[
                                    { label: 'Name', value: 'Adv. Sanjay Kumar Mishra' },
                                    { label: 'Bar Council', value: 'UP/1234/2015' },
                                    { label: 'Status', value: 'Active' },
                                    { label: 'Practice Areas', value: 'Criminal, Family, Civil' },
                                    { label: 'Experience', value: '11 Years' },
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center py-2">
                                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{row.label}</span>
                                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          STATS STRIP
          ═══════════════════════════════════════════ */}
            <section className="py-16 px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${isDark ? 'text-brand-400' : 'text-brand-500'}`} />
                                <div className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-brand-900'}`}>
                                    {stat.value}
                                </div>
                                <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════ */}
            <section className={`py-16 md:py-20 px-4 md:px-6 ${isDark ? 'bg-dark-bg-secondary' : 'bg-gray-50'}`}>
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-brand-900'}`}>
                            Trusted by Thousands
                        </h2>
                        <p className={`mt-3 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Real stories from clients and lawyers on Mera Vakil.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className={`p-6 rounded-2xl border ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-white border-gray-200'}`}
                            >
                                <div className="flex gap-1 mb-4">
                                    {Array(t.rating).fill(0).map((_, j) => (
                                        <Star key={j} className="h-4 w-4 fill-accent-400 text-accent-400" />
                                    ))}
                                </div>
                                <p className={`text-sm mb-4 leading-relaxed italic ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    "{t.text}"
                                </p>
                                <div>
                                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.name}</p>
                                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          WHY CHOOSE MERA VAKIL — comparison vs competitors
          ═══════════════════════════════════════════ */}
            <section className="py-16 md:py-20 px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-brand-900'}`}>
                            Why Choose Mera Vakil?
                        </h2>
                        <p className={`mt-3 text-lg max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Built different — AI-first, wallet-based, no subscriptions.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {whyFeatures.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-6 rounded-xl border transition-all hover:scale-[1.02]
                  ${isDark
                                        ? 'bg-dark-bg-secondary border-dark-border hover:border-brand-500/30'
                                        : 'bg-white border-gray-200 hover:shadow-md'}`}
                            >
                                <feature.icon className={`h-6 w-6 mb-3 ${isDark ? 'text-brand-400' : 'text-brand-500'}`} />
                                <h3 className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {feature.title}
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          FOR LAWYERS — only visible to visitors and lawyers, hidden for clients
          ═══════════════════════════════════════════ */}
            {(!tokenManager.isAuthenticated() || tokenManager.getUser()?.user_type === 2) && (
                <section className={`py-16 md:py-20 px-4 md:px-6 ${isDark ? 'bg-dark-bg-secondary' : 'bg-brand-50/50'}`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4
                              ${isDark ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' : 'bg-accent-50 text-accent-600 border border-accent-200'}`}>
                                    <Briefcase className="h-3 w-3" />
                                    For Legal Professionals
                                </span>
                                <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-brand-900'}`}>
                                    Grow Your Practice on Mera Vakil
                                </h2>
                                <p className={`text-lg mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Join India's AI-powered legal marketplace. Get matched with clients
                                    who need your exact expertise, earn per-minute, and withdraw your
                                    earnings anytime.
                                </p>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-all"
                                >
                                    <Briefcase className="h-5 w-5" />
                                    Register as a Lawyer
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="grid grid-cols-2 gap-4"
                            >
                                {[
                                    { icon: Users, title: 'Get Matched', desc: 'AI matches clients to your expertise — no cold outreach needed.' },
                                    { icon: IndianRupee, title: 'Per-Minute Earnings', desc: 'Earn for every minute of consultation. Fair, transparent billing.' },
                                    { icon: Banknote, title: 'Withdraw Anytime', desc: 'Your earnings go to your wallet. Withdraw to your bank whenever you want.' },
                                    { icon: Bot, title: 'AI Research Tools', desc: 'Use our AI to research cases, find precedents, and serve clients faster.' },
                                ].map((item, i) => (
                                    <div key={i} className={`p-5 rounded-xl border ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-white border-gray-200'}`}>
                                        <item.icon className={`h-6 w-6 mb-3 ${isDark ? 'text-accent-400' : 'text-accent-500'}`} />
                                        <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════
          FINAL CTA — only for visitors
          ═══════════════════════════════════════════ */}
            {!tokenManager.isAuthenticated() && (
                <section className={`py-16 md:py-20 px-4 md:px-6 ${isDark ? 'bg-brand-900' : 'bg-brand-500'}`}>
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-lg text-white/80 mb-8">
                                Join thousands of users who trust Mera Vakil for legal guidance.
                                Top up your wallet and start using AI, verified lawyers, and more.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="px-8 py-3.5 bg-white text-brand-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
                                >
                                    Create Free Account
                                </button>
                                <button
                                    onClick={() => navigate('/chatbot')}
                                    className="px-8 py-3.5 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
                                >
                                    Try AI Assistant
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default LandingPage;
