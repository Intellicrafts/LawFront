import React from 'react';
import { useSelector } from 'react-redux';
import { AlertTriangle, Bot, Scale, ShieldAlert, Mail } from 'lucide-react';

/* ──────────────────────────────────────────────────
   Legal Disclaimer Page — Mera Vakil
   Clarifies that the platform is a technology
   marketplace, not a law firm, and that AI responses
   are informational only.
   ────────────────────────────────────────────────── */

const LegalDisclaimer = () => {
    const { mode } = useSelector((state) => state.theme);
    const isDark = mode === 'dark';

    const textClass = `text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`;

    return (
        <div className={`min-h-screen pt-24 pb-16 px-4 md:px-8 ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-gray-900'}`}>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-yellow-500/10">
                            <AlertTriangle className="h-6 w-6 text-yellow-500" />
                        </div>
                        <h1 className="text-3xl font-bold">Legal Disclaimer</h1>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Last updated: February 2026
                    </p>
                </div>

                {/* Main Disclaimer */}
                <div className={`mb-8 p-6 rounded-xl ${isDark ? 'bg-yellow-900/20 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <div className="flex items-start gap-3">
                        <ShieldAlert className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Important Notice
                            </h2>
                            <p className={textClass}>
                                Mera Vakil is a <strong>technology platform and marketplace</strong> — it is not a law firm,
                                does not practice law, and does not provide legal advice. Use of the platform does not create
                                an attorney-client relationship between you and Mera Vakil.
                            </p>
                        </div>
                    </div>
                </div>

                {/* AI Disclaimer */}
                <div className="mb-8">
                    <h2 className={`text-xl font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Bot className="h-5 w-5 text-brand-500" />
                        AI Assistant Limitations
                    </h2>
                    <p className={`${textClass} mb-3`}>
                        The AI legal assistant on Mera Vakil is designed to provide general informational guidance
                        based on publicly available legal knowledge. Please understand:
                    </p>
                    <ul className={`list-disc list-inside space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li>AI responses are <strong>not legal advice</strong> and should not be treated as such.</li>
                        <li>The AI may produce inaccurate, incomplete, or outdated information.</li>
                        <li>AI-generated content should be verified by a qualified legal professional before acting upon it.</li>
                        <li>The AI does not have access to specific case details, court filings, or privileged information.</li>
                        <li>Using the AI assistant does not establish an attorney-client privilege or confidentiality.</li>
                    </ul>
                </div>

                {/* Lawyer Services */}
                <div className="mb-8">
                    <h2 className={`text-xl font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Scale className="h-5 w-5 text-brand-500" />
                        Lawyer Services
                    </h2>
                    <p className={textClass}>
                        Lawyers listed on Mera Vakil are independent legal professionals. Mera Vakil does not control,
                        supervise, or direct the professional services they provide. We verify lawyer credentials through
                        Bar Council records but make no guarantees about the quality or outcome of their services.
                        The relationship between a client and a lawyer on the platform is governed by applicable
                        professional conduct rules and their own engagement terms.
                    </p>
                </div>

                {/* Lawyer Verification */}
                <div className="mb-8">
                    <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Lawyer Verification Service
                    </h2>
                    <p className={textClass}>
                        The lawyer verification feature allows users to verify a lawyer's credentials against Bar Council
                        records. This service is provided on a best-effort basis. While we strive for accuracy, we do not
                        guarantee that verification results are complete, current, or error-free. Users should independently
                        confirm a lawyer's standing before engaging their services.
                    </p>
                </div>

                {/* Compliance */}
                <div className="mb-8">
                    <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Regulatory Compliance
                    </h2>
                    <p className={textClass}>
                        This platform operates in compliance with applicable Indian laws, including the Information
                        Technology Act, 2000, the Bar Council of India Rules, and relevant consumer protection
                        regulations. If you believe any content on this platform violates applicable laws, please
                        contact us immediately.
                    </p>
                </div>

                {/* Contact */}
                <div className={`mb-8 p-6 rounded-xl ${isDark ? 'bg-dark-bg-secondary border border-dark-border' : 'bg-gray-50 border border-gray-200'}`}>
                    <h2 className={`text-xl font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Mail className="h-5 w-5 text-brand-500" />
                        Contact
                    </h2>
                    <p className={textClass}>
                        For legal concerns or compliance inquiries, contact us at{' '}
                        <a href="mailto:legal@meravakil.com" className="text-brand-500 hover:underline">legal@meravakil.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LegalDisclaimer;
