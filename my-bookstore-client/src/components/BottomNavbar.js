// src/components/BottomNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './BottomNavbar.css';

const BottomNavbar = () => {
  return (
    <div className="bottom-navbar">
      <div className="bottom-navbar-content">
        <div className="bottom-navbar-details">
          <p><strong>Location:</strong> 123 Book St, Booktown</p>
          <p><strong>Phone:</strong> (123) 456-7890</p>
          <p><strong>Careers:</strong> Join our team! <Link to="/careers">Learn More</Link></p>
        </div>
        <div className="bottom-navbar-advertisement">
          <p>Want to buy? <Link to="/signup" className="join-us-button">Join us</Link> now and get 5% off for first purchase!</p>
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;
