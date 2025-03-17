import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import de from 'date-fns/locale/de'; // Import German locale
import Select from 'react-select';

import { ShowEmployeesAPI } from '../APIs/Employees/ShowEmployeesAPI';
import { EditEmployeeAPI } from '../APIs/Employees/EditEmployeeAPI';
import '../_Datapicker.css';

registerLocale('de', de); // Register German locale globally

export const EditPersonnelWidget = (props) => {
  const { employee, editDepartment } = props;

  const [state, setState] = useState({
    employeeDetails: {
      employeeFirstname: "",
      employeeLastname: "",
      employeeDepartment: "",
      employeeRole: "",
      employeeEmail: "",
    },
    allDepartmentOptions: [],
  });

  useEffect(() => {
    if (employee) {
      setState((prevState) => ({
        ...prevState,
        employeeDetails: {
          employeeFirstname: employee[1],
          employeeLastname: employee[2],
          employeeRole: employee[3],
          employeeEmail: employee[4]
        }
      }));
    }
  }, [employee]);


  useEffect(() => {
    const fetchInfo = async () => {
      //const allD = await ShowDepartmentsAPI();
      const allD = []
      const allDOptions = allD.map(([id, department]) => ({ value: department, label: department }));

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

  const handleEditDepartment = async () => {
    const { employeeFirstname, employeeLastname, employeeEmail, employeeRole } = state.employeeDetails;

    if (!employeeFirstname || !employeeLastname || !employeeEmail || !employeeRole) {
      alert('Ohne vollständige Informationen können Mitarbeiter nicht angepasst werden!');
      return;
    }

    const result = await EditEmployeeAPI(employee[0], employeeFirstname, employeeLastname, employeeEmail, employeeRole);
    console.log(result)
    if (result.success) {

      editDepartment(result.employee); // Pass the new project to the parent component
      // empty the entry fields after project is created
      setState((prevState) => ({
        ...prevState,
        departmentDetails: {
          employeeFirstname: "",
          employeeLastname: "",
          employeeDepartment: "",
          employeeRole: "",
          employeeEmail: "",
        }
      }));
    }
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="bg-light text-center rounded p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">Bearbeiten: {employee[1] + " " + employee[2]}</h6>
          <i style={{ color: '#009CFF' }} className="bi-gear-fill fa-2x"></i>
        </div>

        <p className="text-start"><strong>Vorname</strong></p>
        <input
          type="text"
          className="form-control"
          value={state.employeeDetails.employeeFirstname}
          onChange={(e) => updatedepartmentDetails('employeeFirstname', e.target.value)}
          placeholder="Vorname"
        />
        <br />

        <p className="text-start"><strong>Nachname</strong></p>
        <input
          type="text"
          className="form-control"
          value={state.employeeDetails.employeeLastname}
          onChange={(e) => updatedepartmentDetails('employeeLastname', e.target.value)}
          placeholder="Nachname"
        />
        <br />

        <p className="text-start"><strong>DHBW Email</strong></p>
        <input
          type="text"
          className="form-control"
          value={state.employeeDetails.employeeEmail}
          onChange={(e) => updatedepartmentDetails('employeeEmail', e.target.value)}
          placeholder="Exyte Email"
        />
        <br />


        <p className="text-start"><strong>Berechtigung</strong></p>
        <select
          className="form-select"
          value={state.employeeDetails.employeeRole}
          onChange={(e) => updatedepartmentDetails('employeeRole', e.target.value)}
          aria-label="Default select example"
        >
          <option value="">Berechtigung</option>
          <option value="Dozent">Dozent</option>
          <option value="Sekretariat">Sekretariat</option>
          <option value="Admin">Admin</option>
        </select>
        <br />

        <button type="button" id="createProjectButton" className="btn btn-outline-warning m-2" onClick={handleEditDepartment}>
          Bearbeiten
        </button>
      </div>
    </div>
  );
};
