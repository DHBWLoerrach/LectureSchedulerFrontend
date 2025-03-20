import { useState, useEffect, useRef } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import de from 'date-fns/locale/de'; // Import German locale
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { ShowSGAPI } from '../APIs/SG/ShowSGAPI';
import { GetAuditAPI } from '../APIs/Admin/GetAuditAPI';
import { UpdateSGHours } from '../APIs/Admin/UpdateSGHours';
import { fetchProtectedData } from '../../js/fetchProtectedData';

import '../_Datapicker.css';

registerLocale('de', de); // Register German locale globally

// Gemeinsame Options für Zeiten
const timeOptions = [
  { value: '1', label: '1:00' },
  { value: '2', label: '2:00' },
  { value: '3', label: '3:00' },
  { value: '4', label: '4:00' },
  { value: '5', label: '5:00' },
  { value: '6', label: '6:00' },
  { value: '7', label: '7:00' },
  { value: '8', label: '8:00' },
  { value: '9', label: '9:00' },
  { value: '10', label: '10:00' },
  { value: '11', label: '11:00' },
  { value: '12', label: '12:00' },
  { value: '13', label: '13:00' },
  { value: '14', label: '14:00' },
  { value: '15', label: '15:00' },
  { value: '16', label: '16:00' },
  { value: '17', label: '17:00' },
  { value: '18', label: '18:00' },
  { value: '19', label: '19:00' },
  { value: '20', label: '20:00' },
  { value: '21', label: '21:00' },
  { value: '22', label: '22:00' },
  { value: '23', label: '23:00' },
  { value: '24', label: '24:00' },
];

const Admin = () => {
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
    sgs: [],
    // Hier wird ein einzelnes Objekt erwartet, nicht ein Array!
    selectedSG: null,
    earliest: '8',
    latest: '18',
    audit: [],
  });

  // Zusätzliche States für die ausgewählten Zeiten
  const [selectedEarliest, setSelectedEarliest] = useState(null);
  const [selectedLatest, setSelectedLatest] = useState(null);
  const navigate = useNavigate();
  const editProjectRef = useRef(null);
  const allProjectRef = useRef(null);

  const images = ['img/DHBW_Logo.png', 'img/DashboardNav.png'];

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
      if (data[2] === 'Sekretariat') {
        // Redirect to the main page
        navigate('/admin');
      }

      const sgs = await ShowSGAPI();
      // Annahme: sgs ist ein Array, bei dem an Index 0 die ID, an Index 1 der Name,
      // an Index 8 die früheste und an Index 9 die späteste Unterrichtszeit stehen.
      const sgOptions = sgs.map((item) => ({
        value: item[0],
        label: item[1],
        earliest: item[8],
        latest: item[9],
      }));
      console.log(sgOptions);

      const audit = await GetAuditAPI();
      console.log(audit[0]);
      setState((prevState) => ({
        ...prevState,
        sgs: sgOptions,
        audit: audit,
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

  // Wenn ein Studiengang ausgewählt wird, aktualisieren wir den State
  const handleSGChange = (selectedOption) => {
    setState((prevState) => ({
      ...prevState,
      selectedSG: selectedOption,
    }));
    console.log(state.selectedSG);
    // Setze die Standardzeiten aus dem ausgewählten Studiengang
    if (selectedOption) {
      setSelectedEarliest(selectedOption.earliest);
      setSelectedLatest(selectedOption.latest);
    } else {
      setSelectedEarliest(null);
      setSelectedLatest(null);
    }
  };

  const handleChangeHours = async () => {
    await UpdateSGHours(
      state.selectedSG.value,
      state.earliest.value,
      state.latest.value
    );
  };

  // Handler für die früheste Unterrichtszeit
  const handleEarliestChange = (option) => {
    setState((prevState) => ({
      ...prevState,
      earliest: option,
    }));
    setSelectedEarliest(option.label);
  };

  // Handler für die späteste Unterrichtszeit
  const handleLatestChange = (option) => {
    setState((prevState) => ({
      ...prevState,
      latest: option,
    }));
    setSelectedLatest(option.label);
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

  // Finde die aktuell ausgewählten Optionen für die Zeit-Selects
  const selectedEarliestOption =
    timeOptions.find((option) => option.label === selectedEarliest) || null;
  const selectedLatestOption =
    timeOptions.find((option) => option.label === selectedLatest) || null;

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
        <div className="row g-4">{/* Weitere Inhalte */}</div>
      </div>

      <center>
        <h1 className="text-primary">
          <strong>Audittrail</strong>
        </h1>
      </center>

      <center>
        <div
          style={{
            backgroundColor: '#1e1e1e',
            color: '#c5c8c6',
            border: '1px solid #444',
            padding: '10px',
            width: '90%',
            height: '30vh',
            overflowY: 'scroll',
            borderRadius: '4px',
          }}
        >
          <div
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              textAlign: 'left',
            }}
          >
            {state.audit}
          </div>
        </div>
      </center>
      <br />
      <br />
      <br />
      <center>
        <h1 className="text-primary">
          <strong>Regeln</strong>
        </h1>
      </center>

      {/* Studiengang auswählen */}
      <p className="text-start">
        <strong>Studiengang auswählen</strong>
      </p>
      <Select
        options={state.sgs}
        onChange={handleSGChange}
        placeholder="Studiengang auswählen"
        value={state.selectedSG}
      />
      <br />

      <div>
        <div className="container-fluid pt-4 px-4">
          <div className="bg-light text-center rounded p-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="mb-0">Regeln bearbeiten</h6>
            </div>
            <p className="text-start">
              <strong>Frühste Unterrichtzeit</strong>
            </p>
            <Select
              options={timeOptions}
              value={selectedEarliestOption}
              onChange={handleEarliestChange}
              placeholder={
                state.selectedSG
                  ? state.selectedSG.earliest + ':00'
                  : 'Bitte Studiengang auswählen'
              }
            />
            <br />
            <p className="text-start">
              <strong>Späteste Unterrichtzeit</strong>
            </p>
            <Select
              options={timeOptions}
              value={selectedLatestOption}
              onChange={handleLatestChange}
              placeholder={
                state.selectedSG
                  ? state.selectedSG.latest + ':00'
                  : 'Bitte Studiengang auswählen'
              }
            />
            <br />

            <button
              type="button"
              id="createProjectButton"
              className="btn btn-outline-warning m-2"
              onClick={handleChangeHours}
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
