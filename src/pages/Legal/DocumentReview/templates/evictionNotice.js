const template = {
  id: 'eviction-notice',
  name: 'Eviction Notice to Tenant',
  category: 'notice',
  icon: 'AlertTriangle',
  estimatedTime: '2 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A formal eviction notice from a landlord to a tenant for non-payment of rent, breach of agreement, or expiry of tenancy.',
  tags: ['eviction', 'notice', 'landlord', 'tenant'],
  variables: [
    { key: 'noticeDate', label: 'Date of Notice', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, group: 'Basic' },

    { key: 'landlordName', label: "Landlord's Full Name", type: 'text', required: true, group: 'Landlord' },
    { key: 'landlordAddress', label: "Landlord's Address", type: 'textarea', required: true, group: 'Landlord' },

    { key: 'tenantName', label: "Tenant's Full Name", type: 'text', required: true, group: 'Tenant' },
    { key: 'tenantAddress', label: "Tenant's Current Address", type: 'textarea', required: true, group: 'Tenant' },

    { key: 'propertyAddress', label: 'Property Address (premises)', type: 'textarea', required: true, group: 'Property' },
    { key: 'tenancyStartDate', label: 'Tenancy Start Date', type: 'date', required: true, group: 'Property' },
    { key: 'monthlyRent', label: 'Monthly Rent (INR)', type: 'number', required: true, validation: 'currency', group: 'Property' },

    { key: 'groundForEviction', label: 'Primary Ground for Eviction', type: 'select', required: true, options: ['Non-payment of Rent', 'Expiry of Tenancy Term', 'Subletting without Consent', 'Damage to Property', 'Use for Unlawful Purposes', 'Landlord requires for Personal Use'], group: 'Reason' },
    { key: 'arrearMonths', label: 'Months of Rent in Arrear (if applicable)', type: 'number', required: false, group: 'Reason' },
    { key: 'vacateDays', label: 'Days to Vacate', type: 'number', required: true, placeholder: '30', group: 'Reason' },
  ],
  signatureBlocks: ['Landlord'],
  body: `## LEGAL NOTICE TO VACATE

By Registered Post A.D. and Speed Post

From:
{{landlordName}}
{{landlordAddress}}

Date: {{noticeDate}}

To,
{{tenantName}}
{{tenantAddress}}

Subject: Legal Notice to Vacate the premises situated at {{propertyAddress}}

Sir/Madam,

Through this notice, I, {{landlordName}}, the owner and landlord of the immovable property described as {{propertyAddress}} (hereinafter "the said Premises"), do hereby call upon you, the tenant, to vacate and hand over peaceful, vacant and physical possession of the said Premises, for the reasons set out below:

1. That you are residing/occupying the said Premises as a tenant under a Rent/Lease Agreement, with effect from {{tenancyStartDate}}, on payment of a monthly rent of INR {{monthlyRent}}/-.

2. That you have committed a breach of the terms of the tenancy, in particular, on the ground of {{groundForEviction}}.{{#if arrearMonths}} You have failed to pay the monthly rent for the last {{arrearMonths}} months, despite repeated oral and written requests from me, and the same constitutes a substantial default justifying termination of the tenancy.{{/if}}

3. That the tenancy granted to you is hereby determined and terminated with effect from the expiry of {{vacateDays}} days from the date of receipt of this notice.

4. You are hereby called upon to:
   (a) vacate and hand over peaceful, vacant and physical possession of the said Premises to me on or before the expiry of {{vacateDays}} days from the date of receipt of this notice;
   (b) clear all outstanding dues including rent in arrears, electricity charges, water charges, society/maintenance dues and any damage to the said Premises;
   (c) hand over all keys, access cards and original documents pertaining to the said Premises;
   (d) settle accounts with respect to the security deposit, subject to deductions for damages and dues.

5. That in the event you fail or neglect to vacate the said Premises within the time stipulated herein, I shall be constrained to initiate appropriate legal proceedings for your eviction, recovery of arrears, mesne profits and damages, at your sole risk, cost and consequences.

6. A copy of this notice has been retained in my record for future reference.

This Notice is being served without prejudice to my other rights and remedies under law.

Yours faithfully,

{{landlordName}}
(Landlord / Owner)`,
};

export default template;
