import React from 'react';
import { FileText } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FileText,
  title = 'Nothing here yet',
  description = '',
  action = null,
  isDarkMode = false,
  className = '',
}) => (
  <div className={`py-16 text-center ${className}`}>
    <div
      className={`mx-auto mb-5 w-20 h-20 rounded-3xl flex items-center justify-center border-2 border-dashed
        ${isDarkMode ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50/40 border-blue-200/60 text-blue-500'}`}
    >
      <Icon size={28} className="opacity-70" />
    </div>
    <p className={`text-sm font-black tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
      {title}
    </p>
    {description ? (
      <p
        className={`mt-2 text-[11px] font-medium max-w-sm mx-auto ${
          isDarkMode ? 'text-gray-500' : 'text-slate-500'
        }`}
      >
        {description}
      </p>
    ) : null}
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

export default EmptyState;
