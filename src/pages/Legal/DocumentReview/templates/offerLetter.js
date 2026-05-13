const template = {
  id: 'offer-letter',
  name: 'Job Offer Letter',
  category: 'employment',
  icon: 'Mail',
  estimatedTime: '2 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'Professional offer letter to extend employment to a candidate. Covers role, CTC, joining date, probation, and standard terms.',
  tags: ['offer letter', 'employment', 'hiring', 'hr'],
  variables: [
    { key: 'companyName', label: 'Company Name', type: 'text', required: true, group: 'Company' },
    { key: 'companyAddress', label: 'Company Address', type: 'textarea', required: true, group: 'Company' },
    { key: 'companyLogo', label: 'Company Tagline (optional, one line)', type: 'text', required: false, group: 'Company' },
    { key: 'hrName', label: "HR / Authorised Signatory's Name", type: 'text', required: true, group: 'Company' },
    { key: 'hrDesignation', label: "HR's Designation", type: 'text', required: true, group: 'Company' },

    { key: 'candidateName', label: "Candidate's Full Name", type: 'text', required: true, group: 'Candidate' },
    { key: 'candidateAddress', label: "Candidate's Address", type: 'textarea', required: true, group: 'Candidate' },

    { key: 'offerDate', label: 'Date of Offer', type: 'date', required: true, group: 'Role' },
    { key: 'designation', label: 'Designation Offered', type: 'text', required: true, group: 'Role' },
    { key: 'department', label: 'Department', type: 'text', required: true, group: 'Role' },
    { key: 'workLocation', label: 'Primary Work Location', type: 'text', required: true, group: 'Role' },
    { key: 'reportingTo', label: 'Reporting Manager', type: 'text', required: true, group: 'Role' },
    { key: 'joiningDate', label: 'Date of Joining', type: 'date', required: true, group: 'Role' },

    { key: 'annualCTC', label: 'Annual CTC (INR)', type: 'number', required: true, validation: 'currency', group: 'Compensation' },
    { key: 'probationMonths', label: 'Probation Period (Months)', type: 'number', required: true, placeholder: '6', group: 'Compensation' },
    { key: 'noticePeriod', label: 'Notice Period after confirmation (Months)', type: 'number', required: true, placeholder: '2', group: 'Compensation' },
  ],
  signatureBlocks: ['Authorised Signatory', 'Accepted by Candidate'],
  body: `## OFFER OF EMPLOYMENT

{{companyName}}
{{companyAddress}}
{{#if companyLogo}}{{companyLogo}}
{{/if}}
Date: {{offerDate}}

To,
{{candidateName}}
{{candidateAddress}}

Subject: Offer of Employment — {{designation}}

Dear {{candidateName}},

We are pleased to offer you the position of {{designation}} in the {{department}} department of {{companyName}} ("Company"), reporting to {{reportingTo}}, with effect from {{joiningDate}}, on the terms and conditions set out below.

## 1. COMPENSATION

Your annual Cost to Company (CTC) shall be INR {{annualCTC}} (Indian Rupees ___________________ only), payable monthly in accordance with the Company's payroll cycle. A detailed compensation break-up is provided in Annexure A.

## 2. WORK LOCATION

Your primary place of work shall be {{workLocation}}. The Company reserves the right to transfer you to any of its offices, branches, group companies or client sites in India or abroad, as may be required for business reasons.

## 3. PROBATION

You shall be on probation for a period of {{probationMonths}} months from your date of joining. Your performance during the probation period will be assessed by the Company, and upon satisfactory completion, your services shall be confirmed in writing. The Company reserves the right to extend the probation period or terminate your services during the probation by giving fifteen (15) days' notice or pay in lieu thereof.

## 4. WORKING HOURS & LEAVE

You shall observe the working hours and leave policy applicable to the Company. Currently, the Company operates a five-day work week with statutory and earned leave as per applicable law and Company policy.

## 5. CONFIDENTIALITY & IP

During and after your employment, you shall maintain strict confidentiality of all proprietary, technical, business and customer information of the Company. All work product, inventions, designs and intellectual property created by you in the course of your employment shall be the sole and exclusive property of the Company.

## 6. NON-SOLICITATION

For a period of twelve (12) months following the termination of your employment for any reason, you shall not, directly or indirectly, solicit or attempt to solicit any employee, contractor, customer or supplier of the Company.

## 7. NOTICE PERIOD

After confirmation, either party may terminate this employment by giving {{noticePeriod}} months' written notice or salary in lieu thereof. The Company may, at its discretion, accept a shorter notice period or pay in lieu.

## 8. POLICIES

Your employment shall be subject to the Company's Code of Conduct, HR Policies, IT Policy, and all other policies as may be in force and amended from time to time.

## 9. PRE-JOINING DOCUMENTS

This offer is subject to: (i) satisfactory verification of your educational qualifications, employment history, and references; (ii) your producing original documents on the date of joining; and (iii) a satisfactory medical fitness report, if required.

## 10. GOVERNING LAW

This offer and any consequent contract of employment shall be governed by the laws of India and the courts at the city of {{workLocation}} shall have exclusive jurisdiction.

We are excited to welcome you to the {{companyName}} family. Kindly indicate your acceptance by signing the duplicate copy of this letter and returning it to us by {{joiningDate}}.

Warm regards,

{{hrName}}
{{hrDesignation}}
{{companyName}}`,
};

export default template;
