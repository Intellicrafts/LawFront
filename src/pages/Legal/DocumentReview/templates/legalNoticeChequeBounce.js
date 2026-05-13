const template = {
  id: 'legal-notice-cheque-bounce',
  name: 'Legal Notice — Cheque Bounce (Sec 138 NI Act)',
  category: 'notice',
  icon: 'AlertTriangle',
  estimatedTime: '3 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'Statutory legal notice under Section 138 of the Negotiable Instruments Act, 1881, to be sent within 30 days of cheque return memo. This notice is mandatory before filing a criminal complaint.',
  tags: ['cheque bounce', 'section 138', 'legal notice', 'recovery'],
  variables: [
    { key: 'noticeDate', label: 'Date of Notice', type: 'date', required: true, group: 'Basic' },
    { key: 'noticeCity', label: 'City', type: 'text', required: true, group: 'Basic' },

    { key: 'advocateName', label: "Advocate's Name", type: 'text', required: true, group: 'Advocate' },
    { key: 'advocateAddress', label: "Advocate's Office Address", type: 'textarea', required: true, group: 'Advocate' },
    { key: 'advocateEnrollment', label: "Advocate's Bar Enrollment No.", type: 'text', required: false, group: 'Advocate' },

    { key: 'clientName', label: "Complainant's (Payee) Full Name", type: 'text', required: true, group: 'Complainant' },
    { key: 'clientAddress', label: "Complainant's Address", type: 'textarea', required: true, group: 'Complainant' },

    { key: 'noticeeName', label: "Drawer's (Accused) Full Name", type: 'text', required: true, group: 'Noticee' },
    { key: 'noticeeAddress', label: "Drawer's Address", type: 'textarea', required: true, group: 'Noticee' },

    { key: 'chequeNumber', label: 'Cheque Number', type: 'text', required: true, group: 'Cheque' },
    { key: 'chequeDate', label: 'Cheque Date', type: 'date', required: true, group: 'Cheque' },
    { key: 'chequeAmount', label: 'Cheque Amount (INR)', type: 'number', required: true, validation: 'currency', group: 'Cheque' },
    { key: 'drawnOnBank', label: 'Drawn on Bank & Branch', type: 'text', required: true, group: 'Cheque' },
    { key: 'depositedAtBank', label: "Complainant's Bank where deposited", type: 'text', required: true, group: 'Cheque' },
    { key: 'returnDate', label: 'Cheque Return / Dishonour Date', type: 'date', required: true, group: 'Cheque' },
    { key: 'returnReason', label: 'Reason for Return', type: 'select', required: true, options: ['Insufficient Funds', 'Account Closed', 'Payment Stopped by Drawer', 'Signature Differs', 'Other'], group: 'Cheque' },

    { key: 'underlyingLiability', label: 'Underlying Liability / Transaction Description', type: 'textarea', required: true, placeholder: 'e.g. towards repayment of a friendly loan of INR 5,00,000 advanced on 15.03.2024', group: 'Liability' },
  ],
  signatureBlocks: ['Advocate'],
  body: `## REGISTERED A.D.
## (LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881)

From:
{{advocateName}}, Advocate
{{advocateAddress}}
{{#if advocateEnrollment}}Bar Enrollment No.: {{advocateEnrollment}}
{{/if}}
Date: {{noticeDate}}

To,
{{noticeeName}}
{{noticeeAddress}}

Subject: Legal Notice for Dishonour of Cheque bearing No. {{chequeNumber}} dated {{chequeDate}} for INR {{chequeAmount}}/- under Section 138 of the Negotiable Instruments Act, 1881.

Sir/Madam,

Under instructions from and on behalf of my client {{clientName}}, resident of {{clientAddress}} (hereinafter referred to as "my client"), I hereby serve upon you the following Legal Notice:

1. That my client and you, the Noticee, are known to each other and the Noticee is well aware of the facts and circumstances narrated hereinbelow.

2. That {{underlyingLiability}}.

3. That, in discharge of the aforesaid existing legal liability owed by you to my client, you issued a cheque bearing No. {{chequeNumber}} dated {{chequeDate}} for a sum of INR {{chequeAmount}}/- (Rupees ___________________ only) drawn on {{drawnOnBank}}, in favour of my client.

4. That my client, on receipt of the said cheque and believing it to be in good order, presented the same for encashment through his/her bank, namely {{depositedAtBank}}, within the period of its validity.

5. That, to the shock and surprise of my client, the said cheque was returned unpaid by the drawee bank vide Cheque Return Memo dated {{returnDate}} with the remarks "{{returnReason}}".

6. That immediately upon receipt of the said dishonour memo, my client took up the matter with you and requested you to make payment of the cheque amount. However, despite repeated requests and reminders, you have failed and neglected to make payment of the said sum.

7. That by drawing the said cheque on an account maintained by you and by presenting the same in discharge of a legally enforceable debt or liability, and by the said cheque being dishonoured for the reason stated above, you have committed an offence punishable under Section 138 of the Negotiable Instruments Act, 1881.

8. That you are hereby called upon, through this notice, to pay to my client the sum of INR {{chequeAmount}}/- (Rupees ___________________ only), being the amount of the dishonoured cheque, within fifteen (15) days from the date of receipt of this notice.

9. That if you fail to make payment of the said sum within the said period of fifteen (15) days, my client shall be constrained to initiate appropriate criminal proceedings against you under Section 138 of the Negotiable Instruments Act, 1881, and/or under any other applicable provisions of law, for which you alone shall be liable, both for the consequences and the costs thereof.

10. A copy of this notice has been retained in my office for record and future reference.

Yours faithfully,

{{advocateName}}
Advocate
For and on behalf of {{clientName}}`,
};

export default template;
