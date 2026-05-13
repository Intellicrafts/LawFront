const template = {
  id: 'will-testament',
  name: 'Last Will & Testament',
  category: 'family',
  icon: 'Heart',
  estimatedTime: '5 min',
  premium: true,
  jurisdiction: 'India',
  description:
    'A legally binding Will to distribute your assets among heirs after your lifetime. Simple, unregistered Will valid under the Indian Succession Act, 1925.',
  tags: ['will', 'testament', 'inheritance', 'estate'],
  variables: [
    { key: 'willDate', label: 'Date of Will', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City of Execution', type: 'text', required: true, group: 'Basic' },

    { key: 'testatorName', label: 'Your (Testator) Full Name', type: 'text', required: true, group: 'Testator' },
    { key: 'testatorFatherName', label: "Father's / Husband's Name", type: 'text', required: true, group: 'Testator' },
    { key: 'testatorAge', label: 'Your Age', type: 'number', required: true, group: 'Testator' },
    { key: 'testatorAddress', label: 'Your Full Address', type: 'textarea', required: true, group: 'Testator' },
    { key: 'testatorReligion', label: 'Your Religion', type: 'text', required: true, group: 'Testator' },
    { key: 'testatorOccupation', label: 'Your Occupation', type: 'text', required: true, group: 'Testator' },

    { key: 'executorName', label: "Executor's Full Name", type: 'text', required: true, group: 'Executor' },
    { key: 'executorRelation', label: 'Relationship with Executor', type: 'text', required: true, group: 'Executor' },
    { key: 'executorAddress', label: "Executor's Address", type: 'textarea', required: true, group: 'Executor' },

    { key: 'beneficiariesAndAssets', label: 'List of Beneficiaries and Assets (free-form, one per line)', type: 'textarea', required: true, placeholder: 'e.g.\nFlat No. 401, Sunshine Apartments, Andheri West, Mumbai — to my wife Mrs. Sunita Sharma.\nFixed Deposit of INR 10,00,000 with HDFC Bank Andheri — to my son Master Rohan Sharma.\nAll jewellery and ornaments — to my daughter Ms. Priya Sharma equally.', group: 'Bequests' },
  ],
  signatureBlocks: ['Testator', 'Witness 1', 'Witness 2'],
  body: `## LAST WILL AND TESTAMENT

THIS LAST WILL AND TESTAMENT is made and executed at {{city}} on this {{willDate}}.

I, {{testatorName}}, S/o, D/o, W/o {{testatorFatherName}}, aged about {{testatorAge}} years, by religion {{testatorReligion}}, by occupation {{testatorOccupation}}, resident of {{testatorAddress}} (hereinafter referred to as the "Testator"), being in sound mind and good health, of my own free will, without any coercion, force, fraud, undue influence or pressure from any person whatsoever, do hereby revoke all my earlier Wills, codicils and testamentary dispositions, if any, made by me at any time heretofore, and declare this to be my Last Will and Testament.

## 1. DECLARATION

I declare that I am a citizen of India and a permanent resident of {{city}}. I am executing this Will after due deliberation and with full understanding of its contents, and the dispositions made herein represent my true and final intent regarding the distribution of my estate after my lifetime.

## 2. APPOINTMENT OF EXECUTOR

I hereby appoint {{executorName}}, my {{executorRelation}}, resident of {{executorAddress}}, to be the sole Executor of this my Last Will and Testament. The Executor shall not be required to furnish any security or surety for the due performance of his/her duties as Executor.

## 3. BEQUESTS

Subject to the payment of my just debts, funeral expenses, and all liabilities (if any) outstanding at the time of my death, I give, devise and bequeath all my movable and immovable properties, of whatsoever nature and wheresoever situated, including all my bank balances, fixed deposits, shares, securities, mutual funds, insurance policies, gold, silver, jewellery, household effects, vehicles, and any other property in which I may have any right, title or interest at the time of my death (collectively, the "Estate"), in the following manner:

{{beneficiariesAndAssets}}

## 4. RESIDUARY CLAUSE

All the rest, residue and remainder of my Estate, not specifically disposed of by this Will, shall devolve upon and be inherited by my legal heirs in accordance with the personal law applicable to me, in such shares as the law may prescribe.

## 5. DUTIES OF THE EXECUTOR

The Executor shall: (a) take possession of all my Estate; (b) discharge all my just debts, funeral and testamentary expenses; (c) distribute the Estate to the beneficiaries in accordance with this Will; and (d) do all such acts and things as may be necessary to give full effect to this Will.

## 6. SUBSTITUTION

In the event any beneficiary named herein predeceases me, his/her share shall devolve upon his/her lawful heirs in equal shares, unless otherwise specified above.

## 7. NO CHALLENGE

I sincerely hope that all the beneficiaries shall respect my wishes and that no one shall challenge this Will in any manner. Any beneficiary who challenges this Will shall forfeit his/her share, which shall then devolve as if such beneficiary had predeceased me.

IN WITNESS WHEREOF, I, {{testatorName}}, the Testator above-named, have hereunto set and subscribed my hand to this my Last Will and Testament on the day, month and year first above written, in the presence of the witnesses whose names appear below, who, at my request, in my presence and in the presence of each other, have hereunto set and subscribed their names as witnesses.

We, the undersigned witnesses, hereby certify that the above-named Testator signed this Will in our presence and declared the same to be his/her Last Will and Testament, and that we, at his/her request, in his/her presence and in the presence of each other, have signed our names as witnesses hereto, believing the Testator to be of sound mind and memory and acting of his/her own free will.`,
};

export default template;
