import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import de from 'date-fns/locale/de'; // Import German locale
import Select from 'react-select';

import { ShowModulesAPI } from '../APIs/Modules/ShowModulesAPI';
import { ShowEmployeesAPI } from '../APIs/Employees/ShowEmployeesAPI';
import { EditModuleAPI } from '../APIs/Modules/EditModuleAPI';
import '../_Datapicker.css';

registerLocale('de', de); // Register German locale globally

export const EditModuleWidget = (props) => {
  const { employee, editDepartment } = props;

  const [state, setState] = useState({
    employeeDetails: {
      employeeFirstname: "",
      employeeLastname: "",
      assignedEmployees: []
    },
    allEmployeeOptions: [],
  });

  useEffect(() => {
    console.log("shcaf",employee)
    if (employee) {
      setState((prevState) => ({
        ...prevState,
        employeeDetails: {
          employeeFirstname: employee[1],
          employeeLastname: employee[2],
          assignedEmployees: employee[3],
        }
      }));
    }
  }, [employee]);


  useEffect(() => {
      const fetchInfo = async () => {
      const allE = await ShowEmployeesAPI();
      const allEOptions = allE
        .filter(person => person[3] === "Dozent") // Nur Dozenten filtern
        .map(person => ({
          value: person[0], // ID
          label: `${person[1]} ${person[2]}` // Vorname + Nachname
        }));

      setState((prevState) => ({
        ...prevState,
        allEmployeeOptions: allEOptions,
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
    const { employeeFirstname, employeeLastname, assignedEmployees} = state.employeeDetails;

    if (!employeeFirstname || !employeeLastname) {
      alert('Ohne vollständige Informationen können Module nicht angepasst werden!');
      return;
    }

    const result = await EditModuleAPI(employee[0], employeeFirstname, employeeLastname, assignedEmployees);
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
          {console.log("gagaga",employee[1])}
          <h6 className="mb-0">Bearbeiten: {employee[1]}</h6>
          <i style={{ color: '#009CFF' }} className="bi-gear-fill fa-2x"></i>
        </div>

        <p className="text-start"><strong>Modulname</strong></p>
        <input
          type="text"
          className="form-control"
          value={state.employeeDetails.employeeFirstname}
          onChange={(e) => updatedepartmentDetails('employeeFirstname', e.target.value)}
          placeholder="Vorname"
        />
        <br />

        <p className="text-start"><strong>Vorlesungsstunden</strong></p>
        <input
          type="text"
          className="form-control"
          value={state.employeeDetails.employeeLastname}
          onChange={(e) => updatedepartmentDetails('employeeLastname', e.target.value)}
          placeholder="Nachname"
        />
        <br />


        <p className="text-start"><strong>Zugewiesene Dozenten</strong></p>
        <Select
  isMulti
  options={state.allEmployeeOptions}
  value={state.allEmployeeOptions.filter(option => 
    state.employeeDetails.assignedEmployees.includes(option.value)
  )}
  onChange={(selectedOptions) => {
    updatedepartmentDetails('assignedEmployees', selectedOptions.map(option => option.value));
  }}
  placeholder="Dozenten auswählen"
/>
        <br />

        <button type="button" id="createProjectButton" className="btn btn-outline-warning m-2" onClick={handleEditDepartment}>
          Bearbeiten
        </button>
      </div>
    </div>
  );
};
