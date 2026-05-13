const template = {
  id: 'sale-deed',
  name: 'Sale Deed of Immovable Property',
  category: 'property',
  icon: 'Home',
  estimatedTime: '5 min',
  premium: true,
  jurisdiction: 'India',
  description:
    'A sale deed to legally transfer ownership of immovable property from seller to buyer. Required to be stamped and registered as per the Registration Act, 1908.',
  tags: ['sale', 'deed', 'property', 'registration'],
  variables: [
    { key: 'deedDate', label: 'Date of Deed', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City of Execution', type: 'text', required: true, group: 'Basic' },
    { key: 'state', label: 'State', type: 'text', required: true, group: 'Basic' },

    { key: 'sellerName', label: "Seller's Full Name", type: 'text', required: true, group: 'Seller' },
    { key: 'sellerFatherName', label: "Seller's Father's Name", type: 'text', required: true, group: 'Seller' },
    { key: 'sellerAge', label: "Seller's Age", type: 'number', required: true, group: 'Seller' },
    { key: 'sellerAddress', label: "Seller's Address", type: 'textarea', required: true, group: 'Seller' },
    { key: 'sellerPAN', label: "Seller's PAN", type: 'text', required: true, validation: 'pan', group: 'Seller' },

    { key: 'buyerName', label: "Buyer's Full Name", type: 'text', required: true, group: 'Buyer' },
    { key: 'buyerFatherName', label: "Buyer's Father's Name", type: 'text', required: true, group: 'Buyer' },
    { key: 'buyerAge', label: "Buyer's Age", type: 'number', required: true, group: 'Buyer' },
    { key: 'buyerAddress', label: "Buyer's Address", type: 'textarea', required: true, group: 'Buyer' },
    { key: 'buyerPAN', label: "Buyer's PAN", type: 'text', required: true, validation: 'pan', group: 'Buyer' },

    { key: 'propertyDescription', label: 'Full Property Description (with boundaries)', type: 'textarea', required: true, placeholder: 'Flat No. 401, 4th Floor, Sunshine Apartments, Plot No. 25, Andheri West, Mumbai — 400058, admeasuring 750 sq.ft. carpet area. Bounded by: North — Plot 24; South — Plot 26; East — Main Road; West — Open Land.', group: 'Property' },
    { key: 'propertyArea', label: 'Property Area (Carpet sq.ft.)', type: 'number', required: true, group: 'Property' },

    { key: 'salePrice', label: 'Total Sale Consideration (INR)', type: 'number', required: true, validation: 'currency', group: 'Consideration' },
    { key: 'paymentMode', label: 'Mode of Payment', type: 'select', required: true, options: ['RTGS / NEFT', 'Cheque', 'Demand Draft', 'Mix of above'], group: 'Consideration' },
    { key: 'paymentDetails', label: 'Payment Details (UTR / Cheque No. & Date)', type: 'textarea', required: true, group: 'Consideration' },
  ],
  signatureBlocks: ['Seller (Vendor)', 'Buyer (Vendee)', 'Witness 1', 'Witness 2'],
  body: `## SALE DEED

THIS DEED OF SALE is made and executed at {{city}}, {{state}}, on this {{deedDate}}.

## BETWEEN

{{sellerName}}, S/o, D/o, W/o {{sellerFatherName}}, aged about {{sellerAge}} years, holding PAN {{sellerPAN}}, resident of {{sellerAddress}} (hereinafter referred to as the "SELLER", which expression shall, unless repugnant to the context, include his/her heirs, legal representatives, successors and assigns) of the ONE PART;

## AND

{{buyerName}}, S/o, D/o, W/o {{buyerFatherName}}, aged about {{buyerAge}} years, holding PAN {{buyerPAN}}, resident of {{buyerAddress}} (hereinafter referred to as the "BUYER", which expression shall, unless repugnant to the context, include his/her heirs, legal representatives, successors and assigns) of the OTHER PART.

## WHEREAS

A. The Seller is the absolute, lawful and rightful owner, in peaceful and exclusive possession of the immovable property more particularly described in the Schedule hereunder (hereinafter referred to as the "Scheduled Property"), having acquired the same by way of [prior title deed / inheritance / allotment], free from all encumbrances, mortgages, charges, liens, attachments, lis pendens, claims and demands of any nature whatsoever.

B. The Seller has agreed to sell and the Buyer has agreed to purchase the Scheduled Property for a total sale consideration of INR {{salePrice}}/- (Rupees ___________________ only), on the terms and conditions hereinafter mentioned.

## NOW THIS DEED OF SALE WITNESSETH AS FOLLOWS:

1. CONSIDERATION: In consideration of the sum of INR {{salePrice}}/- (Rupees ___________________ only), paid by the Buyer to the Seller by way of {{paymentMode}} ({{paymentDetails}}), the receipt of which the Seller hereby admits, acknowledges and acquits the Buyer therefrom, the Seller does hereby sell, transfer, convey, assign and assure unto the Buyer, absolutely and forever, the Scheduled Property together with all rights, title and interest of the Seller therein.

2. POSSESSION: The Seller has, on the execution of this Sale Deed, delivered to the Buyer vacant, peaceful and physical possession of the Scheduled Property, along with all original title documents, parent deeds, encumbrance certificates, tax receipts and other relevant papers.

3. COVENANTS BY SELLER: The Seller hereby covenants with the Buyer that: (a) the Seller is the sole and absolute owner of the Scheduled Property and has full right, power, and absolute authority to sell and convey the same; (b) the Scheduled Property is free from all encumbrances, charges, liens, mortgages, attachments and prior agreements of sale; (c) there is no pending litigation, suit, claim or demand affecting the Scheduled Property; (d) all municipal taxes, society dues, electricity and water charges have been paid up to the date of this Deed; and (e) the Seller shall indemnify and keep the Buyer indemnified against any loss, damage, claim or demand arising on account of any defect in title.

4. INDEMNITY: The Seller hereby agrees to execute, at his/her cost, all such further documents, deeds and assurances as may be reasonably required by the Buyer to perfect the Buyer's title to the Scheduled Property.

5. STAMP DUTY & REGISTRATION: The stamp duty, registration charges and all other expenses incidental to the execution and registration of this Sale Deed shall be borne and paid exclusively by the Buyer.

6. GOVERNING LAW: This Deed shall be governed by the laws of India. Any dispute arising hereunder shall be subject to the exclusive jurisdiction of the courts at {{city}}.

## SCHEDULE OF PROPERTY

{{propertyDescription}}

Total Area (Carpet): {{propertyArea}} sq.ft.

IN WITNESS WHEREOF, the parties hereto have set their respective hands to this Sale Deed at {{city}} on the day, month and year first above written, in the presence of the witnesses named below.`,
};

export default template;
