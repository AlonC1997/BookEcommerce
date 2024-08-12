import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CareerPage.module.css';

const CareerPage = () => {
  const [careers, setCareers] = useState([]);
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [cvFile, setCvFile] = useState(null);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    fetchCareers();
  }, []);

  useEffect(() => {
    filterCareers();
  }, [selectedCategories, selectedLevels, selectedLocations, careers]);

  const fetchCareers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/careers/getAllCareers');
      setCareers(response.data);
      setFilteredCareers(response.data);
    } catch (error) {
      console.error('Error fetching careers:', error);
    }
  };

  const filterCareers = () => {
    let filtered = careers;

    if (searchId) {
      filtered = filtered.filter(career => career.id.toString().includes(searchId));
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(career => selectedCategories.includes(career.category));
    }

    if (selectedLevels.length > 0) {
      filtered = filtered.filter(career => selectedLevels.includes(career.level));
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter(career => selectedLocations.includes(career.location));
    }

    setFilteredCareers(filtered);
  };

  const handleCheckboxChange = (event, type) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    switch (type) {
      case 'category':
        setSelectedCategories(prev =>
          isChecked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      case 'level':
        setSelectedLevels(prev =>
          isChecked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      case 'location':
        setSelectedLocations(prev =>
          isChecked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      default:
        break;
    }
  };

  const handleCvChange = (event) => {
    setCvFile(event.target.files[0]);
  };

  const handleSubmitCv = async (careerId) => {
    if (!cvFile) {
      alert('Please select a CV file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('careerId', careerId);
    formData.append('files', cvFile);

    try {
      await axios.post('http://localhost:8080/careers/uploadFiles', formData);
      alert('CV submitted successfully!');
      setCvFile(null); 
    } catch (error) {
      console.error('Error submitting CV:', error);
      alert('Failed to submit CV.');
    }
  };

  const uniqueCategories = [...new Set(careers.map(career => career.category))];
  const uniqueLevels = [...new Set(careers.map(career => career.level))];
  const uniqueLocations = [...new Set(careers.map(career => career.location))];

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
            setSearchId(e.target.value);
            filterCareers();
          }}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filters}>
        <div className={styles.filterSection}>
          <h3>Filter by Category</h3>
          {uniqueCategories.map(category => (
            <label key={category}>
              <input
                type="checkbox"
                value={category}
                onChange={(e) => handleCheckboxChange(e, 'category')}
              />
              {category}
            </label>
          ))}
        </div>

        <div className={styles.filterSection}>
          <h3>Filter by Level</h3>
          {uniqueLevels.map(level => (
            <label key={level}>
              <input
                type="checkbox"
                value={level}
                onChange={(e) => handleCheckboxChange(e, 'level')}
              />
              {level}
            </label>
          ))}
        </div>

        <div className={styles.filterSection}>
          <h3>Filter by Location</h3>
          {uniqueLocations.map(location => (
            <label key={location}>
              <input
                type="checkbox"
                value={location}
                onChange={(e) => handleCheckboxChange(e, 'location')}
              />
              {location}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.careerList}>
        {filteredCareers.length === 0 ? (
          <p>No careers available</p>
        ) : (
          filteredCareers.map(career => (
            <div key={career.id} className={styles.careerItem}>
              <h2>Job ID: {career.id}</h2>
              <h3>{career.title}</h3>
              <p><strong>Description:</strong> {career.description}</p>
              <p><strong>Category:</strong> {career.category}</p>
              <p><strong>Location:</strong> {career.location}</p>
              <p><strong>Level:</strong> {career.level}</p>
              <p><strong>Requirements:</strong> {career.requirements}</p>
              <p><strong>Date Posted:</strong> {new Date(career.datePosted).toLocaleDateString()}</p>

              <input
                type="file"
                onChange={handleCvChange}
                className={styles.fileInput}
              />
              <button
                onClick={() => handleSubmitCv(career.id)}
                className={styles.submitButton}
              >
                Submit CV
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CareerPage;
