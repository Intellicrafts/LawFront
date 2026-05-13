const template = {
  id: 'nda-mutual',
  name: 'Mutual Non-Disclosure Agreement (NDA)',
  category: 'business',
  icon: 'Shield',
  estimatedTime: '3 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A bilateral confidentiality agreement to protect proprietary information exchanged between two parties exploring or executing a business relationship.',
  tags: ['nda', 'confidentiality', 'business', 'startup'],
  variables: [
    { key: 'agreementDate', label: 'Agreement Date', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City of Execution', type: 'text', required: true, group: 'Basic' },

    { key: 'partyAName', label: 'Party A — Full Name / Entity', type: 'text', required: true, group: 'Party A' },
    { key: 'partyAAddress', label: 'Party A — Registered Address', type: 'textarea', required: true, group: 'Party A' },
    { key: 'partyAEntityType', label: 'Party A — Entity Type', type: 'select', required: true, options: ['Individual', 'Sole Proprietorship', 'Partnership Firm', 'LLP', 'Private Limited Company', 'Public Limited Company'], group: 'Party A' },

    { key: 'partyBName', label: 'Party B — Full Name / Entity', type: 'text', required: true, group: 'Party B' },
    { key: 'partyBAddress', label: 'Party B — Registered Address', type: 'textarea', required: true, group: 'Party B' },
    { key: 'partyBEntityType', label: 'Party B — Entity Type', type: 'select', required: true, options: ['Individual', 'Sole Proprietorship', 'Partnership Firm', 'LLP', 'Private Limited Company', 'Public Limited Company'], group: 'Party B' },

    { key: 'purpose', label: 'Purpose of Disclosure (1-2 sentences)', type: 'textarea', required: true, placeholder: 'e.g. Evaluating a potential business collaboration in the SaaS space.', group: 'Terms' },
    { key: 'confidentialityYears', label: 'Confidentiality Period (Years)', type: 'number', required: true, placeholder: '3', group: 'Terms' },
    { key: 'governingCity', label: 'City for Jurisdiction', type: 'text', required: true, group: 'Terms' },
  ],
  signatureBlocks: ['Party A', 'Party B', 'Witness 1', 'Witness 2'],
  body: `## MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into at {{city}} on {{agreementDate}}.

## BETWEEN

{{partyAName}}, a {{partyAEntityType}} having its principal place of business / residence at {{partyAAddress}} (hereinafter referred to as "Party A");

## AND

{{partyBName}}, a {{partyBEntityType}} having its principal place of business / residence at {{partyBAddress}} (hereinafter referred to as "Party B").

Party A and Party B are individually referred to as a "Party" and collectively as the "Parties".

## RECITALS

The Parties wish to explore and discuss the following purpose: {{purpose}} (the "Purpose"). In connection with such discussions, each Party may disclose to the other Party certain confidential and proprietary information. The Parties wish to protect such information on the terms set forth below.

## NOW THEREFORE, THE PARTIES AGREE AS FOLLOWS:

1. DEFINITION OF CONFIDENTIAL INFORMATION: "Confidential Information" means any non-public information disclosed by one Party (the "Disclosing Party") to the other Party (the "Receiving Party"), in any form (written, oral, electronic, visual or otherwise), that is identified as confidential at the time of disclosure or that would reasonably be understood to be confidential given the nature of the information and the circumstances of disclosure. This includes, without limitation, business plans, financial information, customer lists, technical data, trade secrets, source code, designs, processes, marketing strategies and personnel information.

2. EXCLUSIONS: Confidential Information shall not include information that: (a) is or becomes publicly available through no fault of the Receiving Party; (b) was rightfully known to the Receiving Party before disclosure; (c) is independently developed by the Receiving Party without use of the Confidential Information; or (d) is rightfully obtained by the Receiving Party from a third party without restriction.

3. OBLIGATIONS OF THE RECEIVING PARTY: The Receiving Party shall: (a) use the Confidential Information solely for the Purpose and not for any other purpose; (b) protect the Confidential Information with the same degree of care it uses to protect its own confidential information of a similar nature, but in no event less than reasonable care; (c) not disclose the Confidential Information to any third party except to its employees, advisors and consultants who have a need to know and who are bound by obligations of confidentiality at least as protective as those set forth herein; and (d) not reverse engineer, decompile or disassemble any tangible objects embodying Confidential Information.

4. COMPELLED DISCLOSURE: If the Receiving Party is required by law, court order or government authority to disclose Confidential Information, it shall, to the extent legally permitted, promptly notify the Disclosing Party so that the Disclosing Party may seek a protective order or other appropriate remedy.

5. NO LICENCE: Nothing in this Agreement shall be construed as granting any rights, licence or interest to the Receiving Party in the Confidential Information of the Disclosing Party, by implication, estoppel or otherwise.

6. RETURN OR DESTRUCTION: Upon written request of the Disclosing Party or upon termination of this Agreement, the Receiving Party shall, at the Disclosing Party's option, promptly return or destroy all Confidential Information in its possession, including all copies and extracts thereof, and certify such return or destruction in writing.

7. TERM: This Agreement shall remain in effect for a period of {{confidentialityYears}} year(s) from the date first written above. The obligations of confidentiality with respect to any Confidential Information disclosed during such period shall survive for a further period of {{confidentialityYears}} year(s) from the date of expiry or termination.

8. NO OBLIGATION TO PROCEED: Nothing in this Agreement shall obligate either Party to proceed with any transaction or business relationship.

9. REMEDIES: The Parties acknowledge that monetary damages may be inadequate to compensate for a breach of this Agreement and that the non-breaching Party shall be entitled to seek injunctive relief and specific performance, in addition to all other remedies available at law or in equity.

10. GOVERNING LAW & JURISDICTION: This Agreement shall be governed by and construed in accordance with the laws of India. The Parties submit to the exclusive jurisdiction of the courts at {{governingCity}}.

11. ENTIRE AGREEMENT: This Agreement constitutes the entire understanding between the Parties with respect to its subject matter and supersedes all prior discussions, agreements and understandings.

IN WITNESS WHEREOF, the Parties have executed this Agreement on the date first above written.`,
};

export default template;
