// LawyerVerification.jsx — Premium Lawyer Profile Activation Component
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Check, ChevronDown, ChevronUp, Upload, FileText,
  User, Briefcase, Award, Globe, Phone, MapPin, Calendar,
  DollarSign, Clock, CheckCircle, AlertCircle, XCircle, Sparkles,
  BookOpen, Scale, Star, Link
} from 'lucide-react';
import { authAPI, tokenManager } from '../../api/apiService';
import { buildAppointmentConsultationFee } from '../../utils/consultationFee';
import { useToast } from '../../context/ToastContext';

// ─── Constants ─────────────────────────────────────────────────────────────────

const PRACTICE_AREAS = [
  'Corporate Law','Criminal Law','Family Law','Property Law','Tax Law',
  'Labor Law','Intellectual Property','Constitutional Law','Environmental Law',
  'Banking Law','Insurance Law','Immigration Law','Consumer Protection',
  'Cyber Law','Real Estate Law'
];

const COURT_OPTIONS = [
  'Supreme Court','High Court','District Court','Sessions Court',
  'Magistrate Court','Family Court','Commercial Court','Tribunal',
  'Consumer Court','NCLT','NCLAT'
];

const LANGUAGE_OPTIONS = [
  'English','Hindi','Bengali','Telugu','Marathi','Tamil','Gujarati',
  'Kannada','Malayalam','Punjabi','Assamese','Odia','Urdu'
];

const CONSULTATION_MODES = ['Online', 'Offline', 'Phone'];

const WEEKDAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

// Fields used for completion % calculation
const COMPLETION_FIELDS = [
  { key: 'enrollment_no',         label: 'Enrollment Number' },
  { key: 'experience_years',      label: 'Years of Experience' },
  { key: 'consultation_fee',      label: 'Consultation Fee' },
  { key: 'practice_areas',        label: 'Practice Areas' },
  { key: 'court_practice',        label: 'Courts of Practice' },
  { key: 'languages_spoken',      label: 'Languages Spoken' },
  { key: 'professional_bio',      label: 'Professional Bio' },
  { key: 'profile_photo',         label: 'Profile Photo' },
  { key: 'enrollment_certificate',label: 'Enrollment Certificate' },
  { key: 'cop_certificate',       label: 'CoP Certificate' },
];

// ─── Sub-components ─────────────────────────────────────────────────────────────

const SectionCard = ({ title, icon: Icon, color, children, darkMode, defaultOpen = true, disabled = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const colorMap = {
    blue:   darkMode ? 'from-blue-600 to-cyan-500'   : 'from-blue-500 to-cyan-400',
    purple: darkMode ? 'from-purple-600 to-pink-500' : 'from-purple-500 to-pink-400',
    orange: darkMode ? 'from-orange-500 to-rose-500' : 'from-orange-400 to-rose-400',
    green:  darkMode ? 'from-green-600 to-emerald-500': 'from-green-500 to-emerald-400',
    slate:  darkMode ? 'from-slate-600 to-slate-500' : 'from-slate-500 to-slate-400',
  };
  return (
    <motion.div
      layout
      className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        darkMode ? 'bg-neutral-900/80 border-white/8 backdrop-blur-xl'
                 : 'bg-white/90 border-slate-200/60 shadow-md'
      } ${disabled ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${colorMap[color]} shadow-md`}>
            <Icon size={16} className="text-white" />
          </div>
          <span className={`text-sm font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {title}
          </span>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className={`px-6 pb-6 border-t ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
              <div className="pt-5 space-y-5">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Field = ({ label, required, children, darkMode }) => (
  <div className="space-y-1.5">
    <label className={`block text-[11px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
      {label}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = (darkMode) =>
  `w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200 border ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-blue-500/50 focus:bg-white/8'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 shadow-sm'
  }`;

const TextInput = ({ darkMode, icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && (
      <Icon size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
    )}
    <input {...props} className={`${inputCls(darkMode)} ${Icon ? 'pl-10' : ''}`} />
  </div>
);

const TextArea = ({ darkMode, ...props }) => (
  <textarea
    {...props}
    className={`${inputCls(darkMode)} resize-none`}
    rows={4}
  />
);

const MultiSelect = ({ options, selected, onChange, placeholder, darkMode }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (opt) => onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${inputCls(darkMode)} flex items-center justify-between`}
      >
        <span className={selected.length ? (darkMode ? 'text-white' : 'text-slate-900') : (darkMode ? 'text-slate-600' : 'text-slate-400')}>
          {selected.length ? `${selected.length} selected` : placeholder}
        </span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''} ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`absolute z-30 w-full mt-1.5 rounded-xl shadow-2xl border overflow-hidden ${
              darkMode ? 'bg-neutral-900 border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            <div className="max-h-52 overflow-y-auto p-1.5 space-y-0.5">
              {options.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-colors ${
                    selected.includes(opt)
                      ? (darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-50 text-blue-700')
                      : (darkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50')
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                    selected.includes(opt)
                      ? 'bg-blue-500 border-blue-500'
                      : (darkMode ? 'border-slate-600' : 'border-slate-300')
                  }`}>
                    {selected.includes(opt) && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.map(s => (
            <span key={s} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              darkMode ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {s}
              <button type="button" onClick={() => toggle(s)} className="hover:opacity-70">
                <XCircle size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const FileField = ({ label, id, onChange, hasFile, fileName, darkMode, accept = 'application/pdf,image/*' }) => {
  const ref = useRef(null);
  return (
    <div
      onClick={() => ref.current?.click()}
      className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all duration-200 text-center ${
        hasFile
          ? (darkMode ? 'border-green-500/40 bg-green-500/8' : 'border-green-400 bg-green-50')
          : (darkMode ? 'border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50')
      }`}
    >
      <input ref={ref} type="file" id={id} className="hidden" accept={accept} onChange={e => onChange(e.target.files[0] || null)} />
      {hasFile ? (
        <div className="flex items-center justify-center gap-2">
          <CheckCircle size={16} className="text-green-500" />
          <span className={`text-xs font-bold truncate max-w-[160px] ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{fileName}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <Upload size={18} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
          <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
          <span className={`text-[10px] ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>PDF / JPG / PNG · Max 5MB</span>
        </div>
      )}
    </div>
  );
};

// ─── Completion Ring (sticky sidebar) ─────────────────────────────────────────

const CompletionRing = ({ fields, formState, verificationStatus, darkMode }) => {
  const total = fields.length;
  const done = fields.filter(f => {
    const v = formState[f.key];
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'string') return v.trim().length > 0;
    return !!v;
  }).length;
  const pct = Math.round((done / total) * 100);
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  const color = pct >= 80 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';

  const statusInfo = {
    pending:  { label: 'Pending Review', color: 'text-amber-500',  bg: darkMode ? 'bg-amber-500/10' : 'bg-amber-50',  border: 'border-amber-500/30', icon: AlertCircle },
    verified: { label: 'Verified ✓',    color: 'text-green-500',  bg: darkMode ? 'bg-green-500/10' : 'bg-green-50',  border: 'border-green-500/30',  icon: CheckCircle },
    rejected: { label: 'Action Needed', color: 'text-red-500',    bg: darkMode ? 'bg-red-500/10'   : 'bg-red-50',    border: 'border-red-500/30',    icon: XCircle    },
  };
  const s = statusInfo[verificationStatus] || statusInfo.pending;
  const StatusIcon = s.icon;

  const missing = fields.filter(f => {
    const v = formState[f.key];
    if (Array.isArray(v)) return v.length === 0;
    if (typeof v === 'string') return !v.trim();
    return !v;
  });

  return (
    <div className={`rounded-2xl border p-5 sticky top-4 transition-all duration-300 ${
      darkMode ? 'bg-neutral-900/90 border-white/8 backdrop-blur-xl' : 'bg-white border-slate-200 shadow-lg'
    }`}>
      {/* Ring */}
      <div className="flex flex-col items-center mb-5">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke={darkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9'} strokeWidth="7" />
          <motion.circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
          />
          <text x="50" y="45" textAnchor="middle" fontSize="14" fontWeight="900" fill={darkMode ? '#fff' : '#0f172a'}>
            {pct}%
          </text>
          <text x="50" y="58" textAnchor="middle" fontSize="7" fontWeight="700" fill={darkMode ? '#64748b' : '#94a3b8'}>
            COMPLETE
          </text>
        </svg>
        <p className={`text-[11px] font-black mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {done}/{total} fields filled
        </p>
      </div>

      {/* Verification status badge */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold mb-4 ${s.bg} ${s.border}`}>
        <StatusIcon size={13} className={s.color} />
        <span className={s.color}>{s.label}</span>
      </div>

      {/* Missing fields */}
      {missing.length > 0 ? (
        <div className="space-y-1.5">
          <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Missing
          </p>
          {missing.slice(0, 6).map(f => (
            <div key={f.key} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              <span className={`text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{f.label}</span>
            </div>
          ))}
          {missing.length > 6 && (
            <p className={`text-[9px] ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>+{missing.length - 6} more</p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle size={14} />
          <span className="text-xs font-black">Profile Complete!</span>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────────

const LawyerVerification = ({ darkMode, userData, onComplete }) => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state — mirrors lawyer_additionals table
  const [form, setForm] = useState({
    enrollment_no:       '',
    experience_years:    '',
    consultation_fee:    '',
    practice_areas:      [],
    court_practice:      [],
    languages_spoken:    [],
    professional_bio:    '',
    bar_council_name:    '',
    enrollment_date:     '',
    law_firm_name:       '',
    office_address:      '',
    office_phone:        '',
    website_url:         '',
    achievements:        '',
    linkedin_url:        '',
    twitter_url:         '',
    facebook_url:        '',
    consultation_modes:  [],
    available_days:      [],
    consultation_start_time: '',
    consultation_end_time:   '',
  });

  // File state
  const [profilePhoto, setProfilePhoto]               = useState(null);
  const [enrollmentCert, setEnrollmentCert]           = useState(null);
  const [copCert, setCopCert]                         = useState(null);
  const [addressProof, setAddressProof]               = useState(null);

  // Existing file paths (from DB) to track completion even if no new upload
  const [existingFiles, setExistingFiles]             = useState({});
  const [verificationStatus, setVerificationStatus]   = useState('pending');

  // Satyapan Verification State
  const [bciVerified, setBciVerified]                 = useState(false);
  const [isVerifyingBci, setIsVerifyingBci]           = useState(false);
  const [bciState, setBciState]                       = useState('Delhi'); // Default commonly used state

  // Pre-fill from existing profile data
  useEffect(() => {
    const prefill = async () => {
      setLoading(true);
      try {
        const res  = await authAPI.getUserProfile();
        const prof = res.data?.data || res.data;
        // lawyer additional data may be nested under different keys
        const ld   = prof?.lawyer_data || prof?.lawyer_additional || prof?.lawyerAdditional || {};

        const parseJson = (v) => {
          if (Array.isArray(v)) return v;
          if (typeof v === 'string') { try { return JSON.parse(v); } catch { return []; } }
          return [];
        };

        setForm(prev => ({
          ...prev,
          enrollment_no:       ld.enrollment_no       || '',
          experience_years:    ld.experience_years     ? String(ld.experience_years) : '',
          consultation_fee:    ld.consultation_fee     ? String(Array.isArray(ld.consultation_fee) ? (ld.consultation_fee[0]?.amount || '') : ld.consultation_fee) : '',
          practice_areas:      parseJson(ld.practice_areas),
          court_practice:      parseJson(ld.court_practice),
          languages_spoken:    parseJson(ld.languages_spoken),
          professional_bio:    ld.professional_bio     || '',
          bar_council_name:    ld.bar_council_name     || '',
          enrollment_date:     ld.enrollment_date      || '',
          law_firm_name:       ld.law_firm_name        || '',
          office_address:      ld.office_address       || '',
          office_phone:        ld.office_phone         || '',
          website_url:         ld.website_url          || '',
          achievements:        ld.achievements         || '',
          linkedin_url:        ld.linkedin_url         || '',
          twitter_url:         ld.twitter_url          || '',
          facebook_url:        ld.facebook_url         || '',
          consultation_modes:  parseJson(ld.consultation_modes),
          available_days:      parseJson(ld.available_days),
          consultation_start_time: ld.consultation_start_time || '',
          consultation_end_time:   ld.consultation_end_time   || '',
        }));

        setExistingFiles({
          profile_photo:            ld.profile_photo             || '',
          enrollment_certificate:   ld.enrollment_certificate    || '',
          cop_certificate:          ld.cop_certificate           || '',
          address_proof:            ld.address_proof             || '',
        });

        setVerificationStatus(ld.verification_status || 'pending');
        
        // Check if BCI is already verified
        if (ld.verification_status === 'verified' || Number(ld.satyapan_status) === 1 || Number(prof?.status) > 0 || ld.satyapan_verified) {
          setBciVerified(true);
        }
      } catch (e) {
        console.error('Failed to prefill lawyer data:', e);
      } finally {
        setLoading(false);
      }
    };
    prefill();
  }, []);

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  // Build formState for completion ring (combining form + existing files)
  const completionState = {
    ...form,
    profile_photo:           profilePhoto ? 'new-file' : (existingFiles.profile_photo || ''),
    enrollment_certificate:  enrollmentCert ? 'new-file' : (existingFiles.enrollment_certificate || ''),
    cop_certificate:         copCert ? 'new-file' : (existingFiles.cop_certificate || ''),
  };

  const handleVerifyBci = async () => {
    if (!form.enrollment_no.trim()) return showError('Enrollment Number is required');
    if (!bciState) return showError('Bar Council State is required');
    
    setIsVerifyingBci(true);
    try {
      await authAPI.verifyLawyerSatyapan(form.enrollment_no.trim(), bciState);
      setBciVerified(true);
      showSuccess('Bar Council Details Verified Successfully!');
    } catch (err) {
      showError(err.message || 'BCI Verification failed');
    } finally {
      setIsVerifyingBci(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.enrollment_no.trim()) return showError('Enrollment Number is required');
    if (!form.experience_years)     return showError('Years of Experience is required');
    if (!form.consultation_fee)     return showError('Consultation Fee is required');
    if (form.practice_areas.length  === 0) return showError('Select at least one Practice Area');
    if (form.court_practice.length  === 0) return showError('Select at least one Court of Practice');
    if (form.languages_spoken.length === 0) return showError('Select at least one Language');
    if (!form.professional_bio.trim() || form.professional_bio.trim().length < 50)
      return showError('Professional Bio must be at least 50 characters');

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('enrollment_no',    form.enrollment_no.trim());
      fd.append('experience_years', form.experience_years);
      fd.append('consultation_fee', JSON.stringify(buildAppointmentConsultationFee(form.consultation_fee)));
      fd.append('practice_areas',   JSON.stringify(form.practice_areas));
      fd.append('court_practice',   JSON.stringify(form.court_practice));
      fd.append('languages_spoken', JSON.stringify(form.languages_spoken));
      fd.append('professional_bio', form.professional_bio.trim());

      // Optional extended fields
      if (form.bar_council_name)   fd.append('bar_council_name',   form.bar_council_name.trim());
      if (form.enrollment_date)    fd.append('enrollment_date',    form.enrollment_date);
      if (form.law_firm_name)      fd.append('law_firm_name',      form.law_firm_name.trim());
      if (form.office_address)     fd.append('office_address',     form.office_address.trim());
      if (form.office_phone)       fd.append('office_phone',       form.office_phone.trim());
      if (form.website_url)        fd.append('website_url',        form.website_url.trim());
      if (form.achievements)       fd.append('achievements',       form.achievements.trim());
      if (form.linkedin_url)       fd.append('linkedin_url',       form.linkedin_url.trim());
      if (form.twitter_url)        fd.append('twitter_url',        form.twitter_url.trim());
      if (form.facebook_url)       fd.append('facebook_url',       form.facebook_url.trim());
      if (form.consultation_modes.length) fd.append('consultation_modes', JSON.stringify(form.consultation_modes));
      if (form.available_days.length)     fd.append('available_days',     JSON.stringify(form.available_days));
      if (form.consultation_start_time)   fd.append('consultation_start_time', form.consultation_start_time);
      if (form.consultation_end_time)     fd.append('consultation_end_time',   form.consultation_end_time);

      // Files
      if (profilePhoto)    fd.append('profile_photo',           profilePhoto);
      if (enrollmentCert)  fd.append('enrollment_certificate',  enrollmentCert);
      if (copCert)         fd.append('cop_certificate',         copCert);
      if (addressProof)    fd.append('address_proof',           addressProof);

      const res = await authAPI.saveAdditionalDetails(fd);
      if (res.data?.success || res.data?.data) {
        showSuccess('Profile updated successfully! Verification is pending admin review.');
        setVerificationStatus('pending');
        if (onComplete) onComplete();
      } else {
        showError('Failed to save. Please try again.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})?.[0]?.[0] || 'Failed to save details.';
      showError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className={`w-12 h-12 rounded-full border-2 ${darkMode ? 'border-white/10 border-t-white' : 'border-slate-200 border-t-slate-800'}`}
          />
          <p className={`text-[11px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Loading profile data…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* Gradient accent line */}
        <div className="h-[3px] w-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-6" />
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30" />
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              <ShieldCheck size={22} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Profile Verification
            </h1>
            <p className={`text-xs font-bold mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Complete your professional profile to activate your account and start receiving consultations
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Layout: Form + Sticky Sidebar */}
      <div className="flex flex-col-reverse xl:flex-row gap-6 items-start">

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0 w-full space-y-4">

          {/* Section 1 — Basic Info */}
          <SectionCard title="Basic Professional Info" icon={Scale} color="blue" darkMode={darkMode}>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-4">
                <div className={`relative overflow-hidden p-4 rounded-xl border transition-colors duration-500 ${bciVerified ? (darkMode ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200') : (darkMode ? 'bg-neutral-800/50 border-white/10' : 'bg-slate-50 border-slate-200')}`}>
                  {/* Scanning Overlay */}
                  <AnimatePresence>
                    {isVerifyingBci && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-0 pointer-events-none rounded-xl"
                      >
                        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[1px]" />
                        <motion.div
                          animate={{ y: ['-100%', '400%'] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                          className="absolute left-0 right-0 h-[2px] bg-blue-500/60 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-1">
                      <Field label="Bar Council Enrollment Number" required darkMode={darkMode}>
                        <TextInput darkMode={darkMode} icon={Award} value={form.enrollment_no}
                          onChange={e => setField('enrollment_no', e.target.value)}
                          placeholder="e.g. MH/1234/2018" 
                          disabled={bciVerified || isVerifyingBci} />
                      </Field>
                    </div>
                    <div className="flex-1">
                      <Field label="State Bar Council" required darkMode={darkMode}>
                        <div className="relative">
                          <MapPin size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                          <select 
                            value={bciState}
                            onChange={(e) => setBciState(e.target.value)}
                            disabled={bciVerified || isVerifyingBci}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200 border appearance-none ${
                              darkMode
                                ? 'bg-neutral-900 border-white/10 text-white focus:border-blue-500/50'
                                : 'bg-white border-slate-200 text-slate-900 focus:border-blue-400'
                            }`}
                          >
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Punjab & Haryana">Punjab & Haryana</option>
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                            <option value="Odisha">Odisha</option>
                          </select>
                          <ChevronDown size={14} className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        </div>
                      </Field>
                    </div>
                    
                    <div>
                      {bciVerified ? (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="h-[46px] px-6 rounded-xl bg-green-500 text-white flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-green-500/30"
                        >
                          <CheckCircle size={18} />
                          Verified
                        </motion.div>
                      ) : (
                        <motion.button
                          type="button"
                          onClick={handleVerifyBci}
                          disabled={isVerifyingBci || !form.enrollment_no.trim()}
                          whileHover={!(isVerifyingBci || !form.enrollment_no.trim()) ? { scale: 1.02 } : {}}
                          whileTap={!(isVerifyingBci || !form.enrollment_no.trim()) ? { scale: 0.98 } : {}}
                          className={`h-[46px] px-8 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 shadow-xl relative overflow-hidden ${
                            isVerifyingBci
                              ? (darkMode ? 'bg-blue-600/80 border border-blue-500/50 text-white w-[160px]' : 'bg-blue-500/80 border border-blue-400/50 text-white w-[160px]')
                              : (!form.enrollment_no.trim()
                                ? (darkMode ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed')
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]')
                          }`}
                        >
                          {isVerifyingBci ? (
                            <>
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{ x: ['-200%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                              />
                              <ShieldCheck size={18} className="animate-pulse relative z-10" />
                              <span className="relative z-10 animate-pulse tracking-wide">Fetching...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck size={18} />
                              Verify BCI
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                  {!bciVerified && (
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-[10px] mt-3 font-medium relative z-10 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                    >
                      <AlertCircle size={12} className="inline mr-1" />
                      BCI Verification is required to unlock the rest of your profile.
                    </motion.p>
                  )}
                </div>
              </div>
              <Field label="Years of Experience" required darkMode={darkMode}>
                <TextInput darkMode={darkMode} icon={Briefcase} type="number" min="0" max="60"
                  value={form.experience_years}
                  disabled={!bciVerified}
                  onChange={e => setField('experience_years', e.target.value)}
                  placeholder="e.g. 8" />
              </Field>
              <Field label="Consultation Fee (₹ / min)" required darkMode={darkMode}>
                <TextInput darkMode={darkMode} icon={DollarSign} type="number" min="0"
                  value={form.consultation_fee}
                  disabled={!bciVerified}
                  onChange={e => setField('consultation_fee', e.target.value)}
                  placeholder="e.g. 10" />
              </Field>
            </div>
          </SectionCard>

          {/* Section 2 — Practice Details */}
          <SectionCard title="Practice Details" icon={BookOpen} color="purple" darkMode={darkMode} disabled={!bciVerified}>
            <Field label="Practice Areas" required darkMode={darkMode}>
              <MultiSelect options={PRACTICE_AREAS} selected={form.practice_areas}
                onChange={v => setField('practice_areas', v)}
                placeholder="Select practice areas…" darkMode={darkMode} />
            </Field>
            <Field label="Courts of Practice" required darkMode={darkMode}>
              <MultiSelect options={COURT_OPTIONS} selected={form.court_practice}
                onChange={v => setField('court_practice', v)}
                placeholder="Select courts…" darkMode={darkMode} />
            </Field>
            <Field label="Languages Spoken" required darkMode={darkMode}>
              <MultiSelect options={LANGUAGE_OPTIONS} selected={form.languages_spoken}
                onChange={v => setField('languages_spoken', v)}
                placeholder="Select languages…" darkMode={darkMode} />
            </Field>
          </SectionCard>

          {/* Section 3 — Professional Profile */}
          <SectionCard title="Professional Profile" icon={User} color="orange" darkMode={darkMode} disabled={!bciVerified}>
            <Field label="Professional Bio (min 50 characters)" required darkMode={darkMode}>
              <TextArea darkMode={darkMode} value={form.professional_bio}
                onChange={e => setField('professional_bio', e.target.value)}
                placeholder="Describe your expertise, achievements, and what makes you unique as a legal professional…"
                rows={5} />
              <p className={`text-[10px] mt-1 ${form.professional_bio.length >= 50 ? 'text-green-500' : (darkMode ? 'text-slate-600' : 'text-slate-400')}`}>
                {form.professional_bio.length} / 50 chars minimum
              </p>
            </Field>
            <Field label="Profile Photo" darkMode={darkMode}>
              <FileField label="Upload Profile Photo" id="profilePhoto" accept="image/*"
                onChange={setProfilePhoto}
                hasFile={!!profilePhoto || !!existingFiles.profile_photo}
                fileName={profilePhoto?.name || existingFiles.profile_photo?.split('/').pop() || ''}
                darkMode={darkMode} />
            </Field>
          </SectionCard>

          {/* Section 4 — Legal Documents */}
          <SectionCard title="Legal Documents" icon={FileText} color="green" darkMode={darkMode} disabled={!bciVerified}>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Certificate of Enrollment" darkMode={darkMode}>
                <FileField label="Upload Enrollment Certificate" id="enrollmentCert"
                  onChange={setEnrollmentCert}
                  hasFile={!!enrollmentCert || !!existingFiles.enrollment_certificate}
                  fileName={enrollmentCert?.name || existingFiles.enrollment_certificate?.split('/').pop() || ''}
                  darkMode={darkMode} />
              </Field>
              <Field label="Certificate of Practice (CoP)" darkMode={darkMode}>
                <FileField label="Upload CoP Certificate" id="copCert"
                  onChange={setCopCert}
                  hasFile={!!copCert || !!existingFiles.cop_certificate}
                  fileName={copCert?.name || existingFiles.cop_certificate?.split('/').pop() || ''}
                  darkMode={darkMode} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Address Proof (Optional)" darkMode={darkMode}>
                  <FileField label="Upload Address Proof" id="addressProof"
                    onChange={setAddressProof}
                    hasFile={!!addressProof || !!existingFiles.address_proof}
                    fileName={addressProof?.name || existingFiles.address_proof?.split('/').pop() || ''}
                    darkMode={darkMode} />
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Section 5 — Extended Info (Optional) */}
          <SectionCard title="Extended Professional Info" icon={Star} color="slate" darkMode={darkMode} defaultOpen={false} disabled={!bciVerified}>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Bar Council Name" darkMode={darkMode}>
                <TextInput darkMode={darkMode} icon={Award} value={form.bar_council_name}
                  onChange={e => setField('bar_council_name', e.target.value)}
                  placeholder="e.g. Bar Council of Maharashtra" />
              </Field>
              <Field label="Enrollment Date" darkMode={darkMode}>
                <TextInput darkMode={darkMode} type="date" value={form.enrollment_date}
                  onChange={e => setField('enrollment_date', e.target.value)} />
              </Field>
              <Field label="Law Firm Name" darkMode={darkMode}>
                <TextInput darkMode={darkMode} icon={Briefcase} value={form.law_firm_name}
                  onChange={e => setField('law_firm_name', e.target.value)}
                  placeholder="e.g. Sharma & Associates" />
              </Field>
              <Field label="Office Phone" darkMode={darkMode}>
                <TextInput darkMode={darkMode} icon={Phone} value={form.office_phone}
                  onChange={e => setField('office_phone', e.target.value)}
                  placeholder="+91 98765 43210" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Office Address" darkMode={darkMode}>
                  <TextArea darkMode={darkMode} value={form.office_address}
                    onChange={e => setField('office_address', e.target.value)}
                    placeholder="Complete office address…" rows={2} />
                </Field>
              </div>
              <Field label="Website URL" darkMode={darkMode}>
                <TextInput darkMode={darkMode} icon={Globe} value={form.website_url}
                  onChange={e => setField('website_url', e.target.value)}
                  placeholder="https://yourfirm.com" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Achievements & Recognitions" darkMode={darkMode}>
                  <TextArea darkMode={darkMode} value={form.achievements}
                    onChange={e => setField('achievements', e.target.value)}
                    placeholder="Awards, recognitions, notable cases…" rows={3} />
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Section 6 — Availability */}
          <SectionCard title="Consultation Availability" icon={Clock} color="slate" darkMode={darkMode} defaultOpen={false} disabled={!bciVerified}>
            <Field label="Consultation Modes" darkMode={darkMode}>
              <MultiSelect options={CONSULTATION_MODES} selected={form.consultation_modes}
                onChange={v => setField('consultation_modes', v)}
                placeholder="Online, Offline, Phone…" darkMode={darkMode} />
            </Field>
            <Field label="Available Days" darkMode={darkMode}>
              <MultiSelect options={WEEKDAYS} selected={form.available_days}
                onChange={v => setField('available_days', v)}
                placeholder="Select available days…" darkMode={darkMode} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Consultation Start Time" darkMode={darkMode}>
                <TextInput darkMode={darkMode} type="time" value={form.consultation_start_time}
                  onChange={e => setField('consultation_start_time', e.target.value)} />
              </Field>
              <Field label="Consultation End Time" darkMode={darkMode}>
                <TextInput darkMode={darkMode} type="time" value={form.consultation_end_time}
                  onChange={e => setField('consultation_end_time', e.target.value)} />
              </Field>
            </div>
          </SectionCard>

          {/* Section 7 — Social Links */}
          <SectionCard title="Social & Professional Links" icon={Link} color="slate" darkMode={darkMode} defaultOpen={false} disabled={!bciVerified}>
            <div className="space-y-4">
              {[
                { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/yourprofile' },
                { key: 'twitter_url',  label: 'Twitter / X URL', placeholder: 'https://twitter.com/yourhandle' },
                { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/yourpage' },
              ].map(({ key, label, placeholder }) => (
                <Field key={key} label={label} darkMode={darkMode}>
                  <TextInput darkMode={darkMode} icon={Globe} value={form[key]}
                    onChange={e => setField(key, e.target.value)} placeholder={placeholder} />
                </Field>
              ))}
            </div>
          </SectionCard>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={saving || !bciVerified}
            whileHover={(!saving && bciVerified) ? { scale: 1.01 } : {}}
            whileTap={(!saving && bciVerified) ? { scale: 0.99 } : {}}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[13px] uppercase tracking-widest transition-all duration-300 shadow-xl ${
              saving || !bciVerified
                ? (darkMode ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed')
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-purple-500/30 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]'
            }`}
          >
            {saving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                />
                Saving Profile…
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Save &amp; Submit for Verification
              </>
            )}
          </motion.button>

          <p className={`text-center text-[10px] font-bold ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            After submission, our team will review and verify your credentials within 24–48 hours.
          </p>
        </form>

        {/* ── Sticky Completion Ring Sidebar ── */}
        <div className="xl:w-64 w-full xl:sticky xl:top-6">
          <CompletionRing
            fields={COMPLETION_FIELDS}
            formState={completionState}
            verificationStatus={verificationStatus}
            darkMode={darkMode}
          />

          {/* Tips card */}
          <div className={`mt-4 rounded-2xl border p-4 ${
            darkMode ? 'bg-neutral-900/80 border-white/8' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <p className={`text-[9px] font-black uppercase tracking-widest mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Tips
            </p>
            {[
              'Upload clear, high-resolution documents',
              'Keep Bio professional and specific',
              'Accurate enrollment number speeds up verification',
              'More practice areas = more client visibility',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 mb-2">
                <CheckCircle size={11} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span className={`text-[10px] font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LawyerVerification;
