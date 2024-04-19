import axios from 'axios';


const API_BASE_URL = 'http://localhost:5029/DogBarber';

const AUTH_ENDPOINTS = {
    signUp: 'SignUp',
    signIn: 'SignIn'
}

export enum AuthenticationResult {
    Success = 0,
    UserNotFound = 1,
    IncorrectPassword = 2,
    SqlError = 3,
    GeneralError = 4
}

export enum SignUpResult {
    Success = 0,
    UsernameAlreadyExists = 1,
    GeneralError = 2
}

export interface AuthUser {
    userId: number;
    firstName: string;
    username: string
}

export interface AuthenticationResponse {
    status: AuthenticationResult;
    user?: AuthUser;
}


export const signUpUser = async (userData: { username: string, password: string, firstName: string }): Promise<SignUpResult> => {

    const response = await axios.post(`${API_BASE_URL}/${AUTH_ENDPOINTS.signUp}`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
};

export const signInUser = async (userData: { username: string, password: string }): Promise<AuthenticationResponse> => {

    const response = await axios.post(`${API_BASE_URL}/${AUTH_ENDPOINTS.signIn}`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
};