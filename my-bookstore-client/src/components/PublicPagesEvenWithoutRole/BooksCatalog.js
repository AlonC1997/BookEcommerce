import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BookCard from './BookCard'
import styles from './BooksCatalog.module.css'

const BooksCatalog = () => {
	const [books, setBooks] = useState([])
	const [loading, setLoading] = useState(true)
	const [categoryFilter, setCategoryFilter] = useState({
		football: true,
		otherSports: true,
	})
	const [searchQuery, setSearchQuery] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [booksPerPage] = useState(10)

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const response = await axios.get('http://localhost:8080/books/getAllBooks')
				console.log('Books fetched:', response.data)
				setBooks(response.data)
				setLoading(false)
			} catch (error) {
				console.error('Error fetching books:', error)
				setLoading(false)
			}
		}

		fetchBooks()
	}, [])

	useEffect(() => {
		setCurrentPage(1)
	}, [categoryFilter, searchQuery])

	if (loading) {
		return <div className={styles.loading}>Loading...</div>
	}

	const filteredBooks = books
		.filter((book) => (categoryFilter.football && book.category === 'Football') || (categoryFilter.otherSports && book.category === 'Other'))
		.filter((book) => book.name.toLowerCase().includes(searchQuery.toLowerCase()))

	const indexOfLastBook = currentPage * booksPerPage
	const indexOfFirstBook = indexOfLastBook - booksPerPage
	const totalPages = Math.ceil(filteredBooks.length / booksPerPage)

	const footballBooks = filteredBooks.filter((book) => book.category === 'Football')
	const otherSportsBooks = filteredBooks.filter((book) => book.category === 'Other')

	const hasFootballBooks = footballBooks.length > 0 && footballBooks.some((book) => filteredBooks.includes(book))
	const hasOtherSportsBooks = otherSportsBooks.length > 0 && otherSportsBooks.some((book) => filteredBooks.includes(book))

	const handleCategoryChange = (category) => {
		setCategoryFilter((prev) => ({ ...prev, [category]: !prev[category] }))
	}

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
	}

	return (
		<div className={styles.booksCatalog}>
			<h1 className={styles.pageTitle}>Discover Our Collection</h1> {}
			<div className={styles.filters}>
				<h3>Filter by Category:</h3>
				<label>
					<input type="checkbox" checked={categoryFilter.football} onChange={() => handleCategoryChange('football')} />
					Football Autobiographies ({filteredBooks.filter((book) => book.category === 'Football').length})
				</label>
				<label>
					<input type="checkbox" checked={categoryFilter.otherSports} onChange={() => handleCategoryChange('otherSports')} />
					Other Sports Autobiographies ({filteredBooks.filter((book) => book.category === 'Other').length})
				</label>
			</div>
			<div className={styles.search}>
				<input type="text" placeholder="Search by book name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
			</div>
			{hasFootballBooks && (
				<section className={styles.section}>
					<h2>Football Autobiographies</h2>
					<div className={styles.bookContainer}>
						{footballBooks.slice(indexOfFirstBook, indexOfLastBook).map((book) => (
							<BookCard key={book.id} book={book} />
						))}
					</div>
				</section>
			)}
			{hasOtherSportsBooks && (
				<section className={styles.section}>
					<h2>Other Sports Autobiographies</h2>
					<div className={styles.bookContainer}>
						{otherSportsBooks.slice(indexOfFirstBook, indexOfLastBook).map((book) => (
							<BookCard key={book.id} book={book} />
						))}
					</div>
				</section>
			)}
			<div className={styles.pagination}>
				<button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
					Prev
				</button>
				{Array.from({ length: totalPages }, (_, index) => (
					<button key={index + 1} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? styles.activePage : ''}>
						{index + 1}
					</button>
				))}
				<button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
					Next
				</button>
			</div>
		</div>
	)
}

export default BooksCatalog
