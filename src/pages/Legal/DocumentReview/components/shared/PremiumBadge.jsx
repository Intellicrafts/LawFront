import React from 'react';
import { Sparkles, Crown, Zap, Star } from 'lucide-react';

const ICONS = { sparkles: Sparkles, crown: Crown, zap: Zap, star: Star };

/**
 * Small, premium-looking pill badge. Used on featured templates, premium tags,
 * and category headers. Adapts to dark/light theme via parent class.
 */
const PremiumBadge = ({
  icon = 'sparkles',
  label = 'Premium',
  variant = 'gradient',
  size = 'sm',
  className = '',
}) => {
  const Icon = ICONS[icon] || Sparkles;

  const sizeClasses =
    size === 'xs'
      ? 'text-[8px] px-1.5 py-0.5 gap-1'
      : size === 'md'
        ? 'text-[10px] px-3 py-1.5 gap-1.5'
        : 'text-[9px] px-2 py-1 gap-1';

  const iconSize = size === 'md' ? 11 : size === 'xs' ? 8 : 10;

  const VARIANTS = {
    gradient:
      'text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 shadow-md shadow-orange-500/20',
    purple:
      'text-white bg-gradient-to-r from-purple-500 to-fuchsia-600 shadow-md shadow-purple-500/20',
    blue: 'text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20',
    emerald:
      'text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20',
    soft:
      'text-amber-700 bg-amber-100 border border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/20',
  };
  const variantClasses = VARIANTS[variant] || VARIANTS.gradient;

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-widest ${sizeClasses} ${variantClasses} ${className}`}
    >
      <Icon size={iconSize} className={variant === 'soft' ? '' : 'fill-current'} />
      {label}
    </span>
  );
};

export default PremiumBadge;
