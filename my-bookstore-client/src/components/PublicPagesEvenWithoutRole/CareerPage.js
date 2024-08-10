import React, { useState } from 'react'
import styles from './CareerPage.module.css'

const CareerPage = () => {
	const [searchTerm, setSearchTerm] = useState('')

	const jobs = {
		experienced: [
			{
				title: 'Frontend Developer',
				description: 'Create user-friendly and visually appealing interfaces for our e-commerce platform. Proficiency in React, JavaScript, and CSS is required.',
				type: 'Experienced',
			},
			{
				title: 'Backend Developer',
				description: 'Develop and maintain server-side logic. Experience with Spring Boot, Java, and RESTful APIs is essential.',
				type: 'Experienced',
			},
			{
				title: 'UI/UX Designer',
				description: 'Enhance user experience with intuitive and engaging designs. Experience with design tools and a strong portfolio required.',
				type: 'Experienced',
			},
			{
				title: 'Marketing Specialist',
				description: 'Promote our platform through marketing strategies, social media campaigns, and market analysis. Strong communication skills needed.',
				type: 'Experienced',
			},
			{
				title: 'Senior Software Engineer',
				description: 'Lead and mentor a team of developers. Extensive experience in software development, project management, and team leadership required.',
				type: 'Senior',
			},
		],
		entry: [
			{
				title: 'Junior Frontend Developer',
				description: 'Assist in creating and maintaining user interfaces. Basic knowledge of React, JavaScript, and CSS is sufficient.',
				type: 'Entry Level',
			},
			{
				title: 'Junior Backend Developer',
				description: 'Support backend development tasks. Familiarity with Spring Boot, Java, and RESTful APIs is helpful.',
				type: 'Entry Level',
			},
		],
		intern: [
			{
				title: 'Software Engineering Intern',
				description: 'Gain hands-on experience in software development. Must be pursuing a BSc in Software Engineering.',
				type: 'Intern',
			},
			{
				title: 'UI/UX Design Intern',
				description: 'Assist in designing user interfaces and user experiences. Must be pursuing a BSc in Software Engineering.',
				type: 'Intern',
			},
		],
	}

	const filteredJobs = Object.values(jobs)
		.flat()
		.filter((job) => job.title.toLowerCase().includes(searchTerm.toLowerCase()))

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Join Our Team</h1>
			<p className={styles.description}>
				At InalaBook, we are dedicated to revolutionizing the way people discover and enjoy books. We are a global e-commerce platform committed to providing an exceptional shopping experience for
				book lovers everywhere. Join us in our mission to make books accessible to everyone and be a part of our dynamic team.
			</p>

			<input type="text" placeholder="Search for jobs..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

			<div className={styles.jobs}>
				{Object.entries(jobs).map(([category, jobList]) => (
					<div key={category} className={styles.jobCategory}>
						<h2 className={styles.categoryTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
						{jobList.length > 0 ? (
							jobList.map((job, index) => (
								<div key={index} className={styles.job}>
									<h3 className={styles.jobTitle}>{job.title}</h3>
									<p className={styles.jobDescription}>{job.description}</p>
									<button className={styles.applyButton}>Apply Now</button>
								</div>
							))
						) : (
							<p>No jobs available in this category.</p>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

export default CareerPage
