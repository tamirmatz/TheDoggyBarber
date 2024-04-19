import * as React from 'react';

import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  return (
    <TextField 
      sx={{width: '190px'}}
      id="outlined-basic" 
      label="Search Name"
      variant="outlined" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchInput;
