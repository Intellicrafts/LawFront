/**
 * Document AI generation API.
 *
 * =============================================================================
 * BACKEND TEAM: This module is intentionally stubbed on the frontend.
 *
 * To wire the real backend AI, replace the three functions below
 * (startSession, sendMessage, finalize) with HTTP calls to your endpoints.
 * The function SIGNATURES and the RETURN-SHAPE of each promise are the
 * contract the UI depends on — keep them stable.
 *
 * Suggested endpoint layout (under the existing /api prefix used by httpClient):
 *
 *   POST  /documents/generate/start            { templateId, schema }
 *         -> { sessionId, firstMessage }
 *
 *   POST  /documents/generate/:sessionId/turn  { message, collectedVariables }
 *         -> { reply, extractedVariables, isComplete }
 *
 *   POST  /documents/generate/:sessionId/finalize  { collectedVariables }
 *         -> { variables }
 *
 * For now, the stub walks the template's `variables[]` array one variable per
 * turn, so the UI is fully functional end-to-end without the backend.
 * =============================================================================
 */

import { getTemplateById } from '../data/templates';

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const greetings = [
  "Hi there! I'm your AI legal assistant. I'll help you generate your document by asking a few simple questions. Ready when you are!",
  "Hello! Let's create your document together. I'll ask you a few details and craft the rest. Shall we begin?",
  "Welcome — I'll guide you through generating your document conversationally. We'll need just a few details from you.",
];

const promptsFor = (variable) => {
  const label = variable.label || variable.key;
  if (variable.type === 'date') return `Got it. What is the ${label.toLowerCase()}? (format: DD-MM-YYYY)`;
  if (variable.type === 'number' || variable.validation === 'currency') {
    return `Please share the ${label.toLowerCase()}. You can enter just the number.`;
  }
  if (variable.type === 'textarea') return `Could you describe the ${label.toLowerCase()}?`;
  if (variable.type === 'select' && Array.isArray(variable.options)) {
    return `Please choose one for ${label.toLowerCase()}: ${variable.options.join(' / ')}.`;
  }
  return `Could you tell me the ${label.toLowerCase()}?`;
};

const ackFor = (variable, value) => {
  if (!value) return 'No worries, I will leave that blank for now.';
  const v = String(value);
  const short = v.length > 60 ? `${v.slice(0, 57)}…` : v;
  return `Noted — ${variable.label || variable.key}: ${short}.`;
};

const buildSession = (templateId) => {
  const template = getTemplateById(templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);
  return {
    sessionId: `local-${templateId}-${Date.now()}`,
    template,
    pointer: 0,
    collected: {},
  };
};

const sessionStore = new Map();

export const documentApi = {
  /**
   * Start a new AI generation session for a template.
   * @param {string} templateId
   * @returns {Promise<{ sessionId: string, firstMessage: string, totalQuestions: number }>}
   */
  startSession: async (templateId) => {
    // TODO: integrate backend AI API — replace this stub with an HTTP call.
    await wait(450);
    const session = buildSession(templateId);
    sessionStore.set(session.sessionId, session);

    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    const firstVar = session.template.variables[0];
    const firstMessage = `${greeting}\n\nLet's start: ${promptsFor(firstVar)}`;
    return {
      sessionId: session.sessionId,
      firstMessage,
      totalQuestions: session.template.variables.length,
    };
  },

  /**
   * Process a user message, capture the answer, ask the next question.
   * @param {string} sessionId
   * @param {string} userMessage
   * @returns {Promise<{ reply: string, extractedVariables: object, isComplete: boolean, askedKey: string|null, progress: number }>}
   */
  sendMessage: async (sessionId, userMessage) => {
    // TODO: integrate backend AI API — replace this stub with an HTTP call.
    await wait(550 + Math.random() * 500);
    const session = sessionStore.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    const variables = session.template.variables;
    const current = variables[session.pointer];
    let extractedVariables = {};

    if (current) {
      const trimmed = String(userMessage || '').trim();
      // Special handling — for "skip" or empty, treat as skipped.
      if (trimmed === '' || /^(skip|n\/a|none)$/i.test(trimmed)) {
        session.collected[current.key] = '';
      } else {
        session.collected[current.key] = trimmed;
        extractedVariables = { [current.key]: trimmed };
      }
      session.pointer += 1;
    }

    const nextVariable = variables[session.pointer];
    const progress = Math.round((session.pointer / variables.length) * 100);

    if (!nextVariable) {
      return {
        reply: `Wonderful — I have everything I need. Let me put together your ${session.template.name}. You can review the preview on the right (or below on mobile) and proceed to download when ready.`,
        extractedVariables,
        isComplete: true,
        askedKey: null,
        progress: 100,
      };
    }

    const reply = `${current ? ackFor(current, session.collected[current.key]) : ''}\n\n${promptsFor(nextVariable)}`.trim();
    return {
      reply,
      extractedVariables,
      isComplete: false,
      askedKey: nextVariable.key,
      progress,
    };
  },

  /**
   * Finalise the session and return the collected variables map.
   * @param {string} sessionId
   * @returns {Promise<{ variables: object }>}
   */
  finalize: async (sessionId) => {
    // TODO: integrate backend AI API — replace this stub with an HTTP call.
    await wait(300);
    const session = sessionStore.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);
    return { variables: { ...session.collected } };
  },

  /** Returns the variable being asked next (for the UI to highlight in the form/preview). */
  peekNextKey: (sessionId) => {
    const session = sessionStore.get(sessionId);
    if (!session) return null;
    const v = session.template.variables[session.pointer];
    return v ? v.key : null;
  },
};

export default documentApi;
