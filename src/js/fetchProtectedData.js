// fetchProtectedData.js
export const fetchProtectedData = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_IP + '/api/protected',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        alert(
          'Ihre Benutzerdaten wurden geändert. Bitte loggen Sie sich erneut ein.'
        );
      }
      throw new Error('Unauthorized');
    }

    const data = await response.json();
    console.log(data);
    return [
      data.Benutzername,
      data.department,
      data.Berechtigung,
      data.Vorname,
      data.Nachname,
      data._id,
    ];
  } catch (error) {
    console.error('Error fetching protected data:', error);
    localStorage.removeItem('token'); // Clear token from local storage
    window.location.href = '/login'; // Redirect to login page
    throw error;
  }
};
