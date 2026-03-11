import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'react-lottie-player';
import {
  IndianRupee, Wand2, Sparkles, Clock3, Save, Plus, Trash2,
  FileText, Home, Scale, Briefcase, ChevronDown, Check, X,
  Edit3, ToggleLeft, ToggleRight, AlertCircle, TrendingUp
} from 'lucide-react';
import { getAppointmentRatePerMinute, buildAppointmentConsultationFee, normalizeConsultationFeeList, APPOINTMENT_SERVICE_CODE } from '../../utils/consultationFee';
import { authAPI, lawyerServiceAPI } from '../../api/apiService';
import lawyerSearchAnim from '../../assets/animations/lawyer-search.json';

/* ─── Shared UI ────────────────────────────────────────────────────────── */
const GlassCard = ({ children, className = '', darkMode, hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -2, scale: 1.02 } : {}}
    className={`relative overflow-visible rounded-2xl border transition-all duration-300
      ${darkMode ? 'bg-[#151515]/80 border-white/10 backdrop-blur-xl shadow-lg shadow-black/40' : 'bg-white/90 border-slate-200/80 backdrop-blur-xl shadow-xl shadow-slate-200/40'}
      ${className}`}
  >
    {children}
  </motion.div>
);

const PremiumBadge = ({ text, type = 'primary' }) => {
  const s = {
    primary: 'bg-slate-900/10 text-slate-900 border-slate-900/20 dark:bg-white/10 dark:text-white dark:border-white/20',
    secondary: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    info: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${s[type]}`}>
      {text}
    </span>
  );
};

/* ─── Constants ─────────────────────────────────────────────────────────── */
const formatINR = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(n || 0));

const BILLING_MODELS = [
  { code: 'per_minute', label: 'Per Minute', unit: '/min', icon: Clock3, sliderMax: 100, sliderStep: 5 },
  { code: 'flat', label: 'Flat Fee', unit: 'flat', icon: IndianRupee, sliderMax: 50000, sliderStep: 500 },
  { code: 'per_document', label: 'Per Document', unit: '/doc', icon: FileText, sliderMax: 10000, sliderStep: 100 },
];

const SERVICE_PRESETS = [
  { service_code: APPOINTMENT_SERVICE_CODE, service_name: 'Appointment Consultation', billing_model: 'per_minute', icon: 'Clock3', locked: true },
  { service_code: 'rent_agreement', service_name: 'Rent Agreement Drafting', billing_model: 'flat', icon: 'Home' },
  { service_code: 'nda_drafting', service_name: 'NDA / Contract Drafting', billing_model: 'per_document', icon: 'FileText' },
  { service_code: 'legal_notice', service_name: 'Legal Notice Drafting', billing_model: 'flat', icon: 'Scale' },
  { service_code: 'property_verification', service_name: 'Property Verification', billing_model: 'flat', icon: 'Briefcase' },
  { service_code: 'custom', service_name: 'Custom Service', billing_model: 'flat', icon: 'Sparkles' },
];

const PRESET_ICONS = { Clock3, Home, FileText, Scale, Briefcase, Sparkles };

const getServiceIcon = (iconName) => PRESET_ICONS[iconName] || Briefcase;

const getRecommendedRate = (experienceYears, billingModel) => {
  const yrs = Number(experienceYears || 0);
  if (billingModel === 'per_minute') {
    if (yrs >= 15) return 80; if (yrs >= 10) return 65;
    if (yrs >= 5) return 50; if (yrs >= 2) return 35;
    return 25;
  }
  if (billingModel === 'flat') {
    if (yrs >= 15) return 15000; if (yrs >= 10) return 10000;
    if (yrs >= 5) return 7000; if (yrs >= 2) return 5000;
    return 3000;
  }
  if (billingModel === 'per_document') {
    if (yrs >= 15) return 5000; if (yrs >= 10) return 3500;
    if (yrs >= 5) return 2500; if (yrs >= 2) return 1500;
    return 1000;
  }
  return 0;
};

const sliderPct = (value, model) => {
  const m = BILLING_MODELS.find(b => b.code === model) || BILLING_MODELS[0];
  return `${Math.min(100, ((Number(value) - 0) / m.sliderMax) * 100).toFixed(1)}%`;
};

/* ─── Service Card ────────────────────────────────────────────────────────── */
const ServiceCard = ({ service, darkMode, experienceYears, onUpdate, onDelete, onToggle }) => {
  const [editing, setEditing] = useState(false);
  const [localRate, setLocalRate] = useState(String(service.rate || ''));
  const [localName, setLocalName] = useState(service.service_name);
  const [localModel, setLocalModel] = useState(service.billing_model || 'flat');
  const [hasChange, setHasChange] = useState(false);

  const billingMeta = BILLING_MODELS.find(b => b.code === localModel) || BILLING_MODELS[0];
  const Icon = getServiceIcon(service.icon);
  const recommended = getRecommendedRate(experienceYears, localModel);
  const isActive = service.is_active !== false;

  const markChanged = () => setHasChange(true);

  const handleSave = () => {
    onUpdate({ ...service, service_name: localName, billing_model: localModel, rate: Number(localRate) || 0 });
    setHasChange(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setLocalRate(String(service.rate || ''));
    setLocalName(service.service_name);
    setLocalModel(service.billing_model || 'flat');
    setHasChange(false);
    setEditing(false);
  };

  const isLocked = service.locked;

  return (
    <GlassCard
      darkMode={darkMode}
      hover={true}
      className={`p-4 flex flex-col gap-3 transition-all duration-300 stagger-item ${!isActive ? 'opacity-60 grayscale-[50%]' : ''
        } ${isLocked ? (darkMode ? 'border-brand-500/40 bg-gradient-to-br from-brand-500/10 to-transparent' : 'border-brand-300/60 bg-gradient-to-br from-brand-500/5 to-white') : ''}`}
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner ${darkMode ? 'bg-gradient-to-br from-white/10 to-white/5 text-white border border-white/10' : 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 border border-slate-200/60'
            }`}>
            <motion.div animate={{ rotate: isActive ? [0, 5, -5, 0] : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
              <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
            </motion.div>
          </div>
          <div className="flex-1 min-w-0 pr-2">
            {editing && !isLocked ? (
              <input
                className={`text-[13px] font-black bg-transparent border-b outline-none w-full pb-0.5 ${darkMode ? 'border-brand-400 text-white focus:border-brand-300' : 'border-brand-500 text-slate-900 focus:border-brand-600'
                  }`}
                value={localName}
                onChange={(e) => { setLocalName(e.target.value); markChanged(); }}
                placeholder="Service name"
              />
            ) : (
              <p className={`text-[13px] sm:text-[14px] font-black leading-tight tracking-tight truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {service.service_name}
              </p>
            )}
            <div className="flex items-center flex-wrap gap-1.5 mt-1">
              <PremiumBadge text={billingMeta.label} type={isActive ? 'info' : 'secondary'} />
              {isLocked && <PremiumBadge text="Core Service" type="success" />}
            </div>
          </div>
        </div>

        {/* Actions - wrap on small screens so it doesn't break out */}
        <div className="flex items-center gap-1.5 flex-wrap sm:flex-shrink-0 mt-2 sm:mt-0 ml-12 sm:ml-0">
          {!isLocked && (
            <button
              onClick={() => onDelete(service.service_code)}
              data-tip="Remove service"
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${darkMode ? 'text-slate-500 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
                }`}
            >
              <Trash2 size={13} />
            </button>
          )}
          <button
            onClick={() => onToggle(service.service_code)}
            data-tip={isActive ? 'Disable service' : 'Enable service'}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${darkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            {isActive ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} />}
          </button>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              data-tip="Edit rate"
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${darkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              <Edit3 size={13} />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button onClick={handleCancel} className={`w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all`}>
                <X size={13} />
              </button>
              <button onClick={handleSave} className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${darkMode ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-emerald-600 hover:bg-emerald-50'
                }`}>
                <Check size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rate Display */}
      <div className={`flex flex-col items-center justify-center py-4 rounded-xl mt-1 relative overflow-hidden transition-all duration-500 ${darkMode ? 'bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5' : 'bg-gradient-to-b from-slate-50 to-transparent border border-slate-100'}`}>
        {/* Subtle Background Icon Animation */}
        <motion.div 
          animate={isActive ? { rotate: 360, scale: [1, 1.05, 1] } : {}} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-3/4 -translate-y-1/2 opacity-[0.03] pointer-events-none"
        >
          <Icon size={90} />
        </motion.div>
        
        <span className={`text-2xl sm:text-3xl font-black tracking-tighter flex items-start z-10 ${darkMode ? 'text-white' : 'text-slate-900'} ${!isActive && 'text-slate-500'}`}>
          <span className="text-sm align-top mt-1.5 inline-block mr-1 font-bold text-slate-400">₹</span>
          {formatINR(editing ? localRate : service.rate) || '—'}
        </span>
        <span className={`text-[9px] font-black uppercase tracking-[0.15em] mt-1 px-2.5 py-0.5 rounded-md z-10 shadow-sm ${darkMode ? 'bg-white/10 text-slate-300 border border-white/5' : 'bg-white text-slate-500 border border-slate-200'}`}>
          {billingMeta.unit}
        </span>
      </div>

      {/* Editor (expanded) */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {/* Billing model switcher */}
            {!isLocked && (
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Billing Model</p>
                <div className="flex gap-2">
                  {BILLING_MODELS.map((m) => (
                    <button
                      key={m.code}
                      type="button"
                      onClick={() => { setLocalModel(m.code); markChanged(); setLocalRate(String(getRecommendedRate(experienceYears, m.code))); }}
                      className={`flex-1 h-8 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${localModel === m.code
                        ? darkMode ? 'bg-white/15 border-white/30 text-white' : 'bg-slate-900 border-slate-900 text-white'
                        : darkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Slider */}
            <div className="px-1">
              <input
                type="range"
                min="0"
                max={billingMeta.sliderMax}
                step={billingMeta.sliderStep}
                value={Number(localRate) || 0}
                onChange={(e) => {
                  setLocalRate(e.target.value);
                  markChanged();
                  e.target.style.setProperty('--slider-pct', sliderPct(e.target.value, localModel));
                }}
                className="lawyer-slider"
                style={{ '--slider-pct': sliderPct(localRate, localModel) }}
              />
              <div className="flex justify-between text-[8px] font-bold text-slate-400 mt-1">
                <span>₹0</span>
                <span>₹{formatINR(billingMeta.sliderMax)}</span>
              </div>
            </div>

            {/* Text input */}
            <div className={`flex items-center h-9 px-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
              <IndianRupee size={11} className="text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="number" min="0"
                value={localRate}
                onChange={(e) => { setLocalRate(e.target.value); markChanged(); }}
                placeholder="Or type exact amount"
                className="bg-transparent border-none outline-none text-[12px] font-bold w-full"
              />
            </div>

            {/* Recommended */}
            {recommended > 0 && Number(localRate) !== recommended && (
              <button
                type="button"
                onClick={() => { setLocalRate(String(recommended)); markChanged(); }}
                className={`w-full h-8 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center justify-center gap-1.5 transition-all ${darkMode ? 'border-blue-500/25 text-blue-400 hover:bg-blue-500/10' : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                  }`}
              >
                <Wand2 size={11} />
                Use recommended: ₹{formatINR(recommended)}{billingMeta.unit}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

/* ─── Add Service Modal ────────────────────────────────────────────────── */
const AddServiceModal = ({ darkMode, onAdd, onClose, existingCodes }) => {
  const [step, setStep] = useState(1); // 1=pick preset, 2=custom name
  const [selected, setSelected] = useState(null);
  const [customName, setCustomName] = useState('');
  const inputRef = useRef(null);

  const available = SERVICE_PRESETS.filter(p => !existingCodes.includes(p.service_code) && !p.locked);

  const handlePickPreset = (preset) => {
    if (preset.service_code === 'custom') {
      setSelected(preset);
      setStep(2);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      onAdd({ ...preset, rate: 0, currency: 'INR', is_active: true });
    }
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    onAdd({
      service_code: `custom_${Date.now()}`,
      service_name: customName.trim(),
      billing_model: 'flat',
      icon: 'Sparkles',
      rate: 0,
      currency: 'INR',
      is_active: true,
    });
  };

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-md"
    >
      {/* Backdrop Capture */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`relative w-full max-w-md rounded-[24px] border p-5 shadow-2xl ${darkMode ? 'bg-neutral-900 border-white/10' : 'bg-white border-slate-200'
          }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">
              {step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
            </p>
            <h3 className={`text-[15px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {step === 1 ? 'Choose a Service' : 'Name Your Service'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${darkMode ? 'text-slate-400 hover:bg-white/10' : 'text-slate-400 hover:bg-slate-100'
              }`}
          >
            <X size={16} />
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-2">
            {available.length === 0 && (
              <div className="text-center py-8">
                <Check size={32} className="mx-auto text-emerald-500 mb-3" />
                <p className={`text-[12px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  All preset services added!
                </p>
              </div>
            )}
            {available.map((preset) => {
              const PresetIcon = getServiceIcon(preset.icon);
              return (
                <button
                  key={preset.service_code}
                  onClick={() => handlePickPreset(preset)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all hover:scale-[1.01] press-scale ${darkMode
                    ? 'border-white/8 hover:bg-white/8 hover:border-white/15'
                    : 'border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                    }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-white/8' : 'bg-slate-100'
                    }`}>
                    <PresetIcon size={16} className={darkMode ? 'text-slate-300' : 'text-slate-700'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] font-black truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {preset.service_name}
                    </p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      {BILLING_MODELS.find(b => b.code === preset.billing_model)?.label}
                    </p>
                  </div>
                  <ChevronDown size={14} className="text-slate-400 -rotate-90 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className={`flex items-center h-11 px-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/15' : 'bg-slate-50 border-slate-200'
              }`}>
              <Sparkles size={14} className="text-slate-400 mr-3 flex-shrink-0" />
              <input
                ref={inputRef}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                placeholder="e.g. Will Preparation, Divorce Consultation..."
                className={`bg-transparent border-none outline-none text-[12px] font-bold w-full ${darkMode ? 'text-white placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'
                  }`}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className={`flex-1 h-10 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all ${darkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
              >
                Back
              </button>
              <button
                onClick={handleAddCustom}
                disabled={!customName.trim()}
                className={`flex-1 h-10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${customName.trim()
                  ? darkMode ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
              >
                Add Service
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const LawyerFees = ({ darkMode, userData }) => {
  const experienceYears = useMemo(() => Number(
    userData?.lawyer_data?.years_of_experience ||
    userData?.lawyer_data?.experience ||
    userData?.experience || 0
  ), [userData]);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveErr, setSaveErr] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Load services from the new API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    const fetchServices = async () => {
      try {
        const response = await lawyerServiceAPI.getServices();
        let list = response.data || [];
        
        // Always ensure the basic consultation service is present in the UI
        if (!list.some(s => s.service_code === APPOINTMENT_SERVICE_CODE)) {
          list.unshift({
            ...SERVICE_PRESETS[0],
            rate: getRecommendedRate(experienceYears, 'per_minute'),
            currency: 'INR',
            is_active: true,
          });
        }

        // Attach icon + locked metadata from presets (some might come from DB, but preset UI overrides)
        const mappedList = list.map(s => ({
          ...s,
          icon: s.icon || SERVICE_PRESETS.find(p => p.service_code === s.service_code)?.icon || 'Briefcase',
          locked: SERVICE_PRESETS.find(p => p.service_code === s.service_code)?.locked || false,
        }));
        
        if (isMounted) {
          setServices(mappedList);
        }
      } catch (e) {
        console.error('Error loading professional services:', e);
        if (isMounted) {
          // Fallback to presets if API fails initially
          setServices([{
            ...SERVICE_PRESETS[0],
            rate: getRecommendedRate(experienceYears, 'per_minute'),
            currency: 'INR',
            is_active: true,
            icon: 'Clock3',
            locked: true
          }]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchServices();
    
    return () => { isMounted = false; };
  }, [experienceYears]);

  const updateService = useCallback((updated) => {
    setServices(prev => prev.map(s => s.service_code === updated.service_code ? { ...s, ...updated } : s));
  }, []);

  const deleteService = useCallback((code) => {
    setServices(prev => prev.filter(s => s.service_code !== code));
  }, []);

  const toggleService = useCallback((code) => {
    setServices(prev => prev.map(s => s.service_code === code ? { ...s, is_active: !s.is_active } : s));
  }, []);

  const addService = useCallback((newService) => {
    setServices(prev => [...prev, newService]);
    setShowAddModal(false);
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveMsg('');
    setSaveErr('');
    
    // Prepare the payload strictly for the new DB schema
    const payload = services.map(({ locked, ...rest }) => ({
      ...rest,
      // Ensure specific casts
      rate: Number(rest.rate) || 0,
      is_active: Boolean(rest.is_active !== false)
    }));
    
    try {
      await lawyerServiceAPI.syncServices(payload);
      setSaveMsg(`${payload.length} service${payload.length !== 1 ? 's' : ''} saved to database successfully.`);
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (e) {
      setSaveErr('Failed to save to database. Please try again.');
      console.error('Save service fees matrix error:', e);
    } finally {
      setSaving(false);
    }
  };

  // Summary stats
  const activeCount = services.filter(s => s.is_active !== false).length;
  const totalServices = services.length;
  const consultationRate = services.find(s => s.service_code === APPOINTMENT_SERVICE_CODE)?.rate || 0;
  const estMonthly = consultationRate > 0 ? Math.round(consultationRate * 30 * 3 * 22) : 0;

  const existingCodes = services.map(s => s.service_code);

  return (
    <div className="p-4 sm:p-5 space-y-5 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <PremiumBadge text="Fees Console" type="secondary" />
            <div className="h-0.5 w-0.5 rounded-full bg-slate-300" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Service Rate Builder
            </span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            My <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Services</span>
          </h1>
          <p className={`text-[11px] font-bold mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {activeCount} of {totalServices} services active · Clients see your rates before booking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className={`ripple-btn press-scale h-9 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${darkMode
              ? 'bg-white/10 border border-white/15 text-white hover:bg-white/15'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
              }`}
          >
            <Plus size={14} />
            Add Service
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className={`ripple-btn press-scale h-9 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 ${darkMode
              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
              }`}
          >
            <Save size={14} />
            {saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </div>

      {/* ── Status Messages ── */}
      <AnimatePresence>
        {saveMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`flex items-center gap-2 p-3 rounded-2xl border text-[11px] font-bold ${darkMode ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
          >
            <Check size={14} /> {saveMsg}
          </motion.div>
        )}
        {saveErr && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`flex items-center gap-2 p-3 rounded-2xl border text-[11px] font-bold ${darkMode ? 'bg-red-500/10 border-red-500/25 text-red-400' : 'bg-red-50 border-red-200 text-red-600'
              }`}
          >
            <AlertCircle size={14} /> {saveErr}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Summary Strip ── */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Active Services', value: String(activeCount), icon: Sparkles, color: 'text-blue-500', bg: darkMode ? 'bg-blue-500/10' : 'bg-blue-50', border: darkMode ? 'border-blue-500/15' : 'border-blue-100' },
            { label: 'Consultation Rate', value: consultationRate > 0 ? `₹${formatINR(consultationRate)}/min` : 'Not set', icon: Clock3, color: 'text-amber-500', bg: darkMode ? 'bg-amber-500/10' : 'bg-amber-50', border: darkMode ? 'border-amber-500/15' : 'border-amber-100' },
            { label: 'Est. Monthly (Consultations)', value: estMonthly > 0 ? `₹${formatINR(estMonthly)}` : '—', icon: TrendingUp, color: 'text-emerald-500', bg: darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50', border: darkMode ? 'border-emerald-500/15' : 'border-emerald-100' },
          ].map((stat, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl border ${stat.bg} ${stat.border}`}>
              <stat.icon size={16} className={stat.color} />
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                <p className={`text-[13px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Content Area: Loading vs Grid ── */}
      {loading ? (
        <div className={`w-full min-h-[300px] rounded-3xl border flex flex-col items-center justify-center p-8 transition-all ${darkMode ? 'bg-neutral-900/40 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
          <div className="relative flex items-center justify-center w-16 h-16">
            <svg className="animate-spin absolute w-full h-full text-brand-500/20" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
              <path className="opacity-75 text-brand-500" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <Briefcase size={20} className={darkMode ? 'text-brand-400 opacity-80' : 'text-brand-600 opacity-80'} />
          </div>
          <p className={`mt-4 text-[12px] font-black uppercase tracking-widest ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
            Syncing Service Fees
          </p>
          <div className="mt-4 flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-brand-500' : 'bg-brand-600'}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((service, idx) => (
            <ServiceCard
              key={service.service_code}
              service={service}
              darkMode={darkMode}
              experienceYears={experienceYears}
              onUpdate={updateService}
              onDelete={deleteService}
              onToggle={toggleService}
            />
          ))}

          {/* Add Service Lottie CTA */}
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            onClick={() => setShowAddModal(true)}
            className={`relative overflow-hidden rounded-2xl border flex flex-col items-center justify-center gap-2 min-h-[160px] transition-all duration-300 group ${darkMode
              ? 'bg-[#151515]/50 border-white/10 text-slate-400 hover:border-brand-500/50 shadow-lg shadow-black/20'
              : 'bg-white/50 border-slate-200/80 text-slate-500 hover:border-brand-400 shadow-xl shadow-slate-200/40'
              }`}
          >
            {/* Lottie Animation inside the CTA card */}
            <div className="w-16 h-16 opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500 scale-125 group-hover:scale-150">
              <Lottie
                loop
                animationData={lawyerSearchAnim}
                play
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center border shadow-sm transition-all duration-300 group-hover:rotate-90 group-hover:scale-110 ${darkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-200 text-slate-700'}`}>
              <Plus size={14} />
            </div>
            <div className="z-10 mt-1 flex flex-col items-center">
              <p className={`text-[11px] font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-800'}`}>Add Service</p>
              <p className="text-[9px] font-bold opacity-70">Consultation, Drafting, etc.</p>
            </div>
          </motion.button>
        </div>
      )}

      {/* ── Market benchmarks ── */}
      <div className={`mt-8 p-6 rounded-3xl border transition-all duration-300 ${darkMode ? 'bg-[#121212] border-white/10 shadow-2xl shadow-black/50' : 'bg-slate-50 border-slate-200/80 shadow-inner'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className={`text-[10px] font-black uppercase tracking-[0.25em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Market Rate Analysis
            </h3>
            <p className={`text-[12px] font-bold mt-1 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
              Recommended Per-Minute Consultation Fees by Experience
            </p>
          </div>
          <TrendingUp className={darkMode ? 'text-emerald-500/50' : 'text-emerald-500/80'} size={24} />
        </div>
        
        {/* Table layout instead of stacked cards for a more premium, zoomed-out feel */}
        <div className={`w-full overflow-x-auto rounded-xl border ${darkMode ? 'border-white/5 bg-white/[0.02]' : 'border-slate-200 bg-white'}`}>
          <div className="flex min-w-[500px]">
            {[
              { tier: 'Junior', exp: '0–2 yrs', rate: '₹25', color: 'text-blue-500', bg: darkMode ? 'hover:bg-blue-500/10' : 'hover:bg-blue-50' },
              { tier: 'Mid', exp: '2–5 yrs', rate: '₹35', color: 'text-amber-500', bg: darkMode ? 'hover:bg-amber-500/10' : 'hover:bg-amber-50' },
              { tier: 'Senior', exp: '5–10 yrs', rate: '₹50', color: 'text-emerald-500', bg: darkMode ? 'hover:bg-emerald-500/10' : 'hover:bg-emerald-50' },
              { tier: 'Expert', exp: '10–15 yrs', rate: '₹65', color: 'text-indigo-500', bg: darkMode ? 'hover:bg-indigo-500/10' : 'hover:bg-indigo-50' },
              { tier: 'Principal', exp: '15+ yrs', rate: '₹80', color: 'text-rose-500', bg: darkMode ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50' },
            ].map((t, i) => (
              <div key={i} className={`flex-1 flex flex-col items-center justify-center p-4 border-r last:border-r-0 transition-colors cursor-default ${darkMode ? 'border-white/5' : 'border-slate-100'} ${t.bg}`}>
                <span className={`text-[12px] font-black tracking-tight ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>{t.tier}</span>
                <span className={`text-[9px] font-bold text-slate-500 mb-2`}>{t.exp}</span>
                <span className={`text-[16px] font-black ${t.color}`}>{t.rate}<span className="text-[10px] ml-0.5 text-slate-400">/min</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Add Service Modal ── */}
      <AnimatePresence>
        {showAddModal && (
          <AddServiceModal
            darkMode={darkMode}
            onAdd={addService}
            onClose={() => setShowAddModal(false)}
            existingCodes={existingCodes}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LawyerFees;
