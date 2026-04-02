import React, { useState } from 'react';
import './LaundryDetails.css';

const LaundryDetails = ({ setCurrentPage }) => {
  // State pour les données du formulaire
  const [formData, setFormData] = useState({
    name: 'Blue Horizon Eco Cleaners',
    email: 'contact@bluehorizon.com',
    description: 'Professional eco-friendly laundry service dedicated to providing high-quality cleaning with environmentally safe products. We specialize in delicate fabrics, dry cleaning, and same-day service. Our state-of-the-art equipment ensures your garments receive the best care possible.',
    phone: '+1 (555) 123-4567',
    whatsapp: '+1 (555) 987-6543',
    address: '123 Clean Street, Suite 100, San Francisco, CA 94105',
    openingHours: 'Mon-Sat: 8:00 AM - 8:00 PM, Sun: 10:00 AM - 4:00 PM'
  });

  // State pour les images
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPreview, setCoverPreview] = useState('https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=1200&h=400&fit=crop');
  const [profilePreview, setProfilePreview] = useState('https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=150&h=150&fit=crop');
  
  // State pour la galerie
  const [gallery, setGallery] = useState([
    {
      id: 1,
      title: 'Exterior View',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Interior Counter',
      image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Washing Machines',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Folding Area',
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop'
    }
  ]);

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

  const handleGalleryUpload = () => {
    const newId = gallery.length + 1;
    const newItem = {
      id: newId,
      title: `New Photo ${newId}`,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=400&fit=crop'
    };
    setGallery([...gallery, newItem]);
  };

  const handleGalleryDelete = (id) => {
    setGallery(gallery.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaved(true);
    setIsLoading(false);
    // Auto-hide success message after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard all changes?')) {
      setFormData({
        name: 'Blue Horizon Eco Cleaners',
        email: 'contact@bluehorizon.com',
        description: 'Professional eco-friendly laundry service dedicated to providing high-quality cleaning with environmentally safe products. We specialize in delicate fabrics, dry cleaning, and same-day service. Our state-of-the-art equipment ensures your garments receive the best care possible.',
        phone: '+1 (555) 123-4567',
        whatsapp: '+1 (555) 987-6543',
        address: '123 Clean Street, Suite 100, San Francisco, CA 94105',
        openingHours: 'Mon-Sat: 8:00 AM - 8:00 PM, Sun: 10:00 AM - 4:00 PM'
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
        <div className="content-wrapper">
          {/* Success Toast - Positionné EN HAUT, juste après le header, sans espace entre dashboard et laundry info */}
          {isSaved && (
            <div className="success-toast top-toast">
              <span className="success-icon">✅</span>
              <div>
                <strong>Success!</strong>
                <p>Your laundry information has been saved successfully.</p>
              </div>
              <button className="toast-close" onClick={() => setIsSaved(false)}>✕</button>
            </div>
          )}

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
                    <span className="upload-icon">📸</span>
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
                      <span className="edit-icon">✏️</span>
                    </div>
                  </label>
                </div>
                <div className="profile-info">
                  <h2 className="shop-name">{formData.name}</h2>
                  <p className="shop-status">⭐ 4.9 ★ (328 reviews) • Verified Business</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          {/* <div className="tabs-container">
            <button 
              className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <span>📋</span> General Information
            </button>
            <button 
              className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <span>📞</span> Contact Details
            </button>
            <button 
              className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <span>⏰</span> Business Hours
            </button>
            <button 
              className={`tab-button ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              <span>🖼️</span> Gallery
            </button>
          </div> */}

          {/* General Information Tab */}
          
            <div className="form-card">
              <div className="form-section-title">
                <span className="title-icon">🏪</span>
                <h3>Business Information</h3>
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
                  <p className="field-hint">This name will appear on customer invoices and receipts</p>
                </div>
                
                <div className="form-field">
                  <label className="field-label">Business Email</label>
                  <input
                    type="email"
                    name="email"
                    className="field-input"
                    placeholder="business@example.com"
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
                  <p className="field-hint">This description will be shown to customers</p>
                </div>
              </div>
            </div>
          

          {/* Contact Details Tab */}
          
            <div className="form-card">
              <div className="form-section-title">
                <span className="title-icon">📱</span>
                <h3>Contact Information</h3>
              </div>
              
              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">Phone Number</label>
                  <div className="input-with-icon">
                    <span className="input-leading-icon">📞</span>
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
                
                {/* <div className="form-field">
                  <label className="field-label">WhatsApp Business</label>
                  <div className="input-with-icon">
                    <span className="input-leading-icon">💬</span>
                    <input
                      type="tel"
                      name="whatsapp"
                      className="field-input-icon"
                      placeholder="+1 (555) 000-0000"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="field-hint">Customers can contact you via WhatsApp</p>
                </div> */}
                
                <div className="form-field full-width">
                  <label className="field-label">Business Address</label>
                  <div className="input-with-icon">
                    <span className="input-leading-icon">📍</span>
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
                <span className="title-icon">⏰</span>
                <h3>Operating Hours</h3>
              </div>
              
              <div className="form-grid">
                <div className="form-field full-width">
                  <label className="field-label">Opening Hours</label>
                  <div className="input-with-icon">
                    <span className="input-leading-icon">🕒</span>
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
                <span className="info-icon">ℹ️</span>
                <div className="info-content">
                  <strong>Holiday Schedule</strong>
                  <p>Set special hours for holidays and special occasions</p>
                  <button className="link-button">Configure Holiday Hours →</button>
                </div>
              </div>
            </div>
          

          {/* Gallery Tab */}
            <div className="form-card">
              <div className="form-section-title">
                <span className="title-icon">🖼️</span>
                <h3>Business Gallery</h3>
                <button className="add-gallery-btn" onClick={handleGalleryUpload}>
                  <span>➕</span> Add New Photo
                </button>
              </div>
              
              <div className="gallery-grid">
                {gallery.map(item => (
                  <div key={item.id} className="gallery-item-card">
                    <div 
                      className="gallery-item-image"
                      style={{ backgroundImage: `url(${item.image})` }}
                    >
                      <button 
                        className="gallery-delete-btn"
                        onClick={() => handleGalleryDelete(item.id)}
                        title="Delete photo"
                      >
                        <span>🗑️</span>
                      </button>
                    </div>
                    <div className="gallery-item-info">
                      <input
                        type="text"
                        className="gallery-item-title"
                        value={item.title}
                        onChange={(e) => {
                          const updatedGallery = gallery.map(g => 
                            g.id === item.id ? { ...g, title: e.target.value } : g
                          );
                          setGallery(updatedGallery);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="gallery-hint">Showcase your facility to build trust with customers. Add up to 20 photos.</p>
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
                  <span>💾</span>
                  Save All Changes
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LaundryDetails;