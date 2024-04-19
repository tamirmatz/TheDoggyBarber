import React from 'react';
import '../App.css'
import { Button } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAppDispatch } from '../hooks/hooksHelper';
import { signOut } from '../slices/userSlice';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const logOut = () => {
        // reset appointments 
        sessionStorage.removeItem('user');
        dispatch(signOut())
        navigate('/')
    }

    return (
        <div>
            <div className='header-container'>
                <div className='header-title'>The Doggy
                    <span className='header-title'> Barber</span>
                </div>
                <Button onClick={logOut} style={{position: 'absolute', right: '1vw', fontSize: '12px'}} variant='contained' color='error'>
                    <ExitToAppIcon/>
                </Button>
            </div>

            <div style={{height: '0.5vh', backgroundColor: '#181818'}}> </div>

        </div>
    );
};

export default Header;