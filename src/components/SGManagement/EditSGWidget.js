import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ShowModulesAPI } from '../APIs/Modules/ShowModulesAPI';
import { EditSGAPI } from '../APIs/SG/EditSGAPI';
import '../_Datapicker.css';

export const EditSGWidget = (props) => {
  const { employee, editDepartment } = props;

  const [state, setState] = useState({
    employeeDetails: {
      employeeFirstname: "",
      assignedEmployees: [[], [], [], [], [], []], // Ensure structure is always correct
    },
    allModuleOptions: [],
  });

  // Populate state when the component receives an employee prop
  useEffect(() => {
    if (employee) {
      setState((prevState) => ({
        ...prevState,
        employeeDetails: {
          employeeFirstname: employee[1] || "",
          assignedEmployees: [
            employee[2] || [],
            employee[3] || [],
            employee[4] || [],
            employee[5] || [],
            employee[6] || [],
            employee[7] || [],
          ],
        }
      }));
    }
  }, [employee]);

  // Fetch all module options from API
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const allModules = await ShowModulesAPI();
        const allModuleOptions = allModules.map(module => ({
          value: module[0], // ID
          label: module[1], // Name
        }));

        setState(prevState => ({
          ...prevState,
          allModuleOptions,
        }));
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchModules();
  }, []);

  // Update state when user interacts with the form
  const updateEmployeeDetails = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      employeeDetails: {
        ...prevState.employeeDetails,
        [key]: value,
      },
    }));
  };

  // Handle the edit request
  const handleEditDepartment = async () => {
    const { employeeFirstname, assignedEmployees } = state.employeeDetails;

    if (!employeeFirstname) {
      alert('Ohne vollständige Informationen können Module nicht angepasst werden!');
      return;
    }

    const result = await EditSGAPI(employee[0], employeeFirstname, assignedEmployees);
    
    if (result.success) {
      editDepartment(result.employee);

      // Reset fields after successful edit
      setState((prevState) => ({
        ...prevState,
        employeeDetails: {
          employeeFirstname: "",
          assignedEmployees: [[], [], [], [], [], []],
        },
      }));
    }
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="bg-light text-center rounded p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">Bearbeiten: {employee ? employee[1] : "Unbekannt"}</h6>
          <i style={{ color: '#009CFF' }} className="bi-gear-fill fa-2x"></i>
        </div>

        {/* Modulname Input */}
        <p className="text-start"><strong>Studiengangsname</strong></p>
        <input
          type="text"
          className="form-control"
          value={state.employeeDetails.employeeFirstname}
          onChange={(e) => updateEmployeeDetails('employeeFirstname', e.target.value)}
          placeholder="Modulname"
        />
        <br />

        {/* Assigned Modules for Each Semester */}
        {[...Array(6)].map((_, semesterIndex) => (
          <div key={semesterIndex}>
            <p className="text-start"><strong>Module / Vorlesungen {semesterIndex + 1}. Semester</strong></p>
            <Select
              isMulti
              options={state.allModuleOptions}
              value={state.allModuleOptions.filter(option => 
                state.employeeDetails.assignedEmployees[semesterIndex]?.includes(option.value)
              )}
              onChange={(selectedOptions) => {
                const updatedAssignedEmployees = [...state.employeeDetails.assignedEmployees];
                updatedAssignedEmployees[semesterIndex] = selectedOptions.map(option => option.value);
                updateEmployeeDetails('assignedEmployees', updatedAssignedEmployees);
              }}
              placeholder="Module auswählen"
            />
            <br />
          </div>
        ))}

        {/* Edit Button */}
        <button type="button" className="btn btn-outline-warning m-2" onClick={handleEditDepartment}>
          Bearbeiten
        </button>
      </div>
    </div>
  );
};
