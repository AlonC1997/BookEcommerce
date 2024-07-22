import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import WarningModal from './WarningModal';

const Navbar = ({ isLoggedIn, isAdmin, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleContinueWithoutLogin = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSignup = () => {
    setIsModalOpen(false);
    navigate('/signup');
  };

  const handleDiscover = () => {
    setIsModalOpen(false);
    navigate('/book-catalog');
  };

  const renderAdminLinks = () => (
    <>
      <Link to="/order-management" className={location.pathname === '/order-management' ? 'active' : ''}>
        Orders Management
      </Link>
      <Link to="/stock-management" className={location.pathname === '/stock-management' ? 'active' : ''}>
        Stock Management
      </Link>
    </>
  );

  const renderUserLinks = () => (
    <>
      <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
        Home
      </Link>
      <Link to="/book-catalog" className={location.pathname === '/book-catalog' ? 'active' : ''}>
        Book Catalog
      </Link>
      {/* Add other user-specific links here */}
    </>
  );

  return (
    <>
      <nav className="navbar">
        <Link to="/home" className="brand">
          InalaBook
        </Link>
        <div className="nav-links">
          {isLoggedIn && (
            <>
              {isAdmin ? renderAdminLinks() : renderUserLinks()}
            </>
          )}
          {!isLoggedIn && (
            <>
              <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                Login
              </Link>
              <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>
                Sign Up 
              </Link>
              {location.pathname !== '/login' && location.pathname !== '/book-catalog' && (
                <button onClick={handleContinueWithoutLogin} className="continue-without-login">
                  Collection
                </button>
              )}
            </>
          )}
          {isLoggedIn && (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      </nav>
      <WarningModal 
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        onSignup={handleSignup} 
        onDiscover={handleDiscover} 
      />
    </>
  );
};

export default Navbar;
