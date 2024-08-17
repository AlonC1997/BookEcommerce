import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './CareersManagement.module.css'

const AdminCareerPage = () => {
	const [careers, setCareers] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [newCareer, setNewCareer] = useState({
		title: '',
		description: '',
		category: '',
		location: '',
		level: '',
		requirements: '',
		datePosted: '',
		available: true,
	})
	const [searchTerm, setSearchTerm] = useState('')
	const [fileList, setFileList] = useState([])
	const [categoryFilter, setCategoryFilter] = useState('')
	const [locationFilter, setLocationFilter] = useState('')
	const [levelFilter, setLevelFilter] = useState('')

	useEffect(() => {
		fetchCareers()
		fetchFileList()
	}, [])

	const fetchCareers = async () => {
		try {
			const response = await axios.get('http://localhost:8080/careers/getAllCareers', {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			})
			setCareers(response.data)
		} catch (error) {
			console.error('Error fetching careers:', error)
		}
	}

	/*
	 * Fetches the list of uploaded files from the backend and sets the fileList state.
	 */
	const fetchFileList = async () => {
		try {
			const response = await axios.get('http://localhost:8080/career-files/getAllFiles', {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			})
			setFileList(response.data)
		} catch (error) {
			console.error('Error fetching file list:', error)
		}
	}

	const handleUpdateCareer = async (career) => {
		try {
			await axios.put(`http://localhost:8080/careers/updateCareer?id=${career.id}`, career, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			})
			alert('Career updated successfully')
			fetchCareers()
		} catch (error) {
			console.error('Error updating career:', error)
		}
	}

	const handleUpdateAll = async () => {
		try {
			await Promise.all(
				careers.map((career) =>
					axios.put(`http://localhost:8080/careers/updateCareer?id=${career.id}`, career, {
						headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
					})
				)
			)
			alert('All careers updated successfully')
			fetchCareers()
		} catch (error) {
			console.error('Error updating careers:', error)
		}
	}

	const handleDeleteCareer = async (careerId) => {
		try {
			await axios.delete(`http://localhost:8080/careers/deleteCareer?id=${careerId}`, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			})
			alert('Career deleted successfully')
			fetchCareers()
		} catch (error) {
			console.error('Error deleting career:', error)
		}
	}

	const handleAddCareer = async () => {
		try {
			await axios.post('http://localhost:8080/careers/createCareer', newCareer, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			})
			alert('Career added successfully')
			fetchCareers()
			setIsModalOpen(false)
			setNewCareer({
				title: '',
				description: '',
				category: '',
				location: '',
				level: '',
				requirements: '',
				datePosted: '',
				available: true,
			})
		} catch (error) {
			console.error('Error adding career:', error)
		}
	}

	const handleDownloadFile = async (fileId) => {
		try {
			const response = await axios.get(`http://localhost:8080/career-files/download?fileId=${fileId}`, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				responseType: 'blob',
			})

			const contentDisposition = response.headers['content-disposition']
			const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'downloaded-file'
			const blob = new Blob([response.data], { type: response.headers['content-type'] })
			const url = URL.createObjectURL(blob)

			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', fileName)
			document.body.appendChild(link)
			link.click()
			link.remove()
			URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Error fetching file:', error)
		}
	}

	const handleDeleteFile = async (fileId) => {
		try {
			await axios.delete(`http://localhost:8080/career-files/deleteFile?fileId=${fileId}`, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			})
			alert('File deleted successfully')
			fetchFileList()
		} catch (error) {
			console.error('Error deleting file:', error)
		}
	}

	const filteredCareers = (careers) =>
		careers.filter(
			(career) =>
				(career.category === categoryFilter || categoryFilter === '') &&
				(career.location === locationFilter || locationFilter === '') &&
				(career.level === levelFilter || levelFilter === '') &&
				(career.id.toString().includes(searchTerm) ||
					career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					career.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
					career.location.toLowerCase().includes(searchTerm.toLowerCase()))
		)

	const handleInputChange = (e, id, field) => {
		const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
		setCareers(careers.map((career) => (career.id === id ? { ...career, [field]: value } : career)))
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>Career Management</div>
			<div className={styles.dropdownContainer}>
				<button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
					Add New Job
				</button>
				<button className={styles.updateAllButton} onClick={handleUpdateAll}>
					{' '}
					Update All{' '}
				</button>
				<input type="text" placeholder="Search by ID, Title, Category, or Location" className={styles.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
				<select className={styles.dropdown} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
					<option value="">All Categories</option>
					<option value="Software">Software</option>
					<option value="Hardware">Hardware</option>
					<option value="HR">HR</option>
					<option value="Finance">Finance</option>
					<option value="Sales">Sales</option>
					<option value="Marketing">Marketing</option>
				</select>
				<select className={styles.dropdown} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
					<option value="">All Locations</option>
					<option value="Israel">Israel</option>
					<option value="USA">USA</option>
					<option value="Hybrid">Hybrid (Israel site)</option>
					<option value="Remote">Remote</option>
				</select>
				<select className={styles.dropdown} value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
					<option value="">All Levels</option>
					<option value="Intern">Intern</option>
					<option value="Entry">Entry</option>
					<option value="Junior">Junior</option>
					<option value="Senior">Senior</option>
					<option value="Team Lead">Team Lead</option>
					<option value="Others">Others</option>
				</select>
			</div>

			<div className={styles.tableContainer}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>ID</th>
							<th>Title</th>
							<th>Description</th>
							<th>Category</th>
							<th>Location</th>
							<th>Level</th>
							<th>Requirements</th>
							<th>Date Posted</th>
							<th>Available</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredCareers(careers).map((career) => (
							<tr key={career.id}>
								<td>{career.id}</td>
								<td>
									<textarea value={career.title} onChange={(e) => handleInputChange(e, career.id, 'title')} />
								</td>
								<td>
									<textarea value={career.description} onChange={(e) => handleInputChange(e, career.id, 'description')} />
								</td>
								<td>
									<textarea value={career.category} onChange={(e) => handleInputChange(e, career.id, 'category')} />
								</td>
								<td>
									<textarea value={career.location} onChange={(e) => handleInputChange(e, career.id, 'location')} />
								</td>
								<td>
									<textarea value={career.level} onChange={(e) => handleInputChange(e, career.id, 'level')} />
								</td>
								<td>
									<textarea value={career.requirements} onChange={(e) => handleInputChange(e, career.id, 'requirements')} />
								</td>
								<td>
									<input type="date" value={career.datePosted} onChange={(e) => handleInputChange(e, career.id, 'datePosted')} />
								</td>
								<td>
									<input type="checkbox" checked={career.available} onChange={(e) => handleInputChange(e, career.id, 'available')} />
								</td>
								<td>
									<button onClick={() => handleUpdateCareer(career)} className={styles.updateButton}>
										Update
									</button>
									<button onClick={() => handleDeleteCareer(career.id)} className={styles.deleteButton}>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{isModalOpen && (
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<h2>Add New Job</h2>
						<label>
							Title:
							<input type="text" value={newCareer.title} onChange={(e) => setNewCareer({ ...newCareer, title: e.target.value })} />
						</label>
						<label>
							Description:
							<textarea value={newCareer.description} onChange={(e) => setNewCareer({ ...newCareer, description: e.target.value })} />
						</label>
						<label>
							Category:
							<input type="text" value={newCareer.category} onChange={(e) => setNewCareer({ ...newCareer, category: e.target.value })} />
						</label>
						<label>
							Location:
							<input type="text" value={newCareer.location} onChange={(e) => setNewCareer({ ...newCareer, location: e.target.value })} />
						</label>
						<label>
							Level:
							<input type="text" value={newCareer.level} onChange={(e) => setNewCareer({ ...newCareer, level: e.target.value })} />
						</label>
						<label>
							Requirements:
							<textarea value={newCareer.requirements} onChange={(e) => setNewCareer({ ...newCareer, requirements: e.target.value })} />
						</label>
						<label>
							Date Posted:
							<input type="date" value={newCareer.datePosted} onChange={(e) => setNewCareer({ ...newCareer, datePosted: e.target.value })} />
						</label>
						<div className={styles.buttonContainer}>
							<button className={styles.addButton} onClick={handleAddCareer}>
								Add Job
							</button>
							<button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
			<div className={styles.fileListContainer}>
				<div className={styles.fileheader}>CV Management</div>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>ID</th>
							<th>File Name</th>
							<th>Upload Date</th>
							<th>Career ID</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{fileList.map((file) => (
							<tr key={file.id}>
								<td>{file.id}</td>
								<td>{file.fileName}</td>
								<td>{file.uploadDate}</td>
								<td>{file.careerId}</td>
								<td>
									<button className={styles.downloadButton} onClick={() => handleDownloadFile(file.id)}>
										Download
									</button>
									<button className={styles.deleteButton} onClick={() => handleDeleteFile(file.id)}>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default AdminCareerPage
