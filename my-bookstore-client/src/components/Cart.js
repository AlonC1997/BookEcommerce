import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';

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
        onCartUpdate(); // Notify Home component to refresh
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

        refreshCart();
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

      refreshCart();
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
        onCartUpdate(); // Notify Home component to refresh
      }
    } catch (error) {
      console.error('Error submitting cart:', error);
    }
  };

  return (
    <div className={`cart ${cartVisible ? 'visible' : 'hidden'}`}>
      <button className="close-cart" onClick={() => setCartVisible(false)}>Close</button>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.bookId}>
              <img 
                src={`${process.env.PUBLIC_URL}${item.img_link}`} 
                alt={`Book ${item.bookId}`} 
              />
              <span>Book ID: {item.bookId}</span>
              <span>Quantity: {item.quantity}</span>
              <button onClick={() => handleRemoveOne(item.bookId)}>-</button>
              <button
                onClick={() => handleAddOne(item.bookId)}
                disabled={(stockQuantities[item.bookId] || 0) <= 0}
              >
                +
              </button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleSubmitCart}>Submit Cart</button>
    </div>
  );
};

export default Cart;
