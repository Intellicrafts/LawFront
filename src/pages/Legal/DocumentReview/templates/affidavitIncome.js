const template = {
  id: 'affidavit-income',
  name: 'Affidavit of Income',
  category: 'affidavit',
  icon: 'FileCheck',
  estimatedTime: '2 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A sworn declaration of annual income, commonly required for scholarships, loans, visa applications and government scheme eligibility.',
  tags: ['affidavit', 'income', 'declaration'],
  variables: [
    { key: 'affidavitDate', label: 'Date of Affidavit', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, group: 'Basic' },

    { key: 'deponentName', label: 'Full Name', type: 'text', required: true, group: 'Deponent' },
    { key: 'fatherName', label: "Father's / Husband's Name", type: 'text', required: true, group: 'Deponent' },
    { key: 'age', label: 'Age', type: 'number', required: true, group: 'Deponent' },
    { key: 'occupation', label: 'Occupation', type: 'text', required: true, group: 'Deponent' },
    { key: 'address', label: 'Residential Address', type: 'textarea', required: true, group: 'Deponent' },

    { key: 'annualIncome', label: 'Annual Income from All Sources (INR)', type: 'number', required: true, validation: 'currency', group: 'Income' },
    { key: 'sourceOfIncome', label: 'Source(s) of Income', type: 'textarea', required: true, placeholder: 'e.g. salary from XYZ Ltd, rental income from property at ABC', group: 'Income' },
    { key: 'financialYear', label: 'Financial Year', type: 'text', required: true, placeholder: 'e.g. 2024-25', group: 'Income' },
    { key: 'purpose', label: 'Purpose of Affidavit', type: 'text', required: true, placeholder: 'e.g. scholarship application, EWS certificate', group: 'Income' },
  ],
  signatureBlocks: ['Deponent'],
  body: `## AFFIDAVIT OF INCOME

I, {{deponentName}}, S/o, D/o, W/o {{fatherName}}, aged about {{age}} years, by occupation {{occupation}}, resident of {{address}}, do hereby solemnly affirm and declare on oath as follows:

1. That I am a citizen of India and a permanent resident of {{city}}.

2. That my total annual income from all sources, for the financial year {{financialYear}}, is INR {{annualIncome}}/- (Rupees ___________________ only).

3. That my source(s) of income are as follows: {{sourceOfIncome}}.

4. That I do not have any other source of income apart from those mentioned above and the income declared herein is the total income of the family/myself, as the case may be.

5. That this affidavit is being executed by me for the purpose of {{purpose}} and to be submitted before the concerned authority as proof of my annual income.

6. That I undertake to inform the concerned authority of any material change in my income or source of income.

7. That the contents of this affidavit have been read over and explained to me in the vernacular language and I have understood the same.

8. That whatever is stated hereinabove is true to the best of my knowledge and belief and nothing material has been concealed therefrom. I am also aware that any false declaration in this affidavit is punishable under the relevant provisions of the Indian Penal Code.

VERIFIED at {{city}} on this {{affidavitDate}} that the contents of the above affidavit are true and correct to the best of my knowledge and belief.`,
};

export default template;
