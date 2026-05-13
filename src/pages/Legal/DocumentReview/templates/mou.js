const template = {
  id: 'mou',
  name: 'Memorandum of Understanding (MoU)',
  category: 'business',
  icon: 'FileText',
  estimatedTime: '3 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A non-binding MoU outlining preliminary understanding between parties exploring a partnership, collaboration or transaction.',
  tags: ['mou', 'understanding', 'partnership', 'collaboration'],
  variables: [
    { key: 'mouDate', label: 'Date of MoU', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City of Execution', type: 'text', required: true, group: 'Basic' },

    { key: 'partyAName', label: 'Party A — Name / Entity', type: 'text', required: true, group: 'Party A' },
    { key: 'partyAAddress', label: 'Party A — Address', type: 'textarea', required: true, group: 'Party A' },

    { key: 'partyBName', label: 'Party B — Name / Entity', type: 'text', required: true, group: 'Party B' },
    { key: 'partyBAddress', label: 'Party B — Address', type: 'textarea', required: true, group: 'Party B' },

    { key: 'objective', label: 'Objective of the MoU', type: 'textarea', required: true, placeholder: 'Describe the joint initiative, collaboration or transaction', group: 'Terms' },
    { key: 'partyARoles', label: 'Party A — Roles & Responsibilities', type: 'textarea', required: true, group: 'Terms' },
    { key: 'partyBRoles', label: 'Party B — Roles & Responsibilities', type: 'textarea', required: true, group: 'Terms' },
    { key: 'termMonths', label: 'Term of MoU (Months)', type: 'number', required: true, placeholder: '12', group: 'Terms' },
  ],
  signatureBlocks: ['For Party A', 'For Party B', 'Witness'],
  body: `## MEMORANDUM OF UNDERSTANDING

THIS MEMORANDUM OF UNDERSTANDING ("MoU") is entered into at {{city}} on this {{mouDate}}.

## BETWEEN

{{partyAName}}, having its office/address at {{partyAAddress}} (hereinafter "Party A");

## AND

{{partyBName}}, having its office/address at {{partyBAddress}} (hereinafter "Party B").

Party A and Party B are collectively referred to as the "Parties" and individually as a "Party".

## 1. OBJECTIVE

The Parties wish to record their mutual understanding to collaborate on the following objective ("Objective"):

{{objective}}

## 2. ROLES AND RESPONSIBILITIES

### Party A shall:
{{partyARoles}}

### Party B shall:
{{partyBRoles}}

## 3. TERM

This MoU shall be effective from the date of execution and shall remain in force for a period of {{termMonths}} months, unless extended by mutual written agreement or terminated earlier as provided herein.

## 4. NATURE OF MOU

This MoU sets out the broad framework of cooperation between the Parties and is intended to record their mutual intent. Save for the clauses on Confidentiality, Intellectual Property and Governing Law, this MoU is non-binding and does not create any legally enforceable obligations. Specific binding obligations shall be set out in definitive agreements to be executed separately.

## 5. CONFIDENTIALITY

Each Party shall maintain the confidentiality of all non-public information received from the other Party in connection with this MoU and shall not disclose the same to any third party without the prior written consent of the disclosing Party, except as may be required by law.

## 6. INTELLECTUAL PROPERTY

Nothing in this MoU shall be construed as a transfer or grant of any intellectual property rights. Each Party shall retain ownership of its pre-existing intellectual property. Joint developments, if any, shall be governed by separate definitive agreements.

## 7. EXPENSES

Each Party shall bear its own costs and expenses incurred in connection with this MoU and the activities contemplated hereunder, unless otherwise specifically agreed in writing.

## 8. TERMINATION

Either Party may terminate this MoU at any time by giving thirty (30) days' prior written notice to the other Party.

## 9. GOVERNING LAW

This MoU shall be governed by the laws of India and the courts at {{city}} shall have exclusive jurisdiction.

IN WITNESS WHEREOF, the Parties have signed this MoU on the date first above written.`,
};

export default template;
