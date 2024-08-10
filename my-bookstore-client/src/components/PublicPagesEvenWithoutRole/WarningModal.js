import React from 'react'
import Modal from 'react-modal'
import styles from './WarningModal.module.css'

const WarningModal = ({ isOpen, onRequestClose, onSignup, onDiscover }) => {
	return (
		<Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Warning Modal" className={styles.modal} overlayClassName={styles.overlay}>
			<h2>Attention!</h2>
			<p>To purchase, you must sign up.</p>
			<div className={styles.modalButtons}>
				<button onClick={onSignup}>Sign Up now</button>
				<button onClick={onDiscover}>Continue without signup</button>
			</div>
		</Modal>
	)
}

export default WarningModal
