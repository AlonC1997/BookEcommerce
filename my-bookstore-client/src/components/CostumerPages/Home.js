import React, { useState, useEffect } from 'react'
import axios from 'axios'
import BookCardUser from './BookCardUser'
import Cart from './Cart'
import styles from './Home.module.css'

const Home = () => {
	const [books, setBooks] = useState([])
	const [filteredBooks, setFilteredBooks] = useState([])
	const [cartItems, setCartItems] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [booksPerPage] = useState(12)
	const [searchTerm, setSearchTerm] = useState('')
	const [categoryFilter, setCategoryFilter] = useState({ Football: true, Other: true })
	const [userName, setUserName] = useState('')
	const [showGreeting, setShowGreeting] = useState(true)
	const [cartVisible, setCartVisible] = useState(false)
	const [hasPreviousOrder, setHasPreviousOrder] = useState(false)

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const response = await axios.get('http://localhost:8080/books/getAllBooks')
				setBooks(response.data)
			} catch (error) {
				console.error('Error fetching books:', error)
			}
		}

		const fetchUser = async () => {
			try {
				const response = await axios.get('http://localhost:8080/users/getLoggedInUser', {
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				})
				setUserName(response.data.name)
			} catch (error) {
				console.error('Error fetching user:', error)
			}
		}

		fetchBooks()
		fetchUser()
	}, [])

	useEffect(() => {
		const checkPreviousOrder = async () => {
			try {
				const token = localStorage.getItem('token')
				const response = await axios.get('http://localhost:8080/orders/getLastOrderId', {
					headers: { Authorization: `Bearer ${token}` },
				})
				const lastOrderId = response.data
				setHasPreviousOrder(lastOrderId !== 0)
			} catch (error) {
				console.error('Error checking previous orders:', error)
			}
		}
		checkPreviousOrder()
	}, [])

	useEffect(() => {
		const filtered = books
			.filter((book) => (categoryFilter.Football && book.category === 'Football') || (categoryFilter.Other && book.category === 'Other'))
			.filter((book) => book.name.toLowerCase().includes(searchTerm.toLowerCase()))

		setFilteredBooks(filtered)
		setCurrentPage(1) // Reset to the first page when filters or search change
	}, [books, searchTerm, categoryFilter])

	useEffect(() => {
		if (userName) {
			const timer = setTimeout(() => {
				setShowGreeting(false)
			}, 10000) // Hide greeting after 10 seconds

			return () => clearTimeout(timer) // Cleanup timer on component unmount
		}
	}, [userName])

	const handleCartUpdate = async () => {
		try {
			const response = await axios.get('http://localhost:8080/carts/getCartBooks', {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			})

			const bookDetailsRequests = response.data.map((item) => axios.get(`http://localhost:8080/books/getBook?bookId=${item.bookId}`))
			const booksResponse = await Promise.all(bookDetailsRequests)
			const books = booksResponse.map((res) => res.data)

			const cartItemsWithDetails = response.data.map((item) => {
				const book = books.find((b) => b.id === item.bookId)
				return { ...item, img_link: book.img_link }
			})
			setCartItems(cartItemsWithDetails) // Update cartItems state
		} catch (error) {
			console.error('Error fetching cart:', error)
		}
	}

	const indexOfLastBook = currentPage * booksPerPage
	const indexOfFirstBook = indexOfLastBook - booksPerPage
	const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook)
	const totalPages = Math.ceil(filteredBooks.length / booksPerPage)

	const hasFootballBooks = currentBooks.some((book) => book.category === 'Football')
	const hasOtherSportsBooks = currentBooks.some((book) => book.category === 'Other')

	const handleCategoryChange = (category) => {
		setCategoryFilter((prev) => ({ ...prev, [category]: !prev[category] }))
		setCurrentPage(1) // Reset to the first page when filters change
	}

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value)
		setCurrentPage(1) // Reset to the first page when search changes
	}

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1)
		}
	}

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1)
		}
	}

	return (
		<div className={styles.homeContainer}>
			<button className={styles.cartToggle} draggable="true" onClick={() => setCartVisible(!cartVisible)}>
				🛒
			</button>

			<header className={styles.header}>
				<h1>Discover Our Collection</h1>
			</header>

			{showGreeting && (
				<div className={styles.leftSidebar}>
					<div className={styles.userGreeting}>Hello, {userName}</div>
				</div>
			)}

			<div className={styles.filters}>
				<input type="text" placeholder="Search by book name..." value={searchTerm} onChange={handleSearchChange} className={styles.searchBox} />
				<div className={styles.checkboxes}>
					<label>
						<input type="checkbox" checked={categoryFilter.Football} onChange={() => handleCategoryChange('Football')} />
						Football Autobiographies
					</label>
					<label>
						<input type="checkbox" checked={categoryFilter.Other} onChange={() => handleCategoryChange('Other')} />
						Other Sports Autobiographies
					</label>
				</div>
			</div>

			{hasFootballBooks && <div className={styles.subHeader}>Football Books</div>}
			<div className={styles.booksList}>
				{currentBooks
					.filter((book) => book.category === 'Football')
					.map((book) => (
						<BookCardUser key={book.id} book={book} onAddToCart={handleCartUpdate} /*new*/ cartVisible={cartVisible} setCartVisible={setCartVisible} />
					))}
			</div>

			{hasOtherSportsBooks && <div className={styles.subHeader}>Other Sports Autobiographies</div>}
			<div className={styles.booksList}>
				{currentBooks
					.filter((book) => book.category === 'Other')
					.map((book) => (
						<BookCardUser key={book.id} book={book} onAddToCart={handleCartUpdate} /*new*/ cartVisible={cartVisible} setCartVisible={setCartVisible} />
					))}
			</div>
			<p className={styles.cancelPolicy}>Cancellation Policy: Orders can only be canceled within 24 hours of placement.</p>

			<div className={styles.pagination}>
				<button className={styles.paginationButton} onClick={handlePrevPage} disabled={currentPage === 1}>
					Prev
				</button>
				<button className={styles.paginationButton} onClick={handleNextPage} disabled={currentPage === totalPages}>
					Next
				</button>
			</div>

			{cartVisible && <Cart cartVisible={cartVisible} setCartVisible={setCartVisible} onCartUpdate={handleCartUpdate} hasPreviousOrder={hasPreviousOrder} setHasPreviousOrder={setHasPreviousOrder} />}
		</div>
	)
}

export default Home
