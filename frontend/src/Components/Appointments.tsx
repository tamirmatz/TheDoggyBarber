import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/hooksHelper';
import { useNavigate } from 'react-router-dom';
import { Appointment, fetchAppointments } from '../api/appointmentsApi';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import DatePickerComp from './DatePicker';
import AppointmentItem from './Appointment';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import SearchInput from './SearchInput';
import Modal from '@mui/material/Modal';
import AppointmentDetails from './AppointmentDetails';
import { setCurrentAppointment, setFilteredAppointments } from '../slices/appointmentsSlice';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import AddAppointment from './AddAppointment';
import { useAppointmentsRequests } from '../hooks/useAppointmentsRequests';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px'
};

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontSize: 18,
      },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 17,
      cursor: 'pointer'
    },
    width: '50%',
  }));

const Appointments: React.FC = () => {
  const dispatch = useAppDispatch();
  const { handleFetchAppointments } = useAppointmentsRequests();

  const appointments = useSelector((state: RootState) => state.appointments.appointments);
  const filteredAppointments = useSelector((state: RootState) => state.appointments.filteredAppointments);
  const isTableLoading = useSelector((state: RootState) => state.appointments.isTableLoading);

  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState<dayjs.Dayjs | null>(null);
  const [isAppoitmentDetailsModalOpen, setIsAppoitmentDetailsModalOpen] = useState<boolean>(false);
  const [isAddAppoitmentModalOpen, setIsAddAppoitmentModalOpen] = useState<boolean>(false);


  const handleAppointmentDetailsModalClose = () => {
      dispatch(setCurrentAppointment({appointment: null}))
      setIsAppoitmentDetailsModalOpen(false);
  }

  const handleAddAppoitmentModalClose = () => {
    setIsAddAppoitmentModalOpen(false);
 }

  useEffect(() => {
    handleFetchAppointments()
  }, []);

  useEffect(() => {
    let result = appointments;

    if (filterName) {
      result = result.filter(appointment =>
        appointment.firstName.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterDate) {
      result = result.filter(appointment => {
        const appointmentDay = dayjs(appointment.appointmentTime).startOf('day');
        return appointmentDay.isSame(filterDate.startOf('day'));
      });
    }

    dispatch(setFilteredAppointments({filteredAppointments: result}));
  }, [filterName, filterDate, appointments]);

  const onAddAppointment = () => setIsAddAppoitmentModalOpen(true);


  return (
    <div className='sign-form-container'>

        <div className='appointments-container'>
          <div className='appointments-header'>
            <div className='appointments-title-container'>
            <Button onClick={onAddAppointment} variant="outlined">
              <AddIcon />
            </Button>

              <div style={{fontSize: '22px', fontWeight: 'bold'}}>Appointments</div>
                <PetsIcon />
              <div>

              </div>
            </div>
            <div className='actions-container'>
              <DatePickerComp selectedDate={filterDate} handleDateChange={setFilterDate}/>
              <SearchInput value={filterName} onChange={setFilterName}/>      
            </div>
          </div>
          <TableContainer sx={{height: '70vh', width: '90vw', borderRadius: '8px'}} component={Paper}>
            {
              isTableLoading ? <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}> <CircularProgress /></div> :
              <Table stickyHeader sx={{ minWidth: 300 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Name</StyledTableCell>
                    <StyledTableCell align="center">
                      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px'}}>
                        <div>Time</div>
                        <AccessTimeIcon/>
                      </div>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {filteredAppointments.map((appointment) => (
                      <AppointmentItem setIsModalOpen={setIsAppoitmentDetailsModalOpen} key={appointment.appointmentId} appointment={appointment} />
                    ))}
                </TableBody>
              </Table>
            }
        </TableContainer>

        </div>

        <Modal
          open={isAppoitmentDetailsModalOpen}
          onClose={handleAppointmentDetailsModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
          <AppointmentDetails setIsModalOpen={setIsAppoitmentDetailsModalOpen}/>
        </Box>
      </Modal>

      <Modal
          open={isAddAppoitmentModalOpen}
          onClose={handleAddAppoitmentModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
          <AddAppointment setIsModalOpen={setIsAddAppoitmentModalOpen}/>
        </Box>
      </Modal>
    </div>
  );
};

export default Appointments;
