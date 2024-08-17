import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/PublicPagesEvenWithoutRole/Navbar'
import Footer from './components/PublicPagesEvenWithoutRole/Footer'
import Login from './components/PublicPagesEvenWithoutRole/Login'
import SignUp from './components/PublicPagesEvenWithoutRole/SignUp'
import BookCatalog from './components/PublicPagesEvenWithoutRole/BooksCatalog'
import Career from './components/PublicPagesEvenWithoutRole/CareerPage'
import Home from './components/CostumerPages/Home'
import OrderManagement from './components/AdminAndMainAdminPages/OrdersManagement'
import StockManagement from './components/AdminAndMainAdminPages/StockManagement'
import UsersAndAdminsManagement from './components/MainAdminPages/UsersAndAdminsManagement'
import MyDetails from './components/PublicPagesForAllRoles/MyDetails'
import MyOrders from './components/CostumerPages/MyOrders'
import AdminCareerPage from './components/MainAdminPages/CareersManagement'
import axios from 'axios'
import './axiosInterceptor'; // Ensure this import is made to set up interceptors
import Cookies from 'js-cookie'

axios.defaults.withCredentials = true;

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [isAdmin, setIsAdmin] = useState(false)
	const [isMainAdmin, setIsMainAdmin] = useState(false)
	const [userRole, setUserRole] = useState(null)

	useEffect(() => {
		const token = Cookies.get('token')
		if (token) {
			const decodedToken = parseJwt(token)
			console.log('Decoded Token:', decodedToken)
			if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
				setIsLoggedIn(true)
				setIsAdmin(decodedToken.role === 'ADMIN')
				setIsMainAdmin(decodedToken.role === 'MAIN_ADMIN')
				setUserRole(decodedToken.role)
			} else {
				// Token is expired, attempt to refresh
				refreshToken()
			}
		} else {
			setIsLoggedIn(false)
			setIsAdmin(false)
			setIsMainAdmin(false)
			setUserRole(null)
		}
	}, [])

	/**
	 * Refreshes the access token using the refresh token stored in cookies.
	 */
	 // Function to refresh token
	 
	 const refreshToken = async () => {
        try {
            const response = await axios.post('http://localhost:8080/auth/refresh-token', {}, {
                withCredentials: true, // Send cookies with the request
            });
            const newAccessToken = response.data.accessToken;
            Cookies.set('token', newAccessToken); // Update access token in cookies
            // Update the state with the new token
            const decodedToken = parseJwt(newAccessToken);
            setIsLoggedIn(true);
            setIsAdmin(decodedToken.role === 'ADMIN');
            setIsMainAdmin(decodedToken.role === 'MAIN_ADMIN');
            setUserRole(decodedToken.role);
        } catch (error) {
            setIsLoggedIn(false);
            setIsAdmin(false);
            setIsMainAdmin(false);
            setUserRole(null);
            // Optionally redirect to login page
        }
    };
	
	const handleLogin = async (username, password) => {
		try {
			const response = await axios.post('http://localhost:8080/auth/login', {
				username,
				password,
			});
	
			const { accessToken, refreshToken } = response.data;
	
			Cookies.set('token', accessToken, { expires: 1 }); // 1-day expiration
			Cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7-day expiration
	
			const decodedToken = parseJwt(accessToken);
			const userRole = decodedToken.role;
	
			setIsLoggedIn(true);
			setIsAdmin(userRole === 'ADMIN');
			setIsMainAdmin(userRole === 'MAIN_ADMIN');
			setUserRole(userRole);
	
			return userRole;
		} catch (error) {
			console.error('Invalid username or password', error);

		}
	};
	
	/**
	 * Parses a JWT token to extract the payload.
	 *
	 * @param {string} token - The JWT token to parse.
	 * @returns {object|null} The parsed payload of the token, or null if parsing fails.
	 */
	const parseJwt = (token) => {
		try {
			return JSON.parse(atob(token.split('.')[1]))
		} catch (e) {
			return null
		}
	}

	/**
	 * Handles user logout by removing the token from Cookies and resetting the user's login status and role.
	 */
	const handleLogout = () => {
		Cookies.remove('token')
		setIsLoggedIn(false)
		setIsAdmin(false)
		setIsMainAdmin(false)
		setUserRole(null)
	}

	return (
		<Router>
			<div className="App">
				<Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} isMainAdmin={isMainAdmin} onLogout={handleLogout} />
				<div className="mainContent">
					<Routes>
						<Route path="/book-catalog" element={<BookCatalog />} />
						<Route path="/careers" element={<Career />} />
						<Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
						<Route path="/my-orders" element={isLoggedIn ? <MyOrders /> : <Navigate to="/login" />} />
						<Route path="/my-details" element={isLoggedIn ? <MyDetails /> : <Navigate to="/login" />} />
						<Route path="/login" element={<Login onLogin={handleLogin} />} />
						<Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
						<Route path="/order-management" element={isLoggedIn && (isAdmin || isMainAdmin) ? <OrderManagement /> : <Navigate to="/login" />} />
						<Route path="/stock-management" element={isLoggedIn && (isAdmin || isMainAdmin) ? <StockManagement /> : <Navigate to="/login" />} />
						<Route path="/users-and-admins-management" element={isLoggedIn && isMainAdmin ? <UsersAndAdminsManagement /> : <Navigate to="/login" />} />
						<Route path="/admin-careers" element={isLoggedIn && isMainAdmin ? <AdminCareerPage /> : <Navigate to="/login" />} />
						<Route path="/" element={<Navigate to={isLoggedIn ? '/home' : '/login'} />} />
					</Routes>
				</div>
				<Footer userRole={userRole} />
			</div>
		</Router>
	)
}

export default App
