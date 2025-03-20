export const EditEmployeeAPI = async (
  employeeID,
  employeeFirstname,
  employeeLastname,
  employeeEmail,
  employeeRole
) => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_IP + '/employees/edit',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeID,
          employeeFirstname,
          employeeLastname,
          employeeEmail,
          employeeRole,
        }),
      }
    );

    if (response.status === 404) {
      alert('Dieser Mitarbeiter wurde bereits gelöscht.');
      return { success: false };
    }

    if (response.status === 400) {
      alert(
        'Es existiert bereits ein Mitarbeiter mit der DHBW Email Adresse: ' +
          employeeEmail
      );
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
