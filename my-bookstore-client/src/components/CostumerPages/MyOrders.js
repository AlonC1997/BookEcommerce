import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './MyOrders.module.css'
import Cookies from 'js-cookie'

const MyOrders = () => {
	const [orders, setOrders] = useState([])
	const [filter, setFilter] = useState('last10')
	const [searchId, setSearchId] = useState('')
	const [bookDetails, setBookDetails] = useState({})
	const [currentPage, setCurrentPage] = useState(1)
	const ordersPerPage = 5

	useEffect(() => {
		fetchOrders()
	}, [filter, searchId])

	const fetchOrders = async () => {
		try {
			const token = Cookies.get('token')
			const { data: ordersData } = await axios.get('http://localhost:8080/orders/getUserOrdersWithOutId', {
				headers: { Authorization: `Bearer ${token}` },
			})

			setOrders(ordersData)
			fetchBookDetails(ordersData)
		} catch (error) {
			console.error('Error fetching orders:', error)
		}
	}

	const fetchBookDetails = async (ordersData) => {
		const books = new Set()
		ordersData.forEach((order) => {
			order.orderBooks.forEach((book) => books.add(book.bookId))
		})

		try {
			const token = Cookies.get('token')
			const responses = await Promise.all(
				Array.from(books).map((bookId) =>
					axios.get(`http://localhost:8080/books/getBook?bookId=${bookId}`, {
						headers: { Authorization: `Bearer ${token}` },
					})
				)
			)
			const details = responses.reduce((acc, response) => {
				acc[response.data.id] = response.data.img_link
				return acc
			}, {})
			setBookDetails(details)
		} catch (error) {
			console.error('Error fetching book details:', error)
		}
	}

	const handleCancelOrder = async (orderId) => {
		try {
			const token = Cookies.get('token')
			await axios.delete(`http://localhost:8080/orders/deleteOrder?orderId=${orderId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			fetchOrders()
		} catch (error) {
			console.error('Error canceling order:', error)
		}
	}

	/*
	 * Filters the orders based on the selected filter and search ID.
	 * @returns {Array} The filtered orders.
	 */
	const filterOrders = () => {
		const now = new Date()
		return orders
			.filter((order) => {
				const orderDate = new Date(order.createdAt)
				const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24))
				if (filter === 'last10') return diffDays < 10
				if (filter === 'last30') return diffDays < 30
				if (filter === '30+') return diffDays >= 30
				return true
			})
			.filter((order) => (searchId ? order.id.toString().includes(searchId) : true))
	}

	/*
	 * Paginates the filtered orders based on the current page and the number of orders per page.
	 * @returns {Array} The paginated orders to display.
	 */
	const paginateOrders = () => {
		const filteredOrders = filterOrders()
		const startIndex = (currentPage - 1) * ordersPerPage
		const endIndex = startIndex + ordersPerPage
		return filteredOrders.slice(startIndex, endIndex)
	}

	const renderOrders = () => {
		const paginatedOrders = paginateOrders()
		return paginatedOrders.map((order) => (
			<div key={order.id} className={styles.orderSection}>
				<h2>Order ID: {order.id}</h2>
				<p>Status: {order.status}</p>
				<p>Total Price: ${order.totalPrice.toFixed(2)}</p>
				<p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
				<div className={styles.orderItems}>
					{order.orderBooks.map((book) => (
						<div key={book.bookId} className={styles.orderItem}>
							<div className={styles.orderItemInfo}>
								<img src={`${process.env.PUBLIC_URL}${bookDetails[book.bookId] || '/default-image.jpg'}`} alt={book.bookName} className={styles.orderItemImage} />
								<div className={styles.orderItemDetails}>
									<p>{book.bookName}</p>
									<p>Price: ${book.price.toFixed(2)}</p>
									<p>Quantity: {book.quantity}</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<button onClick={() => handleCancelOrder(order.id)} disabled={new Date() - new Date(order.createdAt) > 24 * 60 * 60 * 1000} className={styles.cancelButton}>
					Cancel Order
				</button>
			</div>
		))
	}

	const totalPages = Math.ceil(filterOrders().length / ordersPerPage)

	return (
		<div className={styles.myOrders}>
			<h1 className={styles.title}>My Orders</h1>
			<p className={styles.cancelPolicy}>Cancellation Policy: Orders can only be canceled within 24 hours of placement.</p>
			<div className={styles.searchFilter}>
				<input type="number" placeholder="Search by Order ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} className={styles.searchInput} />
				<select onChange={(e) => setFilter(e.target.value)} value={filter} className={styles.filterSelect}>
					<option value="last10">Last 10 Days</option>
					<option value="last30">Last 30 Days</option>
					<option value="30+">30+ Days</option>
				</select>
			</div>
			<div className={styles.ordersList}>{renderOrders()}</div>
			<div className={styles.pagination}>
				<button className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
					Previous
				</button>
				<span>
					Page {currentPage} of {totalPages}
				</span>
				<button
					className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
					onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
					disabled={currentPage === totalPages}>
					Next
				</button>
			</div>
		</div>
	)
}

export default MyOrders
