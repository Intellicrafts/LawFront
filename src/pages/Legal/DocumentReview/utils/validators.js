/**
 * Field-level validators. Each validator returns either `null` (valid) or a
 * human-friendly error message string. They are referenced by the `validation`
 * key on a template variable, e.g. { validation: 'pan' }.
 */

const trim = (v) => (v == null ? '' : String(v).trim());

export const validators = {
  required: (value) => (trim(value) === '' ? 'This field is required' : null),

  pan: (value) => {
    const v = trim(value).toUpperCase();
    if (v === '') return null;
    return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v)
      ? null
      : 'Enter a valid 10-character PAN (e.g. ABCDE1234F)';
  },

  aadhaar: (value) => {
    const v = trim(value).replace(/\s/g, '');
    if (v === '') return null;
    return /^[2-9]{1}[0-9]{11}$/.test(v)
      ? null
      : 'Enter a valid 12-digit Aadhaar number';
  },

  phone: (value) => {
    const v = trim(value).replace(/[\s+-]/g, '');
    if (v === '') return null;
    return /^(91)?[6-9]\d{9}$/.test(v)
      ? null
      : 'Enter a valid 10-digit Indian mobile number';
  },

  email: (value) => {
    const v = trim(value);
    if (v === '') return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter a valid email address';
  },

  currency: (value) => {
    const v = trim(value);
    if (v === '') return null;
    const n = Number(v.replace(/[,]/g, ''));
    if (!Number.isFinite(n) || n < 0) return 'Enter a valid positive amount';
    return null;
  },

  number: (value) => {
    const v = trim(value);
    if (v === '') return null;
    return Number.isFinite(Number(v)) ? null : 'Enter a valid number';
  },

  date: (value) => {
    const v = trim(value);
    if (v === '') return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? 'Enter a valid date' : null;
  },

  pincode: (value) => {
    const v = trim(value);
    if (v === '') return null;
    return /^[1-9]\d{5}$/.test(v) ? null : 'Enter a valid 6-digit pincode';
  },
};

/** Run all applicable validators for a variable. Returns first error or null. */
export const validateField = (variable, value) => {
  if (variable.required) {
    const err = validators.required(value);
    if (err) return err;
  }
  if (variable.validation && validators[variable.validation]) {
    const err = validators[variable.validation](value);
    if (err) return err;
  }
  return null;
};

/** Validate an entire variables map. Returns an `{ [key]: error }` map. */
export const validateAll = (variables, values) => {
  const errors = {};
  variables.forEach((v) => {
    const e = validateField(v, values[v.key]);
    if (e) errors[v.key] = e;
  });
  return errors;
};

export default validators;
