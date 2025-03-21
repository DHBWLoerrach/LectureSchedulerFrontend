export const CreateCourseAPI = async (
  Kursname,
  Studiengang,
  Semester,
  ZugewieseneSekretariat
) => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_IP + '/courses/create',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Kursname,
          Studiengang,
          Semester,
          ZugewieseneSekretariat,
        }),
      }
    );

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
