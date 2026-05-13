const template = {
  id: 'affidavit-dob',
  name: 'Affidavit for Date of Birth',
  category: 'affidavit',
  icon: 'FileCheck',
  estimatedTime: '2 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A sworn declaration of date of birth, used where no other proof is available. Accepted by schools, colleges and government departments.',
  tags: ['affidavit', 'dob', 'date of birth'],
  variables: [
    { key: 'affidavitDate', label: 'Date of Affidavit', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, group: 'Basic' },

    { key: 'deponentName', label: 'Full Name', type: 'text', required: true, group: 'Deponent' },
    { key: 'fatherName', label: "Father's Name", type: 'text', required: true, group: 'Deponent' },
    { key: 'dob', label: 'Date of Birth', type: 'date', required: true, group: 'Deponent' },
    { key: 'placeOfBirth', label: 'Place of Birth', type: 'text', required: true, group: 'Deponent' },
    { key: 'currentAddress', label: 'Current Residential Address', type: 'textarea', required: true, group: 'Deponent' },
    { key: 'religion', label: 'Religion', type: 'text', required: true, group: 'Deponent' },
    { key: 'purpose', label: 'Purpose of Affidavit', type: 'text', required: true, placeholder: 'e.g. for school admission, passport application', group: 'Deponent' },
  ],
  signatureBlocks: ['Deponent'],
  body: `## AFFIDAVIT FOR DATE OF BIRTH

I, {{deponentName}}, S/o, D/o {{fatherName}}, by religion {{religion}}, presently residing at {{currentAddress}}, do hereby solemnly affirm and declare on oath as follows:

1. That I am a citizen of India and a permanent resident of {{city}}.

2. That I was born on {{dob}} at {{placeOfBirth}}.

3. That my correct date of birth, as recorded in the records of my family and as known to my parents and relatives, is {{dob}}.

4. That no birth certificate was issued at the time of my birth as the same was not mandatory during that period at my place of birth, or such certificate is not available with me/my family.

5. That my date of birth, as stated above, is true and correct to the best of my knowledge and belief, and the same is supported by the records of my family and the statements of my parents/elders.

6. That this affidavit is being executed by me for the purpose of {{purpose}} and to be produced before the concerned authorities as proof of my date of birth.

7. That I undertake to abide by the date of birth declared herein for all official and personal purposes, and the same shall be binding on me.

8. That the contents of this affidavit have been read over and explained to me in the vernacular language and I have understood the same.

9. That whatever is stated hereinabove is true to the best of my knowledge and belief and nothing material has been concealed therefrom.

VERIFIED at {{city}} on this {{affidavitDate}} that the contents of the above affidavit are true and correct to the best of my knowledge and belief.`,
};

export default template;
