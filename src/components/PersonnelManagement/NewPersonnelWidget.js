import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import de from 'date-fns/locale/de'; // Import German locale
import Select from 'react-select';

import { ShowEmployeesAPI } from '../APIs/Employees/ShowEmployeesAPI';
import { CreateEmployeeAPI } from '../APIs/Employees/CreateEmployeeAPI';
import '../_Datapicker.css';

registerLocale('de', de); // Register German locale globally

export const NewPersonnelWidget = ({ addDepartment }) => {
  const [state, setState] = useState({
    employeeDetails: {
      employeeFirstname: '',
      employeeLastname: '',
      employeeDepartment: '',
      employeeEmail: '',
      employeePassword: '',
      employeeRole: '',
    },
    allDepartmentOptions: [],
  });

  useEffect(() => {
    const fetchInfo = async () => {
      //const allD = await ShowDepartmentsAPI();
      const allD = [];
      const allDOptions = allD.map(([id, department]) => ({
        value: department,
        label: department,
      }));

      setState((prevState) => ({
        ...prevState,
        allDepartmentOptions: allDOptions,
      }));
    };

    fetchInfo();
  }, []);

  const updatedepartmentDetails = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      employeeDetails: {
        ...prevState.employeeDetails,
        [key]: value,
      },
    }));
  };

  const handleCreateDepartment = async () => {
    const {
      employeeFirstname,
      employeeLastname,
      employeeEmail,
      employeePassword,
      employeeRole,
    } = state.employeeDetails;

    if (
      !employeeFirstname ||
      !employeeLastname ||
      !employeeEmail ||
      !employeePassword ||
      !employeeRole
    ) {
      alert(
        'Ohne vollständige Informationen können Mitarbeiter nicht erstellt werden!'
      );
      return;
    }

    const result = await CreateEmployeeAPI(
      employeeFirstname,
      employeeLastname,
      employeeEmail,
      employeePassword,
      employeeRole
    );
    console.log(result);
    if (result.success) {
      addDepartment(result.employee); // Pass the new project to the parent component
      // empty the entry fields after project is created
      setState((prevState) => ({
        ...prevState,
        employeeDetails: {
          employeeFirstname: '',
          employeeLastname: '',
          employeeDepartment: '',
          employeeEmail: '',
          employeePassword: '',
          employeeRole: '',
        },
      }));
    }
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="bg-light text-center rounded p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">Neuen Mitarbeiter anlegen</h6>
        </div>
        <p className="text-start">
          <strong>Vorname</strong>
        </p>
        <input
          type="text"
          className="form-control"
          value={state.employeeDetails.employeeFirstname}
          onChange={(e) =>
            updatedepartmentDetails('employeeFirstname', e.target.value)
          }
          placeholder="Vorname"
        />
        <br />

        <p className="text-start">
          <strong>Nachname</strong>
        </p>
        <input
          type="text"
          className="form-control"
          value={state.employeeDetails.employeeLastname}
          onChange={(e) =>
            updatedepartmentDetails('employeeLastname', e.target.value)
          }
          placeholder="Nachname"
        />
        <br />

        <p className="text-start">
          <strong>DHBW Email</strong>
        </p>
        <input
          type="text"
          className="form-control"
          value={state.employeeDetails.employeeEmail}
          onChange={(e) =>
            updatedepartmentDetails('employeeEmail', e.target.value)
          }
          placeholder="Exyte Email"
        />
        <br />

        <p className="text-start">
          <strong>Passwort</strong>
        </p>
        <input
          type="text"
          className="form-control"
          value={state.employeeDetails.employeePassword}
          onChange={(e) =>
            updatedepartmentDetails('employeePassword', e.target.value)
          }
          placeholder="Passwort"
        />
        <br />

        <p className="text-start">
          <strong>Berechtigung</strong>
        </p>
        <select
          className="form-select"
          value={state.employeeDetails.employeeRole}
          onChange={(e) =>
            updatedepartmentDetails('employeeRole', e.target.value)
          }
          aria-label="Default select example"
        >
          <option value="">Berechtigung</option>
          <option value="Dozent">Dozent</option>
          <option value="Sekretariat">Sekretariat</option>
          <option value="Admin">Admin</option>
        </select>
        <br />

        <button
          type="button"
          id="createProjectButton"
          className="btn btn-outline-success m-2"
          onClick={handleCreateDepartment}
        >
          Erstellen
        </button>
      </div>
    </div>
  );
};
