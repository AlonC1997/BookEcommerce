import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './StockManagement.module.css'

const StockManagement = () => {
	const [inStockBooks, setInStockBooks] = useState([])
	const [outOfStockBooks, setOutOfStockBooks] = useState([])
	const [noMoreForSaleBooks, setNoMoreForSaleBooks] = useState([])
	const [showInStock, setShowInStock] = useState(true)
	const [showOutOfStock, setShowOutOfStock] = useState(true)
	const [showNoMoreForSale, setShowNoMoreForSale] = useState(true)
	const [searchTerm, setSearchTerm] = useState('')
	const [newBook, setNewBook] = useState({
		name: '',
		author: '',
		price: '',
		stockQuantity: '',
		img_link: '',
		description: '',
		category: '',
	})
	const [isModalOpen, setIsModalOpen] = useState(false)

	useEffect(() => {
		fetchBooks()
	}, [])

	const getAuthToken = () => {
		return localStorage.getItem('token')
	}

	const fetchBooks = async () => {
		try {
			const token = getAuthToken()
			const responseInStock = await axios.get('http://localhost:8080/books/getAllBooks', {
				headers: { Authorization: `Bearer ${token}` },
			})
			const responseDeleted = await axios.get('http://localhost:8080/books/getDeletedBooks', {
				headers: { Authorization: `Bearer ${token}` },
			})

			const inStock = responseInStock.data.filter((book) => book.stockQuantity > 0 && !book.deleted)
			const outOfStock = responseInStock.data.filter((book) => book.stockQuantity === 0 && !book.deleted)
			const noMoreForSale = responseDeleted.data

			setInStockBooks(inStock)
			setOutOfStockBooks(outOfStock)
			setNoMoreForSaleBooks(noMoreForSale)
		} catch (error) {
			console.error('Error fetching books:', error)
		}
	}

	const handleUpdateBook = async (book) => {
		try {
			const token = getAuthToken()
			await axios.put('http://localhost:8080/books/updateBook', book, {
				headers: { Authorization: `Bearer ${token}` },
			})
			alert('Book updated successfully')
			fetchBooks() 
		} catch (error) {
			console.error('Error updating book:', error)
		}
	}

	const handleDeleteBook = async (bookId) => {
		try {
			const token = getAuthToken()
			await axios.delete(`http://localhost:8080/books/deleteBook?bookId=${bookId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			alert('Book deleted successfully')
			fetchBooks() 
		} catch (error) {
			console.error('Error deleting book:', error)
		}
	}

	const handleRestoreBook = async (bookId) => {
		try {
			const token = getAuthToken()
			await axios.post(`http://localhost:8080/books/restoreBook?bookId=${bookId}`, null, {
				headers: { Authorization: `Bearer ${token}` },
			})
			alert('Book restored successfully')
			fetchBooks()
		} catch (error) {
			console.error('Error restoring book:', error)
		}
	}

	const handleAddBook = async () => {
		try {
			const token = getAuthToken()
			await axios.post('http://localhost:8080/books/addBook', newBook, {
				headers: { Authorization: `Bearer ${token}` },
			})
			alert('Book added successfully')
			fetchBooks() 
			setIsModalOpen(false) 
			setNewBook({
				name: '',
				author: '',
				price: '',
				stockQuantity: '',
				img_link: '',
				description: '',
				category: '',
			})
		} catch (error) {
			console.error('Error adding book:', error)
		}
	}

	const filteredBooks = (books) =>
		books.filter(
			(book) =>
				book.id.toString().includes(searchTerm) ||
				book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
				book.author.toLowerCase().includes(searchTerm.toLowerCase())
		)

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1>Stock Management</h1>
			</header>

			<div className={styles.leftPanel}>
				<button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
					Add New Book
				</button>

				<div className={styles.filters}>
					<label>
						<input type="checkbox" checked={showInStock} onChange={(e) => setShowInStock(e.target.checked)} />
						In Stock
					</label>
					<label>
						<input type="checkbox" checked={showOutOfStock} onChange={(e) => setShowOutOfStock(e.target.checked)} />
						Out of Stock
					</label>
					<label>
						<input type="checkbox" checked={showNoMoreForSale} onChange={(e) => setShowNoMoreForSale(e.target.checked)} />
						No More for Sale
					</label>
				</div>

				<input type="text" className={styles.search} placeholder="Search by ID, name, category, or author" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
			</div>

			{isModalOpen && (
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<h2>Add New Book</h2>
						<input type="text" placeholder="Name" value={newBook.name} onChange={(e) => setNewBook({ ...newBook, name: e.target.value })} />
						<input type="text" placeholder="Author" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
						<input type="number" step="0.01" placeholder="Price" value={newBook.price} onChange={(e) => setNewBook({ ...newBook, price: e.target.value })} />
						<input type="number" placeholder="Stock Quantity" value={newBook.stockQuantity} onChange={(e) => setNewBook({ ...newBook, stockQuantity: e.target.value })} />
						<input type="text" placeholder="Image Link" value={newBook.img_link} onChange={(e) => setNewBook({ ...newBook, img_link: e.target.value })} />
						<input type="text" placeholder="Description" value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} />
						<input type="text" placeholder="Category" value={newBook.category} onChange={(e) => setNewBook({ ...newBook, category: e.target.value })} />
						<button onClick={handleAddBook}>Add Book</button>
						<button onClick={() => setIsModalOpen(false)}>Close</button>
					</div>
				</div>
			)}

			{showInStock && (
				<>
					<h2>In Stock Books</h2>
					<div className={styles.tableContainer}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Author</th>
									<th>Description</th>
									<th>Image Link</th>
									<th>Price</th>
									<th>Stock Quantity</th>
									<th>Category</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{filteredBooks(inStockBooks).map((book, index) => (
									<tr key={book.id}>
										<td>{book.id}</td>
										<td>
											<input
												type="text"
												value={book.name}
												onChange={(e) => {
													const updatedBooks = [...inStockBooks]
													updatedBooks[index].name = e.target.value
													setInStockBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="text"
												value={book.author}
												onChange={(e) => {
													const updatedBooks = [...inStockBooks]
													updatedBooks[index].author = e.target.value
													setInStockBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="text"
												value={book.description}
												onChange={(e) => {
													const updatedBooks = [...inStockBooks]
													updatedBooks[index].description = e.target.value
													setInStockBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="text"
												value={book.img_link}
												onChange={(e) => {
													const updatedBooks = [...inStockBooks]
													updatedBooks[index].img_link = e.target.value
													setInStockBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="number"
												step="0.01"
												value={book.price}
												onChange={(e) => {
													const updatedBooks = [...inStockBooks]
													updatedBooks[index].price = e.target.value
													setInStockBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="number"
												value={book.stockQuantity}
												onChange={(e) => {
													const updatedBooks = [...inStockBooks]
													updatedBooks[index].stockQuantity = e.target.value
													setInStockBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="text"
												value={book.category}
												onChange={(e) => {
													const updatedBooks = [...inStockBooks]
													updatedBooks[index].category = e.target.value
													setInStockBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<button className={styles.deleteButton} onClick={() => handleDeleteBook(book.id)}>
												Delete
											</button>
											<button className={styles.updateButton} onClick={() => handleUpdateBook(book)}>
												Update
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			)}

			{showOutOfStock && (
				<>
					<h2>Out of Stock Books</h2>
					<div className={styles.tableContainer}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Author</th>
									<th>Description</th>
									<th>Image Link</th>
									<th>Price</th>
									<th>Stock Quantity</th>
									<th>Category</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{filteredBooks(outOfStockBooks).map((book, index) => (
									<tr key={book.id}>
										<td>{book.id}</td>
										<td>
											<input
												type="text"
												value={book.name}
												onChange={(e) => {
													const updatedBooks = [...outOfStockBooks]
													updatedBooks[index].name = e.target.value
													setOutOfStockBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="text"
												value={book.author}
												onChange={(e) => {
													const updatedBooks = [...outOfStockBooks]
													updatedBooks[index].author = e.target.value
													setOutOfStockBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="text"
												value={book.description}
												onChange={(e) => {
													const updatedBooks = [...outOfStockBooks]
													updatedBooks[index].description = e.target.value
													setOutOfStockBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="text"
												value={book.img_link}
												onChange={(e) => {
													const updatedBooks = [...outOfStockBooks]
													updatedBooks[index].img_link = e.target.value
													setOutOfStockBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="number"
												step="0.01"
												value={book.price}
												onChange={(e) => {
													const updatedBooks = [...outOfStockBooks]
													updatedBooks[index].price = e.target.value
													setOutOfStockBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="number"
												value={book.stockQuantity}
												onChange={(e) => {
													const updatedBooks = [...outOfStockBooks]
													updatedBooks[index].stockQuantity = e.target.value
													setOutOfStockBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="text"
												value={book.category}
												onChange={(e) => {
													const updatedBooks = [...outOfStockBooks]
													updatedBooks[index].category = e.target.value
													setOutOfStockBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<button className={styles.deleteButton} onClick={() => handleDeleteBook(book.id)}>
												Delete
											</button>
											<button className={styles.updateButton} onClick={() => handleUpdateBook(book)}>
												Update
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			)}

			{showNoMoreForSale && (
				<>
					<h2>No More for Sale Books</h2>
					<div className={styles.tableContainer}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Author</th>
									<th>Description</th>
									<th>Image Link</th>
									<th>Price</th>
									<th>Stock Quantity</th>
									<th>Category</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{filteredBooks(noMoreForSaleBooks).map((book, index) => (
									<tr key={book.id}>
										<td>{book.id}</td>
										<td>
											<input
												type="text"
												value={book.name}
												onChange={(e) => {
													const updatedBooks = [...noMoreForSaleBooks]
													updatedBooks[index].name = e.target.value
													setNoMoreForSaleBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="text"
												value={book.author}
												onChange={(e) => {
													const updatedBooks = [...noMoreForSaleBooks]
													updatedBooks[index].author = e.target.value
													setNoMoreForSaleBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="text"
												value={book.description}
												onChange={(e) => {
													const updatedBooks = [...noMoreForSaleBooks]
													updatedBooks[index].description = e.target.value
													setNoMoreForSaleBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="text"
												value={book.img_link}
												onChange={(e) => {
													const updatedBooks = [...noMoreForSaleBooks]
													updatedBooks[index].img_link = e.target.value
													setNoMoreForSaleBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="number"
												step="0.01"
												value={book.price}
												onChange={(e) => {
													const updatedBooks = [...noMoreForSaleBooks]
													updatedBooks[index].price = e.target.value
													setNoMoreForSaleBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="number"
												value={book.stockQuantity}
												onChange={(e) => {
													const updatedBooks = [...noMoreForSaleBooks]
													updatedBooks[index].stockQuantity = e.target.value
													setNoMoreForSaleBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<input
												type="text"
												value={book.category}
												onChange={(e) => {
													const updatedBooks = [...noMoreForSaleBooks]
													updatedBooks[index].category = e.target.value
													setNoMoreForSaleBooks(updatedBooks)
												}}
											/>
										</td>
										<td>
											<button className={styles.restoreButton} onClick={() => handleRestoreBook(book.id)}>
												Restore
											</button>
											<button className={styles.updateButton} onClick={() => handleUpdateBook(book)}>
												Update
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			)}
		</div>
	)
}

export default StockManagement
