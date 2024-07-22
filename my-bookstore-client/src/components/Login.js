import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRole = await onLogin(username, password);
      // Clear form fields on successful login if needed
      setUsername('');
      setPassword('');
      setErrorMessage(''); // Clear any previous error message on successful login

      // Redirect based on user role
      if (userRole === 'ADMIN') {
        navigate('/order-management');
      } else {
        navigate('/home');
      }
    } catch (error) {
      setErrorMessage('Invalid username or password'); // Set error message on failed login
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">WELCOME BACK!</h2>
        <h3 className="login-subtitle">Login:</h3>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="signup-link">
          <button onClick={() => navigate('/signup')} className="signup-button">
            New? Join us now!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
