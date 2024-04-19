import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment } from '../api/appointmentsApi';

interface appointmentsState {
    appointments: Appointment[],
    filteredAppointments: Appointment[],
    currentAppointment: Appointment | null,
    isButtonLoading: boolean;
    isTableLoading: boolean;
}

const initialState: appointmentsState = {
    filteredAppointments: [],
    appointments: [],
    currentAppointment: null,
    isButtonLoading: false,
    isTableLoading: false
};

export const appointmentsSlice = createSlice({
    name: 'appointments',
    initialState,
    reducers: {
        setCurrentAppointment: (state, action: PayloadAction<{ appointment: Appointment | null}>) => {

            state.currentAppointment = action.payload.appointment;
        },
        setAppointments: (state, action: PayloadAction<{ appointments: Appointment[] }>) => {

            state.appointments = action.payload.appointments;
        },
        setFilteredAppointments: (state, action: PayloadAction<{ filteredAppointments: Appointment[] }>) => {

            state.filteredAppointments = action.payload.filteredAppointments;
        },
        setIsButtonLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {

            state.isButtonLoading = action.payload.isLoading;
        },
        setIsTableLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {

            state.isTableLoading = action.payload.isLoading;
        },
    },
});

export const { setCurrentAppointment, setFilteredAppointments, setAppointments, setIsTableLoading, setIsButtonLoading } = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
