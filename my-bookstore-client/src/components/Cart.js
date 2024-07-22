import React, { useEffect, useState } from 'react';
import './Cart.css';
import axios from 'axios';

const Cart = ({ isLoggedIn, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchCart = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:8080/carts/getCart', {
            params: { id: getCartId() },
            headers: { Authorization: `Bearer ${token}` }
          });
          setCartItems(response.data.books);
          setTotalPrice(response.data.totalPrice);
        } catch (error) {
          console.error('Error fetching cart items', error);
        }
      };
      fetchCart();
    }
  }, [isLoggedIn]);

  const getCartId = () => {
    // Logic to get the cart ID of the logged-in user
    // This might involve another API call or reading from local storage
  };

  const updateQuantity = async (bookId, quantity) => {
    try {
      await axios.post('http://localhost:8080/carts/updateQuantity', { bookId, quantity });
      // Update cart items and total price after updating quantity
    } catch (error) {
      console.error('Error updating quantity', error);
    }
  };

  const handleSubmitCart = async () => {
    try {
      await axios.post('http://localhost:8080/carts/submitCart', { cartId: getCartId() });
      // Handle cart submission
    } catch (error) {
      console.error('Error submitting cart', error);
    }
  };

  return (
    isLoggedIn ? (
      <div className="cart-container">
        <button className="close-cart" onClick={onClose}>X</button>
        <h2>Your Cart</h2>
        <ul className="cart-items">
          {cartItems.map(item => (
            <li key={item.id}>
              <span>{item.name}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </li>
          ))}
        </ul>
        <h3>Total: ${totalPrice}</h3>
        <button onClick={handleSubmitCart}>Submit Cart</button>
      </div>
    ) : null
  );
};

export default Cart;
