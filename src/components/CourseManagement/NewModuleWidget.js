import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ShowEmployeesAPI } from '../APIs/Employees/ShowEmployeesAPI';
import { ShowSGAPI } from '../APIs/SG/ShowSGAPI';
import { CreateModuleAPI } from '../APIs/Modules/CreateModuleAPI';
import { CreateCourseAPI } from '../APIs/Courses/CreateCourseAPI';

export const NewModuleWidget = ({ addDepartment }) => {
  const [state, setState] = useState({
    moduleDetails: {
      Kursname: '',
      Studiengang: '',
      Semester: '',
      assignedEmployees: [],
    },
    allEmployeeOptions: [],
    allSGOptions: [],
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const allE = await ShowEmployeesAPI();
        const allSG = await ShowSGAPI();

        const allEOptions = allE
          .filter((person) => person[3] === 'Sekretariat') // Nur Dozenten filtern
          .map((person) => ({
            value: person[0], // ID
            label: `${person[1]} ${person[2]}`, // Vorname + Nachname
          }));

        const allSGOptions = allSG.map((person) => ({
          value: person[0], // ID
          label: `${person[1]}`,
        }));

        setState((prevState) => ({
          ...prevState,
          allEmployeeOptions: allEOptions,
          allSGOptions: allSGOptions,
        }));
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
      }
    };

    fetchInfo();
  }, []);

  const updateModuleDetails = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      moduleDetails: {
        ...prevState.moduleDetails,
        [key]: value,
      },
    }));
  };

  const handleCreateModule = async () => {
    const { Kursname, Studiengang, Semester, ZugewieseneSekretariat } =
      state.moduleDetails;

    if (!Kursname || !Studiengang || !Semester) {
      alert('Bitte alle erforderlichen Felder ausfüllen!');
      return;
    }

    try {
      const result = await CreateCourseAPI(
        Kursname,
        Studiengang,
        Semester,
        ZugewieseneSekretariat
      );

      if (result.success) {
        addDepartment(result.employee);
        setState((prevState) => ({
          ...prevState,
          moduleDetails: {
            Kursname: '',
            Studiengang: '',
            Semester: '',
            assignedEmployees: [],
          },
        }));
        alert('Modul erfolgreich erstellt!');
      } else {
        alert('Fehler beim Erstellen des Moduls.');
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Moduls:', error);
      alert('Es gab ein Problem beim Erstellen des Moduls.');
    }
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="bg-light text-center rounded p-4">
        <h6 className="mb-0">Neues Modul anlegen</h6>

        <p className="text-start">
          <strong>Kursname</strong>
        </p>
        <input
          type="text"
          className="form-control"
          value={state.moduleDetails.Kursname}
          onChange={(e) => updateModuleDetails('Kursname', e.target.value)}
          placeholder="Kursname"
        />
        <br />

        <p className="text-start">
          <strong>Studiengang</strong>
        </p>
        <Select
          isMulti={false}
          options={state.allSGOptions}
          value={
            state.allSGOptions.find(
              (option) => option.value === state.moduleDetails.Studiengang
            ) || null
          }
          onChange={(selectedOption) =>
            updateModuleDetails(
              'Studiengang',
              selectedOption ? selectedOption.value : ''
            )
          }
          placeholder="Studiengang auswählen"
        />
        <br />

        <p className="text-start">
          <strong>Semester</strong>
        </p>
        <input
          type="number"
          className="form-control"
          value={state.moduleDetails.Semester}
          onChange={(e) => {
            const value = Math.max(1, Math.min(6, Number(e.target.value))); // Restrict value between 1 and 6
            updateModuleDetails('Semester', value);
          }}
          placeholder="Semester"
          min="1"
          max="6"
        />
        <br />

        <p className="text-start">
          <strong>Zugewiesene Sekretariat</strong>
        </p>
        <Select
          isMulti
          options={state.allEmployeeOptions}
          value={state.allEmployeeOptions.filter((option) =>
            state.moduleDetails.assignedEmployees.includes(option.value)
          )}
          onChange={(selectedOptions) =>
            updateModuleDetails(
              'assignedEmployees',
              selectedOptions.map((option) => option.value)
            )
          }
          placeholder="Sekretariat auswählen"
        />
        <br />

        <button
          type="button"
          className="btn btn-outline-success m-2"
          onClick={handleCreateModule}
        >
          Erstellen
        </button>
      </div>
    </div>
  );
};
