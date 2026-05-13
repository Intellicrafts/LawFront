const template = {
  id: 'affidavit-address-proof',
  name: 'Affidavit for Address Proof',
  category: 'affidavit',
  icon: 'FileCheck',
  estimatedTime: '2 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A sworn declaration of current address to be used as address proof where standard documents like Aadhaar are not yet updated.',
  tags: ['affidavit', 'address proof', 'declaration'],
  variables: [
    { key: 'affidavitDate', label: 'Date of Affidavit', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, group: 'Basic' },

    { key: 'deponentName', label: 'Full Name', type: 'text', required: true, group: 'Deponent' },
    { key: 'fatherName', label: "Father's / Husband's Name", type: 'text', required: true, group: 'Deponent' },
    { key: 'age', label: 'Age', type: 'number', required: true, group: 'Deponent' },
    { key: 'occupation', label: 'Occupation', type: 'text', required: true, group: 'Deponent' },
    { key: 'currentAddress', label: 'Current Residential Address (full)', type: 'textarea', required: true, group: 'Deponent' },
    { key: 'residingSince', label: 'Residing at this address since', type: 'date', required: true, group: 'Deponent' },
    { key: 'aadhaarNumber', label: 'Aadhaar Number (optional)', type: 'text', required: false, validation: 'aadhaar', group: 'Deponent' },
    { key: 'purpose', label: 'Purpose of Affidavit', type: 'text', required: true, placeholder: 'e.g. for opening a bank account, getting a new gas connection', group: 'Deponent' },
  ],
  signatureBlocks: ['Deponent'],
  body: `## AFFIDAVIT FOR PROOF OF ADDRESS

I, {{deponentName}}, S/o, D/o, W/o {{fatherName}}, aged about {{age}} years, by occupation {{occupation}}, presently residing at {{currentAddress}}, do hereby solemnly affirm and declare on oath as follows:

1. That I am a citizen of India and a permanent resident of {{city}}.

2. That I have been residing at the above-mentioned address, namely {{currentAddress}}, since {{residingSince}}, peacefully and uninterruptedly, and the same is my current and permanent residential address.

{{#if aadhaarNumber}}3. That my Aadhaar Card bears the number {{aadhaarNumber}}. However, the address printed on the said Aadhaar Card has not yet been updated to reflect my current address.

{{/if}}4. That I do not possess any other recognised address proof bearing my current address as on the date of this affidavit, and the same is the reason for executing this declaration.

5. That this affidavit is being executed by me for the purpose of {{purpose}} and to be submitted before the concerned authority as proof of my current residential address.

6. That I undertake to update my address in all official records at the earliest opportunity.

7. That the contents of this affidavit have been read over and explained to me in the vernacular language and I have understood the same.

8. That whatever is stated hereinabove is true to the best of my knowledge and belief and nothing material has been concealed therefrom.

VERIFIED at {{city}} on this {{affidavitDate}} that the contents of the above affidavit are true and correct to the best of my knowledge and belief.`,
};

export default template;
