const template = {
  id: 'indemnity-bond',
  name: 'Indemnity Bond',
  category: 'finance',
  icon: 'Shield',
  estimatedTime: '2 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'An indemnity bond by which one party agrees to indemnify another against loss or liability arising from a specified event.',
  tags: ['indemnity', 'bond', 'guarantee'],
  variables: [
    { key: 'bondDate', label: 'Date of Bond', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, group: 'Basic' },

    { key: 'indemnifierName', label: "Indemnifier's Full Name", type: 'text', required: true, group: 'Indemnifier' },
    { key: 'indemnifierFatherName', label: "Indemnifier's Father's Name", type: 'text', required: true, group: 'Indemnifier' },
    { key: 'indemnifierAddress', label: "Indemnifier's Address", type: 'textarea', required: true, group: 'Indemnifier' },
    { key: 'indemnifierOccupation', label: "Indemnifier's Occupation", type: 'text', required: true, group: 'Indemnifier' },

    { key: 'indemnifiedName', label: "Indemnified Party's Name", type: 'text', required: true, group: 'Indemnified' },
    { key: 'indemnifiedAddress', label: "Indemnified Party's Address", type: 'textarea', required: true, group: 'Indemnified' },

    { key: 'subjectMatter', label: 'Subject Matter / Circumstances giving rise to Indemnity', type: 'textarea', required: true, placeholder: 'e.g. Lost share certificate, lost original sale deed, lost cheque book, scholarship sponsorship, etc.', group: 'Indemnity' },
    { key: 'bondAmount', label: 'Bond Amount / Maximum Liability (INR)', type: 'number', required: true, validation: 'currency', group: 'Indemnity' },
  ],
  signatureBlocks: ['Indemnifier', 'Witness 1', 'Witness 2'],
  body: `## DEED OF INDEMNITY (INDEMNITY BOND)

THIS DEED OF INDEMNITY is made and executed at {{city}} on this {{bondDate}}.

## BY

{{indemnifierName}}, S/o, D/o, W/o {{indemnifierFatherName}}, aged about __ years, by occupation {{indemnifierOccupation}}, resident of {{indemnifierAddress}} (hereinafter referred to as the "Indemnifier", which expression shall include his/her heirs, executors, administrators, legal representatives and assigns);

## IN FAVOUR OF

{{indemnifiedName}}, having his/her address at {{indemnifiedAddress}} (hereinafter referred to as the "Indemnified", which expression shall include his/her heirs, executors, administrators, legal representatives, successors and assigns).

## WHEREAS

A. {{subjectMatter}}

B. In view of the above circumstances, the Indemnified has agreed to act / has been requested to act, subject to the Indemnifier executing this Indemnity Bond in favour of the Indemnified, indemnifying the Indemnified against any loss, damage, claim, action, demand or expense that may be suffered by the Indemnified arising out of or in connection with the said circumstances.

## NOW THIS INDEMNITY BOND WITNESSETH AS FOLLOWS:

1. INDEMNITY: The Indemnifier hereby agrees, undertakes and covenants to indemnify, save, defend and hold harmless the Indemnified, at all times hereafter, from and against any and all losses, damages, costs, charges, claims, demands, actions, suits, proceedings, expenses (including legal fees) and liabilities of any nature whatsoever, that the Indemnified may suffer, sustain, incur or be put to, directly or indirectly, by reason of, or in connection with, the matter described in the Recital above.

2. MAXIMUM LIABILITY: The maximum liability of the Indemnifier under this Indemnity Bond shall be limited to a sum of INR {{bondAmount}}/- (Rupees ___________________ only).

3. SUFFICIENT PROOF: A demand or claim made in writing by the Indemnified upon the Indemnifier, supported by reasonable evidence of the loss or liability, shall be sufficient evidence of the same, and the Indemnifier shall pay the same to the Indemnified within thirty (30) days of receipt of such demand, without dispute or demur.

4. DURATION: This Indemnity Bond shall remain in full force and effect until all claims, actions, suits and proceedings, if any, arising out of the matter described in the Recital are finally and conclusively determined, settled or barred by limitation.

5. SUCCESSORS: This Indemnity Bond shall bind the Indemnifier, his/her heirs, executors, administrators, legal representatives, successors and assigns, and shall enure for the benefit of the Indemnified and his/her heirs, executors, administrators, legal representatives, successors and assigns.

6. GOVERNING LAW: This Indemnity Bond shall be governed by the laws of India and the courts at {{city}} shall have exclusive jurisdiction.

IN WITNESS WHEREOF, the Indemnifier has set his/her hand to this Indemnity Bond on the day, month and year first above written, in the presence of the witnesses named below.`,
};

export default template;
