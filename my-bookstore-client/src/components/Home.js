import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCardUser from './BookCardUser';
import Cart from './Cart';
import './Home.css';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/books/getAllBooks');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleCartUpdate = async () => {
    try {
      const response = await axios.get('http://localhost:8080/books/getAllBooks');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <div className="home-container">
      <button className="cart-toggle" onClick={() => setCartVisible(!cartVisible)}>
        🛒
      </button>
      <div className="books-list">
        {books.map((book) => (
          <BookCardUser
            key={book.id}
            book={book}
            onCartUpdate={handleCartUpdate} // Pass the function to BookCardUser
          />
        ))}
      </div>
      {cartVisible && (
        <Cart
          cartVisible={cartVisible}
          setCartVisible={setCartVisible}
          onCartUpdate={handleCartUpdate} // Pass the function to Cart
        />
      )}
    </div>
  );
};

export default Home;
