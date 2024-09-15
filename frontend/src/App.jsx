import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { Toaster } from "react-hot-toast";
import VerifyEmail from './pages/VerifyEmail'
import { useAuthContext } from '../context/Zustand';
import Dashboard from './pages/Dashboard';
import ForgetPassword from './pages/ForgetPassword';
import ResetPasswordPage from './pages/ResetPassword';

const App = () => {

  const { user, checkAuth } = useAuthContext();
  useEffect(() => {
    checkAuth();
  },[checkAuth])
  return (
    <div className='min-h-screen bg-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
      <Routes>
        <Route path='/' element={user ? (user.isVerified ? <Dashboard /> : <Navigate to="/verify-email" />) : <Navigate to="/login" />} />
        <Route path='/signup' element={user ? <Navigate to={"/"} /> : <Signup />} />
        <Route path='/login' element={user ? <Navigate to={"/"} />:<Login />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/forget-password' element={<ForgetPassword />} />
        <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
