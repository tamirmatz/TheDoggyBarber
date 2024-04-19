import { useCallback } from 'react';
import { AuthenticationResult, SignUpResult, signInUser, signUpUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './hooksHelper';
import { setIsLoading, signIn } from '../slices/userSlice';
import { openSnackbar } from '../slices/snackbarSlice';

export function useAuthRequests() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Function to handle user sign-up
    const handleSignUp = useCallback(async (userData: { username: string, password: string, firstName: string }) => {
        try {
            dispatch(setIsLoading({isLoading: true})); 

            const responseCode = await signUpUser(userData);
            if(responseCode === SignUpResult.Success) {
                
                // success 
                navigate('/');
                dispatch(openSnackbar({ message: 'Account Created Successfully', severity: 'success' }))

            } else if (responseCode === SignUpResult.UsernameAlreadyExists){
                dispatch(openSnackbar({ message: 'Username Already Exists !', severity: 'error' }))
            }
            else {

                dispatch(openSnackbar({ message: 'General Error', severity: 'error' }))
            }

        } catch (error) {
            dispatch(openSnackbar({ message: 'General Error', severity: 'error' }))
        } finally {
            dispatch(setIsLoading({isLoading: false})); 
        }
    }, []);

    const handleSignIn = useCallback(async (userData: { username: string, password: string }) => {
        try {
            dispatch(setIsLoading({isLoading: true})); 

            const response = await signInUser(userData);

            if(response.status === AuthenticationResult.Success && response.user) {
                // add here logic to save the user on session storage
                sessionStorage.setItem('user', JSON.stringify(response.user));
                dispatch(signIn({user: response.user}))
                navigate('/Appointments');

            } else if (response.status === AuthenticationResult.UserNotFound){

                dispatch(openSnackbar({ message: 'User Not Found', severity: 'error' }))
            }
            else if (response.status === AuthenticationResult.IncorrectPassword){

                dispatch(openSnackbar({ message: 'Incorrect Password', severity: 'error' }))
                
            }
            else if (response.status === AuthenticationResult.GeneralError){

                dispatch(openSnackbar({ message: 'General Error', severity: 'error' }))
            } else {
                dispatch(openSnackbar({ message: 'General Error', severity: 'error' }))
            }

        } catch (error) {

            dispatch(openSnackbar({ message: 'General Error', severity: 'error' }))
        } finally {

            dispatch(setIsLoading({isLoading: false})); 
        }
    }, []);

    // Add more auth related functions here if needed

    return {
        handleSignUp,
        handleSignIn
    };
}
