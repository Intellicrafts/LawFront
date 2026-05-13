/**
 * Central resolver mapping the icon-name strings used in categories.js / templates.js
 * to actual lucide-react components. Keeps the data layer free of imports.
 */

import {
  Home,
  Briefcase,
  Users,
  FileCheck,
  Shield,
  Heart,
  AlertTriangle,
  DollarSign,
  FileText,
  Mail,
  Gift,
  GraduationCap,
  Award,
  Sparkles,
} from 'lucide-react';

const MAP = {
  Home,
  Briefcase,
  Users,
  FileCheck,
  Shield,
  Heart,
  AlertTriangle,
  DollarSign,
  FileText,
  Mail,
  Gift,
  GraduationCap,
  Award,
  Sparkles,
};

export const resolveIcon = (name) => MAP[name] || FileText;

export default resolveIcon;
