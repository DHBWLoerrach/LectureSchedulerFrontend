import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import de from 'date-fns/locale/de'; // Import German locale
import { fetchProtectedData } from '../../js/fetchProtectedData';
import Select from 'react-select';

import '../_Datapicker.css';

registerLocale('de', de); // Register German locale globally

const TempKalender = () => {
  const [state, setState] = useState({
    selectedDate: null,
    shownewDepartmentWidget: false,
    showEditProjectWidget: false,
    configureThisDepartment: null,
    loading: true,
    imagesLoaded: false,
    userInfo: [],
    allPersonnel: [],
    allChecked: false,
    checkedItems: [],
    employeeCount: 0,
    adminCount: 0,
    secretaryCount: 0,
    lecturerCount: 0,
    myEmployeeCount: 0,
    showEditMenu: false,
  });

  const editProjectRef = useRef(null); // Ref for EditDepartmentWidget
  const allProjectRef = useRef(null); // Ref for ShowPersonnel

  const images = ['img/DHBW_Logo.png', 'img/DashboardNav.png']; // Add all images that need to be loaded

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
      //const activePCount = allP.filter(item => item[6] !== "Inaktiv").length;

      setState((prevState) => ({
        ...prevState,

        loading: false,
      }));
    };

    fetchInfo();
  }, []);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      checkedItems: new Array(prevState.allPersonnel.length).fill(false),
    }));
  }, [state.allPersonnel]);

  const handleMainCheckboxChange = () => {
    const newCheckedState = !state.allChecked;
    setState((prevState) => ({
      ...prevState,
      allChecked: newCheckedState,
      checkedItems: new Array(prevState.allPersonnel.length).fill(
        newCheckedState
      ),
    }));
  };

  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...state.checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setState((prevState) => ({
      ...prevState,
      checkedItems: newCheckedItems,
      allChecked: newCheckedItems.every((item) => item),
    }));
  };

  const showStuff = () => {
    setState((prevState) => ({
      ...prevState,

      showEditMenu: true,
    }));
  };

  const handleDeleteSelected = async () => {};

  if (state.loading) {
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
          alt="DHBW Logo"
          width="100vh"
          height="auto"
        />
      </div>
    );
  }

  const handleShownewDepartmentWidget = () => {
    setState((prevState) => ({ ...prevState, shownewDepartmentWidget: true }));
  };

  const handleaddDepartment = (newDepartment) => {
    const projectArray = [
      newDepartment._id,
      newDepartment.Vorname,
      newDepartment.Nachname,
      newDepartment.Berechtigung,
      newDepartment.Benutzername,
    ];

    setState((prevState) => ({
      ...prevState,
      allPersonnel: [projectArray, ...prevState.allPersonnel],
      shownewDepartmentWidget: false,
    }));
  };

  const handleEditDepartment = (configuredDepartment) => {
    setState((prevState) => ({
      ...prevState,
      allPersonnel: prevState.allPersonnel.map((department) => {
        if (department[0] === configuredDepartment._id) {
          return [
            department[0],
            configuredDepartment.Vorname,
            configuredDepartment.Nachname,
            configuredDepartment.Berechtigung,
            configuredDepartment.Benutzername,
          ];
        }
        return department;
      }),
      showEditProjectWidget: false,
    }));
    setTimeout(() => {
      if (allProjectRef.current) {
        allProjectRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  const generateSchedule = (startHour, endHour, intervalMinutes) => {
    const times = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const time = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
  };

  const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
  const schedule = generateSchedule(8, 18, 30);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Stundenplan (Mo-Fr)</h1>
      <p className="text-start">
        <strong>Kurs auswählen</strong>
      </p>
      <Select
        options={[
          { value: '1', label: 'Kurs 1s' },
          { value: '1', label: 'Kurs 2' },
          { value: '1', label: 'Kurs 3' },
        ]}
        value={''}
        placeholder={''}
      />
      <br />
      <table
        style={{
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: '#ff0000',
                color: 'white',
                padding: '10px',
                border: '1px solid #ddd',
              }}
            >
              Zeit
            </th>
            {days.map((day) => (
              <th
                key={day}
                style={{
                  backgroundColor: '#ff0000',
                  color: 'white',
                  padding: '10px',
                  border: '1px solid #ddd',
                }}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedule.map((time, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white',
              }}
            >
              <td
                style={{
                  border: '1px solid #ddd',
                  padding: '10px',
                  fontWeight: 'bold',
                  backgroundColor: '#e8e8e8',
                  textAlign: 'center',
                }}
              >
                {time}
              </td>
              {days.map((day) => (
                <td
                  key={`${day}-${index}`}
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    textAlign: 'center',
                  }}
                >
                  {/* Add activities here if needed */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TempKalender;
