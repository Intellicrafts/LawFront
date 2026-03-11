export const APPOINTMENT_SERVICE_CODE = 'appointment';

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const normalizeConsultationFeeList = (consultationFee) => {
  // New format: array of service fee objects
  if (Array.isArray(consultationFee)) {
    return consultationFee;
  }

  // Legacy fallback: single numeric/string fee
  const legacyRate = toNumber(consultationFee);
  if (legacyRate > 0) {
    return [{
      service_code: APPOINTMENT_SERVICE_CODE,
      service_name: 'Appointment Consultation',
      billing_model: 'per_minute',
      rate: legacyRate,
      currency: 'INR',
      is_active: true,
    }];
  }

  return [];
};

export const getAppointmentRatePerMinute = (consultationFee) => {
  const list = normalizeConsultationFeeList(consultationFee);

  const appointmentService = list.find((item) =>
    item?.service_code === APPOINTMENT_SERVICE_CODE &&
    item?.billing_model === 'per_minute' &&
    item?.is_active !== false
  );

  if (appointmentService) {
    return toNumber(appointmentService.rate);
  }

  // Fallback if service metadata is partial but rate exists
  const firstWithRate = list.find((item) => toNumber(item?.rate) > 0);
  return firstWithRate ? toNumber(firstWithRate.rate) : 0;
};

export const buildAppointmentConsultationFee = (rate) => {
  const normalizedRate = Math.max(0, toNumber(rate));
  return [{
    service_code: APPOINTMENT_SERVICE_CODE,
    service_name: 'Appointment Consultation',
    billing_model: 'per_minute',
    rate: normalizedRate,
    currency: 'INR',
    is_active: true,
  }];
};

export const formatRatePerMinuteLabel = (consultationFee) => {
  const rate = getAppointmentRatePerMinute(consultationFee);
  if (rate <= 0) return 'Free';
  return `₹${Number(rate).toLocaleString('en-IN')}/min`;
};
