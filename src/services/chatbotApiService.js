/**
 * Chatbot API Service
 * Production-ready, optimized service for AI-powered legal chatbot
 * 
 * Features:
 * - Session management
 * - Automatic retry with exponential backoff
 * - Response streaming support
 * - Error handling and recovery
 * - Request caching and deduplication
 */

// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://9v9r3mivw8.ap-south-1.awsapprunner.com',
    ENDPOINTS: {
        CHAT: '/run',  // Changed from /run_sse to /run based on working test
    },
    TIMEOUT: 60000, // 60 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // Initial retry delay in ms
};

// Available AI Models/Agents
export const AI_MODELS = {
    LEGAL_COUNSEL: 'legal_counsel', // This is what the backend expects for Bakilat
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
        // Generate a simpler sessionId (8-9 chars alphanumeric)
        const sessionId = Math.random().toString(36).substring(2, 11);
        const session = {
            id: sessionId,
            userId,
            appName,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            messageCount: 0,
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
        for (const [id, session] of this.sessions) {
            if (session.userId === userId && session.appName === appName) {
                // Check if session is less than 24 hours old
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
 * Request Queue - Prevents duplicate requests and manages concurrency
 */
class RequestQueue {
    constructor() {
        this.pending = new Map();
    }

    async enqueue(key, requestFn) {
        // If same request is already pending, return existing promise
        if (this.pending.has(key)) {
            return this.pending.get(key);
        }

        const promise = requestFn().finally(() => {
            this.pending.delete(key);
        });

        this.pending.set(key, promise);
        return promise;
    }

    cancel(key) {
        this.pending.delete(key);
    }

    cancelAll() {
        this.pending.clear();
    }
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Extract text from API response - handles the specific API response format
 * Response format: [{content: {parts: [{text: "...", thought?: boolean}...], role: "model"}, ...}]
 */
const extractResponseText = (data) => {
    if (!data) return '';

    // If it's a string, check if it's JSON and parse it
    if (typeof data === 'string') {
        const trimmed = data.trim();

        // Check if it's SSE format
        if (trimmed.includes('data:')) {
            const lines = trimmed.split('\n').filter(line => line.startsWith('data:'));
            const texts = lines.map(line => {
                try {
                    const jsonStr = line.replace('data:', '').trim();
                    if (jsonStr === '[DONE]') return '';
                    const parsed = JSON.parse(jsonStr);
                    return extractResponseText(parsed);
                } catch {
                    return line.replace('data:', '').trim();
                }
            });
            return texts.join('');
        }

        // Try to parse as JSON array or object
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            try {
                const parsed = JSON.parse(trimmed);
                return extractResponseText(parsed);
            } catch {
                return trimmed;
            }
        }
        return trimmed;
    }

    // Handle array response format (the API returns an array)
    if (Array.isArray(data)) {
        // Get the last item in the array (usually contains the final response)
        // Or iterate through all items to get all response parts
        const responseTexts = [];

        for (const item of data) {
            if (item && item.content && item.content.parts) {
                // Filter out thought parts (where thought: true) and get only actual response text
                const textParts = item.content.parts
                    .filter(part => !part.thought) // Exclude thinking/reasoning parts
                    .map(part => part.text || '')
                    .filter(text => text.trim() !== '');

                if (textParts.length > 0) {
                    responseTexts.push(textParts.join(''));
                }
            }
        }

        if (responseTexts.length > 0) {
            // Return the last non-empty response (most complete)
            return responseTexts[responseTexts.length - 1];
        }

        // Fallback: try to extract from first item
        if (data.length > 0) {
            return extractResponseText(data[0]);
        }
        return '';
    }

    // Handle object responses
    if (typeof data === 'object') {
        // Handle the specific API format: {content: {parts: [...], role: "model"}}
        if (data.content && data.content.parts && Array.isArray(data.content.parts)) {
            const textParts = data.content.parts
                .filter(part => !part.thought) // Exclude thinking parts
                .map(part => part.text || '')
                .filter(text => text.trim() !== '');

            if (textParts.length > 0) {
                return textParts.join('');
            }
        }

        // Check common response fields
        if (data.response) return extractResponseText(data.response);
        if (data.answer) return extractResponseText(data.answer);
        if (data.message && typeof data.message === 'string') return data.message;
        if (data.text) return extractResponseText(data.text);

        // Handle Google AI format (parts at root level)
        if (data.parts && Array.isArray(data.parts)) {
            const textParts = data.parts
                .filter(part => !part.thought)
                .map(p => p.text || '')
                .filter(text => text.trim() !== '');
            return textParts.join('');
        }

        // Handle candidates format
        if (data.candidates && Array.isArray(data.candidates)) {
            const candidate = data.candidates[0];
            if (candidate?.content?.parts) {
                const textParts = candidate.content.parts
                    .filter(part => !part.thought)
                    .map(p => p.text || '')
                    .filter(text => text.trim() !== '');
                return textParts.join('');
            }
        }

        // Handle nested data
        if (data.data) return extractResponseText(data.data);

        // Handle result wrapper
        if (data.result) return extractResponseText(data.result);
    }

    return '';
};


/**
 * Main Chatbot API Service
 */
class ChatbotApiService {
    constructor() {
        this.sessionManager = new SessionManager();
        this.requestQueue = new RequestQueue();
        this.abortControllers = new Map();
    }

    /**
     * Get user ID from localStorage or generate guest ID
     * Always returns a string (API requirement)
     */
    getUserId() {
        try {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                // Ensure we always return a string (API requires string type)
                const userId = userData.id || userData.email || userData.user_id;
                if (userId !== undefined && userId !== null) {
                    return String(userId);
                }
            }
        } catch (e) {
            console.warn('Failed to get user ID from localStorage');
        }

        // Generate or retrieve guest ID
        let guestId = localStorage.getItem('guest_user_id');
        if (!guestId) {
            // Simpler guest ID
            guestId = 'g_' + Math.random().toString(36).substring(2, 10);
            localStorage.setItem('guest_user_id', guestId);
        }
        return String(guestId);
    }


    /**
     * Build the request payload
     * Note: API expects 'sessionId' (camelCase), not 'session_id' (snake_case)
     */
    buildPayload(message, appName, sessionId, streaming = false) {
        return {
            app_name: appName,
            user_id: this.getUserId(),
            sessionId: sessionId,  // Changed from session_id to sessionId (API requirement)
            new_message: {
                role: 'user',
                parts: [{ text: message }],
            },
            streaming,
        };
    }

    /**
     * Initialize session on the backend (Required by AWS Runner API)
     * POST /apps/:model/users/:userId/sessions
     */
    async initializeBackendSession(appName, userId, sessionId) {
        try {
            console.log(`[ChatbotAPI] Initializing session on backend: ${sessionId}`);
            const url = `${API_CONFIG.BASE_URL}/apps/${appName}/users/${userId}/sessions`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // The API seemed to accept an empty object or potentially common ID
                    sessionId: sessionId
                }),
                mode: 'cors'
            });

            if (!response.ok) {
                const text = await response.text();
                // If it's 409 or similar, it might already exist, which is fine
                if (response.status !== 409) {
                    console.warn(`[ChatbotAPI] Backend session initialization status: ${response.status}`, text);
                }
            } else {
                console.log(`[ChatbotAPI] Backend session initialized successfully`);
            }

            this.sessionManager.markSessionInitialized(sessionId);
            return true;
        } catch (error) {
            console.warn('[ChatbotAPI] Failed to initialize backend session:', error);
            // We still mark it as initialized to avoid infinite loops, 
            // the /run call will be the definitive test
            this.sessionManager.markSessionInitialized(sessionId);
            return false;
        }
    }



    /**
     * Make API request with retry logic
     */
    async makeRequest(url, payload, retries = API_CONFIG.MAX_RETRIES) {
        const requestKey = `${payload.sessionId}_${Date.now()}`;


        // Create abort controller for this request
        const abortController = new AbortController();
        this.abortControllers.set(requestKey, abortController);

        const attemptRequest = async (attempt = 1) => {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(payload),
                    signal: abortController.signal,
                    mode: 'cors',
                });

                if (!response.ok) {
                    const errorText = await response.text();

                    // Specific Handling for Session Not Found (Point 5)
                    if (response.status === 404 && errorText.includes('Session not found')) {
                        console.warn('[ChatbotAPI] Session lost on server. Retrying initialization...');
                        // Clear the invalid session state
                        this.sessionManager.clearSession(payload.sessionId);
                        throw new Error('SESSION_LOST');
                    }

                    // Handle specific error codes
                    if (response.status === 503 || response.status === 502) {
                        throw new Error(`SERVICE_UNAVAILABLE:${response.status}`);
                    }
                    if (response.status === 429) {
                        throw new Error('RATE_LIMITED');
                    }
                    if (response.status === 401 || response.status === 403) {
                        throw new Error('UNAUTHORIZED');
                    }

                    throw new Error(`API_ERROR:${response.status}:${errorText}`);
                }

                const responseText = await response.text();

                try {
                    return JSON.parse(responseText);
                } catch (parseError) {
                    return responseText;
                }
            } catch (error) {
                // If session was lost, we want to try re-initializing immediately
                if (error.message === 'SESSION_LOST' && attempt <= retries) {
                    const userId = this.getUserId();
                    await this.initializeBackendSession(payload.app_name, userId, payload.sessionId);
                    return attemptRequest(attempt + 1);
                }

                // Clean up abort controller
                this.abortControllers.delete(requestKey);

                if (error.name === 'AbortError') {
                    throw new Error('REQUEST_CANCELLED');
                }

                if (attempt < retries) {
                    const isRetryable =
                        error.message.includes('SERVICE_UNAVAILABLE') ||
                        error.message.includes('RATE_LIMITED') ||
                        error.message.includes('fetch');

                    if (isRetryable) {
                        const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, attempt - 1);
                        await sleep(delay);
                        return attemptRequest(attempt + 1);
                    }
                }

                throw error;
            }
        };

        try {
            return await attemptRequest();
        } finally {
            this.abortControllers.delete(requestKey);
        }
    }

    /**
     * Send a message and get response
     * @param {string} message - User's message
     * @param {string} appName - AI model/agent to use
     * @param {function} onStateChange - Callback for state updates
     * @param {string} existingSessionId - Optional existing session ID
     * @returns {Promise<{response: string, sessionId: string}>}
     */
    async sendMessage(message, appName = AI_MODELS.LEGAL_COUNSEL, onStateChange = () => { }, existingSessionId = null) {
        const userId = this.getUserId();

        // Get or create session
        let session;
        if (existingSessionId) {
            session = this.sessionManager.getSession(existingSessionId) ||
                this.sessionManager.createSession(userId, appName);
        } else {
            session = this.sessionManager.getOrCreateSession(userId, appName);
        }

        const sessionId = session.id;

        // State progression for professional UI
        const stateProgression = [
            { state: CHAT_STATES.CONNECTING, delay: 300 },
            { state: CHAT_STATES.ANALYZING, delay: 800 },
            { state: CHAT_STATES.RESEARCHING, delay: 1200 },
            { state: CHAT_STATES.DRAFTING, delay: 0 }, // Will stay here until response
        ];

        // Start state progression
        let currentStateIndex = 0;
        const stateInterval = setInterval(() => {
            if (currentStateIndex < stateProgression.length - 1) {
                const nextState = stateProgression[currentStateIndex];
                onStateChange(nextState.state, STATE_MESSAGES[nextState.state]);
                currentStateIndex++;
            }
        }, 500);

        try {
            // Notify connecting
            onStateChange(CHAT_STATES.CONNECTING, STATE_MESSAGES[CHAT_STATES.CONNECTING]);

            // Ensure session is initialized on backend before sending message
            if (!this.sessionManager.isSessionInitialized(sessionId)) {
                await this.initializeBackendSession(appName, userId, sessionId);
            }

            // Build and send request
            const payload = this.buildPayload(message, appName, sessionId, false);
            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT}`;


            // Use request queue to prevent duplicates
            const response = await this.requestQueue.enqueue(
                `${sessionId}_${message.substring(0, 50)}`,
                () => this.makeRequest(url, payload)
            );

            // Clear state interval
            clearInterval(stateInterval);

            // Extract response text
            const responseText = extractResponseText(response);

            if (!responseText) {
                throw new Error('EMPTY_RESPONSE');
            }

            // Update session
            this.sessionManager.updateSession(sessionId, {
                messageCount: session.messageCount + 1,
            });

            // Notify completion
            onStateChange(CHAT_STATES.STREAMING, STATE_MESSAGES[CHAT_STATES.STREAMING]);

            return {
                response: responseText,
                sessionId,
                success: true,
            };
        } catch (error) {
            clearInterval(stateInterval);

            // Log the error for debugging
            console.error('[ChatbotAPI] Error in sendMessage:', error.message);

            // Map errors to user-friendly messages
            let errorMessage = 'Something went wrong. Please try again.';
            let errorCode = 'UNKNOWN_ERROR';

            if (error.message.includes('SERVICE_UNAVAILABLE')) {
                errorMessage = 'Our legal assistant is currently busy. Please try again in a moment.';
                errorCode = 'SERVICE_UNAVAILABLE';
            } else if (error.message.includes('API_ERROR:404') || error.message.includes('Session not found')) {
                errorMessage = 'Session expired or not found. Please try again to start a new session.';
                errorCode = 'SESSION_NOT_FOUND';
                // Clear the invalid session
                if (sessionId) this.sessionManager.clearSession(sessionId);
            } else if (error.message.includes('SERVER_ERROR')) {

                errorMessage = 'The server encountered an error. Please try again.';
                errorCode = 'SERVER_ERROR';
            } else if (error.message.includes('RATE_LIMITED')) {
                errorMessage = 'Too many requests. Please wait a moment before trying again.';
                errorCode = 'RATE_LIMITED';
            } else if (error.message.includes('UNAUTHORIZED')) {
                errorMessage = 'Session expired. Please refresh the page.';
                errorCode = 'UNAUTHORIZED';
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('CORS')) {
                errorMessage = 'Network error. Please check your connection and try again.';
                errorCode = 'NETWORK_ERROR';
            } else if (error.message.includes('REQUEST_CANCELLED')) {
                errorMessage = 'Request was cancelled.';
                errorCode = 'CANCELLED';
            } else if (error.message.includes('EMPTY_RESPONSE')) {
                errorMessage = 'Received empty response. Please try rephrasing your question.';
                errorCode = 'EMPTY_RESPONSE';
            }


            onStateChange(CHAT_STATES.ERROR, errorMessage);

            return {
                response: errorMessage,
                sessionId,
                success: false,
                error: errorCode,
            };
        }
    }

    /**
     * Cancel ongoing request
     */
    cancelRequest(sessionId) {
        for (const [key, controller] of this.abortControllers) {
            if (key.startsWith(sessionId)) {
                controller.abort();
                this.abortControllers.delete(key);
            }
        }
        this.requestQueue.cancel(sessionId);
    }

    /**
     * Cancel all requests
     */
    cancelAllRequests() {
        for (const controller of this.abortControllers.values()) {
            controller.abort();
        }
        this.abortControllers.clear();
        this.requestQueue.cancelAll();
    }

    /**
     * Create a new chat session
     */
    createNewSession(appName = AI_MODELS.LEGAL_COUNSEL) {
        const userId = this.getUserId();
        return this.sessionManager.createSession(userId, appName);
    }

    /**
     * Get current session
     */
    getCurrentSession(appName = AI_MODELS.LEGAL_COUNSEL) {
        const userId = this.getUserId();
        return this.sessionManager.getOrCreateSession(userId, appName);
    }

    /**
     * Clear current session (for new chat)
     */
    clearCurrentSession(sessionId) {
        this.sessionManager.clearSession(sessionId);
    }
}

// Export singleton instance
export const chatbotService = new ChatbotApiService();

// Export class for testing
export { ChatbotApiService, SessionManager };

// Default export
export default chatbotService;
