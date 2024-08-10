import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './BookCardUser.module.css'

const BookCardUser = ({ book, onAddToCart, setCartVisible }) => {
	const [stockQuantity, setStockQuantity] = useState(null)

	useEffect(() => {
		if (book && book.id) {
			const fetchStockQuantity = async () => {
				try {
					const response = await axios.get(`http://localhost:8080/books/getStockQuantity?bookId=${book.id}`)
					setStockQuantity(response.data)
				} catch (error) {
					console.error('Error fetching stock quantity', error)
				}
			}
			fetchStockQuantity()
		}
	}, [book])

	const handleAddToCart = async () => {
		setCartVisible(false)
		try {
			const token = localStorage.getItem('token')
			await axios.post(`http://localhost:8080/carts/addOneBook?bookId=${book.id}`, null, {
				headers: { Authorization: `Bearer ${token}` },
			})
			if (onAddToCart) {
				onAddToCart() // Notify Home component to refresh cart immediately
			}
		} catch (error) {
			console.error('Error adding book to cart:', error)
		}
	}

	const getStockStatus = () => {
		if (stockQuantity === null) {
			return 'Loading...'
		} else if (stockQuantity === 0) {
			return <span className={styles.outOfStock}>OUT OF STOCK</span>
		} else if (stockQuantity <= 5) {
			return <span className={styles.lowStock}>LOW STOCK</span>
		} else {
			return <span className={styles.highStock}>IN STOCK</span>
		}
	}

	const imageSrc = `${process.env.PUBLIC_URL}${book.img_link}`

	return (
		<div className={styles.bookCard}>
			<img src={imageSrc} alt={book.name} className={styles.bookImage} />
			<div className={styles.bookDetails}>
				<h3>{book.name}</h3>
				<p>
					<strong>Author:</strong> {book.author}
				</p>
				<p>{book.description}</p>
				<h5>Price: ${book.price}</h5>
				<h5>Stock: {getStockStatus()}</h5>
				<button onClick={handleAddToCart} disabled={stockQuantity === 0 || !localStorage.getItem('token')}>
					{stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
				</button>
			</div>
		</div>
	)
}

export default BookCardUser
