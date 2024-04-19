import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Appointments from './Components/Appointments';
import Header from './Components/Header';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { signIn } from './slices/userSlice';
import { useAppDispatch } from './hooks/hooksHelper';
import { AuthUser } from './api/authApi';
import NotAuthPage from './Components/NotAuthPage';

function App() {
  const isAuth = useSelector((state: RootState) => state.user.isAuthenticated);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const sessionUserJson = sessionStorage.getItem('user');
    const sessionUser = sessionUserJson ? JSON.parse(sessionUserJson) : null;

    if(sessionUser) {
      dispatch(signIn({user: sessionUser}))
    }

  }, [])

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Appointments" element={isAuth ? <Appointments /> : <NotAuthPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
