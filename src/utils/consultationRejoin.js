/** Rejoin window + session helpers (frontend-only; no backend changes). */

export const REJOIN_MESSAGE_TAG = '[MV_REJOIN_REQUEST]';

export const getAppointmentStart = (appointment) => {
  const raw = appointment?.appointment_time || appointment?.dateObj;
  if (!raw) return null;
  return raw instanceof Date ? raw : new Date(raw);
};

export const getAppointmentEnd = (appointment) => {
  const start = getAppointmentStart(appointment);
  if (!start || Number.isNaN(start.getTime())) return null;
  const durationMinutes = appointment?.duration_minutes ?? 60;
  return new Date(start.getTime() + durationMinutes * 60 * 1000);
};

/** True while current time is within [start, end] of the appointment. */
export const isWithinRejoinWindow = (appointment, now = new Date()) => {
  const start = getAppointmentStart(appointment);
  const end = getAppointmentEnd(appointment);
  if (!start || !end) return false;
  return now >= start && now <= end;
};

export const getRejoinTimeRemaining = (appointment, now = new Date()) => {
  const end = getAppointmentEnd(appointment);
  if (!end) return null;
  const ms = end.getTime() - now.getTime();
  if (ms <= 0) return null;
  return {
    totalSeconds: Math.floor(ms / 1000),
    minutes: Math.floor(ms / (60 * 1000)),
    seconds: Math.floor((ms % (60 * 1000)) / 1000),
  };
};

export const canRejoinAppointment = (appointment, now = new Date()) => {
  if (!appointment) return false;
  if (appointment.status === 'cancelled') return false;
  return isWithinRejoinWindow(appointment, now);
};

export const shouldSkipLobby = (session, messages = [], isRejoinRoute = false) => {
  if (isRejoinRoute) return true;
  if (messages?.length > 0) return true;
  return Boolean(session?.user_joined_at && session?.lawyer_joined_at);
};

export const isSessionTerminallyEnded = (session, now = new Date()) => {
  if (!session) return true;
  if (['cancelled', 'expired'].includes(session.status)) return true;
  const end = session.scheduled_end_time ? new Date(session.scheduled_end_time) : null;
  if (end && now > end) return true;
  if (session.status === 'completed' && end && now <= end) return false;
  if (session.status === 'completed') return true;
  return false;
};

export const normalizeAppointmentForRejoin = (apt) => {
  if (!apt) return null;
  const start = getAppointmentStart(apt);
  return {
    ...apt,
    id: apt.id || apt.appointment_id,
    appointment_id: apt.appointment_id || apt.id,
    dateObj: start,
    session_token: apt.session_token,
  };
};

export const isRejoinRequestMessage = (message) => {
  const content = message?.content || message?.message || '';
  return typeof content === 'string' && content.includes(REJOIN_MESSAGE_TAG);
};
