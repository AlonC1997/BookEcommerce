import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to manage popup display
  const navigate = useNavigate();

  // Function to parse JWT token
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/register', {
        username,
        password,
        name,
        address,
      });
      if (response.status === 200) {
        // Show popup message on successful signup
        setShowPopup(true);
      }
    } catch (error) {
      setErrorMessage('Username is taken or other error occurred');
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    // Perform login after signup
    try {
      axios.post('http://localhost:8080/auth/login', {
        username,
        password,
      }).then(response => {
        const token = response.data.accessToken;
        localStorage.setItem('token', token);
        // Decode token to determine user role (admin or user)
        const decodedToken = parseJwt(token);
        const userRole = decodedToken.role;
        // Call onLogin prop passed from App.js to set login state
        onLogin(username, password);
        navigate('/home');
      }).catch(error => {
        setErrorMessage('Failed to log in after signup');
      });
    } catch (error) {
      setErrorMessage('Failed to log in after signup');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="signup-title">Join InalaBook</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p className="popup-message">User created! Let's read</p>
            <div className="popup-buttons">
              <button className="popup-button" onClick={handlePopupClose}>Go to Home Page</button>
              <button className="popup-button" onClick={() => setShowPopup(false)}>Later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
