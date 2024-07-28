import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const SetNewPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token, uid } = useParams(); // استخراج token و uid من معلمات URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // التحقق من تطابق كلمتي المرور
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/users/api/SetNewPassword/', {
        password,
        token,
        uid,
      });

      navigate('/login');
    } catch (error) {
      // معالجة الأخطاء
      console.error('Error setting new password:', error);
      // يمكنك عرض رسالة خطأ للمستخدم هنا
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="password" 
        placeholder="New Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Confirm Password" 
        value={confirmPassword} 
        onChange={(e) => setConfirmPassword(e.target.value)} 
        required 
      />
      <button type="submit">Change password</button>
    </form>
  );
};

export default SetNewPasswordForm;
