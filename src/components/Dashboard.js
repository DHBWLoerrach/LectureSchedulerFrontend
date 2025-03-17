import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { registerLocale } from 'react-datepicker';
import de from 'date-fns/locale/de'; // Import German locale
import { fetchProtectedData } from '../js/fetchProtectedData';

import { ShowModulesAPI } from './APIs/Modules/ShowModulesAPI';
import { ShowCoursesAPI } from './APIs/Courses/ShowCoursesAPI';

import './_Datapicker.css';

registerLocale('de', de); // Register German locale globally

const Dashboard = () => {
  const [state, setState] = useState({
    userInfo: [],
    allProjects: [],
    selectedDate: null,
    myID: "",
    myModulesCount: 0,
    myCoursesCount: 0,
    loading: true,
    imagesLoaded: false
  });

  const images = ["img/DHBW_Logo.png", "img/Dashboard.jpeg", "img/DashboardNav.png"]; // Add all images that need to be loaded

  useEffect(() => {
    const loadImages = async () => {
      const promises = images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });
      await Promise.all(promises);
      setState((prevState) => ({ ...prevState, imagesLoaded: true }));
    };

    loadImages();
  }, []);

  useEffect(() => {
    const fetchInfo = async () => {
      const myInfo = await fetchProtectedData();
      const myID = myInfo[5]

      const myModules = await ShowModulesAPI();

      const count = myModules.reduce((acc, subArray) => {
        // Ensure the third element exists and is an array before checking
        if (Array.isArray(subArray[3]) && subArray[3].includes(myID)) {
          return acc + 1;
        }
        return acc;
      }, 0);
      
      console.log(count); // Outputs: 2

      
      console.log(myID)
      console.log(myModules)
      setState((prevState) => ({
        ...prevState,
        myModulesCount: count,
        loading: false
      }));
    };

    fetchInfo();
  }, []);

  if (state.loading) {
    return (
      <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-danger" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <img src="img/DHBW_Logo.png" alt="Exyte Logo" width="100vh" height="auto" />
      </div>
    );
  }

  return (
    <div>
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="h-100 bg-white rounded p-4 d-flex align-items-center justify-content-center">
            <img src="img/DashboardNav.png" alt="" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      </div>

      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="col-sm-6 col-xl-12">
            <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <i className="fa fa-project-diagram fa-2x text-danger"></i>
              <div className="ms-3">
                <p className="mb-2">Meine Module</p>
                <h6 className="mb-0 text-end">{state.myModulesCount}</h6>
              </div>
            </div>
          </div>
          

        </div>
      </div>
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="h-100 bg-white rounded p-4 d-flex align-items-center justify-content-center">
            <img src="img/Dashboard.jpeg" alt="" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
