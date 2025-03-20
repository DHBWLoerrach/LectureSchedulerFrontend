import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ShowEmployeesAPI } from '../APIs/Employees/ShowEmployeesAPI';
import { CreateModuleAPI } from '../APIs/Modules/CreateModuleAPI';

export const NewModuleWidget = ({ addDepartment }) => {
  const [state, setState] = useState({
    employeeDetails: {
      employeeFirstname: '',
      employeeLastname: '',
      assignedEmployees: [],
    },
    allEmployeeOptions: [],
  });

  useEffect(() => {
    const fetchInfo = async () => {
      const allE = await ShowEmployeesAPI();
      const allEOptions = allE
        .filter((person) => person[3] === 'Dozent') // Nur Dozenten filtern
        .map((person) => ({
          value: person[0], // ID
          label: `${person[1]} ${person[2]}`, // Vorname + Nachname
        }));

      setState((prevState) => ({
        ...prevState,
        allEmployeeOptions: allEOptions,
      }));
    };

    fetchInfo();
  }, []);

  const updateEmployeeDetails = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      employeeDetails: {
        ...prevState.employeeDetails,
        [key]: value,
      },
    }));
  };

  const handleCreateDepartment = async () => {
    const { employeeFirstname, employeeLastname, assignedEmployees } =
      state.employeeDetails;

    if (!employeeFirstname || !employeeLastname) {
      alert('Bitte alle Felder ausfüllen!');
      return;
    }

    const result = await CreateModuleAPI(
      employeeFirstname,
      employeeLastname,
      assignedEmployees
    );

    if (result.success) {
      addDepartment(result.employee);
      setState({
        employeeDetails: {
          employeeFirstname: '',
          employeeLastname: '',
          assignedEmployees: [],
        },
        allEmployeeOptions: state.allEmployeeOptions,
      });
    }
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="bg-light text-center rounded p-4">
        <h6 className="mb-0">Neues Modul anlegen</h6>

        <p className="text-start">
          <strong>Modulname</strong>
        </p>
        <input
          type="text"
          className="form-control"
          value={state.employeeDetails.employeeFirstname}
          onChange={(e) =>
            updateEmployeeDetails('employeeFirstname', e.target.value)
          }
          placeholder="Modulname"
        />
        <br />

        <p className="text-start">
          <strong>Vorlesungsstunden</strong>
        </p>
        <input
          type="text"
          className="form-control"
          value={state.employeeDetails.employeeLastname}
          onChange={(e) =>
            updateEmployeeDetails('employeeLastname', e.target.value)
          }
          placeholder="Vorlesungsstunden"
        />
        <br />

        <p className="text-start">
          <strong>Zugewiesene Dozenten</strong>
        </p>
        <Select
          isMulti
          options={state.allEmployeeOptions}
          value={state.allEmployeeOptions.filter((option) =>
            state.employeeDetails.assignedEmployees.includes(option.value)
          )}
          onChange={(selectedOptions) => {
            updateEmployeeDetails(
              'assignedEmployees',
              selectedOptions.map((option) => option.value)
            );
          }}
          placeholder="Dozenten auswählen"
        />
        <br />

        <button
          type="button"
          className="btn btn-outline-success m-2"
          onClick={handleCreateDepartment}
        >
          Erstellen
        </button>
      </div>
    </div>
  );
};
