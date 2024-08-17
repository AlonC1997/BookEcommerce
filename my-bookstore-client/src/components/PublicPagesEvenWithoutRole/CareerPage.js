import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './CareerPage.module.css'
import CareerThanksModal from './CareerThanksModal'

const CareerPage = () => {
	const [careers, setCareers] = useState([])
	const [filteredCareers, setFilteredCareers] = useState([])
	const [selectedCategories, setSelectedCategories] = useState([])
	const [selectedLevels, setSelectedLevels] = useState([])
	const [selectedLocations, setSelectedLocations] = useState([])
	const [cvFile, setCvFile] = useState(null)
	const [searchId, setSearchId] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [jobsPerPage] = useState(10)
	const [showModal, setShowModal] = useState(false)
	const [modalDetails, setModalDetails] = useState({ careerId: '', fileName: '' })

	useEffect(() => {
		fetchCareers()
	}, [])

	useEffect(() => {
		filterCareers()
	}, [selectedCategories, selectedLevels, selectedLocations, careers, searchId])

	const fetchCareers = async () => {
		try {
			const response = await axios.get('http://localhost:8080/careers/getAllCareers')
			setCareers(response.data)
			setFilteredCareers(response.data)
		} catch (error) {
			console.error('Error fetching careers:', error)
		}
	}

	const filterCareers = () => {
		let filtered = careers

		if (searchId) {
			filtered = filtered.filter((career) => career.id.toString().includes(searchId))
		}

		if (selectedCategories.length > 0) {
			filtered = filtered.filter((career) => selectedCategories.includes(career.category))
		}

		if (selectedLevels.length > 0) {
			filtered = filtered.filter((career) => selectedLevels.includes(career.level))
		}

		if (selectedLocations.length > 0) {
			filtered = filtered.filter((career) => selectedLocations.includes(career.location))
		}

		setFilteredCareers(filtered)
	}

	const handleCheckboxChange = (event, type) => {
		const value = event.target.value
		const isChecked = event.target.checked

		switch (type) {
			case 'category':
				setSelectedCategories((prev) => (isChecked ? [...prev, value] : prev.filter((item) => item !== value)))
				break
			case 'level':
				setSelectedLevels((prev) => (isChecked ? [...prev, value] : prev.filter((item) => item !== value)))
				break
			case 'location':
				setSelectedLocations((prev) => (isChecked ? [...prev, value] : prev.filter((item) => item !== value)))
				break
			default:
				break
		}
	}

	/*
	 * Handles the change event of the file input element.
	 * @param {Object} event - The event object.
	 * @returns {void}
	 * @example
	 */

	const handleCvChange = (event) => {
		setCvFile(event.target.files[0])
	}

	const handleSubmitCv = async (careerId) => {
		if (!cvFile) {
			alert('Please select a CV file to upload.')
			return
		}

		const formData = new FormData()
		formData.append('file', cvFile)
		formData.append('careerId', careerId)

		try {
			await axios.post('http://localhost:8080/career-files/uploadFile', formData)
			setModalDetails({ careerId, fileName: cvFile.name })
			setShowModal(true)
			setCvFile(null)
		} catch (error) {
			console.error('Error submitting CV:', error)
			alert('Failed to submit CV.')
		}
	}

	const uniqueCategories = [...new Set(careers.map((career) => career.category))]
	const uniqueLevels = [...new Set(careers.map((career) => career.level))]
	const uniqueLocations = [...new Set(careers.map((career) => career.location))]

	const countItems = (items) => {
		const counts = items.reduce((acc, item) => {
			acc[item] = (acc[item] || 0) + 1
			return acc
		}, {})
		return counts
	}

	const categoryCounts = countItems(careers.map((career) => career.category))
	const levelCounts = countItems(careers.map((career) => career.level))
	const locationCounts = countItems(careers.map((career) => career.location))

	const indexOfLastJob = currentPage * jobsPerPage
	const indexOfFirstJob = indexOfLastJob - jobsPerPage
	const currentJobs = filteredCareers.slice(indexOfFirstJob, indexOfLastJob)

	const totalPages = Math.ceil(filteredCareers.length / jobsPerPage)

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1>Career Opportunities</h1>
			</header>

			<div className={styles.search}>
				<input
					type="text"
					placeholder="Search by Job ID"
					value={searchId}
					onChange={(e) => {
						setSearchId(e.target.value)
						filterCareers()
					}}
					className={styles.searchInput}
				/>
			</div>

			<div className={styles.filters}>
				<div className={styles.filterSection}>
					<h3>Filter by Category</h3>
					{uniqueCategories.map((category) => (
						<label key={category}>
							<input type="checkbox" value={category} onChange={(e) => handleCheckboxChange(e, 'category')} />
							{category} ({categoryCounts[category] || 0})
						</label>
					))}
				</div>

				<div className={styles.filterSection}>
					<h3>Filter by Level</h3>
					{uniqueLevels.map((level) => (
						<label key={level}>
							<input type="checkbox" value={level} onChange={(e) => handleCheckboxChange(e, 'level')} />
							{level} ({levelCounts[level] || 0})
						</label>
					))}
				</div>

				<div className={styles.filterSection}>
					<h3>Filter by Location</h3>
					{uniqueLocations.map((location) => (
						<label key={location}>
							<input type="checkbox" value={location} onChange={(e) => handleCheckboxChange(e, 'location')} />
							{location} ({locationCounts[location] || 0})
						</label>
					))}
				</div>
			</div>

			<div className={styles.careerList}>
				{currentJobs.length === 0 ? (
					<p className={styles.noCareers}>No careers available</p>
				) : (
					currentJobs.map((career) => (
						<div key={career.id} className={styles.careerItem}>
							<h2>Job ID: {career.id}</h2>
							<h3>{career.title}</h3>
							<p>
								<strong>Description:</strong> {career.description}
							</p>
							<p>
								<strong>Category:</strong> {career.category}
							</p>
							<p>
								<strong>Location:</strong> {career.location}
							</p>
							<p>
								<strong>Level:</strong> {career.level}
							</p>
							<p>
								<strong>Requirements:</strong> {career.requirements}
							</p>
							<p>
								<strong>Date Posted:</strong> {new Date(career.datePosted).toLocaleDateString()}
							</p>

							<input type="file" onChange={handleCvChange} className={styles.fileInput} />
							<button onClick={() => handleSubmitCv(career.id)} className={styles.submitButton}>
								Submit CV
							</button>
						</div>
					))
				)}
			</div>

			<div className={styles.pagination}>
				<button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
					Prev
				</button>
				{Array.from({ length: totalPages }, (_, index) => (
					<button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={currentPage === index + 1 ? styles.activePage : ''}>
						{index + 1}
					</button>
				))}
				<button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
					Next
				</button>
			</div>

			<CareerThanksModal show={showModal} onClose={() => setShowModal(false)} details={modalDetails} />
		</div>
	)
}

export default CareerPage
