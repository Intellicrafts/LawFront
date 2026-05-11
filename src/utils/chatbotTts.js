/**
 * Chatbot TTS — natural voice via REACT_APP_CHATBOT_API_URL /tts
 * Optional REACT_APP_TTS_VOICE (default nova). Language hint for Indian English / Hindi.
 */

export const CHATBOT_TTS_VOICE = process.env.REACT_APP_TTS_VOICE || 'nova';

export function stripTextForTts(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let cleanText = raw;
  [
    /Analyzing query\.{1,3}/gi,
    /Found in Semantic Cache/gi,
    /Generating response/gi,
    /^[a-z_]{2,}(?:\.{1,3}|[:\s!]|(?=[A-Z\s!]))/i,
    /\b[a-z_]{2,}_[a-z_]{2,}\b/gi,
    /(\*\*|__|#|\*|-|>|\[|\])/g,
  ].forEach((p) => {
    cleanText = cleanText.replace(p, '');
  });
  return cleanText.trim();
}

/**
 * @param {string} text — plain or markdown (stripped internally)
 * @param {{ voice?: string, language?: string }} options
 * @returns {Promise<string>} object URL — caller must revoke when done
 */
export async function fetchChatbotTtsBlobUrl(text, options = {}) {
  const cleaned = stripTextForTts(text);
  if (!cleaned) throw new Error('EMPTY_TTS');

  const baseUrl = (process.env.REACT_APP_CHATBOT_API_URL || '').replace(/\/$/, '');
  if (!baseUrl) throw new Error('NO_CHATBOT_URL');

  const voice = options.voice || CHATBOT_TTS_VOICE;
  const payload = { text: cleaned, voice };
  if (options.language) payload.language = options.language;

  const response = await fetch(`${baseUrl}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`TTS_${response.status}`);

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

/**
 * Browser speech fallback with optional lifecycle callbacks.
 * @returns {boolean} whether synthesis was scheduled
 */
export function speakWithBrowserTts(text, langHint = 'en-IN', callbacks = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  const clean = stripTextForTts(text);
  if (!clean) return false;

  const run = () => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = langHint;
    u.rate = 0.96;
    const voices = window.speechSynthesis.getVoices();
    const short = (langHint || 'en').split('-')[0];
    const pick =
      voices.find((v) => v.lang === langHint) ||
      voices.find((v) => new RegExp(`^${short}`, 'i').test(v.lang || '')) ||
      voices.find((v) => /hi-IN/i.test(v.lang || '')) ||
      voices.find((v) => /en-IN/i.test(v.lang || '')) ||
      voices.find((v) => /^en/i.test(v.lang || ''));
    if (pick) u.voice = pick;
    u.onstart = () => callbacks.onStart?.();
    u.onend = () => callbacks.onEnd?.();
    u.onerror = () => callbacks.onEnd?.();
    window.speechSynthesis.speak(u);
  };

  let started = false;
  const startOnce = () => {
    if (started) return;
    started = true;
    window.speechSynthesis.removeEventListener('voiceschanged', startOnce);
    run();
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    startOnce();
    return true;
  }
  window.speechSynthesis.addEventListener('voiceschanged', startOnce);
  setTimeout(startOnce, 120);
  return true;
}
