import React, { useState, useEffect } from 'react';
import { fetchProtectedData } from '../js/fetchProtectedData';
import { Link } from 'react-router-dom';

var userInfo = [];

const Topbar = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userInfo = [];
    const fetchUserInfo = async () => {
      const data = await fetchProtectedData();

      userInfo = await [...userInfo, ...data];
      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div
        id="spinner"
        className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
      >
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <img
          src="img/DHBW_Logo.png"
          alt="Exyte Logo"
          width="100vh"
          height="auto"
        />
      </div>
    );
  }

  const username = userInfo[0];
  const department = userInfo[1];
  const role = userInfo[2];

  const handleLogout = (event) => {
    event.preventDefault(); // Prevent default button behavior
    localStorage.removeItem('token'); // Clear token from local storage
    window.location.href = '/login'; // Redirect to login page
  };

  const toggleSidebar = () => {
    document.querySelector('.sidebar').classList.toggle('open');
    document.querySelector('.content').classList.toggle('open');
  };

  return (
    <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
      <a className="sidebar-toggler flex-shrink-0" onClick={toggleSidebar}>
        <i className="fa fa-bars"></i>
      </a>
      <Link to="/">
        <img src="img/DHBW_Logo.png" alt="Logo" width="100vh" height="auto" />
      </Link>
      <h5 className="text-secondary pt-2 px-3">Vorlesungskalender-Planer</h5>
      <div className="navbar-nav align-items-center ms-auto">
        <div className="nav-item dropdown">
          <a
            href=""
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <img
              className="rounded-circle me-lg-2"
              src="img/user.jpg"
              alt=""
              style={{ width: '40px', height: '40px' }}
            />
            <span className="d-none d-lg-inline-flex" id="setUsername2">
              {username}
            </span>
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
            <button className="dropdown-item" onClick={handleLogout}>
              <i className="fas fa-user-cog me-2"></i>Passwort ändern
            </button>
            <button className="dropdown-item" onClick={handleLogout}>
              <i className="fa fa-door-open me-2"></i>Ausloggen
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
