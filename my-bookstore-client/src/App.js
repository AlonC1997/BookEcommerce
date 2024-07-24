import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import BottomNavbar from './components/BottomNavbar'; // Import BottomNavbar component
import Login from './components/Login';
import SignUp from './components/SignUp';
import BookCatalog from './components/BooksCatalog'; // Import your BookCatalog component
import Home from './components/Home';
import OrderManagement from './components/OrdersManagement';
import StockManagement from './components/StockManagement';
import axios from 'axios';


const App = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track admin status

  // Function to handle login
  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username,
        password,
      });
      const token = response.data.accessToken;
      localStorage.setItem('token', token); // Store token in local storage

      // Decode token to determine user role (admin or user)
      const decodedToken = parseJwt(token);
      const userRole = decodedToken.role;

      // Update states based on user role
      setIsLoggedIn(true); // Set logged in status
      setIsAdmin(userRole === 'ADMIN'); // Set admin status based on user role
      return userRole; // Return role
    } catch (error) {
      throw new Error('Invalid username or password');
    }
  };

  // Function to parse JWT token
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setIsLoggedIn(false);
    setIsAdmin(false); // Reset admin status on logout
  };


  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout} />
        <Routes>
          <Route path="/book-catalog" element={<BookCatalog />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
          <Route path="/order-management" element={<OrderManagement />} />
          <Route path="/stock-management" element={<StockManagement />} />
        </Routes>
        <BottomNavbar /> {/* Add BottomNavbar component */}
      </div>
    </Router>
  );
};

export default App;

