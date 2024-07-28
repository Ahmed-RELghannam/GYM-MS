import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import CreateUserForm from './components/CreateUserForm';
import LoginForm from './components/LoginForm';
import PasswordResetRequestForm from './components/PasswordResetRequestForm';
import SetNewPasswordForm from './components/SetNewPasswordForm';
import HomePage from './components/HomePage';
import Layout from './components/Layout'; 
import AuthLayout from './components/AuthLayout'; 
import Logout from './components/Logout';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={token ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/logout" element={<Logout setToken={setToken} />} />
          <Route path="/create-user" element={token ? <CreateUserForm /> : <Navigate to="/login" />} />
          {/* ... (باقي المسارات المحمية داخل Layout) */}
        </Route>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/login" element={<LoginForm setToken={setToken} />} />
          <Route path="/password-reset-request" element={<PasswordResetRequestForm />} />
          <Route path="/reset-password/:uid/:token" element={<SetNewPasswordForm />} />
        
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
