import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chatHistory: JSON.parse(localStorage.getItem('chatHistory') || '[]'),
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChatHistory: (state, action) => {
            state.chatHistory = action.payload;
            localStorage.setItem('chatHistory', JSON.stringify(state.chatHistory));
        },
        addChat: (state, action) => {
            state.chatHistory = [action.payload, ...state.chatHistory];
            localStorage.setItem('chatHistory', JSON.stringify(state.chatHistory));
        },
        updateChat: (state, action) => {
            const { id, updates } = action.payload;
            const index = state.chatHistory.findIndex(chat => chat.id === id);
            if (index !== -1) {
                state.chatHistory[index] = { ...state.chatHistory[index], ...updates };
                localStorage.setItem('chatHistory', JSON.stringify(state.chatHistory));
            }
        },
        deleteChat: (state, action) => {
            state.chatHistory = state.chatHistory.filter(chat => chat.id !== action.payload);
            localStorage.setItem('chatHistory', JSON.stringify(state.chatHistory));
        },
    },
});

export const { setChatHistory, addChat, updateChat, deleteChat } = chatSlice.actions;
export default chatSlice.reducer;
