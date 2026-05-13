const template = {
  id: 'adoption-deed',
  name: 'Deed of Adoption (Hindu)',
  category: 'family',
  icon: 'Heart',
  estimatedTime: '4 min',
  premium: true,
  jurisdiction: 'India',
  description:
    'A deed of adoption under the Hindu Adoptions and Maintenance Act, 1956, recording the giving and taking of a child in adoption.',
  tags: ['adoption', 'family', 'hindu adoption act'],
  variables: [
    { key: 'deedDate', label: 'Date of Deed', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City', type: 'text', required: true, group: 'Basic' },

    { key: 'giverName', label: "Natural Parent's (Giver) Full Name", type: 'text', required: true, group: 'Giver' },
    { key: 'giverFatherName', label: "Giver's Father's Name", type: 'text', required: true, group: 'Giver' },
    { key: 'giverAddress', label: "Giver's Address", type: 'textarea', required: true, group: 'Giver' },
    { key: 'giverAge', label: "Giver's Age", type: 'number', required: true, group: 'Giver' },

    { key: 'takerName', label: "Adoptive Parent's (Taker) Full Name", type: 'text', required: true, group: 'Taker' },
    { key: 'takerFatherName', label: "Taker's Father's Name", type: 'text', required: true, group: 'Taker' },
    { key: 'takerAddress', label: "Taker's Address", type: 'textarea', required: true, group: 'Taker' },
    { key: 'takerAge', label: "Taker's Age", type: 'number', required: true, group: 'Taker' },
    { key: 'takerSpouseName', label: "Taker's Spouse Name (if married)", type: 'text', required: false, group: 'Taker' },

    { key: 'childName', label: "Child's Full Name", type: 'text', required: true, group: 'Child' },
    { key: 'childGender', label: "Child's Gender", type: 'select', required: true, options: ['Male', 'Female'], group: 'Child' },
    { key: 'childDOB', label: "Child's Date of Birth", type: 'date', required: true, group: 'Child' },
    { key: 'childPlaceOfBirth', label: "Child's Place of Birth", type: 'text', required: true, group: 'Child' },

    { key: 'adoptionCeremonyDate', label: 'Date of Adoption Ceremony (Datta Homam)', type: 'date', required: true, group: 'Ceremony' },
    { key: 'ceremonyVenue', label: 'Place of Ceremony', type: 'text', required: true, group: 'Ceremony' },
  ],
  signatureBlocks: ['Natural Parent (Giver)', 'Adoptive Parent (Taker)', "Adoptive Parent's Spouse", 'Witness 1', 'Witness 2'],
  body: `## DEED OF ADOPTION

THIS DEED OF ADOPTION is made and executed at {{city}} on this {{deedDate}}.

## BETWEEN

{{giverName}}, S/o {{giverFatherName}}, aged about {{giverAge}} years, resident of {{giverAddress}}, hereinafter referred to as the "GIVER", being the natural parent/guardian of the child described below;

## AND

{{takerName}}, S/o {{takerFatherName}}, aged about {{takerAge}} years, resident of {{takerAddress}}{{#if takerSpouseName}}, along with his/her spouse {{takerSpouseName}}{{/if}}, hereinafter referred to as the "TAKER", being the prospective adoptive parent(s).

## WHEREAS

A. The Giver is the natural father/mother/guardian of a {{childGender}} child named {{childName}}, born on {{childDOB}} at {{childPlaceOfBirth}} (hereinafter the "Child").

B. The Taker, being a Hindu, of sound mind and possessing the capacity to take a child in adoption under Section 7/8 of the Hindu Adoptions and Maintenance Act, 1956, has expressed a desire to adopt the Child.

C. The Giver has the capacity to give the Child in adoption under Section 9 of the Hindu Adoptions and Maintenance Act, 1956, and after due deliberation and reflection, has agreed to give the Child in adoption to the Taker.

D. The Child, being below the age of fifteen (15) years and unmarried, is capable of being taken in adoption under Section 10 of the Hindu Adoptions and Maintenance Act, 1956.

E. The actual ceremony of giving and taking the Child in adoption, namely "Datta Homam" / the ceremony of physical handing over of the Child, was duly performed on {{adoptionCeremonyDate}} at {{ceremonyVenue}}, in the presence of family members and witnesses.

## NOW THIS DEED WITNESSETH AS FOLLOWS:

1. ADOPTION: The Giver hereby gives and the Taker hereby takes the Child, namely {{childName}}, in adoption, with effect from {{adoptionCeremonyDate}}.

2. STATUS OF CHILD: From the date of adoption, the Child shall, for all intents and purposes, be deemed to be the natural child of the Taker, with the same rights, privileges and obligations as if the Child had been born to the Taker, and the Child shall cease to have any tie or relationship of any kind with the Giver, his/her family or natural relatives, as provided under Section 12 of the Hindu Adoptions and Maintenance Act, 1956.

3. RIGHTS OF INHERITANCE: The Child shall be entitled to inherit, succeed and take a share in the property of the Taker as a natural child of the Taker, in accordance with the personal law applicable to the Taker.

4. RENUNCIATION: The Giver hereby renounces all parental rights, duties, obligations and authority over the Child, and shall have no claim of any nature whatsoever over the Child or his/her future earnings, property or person.

5. UPBRINGING: The Taker undertakes to bring up, maintain, educate and care for the Child as his/her own natural child and to provide for the Child's physical, emotional, educational and spiritual well-being.

6. CONFIRMATION: The parties confirm that this adoption has been made voluntarily, with full understanding, free will and consent of both parties, in accordance with all applicable laws, and not in violation of any provision of the Hindu Adoptions and Maintenance Act, 1956.

7. REGISTRATION: The parties shall, as soon as practicable, register this Deed of Adoption with the Sub-Registrar having jurisdiction.

IN WITNESS WHEREOF, the parties have set their respective hands to this Deed of Adoption at {{city}} on the day, month and year first above written, in the presence of the witnesses named below.`,
};

export default template;
