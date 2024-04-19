import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';  // Import the RootState
import { formatDateWithMoment } from '../helper';
import dayjs from 'dayjs';
import { Button } from '@mui/material';
import DateTimePickerComp from './DateTimePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppointmentsRequests } from '../hooks/useAppointmentsRequests';
import utc from 'dayjs/plugin/utc'; // Import UTC plugin
dayjs.extend(utc);

interface AddAppointmentProps {
    setIsModalOpen: (value: boolean) => void;
}

const AddAppointment: React.FC<AddAppointmentProps>  = ({setIsModalOpen}) => {
    const { handleAddAppointment } = useAppointmentsRequests();

    const [date, setDate] = useState<dayjs.Dayjs | null>(null);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const user = useSelector((state: RootState) => state.user.user);

    const onAddAppointment = () => {
        if(user && date !== null){
            handleAddAppointment({appointmentTime: date.utc(true).toISOString(), firstName: user.firstName, userId: user.userId});
            setIsModalOpen(false);
        }
    }

    return (
        <div style={{height: '200px', gap: '5px'}} className="appointmentDetailsContainer">
            <h2>Hi {user?.firstName}, When Can You Arrive ?</h2>
            <div className="appointmentTimeRow">
                <div className="rowLabel">Appointment Time</div>
                <DateTimePickerComp setDirty={setIsDirty} handleDateChange={setDate} selectedDate={date}/>
            </div>
                <div className="editButtonPanel">
                    <Button onClick={onAddAppointment} disabled={!isDirty} sx={{width: '100px'}} variant="contained">Add</Button>
                </div>
        </div>
    );
};

export default AddAppointment;
