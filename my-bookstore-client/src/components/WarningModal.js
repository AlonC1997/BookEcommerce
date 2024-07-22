import React from 'react';
import Modal from 'react-modal';
import './WarningModal.css';

Modal.setAppElement('#root');

const WarningModal = ({ isOpen, onRequestClose, onSignup, onDiscover }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Warning Modal"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Attention!</h2>
      <p>To purchase, you must sign up.</p>
      <div className="modal-buttons">
        <button onClick={onSignup}>Sign Up now</button>
        <button onClick={onDiscover}>continue without signup</button>
      </div>
    </Modal>
  );
};

export default WarningModal;
