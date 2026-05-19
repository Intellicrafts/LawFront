/** Rejoin window + session helpers */

import { consultationAPI } from '../api/apiService';

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

/** Session was terminated and can be resumed within the appointment slot. */
export const needsRejoin = (appointment, now = new Date()) => {
  if (!appointment) return false;
  if (appointment.status === 'cancelled') return false;
  if (!isWithinRejoinWindow(appointment, now)) return false;
  return (
    appointment.status === 'completed' ||
    appointment.consultation_status === 'completed'
  );
};

export const showViewReportOnly = (appointment, now = new Date()) => {
  if (!appointment) return true;
  if (appointment.status === 'cancelled') return true;
  return !isWithinRejoinWindow(appointment, now);
};

/** Skip lobby only on explicit rejoin navigation after a prior session. */
export const shouldSkipLobbyOnRejoin = (session, messages = [], isRejoinRoute = false) => {
  if (!isRejoinRoute) return false;
  if (messages?.length > 0) return true;
  return Boolean(session?.user_joined_at && session?.lawyer_joined_at);
};

/**
 * Start session (reactivates on backend) and return navigation target.
 */
export const startRejoinSession = async (appointment) => {
  const appointmentId = appointment?.id || appointment?.appointment_id;
  if (!appointmentId) {
    throw new Error('Invalid appointment');
  }
  const result = await consultationAPI.startSession(appointmentId, { rejoin: true });
  const token = result?.session_token;
  if (!token) {
    throw new Error('No session token received');
  }
  return { sessionToken: token, result };
};
