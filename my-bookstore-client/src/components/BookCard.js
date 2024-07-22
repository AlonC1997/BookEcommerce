import React, { useState, useEffect } from 'react';
import './BookCard.css';
import axios from 'axios';

const BookCard = ({ book }) => {
  const [stockQuantity, setStockQuantity] = useState(null);

  useEffect(() => {
    console.log('Book object:', book); // Log the book object to check its properties
    if (book && book.id) {
      const fetchStockQuantity = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/books/getStockQuantity?id=${book.id}`);
          console.log('Stock quantity response:', response); // Log the full response
          setStockQuantity(response.data);
        } catch (error) {
          console.error('Error fetching stock quantity', error);
        }
      };
      

      fetchStockQuantity();
    } else {
      console.error('Invalid book object or id:', book);
    }
  }, [book]);

  const getStockStatus = () => {
    if (stockQuantity === null) {
      return 'Loading...';
    } else if (stockQuantity === 0) {
      return <span className="out-of-stock">OUT OF STOCK</span>;
    } else if (stockQuantity <= 5) {
      return <span className="low-stock">LOW STOCK</span>;
    } else {
      return <span className="high-stock">IN STOCK</span>;
    }
  };

  const imageSrc = `${process.env.PUBLIC_URL}${book.img_link}`;

  return (
    <div className="book-card">
      <div className="book-image">
        <img src={imageSrc} alt={book.name} />
      </div>
      <div className="book-details">
        <h3>{book.name}</h3>
        <p><strong>Author:</strong> {book.author}</p>
        <p>{book.description}</p>
        <h5>Price: {book.price} $</h5>
        <h5>Stock: {getStockStatus()}</h5>
      </div>
    </div>
  );
};

export default BookCard;
