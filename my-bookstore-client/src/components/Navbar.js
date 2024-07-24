import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import WarningModal from './WarningModal';

const Navbar = ({ isLoggedIn, isAdmin, isMainAdmin, onLogout }) => {
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
      <Link to="/order-management" className={location.pathname === '/order-management' ? styles.active : ''}>
        Orders Management
      </Link>
      <Link to="/stock-management" className={location.pathname === '/stock-management' ? styles.active : ''}>
        Stock Management
      </Link>
      {isMainAdmin && (
        <Link to="/users-and-admins-management" className={location.pathname === '/users-and-admins-management' ? styles.active : ''}>
          Users and Admins Management
        </Link>
      )}
    </>
  );

  const renderUserLinks = () => (
    <>
      <Link to="/home" className={location.pathname === '/home' ? styles.active : ''}>
        Home
      </Link>
      {/* Add other user-specific links here */}
    </>
  );

  return (
    <>
      <nav className={styles.navbar}>
        <Link to="/home" className={styles.brand}>
          InalaBook
        </Link>
        <div className={styles.navLinks}>
          {isLoggedIn ? (
            <>
              {isAdmin || isMainAdmin ? renderAdminLinks() : renderUserLinks()}
              <button onClick={handleLogout} className={styles.button}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={location.pathname === '/login' ? styles.active : ''}>
                Login
              </Link>
              <Link to="/signup" className={location.pathname === '/signup' ? styles.active : ''}>
                Sign Up 
              </Link>
              {location.pathname !== '/login' && location.pathname !== '/book-catalog' && (
                <button onClick={handleContinueWithoutLogin} className={styles.continueWithoutLogin}>
                  Collection
                </button>
              )}
            </>
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
