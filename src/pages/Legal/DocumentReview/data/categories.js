/**
 * Legal Document Categories
 *
 * Each category has:
 *  - id          : stable identifier used in templates[].category
 *  - name        : display name
 *  - tagline     : short subtitle shown on cards
 *  - description : longer copy for the category drill-in header
 *  - icon        : lucide-react icon NAME (resolved by consumer to avoid coupling to imports here)
 *  - color       : tailwind hue used for accent gradients
 *  - gradient    : preset background gradient class fragment
 *  - sort        : display order on the home grid
 */

export const CATEGORIES = [
  {
    id: 'property',
    name: 'Property & Real Estate',
    tagline: 'Rent, Sale, Gift & Lease',
    description:
      'Residential and commercial property documents — rent agreements, sale deeds, gift deeds and NOCs drafted to comply with Indian property law.',
    icon: 'Home',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    sort: 1,
  },
  {
    id: 'business',
    name: 'Business & Commercial',
    tagline: 'NDA, MOU, Partnership, Service',
    description:
      'Contracts that protect your business — non-disclosure, partnership, founders, service and vendor agreements for Indian businesses and startups.',
    icon: 'Briefcase',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    sort: 2,
  },
  {
    id: 'employment',
    name: 'Employment & HR',
    tagline: 'Offer Letters, Contracts, HR',
    description:
      'Documents covering the full employee lifecycle — offer letters, employment contracts, internship agreements, and experience certificates.',
    icon: 'Users',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    sort: 3,
  },
  {
    id: 'affidavit',
    name: 'Affidavits & Declarations',
    tagline: 'Name Change, DOB, Address',
    description:
      'Sworn declarations for personal use — name change, date of birth, address proof, income, and self-declaration affidavits on stamp paper format.',
    icon: 'FileCheck',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    sort: 4,
  },
  {
    id: 'poa',
    name: 'Power of Attorney',
    tagline: 'General, Special, Medical',
    description:
      'Authorise someone to act on your behalf — general POA, special POA for property, and medical POA, drafted to Indian standards.',
    icon: 'Shield',
    color: 'purple',
    gradient: 'from-purple-500 to-fuchsia-600',
    sort: 5,
  },
  {
    id: 'family',
    name: 'Personal & Family',
    tagline: 'Will, Divorce, Adoption',
    description:
      'Sensitive personal matters handled with care — Last Will & Testament, mutual divorce petitions, and adoption deeds.',
    icon: 'Heart',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    sort: 6,
  },
  {
    id: 'notice',
    name: 'Legal Notices',
    tagline: 'Cheque Bounce, Eviction, Demand',
    description:
      'Formal pre-litigation notices — Section 138 cheque bounce, eviction, demand for recovery, and consumer complaint notices.',
    icon: 'AlertTriangle',
    color: 'red',
    gradient: 'from-red-500 to-orange-600',
    sort: 7,
  },
  {
    id: 'finance',
    name: 'Finance & Indemnity',
    tagline: 'Loans, Promissory, Indemnity',
    description:
      'Financial agreements between individuals — personal loan agreements, promissory notes, and indemnity bonds.',
    icon: 'DollarSign',
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-600',
    sort: 8,
  },
];

export const getCategoryById = (id) => CATEGORIES.find((c) => c.id === id) || null;

export default CATEGORIES;
