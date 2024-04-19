import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';  // Import the RootState
import { formatDateWithMoment } from '../helper';
import dayjs from 'dayjs';
import { Button } from '@mui/material';
import DateTimePickerComp from './DateTimePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppointmentsRequests } from '../hooks/useAppointmentsRequests';
import { UpdateAppointmentsRequest } from '../api/appointmentsApi';
import utc from 'dayjs/plugin/utc'; // Import UTC plugin
dayjs.extend(utc);

interface AppointmentDetailsProps {
    setIsModalOpen: (value: boolean) => void;
}


const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({setIsModalOpen}) => {
    const currentAppointment = useSelector((state: RootState) => state.appointments.currentAppointment);
    const user = useSelector((state: RootState) => state.user.user);

    const [date, setDate] = useState<dayjs.Dayjs | null>(null);
    const [isUserAllowedEdit, setIsUserAllowedEdit] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState<boolean>(false);

    const { handleDeleteAppointment, handleUpdateAppointment } = useAppointmentsRequests();

    useEffect(() => {

        if(user && currentAppointment) {

            if(currentAppointment.userId === user.userId){
                setIsUserAllowedEdit(true)
                setDate(dayjs(currentAppointment.appointmentTime));
            }
            
        }

    }, [currentAppointment]);

    const onDeleteAppointment = () => {
        if(currentAppointment){
            handleDeleteAppointment(currentAppointment.appointmentId)
            setIsModalOpen(false)
        }
    }

    const onUpdateAppointment = () => {
        if(currentAppointment && date){

            const request: UpdateAppointmentsRequest = {
                appointmentId: currentAppointment.appointmentId,
                appointmentTime: date.utc(true).toISOString()
            };

            handleUpdateAppointment(request);
            setIsModalOpen(false);
        }
    }

    return (
        <div style={isUserAllowedEdit ? {} : {height: '160px'}} className="appointmentDetailsContainer">
            <div className="appointmentRow">
                <div className="rowLabel">Clients Name</div>
                <div className="rowContent">{currentAppointment?.firstName}</div>
            </div>

            <div className="appointmentRow">
                <div className="rowLabel">Creation Time</div>
                <div className="rowContent">{currentAppointment ? formatDateWithMoment(currentAppointment.createdTime) : null}</div>
            </div>

            <div className="appointmentTimeRow">
                <div className="rowLabel">Appointment Time</div>
                {isUserAllowedEdit ? (
                    <DateTimePickerComp setDirty={setIsDirty} handleDateChange={setDate} selectedDate={date}/>
                ) : (
                    currentAppointment ? formatDateWithMoment(currentAppointment.appointmentTime) : null
                )}
            </div>

            {isUserAllowedEdit && (
                <div className="editButtonPanel">
                    <Button onClick={onUpdateAppointment} disabled={!isDirty} sx={{width: '100px'}} variant="contained">Save</Button>
                    <Button onClick={onDeleteAppointment} color='error' variant="contained">
                        <DeleteIcon/>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AppointmentDetails;
