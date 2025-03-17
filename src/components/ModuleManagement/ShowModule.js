import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import de from 'date-fns/locale/de'; // Import German locale

import { useNavigate, useLocation  } from 'react-router-dom';

import '../_Datapicker.css';

registerLocale('de', de); // Register German locale globally

export const ShowModule = ({ projects, checkedItems, handleCheckboxChange, configureProject }) => {
    
    return (
      <>
        {projects.map((project, index) => (
          
          <tr key={project[0]}>
            {console.log("dfsdadas", project[0])}
            <td>
              <input
                className="form-check-input"
                type="checkbox"
                checked={checkedItems[index] || false}
                onChange={() => handleCheckboxChange(index)}
              />
            </td>
            <td>{project[1]}</td>
            <td>{project[2]}</td>
            <td>
              <center><button type="button" className="btn btn-sm btn-primary" onClick={() => configureProject(project[0])}><i className="bi-gear-fill fa-1x text-white"></i></button></center>
            </td>
          </tr>
        ))}
      </>
    );
  };