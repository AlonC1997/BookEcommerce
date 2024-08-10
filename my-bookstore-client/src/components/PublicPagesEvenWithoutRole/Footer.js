import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const Footer = ({ userRole }) => {
	const showJoinUs = userRole !== 'USER' && userRole !== 'ADMIN' && userRole !== 'MAIN_ADMIN'

	return (
		<footer className={styles.footer}>
			<div className={styles.footerContent}>
				<div className={styles.logoContainer}>
					<img src={`${process.env.PUBLIC_URL}/Images/BrandLogo.png`} alt="Brand Logo" className={styles.logo} />
				</div>
				<div className={styles.footerDetails}>
					<p>
						<strong>Location:</strong> 123 Book St, Booktown
					</p>
					<p>
						<strong>Phone:</strong> (123) 456-7890
					</p>
					<p>
						<strong>Careers:</strong> Join our team!{' '}
						<Link to="/careers" className={styles.link}>
							Learn More
						</Link>
					</p>
				</div>
				{showJoinUs && (
					<div className={styles.footerAdvertisement}>
						<p>
							Want to buy?{' '}
							<Link to="/signup" className={styles.joinUsButton}>
								Join us
							</Link>{' '}
							now and get 5% off your first purchase!
						</p>
					</div>
				)}
			</div>
		</footer>
	)
}

export default Footer
