import React from 'react';
import { Outlet, Link } from 'react-router-dom'; // Make sure to import Link

const Layout = () => {
  return (
    <div>
      <nav>
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/logout">logout</Link>
          </li>
          {/* Add more navigation links here as needed */}
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
