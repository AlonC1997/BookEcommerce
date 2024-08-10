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
import MyDetails from './components/PublicPagesForAllRoles/MyDetails' // Import MyDetails component
import MyOrders from './components/CostumerPages/MyOrders' // Import MyOrders component
import axios from 'axios'

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [isAdmin, setIsAdmin] = useState(false)
	const [isMainAdmin, setIsMainAdmin] = useState(false)
	const [userRole, setUserRole] = useState(null)

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const decodedToken = parseJwt(token)
			if (decodedToken && decodedToken.exprt * 1000 > Date.now()) {
				setIsLoggedIn(true)
				setIsAdmin(decodedToken.role === 'ADMIN')
				setIsMainAdmin(decodedToken.role === 'MAIN_ADMIN')
				setUserRole(decodedToken.role)
			} else {
				// Invalid token; clear state and redirect to login
				localStorage.removeItem('token')
				setIsLoggedIn(false)
				setIsAdmin(false)
				setIsMainAdmin(false)
				setUserRole(null)
			}
		} else {
			setIsLoggedIn(false)
			setIsAdmin(false)
			setIsMainAdmin(false)
			setUserRole(null)
		}
	}, []) // Empty dependency array ensures this runs only on mount

	const handleLogin = async (username, password) => {
		try {
			const response = await axios.post('http://localhost:8080/auth/login', {
				username,
				password,
			})
			const token = response.data.accessToken
			localStorage.setItem('token', token)

			const decodedToken = parseJwt(token)
			const userRole = decodedToken.role

			setIsLoggedIn(true)
			setIsAdmin(userRole === 'ADMIN')
			setIsMainAdmin(userRole === 'MAIN_ADMIN')
			setUserRole(userRole)
			return userRole
		} catch (error) {
			throw new Error('Invalid username or password')
		}
	}

	const parseJwt = (token) => {
		try {
			return JSON.parse(atob(token.split('.')[1]))
		} catch (e) {
			return null
		}
	}

	const handleLogout = () => {
		localStorage.removeItem('token')
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
						<Route path="/" element={<Navigate to={isLoggedIn ? '/home' : '/login'} />} />
					</Routes>
				</div>
				<Footer userRole={userRole} />
			</div>
		</Router>
	)
}

export default App
