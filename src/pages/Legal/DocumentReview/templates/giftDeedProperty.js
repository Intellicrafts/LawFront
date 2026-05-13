const template = {
  id: 'gift-deed-property',
  name: 'Gift Deed of Immovable Property',
  category: 'property',
  icon: 'Gift',
  estimatedTime: '4 min',
  premium: false,
  jurisdiction: 'India',
  description:
    'A gift deed to voluntarily transfer ownership of immovable property without consideration to a family member or any other person. Stamp duty applicable as per State law.',
  tags: ['gift', 'deed', 'property', 'family'],
  variables: [
    { key: 'deedDate', label: 'Date of Deed', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, group: 'Basic' },

    { key: 'donorName', label: "Donor's Full Name", type: 'text', required: true, group: 'Donor' },
    { key: 'donorFatherName', label: "Donor's Father's Name", type: 'text', required: true, group: 'Donor' },
    { key: 'donorAge', label: "Donor's Age", type: 'number', required: true, group: 'Donor' },
    { key: 'donorAddress', label: "Donor's Address", type: 'textarea', required: true, group: 'Donor' },

    { key: 'doneeName', label: "Donee's Full Name", type: 'text', required: true, group: 'Donee' },
    { key: 'doneeFatherName', label: "Donee's Father's Name", type: 'text', required: true, group: 'Donee' },
    { key: 'doneeAge', label: "Donee's Age", type: 'number', required: true, group: 'Donee' },
    { key: 'doneeAddress', label: "Donee's Address", type: 'textarea', required: true, group: 'Donee' },
    { key: 'relationship', label: 'Relationship between Donor and Donee', type: 'text', required: true, placeholder: 'e.g. Son, Daughter, Spouse, Brother', group: 'Donee' },

    { key: 'propertyDescription', label: 'Property Description with Boundaries', type: 'textarea', required: true, group: 'Property' },
    { key: 'propertyValue', label: 'Market Value of Property (INR)', type: 'number', required: true, validation: 'currency', group: 'Property' },
    { key: 'reason', label: 'Reason for Gift (one line)', type: 'text', required: true, placeholder: 'e.g. natural love and affection', group: 'Property' },
  ],
  signatureBlocks: ['Donor', 'Donee (Acceptance)', 'Witness 1', 'Witness 2'],
  body: `## GIFT DEED

THIS DEED OF GIFT is made and executed at {{city}} on this {{deedDate}}.

## BETWEEN

{{donorName}}, S/o, D/o, W/o {{donorFatherName}}, aged about {{donorAge}} years, resident of {{donorAddress}}, hereinafter referred to as the "DONOR";

## AND

{{doneeName}}, S/o, D/o, W/o {{doneeFatherName}}, aged about {{doneeAge}} years, resident of {{doneeAddress}}, who is the {{relationship}} of the Donor, hereinafter referred to as the "DONEE".

## WHEREAS

A. The Donor is the absolute owner of the property more particularly described in the Schedule below ("Scheduled Property"), having acquired the same by way of [self-acquisition / inheritance / earlier purchase] and is in lawful possession and enjoyment thereof.

B. Out of {{reason}} for the Donee, the Donor desires to gift the Scheduled Property to the Donee, and the Donee has gracefully accepted the said gift.

## NOW THIS DEED WITNESSETH AS FOLLOWS:

1. GIFT: The Donor, out of natural love and affection for the Donee and without any monetary consideration whatsoever, does hereby grant, gift, convey, transfer and assign the Scheduled Property unto the Donee, absolutely and forever, together with all rights, title, interest, easements, privileges and appurtenances thereto, to hold the same as his/her exclusive property.

2. ACCEPTANCE: The Donee hereby gratefully accepts the said gift made by the Donor.

3. POSSESSION: The Donor has, on the execution of this Deed, delivered vacant, peaceful and physical possession of the Scheduled Property to the Donee along with all original title deeds and relevant papers.

4. WARRANTIES: The Donor hereby warrants and covenants that: (a) the Donor is the sole, absolute and rightful owner of the Scheduled Property; (b) the Scheduled Property is free from all encumbrances, charges, liens, mortgages, attachments and claims of third parties; (c) there is no impediment of any kind to the Donor making the gift hereunder; and (d) the Donor shall indemnify the Donee against any defect in title.

5. IRREVOCABILITY: The gift hereby made is absolute, unconditional and irrevocable. The Donor confirms that this gift has been made voluntarily, out of free will, without any coercion, force, fraud or undue influence, and after full understanding of its nature and effect.

6. STAMP DUTY: The stamp duty and registration charges payable on this Gift Deed shall be borne by the Donee.

7. MARKET VALUE: For the purposes of stamp duty, the market value of the Scheduled Property is declared as INR {{propertyValue}}/-.

8. GOVERNING LAW: This Gift Deed shall be governed by the laws of India and the courts at {{city}} shall have exclusive jurisdiction.

## SCHEDULE OF PROPERTY

{{propertyDescription}}

IN WITNESS WHEREOF, the Donor and the Donee have set their respective hands to this Deed of Gift at {{city}} on the day, month and year first above written, in the presence of the witnesses named below.`,
};

export default template;
