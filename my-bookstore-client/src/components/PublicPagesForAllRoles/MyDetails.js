import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './MyDetails.module.css'
import PasswordChecklist from 'react-password-checklist'

const MyDetails = () => {
	const [user, setUser] = useState(null)
	const [editing, setEditing] = useState({ name: false, address: false, password: false })
	const [name, setName] = useState('')
	const [address, setAddress] = useState('')
	const [password, setPassword] = useState('')
	const [passwordAgain, setPasswordAgain] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const [isPasswordValid, setIsPasswordValid] = useState(false)

	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				const token = localStorage.getItem('token')
				const response = await axios.get('http://localhost:8080/users/getLoggedInUser', {
					headers: { Authorization: `Bearer ${token}` },
				})
				setUser(response.data)
				setName(response.data.name)
				setAddress(response.data.address)
			} catch (error) {
				console.error('Error fetching user details:', error)
			}
		}

		fetchUserDetails()
	}, [])

	const handleUpdateName = async () => {
		try {
			const token = localStorage.getItem('token')
			await axios.post(
				'http://localhost:8080/users/setName',
				{ name },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			setEditing((prev) => ({ ...prev, name: false }))
		} catch (error) {
			console.error('Error updating name:', error.response ? error.response.data : error.message)
		}
	}

	const handleUpdateAddress = async () => {
		try {
			const token = localStorage.getItem('token')
			await axios.post(
				'http://localhost:8080/users/setAddress',
				{ address },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			setEditing((prev) => ({ ...prev, address: false }))
		} catch (error) {
			console.error('Error updating address:', error.response ? error.response.data : error.message)
		}
	}

	const handleChangePassword = async () => {
		if (!isPasswordValid) return
		try {
			const token = localStorage.getItem('token')
			await axios.post(
				'http://localhost:8080/auth/setNewPassword',
				{ password },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			setEditing((prev) => ({ ...prev, password: false }))
		} catch (error) {
			console.error('Error changing password:', error.response ? error.response.data : error.message)
		}
	}

	const validatePassword = () => {
		const hasMinLength = password.length >= 8
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
		const hasNumber = /[0-9]/.test(password)
		const hasUppercase = /[A-Z]/.test(password)
		const passwordsMatch = password === passwordAgain

		const errorMessages = []
		if (!hasMinLength && password !== '') errorMessages.push('Password must be at least 8 characters long.')
		if (!hasSpecialChar) errorMessages.push('Password must contain special characters.')
		if (!hasNumber) errorMessages.push('Password must contain a number.')
		if (!hasUppercase) errorMessages.push('Password must contain an uppercase letter.')
		if (!passwordsMatch) errorMessages.push('Passwords do not match.')

		setPasswordError(errorMessages.join(' '))
		setIsPasswordValid(errorMessages.length === 0)
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target
		switch (name) {
			case 'name':
				setName(value)
				break
			case 'address':
				setAddress(value)
				break
			case 'password':
				setPassword(value)
				validatePassword()
				break
			case 'passwordAgain':
				setPasswordAgain(value)
				validatePassword()
				break
			default:
				break
		}
	}

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>My Details</h1>
			{user && (
				<>
					<div className={styles.field}>
						<label className={styles.label}>Username:</label>
						<span>{user.username}</span>
					</div>
					{user.role && (user.role === 'MAIN_ADMIN' || user.role === 'ADMIN') && (
						<div className={styles.field}>
							<label className={styles.label}>Role:</label>
							<span>{user.role}</span>
						</div>
					)}
					<div className={styles.field}>
						<label className={styles.label}>Name:</label>
						{editing.name ? (
							<div className={styles.editContainer}>
								<input type="text" name="name" value={name} onChange={handleInputChange} className={styles.input} />
								<div className={styles.buttonGroup}>
									<button onClick={handleUpdateName} className={styles.updateButton}>
										Update
									</button>
									<button onClick={() => setEditing((prev) => ({ ...prev, name: false }))} className={styles.closeButton}>
										Close
									</button>
								</div>
							</div>
						) : (
							<div className={styles.fieldContent}>
								<span>{name}</span>
								<button onClick={() => setEditing((prev) => ({ ...prev, name: true }))} className={styles.editButton}>
									Edit
								</button>
							</div>
						)}
					</div>
					<div className={styles.field}>
						<label className={styles.label}>Address:</label>
						{editing.address ? (
							<div className={styles.editContainer}>
								<input type="text" name="address" value={address} onChange={handleInputChange} className={styles.input} />
								<div className={styles.buttonGroup}>
									<button onClick={handleUpdateAddress} className={styles.updateButton}>
										Update
									</button>
									<button onClick={() => setEditing((prev) => ({ ...prev, address: false }))} className={styles.closeButton}>
										Close
									</button>
								</div>
							</div>
						) : (
							<div className={styles.fieldContent}>
								<span>{address}</span>
								<button onClick={() => setEditing((prev) => ({ ...prev, address: true }))} className={styles.editButton}>
									Edit
								</button>
							</div>
						)}
					</div>
					<div className={styles.field}>
						<label className={styles.label}>Change Password:</label>
						{editing.password ? (
							<div className={styles.passwordContainer}>
								<input type="password" name="password" value={password} onChange={handleInputChange} placeholder="New Password" className={styles.input} />
								<input type="password" name="passwordAgain" value={passwordAgain} onChange={handleInputChange} placeholder="Confirm Password" className={styles.input} />
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
										setIsPasswordValid(isValid)
									}}
								/>
								{passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
								<div className={styles.buttonGroup}>
									<button onClick={handleChangePassword} className={styles.updateButton} disabled={!isPasswordValid}>
										Change Password
									</button>
									<button onClick={() => setEditing((prev) => ({ ...prev, password: false }))} className={styles.closeButton}>
										Close
									</button>
								</div>
							</div>
						) : (
							<button onClick={() => setEditing((prev) => ({ ...prev, password: true }))} className={styles.editButton}>
								Change Password
							</button>
						)}
					</div>
				</>
			)}
		</div>
	)
}

export default MyDetails
