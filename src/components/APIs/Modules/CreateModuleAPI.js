export const CreateModuleAPI = async (Modulname, Vorlesungsstunden, ZugewieseneDozenten) => {

  
    const token = localStorage.getItem('token');
    console.log(ZugewieseneDozenten)
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_IP+'/modules/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Modulname, Vorlesungsstunden, ZugewieseneDozenten })
      });
  
      if (response.status === 400) {
        alert('Ein Mitarbeiter mit dieser DHBW Email Adresse existiert bereits.');
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
  