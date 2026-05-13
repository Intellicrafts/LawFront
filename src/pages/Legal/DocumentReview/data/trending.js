/**
 * Curated list of the 8 most-requested legal templates for Indian users.
 * Order is intentional — most-used at the top.
 */

import { TEMPLATES, getTemplateById } from './templates';

export const TRENDING_IDS = [
  'rent-agreement-11-month',
  'nda-mutual',
  'affidavit-name-change',
  'offer-letter',
  'legal-notice-cheque-bounce',
  'poa-general',
  'will-testament',
  'partnership-deed',
];

export const TRENDING_TEMPLATES = TRENDING_IDS.map(getTemplateById).filter(Boolean);

/** A short headline used on the trending card to nudge usage. */
export const TRENDING_BADGES = {
  'rent-agreement-11-month': 'Most Used',
  'nda-mutual': 'Startup Favourite',
  'affidavit-name-change': 'Quick & Easy',
  'offer-letter': 'HR Essential',
  'legal-notice-cheque-bounce': 'Time-Critical',
  'poa-general': 'High Demand',
  'will-testament': 'Plan Ahead',
  'partnership-deed': 'Business Starter',
};

export default TRENDING_TEMPLATES;

// Sanity check — this should equal TEMPLATES.length when uncommented for dev.
export const TOTAL_TEMPLATES = TEMPLATES.length;
