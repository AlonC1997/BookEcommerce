import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CareersManagement.module.css';

const AdminCareerPage = () => {
    const [careers, setCareers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCareer, setNewCareer] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        level: '',
        requirements: '',
        datePosted: '',
        available: true,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        fetchCareers();
        fetchFileList();
    }, []);

    const fetchCareers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/careers/getAllCareers', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setCareers(response.data);
        } catch (error) {
            console.error('Error fetching careers:', error);
        }
    };

    const fetchFileList = async () => {
        try {
            const response = await axios.get('http://localhost:8080/career-files/getAllFiles', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setFileList(response.data);
        } catch (error) {
            console.error('Error fetching file list:', error);
        }
    };

    const handleUpdateCareer = async (career) => {
        try {
            await axios.put(`http://localhost:8080/careers/updateCareer?id=${career.id}`, career, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert('Career updated successfully');
            fetchCareers();
        } catch (error) {
            console.error('Error updating career:', error);
        }
    };

    const handleUpdateAll = async () => {
        try {
            await Promise.all(careers.map(career => 
                axios.put(`http://localhost:8080/careers/updateCareer?id=${career.id}`, career, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
            ));
            alert('All careers updated successfully');
            fetchCareers();
        } catch (error) {
            console.error('Error updating careers:', error);
        }
    };

    const handleDeleteCareer = async (careerId) => {
        try {
            await axios.delete(`http://localhost:8080/careers/deleteCareer?id=${careerId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert('Career deleted successfully');
            fetchCareers();
        } catch (error) {
            console.error('Error deleting career:', error);
        }
    };

    const handleAddCareer = async () => {
        try {
            await axios.post('http://localhost:8080/careers/createCareer', newCareer, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert('Career added successfully');
            fetchCareers();
            setIsModalOpen(false);
            setNewCareer({
                title: '',
                description: '',
                category: '',
                location: '',
                level: '',
                requirements: '',
                datePosted: '',
                available: true,
            });
        } catch (error) {
            console.error('Error adding career:', error);
        }
    };

    const handleViewFile = async (fileId) => {
        try {
            const response = await axios.get(`http://localhost:8080/career-files/download?fileId=${fileId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                responseType: 'blob',
            });

            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'downloaded-file';
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); 
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url); 
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    };

    const handleDeleteFile = async (fileId) => {
        try {
            await axios.delete(`http://localhost:8080/career-files/deleteFile?fileId=${fileId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert('File deleted successfully');
            fetchFileList();
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const filteredCareers = (careers) =>
        careers.filter(
            (career) =>
                career.id.toString().includes(searchTerm) ||
                career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                career.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                career.location.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleInputChange = (e, id, field) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setCareers(careers.map(career => 
            career.id === id ? { ...career, [field]: value } : career
        ));
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Career Management</h1>
            </header>

            <div className={styles.leftPanel}>
                <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                    Add New job
                </button>

                <input
                    type="text"
                    className={styles.search}
                    placeholder="Search by ID, title, category, or location"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Add New Career</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newCareer.title}
                            onChange={(e) => setNewCareer({ ...newCareer, title: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newCareer.description}
                            onChange={(e) => setNewCareer({ ...newCareer, description: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={newCareer.category}
                            onChange={(e) => setNewCareer({ ...newCareer, category: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={newCareer.location}
                            onChange={(e) => setNewCareer({ ...newCareer, location: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Level"
                            value={newCareer.level}
                            onChange={(e) => setNewCareer({ ...newCareer, level: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Requirements"
                            value={newCareer.requirements}
                            onChange={(e) => setNewCareer({ ...newCareer, requirements: e.target.value })}
                        />
                        <input
                            type="date"
                            placeholder="Date Posted"
                            value={newCareer.datePosted}
                            onChange={(e) => setNewCareer({ ...newCareer, datePosted: e.target.value })}
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={newCareer.available}
                                onChange={(e) => setNewCareer({ ...newCareer, available: e.target.checked })}
                            />
                            Available
                        </label>
                        <button onClick={handleAddCareer}>Add Career</button>
                        <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

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
                                    <input
                                        type="text"
                                        value={career.title}
                                        onChange={(e) => handleInputChange(e, career.id, 'title')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={career.description}
                                        onChange={(e) => handleInputChange(e, career.id, 'description')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={career.category}
                                        onChange={(e) => handleInputChange(e, career.id, 'category')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={career.location}
                                        onChange={(e) => handleInputChange(e, career.id, 'location')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={career.level}
                                        onChange={(e) => handleInputChange(e, career.id, 'level')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={career.requirements}
                                        onChange={(e) => handleInputChange(e, career.id, 'requirements')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={career.datePosted}
                                        onChange={(e) => handleInputChange(e, career.id, 'datePosted')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={career.available}
                                        onChange={(e) => handleInputChange(e, career.id, 'available')}
                                    />
                                </td>
                                <td>
                                    <button onClick={() => handleUpdateCareer(career)} className={styles.updateButton}>Update</button>
                                    <button onClick={() => handleDeleteCareer(career.id)} className={styles.deleteButton}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={handleUpdateAll} className={styles.updateAllButton}>Update All</button>
            </div>

            <div className={styles.fileListContainer}>
                <h2>Files</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>File Name</th>
                            <th>Upload Date</th>
                            <th>Job ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fileList.map((file) => (
                            <tr key={file.id}>
                                <td>{file.id}</td>
                                <td>{file.fileName}</td>
                                <td>{new Date(file.uploadDate).toLocaleDateString()}</td>
                                <td>{file.careerId}</td>
                                <td>
                                    <button onClick={() => handleDeleteFile(file.id)} className={styles.deleteButton}>Delete</button>
                                    <button onClick={() => handleViewFile(file.id)} className={styles.downloadButton}>Download</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCareerPage;
