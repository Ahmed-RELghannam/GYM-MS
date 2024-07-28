import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div>
      {/* بدون شريط التنقل */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;