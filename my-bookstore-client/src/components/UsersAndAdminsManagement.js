import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UsersAndAdminsManagement.module.css';

const UsersAndAdminsManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', address: '', username: '', password: '', role: 'ADMIN' });
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableFilters, setTableFilters] = useState({ MAIN_ADMIN: true, ADMIN: true, USER: true });

  const token = localStorage.getItem('token'); // Get the token from local storage

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users/getAllUsers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/users/addAdmin', newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewUser({ name: '', address: '', username: '', password: '', role: 'ADMIN' });
      setShowAddForm(false);
      const response = await axios.get('http://localhost:8080/users/getAllUsers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError('Failed to add admin');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/users/deleteUser?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const response = await axios.get('http://localhost:8080/users/getAllUsers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setTableFilters({ ...tableFilters, [name]: checked });
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = tableFilters[user.role];
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <button onClick={() => setShowAddForm(!showAddForm)} className={styles.addButton}>
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
          {filteredUsers.map(user => (
            <tr key={user.userID}>
              <td>{user.userID}</td>
              <td>{user.name}</td>
              <td>{user.address}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => handleDeleteUser(user.userID)}
                  disabled={user.role === 'MAIN_ADMIN'} // Prevent deletion of MAIN_ADMIN
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
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                required
              />
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
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                required
              >
                <option value="ADMIN">ADMIN</option>
                <option value="MAIN_ADMIN">MAIN_ADMIN</option>
              </select>
            </div>
            <button type="submit" className={styles.submitButton}>Add Admin</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UsersAndAdminsManagement;
