import React, { useState } from 'react';
import axios from 'axios';

const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/api/PasswordResetRequest/', { email });
      alert('Chech your Email');
      return;
    } catch (error) {
      // ... (معالجة الأخطاء)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit">Request Password Reset</button>
    </form>
  );
};

export default PasswordResetRequestForm;
