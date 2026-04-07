import React, { useState } from 'react';
import './LaundryDetails.css';
import { Camera, Building2, Phone, MapPin, Clock, Info, Save, Bell, Settings } from 'lucide-react';
import API from '../api/axiosApi';
import AlertModal from './AlertModal';

const LaundryDetails = ({ setCurrentPage }) => {
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPreview, setCoverPreview] = useState('https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=1200&h=400&fit=crop');
  const [profilePreview, setProfilePreview] = useState('https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=150&h=150&fit=crop');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    user_id: 1,
    openingHours: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: 'success', title: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
        setCoverPhoto(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
        setProfilePhoto(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      setAlert({ open: true, type: 'warning', title: 'Missing Fields', message: 'Please fill in Name, Address, and Phone.' });
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
      data.append('user_id', formData.user_id);
      if (profilePhoto) data.append('logo', profilePhoto);
      if (coverPhoto) data.append('bigLogo', coverPhoto);

      await API.post('/laundries', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAlert({ open: true, type: 'success', title: 'Success!', message: 'Your laundry information has been saved successfully.' });
    } catch (error) {
      console.error('Error saving laundry details:', error.response?.data || error.message);
      setAlert({
        open: true,
        type: 'error',
        title: 'Save Failed',
        message: error.response?.status === 422
          ? 'Validation error. Please check your input fields.'
          : 'An error occurred while saving. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    setAlert({
      open: true,
      type: 'warning',
      title: 'Discard Changes?',
      message: 'Are you sure you want to discard all changes? This cannot be undone.',
      confirmText: 'Discard',
      cancelText: 'Keep Editing',
      onConfirm: () => {
        setFormData({ name: '', email: '', description: '', phone: '', address: '', openingHours: '', user_id: 1 });
        setAlert({ open: false });
      }
    });
  };

  return (
    <div className="laundry-page">
      {/* Header */}
      <header className="laundry-topbar">
        <div>
          <h1 className="laundry-topbar-title">Laundry Details</h1>
          <p className="laundry-topbar-sub">Manage your business profile and settings</p>
        </div>
        <div className="laundry-topbar-actions">
          <button className="laundry-topbar-btn"><Bell size={20} /></button>
          <button className="laundry-topbar-btn"><Settings size={20} /></button>
        </div>
      </header>

      {/* Main Content */}
      <main className="laundry-main">
        {/* Banner */}
        <div className="laundry-banner">
          <div className="laundry-cover" style={{ backgroundImage: `url(${coverPreview})` }}>
            <label className="laundry-cover-upload">
              <input type="file" accept="image/*" onChange={handleCoverUpload} hidden />
              <div className="laundry-cover-overlay">
                <Camera size={22} />
                <span>Change Cover</span>
              </div>
            </label>
          </div>
          <div className="laundry-profile-row">
            <div className="laundry-profile-img" style={{ backgroundImage: `url(${profilePreview})` }}>
              <label className="laundry-profile-upload">
                <input type="file" accept="image/*" onChange={handleProfileUpload} hidden />
                <div className="laundry-profile-overlay">
                  <Camera size={18} />
                </div>
              </label>
            </div>
            <div className="laundry-profile-info">
              <h2 className="laundry-shop-name">{formData.name || 'Your Business Name'}</h2>
              <div className="laundry-badges">
                <span className="badge badge--gold">★ 4.9 (328 reviews)</span>
                <span className="badge badge--green">✓ Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="laundry-card">
          <div className="laundry-card-header">
            <div className="laundry-card-icon"><Building2 size={20} /></div>
            <h3>Business Information</h3>
          </div>
          <div className="laundry-form-grid">
            <div className="laundry-field">
              <label>Laundry Business Name</label>
              <input type="text" name="name" placeholder="Enter business name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="laundry-field">
              <label>Business Email</label>
              <input type="email" name="email" placeholder="laundry@example.com" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="laundry-field laundry-field--full">
              <label>Business Description</label>
              <textarea name="description" placeholder="Describe your laundry business..." rows="4" value={formData.description} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="laundry-card">
          <div className="laundry-card-header">
            <div className="laundry-card-icon"><Phone size={20} /></div>
            <h3>Contact Information</h3>
          </div>
          <div className="laundry-form-grid">
            <div className="laundry-field">
              <label>Phone Number</label>
              <div className="laundry-input-icon">
                <Phone size={16} />
                <input type="tel" name="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleInputChange} />
              </div>
            </div>
            <div className="laundry-field laundry-field--full">
              <label>Business Address</label>
              <div className="laundry-input-icon">
                <MapPin size={16} />
                <input type="text" name="address" placeholder="Full business address" value={formData.address} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="laundry-card">
          <div className="laundry-card-header">
            <div className="laundry-card-icon"><Clock size={20} /></div>
            <h3>Operating Hours</h3>
          </div>
          <div className="laundry-form-grid">
            <div className="laundry-field laundry-field--full">
              <label>Opening Hours</label>
              <div className="laundry-input-icon">
                <Clock size={16} />
                <input type="text" name="openingHours" placeholder="e.g., Mon-Fri: 8am-8pm, Sat: 9am-6pm" value={formData.openingHours} onChange={handleInputChange} />
              </div>
              <p className="laundry-hint">Specify your business hours for each day</p>
            </div>
          </div>
          <div className="laundry-info-box">
            <Info size={18} />
            <div>
              <strong>Holiday Schedule</strong>
              <p>Set special hours for holidays and special occasions</p>
              <button className="btn-link">Configure Holiday Hours →</button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="laundry-actions">
          <button className="btn btn--outline" onClick={handleDiscard}>Discard Changes</button>
          <button className="btn btn--primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : <><Save size={16} /> Save All Changes</>}
          </button>
        </div>
      </main>

      <AlertModal
        isOpen={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        confirmText={alert.confirmText}
        cancelText={alert.cancelText}
        onConfirm={alert.onConfirm}
      />
    </div>
  );
};

export default LaundryDetails;