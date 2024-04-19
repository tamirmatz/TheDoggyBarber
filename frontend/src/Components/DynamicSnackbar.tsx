import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { closeSnackbar } from '../slices/snackbarSlice'; // You will create this action

interface DynamicSnackbarProps {
  duration?: number;
}

const DynamicSnackbar: React.FC<DynamicSnackbarProps> = ({ duration = 2000 }) => {
  const { open, message, severity } = useSelector((state: RootState) => state.snackbar);
  const dispatch = useDispatch();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default DynamicSnackbar;
