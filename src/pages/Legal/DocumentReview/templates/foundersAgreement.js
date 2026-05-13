const template = {
  id: 'founders-agreement',
  name: 'Founders Agreement (Startup)',
  category: 'business',
  icon: 'Users',
  estimatedTime: '5 min',
  premium: true,
  jurisdiction: 'India',
  description:
    'A founders agreement among co-founders of a startup to record equity, roles, vesting, IP assignment and dispute resolution before incorporating the company.',
  tags: ['founders', 'startup', 'equity', 'vesting'],
  variables: [
    { key: 'agreementDate', label: 'Agreement Date', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City of Execution', type: 'text', required: true, group: 'Basic' },
    { key: 'companyName', label: 'Proposed Company Name', type: 'text', required: true, group: 'Basic' },
    { key: 'businessDescription', label: 'Description of Business', type: 'textarea', required: true, group: 'Basic' },

    { key: 'foundersList', label: 'Founders (one per line: Name | Role | Equity % | Address)', type: 'textarea', required: true, placeholder: 'Rahul Mehta | CEO | 40 | Bengaluru\nPriya Iyer | CTO | 40 | Bengaluru\nArjun Singh | CMO | 20 | Mumbai', group: 'Founders' },

    { key: 'vestingYears', label: 'Vesting Period (Years)', type: 'number', required: true, placeholder: '4', group: 'Vesting' },
    { key: 'cliffMonths', label: 'Cliff Period (Months)', type: 'number', required: true, placeholder: '12', group: 'Vesting' },
  ],
  signatureBlocks: ['Founder 1', 'Founder 2', 'Founder 3 (if any)', 'Witness'],
  body: `## FOUNDERS AGREEMENT

THIS FOUNDERS AGREEMENT is entered into at {{city}} on {{agreementDate}}, by and among the following persons (each a "Founder" and collectively, the "Founders"):

{{foundersList}}

## RECITALS

A. The Founders are jointly developing and intend to incorporate a private limited company under the laws of India to be named "{{companyName}}" or such other name as may be approved by the Registrar of Companies (the "Company").

B. The proposed business of the Company shall be: {{businessDescription}}.

C. The Founders wish to record, in advance of incorporation, the terms of their equity ownership, roles, vesting, intellectual property, and the conduct of business of the Company.

## 1. INCORPORATION AND EQUITY

Upon incorporation, the equity capital of the Company shall be allocated among the Founders in the ratio set out above. The Founders shall subscribe to such number of equity shares of the Company as corresponds to their respective allocations.

## 2. ROLES AND DUTIES

Each Founder shall devote his/her full-time, attention, skill and best efforts exclusively to the business of the Company in his/her designated role. No Founder shall, without the prior written consent of the other Founders, engage in any other business that competes with or detracts from the business of the Company.

## 3. VESTING

The equity shares allocated to each Founder shall be subject to vesting over a period of {{vestingYears}} years, with a one-time cliff of {{cliffMonths}} months. Upon the expiry of the cliff, twenty-five percent (25%) of each Founder's shares shall vest, and the remaining shares shall vest in equal monthly instalments over the remaining vesting period. Unvested shares of any departing Founder shall be repurchased by the Company at par value.

## 4. INTELLECTUAL PROPERTY ASSIGNMENT

Each Founder hereby irrevocably assigns to the Company (upon incorporation) all rights, title and interest in any inventions, designs, code, content, processes, trademarks and other intellectual property created by such Founder in connection with the business of the Company, whether before or after the date of this Agreement.

## 5. CONFIDENTIALITY

Each Founder shall maintain the strict confidentiality of all proprietary information of the Company and the other Founders, during the term of his/her involvement with the Company and for a period of three (3) years thereafter.

## 6. NON-COMPETE AND NON-SOLICIT

During his/her association with the Company and for a period of twelve (12) months thereafter, no Founder shall, without the prior written consent of the other Founders: (a) engage in any business that competes with the Company; or (b) solicit any employee, contractor, customer or supplier of the Company.

## 7. DECISION-MAKING

Day-to-day operational decisions shall be taken by the Founder in charge of the relevant function. The following matters shall require the unanimous written consent of all Founders: (a) sale, merger or dissolution of the Company; (b) issuance of new equity or convertible securities; (c) borrowing in excess of INR 10,00,000; (d) appointment or removal of directors; (e) entering into any related-party transaction; (f) approving annual budgets and business plans.

## 8. FOUNDER EXIT

If any Founder voluntarily leaves the Company or is removed for cause, only his/her vested shares shall be retained. Unvested shares shall be forfeited and may be reallocated by the remaining Founders. The departing Founder shall surrender all confidential information and Company property.

## 9. DEADLOCK RESOLUTION

In the event of a deadlock among the Founders, the Founders shall first attempt to resolve the matter through good-faith negotiation. Failing such resolution within thirty (30) days, the matter shall be referred to a mutually appointed mediator and, if still unresolved, to arbitration in accordance with the Arbitration and Conciliation Act, 1996.

## 10. GOVERNING LAW

This Agreement shall be governed by the laws of India. The courts at {{city}} shall have exclusive jurisdiction.

IN WITNESS WHEREOF, the Founders have signed this Agreement on the date first above written.`,
};

export default template;
