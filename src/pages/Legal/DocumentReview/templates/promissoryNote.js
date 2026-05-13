const template = {
  id: 'promissory-note',
  name: 'Promissory Note',
  category: 'finance',
  icon: 'DollarSign',
  estimatedTime: '1 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A simple, legally binding promissory note under the Negotiable Instruments Act, 1881, evidencing a promise to repay a loan.',
  tags: ['promissory note', 'loan', 'debt', 'finance'],
  variables: [
    { key: 'noteDate', label: 'Date of Note', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, group: 'Basic' },

    { key: 'makerName', label: "Borrower's (Maker) Full Name", type: 'text', required: true, group: 'Borrower' },
    { key: 'makerFatherName', label: "Borrower's Father's Name", type: 'text', required: true, group: 'Borrower' },
    { key: 'makerAddress', label: "Borrower's Address", type: 'textarea', required: true, group: 'Borrower' },

    { key: 'payeeName', label: "Lender's (Payee) Full Name", type: 'text', required: true, group: 'Lender' },
    { key: 'payeeAddress', label: "Lender's Address", type: 'textarea', required: true, group: 'Lender' },

    { key: 'principalAmount', label: 'Principal Amount (INR)', type: 'number', required: true, validation: 'currency', group: 'Loan' },
    { key: 'interestRate', label: 'Interest Rate (% per annum)', type: 'number', required: true, placeholder: '12', group: 'Loan' },
    { key: 'repaymentTerms', label: 'Repayment Terms', type: 'select', required: true, options: ['On Demand', 'Lump Sum on Maturity Date', 'Equated Monthly Instalments'], group: 'Loan' },
    { key: 'maturityDate', label: 'Repayment / Maturity Date', type: 'date', required: true, group: 'Loan' },
  ],
  signatureBlocks: ['Borrower (Maker)', 'Witness'],
  body: `## PROMISSORY NOTE

Place of Execution: {{city}}
Date: {{noteDate}}
Stamp Duty: As applicable

ON DEMAND / on the maturity date specified below, I, {{makerName}}, S/o, D/o, W/o {{makerFatherName}}, resident of {{makerAddress}} (hereinafter the "Maker"), hereby unconditionally promise to pay to {{payeeName}}, resident of {{payeeAddress}}, or to his/her order, the sum of:

INR {{principalAmount}}/- (Rupees ___________________ only)

(hereinafter the "Principal Amount"), together with interest thereon at the rate of {{interestRate}}% (___________________) per annum, calculated from the date hereof until payment in full, for value received in cash/bank transfer this day.

## TERMS

1. The Principal Amount along with accrued interest shall be repaid as follows: {{repaymentTerms}}.

2. The full and final repayment shall be made on or before {{maturityDate}}.

3. In the event of default in payment of any instalment or the entire amount on the due date, the Maker shall be liable to pay additional interest at the rate of 18% per annum on the defaulted amount, from the date of default till the date of actual payment.

4. The Maker hereby waives presentment, demand, protest and notice of dishonour, to the fullest extent permitted by law.

5. This Promissory Note is governed by the Negotiable Instruments Act, 1881, and the laws of India. The courts at {{city}} shall have exclusive jurisdiction in respect of any dispute arising hereunder.

Signed and delivered by the Maker on the date and at the place first above written.`,
};

export default template;
