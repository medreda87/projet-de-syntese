import React, { useEffect, useState } from 'react';
import './styles.css';
import { User, Mail, Phone, MapPin, Shield, CreditCard, Bell, HelpCircle } from 'lucide-react';
import AlertModal from './AlertModal';

const PersonalInformation = () => {
  const [formData, setFormData] = useState({
    fullName: "Houda Rammach",
    email: "houda@example.com",
    phone: "+212- 687474748",
    address: "123 Tanger, Al_Madina, 134"
  });
const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [alert, setAlert] = useState({ open: false, type: 'success', title: '', message: '' });



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved:", formData);
    setAlert({
      open: true,
      type: 'success',
      title: 'Changes Saved!',
      message: 'Your personal information has been updated successfully.'
    });
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-topbar">
        <div>
          <h1 className="page-heading">Welcome back,{user.name}</h1>
          <p className="page-heading-sub">Manage your profile and preferences here.</p>
        </div>
        <div className="topbar-actions">
          <button className="topbar-icon-btn"><Bell size={20} /></button>
          <button className="topbar-icon-btn"><HelpCircle size={20} /></button>
          <div className="topbar-avatar"><User size={18} /></div>
        </div>
      </div>

      <div className="page-body">
        <h2 className="section-heading">Personal Information</h2>
        <p className="section-subtext">Update your details to keep your account up-to-date.</p>

        {/* Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label">Full Name</label>
                <div className="input-group">
                  <span className="input-icon"><User size={18} /></span>
                  <input type="text" name="fullName" value={user.name} onChange={handleChange} className="form-input" />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Email Address</label>
                <div className="input-group">
                  <span className="input-icon"><Mail size={18} /></span>
                  <input type="email" name="email" value={user.email} onChange={handleChange} className="form-input" />
                </div>
              </div>

              {/* <div className="form-field form-field--full">
                <label className="form-label">Phone Number</label>
                <div className="input-group">
                  <span className="input-icon"><Phone size={18} /></span>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" />
                </div>
              </div> */}

              {/* <div className="form-field form-field--full">
                <label className="form-label">Home Address</label>
                <div className="input-group">
                  <span className="input-icon"><MapPin size={18} /></span>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-input" />
                </div>
              </div> */}
            </div>

            <div className="form-footer">
              <p className="form-footer-text">Your information is securely encrypted and stored.</p>
              <div className="form-footer-actions">
                <button type="button" className="btn btn--outline">Cancel</button>
                <button type="submit" className="btn btn--primary">Save Changes</button>
              </div>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="info-cards-grid">
          <div className="card info-card">
            <div className="info-card-header">
              <div className="info-card-icon info-card-icon--blue"><Shield size={24} /></div>
              <h3 className="info-card-title">Security Level</h3>
            </div>
            <p className="info-card-text">Enable two-factor authentication to improve your account safety.</p>
            <button className="btn-link">Configure Security &rarr;</button>
          </div>

          <div className="card info-card">
            <div className="info-card-header">
              <div className="info-card-icon info-card-icon--green"><CreditCard size={24} /></div>
              <h3 className="info-card-title">Billing Status</h3>
            </div>
            <p className="info-card-text">Your next bill of $29.00 will be processed on Oct 24, 2023.</p>
            <button className="btn-link">View Invoices &rarr;</button>
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
    </div>
  );
};

export default PersonalInformation;