import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css'; // Ensure you have your global styles included
import { fetchProtectedData } from '../js/fetchProtectedData';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent form submission

    // Simple validation
    if (!username || !password) {
      setErrorMessage('Benutzername und Passwort sind erforderlich');
      return;
    }

    try {
      // Send login request to the API
      const response = await fetch(
        process.env.REACT_APP_BACKEND_IP + '/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        if (response.status == 401) {
          throw new Error('Falsche Email oder Passwort.');
        } else {
          throw new Error('Login failed');
        }
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Store token in localStorage

      const myInfo = await fetchProtectedData();
      console.log('2343424324', myInfo);
      if (myInfo[2] !== 'Dozent') {
        // Redirect to the main page
        navigate('/admin');
      } else {
        // Redirect to the main page
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container-fluid">
      <div
        className="row h-100 align-items-center justify-content-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
          <center>
            <img
              src="../img/DHBW_Logo.png"
              alt="Exyte Logo"
              width="250vh"
              height="auto"
            />
          </center>
          <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="text-primary">Vorlesungskalender-Planer</h3>
              <h3>Login</h3>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="floatingInput">DHBW Email</label>
            </div>
            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="floatingPassword">Passwort</label>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <Link to="/forgot-password">
                <text className="text-danger">Passwort vergessen?</text>
              </Link>
            </div>
            <button
              type="submit"
              className="btn btn-danger py-3 w-100 mb-4"
              id="loginButton"
              onClick={handleLogin}
            >
              Login
            </button>
            <p className="text-center mb-0">
              Sie haben keinen Account?{' '}
              <Link to="/signup">
                <text className="text-danger">Registrieren</text>
              </Link>
            </p>
            <center>
              <div id="error-message" className="text-danger">
                {errorMessage}
              </div>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
