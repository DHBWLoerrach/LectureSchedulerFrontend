import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import de from 'date-fns/locale/de'; // Import German locale
import { fetchProtectedData } from '../../js/fetchProtectedData';
import Select from 'react-select';

import '../_Datapicker.css';

registerLocale('de', de); // Register German locale globally

const TempStudiengänge = () => {
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

  return (
    <div>
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="h-100 bg-white rounded p-4 d-flex align-items-center justify-content-center">
            <img
              src="img/DashboardNav.png"
              alt=""
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="col-sm-6 col-x1-3">
            <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <i className="fa fa-school fa-3x text-primary"></i>
              <div className="ms-3">
                <p className="mb-2">Studiengänge</p>
                <h6 className="mb-0 text-end">1</h6>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-x1-3">
            <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <i className="bi-person-badge-fill fa-2x text-primary"></i>
              <div className="ms-3">
                <p className="mb-2">Dozenten</p>
                <h6 className="mb-0 text-end">1</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br></br>
      <center>
        {!state.shownewDepartmentWidget && (
          <button
            className="btn btn-primary w-40 m-0"
            type="button"
            onClick={handleShownewDepartmentWidget}
          >
            Neuen Studiengang anlegen
          </button>
        )}
      </center>

      <div ref={allProjectRef}></div>
      <div className="container-fluid pt-4 px-4">
        <div className="bg-light text-center rounded p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h6 className="mb-0">Alle Studiengänge</h6>
            <button
              type="button"
              className="btn btn-outline-danger m-2"
              onClick={handleDeleteSelected}
            >
              Auswahl Löschen
            </button>
          </div>
          <div className="table-responsive">
            <table className="table text-start align-middle table-bordered table-hover mb-0">
              <thead>
                <tr className="text-dark">
                  <th scope="col">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={state.allChecked}
                      onChange={handleMainCheckboxChange}
                    />
                  </th>
                  <th scope="col">Studiengang</th>
                  <th scope="col">Bearbeiten</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={false}
                      onChange={() => handleCheckboxChange()}
                    />
                  </td>
                  <td>TIF</td>
                  <td>
                    <center>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={showStuff}
                      >
                        <i className="bi-gear-fill fa-1x text-white"></i>
                      </button>
                    </center>
                  </td>
                </tr>
              </tbody>
            </table>

            <div ref={editProjectRef}></div>
          </div>
        </div>
      </div>

      {state.showEditMenu && (
        <div>
          <div className="container-fluid pt-4 px-4">
            <div className="bg-light text-center rounded p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h6 className="mb-0">Studiengang bearbeiten</h6>
              </div>
              <p className="text-start">
                <strong>Studiengang</strong>
              </p>
              <input
                type="text"
                className="form-control"
                value={'TIF'}
                placeholder="Vorname"
              />
              <br />
              <p className="text-start">
                <strong>Zugewiesene Module (1 Semester)</strong>
              </p>
              <Select
                options={[
                  { value: '1', label: 'Mathe I' },
                  { value: '1', label: 'Mathe II' },
                  { value: '1', label: 'Theoretische Informatik I' },
                ]}
                value={''}
                placeholder={''}
              />
              <br />
              <p className="text-start">
                <strong>Zugewiesene Module (2 Semester)</strong>
              </p>
              <Select
                options={[
                  { value: '1', label: 'Mathe I' },
                  { value: '1', label: 'Mathe II' },
                  { value: '1', label: 'Theoretische Informatik I' },
                ]}
                value={''}
                placeholder={''}
              />
              <br />
              <p className="text-start">
                <strong>Zugewiesene Module (3 Semester)</strong>
              </p>
              <Select
                options={[
                  { value: '1', label: 'Mathe I' },
                  { value: '1', label: 'Mathe II' },
                  { value: '1', label: 'Theoretische Informatik I' },
                ]}
                value={''}
                placeholder={''}
              />
              <br />
              <p className="text-start">
                <strong>Zugewiesene Module (4 Semester)</strong>
              </p>
              <Select
                options={[
                  { value: '1', label: 'Mathe I' },
                  { value: '1', label: 'Mathe II' },
                  { value: '1', label: 'Theoretische Informatik I' },
                ]}
                value={''}
                placeholder={''}
              />
              <br />
              <p className="text-start">
                <strong>Zugewiesene Module (5 Semester)</strong>
              </p>
              <Select
                options={[
                  { value: '1', label: 'Mathe I' },
                  { value: '1', label: 'Mathe II' },
                  { value: '1', label: 'Theoretische Informatik I' },
                ]}
                value={''}
                placeholder={''}
              />
              <br />
              <p className="text-start">
                <strong>Zugewiesene Module (6 Semester)</strong>
              </p>
              <Select
                options={[
                  { value: '1', label: 'Mathe I' },
                  { value: '1', label: 'Mathe II' },
                  { value: '1', label: 'Theoretische Informatik I' },
                ]}
                value={''}
                placeholder={''}
              />
              <br />

              <button
                type="button"
                id="createProjectButton"
                className="btn btn-outline-warning m-2"
              >
                Bearbeiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TempStudiengänge;
