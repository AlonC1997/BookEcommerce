import React, { useState, useEffect } from 'react';
import styles from './BookCard.module.css'; // Import CSS Module
import axios from 'axios';

const BookCard = ({ book }) => {
  const [stockQuantity, setStockQuantity] = useState(null);

  useEffect(() => {
    console.log('Book object:', book); // Log the book object to check its properties
    if (book && book.id) {
      const fetchStockQuantity = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/books/getStockQuantity?bookId=${book.id}`);
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
      return <span className={styles.outOfStock}>OUT OF STOCK</span>;
    } else if (stockQuantity <= 5) {
      return <span className={styles.lowStock}>LOW STOCK</span>;
    } else {
      return <span className={styles.highStock}>IN STOCK</span>;
    }
  };

  const imageSrc = `${process.env.PUBLIC_URL}${book.img_link}`;

  return (
    <div className={styles.bookCard}>
      <div className={styles.bookImage}>
        <img src={imageSrc} alt={book.name} />
      </div>
      <div className={styles.bookDetails}>
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
