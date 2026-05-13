const template = {
  id: 'noc-tenant',
  name: 'No Objection Certificate (Landlord to Tenant)',
  category: 'property',
  icon: 'FileCheck',
  estimatedTime: '1 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A No Objection Certificate from a landlord confirming the tenant resides at the said premises. Useful for address proof, passport, visa, bank and government applications.',
  tags: ['noc', 'landlord', 'address proof', 'tenant'],
  variables: [
    { key: 'nocDate', label: 'Date', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, group: 'Basic' },

    { key: 'landlordName', label: "Landlord's Full Name", type: 'text', required: true, group: 'Landlord' },
    { key: 'landlordFatherName', label: "Landlord's Father's Name", type: 'text', required: true, group: 'Landlord' },
    { key: 'landlordAddress', label: "Landlord's Address", type: 'textarea', required: true, group: 'Landlord' },
    { key: 'landlordPhone', label: "Landlord's Phone Number", type: 'text', required: true, validation: 'phone', group: 'Landlord' },

    { key: 'tenantName', label: "Tenant's Full Name", type: 'text', required: true, group: 'Tenant' },
    { key: 'tenantFatherName', label: "Tenant's Father's Name", type: 'text', required: true, group: 'Tenant' },

    { key: 'propertyAddress', label: 'Property Address (where tenant resides)', type: 'textarea', required: true, group: 'Property' },
    { key: 'tenancyStartDate', label: 'Tenant residing since', type: 'date', required: true, group: 'Property' },
    { key: 'purpose', label: 'Purpose of NOC', type: 'select', required: true, options: ['Passport Application', 'Visa Application', 'Bank Account Opening', 'Government / KYC Document', 'Other'], group: 'Property' },
  ],
  signatureBlocks: ['Landlord'],
  body: `## NO OBJECTION CERTIFICATE

Date: {{nocDate}}
Place: {{city}}

To Whom It May Concern,

This is to certify that I, {{landlordName}}, S/o, D/o, W/o {{landlordFatherName}}, resident of {{landlordAddress}}, am the lawful owner of the immovable property located at:

{{propertyAddress}}

I hereby state and confirm that {{tenantName}}, S/o, D/o, W/o {{tenantFatherName}}, is residing in the above-mentioned property as my tenant since {{tenancyStartDate}}, under a duly executed Rent Agreement, and is in continuous and peaceful occupation thereof.

I have NO OBJECTION whatsoever to the said tenant using the above-mentioned address as his/her current residential address for the purpose of {{purpose}}, and for any other lawful purposes including but not limited to applications to government authorities, banks, telecom service providers, and other agencies.

This certificate is being issued at the specific request of the tenant for whatever purpose it may serve, without any pressure or undue influence on me.

I further confirm that the information stated above is true and correct to the best of my knowledge and belief.

For any verification, I may be contacted at: {{landlordPhone}}.

Yours sincerely,

{{landlordName}}
(Landlord / Owner)`,
};

export default template;
