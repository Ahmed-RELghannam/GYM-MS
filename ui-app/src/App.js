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
import CreateUser from './components/CreateUser';
import CashierList from './components/cashierLest';
import CoachList from './components/CoachList';
import MemberList from './components/memebers';
import PlansList from './components/plans';
import SubscriptionsList from './components/subscriptions';
import Withdraw from './components/withdraw';
import NewbBlling from './components/newbilling';
import MemberProfile from './components/memberProfile';
import UserProfile from './components/userProfile'


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
          <Route path="/cashiers" element={token ? <CashierList /> : <Navigate to="/login" />} />
          <Route path="/coachs" element={token ? <CoachList /> : <Navigate to="/login" />} />
          <Route path="/memebers" element={token ? <MemberList /> : <Navigate to="/login" />} />
          <Route path="/plans" element={token ? <PlansList /> : <Navigate to="/login" />} />
          <Route path="/subscriptions" element={token ? <SubscriptionsList /> : <Navigate to="/login" />} />
          <Route path="/Withdraw" element={token ? <Withdraw /> : <Navigate to="/login" />} />
          <Route path="/newbilling" element={token ? <NewbBlling /> : <Navigate to="/login" />} />
          <Route path="/memberprofile" element={token ? <MemberProfile /> : <Navigate to="/login" />} />
          <Route path="/userProfile" element={token ? <UserProfile /> : <Navigate to="/login" />} />

          
        </Route>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/login" element={<LoginForm setToken={setToken} />} />
          <Route path="/password-reset-request" element={<PasswordResetRequestForm />} />
          <Route path="/reset-password/:uid/:token" element={<SetNewPasswordForm />} />
          <Route path="/create/:userType/:uid/:token" element={<CreateUser />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
