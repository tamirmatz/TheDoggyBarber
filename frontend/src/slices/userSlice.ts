import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '../api/authApi';

interface UserState {
    user: AuthUser | null
    isAuthenticated: boolean;
    isLoading: boolean;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    isLoading: false
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signIn: (state, action: PayloadAction<{ user: AuthUser }>) => {

            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        signOut: (state) => {

            state.isAuthenticated = false;
            state.user = null;
        },
        setIsLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {

            state.isLoading = action.payload.isLoading;
        },
    },
});

export const { signIn, signOut, setIsLoading } = userSlice.actions;

export default userSlice.reducer;
