/**
 * Master template registry. Each template is a default export from its own file
 * under `../templates/` and conforms to the same schema:
 *
 *  { id, name, category, icon, estimatedTime, premium, jurisdiction, description,
 *    tags, variables[], body, signatureBlocks[] }
 *
 * The `icon` field is a lucide-react icon NAME, resolved by the consumer.
 */

import rentAgreement from '../templates/rentAgreement';
import saleDeed from '../templates/saleDeed';
import giftDeedProperty from '../templates/giftDeedProperty';
import nocTenant from '../templates/nocTenant';

import ndaMutual from '../templates/ndaMutual';
import serviceAgreement from '../templates/serviceAgreement';
import mou from '../templates/mou';
import partnershipDeed from '../templates/partnershipDeed';
import foundersAgreement from '../templates/foundersAgreement';

import offerLetter from '../templates/offerLetter';
import employmentContract from '../templates/employmentContract';
import internshipAgreement from '../templates/internshipAgreement';
import experienceLetter from '../templates/experienceLetter';
import resignationAcceptance from '../templates/resignationAcceptance';

import affidavitNameChange from '../templates/affidavitNameChange';
import affidavitDOB from '../templates/affidavitDOB';
import affidavitAddressProof from '../templates/affidavitAddressProof';
import affidavitIncome from '../templates/affidavitIncome';
import affidavitSelfDeclaration from '../templates/affidavitSelfDeclaration';

import poaGeneral from '../templates/poaGeneral';
import poaSpecialProperty from '../templates/poaSpecialProperty';
import poaMedical from '../templates/poaMedical';

import willTestament from '../templates/willTestament';
import mutualDivorcePetition from '../templates/mutualDivorcePetition';
import adoptionDeed from '../templates/adoptionDeed';

import legalNoticeChequeBounce from '../templates/legalNoticeChequeBounce';
import evictionNotice from '../templates/evictionNotice';
import demandNoticeRecovery from '../templates/demandNoticeRecovery';

import promissoryNote from '../templates/promissoryNote';
import indemnityBond from '../templates/indemnityBond';

export const TEMPLATES = [
  rentAgreement,
  saleDeed,
  giftDeedProperty,
  nocTenant,

  ndaMutual,
  serviceAgreement,
  mou,
  partnershipDeed,
  foundersAgreement,

  offerLetter,
  employmentContract,
  internshipAgreement,
  experienceLetter,
  resignationAcceptance,

  affidavitNameChange,
  affidavitDOB,
  affidavitAddressProof,
  affidavitIncome,
  affidavitSelfDeclaration,

  poaGeneral,
  poaSpecialProperty,
  poaMedical,

  willTestament,
  mutualDivorcePetition,
  adoptionDeed,

  legalNoticeChequeBounce,
  evictionNotice,
  demandNoticeRecovery,

  promissoryNote,
  indemnityBond,
];

export const getTemplateById = (id) => TEMPLATES.find((t) => t.id === id) || null;

export const getTemplatesByCategory = (categoryId) =>
  TEMPLATES.filter((t) => t.category === categoryId);

export const countByCategory = (categoryId) =>
  TEMPLATES.filter((t) => t.category === categoryId).length;

export const searchTemplates = (query) => {
  if (!query || !query.trim()) return TEMPLATES;
  const q = query.toLowerCase().trim();
  return TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.tags || []).some((tag) => tag.toLowerCase().includes(q))
  );
};

export default TEMPLATES;
