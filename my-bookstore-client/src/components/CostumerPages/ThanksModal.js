import React from 'react'
import Modal from 'react-modal'
import styles from './ThanksModal.module.css'

const ThanksModal = ({ isOpen, onClose, message, orderDetails, setHasPreviousOrder }) => {
	const handleLogout = () => {
		localStorage.removeItem('token')
		setHasPreviousOrder(true) // Set hasPreviousOrder to true on logout
		window.location.href = '/login' // Redirect to login page
	}

	const handleClose = () => {
		setHasPreviousOrder(true) // Set hasPreviousOrder to true on close
		onClose()
	}

	return (
		<Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Thanks Modal" className={styles.modalContent} overlayClassName={styles.modalOverlay}>
			<h2>{message}</h2>
			{orderDetails && (
				<div className={styles.orderDetails}>
					<h3>Order Details:</h3>
					<p>
						<strong>Order ID:</strong> {orderDetails.orderId || 'N/A'}
					</p>
					<p>
						<strong>Order Date:</strong> {orderDetails.orderDate || 'N/A'}
					</p>
					<p>
						<strong>Total Amount:</strong> ${orderDetails.totalAmount?.toFixed(2) || '0.00'}
					</p>
					<p>
						<strong>Discount:</strong> ${orderDetails.discount?.toFixed(2) || 'N/A'}
					</p>
					<p>
						<strong>Items:</strong>
					</p>

					<ul>
						{orderDetails.items?.length > 0 ? (
							orderDetails.items.map((item, index) => (
								<li key={index}>
									{item.bookName || 'Unknown Book'} - ${item.price?.toFixed(2) || '0.00'} x {item.quantity || 0} = ${item.totalPrice?.toFixed(2) || '0.00'}
								</li>
							))
						) : (
							<li>No items found.</li>
						)}
					</ul>
				</div>
			)}
			<div className={styles.modalActions}>
				<button onClick={handleLogout} className={styles.actionButton}>
					Log Out
				</button>
				<button onClick={handleClose} className={styles.closeButton}>
					Close
				</button>
			</div>
		</Modal>
	)
}

export default ThanksModal
