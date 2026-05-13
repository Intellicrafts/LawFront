const template = {
  id: 'affidavit-name-change',
  name: 'Affidavit for Name Change',
  category: 'affidavit',
  icon: 'FileCheck',
  estimatedTime: '2 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A sworn declaration to legally change your name. Standard format accepted for passport, PAN, Aadhaar, bank and government records.',
  tags: ['affidavit', 'name change', 'declaration'],
  variables: [
    { key: 'affidavitDate', label: 'Date of Affidavit', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, group: 'Basic' },
    { key: 'state', label: 'State', type: 'text', required: true, group: 'Basic' },

    { key: 'oldName', label: 'Old Name (as in current records)', type: 'text', required: true, group: 'Deponent' },
    { key: 'newName', label: 'New Name (the name you want to adopt)', type: 'text', required: true, group: 'Deponent' },
    { key: 'fatherName', label: "Father's / Husband's Name", type: 'text', required: true, group: 'Deponent' },
    { key: 'age', label: 'Age', type: 'number', required: true, group: 'Deponent' },
    { key: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other'], group: 'Deponent' },
    { key: 'religion', label: 'Religion', type: 'text', required: true, group: 'Deponent' },
    { key: 'occupation', label: 'Occupation', type: 'text', required: true, group: 'Deponent' },
    { key: 'fullAddress', label: 'Full Residential Address', type: 'textarea', required: true, group: 'Deponent' },
    { key: 'aadhaarNumber', label: 'Aadhaar Number', type: 'text', required: false, validation: 'aadhaar', group: 'Deponent' },
    { key: 'reasonForChange', label: 'Reason for Name Change', type: 'textarea', required: true, placeholder: 'e.g. personal preference, marriage, astrological reasons', group: 'Deponent' },
  ],
  signatureBlocks: ['Deponent'],
  body: `## AFFIDAVIT FOR CHANGE OF NAME

I, {{newName}} (formerly known as {{oldName}}), {{gender}}, S/o, D/o, W/o {{fatherName}}, aged about {{age}} years, by religion {{religion}}, by occupation {{occupation}}, presently residing at {{fullAddress}}, do hereby solemnly affirm and declare on oath as follows:

1. That I am a citizen of India and a permanent resident of {{state}}.

2. That my name in all my previous records, including school records, government documents and other certificates, is recorded as "{{oldName}}".

{{#if aadhaarNumber}}3. That my Aadhaar Card bears the number {{aadhaarNumber}} and the above name.

{{/if}}4. That for the reason that {{reasonForChange}}, I have changed my name from "{{oldName}}" to "{{newName}}" and shall henceforth be known by my new name "{{newName}}" for all purposes whatsoever.

5. That all my previous records, certificates, mark-sheets, identification documents and other instruments bearing the name "{{oldName}}" shall be treated as referring to "{{newName}}" and shall continue to remain valid and binding upon me.

6. That this affidavit is being executed by me for the purpose of placing on record the change of my name and for getting the same notified through publication in the official Gazette and in newspapers, and for getting my name changed in all my official records, including but not limited to PAN Card, Aadhaar Card, Passport, Voter ID, Driving Licence, Bank Records, and Educational Certificates.

7. That the contents of this affidavit have been read over and explained to me in the vernacular language and I have understood the same.

8. That whatever is stated hereinabove is true to the best of my knowledge and belief and nothing material has been concealed therefrom.

VERIFIED at {{city}} on this {{affidavitDate}} that the contents of the above affidavit are true and correct to the best of my knowledge and belief, and that nothing material has been concealed therefrom.`,
};

export default template;
