const template = {
  id: 'experience-letter',
  name: 'Experience / Relieving Letter',
  category: 'employment',
  icon: 'Award',
  estimatedTime: '1 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A combined experience and relieving letter issued by an employer to a departing employee, confirming tenure, role and good standing.',
  tags: ['experience letter', 'relieving', 'employment', 'hr'],
  variables: [
    { key: 'letterDate', label: 'Date of Letter', type: 'date', required: true, group: 'Basic' },
    { key: 'companyName', label: 'Company Name', type: 'text', required: true, group: 'Basic' },
    { key: 'companyAddress', label: 'Company Address', type: 'textarea', required: true, group: 'Basic' },
    { key: 'companyLogo', label: 'Tagline (optional)', type: 'text', required: false, group: 'Basic' },

    { key: 'employeeName', label: "Employee's Full Name", type: 'text', required: true, group: 'Employee' },
    { key: 'employeeId', label: 'Employee ID', type: 'text', required: false, group: 'Employee' },
    { key: 'designation', label: 'Last Designation', type: 'text', required: true, group: 'Employee' },
    { key: 'department', label: 'Department', type: 'text', required: true, group: 'Employee' },
    { key: 'joiningDate', label: 'Date of Joining', type: 'date', required: true, group: 'Employee' },
    { key: 'lastWorkingDate', label: 'Last Working Date', type: 'date', required: true, group: 'Employee' },

    { key: 'hrName', label: "HR / Authorised Signatory's Name", type: 'text', required: true, group: 'Signatory' },
    { key: 'hrDesignation', label: "Signatory's Designation", type: 'text', required: true, group: 'Signatory' },
  ],
  signatureBlocks: ['For Company'],
  body: `## EXPERIENCE & RELIEVING LETTER

{{companyName}}
{{companyAddress}}
{{#if companyLogo}}{{companyLogo}}
{{/if}}
Date: {{letterDate}}

## TO WHOMSOEVER IT MAY CONCERN

This is to certify that {{employeeName}}{{#if employeeId}} (Employee ID: {{employeeId}}){{/if}} has been associated with {{companyName}} from {{joiningDate}} to {{lastWorkingDate}}.

During his/her tenure with the Company, {{employeeName}} served in the {{department}} department and his/her last held designation was {{designation}}.

We found him/her to be sincere, hardworking, dedicated and result-oriented in his/her work. He/she has consistently demonstrated a strong sense of responsibility, integrity, and professionalism throughout his/her tenure with the organisation.

We confirm that {{employeeName}} has been relieved from his/her duties with effect from the close of business on {{lastWorkingDate}}, after duly completing all formalities including the notice period and handover of responsibilities. He/she stands relieved from the services of the Company in good standing and we have no objection to his/her future employment.

We wish him/her all the very best for the future endeavours.

For {{companyName}},

{{hrName}}
{{hrDesignation}}`,
};

export default template;
