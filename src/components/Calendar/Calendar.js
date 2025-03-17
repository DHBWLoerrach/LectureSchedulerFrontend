import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import de from 'date-fns/locale/de'; // Import German locale
import Select from 'react-select';

// API-Funktionen
import { ShowCoursesAPI } from '../APIs/Courses/ShowCoursesAPI';
import { ShowSGAPI } from '../APIs/SG/ShowSGAPI';
import { ShowModulesAPI } from '../APIs/Modules/ShowModulesAPI';

import { ShowCalendarAPI } from '../APIs/Calendar/ShowCalendarAPI';
import { UpdateCalendarAPI } from '../APIs/Calendar/UpdateCalendarAPI';

import { fetchProtectedData } from '../../js/fetchProtectedData';

import '../_Datapicker.css';

registerLocale('de', de);

// Hilfsfunktionen zur Wochenberechnung
function getWeekDates(weekNumber, year) {
  let firstDayOfYear = new Date(year, 0, 1);
  let daysToThursday = (4 - firstDayOfYear.getDay() + 7) % 7;
  let firstThursday = new Date(year, 0, 1 + daysToThursday);
  let weekStart = new Date(firstThursday);
  weekStart.setDate(firstThursday.getDate() + (weekNumber - 1) * 7 - 3);
  
  let weekDates = [];
  for (let i = 0; i < 5; i++) {
    let day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    weekDates.push(day.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" }));
  }
  return weekDates;
}

function getCurrentISOWeekAndYear() {
  const today = new Date();
  const dayIndex = today.getDay() === 0 ? 7 : today.getDay();
  const thursday = new Date(today);
  thursday.setDate(today.getDate() - dayIndex + 4);
  const firstThursday = new Date(thursday.getFullYear(), 0, 4);
  const firstDayIndex = firstThursday.getDay() === 0 ? 7 : firstThursday.getDay();
  firstThursday.setDate(firstThursday.getDate() - firstDayIndex + 4);
  const weekNumber = Math.round((thursday - firstThursday) / (7 * 24 * 60 * 60 * 1000)) + 1;
  return { week: weekNumber, year: thursday.getFullYear() };
}

function getISOWeekNumber(date) {
  const tmpDate = new Date(date.getTime());
  const dayNumber = date.getDay() === 0 ? 7 : date.getDay();
  tmpDate.setDate(date.getDate() + 4 - dayNumber);
  const yearStart = new Date(tmpDate.getFullYear(), 0, 1);
  return Math.ceil((((tmpDate - yearStart) / 86400000) + 1) / 7);
}

function getWeeksInYear(year) {
  const dec31 = new Date(year, 11, 31);
  let week = getISOWeekNumber(dec31);
  if (week === 1) {
    week = getISOWeekNumber(new Date(year, 11, 24));
  }
  return week;
}

const TempKalender = () => {
  const [userLevel, setUserLevel] = useState(0);

  const initial = getCurrentISOWeekAndYear();
  const [state, setState] = useState({
    selectedDate: null,
    loading: true,
    imagesLoaded: false,
    kurse: [],
    sgs: [],
    modules: [],
    currentWeek: initial.week,
    currentYear: initial.year,
    selectedWeek: getWeekDates(initial.week, initial.year),
    selectedCourse: null,
    selectedModule: null,
    moduleOptions: [],
    // Kalender: Speichert nur Modul-IDs pro Zeitfenster
    schedule: {},
    earliest: 8,
    latest: 18,
    user: "",
    userID: "",
    userModules: [],
  });

  // Bilder laden
  const images = ["img/DHBW_Logo.png", "img/DashboardNav.png"];
  useEffect(() => {
    const loadImages = async () => {
      const promises = images.map(src =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        })
      );
      await Promise.all(promises);
      setState(prev => ({ ...prev, imagesLoaded: true }));
    };
    loadImages();
  }, []);

  // Kurse, SG und Module laden
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allE = await ShowCoursesAPI();
        const kurse = allE.map(item => ({
          value: item[0],
          label: item[1],
          sg: item[2],
          semester: item[3]
        }));

        const sgs = await ShowSGAPI();
        const modules = await ShowModulesAPI();
        const user = await fetchProtectedData();
        console.log(user)

        // asign user priviledge
        switch(user[2]){
        
          case "Dozent":
          setUserLevel(1);
          break;
          
          case "Sekretariat":
          setUserLevel(2);
          break;
          
          case "Admin":
          setUserLevel(3);
          break;
          
          default:
          setUserLevel(0);
          break;
        }
        
        console.log("fkidsjkpfs",state.userID)
        const matchedModuleIds = await modules
        .filter(subArray => Array.isArray(subArray[3]) && subArray[3].includes(user[5]))
        .map(subArray => subArray[0]);

        console.log("teststst",matchedModuleIds);

        setState(prev => ({
          ...prev,
          kurse,
          sgs,
          modules,
          user: user[3] + " " + user[4],
          userID: user[5],
          userModules: matchedModuleIds,
          loading: false
        }));
      } catch (error) {
        console.error("Fehler beim Laden:", error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, []);

  // Wenn ein Kurs ausgewählt wurde, Kalender laden
  useEffect(() => {
    const fetchCalendar = async () => {
      if (state.selectedCourse) {
        const calendarData = await ShowCalendarAPI(state.selectedCourse.value);
        setState(prev => ({
          ...prev,
          schedule: calendarData?.schedule || {}
        }));
      }
    };
    fetchCalendar();
  }, [state.selectedCourse]);

  // Wochen-Navigation
  const handlePreviousWeek = () => {
    setState(prev => {
      let newWeek = prev.currentWeek - 1;
      let newYear = prev.currentYear;
      if (newWeek < 1) {
        newYear = prev.currentYear - 1;
        newWeek = getWeeksInYear(newYear);
      }
      return {
        ...prev,
        currentWeek: newWeek,
        currentYear: newYear,
        selectedWeek: getWeekDates(newWeek, newYear)
      };
    });
  };

  const handleNextWeek = () => {
    setState(prev => {
      let newWeek = prev.currentWeek + 1;
      let newYear = prev.currentYear;
      const weeksInYear = getWeeksInYear(prev.currentYear);
      if (newWeek > weeksInYear) {
        newYear = prev.currentYear + 1;
        newWeek = 1;
      }
      return {
        ...prev,
        currentWeek: newWeek,
        currentYear: newYear,
        selectedWeek: getWeekDates(newWeek, newYear)
      };
    });
  };

  // Kursauswahl: Module filtern und ggf. Kalender neu laden
  const handleCourseChange = (selectedOption) => {
    if (!selectedOption) {
      setState(prev => ({
        ...prev,
        selectedCourse: null,
        selectedModule: null,
        moduleOptions: [],
        schedule: {}
      }));
      return;
    }
    setState(prev => ({
      ...prev,
      selectedCourse: selectedOption,
      selectedModule: null
    }));

    const { sg, semester } = selectedOption;
    if (!sg || !semester) {
      setState(prev => ({ ...prev, moduleOptions: [] }));
      return;
    }
    const foundSG = state.sgs.find(sgArray => sgArray[0] === sg);
    if (!foundSG) {
      setState(prev => ({ ...prev, moduleOptions: [] }));
      return;
    }




    const sgIndex = parseInt(semester, 10) + 1;
    const sgModuleIds = foundSG[sgIndex];
    if (Array.isArray(sgModuleIds)) {
      const moduleOptions = state.modules
        .filter(mod => sgModuleIds.includes(mod[0]))
        .map(mod => ({
          value: mod[0],  // Modul-ID
          label: mod[1]   // Modulname
        }));


        console.log(foundSG)
      setState(prev => ({ ...prev, moduleOptions, earliest: parseInt(foundSG[8]), latest: parseInt(foundSG[9]) }));
    } else {
      setState(prev => ({ ...prev, moduleOptions: [], earliest: parseInt(foundSG[8]), latest: parseInt(foundSG[9]) }));
    }
  };

  // Modul-Auswahl
  const handleModuleChange = (selectedOption) => {
    console.log(selectedOption)
    if(userLevel === 1 &! state.userModules.includes(selectedOption.value)){
      alert("Modul wurde Ihnen nicht zugewiesen.");
      return;
    }
    setState(prev => ({
      ...prev,
      selectedModule: selectedOption
    }));
  };

  // Helper: Gibt anhand der Modul-ID den Namen zurück
  const getModuleLabel = (moduleId) => {
    const found = state.moduleOptions.find(m => m.value === moduleId);
    return found ? found.label : moduleId;
  };

  // Zeitfenster belegen – speichere nur die Modul-ID
  const assignModuleToTimeSlot = (timeSlot) => {
    if (state.selectedModule) {
      setState(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [timeSlot]: state.selectedModule.value
        }
      }));
    }
  };

  // Kalender speichern (Backend-Aufruf mit Kurs-ID)
  const handleSaveCalendar = async () => {
    if (!state.selectedCourse) {
      alert("Bitte zuerst einen Kurs auswählen.");
      return;
    }
    try {
      const dataToSave = state.schedule;
      console.log("123333", state.userModules)


      

      //request a calendar update, last two parameters are userlevel to determine whether its an admin in the backend, and the userid to check if its an assigned secretary
      const result = await UpdateCalendarAPI(state.selectedCourse.value, dataToSave, state.user, state.selectedCourse, state.selectedModule, userLevel, state.userID);
      console.log(state.user)
      if(result && result.success) {
        alert("Kalender erfolgreich gespeichert!");
      } else {
        alert("Fehler beim Speichern!");
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern!");
    }
  };

  // Generiere 15-Minuten-Zeitintervalle von 08:00 bis 18:00
  const generateSchedule = (startHour, endHour, intervalMinutes) => {
    const times = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        times.push(time);
      }
    }
    return times;
  };

  const days = [
    "Montag " + state.selectedWeek[0],
    "Dienstag " + state.selectedWeek[1],
    "Mittwoch " + state.selectedWeek[2],
    "Donnerstag " + state.selectedWeek[3],
    "Freitag " + state.selectedWeek[4]
  ];
  const scheduleTimes = generateSchedule(state.earliest, state.latest, 15);

  if (state.loading) {
    return (
      <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <img src="img/DHBW_Logo.png" alt="DHBW Logo" width="100vh" height="auto" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>
        Stundenplan Woche: {state.selectedWeek[0]} - {state.selectedWeek[4]}
      </h1>

      {/* Kurs auswählen */}
      <p className="text-start"><strong>Kurs auswählen</strong></p>
      <Select
        options={state.kurse}
        onChange={handleCourseChange}
        placeholder="Kurs auswählen"
        value={state.selectedCourse}
      />
      <br />

      {/* Modul auswählen */}
      <p className="text-start"><strong>Modul auswählen</strong></p>
      <Select
        options={state.moduleOptions}
        onChange={handleModuleChange}
        placeholder="Modul auswählen"
        value={state.selectedModule}
        isDisabled={!state.selectedCourse}
      />
      <br /><br />


      {/* Wochen-Navigation */}
      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-sm btn-primary" onClick={handlePreviousWeek}>
          <i className="bi-arrow-left fa-1x text-white"></i>
        </button>

        <button type="button" className="btn btn-success" onClick={handleSaveCalendar}>
          Speichern
        </button>

        <button type="button" className="btn btn-sm btn-primary" onClick={handleNextWeek}>
          <i className="bi-arrow-right fa-1x text-white"></i>
        </button>
      </div>
      <br />
    
      {/* Stundenplan-Tabelle */}
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>Zeitplan</h3>
      <p className="text-center">Klicke auf ein Zeitfenster, um das ausgewählte Modul zuzuweisen.</p>
      <table style={{ width: "100%", maxWidth: "100%", margin: "0 auto", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ backgroundColor: "#ff0000", color: "white", padding: "10px", border: "1px solid #ddd" }}>
              Zeit
            </th>
            {days.map((day) => (
              <th key={day} style={{ backgroundColor: "#ff0000", color: "white", padding: "10px", border: "1px solid #ddd" }}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scheduleTimes.map((time, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white" }}>
              <td style={{ border: "1px solid #ddd", padding: "10px", fontWeight: "bold", backgroundColor: "#e8e8e8", textAlign: "center" }}>
                {time}
              </td>
              {days.map((day) => {
                const slotKey = `${time} ${day}`;
                return (
                  <td
                    key={slotKey}
                    style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center", cursor: "pointer" }}
                    onClick={() => assignModuleToTimeSlot(slotKey)}
                  >
                    {state.schedule[slotKey]
                      ? getModuleLabel(state.schedule[slotKey])
                      : '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
};

export default TempKalender;
