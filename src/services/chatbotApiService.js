/**
 * Chatbot API Service
 * Production-ready, optimized service for AI-powered legal chatbot
 * 
 * Features:
 * - Session management
 * - Automatic retry with exponential backoff
 * - Real-time response streaming support (SSE)
 * - Error handling and recovery
 * - Request caching and deduplication
 */

// API Configuration
// Point 1: Using empty BASE_URL to utilize the 'proxy' in package.json
// This bypasses CORS issues (405 Method Not Allowed on OPTIONS) during development
const API_CONFIG = {
    BASE_URL: (() => {
        const url = process.env.REACT_APP_CHATBOT_API_URL ? process.env.REACT_APP_CHATBOT_API_URL.replace(/\/$/, '') : '';
        console.log(`[ChatbotAPI] Initializing with BASE_URL: "${url}"`);
        if (!url) {
            console.error('[ChatbotAPI] CRITICAL: REACT_APP_CHATBOT_API_URL is NOT defined in environment variables.');
        }
        return url;
    })(),
    ENDPOINTS: {
        CHAT: '/unified_chat',
    },
    TIMEOUT: 60000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
};

// Available AI Models/Agents
export const AI_MODELS = {
    LEGAL_COUNSEL: 'legal_counsel',
    NYAAYA: 'nyaaya',
    MUNSHI: 'munshi',
    ADALAT: 'adalat',
};

// Chat states for UI feedback
export const CHAT_STATES = {
    IDLE: 'idle',
    CONNECTING: 'connecting',
    ANALYZING: 'analyzing',
    RESEARCHING: 'researching',
    DRAFTING: 'drafting',
    STREAMING: 'streaming',
    COMPLETE: 'complete',
    ERROR: 'error',
};

// State messages for professional UI display
export const STATE_MESSAGES = {
    [CHAT_STATES.CONNECTING]: 'Connecting to legal expert...',
    [CHAT_STATES.ANALYZING]: 'Analyzing your query...',
    [CHAT_STATES.RESEARCHING]: 'Researching legal precedents...',
    [CHAT_STATES.DRAFTING]: 'Drafting response...',
    [CHAT_STATES.STREAMING]: 'Generating response...',
    [CHAT_STATES.COMPLETE]: 'Response complete',
    [CHAT_STATES.ERROR]: 'An error occurred',
};

/**
 * Session Manager - Handles chatbot session lifecycle
 */
class SessionManager {
    constructor() {
        this.sessions = new Map();
        this.storageKey = 'chatbot_sessions';
        this.loadFromStorage();
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                Object.entries(data).forEach(([key, value]) => {
                    this.sessions.set(key, value);
                });
            }
        } catch (e) {
            console.warn('Failed to load sessions from storage');
        }
    }

    saveToStorage() {
        try {
            const data = Object.fromEntries(this.sessions);
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save sessions to storage');
        }
    }

    createSession(userId, appName = AI_MODELS.LEGAL_COUNSEL) {
        // Generate a compact sessionId as expected by backend
        const sessionId = Math.random().toString(36).substring(2, 11);
        const session = {
            id: sessionId,
            userId,
            appName,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            messageCount: 0,
            initialized: false
        };
        this.sessions.set(sessionId, session);
        this.saveToStorage();
        return session;
    }

    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }

    updateSession(sessionId, updates) {
        const session = this.sessions.get(sessionId);
        if (session) {
            const updated = { ...session, ...updates, lastActivity: new Date().toISOString() };
            this.sessions.set(sessionId, updated);
            this.saveToStorage();
            return updated;
        }
        return null;
    }

    isSessionInitialized(sessionId) {
        const session = this.sessions.get(sessionId);
        return session && session.initialized === true;
    }

    markSessionInitialized(sessionId) {
        this.updateSession(sessionId, { initialized: true });
    }

    getOrCreateSession(userId, appName) {
        // Find existing active session for this user and app
        for (const [, session] of this.sessions) {
            if (session.userId === userId && session.appName === appName) {
                const age = Date.now() - new Date(session.createdAt).getTime();
                if (age < 24 * 60 * 60 * 1000) {
                    return session;
                }
            }
        }
        return this.createSession(userId, appName);
    }

    clearSession(sessionId) {
        this.sessions.delete(sessionId);
        this.saveToStorage();
    }

    clearAllSessions() {
        this.sessions.clear();
        this.saveToStorage();
    }
}

/**
 * Request Queue - Prevents duplicate requests
 */
class RequestQueue {
    constructor() {
        this.pending = new Map();
    }

    async enqueue(key, requestFn) {
        if (this.pending.has(key)) {
            return this.pending.get(key);
        }

        const promise = requestFn().finally(() => {
            this.pending.delete(key);
        });

        this.pending.set(key, promise);
        return promise;
    }

    cancelAll() {
        this.pending.clear();
    }
}

/**
 * Sleep utility
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Main Chatbot API Service
 */
class ChatbotApiService {
    constructor() {
        this.sessionManager = new SessionManager();
        this.requestQueue = new RequestQueue();
        this.abortControllers = new Map();
    }

    getUserId() {
        try {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                const userId = userData.id || userData.email || userData.user_id;
                if (userId !== undefined && userId !== null) {
                    return String(userId);
                }
            }
        } catch (e) { }

        let guestId = localStorage.getItem('guest_user_id');
        if (!guestId) {
            guestId = 'g_' + Math.random().toString(36).substring(2, 10);
            localStorage.setItem('guest_user_id', guestId);
        }
        return String(guestId);
    }

    buildPayload(message, appName, sessionId, streaming = true) {
        return {
            app_name: appName,
            user_id: this.getUserId(),
            session_id: sessionId,
            new_message: {
                role: 'user',
                parts: [{ text: message }],
            },
            streaming,
        };
    }

    async initializeBackendSession(appName, userId, sessionId) {
        try {
            const baseUrl = API_CONFIG.BASE_URL;
            const url = `${baseUrl}/apps/${appName}/users/${userId}/sessions`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    state: {}
                })
            });

            if (!response.ok) {
                if (response.status === 409) {
                    console.log(`[ChatbotAPI] Session already exists (409), continuing...`);
                } else {
                    console.warn(`[ChatbotAPI] Session initialization failed: ${response.status}`);
                }
            } else {
                console.log(`[ChatbotAPI] Session initialized successfully`);
            }

            this.sessionManager.markSessionInitialized(sessionId);
            return true;
        } catch (error) {
            console.warn('[ChatbotAPI] Session initialization error:', error);
            this.sessionManager.markSessionInitialized(sessionId);
            return false;
        }
    }

    /**
     * Send a message and handle real-time streaming
     */
    async sendMessage(message, appName = AI_MODELS.LEGAL_COUNSEL, onStateChange = () => { }, existingSessionId = null, onChunk = null) {
        const userId = this.getUserId();
        const sessionId = existingSessionId || `session_${Date.now()}`;
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT}`;

        const payload = {
            app_name: appName,
            user_id: userId,
            session_id: sessionId,
            new_message: {
                role: 'user',
                parts: [{ text: message }]
            },
            streaming: true
        };

        onStateChange(CHAT_STATES.CONNECTING, STATE_MESSAGES[CHAT_STATES.CONNECTING]);

        // Helper for smart chunk buffering to prevent markdown flickering
        let textBuffer = '';
        let lastEmitTime = Date.now();
        const emitBufferedText = (force = false) => {
            if (!textBuffer) return;

            const timeSinceEmit = Date.now() - lastEmitTime;
            if (force || textBuffer.length > 15 || timeSinceEmit > 100) {
                const endsWithMarkdown = /[*_\[\]`#~]$/.test(textBuffer);
                if (endsWithMarkdown && !force && textBuffer.length < 50) {
                    return;
                }

                if (onChunk) onChunk({ type: 'text', content: textBuffer });
                textBuffer = '';
                lastEmitTime = Date.now();
            }
        };

        try {
            await this.initializeBackendSession(appName, userId, sessionId);

            if (!API_CONFIG.BASE_URL) {
                console.error('[ChatbotAPI] Aborting sendMessage: No BASE_URL configured.');
                throw new Error('CONFIG_ERROR: Chatbot API URL is not configured. Please check environment variables.');
            }

            console.log(`[ChatbotAPI] Sending message to: ${url}`);
            console.log(`[ChatbotAPI] Payload user_id: ${userId}, session_id: ${sessionId}`);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(payload)
            });

            console.log(`[ChatbotAPI] Response Status: ${response.status} ${response.statusText}`);
            console.log(`[ChatbotAPI] Response Headers:`, Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API_ERROR:${response.status}:${errorText}`);
            }

            onStateChange(CHAT_STATES.STREAMING, STATE_MESSAGES[CHAT_STATES.STREAMING]);
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponseText = '';
            let buffer = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop();

                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        if (!trimmedLine) continue;

                        console.debug(`[ChatbotAPI] Raw Chunk: ${trimmedLine}`);

                        // Modern unified_chat uses NDJSON (raw JSON objects per line)
                        // Legacy endpoints use SSE (data: {JSON})
                        // We handle both by stripping 'data:' only if it exists
                        let data = trimmedLine;
                        if (trimmedLine.startsWith('data:')) {
                            data = trimmedLine.replace('data:', '').trim();
                        }

                        // Remove keep-alive entirely from raw data string before parsing so it's not rendered
                        data = data.replace(/(:\s*keep-alive)+/g, '').trim();

                        if (!data || data === '[DONE]') continue;

                        try {
                            let contentObj = { text: '', thought: '' };
                            if (data.startsWith('{') || data.startsWith('[')) {
                                const parsed = JSON.parse(data);

                                // Handle the structured events from the new unified_chat endpoint
                                if (parsed.type) {
                                    switch (parsed.type) {
                                        case 'agent_event':
                                            if (parsed.payload) {
                                                // Keep token streaming for better UX, but ignore the final complete block to avoid duplication
                                                if (parsed.payload.is_final_complete === true) {
                                                    break;
                                                }
                                                contentObj = this.extractContentFromObject(parsed.payload);
                                            }
                                            break;
                                        case 'message_chunk':
                                            if (parsed.content) {
                                                contentObj.text = parsed.content;
                                            }
                                            break;
                                        case 'status':
                                        case 'classification':
                                        case 'cache_hit':
                                        case 'cache_miss':
                                            // Provide these as thought/status updates instead of main text
                                            if (parsed.content) {
                                                contentObj.thought = `[${parsed.type.toUpperCase()}] ${parsed.content}\n`;
                                            }
                                            break;
                                        case 'error':
                                            // Provide a nicely formatted error instead of crashing the parser and dumping raw JSON
                                            contentObj.text = `\n\n**⚠️ Error:** ${parsed.content}\n`;
                                            break;
                                        default:
                                            // Fallback for unknown types
                                            if (parsed.content) {
                                                contentObj.text = parsed.content;
                                            }
                                            break;
                                    }
                                } else {
                                    // Handle legacy / raw object fallback
                                    contentObj = this.extractContentFromObject(parsed);
                                }
                            } else {
                                // If it's not JSON but was prefixed with data:, it's raw text
                                contentObj.text = data;
                            }

                            if (contentObj.thought && onChunk) {
                                onChunk({ type: 'thought', content: contentObj.thought });
                            }
                            if (contentObj.text) {
                                fullResponseText += contentObj.text;
                                textBuffer += contentObj.text;
                                emitBufferedText();
                            }
                        } catch (e) {
                            console.warn('[ChatbotAPI] Chunk parse error:', e);
                            // Only fallback to raw data if it doesn't look like a JSON object we failed to process
                            if (data && !data.trim().startsWith('{') && !data.trim().startsWith('[')) {
                                fullResponseText += data;
                                textBuffer += data;
                                emitBufferedText();
                            }
                        }
                    }
                }
            } finally {
                emitBufferedText(true); // Force flush any remaining buffer
                reader.releaseLock();
            }

            onStateChange(CHAT_STATES.COMPLETE, STATE_MESSAGES[CHAT_STATES.COMPLETE]);
            return { response: fullResponseText, sessionId: payload.session_id, success: true };

        } catch (error) {
            console.error('[ChatbotAPI] sendMessage error:', error);
            let errorMessage = error.message.includes('API_ERROR')
                ? `Server Error (${error.message.split(':')[1]})`
                : 'Connection failed. The AI service may be temporarily unavailable.';

            onStateChange(CHAT_STATES.ERROR, errorMessage);
            return { response: errorMessage, sessionId: null, success: false };
        } finally {
            this.abortControllers.delete(existingSessionId);
        }
    }

    /**
     * Exhaustive content extraction for different AI response formats
     * Returns { text: string, thought: string }
     */
    extractContentFromObject(obj) {
        let result = { text: '', thought: '' };
        if (!obj) return result;

        if (typeof obj === 'string') {
            result.text = obj;
            return result;
        }

        // Direct handling for ADK structures (to avoid arbitrary recursive duplication)
        if (obj.parts && Array.isArray(obj.parts)) {
            obj.parts.forEach(p => {
                if (p.thought) result.thought += p.text || p.thought;
                else result.text += p.text || '';
            });
            return result;
        }

        if (obj.content?.parts && Array.isArray(obj.content.parts)) {
            obj.content.parts.forEach(p => {
                if (p.thought) result.thought += p.text || p.thought;
                else result.text += p.text || '';
            });
            return result;
        }

        // Handle specific string fields directly without recursion
        const commonFields = ['text', 'content', 'response', 'message', 'answer', 'result', 'data'];
        for (const field of commonFields) {
            if (obj[field] && typeof obj[field] === 'string') {
                result.text = obj[field];
                return result; // return early to prevent double extraction
            }
        }

        // Handle Google Candidates format specifically
        if (obj.candidates?.[0]?.content?.parts && Array.isArray(obj.candidates[0].content.parts)) {
            obj.candidates[0].content.parts.forEach(p => {
                if (p.thought) result.thought += p.text || p.thought;
                else result.text += p.text || '';
            });
            return result;
        }

        // Only fall back to recursive search for arrays or strictly unknown objects
        if (Array.isArray(obj)) {
            obj.forEach(item => {
                const nested = this.extractContentFromObject(item);
                result.text += nested.text;
                result.thought += nested.thought;
            });
        }

        // --- Post-processing: Handle meta-events mixed with text ---
        if (result.text) {
            const technicalRegex = /^(?:Analyzing query\.{1,}|Found in Semantic Cache|Generating response|[a-z_]{2,}(?:\.{1,}|[:\s!]|(?=[A-Z\s!])))/i;

            let currentText = result.text.trim();
            let matchedBlocks = [];

            while (true) {
                const match = currentText.match(technicalRegex);
                if (match && match[0]) {
                    const block = match[0];
                    matchedBlocks.push(block);
                    currentText = currentText.slice(block.length).trim();
                    if (block.length === 0) break;
                } else {
                    break;
                }
            }

            if (matchedBlocks.length > 0) {
                result.thought = (result.thought ? result.thought + '\n' : '') + matchedBlocks.join('');
                result.text = currentText;
            }
        }

        return result;
    }

    cancelRequest(sessionId) {
        const controller = this.abortControllers.get(sessionId);
        if (controller) {
            controller.abort();
            this.abortControllers.delete(sessionId);
        }
    }

    createNewSession(appName = AI_MODELS.LEGAL_COUNSEL) {
        return this.sessionManager.createSession(this.getUserId(), appName);
    }

    clearCurrentSession(sessionId) {
        this.sessionManager.clearSession(sessionId);
    }
}

export const chatbotService = new ChatbotApiService();
export default chatbotService;
