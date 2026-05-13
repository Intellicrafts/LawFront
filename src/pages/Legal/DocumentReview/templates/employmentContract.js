const template = {
  id: 'employment-contract',
  name: 'Employment Contract (Full Agreement)',
  category: 'employment',
  icon: 'Briefcase',
  estimatedTime: '4 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'Full-length employment contract covering compensation, duties, IP, confidentiality, non-compete and termination. Suitable for permanent employees.',
  tags: ['employment', 'contract', 'hr', 'staff'],
  variables: [
    { key: 'contractDate', label: 'Contract Date', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City of Execution', type: 'text', required: true, group: 'Basic' },

    { key: 'companyName', label: 'Company Name', type: 'text', required: true, group: 'Company' },
    { key: 'companyAddress', label: 'Company Address', type: 'textarea', required: true, group: 'Company' },
    { key: 'companySignatory', label: 'Authorised Signatory', type: 'text', required: true, group: 'Company' },

    { key: 'employeeName', label: "Employee's Name", type: 'text', required: true, group: 'Employee' },
    { key: 'employeeAddress', label: "Employee's Address", type: 'textarea', required: true, group: 'Employee' },
    { key: 'employeePAN', label: "Employee's PAN", type: 'text', required: false, validation: 'pan', group: 'Employee' },

    { key: 'designation', label: 'Designation', type: 'text', required: true, group: 'Role' },
    { key: 'startDate', label: 'Date of Joining', type: 'date', required: true, group: 'Role' },
    { key: 'workLocation', label: 'Primary Work Location', type: 'text', required: true, group: 'Role' },
    { key: 'annualSalary', label: 'Annual Gross Salary (INR)', type: 'number', required: true, validation: 'currency', group: 'Role' },
    { key: 'probationMonths', label: 'Probation (Months)', type: 'number', required: true, placeholder: '6', group: 'Role' },
    { key: 'noticeMonths', label: 'Notice Period (Months)', type: 'number', required: true, placeholder: '2', group: 'Role' },
  ],
  signatureBlocks: ['For Company', 'Employee', 'Witness'],
  body: `## EMPLOYMENT CONTRACT

THIS EMPLOYMENT CONTRACT is made and executed at {{city}} on {{contractDate}}.

## BETWEEN

{{companyName}}, having its registered office at {{companyAddress}}, represented by {{companySignatory}} (hereinafter "Employer" or "Company");

## AND

{{employeeName}}, resident of {{employeeAddress}}{{#if employeePAN}}, holding PAN {{employeePAN}}{{/if}} (hereinafter "Employee").

## 1. POSITION AND DUTIES

The Employer hereby employs the Employee in the position of {{designation}} with effect from {{startDate}}. The Employee shall perform such duties as are customarily associated with the position and as may be assigned from time to time, and shall report to such person as the Company may designate.

## 2. PLACE OF WORK

The Employee's principal place of work shall be {{workLocation}}. The Company may transfer the Employee to any of its offices, branches, group entities or client sites in India or abroad, as may be reasonably required.

## 3. COMPENSATION

The Employee shall be entitled to an annual gross salary of INR {{annualSalary}}/-, payable monthly, subject to applicable statutory deductions, withholdings and taxes. The detailed salary structure is set out in Annexure A. The Company may revise the salary annually based on performance and Company policy.

## 4. PROBATION AND CONFIRMATION

The Employee shall be on probation for a period of {{probationMonths}} months from the date of joining. The Company may extend the probation period or terminate the employment during probation by giving fifteen (15) days' notice or salary in lieu thereof. Upon satisfactory completion of probation, the employment shall be confirmed in writing.

## 5. WORKING HOURS AND LEAVE

The Employee shall observe the working hours and leave entitlements as per the Company's HR policy in force from time to time, in compliance with applicable labour laws.

## 6. CONFIDENTIALITY

The Employee shall maintain strict confidentiality of all proprietary, technical, financial, business, customer and personnel information of the Company, both during and after the term of employment, indefinitely. The Employee shall not use such confidential information for any purpose other than the performance of his/her duties.

## 7. INTELLECTUAL PROPERTY

All work product, inventions, discoveries, designs, code, content, processes and other intellectual property created or contributed to by the Employee in the course of or in connection with his/her employment shall be the sole and exclusive property of the Company. The Employee hereby assigns to the Company all rights, title and interest therein, and shall execute such further documents as may be required to perfect such assignment.

## 8. NON-COMPETE AND NON-SOLICITATION

For a period of twelve (12) months following the termination of employment for any reason, the Employee shall not, directly or indirectly: (a) be employed by or engage in any business that competes with the Company; or (b) solicit any employee, contractor, customer or supplier of the Company.

## 9. CODE OF CONDUCT

The Employee shall: (a) faithfully serve the Company; (b) devote his/her full working time and best efforts to the business of the Company; (c) comply with all Company policies, including the Code of Conduct, IT Policy, and Anti-Harassment Policy; and (d) not engage in any other paid employment or business without the prior written consent of the Company.

## 10. TERMINATION

After confirmation, either party may terminate this Contract by giving {{noticeMonths}} months' written notice or salary in lieu thereof. The Company may terminate the employment forthwith without notice for: (a) gross misconduct; (b) wilful breach of any term of this Contract; (c) conviction for a criminal offence involving moral turpitude; (d) prolonged absenteeism without sanction; or (e) any other cause justifying summary termination under applicable law.

## 11. RETURN OF PROPERTY

Upon termination of employment for any reason, the Employee shall promptly return to the Company all property, documents, devices, access credentials and confidential information in his/her possession or control.

## 12. GOVERNING LAW

This Contract shall be governed by the laws of India. The courts at {{city}} shall have exclusive jurisdiction.

IN WITNESS WHEREOF, the parties have executed this Contract on the date first above written.`,
};

export default template;
