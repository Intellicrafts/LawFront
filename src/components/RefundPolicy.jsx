import React from 'react';
import { useSelector } from 'react-redux';
import { Wallet, Clock, AlertTriangle, CheckCircle, Mail, RefreshCw } from 'lucide-react';

/* ──────────────────────────────────────────────────
   Refund Policy Page — Mera Vakil
   Covers wallet refunds, consultation refunds,
   AI query refunds, and dispute resolution.
   ────────────────────────────────────────────────── */

const RefundPolicy = () => {
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
                        <div className="p-2 rounded-lg bg-verified-500/10">
                            <RefreshCw className="h-6 w-6 text-verified-500" />
                        </div>
                        <h1 className="text-3xl font-bold">Refund Policy</h1>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Last updated: February 2026
                    </p>
                </div>

                {/* Overview */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>1. Overview</h2>
                    <p className={textClass}>
                        Mera Vakil operates on a wallet-based credit system. Refund eligibility depends on the type
                        of service consumed. This policy outlines how refunds are processed for each service type and
                        the timelines involved.
                    </p>
                </div>

                {/* Wallet Recharges */}
                <div className={`${sectionClass} p-6 rounded-xl ${isDark ? 'bg-dark-bg-secondary border border-dark-border' : 'bg-accent-50 border border-accent-200'}`}>
                    <h2 className={headingClass}>
                        <Wallet className="inline h-5 w-5 mr-2 text-accent-500" />
                        2. Wallet Recharges
                    </h2>
                    <p className={`${textClass} mb-3`}>
                        Refunds on wallet recharges are subject to the following conditions:
                    </p>
                    <ul className={listClass}>
                        <li><strong>Unused Balance:</strong> You may request a refund of your unused earned balance at any time through the wallet withdrawal feature.</li>
                        <li><strong>Promotional Credits:</strong> Welcome bonuses, referral credits, and promotional balances are non-refundable and cannot be converted to cash.</li>
                        <li><strong>Failed Transactions:</strong> If a recharge transaction fails but the amount is debited from your bank, it will be automatically reversed within 5-7 business days. If not, contact support with the transaction ID.</li>
                        <li><strong>Processing Fee:</strong> Withdrawals may attract a small processing fee as displayed at the time of withdrawal.</li>
                    </ul>
                </div>

                {/* Lawyer Consultations */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>
                        <Clock className="inline h-5 w-5 mr-2 text-brand-500" />
                        3. Lawyer Consultation Refunds
                    </h2>
                    <p className={`${textClass} mb-3`}>
                        Consultation fees are billed per minute. Refund eligibility is based on the following:
                    </p>
                    <ul className={listClass}>
                        <li><strong>No-Show by Lawyer:</strong> If a scheduled lawyer does not join the consultation within 5 minutes of the appointment time, the full booking amount is refunded to your wallet as earned balance.</li>
                        <li><strong>Technical Failure:</strong> If the consultation is disrupted due to a platform-side technical issue (verified by our team), a proportional refund for the interrupted time will be issued.</li>
                        <li><strong>Client-Side Cancellation:</strong> If you cancel a consultation more than 2 hours before the scheduled time, a full refund is issued. Cancellations within 2 hours may be subject to a cancellation fee.</li>
                        <li><strong>Completed Consultations:</strong> Once a consultation has been successfully completed, refunds are not available for the time consumed.</li>
                    </ul>
                </div>

                {/* AI Query Refunds */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>4. AI Assistant Query Refunds</h2>
                    <p className={textClass}>
                        AI queries consume wallet credits upon submission. Since AI responses are generated and delivered
                        instantly, refunds for AI queries are generally not available. However, if a query fails to produce
                        any response due to a system error, the credited amount will be automatically restored to your wallet.
                    </p>
                </div>

                {/* Document Services */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>5. Document Drafting & Review</h2>
                    <p className={textClass}>
                        Document services are charged upon initiation. If a document fails to generate due to a platform
                        error, the full amount is refunded. Once a document has been successfully generated and delivered,
                        refunds are not available as the service has been rendered.
                    </p>
                </div>

                {/* Eligibility Summary */}
                <div className={`${sectionClass} p-6 rounded-xl ${isDark ? 'bg-verified-500/5 border border-verified-500/20' : 'bg-verified-50 border border-verified-200'}`}>
                    <h2 className={headingClass}>
                        <CheckCircle className="inline h-5 w-5 mr-2 text-verified-500" />
                        6. Refund Eligibility Summary
                    </h2>
                    <div className="overflow-x-auto mt-3">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    <th className="text-left py-2 pr-4 font-semibold">Service</th>
                                    <th className="text-left py-2 pr-4 font-semibold">Refundable?</th>
                                    <th className="text-left py-2 font-semibold">Timeline</th>
                                </tr>
                            </thead>
                            <tbody className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                <tr className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                                    <td className="py-2 pr-4">Wallet Recharge (earned)</td>
                                    <td className="py-2 pr-4 text-verified-500 font-medium">Yes</td>
                                    <td className="py-2">3-5 business days</td>
                                </tr>
                                <tr className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                                    <td className="py-2 pr-4">Promotional Credits</td>
                                    <td className="py-2 pr-4 text-red-500 font-medium">No</td>
                                    <td className="py-2">—</td>
                                </tr>
                                <tr className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                                    <td className="py-2 pr-4">Lawyer No-Show</td>
                                    <td className="py-2 pr-4 text-verified-500 font-medium">Yes</td>
                                    <td className="py-2">Instant (wallet credit)</td>
                                </tr>
                                <tr className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                                    <td className="py-2 pr-4">Completed Consultation</td>
                                    <td className="py-2 pr-4 text-red-500 font-medium">No</td>
                                    <td className="py-2">—</td>
                                </tr>
                                <tr className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                                    <td className="py-2 pr-4">AI Query (failed)</td>
                                    <td className="py-2 pr-4 text-verified-500 font-medium">Yes</td>
                                    <td className="py-2">Instant (auto-refund)</td>
                                </tr>
                                <tr className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                                    <td className="py-2 pr-4">AI Query (completed)</td>
                                    <td className="py-2 pr-4 text-red-500 font-medium">No</td>
                                    <td className="py-2">—</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Dispute Resolution */}
                <div className={`${sectionClass} p-6 rounded-xl ${isDark ? 'bg-yellow-900/20 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <h2 className={headingClass}>
                        <AlertTriangle className="inline h-5 w-5 mr-2 text-yellow-500" />
                        7. Dispute Resolution
                    </h2>
                    <p className={textClass}>
                        If you believe you are entitled to a refund that has not been processed, you may raise a
                        dispute by contacting our support team. All disputes must be raised within 30 days of the
                        transaction date. Our team will review the dispute and respond within 5 business days.
                        Decisions made by the Mera Vakil dispute resolution team are final.
                    </p>
                </div>

                {/* Contact */}
                <div className={`${sectionClass} p-6 rounded-xl ${isDark ? 'bg-dark-bg-secondary border border-dark-border' : 'bg-gray-50 border border-gray-200'}`}>
                    <h2 className={headingClass}>
                        <Mail className="inline h-5 w-5 mr-2 text-brand-500" />
                        Contact
                    </h2>
                    <p className={textClass}>
                        For refund requests or questions about this policy, contact us at{' '}
                        <a href="mailto:support@meravakil.com" className="text-brand-500 hover:underline">support@meravakil.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
