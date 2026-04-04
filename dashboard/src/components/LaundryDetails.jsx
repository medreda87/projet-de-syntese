import React, { useState } from 'react';
import './LaundryDetails.css';
import { FaCamera } from "react-icons/fa";
import { IoBusiness } from "react-icons/io5";
import API from '../api/axiosApi';
import { FaCheckCircle } from "react-icons/fa";
import { CiSaveDown2 } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoTimeSharp } from "react-icons/io5";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { MdOutlineConnectWithoutContact } from "react-icons/md";

const LaundryDetails = ({ setCurrentPage }) => {
  // State pour les données du formulaire


  // State pour les images
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPreview, setCoverPreview] = useState('https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=1200&h=400&fit=crop');
  const [profilePreview, setProfilePreview] = useState('https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=150&h=150&fit=crop');
    const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone:'',
    email: '',
    description: '',
    provider_id: 3,
    openingHours: ''
  });
  // State pour la galerie
  // State pour les feedbacks
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Gestionnaires d'événements
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
        setCoverPhoto(file);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
        setProfilePhoto(file);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  
const handleSave = async () => {
  if (!formData.name || !formData.address || !formData.phone) {
    alert("Please fill in Name, Address, and Phone");
    return;
  }

  try {
    setIsLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email || '');
    data.append('description', formData.description || '');
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    data.append('openingHours', formData.openingHours || '');
    data.append('provider_id', formData.provider_id);

    if (profilePhoto) data.append('logo', profilePhoto);
    if (coverPhoto) data.append('bigLogo', coverPhoto);

    const response = await API.post('/laundries', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 5000);
  } catch (error) {
    console.error('Error saving laundry details:', error.response?.data || error.message);
    if (error.response?.status === 422) {
      alert('Validation error: Please check your input fields.');
    } else {
      alert('An error occurred while saving. Please try again.');
    }
  } finally {
    setIsLoading(false);
  }
};



  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard all changes?')) {
      setFormData({
        coverPhoto: null,
        profilePhoto: null,
        name: '',
        email: '',
        description: '',
        phone:'',
        address: '',
        openingHours: ''
      });
    }
  };

  return (
    <div className="laundry-details-app">
      {/* Header avec navigation - Dashboard intégré */}
      <header className="app-header">
        <div className="header-nav">
          {/* Navigation tabs simulée pour le dashboard */}
         
        </div>
        
        <div className="header-actions">
          <button className="action-icon" title="Notifications">
            <span>🔔</span>
          </button>
          <button className="action-icon" title="Settings">
            <span>⚙️</span>
          </button>
          <div className="user-menu">
            <div className="user-avatar">
              <span>👨</span>
            </div>
            <span className="user-name">Alex Morgan</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div>

          {/* Banner Section - Laundry Info commence directement ici */}
          <div className="banner-card">
            <div className="cover-container">
              <div 
                className="cover-image"
                style={{ backgroundImage: `url(${coverPreview})` }}
              >
                <label className="cover-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="file-input"
                  />
                  <div className="upload-overlay">
                    <span className="upload-icon"><FaCamera/></span>
                    <span className="upload-text">Change Cover Photo</span>
                  </div>
                </label>
              </div>
              
              <div className="profile-container">
                <div 
                  className="profile-image"
                  style={{ backgroundImage: `url(${profilePreview})` }}
                >
                  <label className="profile-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileUpload}
                      className="file-input"
                    />
                    <div className="profile-overlay">
                      <span className="edit-icon"><FaCamera/></span>
                    </div>
                  </label>
                </div>
<div className="profile-info">
  <h2 className="shop-name">{formData.name}</h2>

  <div className="shop-meta">
    <div className="rating">
      <span className="star">★</span>
      <span className="rating-value">4.9</span>
      <span className="reviews">(328 reviews)</span>
    </div>

    <span className="divider"></span>

    <div className="verified-badge">
      ✔ Verified Business
    </div>
  </div>
</div>
              </div>
            </div>
          </div>

          {/* General Information Tab */}
          
            <div className="form-card">
              <div className="form-section-title">
                <span className="title-icon"><IoBusiness/></span>
                <h2>Business Information</h2>
              </div>
              
              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">Laundry Business Name</label>
                  <input
                    type="text"
                    name="name"
                    className="field-input"
                    placeholder="Enter business name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                
                <div className="form-field">
                  <label className="field-label">Business Email</label>
                  <input
                    type="email"
                    name="email"
                    className="field-input"
                    placeholder="laundry@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-field full-width">
                  <label className="field-label">Business Description</label>
                  <textarea
                    name="description"
                    className="field-textarea"
                    placeholder="Describe your laundry business..."
                    rows="5"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>
          

          {/* Contact Details Tab */}
          
            <div className="form-card">
              <div className="form-section-title">
                <span className="title-icon"><MdOutlineConnectWithoutContact/></span>
                <h2>Contact Information</h2>
              </div>
              
              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">Phone Number</label>
                  <div className="input-with-icon">
                    <span className="input-leading-icon"><BsTelephone/></span>
                    <input
                      type="tel"
                      name="phone"
                      className="field-input-icon"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              
                
                <div className="form-field full-width">
                  <label className="field-label">Business Address</label>
                  <div className="input-with-icon">
                    <span className="input-leading-icon"><FaMapMarkerAlt/></span>
                    <input
                      type="text"
                      name="address"
                      className="field-input-icon"
                      placeholder="Full business address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          

          {/* Business Hours Tab */}
            <div className="form-card">
              <div className="form-section-title">
                <span className="title-icon"><IoTimeSharp/></span>
                <h2>Operating Hours</h2>
              </div>
              
              <div className="form-grid">
                <div className="form-field full-width">
                  <label className="field-label">Opening Hours</label>
                  <div className="input-with-icon">
                    <span className="input-leading-icon"><IoTimeSharp/></span>
                    <input
                      type="text"
                      name="openingHours"
                      className="field-input-icon"
                      placeholder="e.g., Mon-Fri: 8am-8pm, Sat: 9am-6pm, Sun: Closed"
                      value={formData.openingHours}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="field-hint">Specify your business hours for each day</p>
                </div>
              </div>
              
              <div className="info-box">
                <span className="info-icon"><BsFillInfoCircleFill/></span>
                <div className="info-content">
                  <strong>Holiday Schedule</strong>
                  <p>Set special hours for holidays and special occasions</p>
                  <button className="link-button">Configure Holiday Hours →</button>
                </div>
              </div>
            </div>
        
         
          {/* Action Buttons */}
          <div className="action-bar">
            <button className="btn-secondary" onClick={handleDiscard}>
              Discard Changes
            </button>
            <button className="btn-primary" onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  <span><CiSaveDown2/></span>
                  Save All Changes
                </>
              )}
            </button>
          </div>
          
        </div>
      </main>
        {isSaved && (
            <div className="success-toast top-toast">
              <span className="success-icon"><FaCheckCircle/></span>
              <div>
                <strong>Success!</strong>
                <p>Your laundry information has been saved successfully.</p>
              </div>
              <button className="toast-close" onClick={() => setIsSaved(false)}>✕</button>
            </div>
          )}
    </div>
  );
};

export default LaundryDetails;