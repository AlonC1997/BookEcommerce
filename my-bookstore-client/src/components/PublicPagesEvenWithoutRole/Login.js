import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './Login.module.css'

const Login = ({ onLogin }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const [showResetPassword, setShowResetPassword] = useState(false)
	const [resetUsername, setResetUsername] = useState('')
	const [resetMessage, setResetMessage] = useState('')
	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const userRole = await onLogin(username, password)
			setUsername('')
			setPassword('')
			setErrorMessage('')

			if (userRole === 'MAIN_ADMIN') {
				navigate('/users-and-admins-management')
			} else if (userRole === 'ADMIN') {
				navigate('/order-management')
			} else {
				navigate('/home')
			}
		} catch (error) {
			setErrorMessage('Invalid username or password')
		}
	}

	const handleResetPassword = async (e) => {
		e.preventDefault()
		try {
			const response = await axios.post('http://localhost:8080/auth/reset-password', null, {
				params: { username: resetUsername },
			})
			setResetMessage(response.data)
			setResetUsername('')
			setTimeout(() => {
				setShowResetPassword(false)
				navigate('/login')
			}, 3000) // Redirect after 3 seconds
		} catch (error) {
			setResetMessage('Email not found. Please check the email address and try again.')
		}
	}

	return (
		<div className={styles.loginContainer}>
			<div className={styles.loginForm}>
				<h2 className={styles.loginTitle}>WELCOME BACK!</h2>
				<h3 className={styles.loginSubtitle}>Login:</h3>
				{errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label htmlFor="username" className={styles.label}>
							Username (Email):
						</label>
						<input type="text" id="username" className={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} required />
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="password" className={styles.label}>
							Password:
						</label>
						<input type="password" id="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
					</div>
					<button type="submit" className={styles.loginButton}>
						Login
					</button>
					<button type="button" onClick={() => setShowResetPassword(true)} className={styles.forgotPasswordButton}>
						Forgot Password?
					</button>
				</form>
				{showResetPassword && (
					<div className={styles.resetPasswordForm}>
						<h3 className={styles.resetPasswordTitle}>Reset Password</h3>
						<p className={styles.resetPasswordInstructions}>Enter your email address and we will send you a link to reset your password.</p>
						{resetMessage && <div className={styles.resetPasswordMessage}>{resetMessage}</div>}
						<form onSubmit={handleResetPassword}>
							<div className={styles.formGroup}>
								<label htmlFor="reset-username" className={styles.label}>
									Email:
								</label>
								<input type="text" id="reset-username" className={styles.input} value={resetUsername} onChange={(e) => setResetUsername(e.target.value)} required />
							</div>
							<button type="submit" className={styles.resetPasswordButton}>
								Reset My Password
							</button>
						</form>
					</div>
				)}
				<div className={styles.signupLink}>
					<button onClick={() => navigate('/signup')} className={styles.signupButton}>
						New? Join us now!
					</button>
				</div>
			</div>
		</div>
	)
}

export default Login

/*
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRole = await onLogin(username, password);
      setUsername('');
      setPassword('');
      setErrorMessage('');

      if (userRole === 'MAIN_ADMIN') {
        navigate('/users-and-admins-management');
      } else if (userRole === 'ADMIN') {
        navigate('/order-management');
      } else {
        navigate('/home');
      }
    } catch (error) {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2 className={styles.loginTitle}>WELCOME BACK!</h2>
        <h3 className={styles.loginSubtitle}>Login:</h3>
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>Username:</label>
            <input
              type="text"
              id="username"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>Login</button>
        </form>
        <div className={styles.signupLink}>
          <button onClick={() => navigate('/signup')} className={styles.signupButton}>
            New? Join us now!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
*/
