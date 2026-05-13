const template = {
  id: 'affidavit-self-declaration',
  name: 'Self Declaration Affidavit',
  category: 'affidavit',
  icon: 'FileCheck',
  estimatedTime: '2 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A general-purpose self-declaration affidavit that can be customised for almost any factual declaration required by an authority.',
  tags: ['affidavit', 'self declaration', 'general'],
  variables: [
    { key: 'affidavitDate', label: 'Date of Affidavit', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, group: 'Basic' },

    { key: 'deponentName', label: 'Full Name', type: 'text', required: true, group: 'Deponent' },
    { key: 'fatherName', label: "Father's / Husband's Name", type: 'text', required: true, group: 'Deponent' },
    { key: 'age', label: 'Age', type: 'number', required: true, group: 'Deponent' },
    { key: 'occupation', label: 'Occupation', type: 'text', required: true, group: 'Deponent' },
    { key: 'address', label: 'Residential Address', type: 'textarea', required: true, group: 'Deponent' },

    { key: 'declarationContent', label: 'Statements to be Declared (one per line)', type: 'textarea', required: true, placeholder: 'Enter each declaration as a separate line. They will be numbered automatically.', group: 'Content' },
    { key: 'purpose', label: 'Purpose of Affidavit', type: 'text', required: true, group: 'Content' },
  ],
  signatureBlocks: ['Deponent'],
  body: `## SELF-DECLARATION AFFIDAVIT

I, {{deponentName}}, S/o, D/o, W/o {{fatherName}}, aged about {{age}} years, by occupation {{occupation}}, resident of {{address}}, do hereby solemnly affirm and declare on oath as follows:

1. That I am a citizen of India and a permanent resident of {{city}}.

2. That I am executing this affidavit voluntarily, of my own free will, without any coercion, force, fraud or undue influence.

3. That the following statements are true and correct, made by me on solemn affirmation:

{{declarationContent}}

4. That this affidavit is being executed by me for the purpose of {{purpose}} and to be produced before the concerned authority/persons for whatever purpose it may serve.

5. That I undertake that the statements made hereinabove are true to the best of my knowledge and belief, and I am aware that any false declaration is punishable under the relevant provisions of the Indian Penal Code.

6. That the contents of this affidavit have been read over and explained to me in the vernacular language and I have understood the same.

VERIFIED at {{city}} on this {{affidavitDate}} that the contents of the above affidavit are true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.`,
};

export default template;
