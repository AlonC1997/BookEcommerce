import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';

const SignUp = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

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
        setShowPopup(true);
      }
    } catch (error) {
      setErrorMessage('Username is taken or other error occurred');
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    try {
      axios.post('http://localhost:8080/auth/login', {
        username,
        password,
      }).then(response => {
        const token = response.data.accessToken;
        localStorage.setItem('token', token);
        const decodedToken = parseJwt(token);
        const userRole = decodedToken.role;
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
    <div className={styles.signupContainer}>
      <div className={styles.signupForm}>
        <h2 className={styles.signupTitle}>Join InalaBook</h2>
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Address:</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <p className={styles.popupMessage}>User created! Let's read</p>
            <div className={styles.popupButtons}>
              <button className={styles.popupButton} onClick={handlePopupClose}>Go to Home Page</button>
              <button className={styles.popupButton} onClick={() => setShowPopup(false)}>Later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
