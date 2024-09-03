import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NotificationPopover from './NotificationPopover'; 

const Layout = () => {
  const userType = localStorage.getItem('userType');

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">GYM-MS</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
                
              </li>


              {userType === 'Owner' || userType === 'Admin' || userType === 'Cashier'? (
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Subscriptions
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
                    <li><a class="dropdown-item" href="/subscriptions">Subscriptions</a></li>
                    {userType === 'Owner' || userType === 'Admin' ? (
                    <li><a class="dropdown-item" href="/plans">Plans</a></li>
                    ) : null}
                    {userType === 'Owner' || userType === 'Admin' ? (
                    <li><a class="dropdown-item" href="/discount">Discount</a></li>
                    ) : null}
                    <li><a class="dropdown-item" href="/memebers">Members</a></li>
                  </ul>
                </li>
              ) : null}

              {userType === 'Owner' || userType === 'Admin' ? (
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Users
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
                      <li><a className="dropdown-item" href="/cashiers">Cashiers</a></li>
                      <li><a class="dropdown-item" href="/coachs">Cotchs</a></li>
                  </ul>
                </li>

              ) : null}


            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                
                  <i class="fa fa-cog" aria-hidden="true"></i> 
                
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
                  {userType === 'Owner' || userType === 'Admin' ? (
                    <li><a class="dropdown-item" href="/withdraw">Withdraw</a></li>
                  ) : null}
                  <li><a class="dropdown-item" href="/userProfile">Profile</a></li>
                  
                </ul>
              </li>

              
              {
                //userType === 'Owner' || userType === 'Admin' ? (<li className="nav-item"> <NotificationPopover />  </li> ) : null
              }
              
              <li className="nav-item">
                <Link className="nav-link" to="/logout">
                  <i className="fas fa-sign-out-alt"></i> 
                </Link>
              </li>
             
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
