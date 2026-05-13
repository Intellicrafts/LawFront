const template = {
  id: 'demand-notice-recovery',
  name: 'Demand Notice for Recovery of Money',
  category: 'notice',
  icon: 'AlertTriangle',
  estimatedTime: '2 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A pre-litigation legal notice demanding recovery of an outstanding amount owed by the addressee, before initiating civil proceedings.',
  tags: ['demand notice', 'recovery', 'debt', 'money'],
  variables: [
    { key: 'noticeDate', label: 'Date of Notice', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, group: 'Basic' },

    { key: 'advocateName', label: "Advocate's Name", type: 'text', required: true, group: 'Advocate' },
    { key: 'advocateAddress', label: "Advocate's Office Address", type: 'textarea', required: true, group: 'Advocate' },

    { key: 'clientName', label: "Client's (Creditor) Name", type: 'text', required: true, group: 'Creditor' },
    { key: 'clientAddress', label: "Client's Address", type: 'textarea', required: true, group: 'Creditor' },

    { key: 'noticeeName', label: "Addressee's (Debtor) Name", type: 'text', required: true, group: 'Debtor' },
    { key: 'noticeeAddress', label: "Addressee's Address", type: 'textarea', required: true, group: 'Debtor' },

    { key: 'principalAmount', label: 'Principal Amount Outstanding (INR)', type: 'number', required: true, validation: 'currency', group: 'Debt' },
    { key: 'interestRate', label: 'Interest Rate (% p.a.)', type: 'number', required: false, group: 'Debt' },
    { key: 'transactionDescription', label: 'Description of Transaction / Cause of Debt', type: 'textarea', required: true, placeholder: 'e.g. friendly loan of INR 3,00,000 advanced on 12.01.2024 vide cheque no. ... drawn on HDFC Bank ...', group: 'Debt' },
    { key: 'replyDays', label: 'Days for Payment / Reply', type: 'number', required: true, placeholder: '15', group: 'Debt' },
  ],
  signatureBlocks: ['Advocate'],
  body: `## REGISTERED A.D.
## LEGAL NOTICE — DEMAND FOR PAYMENT

From:
{{advocateName}}, Advocate
{{advocateAddress}}

Date: {{noticeDate}}

To,
{{noticeeName}}
{{noticeeAddress}}

Subject: Legal Notice for recovery of sum of INR {{principalAmount}}/- together with interest, costs and other reliefs.

Sir/Madam,

Under instructions from and on behalf of my client {{clientName}}, resident of {{clientAddress}} (hereinafter "my client"), I serve upon you the following Legal Notice:

1. That my client and you, the Addressee, are well acquainted with each other and the facts mentioned hereinbelow are within your personal knowledge.

2. That {{transactionDescription}}.

3. That as on the date of this notice, a sum of INR {{principalAmount}}/- (Rupees ___________________ only) remains due and outstanding from you to my client, in respect of the aforesaid transaction.

4. That despite repeated oral and written requests by my client, you have failed and neglected to pay the said amount to my client, on one pretext or the other, thereby compelling my client to take recourse to this legal notice.

{{#if interestRate}}5. That my client is also entitled to claim interest on the principal amount at the rate of {{interestRate}}% per annum, from the due date till the date of actual realisation.

{{/if}}6. That your conduct of withholding the said amount, despite admitted liability, amounts to wrongful retention of my client's money and is actionable both in civil and, where applicable, criminal law.

7. You are hereby called upon, through this notice, to pay to my client the sum of INR {{principalAmount}}/- together with interest{{#if interestRate}} at {{interestRate}}% per annum from the due date{{/if}}, costs and other charges, within {{replyDays}} days from the date of receipt of this notice, by way of cash, demand draft or bank transfer to my client's account, the details of which shall be provided on request.

8. That if you fail to make the said payment within the time stipulated herein, my client shall be constrained to initiate appropriate civil and/or criminal proceedings against you for recovery of the said amount, interest, costs, damages and such other reliefs as may be permissible under law, at your sole risk, cost and consequences.

9. A copy of this notice has been retained in my office for record and future reference.

Yours faithfully,

{{advocateName}}, Advocate
For and on behalf of {{clientName}}`,
};

export default template;
