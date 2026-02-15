import React from 'react';
import { useSelector } from 'react-redux';
import { Shield, Lock, Database, Globe, Mail } from 'lucide-react';

/* ──────────────────────────────────────────────────
   Privacy Policy Page — Mera Vakil
   Covers data collection, usage, cookies, third-party
   services, and user rights under Indian IT Act.
   ────────────────────────────────────────────────── */

const PrivacyPolicy = () => {
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
                            <Shield className="h-6 w-6 text-brand-500" />
                        </div>
                        <h1 className="text-3xl font-bold">Privacy Policy</h1>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Last updated: February 2026
                    </p>
                </div>

                {/* Introduction */}
                <div className={sectionClass}>
                    <p className={textClass}>
                        Mera Vakil ("we", "our", or "us") operates the meravakil.com website and platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. By using Mera Vakil, you consent to the practices described in this policy.
                    </p>
                </div>

                {/* Information We Collect */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>
                        <Database className="inline h-5 w-5 mr-2 text-brand-500" />
                        Information We Collect
                    </h2>
                    <p className={`${textClass} mb-3`}>We collect information in the following ways:</p>
                    <ul className={listClass}>
                        <li><strong>Account Information:</strong> Name, email address, phone number, and profile type (client or lawyer) when you register.</li>
                        <li><strong>Lawyer Verification Data:</strong> Bar Council enrollment number, practice areas, experience, and professional credentials for lawyer accounts.</li>
                        <li><strong>Wallet & Transaction Data:</strong> Recharge history, credit usage, earned and promotional balances, and payment records processed through our wallet system.</li>
                        <li><strong>AI Interaction Data:</strong> Queries submitted to our AI assistant, chat history, and document drafting inputs to improve service quality.</li>
                        <li><strong>Usage Data:</strong> IP address, browser type, device information, pages visited, and interaction patterns collected through cookies and analytics.</li>
                        <li><strong>Communication Data:</strong> Records of in-platform calls, chat messages during consultations, and support communications.</li>
                    </ul>
                </div>

                {/* How We Use Your Information */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>
                        <Globe className="inline h-5 w-5 mr-2 text-brand-500" />
                        How We Use Your Information
                    </h2>
                    <ul className={listClass}>
                        <li>Providing AI legal guidance, lawyer matching, and document drafting services.</li>
                        <li>Processing wallet transactions, recharges, and service payments.</li>
                        <li>Verifying lawyer credentials through Bar Council records.</li>
                        <li>Improving our AI models and platform features.</li>
                        <li>Sending service notifications, billing alerts, and promotional communications (with opt-out).</li>
                        <li>Complying with legal obligations under Indian law.</li>
                    </ul>
                </div>

                {/* Data Security */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>
                        <Lock className="inline h-5 w-5 mr-2 text-brand-500" />
                        Data Security
                    </h2>
                    <p className={textClass}>
                        We implement 256-bit SSL encryption for all data in transit. Your wallet information and personal data are stored in encrypted databases with access controls. While no method of electronic storage is 100% secure, we follow industry best practices to protect your data in compliance with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures) Rules, 2011.
                    </p>
                </div>

                {/* Third-Party Services */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>Third-Party Services</h2>
                    <p className={`${textClass} mb-3`}>We use the following third-party services:</p>
                    <ul className={listClass}>
                        <li><strong>Google OAuth:</strong> For secure authentication and sign-in.</li>
                        <li><strong>Razorpay:</strong> For processing wallet recharges and payments.</li>
                        <li><strong>Google Analytics:</strong> For understanding platform usage patterns (anonymized).</li>
                        <li><strong>AI/LLM Providers:</strong> For powering the AI legal assistant (queries are processed securely).</li>
                    </ul>
                </div>

                {/* Your Rights */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>Your Rights</h2>
                    <ul className={listClass}>
                        <li>Access, correct, or delete your personal data by contacting us.</li>
                        <li>Withdraw wallet balance (earned credits only) per our wallet terms.</li>
                        <li>Opt out of marketing communications at any time.</li>
                        <li>Request a copy of your data in a portable format.</li>
                        <li>Lodge a complaint with relevant authorities if you believe your rights are violated.</li>
                    </ul>
                </div>

                {/* Contact */}
                <div className={`${sectionClass} p-6 rounded-xl ${isDark ? 'bg-dark-bg-secondary border border-dark-border' : 'bg-gray-50 border border-gray-200'}`}>
                    <h2 className={headingClass}>
                        <Mail className="inline h-5 w-5 mr-2 text-brand-500" />
                        Contact Us
                    </h2>
                    <p className={textClass}>
                        For privacy-related inquiries, contact our Data Protection Officer at{' '}
                        <a href="mailto:privacy@meravakil.com" className="text-brand-500 hover:underline">privacy@meravakil.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
