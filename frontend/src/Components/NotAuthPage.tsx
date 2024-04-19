import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import { formatDateWithMoment } from '../helper';
import { Appointment } from '../api/appointmentsApi'; // Import Appointment type from '../api'
import { StyledTableCell } from './Appointments';
import { useAppDispatch } from '../hooks/hooksHelper';
import { setCurrentAppointment } from '../slices/appointmentsSlice';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';



const NotAuthPage = () => { // Define props type
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/');
  }
  
  return (
    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}} className="sign-form-container">
          <h1>OOPS looks like you are not allowed here!</h1>
          <h1>Please Login Again</h1>

          <Button onClick={redirectToLogin} variant='contained'>Login</Button>
    </div>
  );
};

export default NotAuthPage;
