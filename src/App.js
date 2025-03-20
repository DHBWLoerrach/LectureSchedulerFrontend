import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import DashboardAdmin from './components/DashboardAdmin';

import PersonnelManagement from './components/PersonnelManagement/PersonnelManagement';
import ModuleManagement from './components/ModuleManagement/ModuleManagement';
import SGManagement from './components/SGManagement/SGManagement';
import CourseManagement from './components/CourseManagement/CourseManagement';

import Login from './components/Login';

//import TempKalender from './components/TempMockups/TempKalender';
import Kalender from './components/Calendar/Calendar';
import Admin from './components/Admin/Admin';

import { AppLayout } from './AppLayout';

// AppLayout makes sure to display the top, side and footerbar only when the client is not in the login menu

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Router>
      {loading && (
        <div
          id="spinner"
          className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
        >
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <img
            src="img/Exyte_Logo.png"
            alt="Exyte Logo"
            width="100vh"
            height="auto"
          />
        </div>
      )}
      {loading && (
        <div
          id="spinner"
          className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
        >
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <img
            src="img/Exyte_Logo.png"
            alt="Exyte Logo"
            width="100vh"
            height="auto"
          />
        </div>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <AppLayout>
              <DashboardAdmin />
            </AppLayout>
          }
        />
        <Route
          path="/benutzerverwaltung"
          element={
            <AppLayout>
              <PersonnelManagement />
            </AppLayout>
          }
        />
        <Route
          path="/studiengänge"
          element={
            <AppLayout>
              <SGManagement />
            </AppLayout>
          }
        />
        <Route
          path="/module"
          element={
            <AppLayout>
              <ModuleManagement />
            </AppLayout>
          }
        />
        <Route
          path="/kurse"
          element={
            <AppLayout>
              <CourseManagement />
            </AppLayout>
          }
        />

        <Route
          path="/admin-bereich"
          element={
            <AppLayout>
              <Admin />
            </AppLayout>
          }
        />

        <Route
          path="/kalender"
          element={
            <AppLayout>
              <Kalender />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
