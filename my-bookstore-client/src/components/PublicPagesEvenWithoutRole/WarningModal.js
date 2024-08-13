import React from 'react';
import Modal from 'react-modal';
import styles from './WarningModal.module.css';

const WarningModal = ({ isOpen, onRequestClose, onSignup, onDiscover }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      contentLabel="Warning Modal" 
      className={styles.modal} 
      overlayClassName={styles.overlay}
    >
      <h2 className={styles.title}>Important Notice</h2>
      <p className={styles.message}>
        To proceed with your purchase, please sign up. This will help us provide a better experience and keep you updated with our latest offers.
      </p>
      <div className={styles.modalButtons}>
        <button className={styles.signupButton} onClick={onSignup}>Sign Up Now</button>
        <button className={styles.discoverButton} onClick={onDiscover}>Continue Without Signing Up</button>
      </div>
    </Modal>
  );
};

export default WarningModal;
