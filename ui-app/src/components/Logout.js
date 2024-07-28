import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = ({ setToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // أرسل طلب تسجيل الخروج إلى الخادم الخلفي إذا لزم الأمر
        // await axios.post('http://127.0.0.1:8000/users/api/logout/'); // مثال على طلب تسجيل الخروج

        // قم بمسح الرمز المميز من localStorage
        localStorage.removeItem('authToken');

        // قم بتحديث الحالة في App.js
        setToken(null);

        // أعد توجيه المستخدم إلى صفحة تسجيل الدخول
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    handleLogout(); // قم بتنفيذ تسجيل الخروج عند تحميل المكون
  }, [navigate, setToken]);

  return null; // لا حاجة لعرض أي شيء في مكون تسجيل الخروج
};

export default Logout;
