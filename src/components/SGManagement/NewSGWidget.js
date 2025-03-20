import { useState, useEffect } from 'react';
import Select from 'react-select';
import { ShowModulesAPI } from '../APIs/Modules/ShowModulesAPI';
import { CreateSGAPI } from '../APIs/SG/CreateSGAPI';

export const NewSGWidget = ({ addDepartment }) => {
  const [state, setState] = useState({
    employeeDetails: {
      employeeFirstname: '',
      assignedEmployees: [[], [], [], [], [], []], // Ensure it remains a 6-element array
    },
    allModuleOptions: [], // Renamed to match module context
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const allModules = await ShowModulesAPI();
        const allModuleOptions = allModules.map((module) => ({
          value: module[0], // Assuming ID
          label: module[1], // Assuming Name
        }));

        setState((prevState) => ({
          ...prevState,
          allModuleOptions,
        }));
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
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

  const updateAssignedModules = (semesterIndex, selectedOptions) => {
    setState((prevState) => {
      const updatedAssignedEmployees = [
        ...prevState.employeeDetails.assignedEmployees,
      ];
      updatedAssignedEmployees[semesterIndex] = selectedOptions.map(
        (option) => option.value
      );
      return {
        ...prevState,
        employeeDetails: {
          ...prevState.employeeDetails,
          assignedEmployees: updatedAssignedEmployees,
        },
      };
    });
  };

  const handleCreateDepartment = async () => {
    const { employeeFirstname, assignedEmployees } = state.employeeDetails;

    if (!employeeFirstname) {
      alert('Bitte den Studiengangsnamen eingeben!');
      return;
    }

    try {
      const result = await CreateSGAPI(employeeFirstname, assignedEmployees);
      if (result.success) {
        addDepartment(result.employee);
        setState((prevState) => ({
          ...prevState,
          employeeDetails: {
            employeeFirstname: '',
            assignedEmployees: [[], [], [], [], [], []], // Reset properly
          },
        }));
      }
    } catch (error) {
      console.error('Error creating module:', error);
    }
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="bg-light text-center rounded p-4">
        <h6 className="mb-0">Neuen Studiengang anlegen</h6>

        <p className="text-start">
          <strong>Studiengangsname</strong>
        </p>
        <input
          type="text"
          className="form-control"
          value={state.employeeDetails.employeeFirstname}
          onChange={(e) =>
            updateEmployeeDetails('employeeFirstname', e.target.value)
          }
          placeholder="Studiengangsname"
        />
        <br />

        {[...Array(6)].map((_, index) => (
          <div key={index}>
            <p className="text-start">
              <strong>Module {index + 1}. Semester</strong>
            </p>
            <Select
              isMulti
              options={state.allModuleOptions}
              value={state.allModuleOptions.filter((option) =>
                state.employeeDetails.assignedEmployees[index]?.includes(
                  option.value
                )
              )}
              onChange={(selectedOptions) =>
                updateAssignedModules(index, selectedOptions)
              }
              placeholder="Module auswählen"
            />
            <br />
          </div>
        ))}

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
