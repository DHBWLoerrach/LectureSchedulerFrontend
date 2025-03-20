import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const ShowCoursesAPI = async () => {
  const token = localStorage.getItem('token');

  try {
    // Send login request to the API
    const response = await fetch(
      process.env.REACT_APP_BACKEND_IP + '/courses/show',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    // Projectnumber exists already
    if (!response.ok) {
      return false;
    }

    console.log('123', result);
    return result;
  } catch (error) {
    return false;
  }
};
