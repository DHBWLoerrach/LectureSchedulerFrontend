export const DeleteEmployeesAPI = async ( selectedIds ) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_IP+'/employees/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (response.ok) {
        return [true, response.text()];
        
        // Update the projects state to reflect the deleted items

      } 
    } catch (error) {
      
      alert('Bei der Löschung von Mitarbeitern ist ein Fehler aufgetreten.');
    }
  };
