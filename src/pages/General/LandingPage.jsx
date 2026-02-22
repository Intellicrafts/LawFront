import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSelector } from 'react-redux';
import { tokenManager } from '../../api/apiService';
import {
    Bot, Scale, FileText, Shield, CheckCircle, ArrowRight,
    Phone, Search, Star, Users, Clock, Lock,
    Sparkles, BadgeCheck, Briefcase,
    IndianRupee, Banknote, Send, ChevronRight, Wallet, MessageSquare, CalendarCheck
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
    const [walletBalance, setWalletBalance] = useState(null);

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

    const handleIntakeSubmit = (e) => {
        e.preventDefault();
        if (intakeQuery.trim()) {
            navigate(`/chatbot?q=${encodeURIComponent(intakeQuery.trim())}`);
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
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-6"
                    >
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase
              ${isDark
                                ? 'bg-brand-900/50 text-brand-300 border border-brand-800'
                                : 'bg-brand-50 text-brand-700 border border-brand-200'}`}
                        >
                            <BadgeCheck className="h-3.5 w-3.5 text-accent-500" />
                            {t('hero.badge')}
                        </span>
                    </motion.div>

                    {/* Headline — serif for authority */}
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.1 }}
                        className={`text-4xl md:text-6xl lg:text-[68px] font-bold leading-[1.12] tracking-tight mb-5
              ${isDark ? 'text-dark-text' : 'text-brand-900'}`}
                    >
                        {(() => {
                            const user = tokenManager.getUser();
                            if (!tokenManager.isAuthenticated()) return (
                                <>
                                    {t('hero.headlineGuest1') || 'Your Legal Problem,'}{' '}
                                    <span className="text-brand-600 italic">{t('hero.headlineGuest2') || 'In Safe Hands.'}</span>
                                </>
                            );
                            if (user?.user_type === 2) return (
                                <>
                                    {t('hero.headlineLawyer1') || 'Welcome Back,'}{' '}
                                    <span className="text-brand-600 italic">{t('hero.headlineLawyer2') || 'Advocate.'}</span>
                                </>
                            );
                            return (
                                <>
                                    {t('hero.headline1')}{' '}
                                    <span className="text-brand-600 italic">{t('hero.headline2')}</span>
                                </>
                            );
                        })()}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed
              ${isDark ? 'text-dark-text-tertiary' : 'text-gray-600'}`}
                    >
                        {(() => {
                            const user = tokenManager.getUser();
                            if (!tokenManager.isAuthenticated())
                                return t('hero.subheadlineGuestLanding') || 'Get clear on your rights. A verified lawyer takes it from there.';
                            if (user?.user_type === 2)
                                return t('hero.subheadlineLawyer') || 'Manage appointments, track earnings, and connect with matched clients.';
                            return t('hero.subheadline');
                        })()}
                    </motion.p>

                    {/* AI Intake Widget — the hero IS the product */}
                    {!tokenManager.isAuthenticated() && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, delay: 0.25 }}
                                className="mb-6 max-w-2xl mx-auto"
                            >
                                <form onSubmit={handleIntakeSubmit}>
                                    <div className={`relative rounded-lg border-2 transition-all duration-200
                      ${isDark
                                            ? 'bg-dark-bg-secondary border-dark-border focus-within:border-brand-600'
                                            : 'bg-white border-brand-200 focus-within:border-brand-500 shadow-card hover:shadow-card-hover'}`}
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
                                            rows={3}
                                            placeholder={t('hero.chatPlaceholder')}
                                            className={`w-full px-5 pt-4 pb-3 text-sm leading-relaxed resize-none rounded-t-lg
                          bg-transparent border-none
                          ${isDark ? 'text-dark-text placeholder-dark-text-muted' : 'text-gray-800 placeholder-gray-400'}
                          focus:ring-0 focus:outline-none`}
                                        />
                                        <div className={`flex items-center justify-between px-4 py-2.5 border-t
                        ${isDark ? 'border-dark-border' : 'border-brand-100'}`}
                                        >
                                            <p className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-dark-text-muted' : 'text-gray-400'}`}>
                                                <Lock className="h-3 w-3" />
                                                {t('hero.chatPrivate')}
                                            </p>
                                            <button
                                                type="submit"
                                                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold
                            text-white bg-brand-500 hover:bg-brand-600 transition-colors duration-150`}
                                            >
                                                <Send className="h-3.5 w-3.5" />
                                                {t('hero.getAiGuidance')}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                <p className={`mt-2.5 text-center text-[11px] ${isDark ? 'text-dark-text-muted' : 'text-gray-400'}`}>
                                    {t('hero.guestDisclaimer')}
                                </p>
                            </motion.div>

                            {/* Guest secondary CTA — Browse lawyers */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: 0.35 }}
                                className="flex items-center gap-4 max-w-sm mx-auto mb-4"
                            >
                                <div className={`flex-1 h-px ${isDark ? 'bg-dark-border' : 'bg-gray-200'}`} />
                                <span className={`text-[11px] font-medium ${isDark ? 'text-dark-text-muted' : 'text-gray-400'}`}>{t('hero.orDivider')}</span>
                                <div className={`flex-1 h-px ${isDark ? 'bg-dark-border' : 'bg-gray-200'}`} />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: 0.4 }}
                                className="flex justify-center mb-10"
                            >
                                <button
                                    onClick={() => tokenManager.isAuthenticated() ? navigate('/legal-consoltation') : navigate('/auth')}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold border transition-all duration-200 group ${isDark
                                        ? 'border-dark-border text-dark-text-secondary hover:border-brand-500 hover:text-brand-400'
                                        : 'border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-600'
                                        }`}
                                >
                                    <Scale className="h-4 w-4" />
                                    {t('hero.findLawyer')}
                                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </motion.div>
                        </>
                    )}

                    {/* Dashboard strip — authenticated customer */}
                    {tokenManager.isAuthenticated() && (() => {
                        const user = tokenManager.getUser();
                        if (user?.user_type === 2) return (
                            // Lawyer — just two buttons
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.25 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
                            >
                                <button onClick={() => navigate('/lawyer-admin')} className={primaryBtn}>
                                    <Briefcase className="h-4 w-4" />
                                    {t('nav.dashboard')}
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button onClick={() => navigate('/profile')} className={outlineBtn}>
                                    <Users className="h-4 w-4" />
                                    {t('nav.profile')}
                                </button>
                            </motion.div>
                        );

                        // Client — rich quick-action strip
                        const firstName = user?.name?.split(' ')[0] || user?.full_name?.split(' ')[0] || 'there';
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="w-full max-w-2xl mx-auto mb-10"
                            >
                                {/* Wallet balance pill */}
                                {walletBalance !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex justify-center mb-5"
                                    >
                                        <button
                                            onClick={() => navigate('/wallet')}
                                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:-translate-y-0.5 ${isDark
                                                ? 'bg-accent-900/20 border-accent-700/30 text-accent-400 hover:bg-accent-900/30'
                                                : 'bg-accent-50 border-accent-200 text-accent-700 hover:bg-accent-100'
                                                }`}
                                        >
                                            <Wallet className="h-3 w-3" />
                                            {t('hero.walletBalance')}: ₹{walletBalance}
                                            <ChevronRight className="h-3 w-3" />
                                        </button>
                                    </motion.div>
                                )}

                                {/* ── Inline AI Chat Widget ── */}
                                <motion.form
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const q = intakeQuery.trim();
                                        navigate('/chatbot', { state: { prefillQuery: q } });
                                    }}
                                    className={`relative w-full rounded-2xl border shadow-md transition-all duration-200 focus-within:shadow-lg ${isDark
                                        ? 'bg-dark-surface border-dark-border focus-within:border-brand-500/50'
                                        : 'bg-white border-gray-200 focus-within:border-brand-400'
                                        }`}
                                >
                                    <textarea
                                        autoFocus
                                        rows={2}
                                        value={intakeQuery}
                                        onChange={(e) => setIntakeQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                navigate('/chatbot', { state: { prefillQuery: intakeQuery.trim() } });
                                            }
                                        }}
                                        placeholder={t('hero.chatPlaceholder')}
                                        className={`w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm leading-relaxed outline-none placeholder:text-sm ${isDark
                                            ? 'text-dark-text placeholder:text-dark-text-muted'
                                            : 'text-gray-800 placeholder:text-gray-400'
                                            }`}
                                    />
                                    <div className={`flex items-center justify-between px-3 pb-3 pt-1 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                        <span className={`text-[10px] font-medium ${isDark ? 'text-dark-text-muted' : 'text-gray-400'}`}>
                                            {t('hero.chatHint')}
                                        </span>
                                        <motion.button
                                            type="submit"
                                            whileTap={{ scale: 0.95 }}
                                            whileHover={{ scale: 1.04 }}
                                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors duration-150 shadow-sm"
                                        >
                                            <Send className="h-3 w-3" />
                                            {t('hero.askTia')}
                                        </motion.button>
                                    </div>
                                </motion.form>

                                {/* ── Secondary quick-action pills ── */}
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex items-center justify-center gap-3 mt-4"
                                >
                                    <button
                                        onClick={() => navigate('/legal-consoltation')}
                                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 hover:-translate-y-0.5 ${isDark
                                            ? 'border-dark-border text-dark-text-secondary hover:border-brand-500/50 hover:text-brand-400'
                                            : 'border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600 bg-white shadow-sm'
                                            }`}
                                    >
                                        <Scale className="h-3 w-3" />
                                        {t('hero.findLawyer')}
                                    </button>
                                    <button
                                        onClick={() => navigate('/legal-consoltation?view=appointments')}
                                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 hover:-translate-y-0.5 ${isDark
                                            ? 'border-dark-border text-dark-text-secondary hover:border-accent-500/50 hover:text-accent-400'
                                            : 'border-gray-200 text-gray-600 hover:border-accent-300 hover:text-accent-600 bg-white shadow-sm'
                                            }`}
                                    >
                                        <CalendarCheck className="h-3 w-3" />
                                        {t('hero.myAppointments')}
                                    </button>
                                </motion.div>
                            </motion.div>
                        );
                    })()}

                    {/* Trust strip */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-4 border-t
              ${isDark ? 'border-dark-border' : 'border-brand-100'}`}
                    >
                        {[
                            { icon: BadgeCheck, label: t('trust.barCouncil'), color: 'text-brand-500' },
                            { icon: Lock, label: t('trust.encrypted'), color: 'text-brand-500' },
                            { icon: Sparkles, label: t('trust.aiAssisted'), color: 'text-accent-500' },
                        ].map((badge, i) => (
                            <div key={i} className={`flex items-center gap-2 text-xs font-medium ${isDark ? 'text-dark-text-tertiary' : 'text-gray-500'}`}>
                                <badge.icon className={`h-3.5 w-3.5 ${badge.color}`} />
                                <span>{badge.label}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Lawyer entry point */}
                    {!tokenManager.isAuthenticated() && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="flex justify-center pt-4"
                        >
                            <button
                                onClick={() => document.getElementById('for-lawyers')?.scrollIntoView({ behavior: 'smooth' })}
                                className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-150
                                    ${isDark ? 'text-dark-text-muted hover:text-accent-400' : 'text-gray-400 hover:text-brand-600'}`}
                            >
                                <Briefcase className="h-3.5 w-3.5" />
                                {t('hero.lawyerQuestion')}
                                <span className={`underline underline-offset-2 ${isDark ? 'text-accent-400' : 'text-brand-600'}`}>
                                    {t('hero.joinPlatform')}
                                </span>
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.section>

            {/* ═══════════════════════════════════════════
              HOW IT WORKS — 4-step linear flow
              ═══════════════════════════════════════════ */}
            <section className={`py-16 md:py-20 px-4 md:px-6 border-t
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
            </section>

            {/* ═══════════════════════════════════════════
              CORE SERVICES
              ═══════════════════════════════════════════ */}
            <section className={`py-16 md:py-20 px-4 md:px-6 border-t
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
            </section>

            {/* ═══════════════════════════════════════════
              LAWYER VERIFICATION
              ═══════════════════════════════════════════ */}
            <section className={`py-16 md:py-20 px-4 md:px-6 border-t
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
            </section>

            {/* ═══════════════════════════════════════════
              STATS STRIP
              ═══════════════════════════════════════════ */}
            <section className={`py-14 px-4 md:px-6 border-t
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
            </section>

            {/* ═══════════════════════════════════════════
              TESTIMONIALS
              ═══════════════════════════════════════════ */}
            <section className={`py-16 md:py-20 px-4 md:px-6 border-t
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
            </section>

            {/* ═══════════════════════════════════════════
              WHY CHOOSE MERABAKIL
              ═══════════════════════════════════════════ */}
            <section className={`py-16 md:py-20 px-4 md:px-6 border-t
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
            </section>

            {/* ═══════════════════════════════════════════
              FOR LAWYERS
              ═══════════════════════════════════════════ */}
            {(!tokenManager.isAuthenticated() || tokenManager.getUser()?.user_type === 2) && (
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
            )}

            {/* ═══════════════════════════════════════════
              FINAL CTA — visitors only
              ═══════════════════════════════════════════ */}
            {!tokenManager.isAuthenticated() && (
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
            )}
        </div>
    );
};

export default LandingPage;
