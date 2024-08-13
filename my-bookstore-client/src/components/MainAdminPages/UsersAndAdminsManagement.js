import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PasswordChecklist from 'react-password-checklist';
import styles from './UsersAndAdminsManagement.module.css';

const UsersAndAdminsManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        name: '',
        address: '',
        username: '',
        password: '',
        passwordAgain: '',
        role: 'ADMIN',
    });
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [tableFilters, setTableFilters] = useState({
        MAIN_ADMIN: true,
        ADMIN: true,
        USER: true,
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/users/getAllUsers', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users');
            }
        };

        fetchUsers();
    }, [token]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevState) => ({ ...prevState, [name]: value }));

        if (name === 'username') {
            setEmailError(validateEmail(value) ? '' : 'Invalid email format. Please enter a valid email address, e.g., example@domain.com');
        }

        if (name === 'password' || name === 'passwordAgain') {
            setPasswordError('');
        }
    };

    const validatePassword = () => {
        const { password, passwordAgain } = newUser;

        const hasMinLength = password.length >= 8;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const passwordsMatch = password === passwordAgain;

        if (!hasMinLength) return 'Password must be at least 8 characters long.';
        if (!hasSpecialChar) return 'Password must contain special characters.';
        if (!hasNumber) return 'Password must contain a number.';
        if (!hasUppercase) return 'Password must contain an uppercase letter.';
        if (!passwordsMatch) return 'Passwords do not match.';
        return '';
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!validateEmail(newUser.username)) {
            setEmailError('Invalid email format. Please enter a valid email address, e.g., example@domain.com');
            return;
        }
        const passwordError = validatePassword();
        if (passwordError) {
            setPasswordError(passwordError);
            return;
        }
        try {
            await axios.post('http://localhost:8080/users/addAdmin', newUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewUser({
                name: '',
                address: '',
                username: '',
                password: '',
                passwordAgain: '',
                role: 'ADMIN',
            });
            setShowAddForm(false);
            const response = await axios.get('http://localhost:8080/users/getAllUsers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (err) {
            setError('Failed to add admin');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:8080/users/deleteUser?userId=${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const response = await axios.get('http://localhost:8080/users/getAllUsers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const handleFilterChange = (e) => {
        const { name, checked } = e.target;
        setTableFilters((prevState) => ({ ...prevState, [name]: checked }));
    };

    const filteredUsers = users.filter((user) => {
        const matchesRole = tableFilters[user.role];
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.userID.toString().includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesRole && matchesSearch;
    });

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Users and Admins Management</h1>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="Search by ID, Name, Username, or Role"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchBox}
                />
                <div className={styles.checkboxes}>
                    <label>
                        <input
                            type="checkbox"
                            name="MAIN_ADMIN"
                            checked={tableFilters.MAIN_ADMIN}
                            onChange={handleFilterChange}
                        />
                        MAIN_ADMIN
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="ADMIN"
                            checked={tableFilters.ADMIN}
                            onChange={handleFilterChange}
                        />
                        ADMIN
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="USER"
                            checked={tableFilters.USER}
                            onChange={handleFilterChange}
                        />
                        USER
                    </label>
                </div>
                <button
                    onClick={() => setShowAddForm((prev) => !prev)}
                    className={showAddForm ? styles.cancelButtonOut : styles.addButtonOut}
                >
                    {showAddForm ? 'Cancel' : 'Add New Admin'}
                </button>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.userID}>
                            <td>{user.userID}</td>
                            <td>{user.name}</td>
                            <td>{user.address}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                <button
                                    onClick={() => handleDeleteUser(user.userID)}
                                    disabled={user.role === 'MAIN_ADMIN'}
                                    className={styles.deleteButton}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showAddForm && (
                <div className={styles.formContainer}>
                    <h2 className={styles.subTitle}>Add New Admin</h2>
                    <form onSubmit={handleAddUser} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Username (Email):</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={newUser.username}
                                onChange={handleInputChange}
                                required
                            />
                            {emailError && <div className={styles.errorMessage}>{emailError}</div>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={newUser.password}
                                onChange={handleInputChange}
                                required
                            />
                            <label htmlFor="passwordAgain">Confirm Password:</label>
                            <input
                                type="password"
                                id="passwordAgain"
                                name="passwordAgain"
                                value={newUser.passwordAgain}
                                onChange={handleInputChange}
                                required
                            />
                            <PasswordChecklist
                                rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
                                minLength={8}
                                value={newUser.password}
                                valueAgain={newUser.passwordAgain}
                                onChange={(isValid) => {
                                    if (!isValid && (newUser.passwordAgain !== '' || newUser.password !== '')) {
                                        setPasswordError('Password does not meet all criteria');
                                    } else {
                                        setPasswordError('');
                                    }
                                }}
                            />
                            {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={newUser.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="address">Address:</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={newUser.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="role">Role:</label>
                            <select id="role" name="role" value={newUser.role} onChange={handleInputChange}>
                                <option value="ADMIN">Admin</option>
                                <option value="MAIN_ADMIN">Main Admin</option>
                            </select>
                        </div>
                        <div className={styles.buttonContainer}>
                            <button type="submit" className={styles.submitButton} disabled={passwordError || emailError}>
                                Add User
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UsersAndAdminsManagement;
