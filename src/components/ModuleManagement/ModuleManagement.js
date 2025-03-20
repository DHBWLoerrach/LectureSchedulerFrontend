import { useState, useEffect, useRef } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import de from 'date-fns/locale/de'; // Import German locale
import { fetchProtectedData } from '../../js/fetchProtectedData';
import { NewModuleWidget } from './NewModuleWidget';
import { ShowModule } from './ShowModule';
import { useNavigate } from 'react-router-dom';

import { ShowModulesAPI } from '../APIs/Modules/ShowModulesAPI';
import { DeleteModuleAPI } from '../APIs/Modules/DeleteModuleAPI';
import { EditModuleWidget } from './EditModuleWidget';
import '../_Datapicker.css';
import { ShowEmployeesAPI } from '../APIs/Employees/ShowEmployeesAPI';

registerLocale('de', de); // Register German locale globally

const ModuleManagement = () => {
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
  });

  const editProjectRef = useRef(null); // Ref for EditDepartmentWidget
  const allProjectRef = useRef(null); // Ref for ShowModule
  const navigate = useNavigate();
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
      const data = await fetchProtectedData();

      if (data[2] === 'Dozent') {
        // Redirect to the main page
        navigate('/');
      }

      const allE = await ShowModulesAPI();
      const eCount = await ShowModulesAPI();
      const gCount = await ShowEmployeesAPI();

      console.log(eCount);

      // admin count
      const ACount = gCount.filter((item) => item[3] === 'Admin').length;

      // secretary count
      const SCount = gCount.filter((item) => item[3] === 'Sekretariat').length;

      // lecturer count
      const LCount = gCount.filter((item) => item[3] === 'Dozent').length;

      console.log(LCount);
      //const activePCount = allP.filter(item => item[6] !== "Inaktiv").length;

      setState((prevState) => ({
        ...prevState,
        userInfo: data,
        allPersonnel: [...allE].reverse(), // Use reversed array
        employeeCount: eCount.length,
        adminCount: ACount,
        secretaryCount: SCount,
        lecturerCount: LCount,
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

  const configureProject = (index) => {
    const result = state.allPersonnel.find(
      (innerArray) => innerArray[0] === index
    );
    setState((prevState) => ({
      ...prevState,
      configureThisDepartment: result,
      showEditProjectWidget: true,
    }));
    setTimeout(() => {
      if (editProjectRef.current) {
        editProjectRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  const handleDeleteSelected = async () => {
    const confirmed = window.confirm(
      'Sind Sie sicher, dass Sie die ausgewählten Mitarbeiter löschen möchten? Dieser Vorgang kann nicht rückgängig gemacht werden.'
    );

    if (!confirmed) {
      return;
    }

    const selectedIds = state.allPersonnel
      .filter((_, index) => state.checkedItems[index])
      .map((project) => project[0]);

    try {
      const apiResponse = await DeleteModuleAPI(selectedIds);

      if (apiResponse) {
        const response = await apiResponse[1];
        const parsedResponse = JSON.parse(response);
        alert(parsedResponse.message);

        setState((prevState) => ({
          ...prevState,
          allPersonnel: prevState.allPersonnel.filter(
            (_, index) => !prevState.checkedItems[index]
          ),
          checkedItems: [],
          allChecked: false,
        }));
      } else {
        alert('Failed to delete projects');
      }
    } catch (error) {
      console.error('Error deleting projects:', error);
      alert('An error occurred while deleting projects');
    }
  };

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
    console.log('233', newDepartment);
    const projectArray = [
      newDepartment._id,
      newDepartment.Modulname,
      newDepartment.Vorlesungsstunden,
      newDepartment.ZugewieseneDozenten,
    ];

    setState((prevState) => ({
      ...prevState,
      allPersonnel: [projectArray, ...prevState.allPersonnel],
      shownewDepartmentWidget: false,
    }));
  };

  const handleEditDepartment = (configuredDepartment) => {
    console.log('233', configuredDepartment);
    setState((prevState) => ({
      ...prevState,
      allPersonnel: prevState.allPersonnel.map((department) => {
        if (department[0] === configuredDepartment._id) {
          return [
            department[0],
            configuredDepartment.Modulname,
            configuredDepartment.Vorlesungsstunden,
            configuredDepartment.ZugewieseneDozenten,
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
              <i className="fa fa-project-diagram fa-3x text-primary"></i>
              <div className="ms-3">
                <p className="mb-2">Module</p>
                <h6 className="mb-0 text-end">{state.employeeCount}</h6>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-x1-3">
            <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <i className="bi-person-badge-fill fa-2x text-primary"></i>
              <div className="ms-3">
                <p className="mb-2">Dozenten</p>
                <h6 className="mb-0 text-end">{state.lecturerCount}</h6>
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
            Neues Modul anlegen
          </button>
        )}
      </center>
      {state.shownewDepartmentWidget && (
        <NewModuleWidget addDepartment={handleaddDepartment} />
      )}{' '}
      {/* Conditionally render NewModuleWidget */}
      <div ref={allProjectRef}></div>
      <div className="container-fluid pt-4 px-4">
        <div className="bg-light text-center rounded p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h6 className="mb-0">Alle Module</h6>
            <button
              type="button"
              className="btn btn-outline-danger m-2"
              onClick={handleDeleteSelected}
            >
              Auswahl löschen
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
                  <th scope="col">Modul</th>
                  <th scope="col">Vorlesungsstunden</th>
                  <th scope="col">Bearbeiten</th>
                </tr>
              </thead>
              <tbody>
                <ShowModule
                  projects={state.allPersonnel}
                  checkedItems={state.checkedItems}
                  handleCheckboxChange={handleCheckboxChange}
                  configureProject={configureProject}
                />
              </tbody>
            </table>
            <div ref={editProjectRef}></div>
          </div>
        </div>
      </div>
      {state.showEditProjectWidget && (
        <EditModuleWidget
          employee={state.configureThisDepartment}
          editDepartment={handleEditDepartment}
        />
      )}{' '}
      {/* Conditionally render EditDepartmentWidget */}
    </div>
  );
};

export default ModuleManagement;
