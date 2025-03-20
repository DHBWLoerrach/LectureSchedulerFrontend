export const UpdateCalendarAPI = async (
  courseId,
  Kalender,
  user,
  crs,
  module,
  userLevel,
  userID
) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_IP + '/courses/calendar/update',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId,
          Kalender,
          user,
          crs,
          module,
          userLevel,
          userID,
        }),
      }
    );
    const result = await response.json();
    if (!response.ok) {
      return false;
    }
    console.log('Calendar updated:', result);
    return result;
  } catch (error) {
    console.error('Error in UpdateCalendarAPI:', error);
    return false;
  }
};
