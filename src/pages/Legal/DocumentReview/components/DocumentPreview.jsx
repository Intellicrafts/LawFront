import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, FileText } from 'lucide-react';
import { renderTemplate } from '../utils/renderTemplate';

/**
 * Renders a styled HTML preview of the document with live variable substitution.
 * Used in both the AI flow (collapsible / swipeable up on mobile) and the Form flow.
 */
const DocumentPreview = ({ template, values, isDarkMode, compact = false, className = '' }) => {
  const { blocks } = useMemo(() => renderTemplate(template, values || {}), [template, values]);

  return (
    <div
      className={`relative rounded-3xl border overflow-hidden flex flex-col h-full
        ${isDarkMode ? 'bg-[#0F0F0F] border-white/5' : 'bg-white border-slate-200/70 shadow-md'}
        ${className}`}
    >
      {/* Toolbar */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b
          ${isDarkMode ? 'bg-[#141414] border-white/5' : 'bg-slate-50/80 border-slate-100'}`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center
              ${isDarkMode ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'}`}
          >
            <Eye size={13} />
          </div>
          <div>
            <h3 className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Live Preview
            </h3>
            <p className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
              Updates as you fill in details
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest
            ${isDarkMode ? 'bg-emerald-500/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}
          >
            <FileText size={9} /> A4
          </span>
        </div>
      </div>

      {/* Page */}
      <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-slate-100/60'}`}>
        <div
          className={`mx-auto my-4 sm:my-6 max-w-[680px] p-6 sm:p-10 ${compact ? 'p-4 sm:p-6' : ''} rounded-xl shadow-2xl
            ${isDarkMode ? 'bg-[#171717] shadow-black/60 ring-1 ring-white/5' : 'bg-white shadow-slate-300/40'}`}
        >
          {/* Doc title */}
          <div className="text-center mb-6 pb-4 border-b border-dashed">
            <div className={`text-[9px] font-black uppercase tracking-[0.25em] ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
              MeraBakil • Draft
            </div>
            <h2
              className={`mt-2 text-base sm:text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              {template?.name}
            </h2>
          </div>

          {blocks.map((block, i) => {
            if (block.type === 'heading') {
              return (
                <motion.h3
                  key={`h-${i}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.01, 0.3) }}
                  className={`mt-5 mb-2 text-[12px] sm:text-sm font-black tracking-wide uppercase border-b pb-1
                    ${isDarkMode ? 'text-blue-300 border-blue-500/30' : 'text-blue-700 border-blue-200'}`}
                >
                  {block.text}
                </motion.h3>
              );
            }
            return (
              <motion.p
                key={`p-${i}`}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: Math.min(i * 0.005, 0.3) }}
                className={`my-2 text-justify leading-relaxed text-[12px] sm:text-[13px]
                  ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {/* Highlight unresolved placeholders e.g. [Landlord's Name] */}
                {block.text.split(/(\[[^\]]+\])/g).map((seg, idx) =>
                  /^\[[^\]]+\]$/.test(seg) ? (
                    <span
                      key={idx}
                      className={`px-1 py-0.5 rounded text-[10px] sm:text-[11px] font-black
                        ${isDarkMode ? 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30' : 'bg-amber-100 text-amber-800 ring-1 ring-amber-200'}`}
                    >
                      {seg}
                    </span>
                  ) : (
                    <React.Fragment key={idx}>{seg}</React.Fragment>
                  )
                )}
              </motion.p>
            );
          })}

          {/* Signature block placeholder */}
          {template?.signatureBlocks?.length ? (
            <div className="mt-10 pt-6 border-t border-dashed">
              <div className={`text-[10px] font-black uppercase tracking-widest mb-4 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Signatures
              </div>
              <div className="grid grid-cols-2 gap-5">
                {template.signatureBlocks.map((label) => (
                  <div key={label}>
                    <div className={`h-px ${isDarkMode ? 'bg-white/15' : 'bg-slate-300'}`} />
                    <p className={`mt-1 text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
