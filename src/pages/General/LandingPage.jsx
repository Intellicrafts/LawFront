import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import OnlineLawyersSlider from '../../components/features/OnlineLawyersSlider';
import { tokenManager } from '../../api/apiService';
import {
    Bot, Scale, FileText, Shield, CheckCircle, ArrowRight,
    Phone, Search, Star, Users, Clock, Lock,
    Sparkles, BadgeCheck, Briefcase,
    IndianRupee, Banknote, Send, ChevronRight, Wallet, MessageSquare, CalendarCheck,
    Paperclip, File as LucideFile, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ──────────────────────────────────────────────────
   Landing Page — MeraBakil
   Design System: Deep Teal + Institutional Gold
   Trust-First Verified Legal Marketplace
   ────────────────────────────────────────────────── */

const LandingPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { mode } = useSelector((state) => state.theme);
    const isDark = mode === 'dark';
    const heroRef = useRef(null);
    const [intakeQuery, setIntakeQuery] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [walletBalance, setWalletBalance] = useState(null);
    const [placeholderText, setPlaceholderText] = useState('');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    const sampleQueries = [
        "I need help drafting a generic NDA...",
        "Can a landlord evict me without notice?",
        "What are the legal steps to register a startup?",
        "How do I respond to a legal notice for debt?",
        "Review this employment contract clause..."
    ];

    React.useEffect(() => {
        let isTyping = true;
        let charIndex = 0;
        let queryIndex = 0;
        let timer;

        const type = () => {
            const currentQuery = sampleQueries[queryIndex];

            if (isTyping) {
                setPlaceholderText(currentQuery.substring(0, charIndex + 1));
                charIndex++;

                if (charIndex === currentQuery.length) {
                    isTyping = false;
                    timer = setTimeout(type, 2500); // Pause at end of sentence
                } else {
                    timer = setTimeout(type, 50); // Typing speed
                }
            } else {
                setPlaceholderText(currentQuery.substring(0, charIndex - 1));
                charIndex--;

                if (charIndex === 0) {
                    isTyping = true;
                    queryIndex = (queryIndex + 1) % sampleQueries.length;
                    timer = setTimeout(type, 500); // Pause before typing new sentence
                } else {
                    timer = setTimeout(type, 30); // Deleting speed
                }
            }
        };

        timer = setTimeout(type, 1000); // Initial delay

        return () => clearTimeout(timer);
    }, []);

    // Fetch wallet balance for logged-in customer
    React.useEffect(() => {
        if (tokenManager.isAuthenticated()) {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.wallet_balance !== undefined) setWalletBalance(user.wallet_balance);
                }
            } catch { /* silent */ }
        }
    }, []);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

    /* ── Data ──────────────────────────────────── */

    const coreServices = [
        {
            icon: Bot,
            title: t('services.aiCounsel.title'),
            description: t('services.aiCounsel.desc'),
            color: 'brand',
            meta: t('services.aiCounsel.meta'),
            route: '/chatbot',
        },
        {
            icon: Phone,
            title: t('services.lawyerNetwork.title'),
            description: t('services.lawyerNetwork.desc'),
            color: 'verified',
            meta: t('services.lawyerNetwork.meta'),
            route: '/legal-consoltation',
        },
        {
            icon: FileText,
            title: t('services.contractDraft.title'),
            description: t('services.contractDraft.desc'),
            color: 'accent',
            meta: t('services.contractDraft.meta'),
            route: '/legal-documents-review',
        },
    ];

    const howItWorks = [
        {
            step: '01',
            title: t('howItWorks.steps.step1.title'),
            desc: t('howItWorks.steps.step1.desc'),
        },
        {
            step: '02',
            title: t('howItWorks.steps.step2.title'),
            desc: t('howItWorks.steps.step2.desc'),
        },
        {
            step: '03',
            title: t('howItWorks.steps.step3.title'),
            desc: t('howItWorks.steps.step3.desc'),
        },
        {
            step: '04',
            title: t('howItWorks.steps.step4.title'),
            desc: t('howItWorks.steps.step4.desc'),
        },
    ];

    const stats = [
        { value: '500+', label: t('stats.lawyers'), icon: Users },
        { value: '10K+', label: t('stats.cases'), icon: Bot },
        { value: '<2min', label: t('stats.response'), icon: Clock },
        { value: '4.8★', label: t('stats.satisfaction'), icon: Star },
    ];

    const testimonials = [
        {
            name: t('testimonials.list.t1.name'),
            role: t('testimonials.list.t1.title'),
            city: 'Delhi',
            area: t('footer.practiceAreas.3'), // Property Law
            text: t('testimonials.list.t1.content'),
            rating: 5,
        },
        {
            name: t('testimonials.list.t2.name'),
            role: t('testimonials.list.t2.title'),
            city: 'Mumbai',
            area: t('footer.practiceAreas.2'), // Corporate Law
            text: t('testimonials.list.t2.content'),
            rating: 5,
        },
        {
            name: t('testimonials.list.t3.name'),
            role: t('testimonials.list.t3.title'),
            city: 'Bengaluru',
            area: t('nav.findLawyer'),
            text: t('testimonials.list.t3.content'),
            rating: 5,
        },
    ];

    const whyFeatures = [
        {
            icon: Bot,
            title: t('whyChooseUs.feature1.title'),
            description: t('whyChooseUs.feature1.desc'),
        },
        {
            icon: BadgeCheck,
            title: t('whyChooseUs.feature2.title'),
            description: t('whyChooseUs.feature2.desc'),
        },
        {
            icon: Lock,
            title: t('whyChooseUs.feature3.title'),
            description: t('whyChooseUs.feature3.desc'),
        },
        {
            icon: Phone,
            title: t('whyChooseUs.feature4.title'),
            description: t('whyChooseUs.feature4.desc'),
        },
        {
            icon: Search,
            title: t('whyChooseUs.feature5.title'),
            description: t('whyChooseUs.feature5.desc'),
        },
        {
            icon: Shield,
            title: t('whyChooseUs.feature6.title'),
            description: t('whyChooseUs.feature6.desc'),
        },
    ];

    /* ── Shared class builders ── */

    const primaryBtn = `group inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm text-white
      bg-brand-500 hover:bg-brand-600 active:bg-brand-700
      transition-all duration-200 shadow-teal-glow hover:shadow-teal-glow-lg hover:-translate-y-0.5 active:translate-y-0`;

    const outlineBtn = `group inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm
      border-2 border-brand-300 text-brand-700 hover:border-brand-500 hover:bg-brand-50
      dark:border-brand-700 dark:text-brand-300 dark:hover:border-brand-400 dark:hover:bg-brand-900/20
      transition-all duration-200`;


    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleIntakeSubmit = (e) => {
        e.preventDefault();
        const trimmedQuery = intakeQuery.trim();
        if (trimmedQuery || selectedFiles.length > 0) {
            // Pass the query and files via React Router state
            navigate('/chatbot', {
                state: {
                    prefillQuery: trimmedQuery,
                    files: selectedFiles
                }
            });
        } else {
            navigate('/chatbot');
        }
    };

    /* ── Render ────────────────────────────────── */

    return (
        <div className={`w-full min-h-0 overflow-x-hidden transition-colors duration-500 ${isDark
            ? 'bg-dark-bg'
            : 'bg-[hsl(40,20%,97%)]'
            }`}
        >
            {/* ═══════════════════════════════════════════
              HERO SECTION
              ═══════════════════════════════════════════ */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity }}
                className={`relative pt-24 md:pt-36 pb-12 md:pb-16 px-4 md:px-6 ${isDark
                    ? 'bg-dark-bg'
                    : 'bg-[hsl(40,20%,97%)]'
                    }`}
            >
                {/* Subtle top border line */}
                <div className={`absolute top-0 left-0 right-0 h-px ${isDark ? 'bg-brand-900/60' : 'bg-brand-100'}`} />

                <div className="relative max-w-4xl mx-auto text-center">
                    {/* Eyebrow badge */}


                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.1 }}
                        className={`text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-4
              ${isDark ? 'text-white' : 'text-gray-900'}`}
                    >
                        Your Legal Matters, In<br />
                        <span className="text-[#00E5FF] font-serif italic font-light drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                            Trusted Hands.
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`text-base md:text-lg max-w-xl mx-auto mb-12 font-medium tracking-wide
              ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                        Pick up where you left off, or start something new.
                    </motion.p>

                    {/* Unified AI Chat Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.25 }}
                        className="mb-6 w-full max-w-3xl mx-auto"
                    >
                        <form onSubmit={handleIntakeSubmit}>
                            <div className={`relative flex items-center w-full rounded-2xl border transition-all duration-300 shadow-lg hover:shadow-xl
                                ${isDark ? 'bg-[#1A1A1A]/40 border-gray-700/50 focus-within:border-[#00E5FF]/50 focus-within:shadow-[0_0_30px_rgba(0,229,255,0.15)] focus-within:-translate-y-0.5'
                                    : 'bg-white/80 border-gray-200 focus-within:border-[#00E5FF] focus-within:shadow-[0_0_30px_rgba(0,229,255,0.2)] focus-within:-translate-y-0.5'}`}
                                style={{ backdropFilter: 'blur(12px)' }}
                            >
                                <textarea
                                    value={intakeQuery}
                                    onChange={(e) => setIntakeQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleIntakeSubmit(e);
                                        }
                                    }}
                                    rows={1}
                                    placeholder=""
                                    className={`w-full bg-transparent pl-6 pr-[64px] py-[18px] text-sm resize-none outline-none leading-relaxed h-[56px] overflow-hidden rounded-2xl z-10
                                        ${isDark ? 'text-white font-medium' : 'text-gray-900 font-medium'}`}
                                />
                                {/* Animated Placeholder built as absolute underlay/overlay */}
                                {!intakeQuery && (
                                    <div className={`absolute left-6 top-[18px] pointer-events-none text-sm font-medium flex items-center z-20
                                            ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {placeholderText}
                                        <span className="w-0.5 h-4 bg-current ml-[1px] animate-[pulse_1s_ease-in-out_infinite]" style={{ opacity: 0.8 }} />
                                    </div>
                                )}
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex items-center gap-2">
                                    <input
                                        type="file"
                                        id="landing-file-input"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('landing-file-input').click()}
                                        className={`flex items-center justify-center h-10 w-10 rounded-xl transition-all
                                            ${isDark ? 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                                : 'bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-200'}`}
                                        title={t('chat.uploadFiles')}
                                    >
                                        <Paperclip size={18} />
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-teal-400 hover:from-cyan-400 hover:to-teal-500 text-teal-950 transition-all shadow-lg hover:shadow-cyan-500/40 hover:scale-105 group"
                                    >
                                        <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-0.5 group-active:scale-95" strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* File Preview Chips for Landing Page - Horizontal Scrolling */}
                        <AnimatePresence>
                            {selectedFiles.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="flex overflow-x-auto gap-2 mt-4 pb-2 scrollbar-hide max-w-full px-4 justify-start sm:justify-center no-scrollbar"
                                >
                                    {selectedFiles.map((file, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-bold shadow-sm backdrop-blur-md flex-shrink-0
                                                ${isDark ? 'bg-white/10 border-white/20 text-slate-200' : 'bg-white/80 border-gray-200 text-slate-700'}`}
                                        >
                                            <LucideFile size={12} className="text-[#00E5FF]" />
                                            <span className="max-w-[120px] truncate">{file.name}</span>
                                            <button
                                                onClick={() => removeFile(idx)}
                                                className="ml-1 p-0.5 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Secondary action pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.35 }}
                        className="flex flex-wrap items-center justify-center gap-3 mb-16"
                    >
                        <button
                            onClick={() => navigate('/legal-consoltation')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border transition-all hover:-translate-y-1 duration-200
                                ${isDark ? 'bg-white/[0.03] border-gray-700 text-gray-300 hover:border-[#00E5FF]/50 hover:text-white hover:bg-white/[0.05]'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-[#00E5FF] hover:text-teal-700 shadow-sm'}`}
                            style={{ backdropFilter: 'blur(8px)' }}
                        >
                            <Users className="h-4 w-4 text-gray-400" />
                            Find a Lawyer
                        </button>
                        <button
                            onClick={() => tokenManager.isAuthenticated() ? navigate('/legal-consoltation?view=appointments') : navigate('/auth')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border transition-all hover:-translate-y-1 duration-200
                                ${isDark ? 'bg-white/[0.03] border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white hover:bg-white/[0.05]'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:text-gray-900 shadow-sm'}`}
                            style={{ backdropFilter: 'blur(8px)' }}
                        >
                            <CalendarCheck className="h-4 w-4 text-gray-400" />
                            My Appointments
                        </button>
                    </motion.div>

                    {/* Online Lawyers Slider */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="w-full"
                    >
                        <OnlineLawyersSlider />
                    </motion.div>

                </div>
            </motion.section >

            {/* ═══════════════════════════════════════════
              HOW IT WORKS — 4-step linear flow
              ═══════════════════════════════════════════ */}
            < section className={`py-16 md:py-20 px-4 md:px-6 border-t
              ${isDark ? 'border-dark-border bg-dark-bg-secondary' : 'border-brand-100 bg-white'}`}
            >
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <p className={`text-xs font-semibold tracking-widest uppercase mb-3 ${isDark ? 'text-brand-400' : 'text-brand-600'}`}>
                            {t('howItWorks.badge')}
                        </p>
                        <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-dark-text' : 'text-brand-900'}`}>
                            {t('howItWorks.title')}
                        </h2>
                    </motion.div>

                    {/* Steps — connected, linear */}
                    <div className="relative">
                        {/* Connector line (desktop) */}
                        <div className={`hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px
                          ${isDark ? 'bg-brand-800' : 'bg-brand-200'}`}
                        />

                        <div className="grid md:grid-cols-4 gap-8 md:gap-6 relative">
                            {howItWorks.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex flex-col items-center text-center"
                                >
                                    {/* Step number bubble */}
                                    <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-5 font-bold text-lg
                      border-2 transition-all duration-300
                      ${isDark
                                            ? 'bg-dark-bg-secondary border-brand-700 text-brand-400'
                                            : 'bg-brand-500 border-brand-500 text-white shadow-teal-glow'}`}
                                    >
                                        {step.step}
                                    </div>
                                    <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-dark-text' : 'text-brand-900'}`}>
                                        {step.title}
                                    </h3>
                                    <p className={`text-xs leading-relaxed max-w-[200px] ${isDark ? 'text-dark-text-tertiary' : 'text-gray-500'}`}>
                                        {step.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section >

            {/* ═══════════════════════════════════════════
              CORE SERVICES
              ═══════════════════════════════════════════ */}
            < section className={`py-16 md:py-20 px-4 md:px-6 border-t
              ${isDark ? 'border-dark-border bg-dark-bg' : 'border-brand-100 bg-[hsl(40,20%,97%)]'}`}
            >
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <p className={`text-xs font-semibold tracking-widest uppercase mb-3 ${isDark ? 'text-brand-400' : 'text-brand-600'}`}>
                            {t('services.badge')}
                        </p>
                        <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-dark-text' : 'text-brand-900'}`}>
                            {t('services.title')}
                        </h2>
                        <p className={`mt-3 text-sm max-w-lg mx-auto ${isDark ? 'text-dark-text-tertiary' : 'text-gray-500'}`}>
                            {t('services.subtitle')}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {coreServices.map((service, i) => {
                            const colorMap = {
                                brand: {
                                    iconBg: isDark ? 'bg-brand-900/50' : 'bg-brand-50',
                                    icon: isDark ? 'text-brand-400' : 'text-brand-600',
                                    border: isDark ? 'border-dark-border hover:border-brand-700' : 'border-gray-200 hover:border-brand-300',
                                    meta: isDark ? 'text-brand-400' : 'text-brand-600',
                                },
                                verified: {
                                    iconBg: isDark ? 'bg-verified-900/30' : 'bg-verified-50',
                                    icon: isDark ? 'text-verified-400' : 'text-verified-600',
                                    border: isDark ? 'border-dark-border hover:border-verified-800' : 'border-gray-200 hover:border-verified-300',
                                    meta: isDark ? 'text-verified-400' : 'text-verified-600',
                                },
                                accent: {
                                    iconBg: isDark ? 'bg-accent-900/30' : 'bg-accent-50',
                                    icon: isDark ? 'text-accent-400' : 'text-accent-600',
                                    border: isDark ? 'border-dark-border hover:border-accent-800' : 'border-gray-200 hover:border-accent-300',
                                    meta: isDark ? 'text-accent-400' : 'text-accent-600',
                                },
                            };
                            const c = colorMap[service.color];

                            return (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -4 }}
                                    onClick={() => navigate(service.route)}
                                    className={`group cursor-pointer p-7 rounded-md border transition-all duration-200 hover:shadow-card-hover
                      ${isDark ? `bg-dark-bg-secondary ${c.border}` : `bg-white ${c.border} shadow-card`}`}
                                >
                                    <div className={`p-2.5 rounded-md ${c.iconBg} w-fit mb-5`}>
                                        <service.icon className={`h-5 w-5 ${c.icon}`} />
                                    </div>
                                    <h3 className={`text-base font-semibold mb-2 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                                        {service.title}
                                    </h3>
                                    <p className={`text-sm mb-5 leading-relaxed ${isDark ? 'text-dark-text-tertiary' : 'text-gray-500'}`}>
                                        {service.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-semibold ${c.meta}`}>
                                            {service.meta}
                                        </span>
                                        <span className={`flex items-center gap-1 text-xs font-medium ${c.meta}`}>
                                            {t('services.learnMore')}
                                            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section >

            {/* ═══════════════════════════════════════════
              LAWYER VERIFICATION
              ═══════════════════════════════════════════ */}
            < section className={`py-16 md:py-20 px-4 md:px-6 border-t
              ${isDark ? 'border-dark-border bg-dark-bg-secondary' : 'border-brand-100 bg-white'}`}
            >
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="badge-verified mb-5 inline-flex animate-badge-pulse">
                                <BadgeCheck className="h-3.5 w-3.5" />
                                {t('verification.badge')}
                            </span>
                            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-dark-text' : 'text-brand-900'}`}>
                                {t('verification.title')}
                            </h2>
                            <p className={`text-sm md:text-base mb-6 leading-relaxed ${isDark ? 'text-dark-text-tertiary' : 'text-gray-600'}`}>
                                {t('verification.desc')}
                            </p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    t('verification.feature1'),
                                    t('verification.feature2'),
                                    t('verification.feature3'),
                                    t('verification.feature4'),
                                ].map((item, i) => (
                                    <li key={i} className={`flex items-center gap-3 text-sm ${isDark ? 'text-dark-text-secondary' : 'text-gray-700'}`}>
                                        <CheckCircle className="h-4 w-4 text-brand-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => navigate('/verify-lawyer')}
                                className={primaryBtn}
                            >
                                <BadgeCheck className="h-4 w-4" />
                                {t('verification.cta')}
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>

                        {/* Mock verification result */}
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`p-7 rounded-md border shadow-card
                ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-[hsl(40,20%,97%)] border-brand-100'}`}
                        >
                            <div className="space-y-4">
                                <div className={`flex items-center gap-3 pb-4 border-b ${isDark ? 'border-dark-border' : 'border-brand-100'}`}>
                                    <div className={`p-2.5 rounded-md ${isDark ? 'bg-brand-900/50' : 'bg-brand-50'}`}>
                                        <BadgeCheck className="h-5 w-5 text-brand-500" />
                                    </div>
                                    <div>
                                        <p className={`font-semibold text-sm ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                                            {t('verification.mock.title')}
                                        </p>
                                        <p className={`text-xs font-semibold text-brand-600 flex items-center gap-1`}>
                                            <CheckCircle className="h-3 w-3" /> {t('verification.mock.status')}
                                        </p>
                                    </div>
                                </div>
                                {[
                                    { label: t('verification.mock.name'), value: 'Adv. Sanjay Kumar Mishra' },
                                    { label: t('verification.mock.barNo'), value: 'UP/1234/2015' },
                                    { label: t('verification.mock.state'), value: 'Active' },
                                    { label: t('verification.mock.areas'), value: 'Criminal, Family, Civil' },
                                    { label: t('verification.mock.exp'), value: '11 Years' },
                                    { label: t('verification.mock.loc'), value: 'Lucknow, UP' },
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <span className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-gray-400'}`}>{row.label}</span>
                                        <span className={`text-xs font-medium ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* ═══════════════════════════════════════════
              STATS STRIP
              ═══════════════════════════════════════════ */}
            < section className={`py-14 px-4 md:px-6 border-t
              ${isDark ? 'border-dark-border bg-dark-bg' : 'border-brand-100 bg-[hsl(40,20%,97%)]'}`}
            >
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="text-center"
                            >
                                <stat.icon className={`h-4 w-4 mx-auto mb-2 ${isDark ? 'text-brand-500' : 'text-brand-400'}`} />
                                <div className={`text-3xl md:text-4xl font-bold mb-1
                  ${isDark ? 'text-accent-400' : 'text-accent-600'}`}
                                >
                                    {stat.value}
                                </div>
                                <div className={`text-xs font-medium ${isDark ? 'text-dark-text-muted' : 'text-gray-500'}`}>
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* ═══════════════════════════════════════════
              TESTIMONIALS
              ═══════════════════════════════════════════ */}
            < section className={`py-16 md:py-20 px-4 md:px-6 border-t
              ${isDark ? 'border-dark-border bg-dark-bg-secondary' : 'border-brand-100 bg-white'}`}
            >
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <p className={`text-xs font-semibold tracking-widest uppercase mb-3 ${isDark ? 'text-brand-400' : 'text-brand-600'}`}>
                            {t('testimonials.badge')}
                        </p>
                        <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-dark-text' : 'text-brand-900'}`}>
                            {t('testimonials.title')}
                        </h2>
                        <p className={`mt-3 text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-gray-500'}`}>
                            {t('testimonials.subtitle')}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-6 rounded-md border transition-all duration-200 hover:shadow-card-hover
                  ${isDark
                                        ? 'bg-dark-bg border-dark-border'
                                        : 'bg-[hsl(40,20%,97%)] border-brand-100 shadow-card'}`}
                            >
                                <div className="flex gap-0.5 mb-3">
                                    {Array(t.rating).fill(0).map((_, j) => (
                                        <Star key={j} className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
                                    ))}
                                </div>
                                <p className={`text-sm mb-5 leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                                    "{t.text}"
                                </p>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className={`text-sm font-semibold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                                            {t.name}
                                        </p>
                                        <p className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-gray-400'}`}>{t.role}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-[11px] font-medium ${isDark ? 'text-brand-400' : 'text-brand-600'}`}>{t.area}</p>
                                        <p className={`text-[11px] ${isDark ? 'text-dark-text-muted' : 'text-gray-400'}`}>{t.city}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* ═══════════════════════════════════════════
              WHY CHOOSE MERABAKIL
              ═══════════════════════════════════════════ */}
            < section className={`py-16 md:py-20 px-4 md:px-6 border-t
              ${isDark ? 'border-dark-border bg-dark-bg' : 'border-brand-100 bg-[hsl(40,20%,97%)]'}`}
            >
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <p className={`text-xs font-semibold tracking-widest uppercase mb-3 ${isDark ? 'text-brand-400' : 'text-brand-600'}`}>
                            {t('hero.tryFree')}
                        </p>
                        <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-dark-text' : 'text-brand-900'}`}>
                            {t('whyChooseUs.title')}
                        </h2>
                        <p className={`mt-3 text-sm max-w-md mx-auto ${isDark ? 'text-dark-text-tertiary' : 'text-gray-500'}`}>
                            {t('whyChooseUs.subtitle')}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {whyFeatures.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                                className={`p-6 rounded-md border transition-all duration-200 hover:shadow-card-hover group
                  ${isDark
                                        ? 'bg-dark-bg-secondary border-dark-border hover:border-brand-800'
                                        : 'bg-white border-gray-200 hover:border-brand-200 shadow-card'}`}
                            >
                                <div className={`p-2 rounded-md w-fit mb-4 transition-colors duration-200
                  ${isDark ? 'bg-brand-900/50 group-hover:bg-brand-800/50' : 'bg-brand-50 group-hover:bg-brand-100'}`}
                                >
                                    <feature.icon className={`h-4 w-4 ${isDark ? 'text-brand-400' : 'text-brand-600'}`} />
                                </div>
                                <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                                    {feature.title}
                                </h3>
                                <p className={`text-xs leading-relaxed ${isDark ? 'text-dark-text-tertiary' : 'text-gray-500'}`}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* ═══════════════════════════════════════════
              FOR LAWYERS
              ═══════════════════════════════════════════ */}
            {
                (!tokenManager.isAuthenticated() || tokenManager.getUser()?.user_type === 2) && (
                    <section id="for-lawyers" className={`py-16 md:py-20 px-4 md:px-6 border-t
                  ${isDark ? 'border-dark-border bg-dark-bg-secondary' : 'border-brand-100 bg-brand-900'}`}
                    >
                        <div className="max-w-6xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -24 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5 animate-badge-pulse
                  ${isDark
                                            ? 'bg-accent-900/30 text-accent-400 border border-accent-800'
                                            : 'bg-accent-500/20 text-accent-200 border border-accent-500/30'}`}
                                    >
                                        <Briefcase className="h-3.5 w-3.5" />
                                        {t('forLawyers.badge')}
                                    </span>
                                    <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-dark-text' : 'text-white'}`}>
                                        {t('forLawyers.title')}
                                    </h2>
                                    <p className={`text-sm md:text-base mb-6 leading-relaxed ${isDark ? 'text-dark-text-tertiary' : 'text-brand-100'}`}>
                                        {t('forLawyers.desc1')} {t('forLawyers.desc2')}
                                    </p>
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm
                    bg-accent-500 hover:bg-accent-600 text-white shadow-gold-glow
                    transition-all duration-200 hover:-translate-y-0.5"
                                    >
                                        <Briefcase className="h-4 w-4" />
                                        {t('forLawyers.cta')}
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 24 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    {[
                                        { icon: Users, title: t('lawyerFeatures.f1.title'), desc: t('lawyerFeatures.f1.desc') },
                                        { icon: IndianRupee, title: t('lawyerFeatures.f2.title'), desc: t('lawyerFeatures.f2.desc') },
                                        { icon: Banknote, title: t('lawyerFeatures.f3.title'), desc: t('lawyerFeatures.f3.desc') },
                                        { icon: Bot, title: t('lawyerFeatures.f4.title'), desc: t('lawyerFeatures.f4.desc') },
                                    ].map((item, i) => (
                                        <div key={i} className={`p-4 rounded-md border transition-all duration-200
                      ${isDark
                                                ? 'bg-dark-bg border-dark-border'
                                                : 'bg-white/10 border-white/20 hover:bg-white/15'}`}
                                        >
                                            <item.icon className={`h-4 w-4 mb-3 ${isDark ? 'text-accent-400' : 'text-accent-300'}`} />
                                            <h3 className={`text-xs font-semibold mb-1.5 ${isDark ? 'text-dark-text' : 'text-white'}`}>{item.title}</h3>
                                            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-dark-text-tertiary' : 'text-brand-200'}`}>{item.desc}</p>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </section>
                )
            }

            {/* ═══════════════════════════════════════════
              FINAL CTA — visitors only
              ═══════════════════════════════════════════ */}
            {
                !tokenManager.isAuthenticated() && (
                    <section className={`py-16 md:py-20 px-4 md:px-6 border-t
                  ${isDark ? 'border-dark-border bg-dark-bg' : 'border-t-0 bg-brand-600'}`}
                    >
                        <div className="max-w-3xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-dark-text' : 'text-white'}`}>
                                    {t('finalCta.title')}
                                </h2>
                                <p className={`text-sm md:text-base mb-10 max-w-lg mx-auto leading-relaxed
                ${isDark ? 'text-dark-text-tertiary' : 'text-brand-100'}`}
                                >
                                    {t('finalCta.subtitle')}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className={`px-7 py-3 rounded-md font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5
                    ${isDark
                                                ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-teal-glow'
                                                : 'bg-white text-brand-700 hover:bg-brand-50 shadow-lg'}`}
                                    >
                                        {t('finalCta.cta')}
                                    </button>
                                    <button
                                        onClick={() => navigate('/chatbot')}
                                        className={`px-7 py-3 border-2 rounded-md font-semibold text-sm transition-all duration-200
                    ${isDark
                                                ? 'border-brand-700 text-brand-300 hover:bg-brand-900/30'
                                                : 'border-white/30 text-white hover:bg-white/10'}`}
                                    >
                                        {t('finalCta.ctaLawyer')}
                                    </button>
                                </div>
                                <p className={`mt-6 text-xs ${isDark ? 'text-dark-text-muted' : 'text-brand-200'}`}>
                                    {t('whyChooseUs.feature6.desc')}
                                </p>
                            </motion.div>
                        </div>
                    </section>
                )
            }
        </div >
    );
};

export default LandingPage;
