import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './OrdersManagement.module.css'
import Cookies from 'js-cookie'

const OrderManagement = () => {
	const [orders, setOrders] = useState([])
	const [filteredOrders, setFilteredOrders] = useState([])
	const [orderBooks, setOrderBooks] = useState([])
	const [isBooksModalOpen, setIsBooksModalOpen] = useState(false)
	const [searchOrderId, setSearchOrderId] = useState('')
	const [searchUserId, setSearchUserId] = useState('')
	const [selectedStatuses, setSelectedStatuses] = useState({
		ARRIVED: true,
		CANCELLED: true,
		INPROCESS: true,
		READY: true,
	})
	const [isUserModalOpen, setIsUserModalOpen] = useState(false)
	const [userDetails, setUserDetails] = useState({ userID: '', name: '', address: '' })

	/*
	 * useEffect hook to fetch all orders from the server when the component mounts.
	 */
	useEffect(() => {
		fetchOrders()
	}, [])

	/*
	 * useEffect hook to filter orders based on the search criteria and selected statuses.
	 */
	useEffect(() => {
		filterOrders()
	}, [orders, searchOrderId, searchUserId, selectedStatuses])

	/**
	 * Fetches all orders from the server and updates the state with the retrieved orders.
	 */
	const fetchOrders = async () => {
		try {
			const token = Cookies.get('token')
			const response = await axios.get('http://localhost:8080/orders/getAllOrders', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			setOrders(response.data)
		} catch (error) {
			console.error('Error fetching orders:', error)
		}
	}

	/**
	 * Fetches books associated with a specific order and opens the modal to display them.
	 * @param {string} orderId - The ID of the order whose books are to be fetched.
	 */
	const fetchOrderBooks = async (orderId) => {
		try {
			const token = Cookies.get('token')
			const response = await axios.get(`http://localhost:8080/orders/getOrderBooksById?orderId=${orderId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			setOrderBooks(response.data)
			setIsUserModalOpen(false)
			setIsBooksModalOpen(true)
		} catch (error) {
			console.error('Error fetching order books:', error)
		}
	}

	/**
	 * Sends an update request to the server for a specific order and refreshes the list of orders.
	 * @param {object} order - The order object containing updated information.
	 */
	const updateOrder = async (order) => {
		try {
			const token = Cookies.get('token')
			await axios.put('http://localhost:8080/orders/updateOrder', order, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			fetchOrders()
		} catch (error) {
			console.error('Error updating order:', error)
		}
	}

	/*
	 * Sends a delete request to the server for a specific order and refreshes the list of orders.
	 * @param {string} orderId - The ID of the order to be deleted.
	 */
	const deleteOrder = async (orderId) => {
		try {
			const token = Cookies.get('token')
			await axios.delete(`http://localhost:8080/orders/deleteOrder?orderId=${orderId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			fetchOrders()
		} catch (error) {
			console.error('Error deleting order:', error)
		}
	}

	/*
	 * Fetches the details of a specific user and opens the modal to display them.
	 * @param {string} userId - The ID of the user whose details are to be fetched.
	 */
	const fetchUserDetails = async (userId) => {
		try {
			const token = Cookies.get('token')
			const response = await axios.get(`http://localhost:8080/users/getUser?userId=${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			const { userID, name, address } = response.data
			setUserDetails({ userID, name, address })
			setIsBooksModalOpen(false)
			setIsUserModalOpen(true)
		} catch (error) {
			console.error('Error fetching user details:', error)
		}
	}

	/*
	 * Updates the state with the new value of the input field for a specific order.
	 * @param {object} e - The event object containing the new value of the input field.
	 * @param {string} orderId - The ID of the order to be updated.
	 * @param {string} field - The field to be updated in the order object.
	 */
	const handleInputChange = (e, orderId, field) => {
		const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, [field]: e.target.value } : order))
		setOrders(updatedOrders)
	}

	/*
	 * Updates the order on the server with the new information.
	 * @param {object} order - The order object to be updated.
	 * @returns {Promise<void>}
	 */
	const handleSaveOrder = (order) => {
		updateOrder(order)
	}

	/*
	 * Updates the state with the new value of the search field for Order ID.
	 * @param {object} e - The event object containing the new value of the search field.
	 * @returns {void}
	 * @async.
	 */
	const handleSearchOrderIdChange = (e) => {
		setSearchOrderId(e.target.value)
	}

	/*
	 * Updates the state with the new value of the search field for User ID.
	 * @param {object} e - The event object containing the new value of the search field.
	 * @returns {void}
	 * @async.
	 */
	const handleSearchUserIdChange = (e) => {
		setSearchUserId(e.target.value)
	}

	/*
	 * Updates the state with the new value of the selected status checkbox.
	 * @param {object} e - The event object containing the new value of the selected status checkbox.
	 * @returns {void}
	 * @async.
	 */
	const handleStatusChange = (e) => {
		const { name, checked } = e.target
		setSelectedStatuses((prevStatuses) => ({
			...prevStatuses,
			[name]: checked,
		}))
	}

	/*
	 * Filters the orders based on the search criteria and selected statuses.
	 * @returns {void}
	 */
	const filterOrders = () => {
		let filtered = orders

		if (searchOrderId) {
			filtered = filtered.filter((order) => order.id.toString().includes(searchOrderId))
		}

		if (searchUserId) {
			filtered = filtered.filter((order) => order.userId.toString().includes(searchUserId))
		}

		filtered = filtered.filter((order) => selectedStatuses[order.status])

		setFilteredOrders(filtered)
	}

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1>Orders Management</h1>
			</header>
			<div className={styles.searchContainer}>
				<div>
					<input type="text" placeholder="Search by Order ID" value={searchOrderId} onChange={handleSearchOrderIdChange} className={styles.searchInput} />
					<input type="text" placeholder="Search by User ID" value={searchUserId} onChange={handleSearchUserIdChange} className={styles.searchInput} />
				</div>
				<div className={styles.checkboxContainer}>
					<label className={styles.checkboxLabel}>
						<input type="checkbox" name="ARRIVED" checked={selectedStatuses.ARRIVED} onChange={handleStatusChange} />
						ARRIVED
					</label>
					<label className={styles.checkboxLabel}>
						<input type="checkbox" name="CANCELLED" checked={selectedStatuses.CANCELLED} onChange={handleStatusChange} />
						CANCELLED
					</label>
					<label className={styles.checkboxLabel}>
						<input type="checkbox" name="INPROCESS" checked={selectedStatuses.INPROCESS} onChange={handleStatusChange} />
						INPROCESS
					</label>
					<label className={styles.checkboxLabel}>
						<input type="checkbox" name="READY" checked={selectedStatuses.READY} onChange={handleStatusChange} />
						READY
					</label>
				</div>
			</div>

			<table className={styles.table}>
				<thead>
					<tr>
						<th className={styles.th}>Order ID</th>
						<th className={styles.th}>Total Price</th>
						<th className={styles.th}>Status</th>
						<th className={styles.th}>Created At</th>
						<th className={styles.th}>Updated At</th>
						<th className={styles.th}>User ID</th>
						<th className={styles.th}>User Details</th>
						<th className={styles.th}>Order Books</th>
						<th className={styles.th}>Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredOrders.map((order) => (
						<tr key={order.id}>
							<td className={styles.td}>{order.id}</td>
							<td className={styles.td}>
								<input type="text" value={order.totalPrice} onChange={(e) => handleInputChange(e, order.id, 'totalPrice')} className={styles.input} />
							</td>
							<td className={styles.td}>
								<select value={order.status} onChange={(e) => handleInputChange(e, order.id, 'status')} className={styles.input}>
									<option value="ARRIVED">ARRIVED</option>
									<option value="CANCELLED">CANCELLED</option>
									<option value="INPROCESS">INPROCESS</option>
									<option value="READY">READY</option>
								</select>
							</td>
							<td className={styles.td}>{order.createdAt}</td>
							<td className={styles.td}>{order.updatedAt}</td>
							<td className={styles.td}>{order.userId}</td>
							<td className={styles.td}>
								<button className={`${styles.button} ${styles.viewUserButton}`} onClick={() => fetchUserDetails(order.userId)}>
									View User
								</button>
							</td>
							<td className={styles.td}>
								<button className={`${styles.button} ${styles.seeBooksButton}`} onClick={() => fetchOrderBooks(order.id)}>
									See Books
								</button>
							</td>
							<td className={styles.td}>
								<button className={`${styles.button} ${styles.updateButton}`} onClick={() => handleSaveOrder(order)}>
									Update
								</button>
								<button className={`${styles.button} ${styles.deleteButton}`} onClick={() => deleteOrder(order.id)}>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{isBooksModalOpen && (
				<div className={styles.modalBooks}>
					<h2>Order Books</h2>
					<table className={styles.modalTable}>
						<thead>
							<tr>
								<th className={styles.modalTh}>Book ID</th>
								<th className={styles.modalTh}>Book Name</th>
								<th className={styles.modalTh}>Price</th>
								<th className={styles.modalTh}>Quantity</th>
								<th className={styles.modalTh}>Total Price</th>
							</tr>
						</thead>
						<tbody>
							{orderBooks.map((book) => (
								<tr key={book.bookId}>
									<td className={styles.modalTd}>{book.bookId}</td>
									<td className={styles.modalTd}>{book.bookName}</td>
									<td className={styles.modalTd}>{book.price}</td>
									<td className={styles.modalTd}>{book.quantity}</td>
									<td className={styles.modalTd}>{book.totalPrice}</td>
								</tr>
							))}
						</tbody>
					</table>
					<button onClick={() => setIsBooksModalOpen(false)} className={styles.closeButton}>
						Close
					</button>
				</div>
			)}

			{isUserModalOpen && (
				<div className={styles.modalUser}>
					<h2>User Details</h2>
					<table className={styles.modalTable}>
						<thead>
							<tr>
								<th className={styles.modalTh}>User ID</th>
								<th className={styles.modalTh}>Name</th>
								<th className={styles.modalTh}>Address</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className={styles.modalTd}>{userDetails.userID}</td>
								<td className={styles.modalTd}>{userDetails.name}</td>
								<td className={styles.modalTd}>{userDetails.address}</td>
							</tr>
						</tbody>
					</table>
					<button onClick={() => setIsUserModalOpen(false)} className={styles.closeButton}>
						Close
					</button>
				</div>
			)}
		</div>
	)
}

export default OrderManagement
