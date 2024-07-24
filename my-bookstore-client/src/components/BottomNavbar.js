import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BottomNavbar.module.css';

const BottomNavbar = () => {
  return (
    <div className={styles.bottomNavbar}>
      <div className={styles.bottomNavbarContent}>
        <div className={styles.bottomNavbarDetails}>
          <p><strong>Location:</strong> 123 Book St, Booktown</p>
          <p><strong>Phone:</strong> (123) 456-7890</p>
          <p><strong>Careers:</strong> Join our team! <Link to="/careers" className={styles.link}>Learn More</Link></p>
        </div>
        <div className={styles.bottomNavbarAdvertisement}>
          <p>Want to buy? <Link to="/signup" className={styles.joinUsButton}>Join us</Link> now and get 5% off your first purchase!</p>
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;
