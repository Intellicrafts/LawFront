import { createSlice } from '@reduxjs/toolkit';

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        isOpen: localStorage.getItem('sidebarOpen') === 'true',
    },
    reducers: {
        toggleSidebar: (state) => {
            state.isOpen = !state.isOpen;
            localStorage.setItem('sidebarOpen', state.isOpen);
        },
        setSidebarOpen: (state, action) => {
            state.isOpen = action.payload;
            localStorage.setItem('sidebarOpen', state.isOpen);
        },
    },
});

export const { toggleSidebar, setSidebarOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;
