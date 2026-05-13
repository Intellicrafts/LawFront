const template = {
  id: 'service-agreement',
  name: 'Service Agreement (Independent Contractor)',
  category: 'business',
  icon: 'FileText',
  estimatedTime: '4 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A professional services agreement between a company and an independent service provider/contractor. Covers scope, fees, IP, confidentiality and termination.',
  tags: ['service', 'contractor', 'freelance', 'consulting'],
  variables: [
    { key: 'agreementDate', label: 'Agreement Date', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City of Execution', type: 'text', required: true, group: 'Basic' },

    { key: 'clientName', label: 'Client / Company Name', type: 'text', required: true, group: 'Client' },
    { key: 'clientAddress', label: 'Client Registered Address', type: 'textarea', required: true, group: 'Client' },
    { key: 'clientSignatory', label: 'Authorised Signatory of Client', type: 'text', required: true, group: 'Client' },

    { key: 'providerName', label: 'Service Provider Name', type: 'text', required: true, group: 'Provider' },
    { key: 'providerAddress', label: 'Service Provider Address', type: 'textarea', required: true, group: 'Provider' },
    { key: 'providerPAN', label: 'Service Provider PAN', type: 'text', required: false, validation: 'pan', group: 'Provider' },

    { key: 'scopeOfWork', label: 'Scope of Services (detailed)', type: 'textarea', required: true, placeholder: 'Description of deliverables, timelines, milestones, formats etc.', group: 'Terms' },
    { key: 'startDate', label: 'Start Date', type: 'date', required: true, group: 'Terms' },
    { key: 'endDate', label: 'End Date', type: 'date', required: true, group: 'Terms' },
    { key: 'totalFee', label: 'Total Fee (INR, exclusive of GST)', type: 'number', required: true, validation: 'currency', group: 'Fee' },
    { key: 'paymentTerms', label: 'Payment Schedule', type: 'textarea', required: true, placeholder: 'e.g. 30% on signing, 40% on milestone-1, 30% on final delivery; net 15 days from invoice', group: 'Fee' },
    { key: 'noticeDays', label: 'Termination Notice (Days)', type: 'number', required: true, placeholder: '15', group: 'Fee' },
  ],
  signatureBlocks: ['For Client', 'Service Provider', 'Witness'],
  body: `## SERVICE AGREEMENT

THIS SERVICE AGREEMENT ("Agreement") is made and executed at {{city}} on {{agreementDate}}.

## BETWEEN

{{clientName}}, having its registered office at {{clientAddress}}, represented herein by {{clientSignatory}} (hereinafter referred to as the "Client") of the ONE PART;

## AND

{{providerName}}, residing/having its office at {{providerAddress}}{{#if providerPAN}}, holding PAN {{providerPAN}}{{/if}} (hereinafter referred to as the "Service Provider") of the OTHER PART.

## RECITALS

The Client wishes to engage the Service Provider to perform certain services and the Service Provider has agreed to provide such services on the terms and conditions hereinafter set out.

## 1. SCOPE OF SERVICES

The Service Provider shall render the following services to the Client (the "Services"):

{{scopeOfWork}}

The Services shall be performed with reasonable skill, care, diligence and in accordance with prevailing professional standards.

## 2. TERM

This Agreement shall commence on {{startDate}} and shall remain in force until {{endDate}}, unless terminated earlier in accordance with this Agreement. The Term may be extended by mutual written agreement.

## 3. FEES AND PAYMENT

In consideration of the Services rendered, the Client shall pay the Service Provider a total fee of INR {{totalFee}}/- (Rupees ___________________ only), exclusive of applicable GST. Payment shall be made as per the following schedule: {{paymentTerms}}. All applicable taxes shall be additional. TDS shall be deducted as per the Income Tax Act, 1961, and a TDS certificate shall be furnished by the Client to the Service Provider.

## 4. INDEPENDENT CONTRACTOR

The Service Provider is an independent contractor and not an employee, agent, partner or joint-venturer of the Client. Nothing in this Agreement shall create an employer-employee relationship. The Service Provider shall be solely responsible for his/her own taxes, statutory contributions and benefits.

## 5. CONFIDENTIALITY

The Service Provider acknowledges that he/she may have access to confidential and proprietary information of the Client. The Service Provider shall maintain strict confidentiality of all such information during and after the Term, and shall not use or disclose the same for any purpose other than the performance of this Agreement.

## 6. INTELLECTUAL PROPERTY

All work product, deliverables, materials, designs, code, drawings and other intellectual property created by the Service Provider in the course of providing the Services (the "Work Product") shall be the sole and exclusive property of the Client upon receipt of full payment of the corresponding fees. The Service Provider hereby assigns to the Client all rights, title and interest in the Work Product.

## 7. WARRANTIES

The Service Provider warrants that: (a) he/she has the necessary skills, expertise and authority to perform the Services; (b) the Services and Work Product shall not infringe any third-party intellectual property rights; and (c) the Services shall comply with all applicable laws.

## 8. TERMINATION

Either party may terminate this Agreement by giving {{noticeDays}} days' prior written notice to the other. The Client may terminate this Agreement immediately for material breach by the Service Provider. Upon termination, the Service Provider shall be paid for Services performed up to the date of termination on a pro-rata basis.

## 9. LIMITATION OF LIABILITY

The aggregate liability of either party under this Agreement shall not exceed the total fees paid or payable under this Agreement. Neither party shall be liable for any indirect, incidental, consequential or punitive damages.

## 10. GOVERNING LAW & DISPUTE RESOLUTION

This Agreement shall be governed by the laws of India. Any dispute shall first be attempted to be resolved by mutual discussion, and failing such resolution, shall be referred to arbitration by a sole arbitrator under the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be {{city}}.

IN WITNESS WHEREOF, the parties have executed this Agreement on the date first above written.`,
};

export default template;
