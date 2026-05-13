const template = {
  id: 'mutual-divorce-petition',
  name: 'Mutual Consent Divorce Petition (Sec 13B)',
  category: 'family',
  icon: 'Heart',
  estimatedTime: '5 min',
  premium: true,
  jurisdiction: 'India',
  description:
    'A joint petition for divorce by mutual consent under Section 13B of the Hindu Marriage Act, 1955. To be filed in the Family Court.',
  tags: ['divorce', 'mutual consent', 'family court', 'section 13B'],
  variables: [
    { key: 'petitionDate', label: 'Date of Petition', type: 'date', required: true, group: 'Basic' },
    { key: 'courtName', label: 'Family Court Name & City', type: 'text', required: true, placeholder: 'In the Court of the Family Court Judge at Mumbai', group: 'Basic' },

    { key: 'husbandName', label: "Husband's Full Name", type: 'text', required: true, group: 'Husband' },
    { key: 'husbandFatherName', label: "Husband's Father's Name", type: 'text', required: true, group: 'Husband' },
    { key: 'husbandAge', label: "Husband's Age", type: 'number', required: true, group: 'Husband' },
    { key: 'husbandOccupation', label: "Husband's Occupation", type: 'text', required: true, group: 'Husband' },
    { key: 'husbandAddress', label: "Husband's Current Address", type: 'textarea', required: true, group: 'Husband' },

    { key: 'wifeName', label: "Wife's Full Name", type: 'text', required: true, group: 'Wife' },
    { key: 'wifeFatherName', label: "Wife's Father's Name", type: 'text', required: true, group: 'Wife' },
    { key: 'wifeAge', label: "Wife's Age", type: 'number', required: true, group: 'Wife' },
    { key: 'wifeOccupation', label: "Wife's Occupation", type: 'text', required: true, group: 'Wife' },
    { key: 'wifeAddress', label: "Wife's Current Address", type: 'textarea', required: true, group: 'Wife' },

    { key: 'marriageDate', label: 'Date of Marriage', type: 'date', required: true, group: 'Marriage' },
    { key: 'marriagePlace', label: 'Place of Marriage', type: 'text', required: true, group: 'Marriage' },
    { key: 'marriageReligion', label: 'Religion / Ceremony', type: 'select', required: true, options: ['Hindu Rites', 'Special Marriage Act', 'Other'], group: 'Marriage' },
    { key: 'separationSince', label: 'Living Separately Since', type: 'date', required: true, group: 'Marriage' },
    { key: 'childrenDetails', label: 'Children, if any (Name & Age) — "None" if no children', type: 'textarea', required: true, group: 'Marriage' },

    { key: 'settlementSummary', label: 'Summary of Settlement (alimony, custody, property)', type: 'textarea', required: true, placeholder: 'e.g. Husband to pay Rs. 5,00,000 as one-time settlement; daughter custody to remain with wife; husband to retain Flat at XYZ; wife to retain car & jewellery.', group: 'Settlement' },
  ],
  signatureBlocks: ['Petitioner No. 1 (Husband)', 'Petitioner No. 2 (Wife)', 'Advocate for Petitioners'],
  body: `## IN {{courtName}}

PETITION NO. _______ OF _______

UNDER SECTION 13B OF THE HINDU MARRIAGE ACT, 1955 / SECTION 28 OF THE SPECIAL MARRIAGE ACT, 1954

## IN THE MATTER OF:

{{husbandName}}, S/o {{husbandFatherName}}, aged about {{husbandAge}} years, by occupation {{husbandOccupation}}, resident of {{husbandAddress}}
                                                                                ... Petitioner No. 1 (Husband)

AND

{{wifeName}}, D/o {{wifeFatherName}}, aged about {{wifeAge}} years, by occupation {{wifeOccupation}}, resident of {{wifeAddress}}
                                                                                ... Petitioner No. 2 (Wife)

## JOINT PETITION FOR DISSOLUTION OF MARRIAGE BY MUTUAL CONSENT

The Petitioners above-named most respectfully submit as follows:

1. That the marriage between Petitioner No. 1 and Petitioner No. 2 was solemnised on {{marriageDate}} at {{marriagePlace}} according to {{marriageReligion}}. After the marriage, the Petitioners cohabited as husband and wife.

2. That the Petitioners are governed by the Hindu Marriage Act, 1955 / Special Marriage Act, 1954, as applicable, and this Hon'ble Court has jurisdiction to entertain and try the present petition.

3. CHILDREN: {{childrenDetails}}.

4. That on account of various differences and incompatibilities of temperament, the Petitioners have been unable to live together as husband and wife. Despite efforts at reconciliation, the marriage has irretrievably broken down and there is no possibility of the Petitioners residing together as husband and wife.

5. That the Petitioners have been living separately, away from each other, with no marital relationship of any kind, since {{separationSince}}, that is, for a period of more than one year as on the date of presentation of this petition, which is the requirement under Section 13B of the Hindu Marriage Act, 1955.

6. That the Petitioners have mutually agreed that their marriage should be dissolved by a decree of divorce by mutual consent. The Petitioners are filing this petition out of their own free will, without any coercion, force, fraud or undue influence.

7. SETTLEMENT: The Petitioners have amicably settled all their disputes and inter-se claims regarding alimony, maintenance, dowry, jewellery, streedhan, custody of children (if any), and division of movable and immovable properties, as recorded below:

{{settlementSummary}}

The Petitioners shall have no further claim of any nature whatsoever against each other after the passing of the decree of divorce.

8. That this petition is not being filed in collusion with each other but is filed by both Petitioners voluntarily and with their full and free consent for the purpose of obtaining a decree of divorce by mutual consent.

9. That the Petitioners shall appear before this Hon'ble Court for the first motion at the time of filing of this petition, and shall again appear for the second motion after the statutory period of six (6) months as required under Section 13B(2), unless waived by this Hon'ble Court.

## PRAYER

In the premises aforesaid, it is most respectfully prayed that this Hon'ble Court may be pleased to:

(a) Dissolve the marriage between the Petitioners solemnised on {{marriageDate}} by a decree of divorce by mutual consent, under Section 13B of the Hindu Marriage Act, 1955;

(b) Pass such further or other orders as this Hon'ble Court may deem fit and proper in the facts and circumstances of the case.

Place: {{marriagePlace}}
Date: {{petitionDate}}`,
};

export default template;
