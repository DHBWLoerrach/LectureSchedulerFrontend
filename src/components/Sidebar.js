import React, { useState, useEffect } from 'react';
import { fetchProtectedData } from '../js/fetchProtectedData';
import { NavLink } from 'react-router-dom';

var userInfo = [];
const Sidebar = () => {

  const [loading, setLoading] = useState(true);
  const [userLevel, setUserLevel] = useState(0);

    useEffect(() => {
        userInfo = [];
        const fetchUserInfo = async () => {
        const data = await fetchProtectedData();

        userInfo = await [...userInfo, ...data];

        // asign user priviledge
        switch(userInfo[2]){

          case "Dozent":
            setUserLevel(1);
            break;

          case "Sekretariat":
            setUserLevel(2);
            break;

          case "Admin":
            setUserLevel(3);
            break;

          default:
            setUserLevel(0);
            break;
        }

        setLoading(false);
        };

        fetchUserInfo();
        
    }, []);


  const name = userInfo[3] + " " + userInfo[4];
  const department = userInfo[1];
  const role = userInfo[2];

  return (
    <div className="sidebar pe-3 pb-3">
      <nav className="navbar bg-light navbar-light">

        <NavLink to="/" className="navbar-brand mx-4 mb-3">
          <h3 className="text-primary">DHBW-VKP</h3>
        </NavLink>
        
        <div className="d-flex align-items-center ms-4 mb-4">
          <div className="position-relative">
            <img className="rounded-circle" src="img/user.jpg" alt="" style={{ width: '40px', height: '40px' }} />
            <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
          </div>
          <div className="ms-3">
            <h6 className="mb-0" id="setUsername1">{name}</h6>
            <span id="setRole">{role}</span>
          </div>
        </div>
        <div className="navbar-nav w-120">

          {//only visble to teachers
          userLevel < 2 &&
          <NavLink to="/" className="nav-item nav-link" activeclassname="active"><i className="fa fa-tachometer-alt me-2"></i>Dashboard</NavLink>
          }
          
          {//only visble to secretaries and admins
          userLevel > 1 &&
          <NavLink to="/admin" className="nav-item nav-link" activeclassname="active"><i className="fa fa-tachometer-alt me-2"></i>Dashboard</NavLink>
          }

          {//only visble to admins
          userLevel > 2 &&
          <>
          <NavLink to="/admin-bereich" className="nav-item nav-link" activeclassname="active"><i className="fa fa-pencil-ruler me-2"></i>Admin Bereich</NavLink>
          <NavLink to="/benutzerverwaltung" className="nav-item nav-link" activeclassname="active"><i className="fa fa-user-alt me-2"></i>Benutzerverwaltung</NavLink>
          </>
          }

          
          {//only visble to secretaries and admins
          userLevel > 1 &&
          <>
          
          <NavLink to="/studiengänge" className="nav-item nav-link" activeclassname="active"><i className="fa fa-school me-2"></i>Studiengänge</NavLink>
          <NavLink to="/module" className="nav-item nav-link" activeclassname="active"><i className="fa fa-project-diagram me-2"></i>Module</NavLink>
          <NavLink to="/kurse" className="nav-item nav-link" activeclassname="active"><i className="fa fa-chalkboard-teacher me-2"></i>Kurse</NavLink>
          </>
          
          }

          
          <NavLink to="/kalender" className="nav-item nav-link" activeclassname="active"><i className="fa fa-calendar-alt me-2"></i>Kalenderplaner</NavLink>

        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
