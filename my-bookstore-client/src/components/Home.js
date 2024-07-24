import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCardUser from './BookCardUser';
import Cart from './Cart';
import styles from './Home.module.css';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [cartItems, setCartItems] = useState([]);
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

  // Fetch and update cart items
  const handleCartUpdate = async () => {
    try {
      const response = await axios.get('http://localhost:8080/carts/getCartBooks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      const bookDetailsRequests = response.data.map(item =>
        axios.get(`http://localhost:8080/books/getBook?bookId=${item.bookId}`)
      );
      const booksResponse = await Promise.all(bookDetailsRequests);
      const books = booksResponse.map(res => res.data);
  
      const cartItemsWithDetails = response.data.map(item => {
        const book = books.find(b => b.id === item.bookId);
        return { ...item, img_link: book.img_link };
      });
  
      setCartItems(cartItemsWithDetails); // Update cartItems state
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <button className={styles.cartToggle} onClick={() => setCartVisible(!cartVisible)}>
        🛒
      </button>
      <div className={styles.booksList}>
        {books.map((book) => (
          <BookCardUser
            key={book.id}
            book={book}
            onCartUpdate={handleCartUpdate} // Pass down the function to update the cart immediately
          />
        ))}
      </div>
      {cartVisible && (
        <Cart
          cartVisible={cartVisible}
          setCartVisible={setCartVisible}
          cartItems={cartItems}
          onCartUpdate={handleCartUpdate} // Pass down the function to update the cart immediately
        />
      )}
    </div>
  );
};

export default Home;
