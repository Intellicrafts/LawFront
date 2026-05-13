const template = {
  id: 'resignation-acceptance',
  name: 'Resignation Acceptance Letter',
  category: 'employment',
  icon: 'Mail',
  estimatedTime: '1 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'Formal letter from an employer accepting an employee\'s resignation and confirming the last working date.',
  tags: ['resignation', 'acceptance', 'hr', 'exit'],
  variables: [
    { key: 'letterDate', label: 'Date', type: 'date', required: true, group: 'Basic' },
    { key: 'companyName', label: 'Company Name', type: 'text', required: true, group: 'Basic' },
    { key: 'companyAddress', label: 'Company Address', type: 'textarea', required: true, group: 'Basic' },

    { key: 'employeeName', label: "Employee's Name", type: 'text', required: true, group: 'Employee' },
    { key: 'employeeId', label: 'Employee ID', type: 'text', required: false, group: 'Employee' },
    { key: 'designation', label: 'Designation', type: 'text', required: true, group: 'Employee' },
    { key: 'department', label: 'Department', type: 'text', required: true, group: 'Employee' },
    { key: 'resignationDate', label: 'Date of Resignation Letter', type: 'date', required: true, group: 'Employee' },
    { key: 'lastWorkingDate', label: 'Confirmed Last Working Date', type: 'date', required: true, group: 'Employee' },

    { key: 'hrName', label: "HR Signatory's Name", type: 'text', required: true, group: 'Signatory' },
    { key: 'hrDesignation', label: "HR's Designation", type: 'text', required: true, group: 'Signatory' },
  ],
  signatureBlocks: ['For Company'],
  body: `## RESIGNATION ACCEPTANCE

{{companyName}}
{{companyAddress}}

Date: {{letterDate}}

To,
{{employeeName}}{{#if employeeId}}
Employee ID: {{employeeId}}{{/if}}
{{designation}}, {{department}}

Subject: Acceptance of Resignation

Dear {{employeeName}},

This is to formally acknowledge and confirm the receipt of your resignation letter dated {{resignationDate}}, wherein you have expressed your intention to resign from your position as {{designation}} in the {{department}} department of {{companyName}}.

We have considered your request and your resignation has been accepted. Your last working day with the Company shall be {{lastWorkingDate}}. You are requested to ensure complete handover of all pending responsibilities, ongoing projects, Company property, documents, access credentials and any confidential information in your possession to your reporting manager or the HR department prior to your last working day.

Your full and final settlement, including any dues, gratuity (if applicable), unutilised leave encashment, and refund of deposits, shall be processed within forty-five (45) days from your last working date, subject to clearance of all your obligations to the Company. Your Experience Letter and Relieving Letter shall be issued on or before your last working day, post completion of exit formalities.

We thank you for your contributions during your tenure with us and wish you every success in your future endeavours. We trust that you shall continue to honour your post-employment obligations of confidentiality, non-solicitation and intellectual property as set out in your employment contract.

For any clarifications regarding your exit, please feel free to reach out to the HR department.

Wishing you the very best.

Warm regards,

{{hrName}}
{{hrDesignation}}
{{companyName}}`,
};

export default template;
