import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from './BookCard';
import BottomNavbar from './BottomNavbar'; // Assuming you have a BottomNavbar component
import './BooksCatalog.css';

const BooksCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState({
    football: true,
    otherSports: true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10); // Adjust as needed

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/books/getAllBooks');
        console.log('Books fetched:', response.data); // Log books to verify
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters or search query change
  }, [categoryFilter, searchQuery]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Apply filters and search
  const filteredBooks = books
    .filter(book =>
      (categoryFilter.football && book.category === 'football') ||
      (categoryFilter.otherSports && book.category === 'other')
    )
    .filter(book =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // Categorize books
  const footballBooks = filteredBooks.filter(book => book.category === 'football');
  const otherSportsBooks = filteredBooks.filter(book => book.category === 'other');

  // Determine if the category has books on the current page
  const hasFootballBooks = footballBooks.length > 0 && footballBooks.some(book => filteredBooks.includes(book));
  const hasOtherSportsBooks = otherSportsBooks.length > 0 && otherSportsBooks.some(book => filteredBooks.includes(book));

  const handleCategoryChange = (category) => {
    setCategoryFilter(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="books-catalog">
      <h1 className="page-title">Discover Our Collection</h1> {/* New title */}
      
      <div className="filters">
        <h3>Filter by Category:</h3>
        <label>
          <input
            type="checkbox"
            checked={categoryFilter.football}
            onChange={() => handleCategoryChange('football')}
          />
          Football Autobiographies ({filteredBooks.filter(book => book.category === 'football').length})
        </label>
        <label>
          <input
            type="checkbox"
            checked={categoryFilter.otherSports}
            onChange={() => handleCategoryChange('otherSports')}
          />
          Other Sports Autobiographies ({filteredBooks.filter(book => book.category === 'other').length})
        </label>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search by book name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="section">
        {categoryFilter.football && hasFootballBooks && (
          <>
            <h2>Football Autobiographies</h2>
            <div className="book-container">
              {footballBooks.slice(indexOfFirstBook, indexOfLastBook).map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        )}
        {categoryFilter.otherSports && hasOtherSportsBooks && (
          <>
            <h2>Other Sports Autobiographies</h2>
            <div className="book-container">
              {otherSportsBooks.slice(indexOfFirstBook, indexOfLastBook).map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
        >
          Previous
        </button>
        <span>Page {totalPages === 0 ? 0 : currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>


    </div>
  );
};

export default BooksCatalog;
