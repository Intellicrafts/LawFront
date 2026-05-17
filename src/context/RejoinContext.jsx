import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { consultationAPI } from '../api/apiService';
import { RejoinInviteModal } from '../components/ConsultationRejoin';
import {
  REJOIN_MESSAGE_TAG,
  canRejoinAppointment,
  isRejoinRequestMessage,
  normalizeAppointmentForRejoin,
} from '../utils/consultationRejoin';

const RejoinContext = createContext(null);

const POLL_MS = 2500;
const INVITE_COOLDOWN_MS = 45000;

export const RejoinProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  const [watchedAppointments, setWatchedAppointments] = useState([]);
  const [invite, setInvite] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [rejoiningId, setRejoiningId] = useState(null);

  const lastMessageIdsRef = useRef({});
  const lastInviteAtRef = useRef({});
  const dismissedUntilRef = useRef({});
  const signalIntervalRef = useRef(null);

  const registerAppointments = useCallback((appointments) => {
    const normalized = (appointments || [])
      .map(normalizeAppointmentForRejoin)
      .filter((apt) => canRejoinAppointment(apt) && (apt.session_token || apt.id));
    setWatchedAppointments(normalized);
  }, []);

  const clearRejoinSignal = useCallback(() => {
    if (signalIntervalRef.current) {
      clearInterval(signalIntervalRef.current);
      signalIntervalRef.current = null;
    }
  }, []);

  const pulseRejoinSignal = useCallback(
    async (sessionToken) => {
      clearRejoinSignal();
      let pulses = 0;
      const sendPulse = async () => {
        try {
          await consultationAPI.sendActionIndicator(sessionToken, 'typing');
        } catch {
          /* ignore */
        }
      };
      await sendPulse();
      signalIntervalRef.current = setInterval(() => {
        pulses += 1;
        if (pulses > 8) {
          clearRejoinSignal();
          return;
        }
        sendPulse();
      }, 2000);
    },
    [clearRejoinSignal]
  );

  const sendRejoinRequestMessage = useCallback(async (sessionToken) => {
    try {
      await consultationAPI.sendMessage(
        sessionToken,
        `${REJOIN_MESSAGE_TAG} Please rejoin the secure consultation chamber.`
      );
    } catch {
      /* session may not accept messages; typing pulse is fallback */
    }
  }, []);

  const requestRejoin = useCallback(
    async (appointment, { navigateToSession = true } = {}) => {
      const apt = normalizeAppointmentForRejoin(appointment);
      if (!apt?.id) return null;

      const appointmentId = apt.id;
      setRejoiningId(appointmentId);

      try {
        const result = await consultationAPI.startSession(appointmentId);
        const token = result?.session_token;
        if (!token) throw new Error('No session token');

        await pulseRejoinSignal(token);
        await sendRejoinRequestMessage(token);

        if (navigateToSession) {
          navigate(`/consultation/${token}?rejoin=1`);
        }

        return { sessionToken: token, ...result };
      } finally {
        setRejoiningId(null);
      }
    },
    [navigate, pulseRejoinSignal, sendRejoinRequestMessage]
  );

  const acceptInvite = useCallback(async () => {
    if (!invite?.sessionToken) return;
    setAccepting(true);
    try {
      const apt = invite.appointment;
      if (apt?.id) {
        await consultationAPI.startSession(apt.id);
      }
      navigate(`/consultation/${invite.sessionToken}?rejoin=1`);
      setInvite(null);
    } finally {
      setAccepting(false);
    }
  }, [invite, navigate]);

  const dismissInvite = useCallback(() => {
    if (invite?.sessionToken) {
      dismissedUntilRef.current[invite.sessionToken] = Date.now() + INVITE_COOLDOWN_MS;
    }
    setInvite(null);
  }, [invite]);

  const showInvite = useCallback((payload) => {
    const token = payload.sessionToken;
    if (!token) return;
    if (location.pathname === `/consultation/${token}`) return;

    const dismissedUntil = dismissedUntilRef.current[token] || 0;
    if (Date.now() < dismissedUntil) return;

    const lastAt = lastInviteAtRef.current[token] || 0;
    if (Date.now() - lastAt < 8000 && invite?.sessionToken === token) return;

    lastInviteAtRef.current[token] = Date.now();
    setInvite(payload);
  }, [location.pathname, invite?.sessionToken]);

  useEffect(() => {
    if (!watchedAppointments.length) return undefined;

    let cancelled = false;

    const poll = async () => {
      for (const apt of watchedAppointments) {
        if (cancelled) continue;

        let token = apt.session_token;
        if (!token || token === 'pending') continue;
        if (location.pathname === `/consultation/${token}`) continue;

        try {
          const [sessionData, messagesData] = await Promise.all([
            consultationAPI.getSession(token),
            consultationAPI.getMessages(token).catch(() => ({ messages: [] })),
          ]);

          const session = sessionData?.session;
          const messages = messagesData?.messages || [];
          const other = sessionData?.other_participant;
          const otherName =
            other?.full_name || other?.name || apt.client_name || apt.lawyerName || 'Participant';

          const latest = messages[messages.length - 1];
          const latestId = latest?.id || 0;
          const prevId = lastMessageIdsRef.current[token] || 0;

          if (latestId > prevId) {
            lastMessageIdsRef.current[token] = latestId;
            if (isRejoinRequestMessage(latest) && latest?.sender_type) {
              const myType = sessionData?.user_type;
              const fromOther =
                (myType === 'user' && latest.sender_type === 'lawyer') ||
                (myType === 'lawyer' && latest.sender_type === 'user');
              if (fromOther) {
                showInvite({
                  type: 'request',
                  sessionToken: token,
                  appointment: apt,
                  participantName: otherName,
                });
                continue;
              }
            }
          }

          if (
            sessionData?.other_participant_joined &&
            session &&
            ['waiting', 'active'].includes(session.status) &&
            messages.length === 0
          ) {
            showInvite({
              type: 'presence',
              sessionToken: token,
              appointment: apt,
              participantName: otherName,
            });
          }
        } catch {
          /* ignore polling errors */
        }
      }
    };

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [watchedAppointments, location.pathname, showInvite]);

  useEffect(() => () => clearRejoinSignal(), [clearRejoinSignal]);

  const value = useMemo(
    () => ({
      registerAppointments,
      requestRejoin,
      rejoiningId,
      inviteOpen: Boolean(invite),
    }),
    [registerAppointments, requestRejoin, rejoiningId, invite]
  );

  return (
    <RejoinContext.Provider value={value}>
      {children}
      <RejoinInviteModal
        open={Boolean(invite)}
        invite={invite}
        isDarkMode={isDarkMode}
        onDismiss={dismissInvite}
        onAccept={acceptInvite}
        accepting={accepting}
      />
    </RejoinContext.Provider>
  );
};

export const useRejoin = () => {
  const ctx = useContext(RejoinContext);
  if (!ctx) {
    throw new Error('useRejoin must be used within RejoinProvider');
  }
  return ctx;
};

export default RejoinContext;
