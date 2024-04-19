import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

interface DatePickerCompProps {
  selectedDate: dayjs.Dayjs | null;  // Use the Dayjs type for the date
  handleDateChange: (date: dayjs.Dayjs | null) => void;  // Callback to handle changes
  setDirty: (isDirty: boolean) => void;
}

export default function DateTimePickerComp({ selectedDate, handleDateChange, setDirty}: DatePickerCompProps) {

  const onChange = (newDate: dayjs.Dayjs | null) => {
    handleDateChange(newDate);
    setDirty(true);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ position: 'relative', width: '225px' }}>
        <MobileDateTimePicker
          value={selectedDate}
          onChange={onChange}
          format="DD/MM/YYYY HH:mm"
          minDateTime={dayjs().startOf('day')}
        />
        
      </div>
    </LocalizationProvider>
  );
}
