import { useCallback } from 'react';
import { useAppDispatch } from './hooksHelper';
import { AddAppointmentRequest, GeneralStatusCodes, UpdateAppointmentsRequest, addAppointment, deleteAppointment, fetchAppointments, updateAppointment } from '../api/appointmentsApi';
import { setAppointments, setFilteredAppointments, setIsTableLoading } from '../slices/appointmentsSlice';
import { openSnackbar } from '../slices/snackbarSlice';

export function useAppointmentsRequests() {

    const dispatch = useAppDispatch();

    const handleFetchAppointments = useCallback(async () => {
        try {
            dispatch(setIsTableLoading({isLoading: true}))
            const response = await fetchAppointments();

            if(response.status === GeneralStatusCodes.Success) {

                dispatch(setAppointments({appointments: response.appointments}));
                dispatch(setFilteredAppointments({filteredAppointments: response.appointments}));

            } else {
                dispatch(openSnackbar({ message: 'Fetch Appointments Failed', severity: 'error' }));
            }

        } catch (error) {

            dispatch(openSnackbar({ message: 'Fetch Appointments Failed', severity: 'error' }));

        } finally {

            dispatch(setIsTableLoading({isLoading: false}))
        }
    }, []);

    // Function to handle user sign-up
    const handleAddAppointment = useCallback(async (request: AddAppointmentRequest) => {
        try {
            const response = await addAppointment(request);
            if(response.status === GeneralStatusCodes.Success) {
                
                dispatch(openSnackbar({ message: 'Appointments Added Successfully', severity: 'success' }));
                handleFetchAppointments();

            } else {

                dispatch(openSnackbar({ message: 'Fetch Appointments Failed', severity: 'error' }));
            }

        } catch (error) {

            dispatch(openSnackbar({ message: 'Fetch Appointments Failed', severity: 'error' }));
        }
    }, []);

    const handleDeleteAppointment = useCallback(async (appointmentId: number) => {
        try {

            const response = await deleteAppointment(appointmentId);
            if(response === GeneralStatusCodes.Success) {

               dispatch(openSnackbar({ message: 'Appointments Deleted Successfully', severity: 'success' }));
               handleFetchAppointments();
            } else {

                dispatch(openSnackbar({ message: 'Delete Appointment Failed', severity: 'error' }));
            }

        } catch (error) {

            dispatch(openSnackbar({ message: 'Delete Appointment Failed', severity: 'error' }));
        }
    }, []);

    const handleUpdateAppointment = useCallback(async (request: UpdateAppointmentsRequest) => {
        try {
            const response = await updateAppointment(request);
            if(response === GeneralStatusCodes.Success) {
                
                dispatch(openSnackbar({ message: 'Appointment Updated Successfully', severity: 'success' }));
                handleFetchAppointments();

            } else {

                dispatch(openSnackbar({ message: 'Update Appointment Failed', severity: 'error' }));
            }

        } catch (error) {
            dispatch(openSnackbar({ message: 'Update Appointment Failed', severity: 'error' }));
        }
    }, []);


    return {
        handleAddAppointment,
        handleFetchAppointments,
        handleDeleteAppointment,
        handleUpdateAppointment
    };
}
