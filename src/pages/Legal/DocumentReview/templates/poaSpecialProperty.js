const template = {
  id: 'poa-special-property',
  name: 'Special Power of Attorney (Property)',
  category: 'poa',
  icon: 'Shield',
  estimatedTime: '3 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A special power of attorney to authorise another person to deal with a specific immovable property — sell, lease, manage or represent before authorities.',
  tags: ['poa', 'special', 'property'],
  variables: [
    { key: 'executionDate', label: 'Date of Execution', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City of Execution', type: 'text', required: true, group: 'Basic' },

    { key: 'principalName', label: "Principal's Full Name", type: 'text', required: true, group: 'Principal' },
    { key: 'principalFatherName', label: "Principal's Father's Name", type: 'text', required: true, group: 'Principal' },
    { key: 'principalAge', label: "Principal's Age", type: 'number', required: true, group: 'Principal' },
    { key: 'principalAddress', label: "Principal's Address", type: 'textarea', required: true, group: 'Principal' },

    { key: 'attorneyName', label: "Attorney's Full Name", type: 'text', required: true, group: 'Attorney' },
    { key: 'attorneyFatherName', label: "Attorney's Father's Name", type: 'text', required: true, group: 'Attorney' },
    { key: 'attorneyAge', label: "Attorney's Age", type: 'number', required: true, group: 'Attorney' },
    { key: 'attorneyAddress', label: "Attorney's Address", type: 'textarea', required: true, group: 'Attorney' },
    { key: 'relationship', label: 'Relationship', type: 'text', required: true, group: 'Attorney' },

    { key: 'propertyDescription', label: 'Property Description (with full address & boundaries)', type: 'textarea', required: true, group: 'Property' },
    { key: 'authorityScope', label: 'Scope of Authority', type: 'select', required: true, options: ['To Sell Only', 'To Lease/Rent Only', 'To Manage and Maintain', 'To Sell, Lease, Manage and Represent (Full)'], group: 'Property' },
  ],
  signatureBlocks: ['Principal', 'Attorney', 'Witness 1', 'Witness 2'],
  body: `## SPECIAL POWER OF ATTORNEY (PROPERTY)

KNOW ALL MEN BY THESE PRESENTS that I, {{principalName}}, S/o, D/o, W/o {{principalFatherName}}, aged about {{principalAge}} years, resident of {{principalAddress}} (hereinafter the "Principal"), do hereby nominate, constitute and appoint:

{{attorneyName}}, S/o, D/o, W/o {{attorneyFatherName}}, aged about {{attorneyAge}} years, my {{relationship}}, resident of {{attorneyAddress}} (hereinafter the "Attorney"),

to be my true and lawful Attorney in respect of the immovable property described in the Schedule below (the "Scheduled Property"), with the following specific authority limited to "{{authorityScope}}":

## SCOPE OF AUTHORITY

1. To appear and represent me before any Sub-Registrar, Registrar, Revenue Authority, Municipal Authority, Society/Association of Apartment Owners, Land Records Office, RERA Authority, Income Tax Department, Electricity Board, Water Department, Telephone Department and any other authority or office, in connection with the Scheduled Property.

2. To negotiate, agree, finalise and execute on my behalf any agreement for sale, sale deed, lease deed, rent agreement, leave and licence agreement, mortgage deed, gift deed, surrender deed, release deed, exchange deed, conveyance deed, partition deed or any other deed or document in respect of the Scheduled Property, subject to the scope of authority granted herein.

3. To receive the sale consideration, advance, security deposit, rent or other monies in respect of the Scheduled Property, and to issue valid receipts and discharges therefor.

4. To deliver vacant and peaceful possession of the Scheduled Property to the purchaser/lessee/transferee.

5. To sign, present, admit execution, present for registration and register before the concerned Sub-Registrar all such documents as may be executed in respect of the Scheduled Property.

6. To apply for and obtain certified copies, encumbrance certificates, tax receipts, building plans, occupation certificates, NOCs and any other documents required from any authority in respect of the Scheduled Property.

7. To engage advocates and other professionals, file and defend suits, applications, complaints, appeals and other proceedings, and to sign and verify all necessary court documents in connection with the Scheduled Property.

8. To do all such other acts, deeds, matters and things as may be necessary or incidental to the exercise of the above powers.

## SCHEDULE OF PROPERTY

{{propertyDescription}}

## RATIFICATION

I do hereby agree and undertake to ratify and confirm whatever acts, deeds and things are lawfully done by my Attorney in the exercise of the powers conferred hereunder.

This Special Power of Attorney shall remain in full force until expressly revoked by me in writing.

IN WITNESS WHEREOF, I have signed this Special Power of Attorney at {{city}} on this {{executionDate}}.`,
};

export default template;
