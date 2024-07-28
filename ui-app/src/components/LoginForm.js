import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error message

    try {
      const response = await axios.post('http://127.0.0.1:8000/users/api/login/', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem('authToken', token);
        setToken(token);
        navigate('/');
      } else {
        setErrorMessage('Login failed: No token received.'); // Error message if no token
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setErrorMessage(error.response.data.message || 'Login failed. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        setErrorMessage('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrorMessage('Login failed. Please check your network connection.');
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
      <button type="submit">Login</button>
      <a href='/password-reset-request'>Forget my pasword </a>
    </form>
  );
};

export default LoginForm;
