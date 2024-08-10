import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PasswordChecklist from 'react-password-checklist'
import { useNavigate } from 'react-router-dom'
import styles from './SignUp.module.css'

const SignUp = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [passwordAgain, setPasswordAgain] = useState('')
	const [name, setName] = useState('')
	const [address, setAddress] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const [isEmailValid, setIsEmailValid] = useState(false)
	const [isPasswordValid, setIsPasswordValid] = useState(false)
	const [showPopup, setShowPopup] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		// Check if email and password are valid
		const emailValidity = validateEmail(username)
		const passwordValidity = validatePassword() === ''
		setIsEmailValid(emailValidity)
		setIsPasswordValid(passwordValidity)
	}, [username, password, passwordAgain])

	const validateEmail = (email) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return re.test(email)
	}

	const handleEmailChange = (e) => {
		const email = e.target.value
		setUsername(email)
		if (!validateEmail(email)) {
			setEmailError('Invalid email format. Please enter a valid email address, e.g., example@domain.com')
		} else {
			setEmailError('')
		}
	}

	const validatePassword = () => {
		const hasMinLength = password.length >= 8
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
		const hasNumber = /[0-9]/.test(password)
		const hasUppercase = /[A-Z]/.test(password)
		const passwordsMatch = password === passwordAgain

		if (!hasMinLength) {
			return 'Password must be at least 8 characters long.'
		}
		if (!hasSpecialChar) {
			return 'Password must contain special characters.'
		}
		if (!hasNumber) {
			return 'Password must contain a number.'
		}
		if (!hasUppercase) {
			return 'Password must contain an uppercase letter.'
		}
		if (!passwordsMatch) {
			return 'Passwords do not match.'
		}
		return '' // All criteria met
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!validateEmail(username)) {
			setEmailError('Invalid email format. Please enter a valid email address, e.g., example@domain.com')
			return
		}
		const passwordError = validatePassword()
		if (passwordError) {
			setPasswordError(passwordError)
			return
		}
		try {
			const response = await axios.post('http://localhost:8080/auth/register', {
				username,
				password,
				name,
				address,
			})
			if (response.status === 200) {
				setShowPopup(true)
			}
		} catch (error) {
			setErrorMessage('Username is taken or other error occurred, please check your input.')
		}
	}

	const handlePopupClose = () => {
		setShowPopup(false)
		navigate('/login')
	}

	return (
		<div className={styles.signupContainer}>
			<div className={styles.signupForm}>
				<h2 className={styles.signupTitle}>Create an Account</h2>
				{errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label htmlFor="username" className={styles.label}>
							Username (Email):
						</label>
						<input type="text" id="username" className={styles.input} value={username} onChange={handleEmailChange} required />
						{emailError && <div className={styles.errorMessage}>{emailError}</div>}
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="password" className={styles.label}>
							Password:
						</label>
						<input type="password" id="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
						<label htmlFor="passwordAgain" className={styles.label}>
							Confirm Password:
						</label>
						<input type="password" id="passwordAgain" className={styles.input} value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} required />
						<PasswordChecklist
							rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
							minLength={8}
							value={password}
							valueAgain={passwordAgain}
							onChange={(isValid) => {
								if (!isValid && (password !== '' || passwordAgain !== '')) {
									setPasswordError('Password does not meet all criteria')
								} else {
									setPasswordError('')
								}
							}}
						/>
						{passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="name" className={styles.label}>
							Name:
						</label>
						<input type="text" id="name" className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="address" className={styles.label}>
							Address:
						</label>
						<input type="text" id="address" className={styles.input} value={address} onChange={(e) => setAddress(e.target.value)} required />
					</div>
					<button type="submit" className={styles.signupButton} disabled={!isEmailValid || !isPasswordValid || !name || !address}>
						Sign Up
					</button>
				</form>
				{showPopup && (
					<div className={styles.popup}>
						<div className={styles.popupContent}>
							<p className={styles.popupMessage}>Registration successful! Please log in.</p>
							<button onClick={handlePopupClose} className={styles.popupButton}>
								Close
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default SignUp
