export const ShowCalendarAPI = async (courseId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_IP + '/courses/calendar',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      }
    );
    const result = await response.json();
    if (!response.ok) {
      return false;
    }
    console.log('Calendar fetched:', result);
    return result;
  } catch (error) {
    console.error('Error in ShowCalendarAPI:', error);
    return false;
  }
};
