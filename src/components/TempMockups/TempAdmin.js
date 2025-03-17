import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import de from 'date-fns/locale/de'; // Import German locale
import { fetchProtectedData } from '../../js/fetchProtectedData';
import Select from 'react-select';

import '../_Datapicker.css';

registerLocale('de', de); // Register German locale globally

const TempAdmin = () => {
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

  const images = ["img/DHBW_Logo.png", "img/DashboardNav.png"]; // Add all images that need to be loaded

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
      setState(prevState => ({ ...prevState, imagesLoaded: true }));
    };

    loadImages();
  }, []);

  useEffect(() => {
    const fetchInfo = async () => {
      
      
      //const activePCount = allP.filter(item => item[6] !== "Inaktiv").length;

      setState(prevState => ({
        ...prevState,

        loading: false,
      }));
    };
  
    fetchInfo();
  }, []);

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      checkedItems: new Array(prevState.allPersonnel.length).fill(false),
    }));
  }, [state.allPersonnel]);

  const handleMainCheckboxChange = () => {
    const newCheckedState = !state.allChecked;
    setState(prevState => ({
      ...prevState,
      allChecked: newCheckedState,
      checkedItems: new Array(prevState.allPersonnel.length).fill(newCheckedState),
    }));
  };

  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...state.checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setState(prevState => ({
      ...prevState,
      checkedItems: newCheckedItems,
      allChecked: newCheckedItems.every(item => item),
    }));
  };

  const showStuff = () => {
    setState(prevState => ({
      ...prevState,

      showEditMenu: true,
    }));
  };

  const handleDeleteSelected = async () => {
    
  };

  if (state.loading) {
    return (
      <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <img src="img/DHBW_Logo.png" alt="DHBW Logo" width="100vh" height="auto" />
      </div>
    );
  }

  const handleShownewDepartmentWidget = () => {
    setState(prevState => ({ ...prevState, shownewDepartmentWidget: true }));
  };

  const handleaddDepartment = (newDepartment) => {

    const projectArray = [
      newDepartment._id,
      newDepartment.Vorname,
      newDepartment.Nachname,
      newDepartment.Berechtigung,
      newDepartment.Benutzername,
    ];

    setState(prevState => ({
      ...prevState,
      allPersonnel: [projectArray, ...prevState.allPersonnel],
      shownewDepartmentWidget: false,
    }));
  };

  const handleEditDepartment = (configuredDepartment) => {
    setState(prevState => ({
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
            <img src="img/DashboardNav.png" alt="" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      </div>
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">

          
        </div>
      </div>


      <center><h1 className="text-primary"><strong>Audittrail</strong></h1></center>
      
      <center>
        
      <div
      style={{
        backgroundColor: '#1e1e1e',
        color: '#c5c8c6',
        border: '1px solid #444',
        padding: '10px',
        width: '90%',
        height: '30vh', // Height set to 30% of the viewport height
        overflowY: 'scroll', // Enable vertical scrolling
        borderRadius: '4px',
      }}
    >
      <div
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          textAlign: 'left', // Ensures the text is left-aligned
        }}
      >
        {'09:11 - 20.01.25 - Max Mustermann | TIF22A | Mathematik II | Verlegt\n'.repeat(50)}{/* Add extra lines to test scrolling*/}
        09:13 - 20.01.25 - Max Mustermann | TIF22B | Mathematik II | Storniert
      </div>
    </div>

      </center>
      <br></br><br></br><br></br>
      <center><h1 className="text-primary"><strong>Regeln</strong></h1></center>


      <div>
            <div className="container-fluid pt-4 px-4">
      <div className="bg-light text-center rounded p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">Regeln bearbeiten</h6>
        </div>
        <p className="text-start"><strong>Frühste Unterrichtzeit</strong></p>
        <Select
          options={[{value:"1", label:"00:00"},
                    {value:"1", label:"00:15"},
                    {value:"1", label:"00:30"}
          ]}
          value={""}
          placeholder={"7:30"}
        />
        <br />
        <p className="text-start"><strong>Späteste Unterrichtzeit</strong></p>
        <Select
          options={[{value:"1", label:"00:00"},
            {value:"1", label:"00:15"},
            {value:"1", label:"00:30"}
          ]}
          value={""}
          placeholder={"18:30"}
        />
        <br />
        <p className="text-start"><strong>Maximale Blockdauer</strong></p>
        <input
          type="text"
          className="form-control"
          value={"3"}

          placeholder="Vorname"
        />
        <br />

        

        

        <button type="button" id="createProjectButton" className="btn btn-outline-warning m-2" >
          Bearbeiten
        </button>
      </div>
    </div>
            </div>





    </div>
  );
};

export default TempAdmin;
