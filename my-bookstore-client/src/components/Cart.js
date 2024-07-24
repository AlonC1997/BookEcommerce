import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Cart.module.css';

const Cart = ({ cartVisible, setCartVisible, onCartUpdate }) => {
  const [cartItems, setCartItems] = useState([]);
  const [stockQuantities, setStockQuantities] = useState({});

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const cartResponse = await axios.get('http://localhost:8080/carts/getCartBooks', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const bookDetailsRequests = cartResponse.data.map(item =>
          axios.get(`http://localhost:8080/books/getBook?bookId=${item.bookId}`)
        );
        const booksResponse = await Promise.all(bookDetailsRequests);
        const books = booksResponse.map(res => res.data);

        const cartItemsWithDetails = cartResponse.data.map(item => {
          const book = books.find(b => b.id === item.bookId);
          return { ...item, img_link: book.img_link };
        });

        setCartItems(cartItemsWithDetails);

        const stockRequests = cartResponse.data.map(item =>
          axios.get(`http://localhost:8080/books/getStockQuantity?bookId=${item.bookId}`)
        );
        const stockResponses = await Promise.all(stockRequests);
        const stockData = stockResponses.reduce((acc, res, index) => {
          acc[cartResponse.data[index].bookId] = res.data;
          return acc;
        }, {});
        setStockQuantities(stockData);

      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartItems([]);
        setStockQuantities({});
      }
    };

    if (cartVisible) {
      fetchCartItems();
    }
  }, [cartVisible]);

  const refreshCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/carts/getCartBooks', {
        headers: { Authorization: `Bearer ${token}` },
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

      setCartItems(cartItemsWithDetails);

      const stockRequests = response.data.map(item =>
        axios.get(`http://localhost:8080/books/getStockQuantity?bookId=${item.bookId}`)
      );
      const stockResponses = await Promise.all(stockRequests);
      const stockData = stockResponses.reduce((acc, res, index) => {
        acc[response.data[index].bookId] = res.data;
        return acc;
      }, {});
      setStockQuantities(stockData);

      if (onCartUpdate) {
        onCartUpdate();
      }

    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  };

  const handleAddOne = async (bookId) => {
    try {
      const stockQuantity = stockQuantities[bookId] || 0;
      if (stockQuantity > 0) {
        const token = localStorage.getItem('token');
        await axios.post(`http://localhost:8080/carts/addOneBook?bookId=${bookId}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await refreshCart();
      }
    } catch (error) {
      console.error('Error adding book to cart:', error);
    }
  };

  const handleRemoveOne = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/carts/removeBook?bookId=${bookId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await refreshCart();
    } catch (error) {
      console.error('Error removing book from cart:', error);
    }
  };

  const handleSubmitCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/carts/submitCart', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems([]);
      setCartVisible(false);
      if (onCartUpdate) {
        onCartUpdate();
      }
    } catch (error) {
      console.error('Error submitting cart:', error);
    }
  };

  return (
    <>
      <button className={styles.cartToggle} onClick={() => setCartVisible(!cartVisible)}>
        🛒
      </button>
      <div className={`${styles.cart} ${cartVisible ? styles.visible : styles.hidden}`}>
        <button className={styles.closeCart} onClick={() => setCartVisible(false)}>Close</button>
        <h2 className={styles.header}>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className={styles.list}>
            {cartItems.map(item => (
              <li key={item.bookId} className={styles.listItem}>
                <img 
                  src={`${process.env.PUBLIC_URL}${item.img_link}`} 
                  alt={`Book ${item.bookId}`} 
                  className={styles.img}
                />
                <span className={styles.info}>Book ID: {item.bookId}</span>
                <span className={styles.info}>Quantity: {item.quantity}</span>
                <button className={`${styles.button} ${styles.remove}`} onClick={() => handleRemoveOne(item.bookId)}>-</button>
                <button
                  className={styles.button}
                  onClick={() => handleAddOne(item.bookId)}
                  disabled={(stockQuantities[item.bookId] || 0) <= 0}
                >
                  +
                </button>
              </li>
            ))}
          </ul>
        )}
        <button className={styles.submitButton} onClick={handleSubmitCart}>Submit Cart</button>
      </div>
    </>
  );
};

export default Cart;
