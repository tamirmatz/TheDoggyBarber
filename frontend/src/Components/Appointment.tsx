import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import { formatDateWithMoment } from '../helper';
import { Appointment } from '../api/appointmentsApi'; // Import Appointment type from '../api'
import { StyledTableCell } from './Appointments';
import { useAppDispatch } from '../hooks/hooksHelper';
import { setCurrentAppointment } from '../slices/appointmentsSlice';

const StyledTableRow = styled(TableRow)(({ theme }) => ({    
  height: '50px',
  cursor: 'pointer'
}));



interface AppointmentItemProps {
  appointment: Appointment; 
  setIsModalOpen: (value: boolean) => void;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment, setIsModalOpen }) => { // Define props type
  const dispatch = useAppDispatch();

  const onAppointmentClick = () => {
    dispatch(setCurrentAppointment({appointment}))
    setIsModalOpen(true);
  }

  return (
    <StyledTableRow onClick={onAppointmentClick} hover>
      <StyledTableCell align="center" component="th" scope="row">
        {appointment.firstName}
      </StyledTableCell>
      <StyledTableCell align="center">
        {formatDateWithMoment(appointment.appointmentTime)}
      </StyledTableCell>
     
    </StyledTableRow>
  );
};

export default AppointmentItem;
