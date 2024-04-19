// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import snackbarReducer from './slices/snackbarSlice';




export const store = configureStore({
    reducer: {
        user: userReducer,
        appointments: appointmentsReducer,
        snackbar: snackbarReducer
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
