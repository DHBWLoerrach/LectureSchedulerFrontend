import { useState, useEffect } from 'react';
import Select from 'react-select';
import { ShowEmployeesAPI } from '../APIs/Employees/ShowEmployeesAPI';
import '../_Datapicker.css';
import { ShowSGAPI } from '../APIs/SG/ShowSGAPI';
import { EditCourseAPI } from '../APIs/Courses/EditCourseAPI';

export const EditModuleWidget = (props) => {
  const { employee, editDepartment } = props;

  const [state, setState] = useState({
    employeeDetails: {
      Kursname: '',
      Studiengang: '',
      Semester: '',
      assignedEmployees: [],
    },
    allEmployeeOptions: [],
    allSGOptions: [],
  });

  useEffect(() => {
    if (employee) {
      setState((prevState) => ({
        ...prevState,
        employeeDetails: {
          Kursname: employee[1] || '',
          Studiengang: employee[2] || '',
          Semester: employee[3] || '',
          assignedEmployees: employee[4] || [],
        },
      }));
    }
  }, [employee]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const allE = await ShowEmployeesAPI();
        const allSG = await ShowSGAPI();
        const allEOptions = allE
          .filter((person) => person[3] === 'Sekretariat')
          .map((person) => ({
            value: person[0],
            label: `${person[1]} ${person[2]}`,
          }));

        const allSGOptions = allSG.map((sg) => ({
          value: sg[0],
          label: sg[1],
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

  const updateEmployeeDetails = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      employeeDetails: {
        ...prevState.employeeDetails,
        [key]: value,
      },
    }));
  };

  const handleEditDepartment = async () => {
    const { Kursname, Studiengang, Semester, assignedEmployees } =
      state.employeeDetails;

    if (!Kursname || !Semester || !Studiengang) {
      alert('Bitte alle Felder ausfüllen!');
      return;
    }

    try {
      const result = await EditCourseAPI(
        employee[0],
        Kursname,
        Studiengang,
        Semester,
        assignedEmployees
      );

      if (result.success) {
        editDepartment(result.employee);
        alert('Kurs erfolgreich bearbeitet!');
      } else {
        alert('Fehler beim Bearbeiten des Kurses.');
      }
    } catch (error) {
      console.error('Fehler beim Bearbeiten des Kurses:', error);
      alert('Es gab ein Problem beim Bearbeiten des Kurses.');
    }
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="bg-light text-center rounded p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">Bearbeiten: {state.employeeDetails.Kursname}</h6>
          <i style={{ color: '#009CFF' }} className="bi-gear-fill fa-2x"></i>
        </div>

        <p className="text-start">
          <strong>Kursname</strong>
        </p>
        <input
          type="text"
          className="form-control"
          value={state.employeeDetails.Kursname}
          onChange={(e) => updateEmployeeDetails('Kursname', e.target.value)}
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
              (option) => option.value === state.employeeDetails.Studiengang
            ) || null
          }
          onChange={(selectedOption) => {
            updateEmployeeDetails(
              'Studiengang',
              selectedOption ? selectedOption.value : ''
            );
          }}
          placeholder="Studiengang auswählen"
        />
        <br />

        <p className="text-start">
          <strong>Semester</strong>
        </p>
        <input
          type="number"
          className="form-control"
          value={state.employeeDetails.Semester}
          onChange={(e) => {
            const value = Math.max(1, Math.min(6, Number(e.target.value))); // Einschränkung auf 1-6
            updateEmployeeDetails('Semester', value);
          }}
          placeholder="Semester"
          min="1"
          max="6"
        />
        <br />

        <p className="text-start">
          <strong>Zugewiesenes Sekretariat</strong>
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
          placeholder="Sekretariat auswählen"
        />
        <br />

        <button
          type="button"
          className="btn btn-outline-warning m-2"
          onClick={handleEditDepartment}
        >
          Speichern
        </button>
      </div>
    </div>
  );
};
