import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './OrdersManagement.module.css'

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

	useEffect(() => {
		fetchOrders()
	}, [])

	useEffect(() => {
		filterOrders()
	}, [orders, searchOrderId, searchUserId, selectedStatuses])

	const fetchOrders = async () => {
		try {
			const token = localStorage.getItem('token') 
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

	const fetchOrderBooks = async (orderId) => {
		try {
			const token = localStorage.getItem('token')
			const response = await axios.get(`http://localhost:8080/orders/getOrderBooksById?orderId=${orderId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			setOrderBooks(response.data)
			setIsBooksModalOpen(true)
		} catch (error) {
			console.error('Error fetching order books:', error)
		}
	}

	const updateOrder = async (order) => {
		try {
			const token = localStorage.getItem('token')
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

	const deleteOrder = async (orderId) => {
		try {
			const token = localStorage.getItem('token')
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

	const fetchUserDetails = async (userId) => {
		try {
			const token = localStorage.getItem('token')
			const response = await axios.get(`http://localhost:8080/users/getUser?userId=${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			const { userID, name, address } = response.data
			setUserDetails({ userID, name, address })
			setIsUserModalOpen(true)
		} catch (error) {
			console.error('Error fetching user details:', error)
		}
	}

	const handleInputChange = (e, orderId, field) => {
		const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, [field]: e.target.value } : order))
		setOrders(updatedOrders)
	}

	const handleSaveOrder = (order) => {
		updateOrder(order)
	}

	const handleSearchOrderIdChange = (e) => {
		setSearchOrderId(e.target.value)
	}

	const handleSearchUserIdChange = (e) => {
		setSearchUserId(e.target.value)
	}

	const handleStatusChange = (e) => {
		const { name, checked } = e.target
		setSelectedStatuses((prevStatuses) => ({
			...prevStatuses,
			[name]: checked,
		}))
	}

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
				<h1>Order Management</h1>
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
				<div className={styles.modal}>
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
				<div className={styles.modal}>
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
