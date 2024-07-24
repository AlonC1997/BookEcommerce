import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import BottomNavbar from './components/BottomNavbar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import BookCatalog from './components/BooksCatalog';
import Home from './components/Home';
import OrderManagement from './components/OrdersManagement';
import StockManagement from './components/StockManagement';
import UsersAndAdminsManagement from './components/UsersAndAdminsManagement';
import axios from 'axios';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMainAdmin, setIsMainAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      if (decodedToken) {
        setIsLoggedIn(true);
        setIsAdmin(decodedToken.role === 'ADMIN');
        setIsMainAdmin(decodedToken.role === 'MAIN_ADMIN');
      }
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username,
        password,
      });
      const token = response.data.accessToken;
      localStorage.setItem('token', token);

      const decodedToken = parseJwt(token);
      const userRole = decodedToken.role;

      setIsLoggedIn(true);
      setIsAdmin(userRole === 'ADMIN');
      setIsMainAdmin(userRole === 'MAIN_ADMIN');
      return userRole;
    } catch (error) {
      throw new Error('Invalid username or password');
    }
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsMainAdmin(false);
  };

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} isMainAdmin={isMainAdmin} onLogout={handleLogout} />
        <Routes>
          <Route path="/book-catalog" element={<BookCatalog />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
          <Route
            path="/order-management"
            element={isLoggedIn && (isAdmin || isMainAdmin) ? <OrderManagement /> : <Navigate to="/login" />}
          />
          <Route
            path="/stock-management"
            element={isLoggedIn && (isAdmin || isMainAdmin) ? <StockManagement /> : <Navigate to="/login" />}
          />
          <Route
            path="/users-and-admins-management"
            element={isLoggedIn && isMainAdmin ? <UsersAndAdminsManagement /> : <Navigate to="/login" />}
          />
        </Routes>
        {!isAdmin && !isMainAdmin && <BottomNavbar />}
      </div>
    </Router>
  );
};

export default App;
