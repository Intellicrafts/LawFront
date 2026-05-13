const template = {
  id: 'partnership-deed',
  name: 'Partnership Deed',
  category: 'business',
  icon: 'Briefcase',
  estimatedTime: '5 min',
  premium: true,
  jurisdiction: 'India',
  description:
    'A deed of partnership between two or more partners to carry on a business under the Indian Partnership Act, 1932. Suitable for registering a partnership firm.',
  tags: ['partnership', 'firm', 'business', 'deed'],
  variables: [
    { key: 'deedDate', label: 'Date of Deed', type: 'date', required: true, group: 'Basic' },
    { key: 'city', label: 'City of Execution', type: 'text', required: true, group: 'Basic' },
    { key: 'firmName', label: 'Name of the Partnership Firm', type: 'text', required: true, group: 'Basic' },
    { key: 'firmAddress', label: 'Registered Office Address', type: 'textarea', required: true, group: 'Basic' },
    { key: 'businessNature', label: 'Nature of Business', type: 'textarea', required: true, placeholder: 'e.g. trading in textiles, providing IT consulting services, manufacturing', group: 'Basic' },

    { key: 'partnersList', label: 'Partners (one per line: Name | Father | Age | Address | Capital INR | Profit %)', type: 'textarea', required: true, placeholder: 'Rajesh Kumar | Shyam Kumar | 42 | Mumbai | 5,00,000 | 50\nPriya Sharma | Ram Sharma | 38 | Mumbai | 5,00,000 | 50', group: 'Partners' },

    { key: 'commencementDate', label: 'Date of Commencement of Business', type: 'date', required: true, group: 'Terms' },
    { key: 'durationType', label: 'Duration', type: 'select', required: true, options: ['At Will', 'Fixed Term'], group: 'Terms' },
    { key: 'totalCapital', label: 'Total Capital of the Firm (INR)', type: 'number', required: true, validation: 'currency', group: 'Terms' },
    { key: 'bankName', label: 'Bank where Firm Account will be opened', type: 'text', required: true, group: 'Terms' },
    { key: 'accountingYear', label: 'Accounting Year', type: 'text', required: true, placeholder: '1st April to 31st March', group: 'Terms' },
  ],
  signatureBlocks: ['Partner 1', 'Partner 2', 'Partner 3 (if any)', 'Witness 1', 'Witness 2'],
  body: `## DEED OF PARTNERSHIP

THIS DEED OF PARTNERSHIP is made and executed at {{city}} on this {{deedDate}}.

BY AND BETWEEN the following persons, hereinafter collectively referred to as the "Partners" and individually as a "Partner":

{{partnersList}}

## WHEREAS

The Partners have mutually agreed to commence a partnership business and to carry on the same in accordance with the terms and conditions hereinafter set forth, and have requested that the terms of their partnership be reduced to writing for the avoidance of doubt and disputes.

## NOW THIS DEED WITNESSETH AS FOLLOWS:

## 1. NAME AND PLACE OF BUSINESS

The Partnership shall be carried on under the name and style of "{{firmName}}" (hereinafter referred to as the "Firm"). The registered office of the Firm shall be situated at {{firmAddress}}, or at such other place or places as the Partners may mutually decide.

## 2. NATURE OF BUSINESS

The business of the Firm shall be {{businessNature}}, and such other business or businesses as the Partners may unanimously decide to undertake from time to time.

## 3. COMMENCEMENT AND DURATION

The Partnership shall be deemed to have commenced on {{commencementDate}} and shall be {{durationType}}, unless dissolved earlier in accordance with the provisions of this Deed or the Indian Partnership Act, 1932.

## 4. CAPITAL CONTRIBUTION

The total capital of the Firm shall be INR {{totalCapital}}/-, contributed by the Partners in the ratio set out above. The Partners may, by mutual consent in writing, increase or decrease the capital from time to time. No interest shall be payable on the capital unless otherwise agreed in writing.

## 5. PROFIT AND LOSS SHARING

The net profits and losses of the Firm, after deducting all expenses, taxes, interest (if any) and remuneration, shall be divided among the Partners in the ratio set out above.

## 6. BANK ACCOUNT

A bank account shall be opened in the name of the Firm with {{bankName}}, and the same shall be operated by such Partner or Partners, jointly or severally, as the Partners may mutually decide and authorise.

## 7. ACCOUNTS

The Firm shall maintain proper books of account on a mercantile basis at its registered office, which shall be open for inspection by any Partner at all reasonable times. The accounting year of the Firm shall be {{accountingYear}}. At the close of each accounting year, a balance sheet and profit and loss account shall be prepared and signed by all Partners.

## 8. MANAGEMENT

The Partners shall be entitled to take part in the conduct of the business of the Firm. All decisions on day-to-day operational matters shall be taken by mutual consent. However, the following acts shall require the unanimous written consent of all Partners: (a) admission of a new partner; (b) borrowing money or giving guarantees in the name of the Firm; (c) sale, mortgage or charge of any immovable property of the Firm; (d) compromise or release of any debt; (e) acknowledgment of any claim against the Firm; (f) commencement or settlement of any litigation by or against the Firm.

## 9. DUTIES OF PARTNERS

Every Partner shall: (a) carry on the business of the Firm to the greatest common advantage; (b) be just and faithful to the other Partners; (c) render true accounts and full information of all things affecting the Firm; (d) not carry on any business of the same nature competing with that of the Firm; and (e) not assign his/her interest in the Firm without the prior written consent of the other Partners.

## 10. RETIREMENT AND DEATH

Any Partner may retire from the Firm by giving not less than three (3) months' prior written notice to the other Partners. In the event of the death of any Partner, the Partnership shall not be dissolved, and the surviving Partners shall continue the business of the Firm. The legal heirs of the deceased Partner shall be entitled to receive the credit balance of the deceased Partner's capital and profits up to the date of death.

## 11. DISSOLUTION

The Firm may be dissolved by the unanimous consent of all Partners in writing. Upon dissolution, the assets of the Firm shall be applied first in payment of debts and liabilities of the Firm, then in repayment of capital contributions, and the balance, if any, shall be distributed among the Partners in their profit-sharing ratio.

## 12. ARBITRATION

Any dispute, difference or question arising between the Partners with respect to this Deed or the business of the Firm shall be referred to arbitration by a sole arbitrator to be appointed by mutual consent, in accordance with the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be {{city}}.

## 13. GOVERNING LAW

This Deed shall be governed by the laws of India, including the Indian Partnership Act, 1932, as applicable.

IN WITNESS WHEREOF, the Partners have set their hands to this Deed of Partnership at {{city}} on the day, month and year first above written, in the presence of the witnesses named below.`,
};

export default template;
