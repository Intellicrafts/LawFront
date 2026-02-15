import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatbotAPI } from '../api/apiService';

export const fetchChatSessions = createAsyncThunk(
    'chat/fetchSessions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await chatbotAPI.getSessions();

            // Handle different response structures
            if (Array.isArray(response)) {
                return response;
            }

            if (response && response.data && Array.isArray(response.data)) {
                return response.data;
            }

            if (response && response.success && response.data) {
                return response.data;
            }

            // Paginated response or other structure
            if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
                return response.data.data;
            }

            return [];
        } catch (error) {
            return rejectWithValue(error.toString());
        }
    }
);

const initialState = {
    chatHistory: [],
    loading: false,
    error: null,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChatHistory: (state, action) => {
            state.chatHistory = action.payload;
        },
        addChat: (state, action) => {
            state.chatHistory = [action.payload, ...state.chatHistory];
        },
        updateChat: (state, action) => {
            const { id, updates } = action.payload;
            const index = state.chatHistory.findIndex(chat => chat.id === id);
            if (index !== -1) {
                state.chatHistory[index] = { ...state.chatHistory[index], ...updates };
            }
        },
        deleteChat: (state, action) => {
            state.chatHistory = state.chatHistory.filter(chat => chat.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatSessions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChatSessions.fulfilled, (state, action) => {
                state.loading = false;

                // Ensure we have an array to map over
                let sessions = [];
                if (Array.isArray(action.payload)) {
                    sessions = action.payload;
                } else if (action.payload && Array.isArray(action.payload.data)) {
                    sessions = action.payload.data;
                }

                // Map API response to Sidebar format
                state.chatHistory = sessions.map(session => ({
                    id: session.id,
                    title: session.title || 'New Chat',
                    preview: session.status === 'active' ? 'Active Conversation' : 'Archived',
                    time: session.last_message_at || 'Just now',
                    count: session.events_count || 0
                }));
            })
            .addCase(fetchChatSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setChatHistory, addChat, updateChat, deleteChat } = chatSlice.actions;
export default chatSlice.reducer;
