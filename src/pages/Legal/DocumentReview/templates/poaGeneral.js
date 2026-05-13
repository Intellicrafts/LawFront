const template = {
  id: 'poa-general',
  name: 'General Power of Attorney',
  category: 'poa',
  icon: 'Shield',
  estimatedTime: '3 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A general power of attorney authorising another person to manage your day-to-day affairs, banking, property, and legal matters.',
  tags: ['poa', 'power of attorney', 'general'],
  variables: [
    { key: 'executionDate', label: 'Date of Execution', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City of Execution', type: 'text', required: true, group: 'Basic' },

    { key: 'principalName', label: "Principal's (Donor's) Full Name", type: 'text', required: true, group: 'Principal' },
    { key: 'principalFatherName', label: "Principal's Father's Name", type: 'text', required: true, group: 'Principal' },
    { key: 'principalAge', label: "Principal's Age", type: 'number', required: true, group: 'Principal' },
    { key: 'principalAddress', label: "Principal's Full Address", type: 'textarea', required: true, group: 'Principal' },
    { key: 'principalOccupation', label: "Principal's Occupation", type: 'text', required: true, group: 'Principal' },

    { key: 'attorneyName', label: "Attorney's (Donee's) Full Name", type: 'text', required: true, group: 'Attorney' },
    { key: 'attorneyFatherName', label: "Attorney's Father's Name", type: 'text', required: true, group: 'Attorney' },
    { key: 'attorneyAge', label: "Attorney's Age", type: 'number', required: true, group: 'Attorney' },
    { key: 'attorneyAddress', label: "Attorney's Full Address", type: 'textarea', required: true, group: 'Attorney' },
    { key: 'relationship', label: 'Relationship between Principal and Attorney', type: 'text', required: true, placeholder: 'e.g. Son, Wife, Brother, Friend', group: 'Attorney' },
  ],
  signatureBlocks: ['Principal (Donor)', 'Attorney (Donee)', 'Witness 1', 'Witness 2'],
  body: `## GENERAL POWER OF ATTORNEY

KNOW ALL MEN BY THESE PRESENTS that I, {{principalName}}, S/o, D/o, W/o {{principalFatherName}}, aged about {{principalAge}} years, by occupation {{principalOccupation}}, resident of {{principalAddress}} (hereinafter referred to as the "Principal" / "Donor"), do hereby nominate, constitute and appoint:

{{attorneyName}}, S/o, D/o, W/o {{attorneyFatherName}}, aged about {{attorneyAge}} years, my {{relationship}}, resident of {{attorneyAddress}} (hereinafter referred to as the "Attorney" / "Donee"),

to be my true and lawful Attorney, with full power and authority to do and execute all or any of the following acts, deeds, matters and things on my behalf and in my name:

## SCOPE OF AUTHORITY

1. BANKING: To operate any of my existing or future bank accounts, to deposit, withdraw and transfer monies, to issue cheques, demand drafts and pay orders, to open and close bank accounts, fixed deposits and lockers, and to do all acts incidental thereto.

2. PROPERTY MANAGEMENT: To manage, look after, maintain, preserve and protect all my movable and immovable properties wheresoever situated, including but not limited to letting out the same on lease or rent, collecting rents and profits, paying property taxes, municipal dues and society maintenance charges, and effecting necessary repairs.

3. SALE & PURCHASE OF PROPERTY: To sell, mortgage, lease, exchange, gift or otherwise transfer any of my movable or immovable properties, on such terms and consideration as my Attorney may deem fit, and to execute and register sale deeds, lease deeds, gift deeds, mortgage deeds and all other necessary documents.

4. LEGAL & JUDICIAL: To represent me in all legal, judicial, quasi-judicial and administrative proceedings before any court, tribunal, authority, commission or board, to engage advocates and other professionals, to sign, verify and file plaints, written statements, affidavits, vakalatnamas, applications, petitions and all other documents, to compromise, settle or withdraw any case, and to receive any decree or order in my favour.

5. GOVERNMENT & STATUTORY: To represent me before any government department, statutory authority, revenue office, registrar, sub-registrar, panchayat, municipality, income tax authorities, GST authorities, RTO and other authorities, and to sign all applications, returns, forms and declarations on my behalf.

6. CONTRACTS: To enter into, modify, terminate or rescind any contracts, agreements or arrangements on my behalf, and to negotiate the terms thereof.

7. INVESTMENTS: To purchase, sell, transfer or deal in any shares, securities, mutual funds, bonds, debentures or other investment instruments in my name.

8. CORRESPONDENCE: To receive and reply to any correspondence, notices, summons or processes issued to me, and to sign and deliver receipts and discharges.

9. INCIDENTAL POWERS: To do all such acts, deeds, matters and things as may be necessary, expedient or incidental to the exercise of the powers conferred hereunder, even though not specifically mentioned.

## RATIFICATION

I do hereby agree and undertake to ratify, confirm and approve all acts, deeds, matters and things lawfully done by my said Attorney in the exercise of the powers conferred hereunder, and the same shall be binding upon me as if done by me personally.

## REVOCATION

This Power of Attorney shall remain in full force until it is expressly revoked by me in writing.

IN WITNESS WHEREOF, I have signed and executed this General Power of Attorney at {{city}} on this {{executionDate}}, in the presence of the witnesses named below.`,
};

export default template;
