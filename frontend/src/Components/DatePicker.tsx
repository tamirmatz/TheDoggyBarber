import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

interface DatePickerCompProps {
  selectedDate: dayjs.Dayjs | null;  // Use the Dayjs type for the date
  handleDateChange: (date: dayjs.Dayjs | null) => void;  // Callback to handle changes
}

export default function DatePickerComp({selectedDate, handleDateChange}: DatePickerCompProps) {
  const onClear = () => {
    handleDateChange(null);
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <div style={{position: 'relative', width: '190px'}}>
       <DatePicker
          label="Choose Date"
          value={selectedDate}
          onChange={handleDateChange}
          format="DD/MM/YYYY" 
        />

        <div style={{position: 'absolute', right: 33, top: 9}}>
        <IconButton onClick={onClear} aria-label="ClearIcon">
          <ClearIcon />
        </IconButton>

        </div>

      </div>
    </LocalizationProvider>
  );
}