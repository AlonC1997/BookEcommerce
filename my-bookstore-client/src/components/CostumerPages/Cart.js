import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './Cart.module.css'
import ThanksModal from './ThanksModal'

const Cart = ({ cartVisible, setCartVisible, onCartUpdate, hasPreviousOrder, setHasPreviousOrder }) => {
	const [cartItems, setCartItems] = useState([])
	const [stockQuantities, setStockQuantities] = useState({})
	const [cartTotal, setCartTotal] = useState(0)
	const [vat, setVat] = useState(0)
	const [discount, setDiscount] = useState(0)
	const [showModal, setShowModal] = useState(false)
	const [modalMessage, setModalMessage] = useState('')
	const [orderDetails, setOrderDetails] = useState(null)
	const [outOfStockMessage, setOutOfStockMessage] = useState('')

	useEffect(() => {
		if (cartVisible) {
			fetchCartItems()
		}
	}, [cartVisible])

	useEffect(() => {
		if (cartItems.length > 0) {
			calculateTotals(cartItems)
		}
	}, [cartItems])

	const fetchCartItems = async () => {
		try {
			const token = localStorage.getItem('token')
			const cartResponse = await axios.get('http://localhost:8080/carts/getCartBooks', {
				headers: { Authorization: `Bearer ${token}` },
			})

			const bookDetailsRequests = cartResponse.data.map((item) => axios.get(`http://localhost:8080/books/getBook?bookId=${item.bookId}`))
			const booksResponse = await Promise.all(bookDetailsRequests)
			const books = booksResponse.map((res) => res.data)

			const cartItemsWithDetails = cartResponse.data.map((item) => {
				const book = books.find((b) => b.id === item.bookId)
				return { ...item, img_link: book.img_link, price: book.price }
			})

			setCartItems(cartItemsWithDetails)
			console.log('Cart items after fetch:', cartItemsWithDetails) 

			const stockRequests = cartResponse.data.map((item) => axios.get(`http://localhost:8080/books/getStockQuantity?bookId=${item.bookId}`))
			const stockResponses = await Promise.all(stockRequests)
			const stockData = stockResponses.reduce((acc, res, index) => {
				acc[cartResponse.data[index].bookId] = res.data
				return acc
			}, {})
			setStockQuantities(stockData)
		} catch (error) {
			console.error('Error fetching cart:', error)
			setCartItems([])
			setStockQuantities({})
		}
	}

	const calculateTotals = (items) => {
		let total = 0
		items.forEach((item) => {
			total += item.price * item.quantity
		})
		setCartTotal(total)
		setDiscount(hasPreviousOrder ? 0 : total * 0.05) 
		setVat(total * 0.17) 
	}

	const refreshCart = async () => {
		try {
			await fetchCartItems() 
			if (onCartUpdate) {
				onCartUpdate() 
			}
		} catch (error) {
			console.error('Error refreshing cart:', error)
		}
	}

	const handleAddOne = async (bookId) => {
		try {
			const stockQuantity = stockQuantities[bookId] || 0
			if (stockQuantity > 0) {
				const token = localStorage.getItem('token')
				await axios.post(`http://localhost:8080/carts/addOneBook?bookId=${bookId}`, null, {
					headers: { Authorization: `Bearer ${token}` },
				})
				setOutOfStockMessage('') 
				await refreshCart()
			} else {
				setOutOfStockMessage('Out of Stock') 
			}
		} catch (error) {
			console.error('Error adding book to cart:', error)
			setOutOfStockMessage('Error adding book. Please try again.') 
		}
	}

	const handleRemoveOne = async (bookId) => {
		try {
			if (cartItems.length === 1 && cartItems[0].quantity === 1) {
				setCartVisible(false)
			}
			const token = localStorage.getItem('token')
			await axios.post(`http://localhost:8080/carts/removeBook?bookId=${bookId}`, null, {
				headers: { Authorization: `Bearer ${token}` },
			})
			await refreshCart()
		} catch (error) {
			console.error('Error removing book from cart:', error)
		}
	}

	const handleSubmitCart = async () => {
		try {
			const token = localStorage.getItem('token')
			await axios.post('http://localhost:8080/carts/submitCart', null, {
				headers: { Authorization: `Bearer ${token}` },
			})
			setCartItems([])
			setCartVisible(true)
			setModalMessage('Thank you for your order! Your cart has been submitted.')
			setShowModal(true)
			fetchLastOrderDetails() 
			if (onCartUpdate) {
				onCartUpdate()
			}
		} catch (error) {
			console.error('Error submitting cart:', error)
		}
	}

	const fetchLastOrderDetails = async () => {
		try {
			const token = localStorage.getItem('token')
			const userIdResponse = await axios.get('http://localhost:8080/users/getLoggedInUserId', {
				headers: { Authorization: `Bearer ${token}` },
			})
			const userId = userIdResponse.data

			const ordersResponse = await axios.get(`http://localhost:8080/orders/getUserOrders?userId=${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			const orders = ordersResponse.data
			const lastOrder = orders[orders.length - 1] 

			if (lastOrder) {
				setOrderDetails({
					orderId: lastOrder.id,
					orderDate: new Date(lastOrder.createdAt).toLocaleDateString(),
					totalAmount: lastOrder.totalPrice,
					discount: discount,
					items: lastOrder.orderBooks,
				})
			}
		} catch (error) {
			console.error('Error fetching last order details:', error)
		}
	}

	const handleClose = () => {
		setShowModal(false)
		setCartVisible(false)
	}

	return (
		<>
			<div className={`${styles.cart} ${cartVisible ? styles.visible : styles.hidden}`}>
				<button className={styles.closeCart} onClick={() => setCartVisible(false)}>
					Close
				</button>
				<h2 className={styles.header}>Your Cart</h2>
				{cartItems.length === 0 ? (
					<p>Your cart is empty.</p>
				) : (
					<ul className={styles.list}>
						{cartItems.map((item) => (
							<li key={item.bookId} className={styles.listItem}>
								<img src={`${process.env.PUBLIC_URL}${item.img_link}`} alt={`Book ${item.name}`} className={styles.img} />
								<div className={styles.details}>
									<span className={styles.info}>Book Name: {item.bookName}</span>
									<span className={styles.info}>Quantity: {item.quantity}</span>
									<span className={styles.info}>Quantity Price: ${(item.price * item.quantity).toFixed(2)}</span>
								</div>
								<button className={`${styles.button} ${styles.remove}`} onClick={() => handleRemoveOne(item.bookId)}>
									-
								</button>
								<button className={styles.button} onClick={() => handleAddOne(item.bookId)} disabled={(stockQuantities[item.bookId] || 0) <= 0}>
									+
								</button>
								{item.bookId in stockQuantities && stockQuantities[item.bookId] <= 0 && (
									<p className={styles.outOfStockMessage}>{outOfStockMessage}</p>
								)}
							</li>
						))}
					</ul>
				)}
				<div className={styles.summary}>
					<p>Total: ${cartTotal.toFixed(2)}</p>
					<p>VAT (17%): ${vat.toFixed(2)}</p>
					<p>Discount: ${discount.toFixed(2)}</p>
					<p>Final Total: ${(cartTotal - discount).toFixed(2)}</p>
					<p className={styles.shippingMessage}>Free shipping on all orders!</p>
					<p className={styles.cancelPolicy}>Cancellation Policy: Orders can only be canceled within 24 hours of placement.</p>
					<button className={styles.submitButton} onClick={handleSubmitCart} disabled={cartItems.length === 0}>
						Submit Cart
					</button>
				</div>
			</div>
			{showModal && <ThanksModal isOpen={showModal} onClose={handleClose} message={modalMessage} orderDetails={orderDetails} setHasPreviousOrder={setHasPreviousOrder} />}
		</>
	)
}

export default Cart
