import { useCallback, useEffect, useRef, useState } from 'react';
import { documentApi } from '../api/documentApi';

/**
 * Hook that wraps the documentApi stub for the AI chat flow.
 * Backend team: swap `documentApi` with the real HTTP service — the hook stays.
 */
export const useAIAssistant = (template, { onVariablesUpdate, onComplete } = {}) => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);
  const initialisingRef = useRef(false);

  // Initialise a session once when the template is set.
  useEffect(() => {
    if (!template || initialisingRef.current) return;
    initialisingRef.current = true;
    let cancelled = false;

    (async () => {
      try {
        setIsTyping(true);
        setError(null);
        const { sessionId: sid, firstMessage } = await documentApi.startSession(template.id);
        if (cancelled) return;
        setSessionId(sid);
        setMessages([
          {
            id: `m-${Date.now()}`,
            role: 'assistant',
            content: firstMessage,
            ts: Date.now(),
          },
        ]);
        setProgress(0);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not start the AI session');
      } finally {
        if (!cancelled) setIsTyping(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // Intentionally omit other deps — we only re-init on a fresh template.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template?.id]);

  const send = useCallback(
    async (text) => {
      if (!sessionId || isTyping || isComplete) return;
      const trimmed = (text || '').trim();
      const userMsg = {
        id: `m-${Date.now()}`,
        role: 'user',
        content: trimmed || '(skipped)',
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      setError(null);

      try {
        const res = await documentApi.sendMessage(sessionId, trimmed);
        const reply = {
          id: `m-${Date.now() + 1}`,
          role: 'assistant',
          content: res.reply,
          ts: Date.now(),
        };
        setMessages((prev) => [...prev, reply]);
        setProgress(res.progress);
        if (res.extractedVariables && Object.keys(res.extractedVariables).length && onVariablesUpdate) {
          onVariablesUpdate(res.extractedVariables);
        }
        if (res.isComplete) {
          setIsComplete(true);
          const { variables } = await documentApi.finalize(sessionId);
          if (onComplete) onComplete(variables);
        }
      } catch (e) {
        setError(e.message || 'The assistant ran into a hiccup. Please try again.');
        setMessages((prev) => [
          ...prev,
          {
            id: `m-${Date.now() + 1}`,
            role: 'assistant',
            content: 'Sorry, something went wrong. Could you please repeat your last answer?',
            ts: Date.now(),
            isError: true,
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [sessionId, isTyping, isComplete, onVariablesUpdate, onComplete]
  );

  return {
    sessionId,
    messages,
    isTyping,
    isComplete,
    error,
    progress,
    send,
  };
};

export default useAIAssistant;
