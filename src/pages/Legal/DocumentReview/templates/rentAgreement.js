const template = {
  id: 'rent-agreement-11-month',
  name: '11-Month Rent Agreement',
  category: 'property',
  icon: 'Home',
  estimatedTime: '3 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'Standard 11-month residential rent agreement compliant with Indian rent laws. Covers monthly rent, security deposit, maintenance, and termination terms.',
  tags: ['rent', 'lease', 'landlord', 'tenant', 'house'],
  variables: [
    { key: 'agreementDate', label: 'Agreement Date', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, placeholder: 'e.g. Mumbai', group: 'Basic' },
    { key: 'state', label: 'State', type: 'text', required: true, placeholder: 'e.g. Maharashtra', group: 'Basic' },

    { key: 'landlordName', label: "Landlord's Full Name", type: 'text', required: true, group: 'Landlord' },
    { key: 'landlordFatherName', label: "Landlord's Father's Name", type: 'text', required: true, group: 'Landlord' },
    { key: 'landlordAge', label: "Landlord's Age", type: 'number', required: true, group: 'Landlord' },
    { key: 'landlordAddress', label: "Landlord's Permanent Address", type: 'textarea', required: true, group: 'Landlord' },

    { key: 'tenantName', label: "Tenant's Full Name", type: 'text', required: true, group: 'Tenant' },
    { key: 'tenantFatherName', label: "Tenant's Father's Name", type: 'text', required: true, group: 'Tenant' },
    { key: 'tenantAge', label: "Tenant's Age", type: 'number', required: true, group: 'Tenant' },
    { key: 'tenantPermanentAddress', label: "Tenant's Permanent Address", type: 'textarea', required: true, group: 'Tenant' },
    { key: 'tenantOccupation', label: "Tenant's Occupation", type: 'text', required: true, group: 'Tenant' },

    { key: 'propertyAddress', label: 'Full Property Address (the premises to be rented)', type: 'textarea', required: true, group: 'Property' },
    { key: 'propertyType', label: 'Property Type', type: 'select', required: true, options: ['1 BHK Flat', '2 BHK Flat', '3 BHK Flat', '4+ BHK Flat', 'Independent House', 'Studio Apartment', 'Room'], group: 'Property' },
    { key: 'furnishingStatus', label: 'Furnishing', type: 'select', required: true, options: ['Unfurnished', 'Semi-furnished', 'Fully-furnished'], group: 'Property' },

    { key: 'startDate', label: 'Tenancy Start Date', type: 'date', required: true, group: 'Terms' },
    { key: 'monthlyRent', label: 'Monthly Rent (INR)', type: 'number', required: true, validation: 'currency', group: 'Terms' },
    { key: 'securityDeposit', label: 'Security Deposit (INR)', type: 'number', required: true, validation: 'currency', group: 'Terms' },
    { key: 'rentDueDay', label: 'Day of Month Rent is Due', type: 'number', required: true, placeholder: '5', group: 'Terms' },
    { key: 'noticePeriod', label: 'Notice Period (Months)', type: 'number', required: true, placeholder: '1', group: 'Terms' },
    { key: 'maintenanceParty', label: 'Maintenance/Society Charges to be paid by', type: 'select', required: true, options: ['Landlord', 'Tenant'], group: 'Terms' },
  ],
  signatureBlocks: ['Landlord', 'Tenant', 'Witness 1', 'Witness 2'],
  body: `## RENT AGREEMENT

THIS RENT AGREEMENT is made and executed at {{city}}, {{state}}, on this {{agreementDate}}.

## BETWEEN

{{landlordName}}, S/o {{landlordFatherName}}, aged about {{landlordAge}} years, resident of {{landlordAddress}}, hereinafter referred to as the "LANDLORD" (which expression shall, unless repugnant to the context, include his/her heirs, legal representatives, successors and assigns) of the ONE PART;

## AND

{{tenantName}}, S/o {{tenantFatherName}}, aged about {{tenantAge}} years, by occupation {{tenantOccupation}}, resident of {{tenantPermanentAddress}}, hereinafter referred to as the "TENANT" (which expression shall, unless repugnant to the context, include his/her heirs, legal representatives, successors and assigns) of the OTHER PART.

## WHEREAS

The Landlord is the absolute owner and in lawful possession of the residential premises being {{propertyType}} ({{furnishingStatus}}) situated at {{propertyAddress}} (hereinafter referred to as the "Premises").

AND WHEREAS the Tenant has approached the Landlord with a request to let out the said Premises on rent for residential purposes, and the Landlord has agreed to let out the same to the Tenant on the terms and conditions hereinafter appearing.

## NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

1. TERM: This tenancy shall commence from {{startDate}} and shall remain in force for a period of eleven (11) months from the said date. The same may be renewed for further periods on terms mutually agreed in writing.

2. MONTHLY RENT: The Tenant shall pay to the Landlord a monthly rent of INR {{monthlyRent}} (Rupees ___________________ only) on or before the {{rentDueDay}}th day of every English calendar month, in advance, by cash, cheque or bank transfer.

3. SECURITY DEPOSIT: The Tenant has paid to the Landlord on or before the execution of this Agreement, an interest-free refundable security deposit of INR {{securityDeposit}} (Rupees ___________________ only), the receipt of which the Landlord hereby acknowledges. The said deposit shall be refunded by the Landlord to the Tenant at the time of vacating the Premises, after deducting any arrears of rent, electricity, water charges and the cost of repairs of any damage caused by the Tenant beyond normal wear and tear.

4. UTILITIES: The Tenant shall pay all charges for electricity, water, telephone, internet, gas and other utilities consumed in the Premises during the tenancy period, directly to the concerned authorities and shall produce receipts when called upon to do so.

5. MAINTENANCE: The monthly society/maintenance charges shall be borne and paid by the {{maintenanceParty}}.

6. USE OF PREMISES: The Tenant shall use the Premises exclusively for residential purposes and shall not carry on any unlawful, immoral, hazardous or commercial activity therein. The Tenant shall not sub-let, assign or part with the possession of the Premises or any part thereof to any third party without the prior written consent of the Landlord.

7. ALTERATIONS: The Tenant shall not make any structural alterations or additions to the Premises without the prior written consent of the Landlord. The Tenant shall keep the Premises and the fixtures and fittings in good and tenantable condition (reasonable wear and tear excepted).

8. INSPECTION: The Landlord or his/her authorised representative shall be entitled to enter and inspect the Premises at all reasonable times after giving prior notice to the Tenant.

9. TERMINATION: This Agreement may be terminated by either party by giving {{noticePeriod}} month(s) prior written notice to the other party. On termination, the Tenant shall hand over peaceful, vacant and clean possession of the Premises to the Landlord.

10. DEFAULT: If the Tenant fails to pay rent for two consecutive months, or commits any breach of the terms of this Agreement, the Landlord shall be entitled to terminate this Agreement forthwith and re-enter the Premises after giving fifteen (15) days written notice.

11. GOVERNING LAW & JURISDICTION: This Agreement shall be governed by the laws of India. Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts at {{city}}.

12. STAMP DUTY & REGISTRATION: The stamp duty and registration charges, if any, shall be borne equally by both parties unless otherwise agreed.

IN WITNESS WHEREOF, the parties have set their respective hands on the day, month and year first above written, in the presence of the witnesses whose names appear below.`,
};

export default template;
