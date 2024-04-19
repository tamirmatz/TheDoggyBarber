import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/hooksHelper';
import { signIn } from '../slices/userSlice';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthRequests } from '../hooks/useAuthRequests ';
import { validatePassword } from '../helper';


const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { handleSignUp } = useAuthRequests();
  const [firstName, setFirstname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const passwordHelper = 'Password must be at least 8 characters long, include numbers, letters, and special characters like !@#$%^&*()_+';


  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setIsPasswordValid(validatePassword(newPassword));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

     const userData = {
      username,
      password,
      firstName,
    };


     handleSignUp(userData)
  };

  const onBack = () => {
    navigate('/');
  }

  return (
    <div className='sign-form-container'>
      <form style={!isPasswordValid && password.length > 0 ? {height: '650px'} : {}} className='sign-form' onSubmit={handleSubmit}>
      <img className='dog-avatar' src={`${process.env.PUBLIC_URL}/dog avatar.jpeg`} alt="Description" />
       
        <TextField 
            id="outlined-basic" 
            label="First Name"
            variant="outlined" 
            value={firstName}
            onChange={(e) => setFirstname(e.target.value)}
            inputProps={{ maxLength: 15 }}            
            />

        <TextField 
            id="outlined-basic" 
            label="User Name"
            variant="outlined" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            inputProps={{ maxLength: 15 }}            
        />      

        <TextField 
             id="password-input"
             label="Password"
             variant="outlined"
             type="password"
             value={password}
             onChange={handlePasswordChange}
             inputProps={{ maxLength: 15 }}
             helperText={isPasswordValid || password.length === 0 ? '' : passwordHelper}
             error={!isPasswordValid && password.length > 0}       
             sx={{width: '225px'}}
            />
        <div style={{display: 'flex', gap: '20px'}}>
            <Button disabled={!isPasswordValid} type='submit' variant="contained">Sign Up</Button>
            <Button onClick={onBack} variant="outlined">Back</Button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
