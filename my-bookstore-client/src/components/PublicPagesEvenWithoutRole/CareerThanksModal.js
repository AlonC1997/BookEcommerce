import React from 'react';
import styles from './CareerThanksModal.module.css';

const CareerThanksModal = ({ show, onClose, details }) => {
  if (!show) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>&times;</span>
        <h2>Thank You!</h2>
        <p>Your CV has been submitted successfully.</p>
        <p><strong>Details:</strong></p>
        <p><strong>Career ID:</strong> {details.careerId}</p>
        <p><strong>File Name:</strong> {details.fileName}</p>
      </div>
    </div>
  );
};

export default CareerThanksModal;
