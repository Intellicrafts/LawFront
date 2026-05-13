const template = {
  id: 'internship-agreement',
  name: 'Internship Agreement',
  category: 'employment',
  icon: 'GraduationCap',
  estimatedTime: '2 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'Agreement between a company and an intern, defining duration, stipend, confidentiality and certificate issuance terms.',
  tags: ['internship', 'intern', 'student', 'hr'],
  variables: [
    { key: 'agreementDate', label: 'Agreement Date', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, group: 'Basic' },

    { key: 'companyName', label: 'Company Name', type: 'text', required: true, group: 'Company' },
    { key: 'companyAddress', label: 'Company Address', type: 'textarea', required: true, group: 'Company' },

    { key: 'internName', label: "Intern's Full Name", type: 'text', required: true, group: 'Intern' },
    { key: 'internCollege', label: "Intern's College / University", type: 'text', required: true, group: 'Intern' },
    { key: 'internAddress', label: "Intern's Address", type: 'textarea', required: true, group: 'Intern' },

    { key: 'role', label: 'Internship Role / Department', type: 'text', required: true, group: 'Terms' },
    { key: 'startDate', label: 'Start Date', type: 'date', required: true, group: 'Terms' },
    { key: 'endDate', label: 'End Date', type: 'date', required: true, group: 'Terms' },
    { key: 'stipend', label: 'Monthly Stipend (INR, 0 if unpaid)', type: 'number', required: true, group: 'Terms' },
    { key: 'workMode', label: 'Mode', type: 'select', required: true, options: ['On-site', 'Remote', 'Hybrid'], group: 'Terms' },
  ],
  signatureBlocks: ['For Company', 'Intern', 'Witness'],
  body: `## INTERNSHIP AGREEMENT

THIS INTERNSHIP AGREEMENT is entered into at {{city}} on {{agreementDate}}, by and between:

{{companyName}}, having its office at {{companyAddress}} ("Company");

AND

{{internName}}, a student of {{internCollege}}, resident of {{internAddress}} ("Intern").

## 1. ENGAGEMENT

The Company hereby engages the Intern, and the Intern hereby agrees to undertake an internship with the Company in the role of {{role}}, on the terms set out below.

## 2. TERM

The internship shall commence on {{startDate}} and shall conclude on {{endDate}}, unless terminated earlier as provided herein.

## 3. WORK MODE & HOURS

The internship shall be conducted in {{workMode}} mode. The Intern shall observe the working hours and policies notified by the Company from time to time, and shall be present/available for not less than the hours specified for the role.

## 4. STIPEND

The Company shall pay the Intern a monthly stipend of INR {{stipend}}/-, payable at the end of each month, subject to satisfactory performance and applicable statutory deductions, if any. The internship does not constitute employment and the Intern shall not be entitled to any employee benefits.

## 5. DUTIES

The Intern shall: (a) perform tasks assigned by his/her supervisor with diligence; (b) comply with all Company policies including the Code of Conduct, IT Policy and Anti-Harassment Policy; (c) maintain professionalism and punctuality; and (d) report progress regularly.

## 6. CONFIDENTIALITY

The Intern shall maintain strict confidentiality of all proprietary and business information of the Company, both during and after the internship, indefinitely. The Intern shall not use, share or publish any confidential information without prior written consent.

## 7. INTELLECTUAL PROPERTY

All work product, deliverables, code, content and intellectual property created by the Intern during the course of the internship shall be the sole and exclusive property of the Company.

## 8. NO EMPLOYMENT RELATIONSHIP

This Agreement is for internship/training purposes only and shall not be construed as creating any employer-employee relationship, nor shall it give rise to any claim of employment or continuance of engagement after the end date.

## 9. TERMINATION

The Company may terminate this Agreement at any time, with or without cause, by giving seven (7) days' written notice. The Intern may also terminate by giving similar notice. The Company may terminate forthwith for misconduct, breach of confidentiality or non-performance.

## 10. CERTIFICATE

Upon successful completion of the internship, the Company shall issue a Certificate of Internship to the Intern, subject to satisfactory performance and timely completion of all assigned tasks.

## 11. GOVERNING LAW

This Agreement shall be governed by the laws of India and the courts at {{city}} shall have exclusive jurisdiction.

IN WITNESS WHEREOF, the parties have executed this Agreement on the date first above written.`,
};

export default template;
