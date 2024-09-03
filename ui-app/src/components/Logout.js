import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = ({ setToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
       
        
        localStorage.removeItem('authToken');

       
        setToken(null);

        
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    handleLogout(); 
  }, [navigate, setToken]);

  return null; 
};

export default Logout;
