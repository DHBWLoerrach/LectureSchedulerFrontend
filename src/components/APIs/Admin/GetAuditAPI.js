export const GetAuditAPI = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_IP + '/audit/get',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return false;
    }

    // Use auditTrail property if available, otherwise use the result itself.
    const auditObj = result.auditTrail || result;

    // Convert the audit object into an array of strings.
    // For each entry, if the value is an object, extract its first property value.
    const auditArray = Object.entries(auditObj)
      .map(([timestamp, value]) => {
        if (value && typeof value === 'object') {
          // Assuming the inner object contains one key-value pair,
          // extract the first value (the string you need).
          const innerString = Object.values(value)[0];
          return `${timestamp} | ${innerString}`;
        }
        return `${timestamp} | ${value}`;
      })
      .slice(0, 50); // Limit to maximum 50 elements

    // Return a single string with each element on a new line.
    return auditArray.join('\n');
  } catch (error) {
    return false;
  }
};
