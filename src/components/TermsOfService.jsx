import React from 'react';
import { useSelector } from 'react-redux';
import { FileText, Wallet, Bot, AlertTriangle, Mail } from 'lucide-react';

/* ──────────────────────────────────────────────────
   Terms of Service Page — MeraBakil
   Covers platform role, wallet terms, AI limitations,
   and user/lawyer obligations.
   ────────────────────────────────────────────────── */

const TermsOfService = () => {
    const { mode } = useSelector((state) => state.theme);
    const isDark = mode === 'dark';

    const sectionClass = `mb-8`;
    const headingClass = `text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`;
    const textClass = `text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`;
    const listClass = `list-disc list-inside space-y-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`;

    return (
        <div className={`min-h-screen pt-24 pb-16 px-4 md:px-8 ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-gray-900'}`}>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-brand-500/10">
                            <FileText className="h-6 w-6 text-brand-500" />
                        </div>
                        <h1 className="text-3xl font-bold">Terms of Service</h1>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Last updated: February 2026
                    </p>
                </div>

                {/* Platform Role */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>1. About MeraBakil</h2>
                    <p className={textClass}>
                        MeraBakil is a technology marketplace that connects clients with verified legal professionals.
                        We are <strong>not a law firm</strong> and do not provide legal advice directly. Lawyers on our
                        platform are independent professionals responsible for the quality of their services.
                    </p>
                </div>

                {/* Wallet Terms */}
                <div className={`${sectionClass} p-6 rounded-xl ${isDark ? 'bg-dark-bg-secondary border border-dark-border' : 'bg-accent-50 border border-accent-200'}`}>
                    <h2 className={headingClass}>
                        <Wallet className="inline h-5 w-5 mr-2 text-accent-500" />
                        2. Wallet & Credits
                    </h2>
                    <p className={`${textClass} mb-3`}>
                        MeraBakil operates on a wallet-based credit system. By using credits, you agree to the following:
                    </p>
                    <ul className={listClass}>
                        <li><strong>Dual Balance:</strong> Your wallet contains two pools — earned balance (from recharges) and promotional balance (from welcome bonuses, coupons, referrals).</li>
                        <li><strong>Debit Priority:</strong> When using any paid service, your earned balance is consumed first. If earned balance is insufficient, promotional balance is used for the remaining amount.</li>
                        <li><strong>Per-Minute Billing:</strong> Lawyer consultations are billed per minute. The per-minute rate is displayed before each consultation begins.</li>
                        <li><strong>Service Charges:</strong> AI queries, document drafting, appointment bookings, and lawyer verification each have published credit costs.</li>
                        <li><strong>Withdrawals:</strong> Only earned balance can be withdrawn to your bank account. Promotional balance cannot be converted to cash.</li>
                        <li><strong>Refunds:</strong> Service refunds are credited back to your wallet as earned balance. Refund eligibility depends on the specific service terms.</li>
                        <li><strong>Non-Transferable:</strong> Wallet credits cannot be transferred between accounts.</li>
                    </ul>
                </div>

                {/* AI Limitations */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>
                        <Bot className="inline h-5 w-5 mr-2 text-brand-500" />
                        3. AI Assistant
                    </h2>
                    <p className={textClass}>
                        Our AI legal assistant provides informational guidance based on publicly available legal knowledge.
                        AI responses <strong>do not constitute legal advice</strong> and should not be relied upon as a
                        substitute for professional legal counsel. Each AI query consumes wallet credits. The accuracy,
                        completeness, and applicability of AI-generated content is not guaranteed.
                    </p>
                </div>

                {/* Lawyer Verification */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>4. Lawyer Verification</h2>
                    <p className={textClass}>
                        Our platform offers a paid lawyer verification service that cross-references a lawyer's credentials
                        against Bar Council records. While we make reasonable efforts to verify credentials, we do not
                        guarantee the accuracy of third-party records. Users should conduct their own due diligence.
                        The verification service consumes wallet credits.
                    </p>
                </div>

                {/* User Responsibilities */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>5. User Responsibilities</h2>
                    <ul className={listClass}>
                        <li>Provide accurate and complete registration information.</li>
                        <li>Maintain the confidentiality of your account credentials.</li>
                        <li>Not use the platform for illegal purposes or to harass other users.</li>
                        <li>Respect the intellectual property rights of lawyers and the platform.</li>
                        <li>Comply with all applicable Indian laws and regulations.</li>
                    </ul>
                </div>

                {/* Limitation of Liability */}
                <div className={`${sectionClass} p-6 rounded-xl ${isDark ? 'bg-yellow-900/20 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <h2 className={headingClass}>
                        <AlertTriangle className="inline h-5 w-5 mr-2 text-yellow-500" />
                        6. Limitation of Liability
                    </h2>
                    <p className={textClass}>
                        MeraBakil shall not be liable for any direct, indirect, incidental, or consequential damages
                        arising from the use of our platform, including but not limited to: reliance on AI-generated
                        content, outcomes of lawyer consultations, or wallet transaction disputes. Our total liability
                        shall not exceed the amount of credits in your wallet at the time of the claim.
                    </p>
                </div>

                {/* Governing Law */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>7. Governing Law</h2>
                    <p className={textClass}>
                        These terms are governed by the laws of India. Any disputes arising from the use of MeraBakil
                        shall be subject to the exclusive jurisdiction of the courts in Greater Noida, Uttar Pradesh, India.
                    </p>
                </div>

                {/* Contact */}
                <div className={`${sectionClass} p-6 rounded-xl ${isDark ? 'bg-dark-bg-secondary border border-dark-border' : 'bg-gray-50 border border-gray-200'}`}>
                    <h2 className={headingClass}>
                        <Mail className="inline h-5 w-5 mr-2 text-brand-500" />
                        Contact
                    </h2>
                    <p className={textClass}>
                        For questions about these terms, contact us at{' '}
                        <a href="mailto:legal@merabakil.com" className="text-brand-500 hover:underline">legal@merabakil.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
