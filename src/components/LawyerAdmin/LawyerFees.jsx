import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IndianRupee, Wand2, Sparkles, Clock3, Save, Plus, Trash2,
  FileText, Home, Scale, Briefcase, ChevronDown, Check, X,
  Edit3, ToggleLeft, ToggleRight, AlertCircle, TrendingUp
} from 'lucide-react';
import { getAppointmentRatePerMinute, buildAppointmentConsultationFee, normalizeConsultationFeeList, APPOINTMENT_SERVICE_CODE } from '../../utils/consultationFee';
import { authAPI } from '../../api/apiService';

/* ─── Shared UI ────────────────────────────────────────────────────────── */
const GlassCard = ({ children, className = '', darkMode, hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -2 } : {}}
    className={`relative overflow-hidden rounded-[20px] border transition-all duration-300
      ${darkMode ? 'bg-neutral-900/60 border-white/6 backdrop-blur-xl' : 'bg-white/80 border-slate-200/50 backdrop-blur-lg shadow-sm'}
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
      hover={false}
      className={`p-5 flex flex-col gap-4 transition-all duration-300 stagger-item ${!isActive ? 'opacity-50 grayscale' : ''
        } ${isLocked ? (darkMode ? 'border-brand-500/20' : 'border-brand-300/40') : ''}`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-white/8 text-white' : 'bg-slate-100 text-slate-800'
            }`}>
            <Icon size={18} />
          </div>
          <div>
            {editing && !isLocked ? (
              <input
                className={`text-[14px] font-black bg-transparent border-b outline-none w-full pb-0.5 ${darkMode ? 'border-white/20 text-white' : 'border-slate-300 text-slate-900'
                  }`}
                value={localName}
                onChange={(e) => { setLocalName(e.target.value); markChanged(); }}
                placeholder="Service name"
              />
            ) : (
              <p className={`text-[13px] font-black leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {service.service_name}
              </p>
            )}
            <div className="flex items-center gap-1.5 mt-1">
              <PremiumBadge text={billingMeta.label} type={isActive ? 'info' : 'secondary'} />
              {isLocked && <PremiumBadge text="Core Service" type="success" />}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
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
      <div className={`flex items-center justify-center py-3 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
        <span className={`text-4xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          <span className="text-xl align-top mt-1 inline-block mr-1 font-bold text-slate-400">₹</span>
          {formatINR(editing ? localRate : service.rate) || '—'}
        </span>
        <span className={`text-xs font-bold ml-2 mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

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
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const LawyerFees = ({ darkMode, userData }) => {
  const experienceYears = useMemo(() => Number(
    userData?.lawyer_data?.years_of_experience ||
    userData?.lawyer_data?.experience ||
    userData?.experience || 0
  ), [userData]);

  const [services, setServices] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveErr, setSaveErr] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Load services directly from API data — no localStorage
  useEffect(() => {
    try {
      const feeSource = userData?.lawyer_data?.consultation_fee;
      const list = normalizeConsultationFeeList(feeSource);

      // Always ensure the consultation service is present
      if (!list.some(s => s.service_code === APPOINTMENT_SERVICE_CODE)) {
        list.unshift({
          ...SERVICE_PRESETS[0],
          rate: getRecommendedRate(experienceYears, 'per_minute'),
          currency: 'INR',
          is_active: true,
        });
      }

      // Attach icon + locked metadata from presets
      setServices(list.map(s => ({
        ...s,
        icon: SERVICE_PRESETS.find(p => p.service_code === s.service_code)?.icon || 'Briefcase',
        locked: SERVICE_PRESETS.find(p => p.service_code === s.service_code)?.locked || false,
      })));
    } catch (e) {
      console.error('Error loading fees:', e);
    }
  }, [userData?.lawyer_data?.consultation_fee, experienceYears]);

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
    const payload = services.map(({ icon, locked, ...rest }) => rest);
    try {
      // Send full services array as JSON string inside lawyer_data.consultation_fee.
      // Same pattern as LawyerProfile.jsx — backend will store it.
      // When the backend column is upgraded to support JSON, it will persist naturally.
      await authAPI.updateUserProfile({
        lawyer_data: {
          consultation_fee: JSON.stringify(payload),
        },
      });
      setSaveMsg(`${payload.length} service${payload.length !== 1 ? 's' : ''} saved successfully.`);
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (e) {
      setSaveErr('Failed to save. Please try again.');
      console.error('Save fees error:', e);
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

      {/* ── Service Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

        {/* Add Service Empty CTA */}
        <button
          onClick={() => setShowAddModal(true)}
          className={`rounded-[20px] border-2 border-dashed p-5 flex flex-col items-center justify-center gap-2 min-h-[180px] transition-all hover:scale-[1.01] press-scale ${darkMode
            ? 'border-white/10 text-slate-600 hover:border-white/20 hover:text-slate-400'
            : 'border-slate-200 text-slate-300 hover:border-slate-300 hover:text-slate-500'
            }`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 border-dashed ${darkMode ? 'border-white/20' : 'border-slate-300'
            }`}>
            <Plus size={18} />
          </div>
          <p className="text-[11px] font-black uppercase tracking-widest">Add Service</p>
          <p className="text-[9px] font-bold">Consultation, Drafting, etc.</p>
        </button>
      </div>

      {/* ── Market benchmarks ── */}
      <GlassCard darkMode={darkMode} className="p-5">
        <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Market Rate Benchmarks · Consultation
        </h3>
        <div className="space-y-2">
          {[
            { tier: 'Junior (0–2 yrs)', rate: '₹25/min', color: 'text-blue-500', bg: darkMode ? 'bg-blue-500/10' : 'bg-blue-50', border: darkMode ? 'border-blue-500/20' : 'border-blue-100' },
            { tier: 'Mid (2–5 yrs)', rate: '₹35/min', color: 'text-amber-500', bg: darkMode ? 'bg-amber-500/10' : 'bg-amber-50', border: darkMode ? 'border-amber-500/20' : 'border-amber-100' },
            { tier: 'Senior (5–10 yrs)', rate: '₹50/min', color: 'text-emerald-500', bg: darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50', border: darkMode ? 'border-emerald-500/20' : 'border-emerald-100' },
            { tier: 'Expert (10–15 yrs)', rate: '₹65/min', color: 'text-indigo-500', bg: darkMode ? 'bg-indigo-500/10' : 'bg-indigo-50', border: darkMode ? 'border-indigo-500/20' : 'border-indigo-100' },
            { tier: 'Principal (15+ yrs)', rate: '₹80/min', color: 'text-rose-500', bg: darkMode ? 'bg-rose-500/10' : 'bg-rose-50', border: darkMode ? 'border-rose-500/20' : 'border-rose-100' },
          ].map((t, i) => (
            <div key={i} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${t.bg} ${t.border}`}>
              <span className={`text-[11px] font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.tier}</span>
              <span className={`text-[12px] font-black ${t.color}`}>{t.rate}</span>
            </div>
          ))}
        </div>
      </GlassCard>

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
