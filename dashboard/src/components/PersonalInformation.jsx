import React, { useState } from 'react';
import './styles.css'; 

const PersonalInformation = () => {
  const [formData, setFormData] = useState({
    fullName: "Houda Rammach",
    email: "houda@example.com",
    phone: "+212- 687474748",
    address: "123 Tanger, Al_Madina, 134"
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved:", formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      
      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px 60px', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 6px 0' }}>Welcome back, Alex</h1>
            <p style={{ color: '#64748b', margin: 0 }}>Manage your profile and preferences here.</p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛎️</div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>❔</div>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>👨</div>
          </div>
        </div>

        <h2 style={{ fontSize: '34px', fontWeight: '700', marginBottom: '8px' }}>Personal Information</h2>
        <p style={{ color: '#64748b', fontSize: '17px', marginBottom: '40px' }}>
          Update your details to keep your account up-to-date.
        </p>

        {/* Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#334155' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>👤</span>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '16px 20px 16px 52px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      fontSize: '15px'
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#334155' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>✉️</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '16px 20px 16px 52px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      fontSize: '15px'
                    }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#334155' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>📞</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '16px 20px 16px 52px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      fontSize: '15px'
                    }}
                  />
                </div>
              </div>

              {/* Address */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#334155' }}>Home Address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>📍</span>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '16px 20px 16px 52px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      fontSize: '15px'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '40px',
              paddingTop: '30px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                Your information is securely encrypted and stored.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: 'white',
                    color: '#475569',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 32px',
                    borderRadius: '12px',
                    backgroundColor: '#0ea5e9',
                    color: 'white',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>

          {isSaved && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#ecfdf5',
              color: '#10b981',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              ✓ Changes saved successfully!
            </div>
          )}
        </div>

        {/* Security & Billing */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '40px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '28px',
            borderRadius: '20px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#dbeafe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🛡️</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Security Level</h3>
            </div>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Enable two-factor authentication to improve your account safety.</p>
            <a href="#" style={{ color: '#0ea5e9', fontWeight: '600' }}>Configure Security →</a>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '28px',
            borderRadius: '20px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#d1fae5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>💳</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Billing Status</h3>
            </div>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Your next bill of $29.00 will be processed on Oct 24, 2023.</p>
            <a href="#" style={{ color: '#0ea5e9', fontWeight: '600' }}>View Invoices →</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;