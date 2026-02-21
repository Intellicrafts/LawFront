import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSelector } from 'react-redux';
import { tokenManager } from '../../api/apiService';
import {
    Bot, Scale, FileText, Shield, CheckCircle, ArrowRight,
    Wallet, Phone, Search, Star, Users, Clock, Lock,
    Sparkles, BadgeCheck, Briefcase,
    IndianRupee, Banknote
} from 'lucide-react';

/* ──────────────────────────────────────────────────
   Landing Page — MeraBakil
   Sections: Hero, Core Services,
   Lawyer Verification, Trust Badges, Testimonials,
   Stats, Why Choose Us
   ────────────────────────────────────────────────── */

const LandingPage = () => {
    const navigate = useNavigate();
    const { mode } = useSelector((state) => state.theme);
    const isDark = mode === 'dark';
    const heroRef = useRef(null);

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
        <div className={`w-full min-h-0 overflow-x-hidden transition-colors duration-500 ${isDark
            ? 'bg-[#0A0A0A]'
            : 'bg-white'
            }`}
        >
            {/* ═══════════════════════════════════════════
              HERO SECTION — Matching Navbar Theme
              ═══════════════════════════════════════════ */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity }}
                className={`relative pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 flex items-center ${isDark
                    ? 'bg-gradient-to-b from-[#0A0A0A] via-[#0d1117] to-[#0A0A0A]'
                    : 'bg-gradient-to-b from-white via-brand-50/30 to-white'
                    }`}
            >
                {/* Ambient background glows */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-[120px] ${isDark ? 'bg-brand-500/8' : 'bg-brand-200/40'}`} />
                    <div className={`absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full blur-[100px] ${isDark ? 'bg-accent-500/5' : 'bg-accent-200/20'}`} />
                    <div className={`absolute top-40 left-10 w-[300px] h-[300px] rounded-full blur-[80px] ${isDark ? 'bg-verified-500/5' : 'bg-verified-200/20'}`} />
                </div>

                <div className="relative max-w-6xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6"
                    >
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase
                  ${isDark
                                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20 backdrop-blur-sm'
                                : 'bg-brand-50 text-brand-600 border border-brand-200'}`}
                        >
                            <Sparkles className="h-3.5 w-3.5" />
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
                                    <span className="bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 bg-clip-text text-transparent">
                                        Describe. Match. Resolve.
                                    </span>
                                </>
                            );
                            if (user?.user_type === 2) return (
                                <>
                                    Welcome Back, Advocate
                                    <br />
                                    <span className="bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 bg-clip-text text-transparent">
                                        Your Practice Hub
                                    </span>
                                </>
                            );
                            return (
                                <>
                                    Welcome Back!
                                    <br />
                                    <span className="bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 bg-clip-text text-transparent">
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
                        className={`text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed
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
                            const outlineBtnClass = `group flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-base transition-all duration-300 border-2 ${isDark ? 'border-gray-700/60 text-white hover:bg-white/5 hover:border-gray-600' : 'border-gray-300 text-brand-900 hover:bg-gray-50 hover:border-brand-300'}`;
                            const primaryBtnClass = "group flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl font-semibold text-base transition-all duration-300 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98]";

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
                            <div key={i} className={`flex items-center gap-2 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                <badge.icon className={`h-3.5 w-3.5 ${badge.color}`} />
                                <span>{badge.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* ═══════════════════════════════════════════
              CORE SERVICES
              ═══════════════════════════════════════════ */}
            <section className={`py-16 md:py-20 px-4 md:px-6 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-brand-900'}`}>
                            Everything You Need, One Platform
                        </h2>
                        <p className={`mt-3 text-sm md:text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            AI guidance, expert consultations, and legal documents — all pay-per-use.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {coreServices.map((service, i) => {
                            const colorMap = {
                                brand: { bg: 'bg-brand-500/10', text: 'text-brand-500', border: 'border-brand-500/20', hoverBorder: 'hover:border-brand-500/40', glow: 'group-hover:shadow-brand-500/10' },
                                verified: { bg: 'bg-verified-500/10', text: 'text-verified-500', border: 'border-verified-500/20', hoverBorder: 'hover:border-verified-500/40', glow: 'group-hover:shadow-verified-500/10' },
                                accent: { bg: 'bg-accent-500/10', text: 'text-accent-500', border: 'border-accent-500/20', hoverBorder: 'hover:border-accent-500/40', glow: 'group-hover:shadow-accent-500/10' },
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
                                    className={`group cursor-pointer p-7 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                        ${isDark
                                            ? `bg-[#111111]/80 backdrop-blur-sm ${colors.border} ${colors.hoverBorder}`
                                            : `bg-white border-gray-200 hover:shadow-xl ${colors.hoverBorder}`}`}
                                >
                                    <div className={`p-2.5 rounded-xl ${colors.bg} w-fit mb-4`}>
                                        <service.icon className={`h-6 w-6 ${colors.text}`} />
                                    </div>
                                    <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {service.title}
                                    </h3>
                                    <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {service.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-semibold ${colors.text}`}>
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
            <section className={`py-16 md:py-20 px-4 md:px-6 ${isDark
                ? 'bg-[#111111]'
                : 'bg-gradient-to-br from-verified-50/40 via-white to-brand-50/30'
                }`}>
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
                            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-brand-900'}`}>
                                Verify Any Lawyer's Credentials
                            </h2>
                            <p className={`text-sm md:text-base mb-6 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Before you hire, verify. Our platform checks a lawyer's Bar Council enrollment number,
                                practice areas, and standing — giving you confidence in your legal representation.
                            </p>
                            <ul className="space-y-2.5">
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
                                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-verified-500 to-verified-600 hover:from-verified-600 hover:to-verified-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-verified-500/20 hover:shadow-verified-500/30 hover:scale-[1.02] active:scale-[0.98]"
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
                            className={`p-7 rounded-2xl border ${isDark
                                ? 'bg-[#0A0A0A]/80 border-gray-800 backdrop-blur-sm'
                                : 'bg-white/90 border-gray-200 shadow-xl backdrop-blur-sm'
                                }`}
                        >
                            {/* Mock verification result card */}
                            <div className="space-y-3.5">
                                <div className="flex items-center gap-3 pb-3.5 border-b border-gray-200 dark:border-gray-700">
                                    <div className="p-2 rounded-full bg-verified-100 dark:bg-verified-500/20">
                                        <BadgeCheck className="h-5 w-5 text-verified-500" />
                                    </div>
                                    <div>
                                        <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Verification Result</p>
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
                                    <div key={i} className="flex justify-between items-center py-1.5">
                                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{row.label}</span>
                                        <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{row.value}</span>
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
            <section className={`py-14 px-4 md:px-6 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`text-center p-5 rounded-2xl transition-all duration-300 hover:scale-105 ${isDark
                                    ? 'bg-[#111111]/60 border border-gray-800/50'
                                    : 'bg-gray-50/80 border border-gray-100'
                                    }`}
                            >
                                <stat.icon className={`h-5 w-5 mx-auto mb-2 ${isDark ? 'text-brand-400' : 'text-brand-500'}`} />
                                <div className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-brand-900'}`}>
                                    {stat.value}
                                </div>
                                <div className={`text-xs mt-1 font-medium ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
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
            <section className={`py-16 md:py-20 px-4 md:px-6 ${isDark ? 'bg-[#111111]' : 'bg-gray-50/80'}`}>
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-brand-900'}`}>
                            Trusted by Thousands
                        </h2>
                        <p className={`mt-3 text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Real stories from clients and lawyers on MeraBakil.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${isDark
                                    ? 'bg-[#0A0A0A]/80 border-gray-800 backdrop-blur-sm'
                                    : 'bg-white border-gray-200 hover:shadow-lg'
                                    }`}
                            >
                                <div className="flex gap-0.5 mb-3">
                                    {Array(t.rating).fill(0).map((_, j) => (
                                        <Star key={j} className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                                    ))}
                                </div>
                                <p className={`text-sm mb-4 leading-relaxed italic ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    "{t.text}"
                                </p>
                                <div>
                                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.name}</p>
                                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{t.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
              WHY CHOOSE MERABAKIL
              ═══════════════════════════════════════════ */}
            <section className={`py-16 md:py-20 px-4 md:px-6 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-brand-900'}`}>
                            Why Choose MeraBakil?
                        </h2>
                        <p className={`mt-3 text-sm md:text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Built different — AI-first, wallet-based, no subscriptions.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {whyFeatures.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02]
                      ${isDark
                                        ? 'bg-[#111111]/60 border-gray-800/50 hover:border-brand-500/30'
                                        : 'bg-white border-gray-200 hover:shadow-md hover:border-brand-200'}`}
                            >
                                <feature.icon className={`h-5 w-5 mb-3 ${isDark ? 'text-brand-400' : 'text-brand-500'}`} />
                                <h3 className={`text-sm font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {feature.title}
                                </h3>
                                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
              FOR LAWYERS — only visible to visitors and lawyers
              ═══════════════════════════════════════════ */}
            {(!tokenManager.isAuthenticated() || tokenManager.getUser()?.user_type === 2) && (
                <section className={`py-16 md:py-20 px-4 md:px-6 ${isDark ? 'bg-[#111111]' : 'bg-brand-50/30'}`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4
                                  ${isDark ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' : 'bg-accent-50 text-accent-600 border border-accent-200'}`}>
                                    <Briefcase className="h-3 w-3" />
                                    For Legal Professionals
                                </span>
                                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-brand-900'}`}>
                                    Grow Your Practice on MeraBakil
                                </h2>
                                <p className={`text-sm md:text-base mb-6 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Join India's AI-powered legal marketplace. Get matched with clients
                                    who need your exact expertise, earn per-minute, and withdraw your
                                    earnings anytime.
                                </p>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-accent-500/20 hover:scale-[1.02] active:scale-[0.98]"
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
                                className="grid grid-cols-2 gap-3"
                            >
                                {[
                                    { icon: Users, title: 'Get Matched', desc: 'AI matches clients to your expertise — no cold outreach needed.' },
                                    { icon: IndianRupee, title: 'Per-Minute Earnings', desc: 'Earn for every minute of consultation. Fair, transparent billing.' },
                                    { icon: Banknote, title: 'Withdraw Anytime', desc: 'Your earnings go to your wallet. Withdraw to your bank whenever you want.' },
                                    { icon: Bot, title: 'AI Research Tools', desc: 'Use our AI to research cases, find precedents, and serve clients faster.' },
                                ].map((item, i) => (
                                    <div key={i} className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${isDark
                                        ? 'bg-[#0A0A0A]/80 border-gray-800'
                                        : 'bg-white border-gray-200 hover:shadow-md'
                                        }`}>
                                        <item.icon className={`h-5 w-5 mb-2 ${isDark ? 'text-accent-400' : 'text-accent-500'}`} />
                                        <h3 className={`text-xs font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                                        <p className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
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
                <section className={`py-16 md:py-20 px-4 md:px-6 ${isDark
                    ? 'bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900'
                    : 'bg-gradient-to-r from-brand-500 via-brand-600 to-brand-500'
                    }`}>
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-sm md:text-base text-white/80 mb-8 max-w-lg mx-auto">
                                Join thousands of users who trust MeraBakil for legal guidance.
                                Top up your wallet and start using AI, verified lawyers, and more.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="px-7 py-3 bg-white text-brand-600 rounded-xl font-semibold text-base hover:bg-gray-100 transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Create Free Account
                                </button>
                                <button
                                    onClick={() => navigate('/chatbot')}
                                    className="px-7 py-3 border-2 border-white/30 text-white rounded-xl font-semibold text-base hover:bg-white/10 transition-all duration-300"
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
