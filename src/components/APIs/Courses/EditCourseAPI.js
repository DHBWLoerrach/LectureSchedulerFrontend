export const EditCourseAPI = async (id, Kursname, Studiengang, Semester, ZugewieseneSekretariat ) => {

  
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_IP+'/courses/edit', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, Kursname, Studiengang, Semester, ZugewieseneSekretariat})
      });
  
      if (response.status === 404) {
        alert('Dieser Mitarbeiter wurde bereits gelöscht.');
        return { success: false };
      }

  
      if (!response.ok) {
        return { success: false };
      }
  
      const result = await response.json();
      return { success: true, employee: result.employee };
  
    } catch (error) {
      return { success: false };
    }
  };
  