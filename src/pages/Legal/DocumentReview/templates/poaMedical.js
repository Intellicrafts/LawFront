const template = {
  id: 'poa-medical',
  name: 'Medical Power of Attorney',
  category: 'poa',
  icon: 'Heart',
  estimatedTime: '3 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A medical power of attorney to appoint a trusted person to make healthcare decisions on your behalf if you become incapable of doing so.',
  tags: ['poa', 'medical', 'healthcare', 'advance directive'],
  variables: [
    { key: 'executionDate', label: 'Date of Execution', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, group: 'Basic' },

    { key: 'principalName', label: 'Your (Principal) Full Name', type: 'text', required: true, group: 'Principal' },
    { key: 'principalFatherName', label: "Principal's Father's Name", type: 'text', required: true, group: 'Principal' },
    { key: 'principalAge', label: "Principal's Age", type: 'number', required: true, group: 'Principal' },
    { key: 'principalAddress', label: "Principal's Address", type: 'textarea', required: true, group: 'Principal' },

    { key: 'agentName', label: "Agent's (Healthcare Proxy) Full Name", type: 'text', required: true, group: 'Agent' },
    { key: 'agentAddress', label: "Agent's Address", type: 'textarea', required: true, group: 'Agent' },
    { key: 'agentPhone', label: "Agent's Phone Number", type: 'text', required: true, validation: 'phone', group: 'Agent' },
    { key: 'relationship', label: 'Relationship', type: 'text', required: true, group: 'Agent' },

    { key: 'specificDirectives', label: 'Specific Medical Preferences or Directives (optional)', type: 'textarea', required: false, placeholder: 'e.g. No artificial life support after irrecoverable coma; prefer comfort care over aggressive treatment.', group: 'Directives' },
  ],
  signatureBlocks: ['Principal', 'Agent', 'Witness 1', 'Witness 2'],
  body: `## MEDICAL POWER OF ATTORNEY

I, {{principalName}}, S/o, D/o, W/o {{principalFatherName}}, aged about {{principalAge}} years, resident of {{principalAddress}} (hereinafter the "Principal"), being of sound mind and acting of my own free will, do hereby execute this Medical Power of Attorney and nominate, constitute and appoint:

{{agentName}}, my {{relationship}}, resident of {{agentAddress}}, contactable at {{agentPhone}} (hereinafter the "Agent"),

to be my Healthcare Agent / Proxy with the following authority:

## SCOPE OF AUTHORITY

1. CONSENT TO TREATMENT: To consent to or refuse on my behalf any medical, surgical, diagnostic, dental or therapeutic treatment, procedure, examination, hospitalisation or admission to any healthcare facility, nursing home or hospice.

2. ACCESS TO MEDICAL RECORDS: To request, receive, review and discuss any of my medical records, reports, images and information from any doctor, hospital, laboratory or healthcare provider.

3. SELECTION OF PROVIDERS: To select, engage and discharge doctors, surgeons, physiotherapists, nurses, attendants and any other healthcare professionals.

4. HOSPITALISATION DECISIONS: To consent to my admission or discharge from any hospital, nursing home, hospice or rehabilitation facility, and to sign all admission and discharge papers.

5. EMERGENCY DECISIONS: To make immediate decisions in the event of any medical emergency in which I am unable to communicate or make decisions for myself.

6. PAYMENT AND INSURANCE: To deal with my health insurance, raise claims, and to authorise payment of medical bills from my bank accounts (subject to a separate financial POA where applicable).

## ACTIVATION

This Medical Power of Attorney shall come into effect only when, in the opinion of two qualified medical practitioners, I become incapable of making or communicating my own healthcare decisions due to illness, injury or any other reason, and shall remain in force during the period of such incapacity.

{{#if specificDirectives}}## SPECIFIC DIRECTIVES

In exercising the authority granted hereunder, the Agent shall give due regard to the following specific preferences expressed by me:

{{specificDirectives}}

{{/if}}## GUIDING PRINCIPLES

The Agent shall act at all times in good faith, with reasonable care, and in what he/she believes to be in my best interests, having regard to my known values, religious beliefs, and any specific preferences I may have expressed previously.

## INDEMNITY

I hereby indemnify and hold harmless the Agent, and all doctors and healthcare providers acting in good faith on the instructions of the Agent, against any liability arising from such actions.

## REVOCATION

This Medical Power of Attorney shall remain in effect until expressly revoked by me in writing or upon my death.

IN WITNESS WHEREOF, I have signed this Medical Power of Attorney at {{city}} on this {{executionDate}}, in the presence of the witnesses named below.`,
};

export default template;
