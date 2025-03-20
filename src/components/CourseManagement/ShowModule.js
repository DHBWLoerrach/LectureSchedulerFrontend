import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import de from 'date-fns/locale/de'; // Import German locale
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ShowEmployeesAPI } from '../APIs/Employees/ShowEmployeesAPI';
import { ShowSGAPI } from '../APIs/SG/ShowSGAPI';
import { CreateModuleAPI } from '../APIs/Modules/CreateModuleAPI';
import { useNavigate, useLocation } from 'react-router-dom';

import '../_Datapicker.css';

registerLocale('de', de); // Register German locale globally

export const ShowModule = ({
  projects,
  checkedItems,
  handleCheckboxChange,
  configureProject,
}) => {
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
  return (
    <>
      {projects.map((project, index) => (
        <tr key={project[0]}>
          {console.log('dfsdadas', project[0])}
          <td>
            <input
              className="form-check-input"
              type="checkbox"
              checked={checkedItems[index] || false}
              onChange={() => handleCheckboxChange(index)}
            />
          </td>
          <td>{project[1]}</td>
          <td>
            {state.allSGOptions.find((option) => option.value === project[2])
              ?.label || ''}
          </td>
          <td>{project[3]}</td>
          <td>
            <center>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => configureProject(project[0])}
              >
                <i className="bi-gear-fill fa-1x text-white"></i>
              </button>
            </center>
          </td>
        </tr>
      ))}
    </>
  );
};
