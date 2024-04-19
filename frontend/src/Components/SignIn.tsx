import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { useAuthRequests } from '../hooks/useAuthRequests ';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';
import { RootState } from '../store';



const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleSignIn } = useAuthRequests();
  const isLoading = useSelector((state: RootState) => state.user.isLoading);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      username,
      password,
    };


    handleSignIn(userData);
  };

  const onSignUp = () => {
    navigate('/SignUp');
  }

  return (
    <div className='sign-form-container'>
      <form className='sign-form' onSubmit={handleSubmit}>
      <img className='dog-avatar' src={`${process.env.PUBLIC_URL}/dog avatar.jpeg`} alt="Description" />
       
        <TextField 
            id="outlined-basic" 
            label="User Name"
            variant="outlined" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            inputProps={{ maxLength: 15 }}            
             />

        <TextField 
            id="outlined-basic" 
            label="Password"
            variant="outlined" 
            value={password}
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            inputProps={{ maxLength: 15 }}            
            />

            <div style={{display: 'flex', gap: '20px'}}>
                <LoadingButton disabled={password.length === 0 || username.length === 0} loading={isLoading} type='submit' variant="contained">Sign-In</LoadingButton>
                <LoadingButton onClick={onSignUp} variant="outlined">Sign-Up</LoadingButton>
            </div>

      </form>
    </div>
  );
};

export default SignInPage;
