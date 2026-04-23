import React, { useState, useEffect } from 'react';
import './LaundryDetails.css';
import { Camera, Building2, Phone, MapPin, Clock, Info, Save, Bell, Settings, Crosshair } from 'lucide-react';
import API from '../api/axiosApi';
import AlertModal from './AlertModal';

// Leaflet imports
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../contexts/AuthContext';

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map marker component
function LocationMarker({ position, setPosition, setAddressFromCoords }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`)
        .then(res => res.json())
        .then(data => {
          if (data.display_name) setAddressFromCoords(data.display_name);
        })
        .catch(err => console.error('Reverse geocoding error:', err));
    },
  });

  return position ? (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const { lat, lng } = e.target.getLatLng();
          setPosition([lat, lng]);
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`)
            .then(res => res.json())
            .then(data => {
              if (data.display_name) setAddressFromCoords(data.display_name);
            });
        },
      }}
    />
  ) : null;
}

const LaundryDetails = ({ setCurrentPage }) => {
  const {user} = useAuth();

  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    user_id: user.id,
    openingHours: '',
    bigLogo: '',
    logo: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: 'success', title: '', message: '' });

  // Track which laundry is being edited (null = creating new)
  const existingLaundry = JSON.parse(localStorage.getItem('laundry') || 'null');
  const [selectedLaundryId, setSelectedLaundryId] = useState(existingLaundry?.id || null);

  // Map state
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([33.5731, -7.5898]);

  // User's laundries list
  const [userLaundries, setUserLaundries] = useState([]);

  // Approval status of the currently selected laundry
  const [approvalStatus, setApprovalStatus] = useState(null); // null | 'approved' | 'pending' | 'incomplete'

  // Opening hours structured state
  const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const parseOpeningHours = (str) => {
    if (!str) return { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], openTime: '08:00', closeTime: '18:00' };
    const dayMap = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };
    const lower = str.toLowerCase();
    const selectedDaysSet = new Set();
    Object.entries(dayMap).forEach(([key, label]) => { if (lower.includes(key)) selectedDaysSet.add(label); });
    const timeMatch = str.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
    return {
      days: selectedDaysSet.size > 0 ? ALL_DAYS.filter(d => selectedDaysSet.has(d)) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      openTime: timeMatch ? timeMatch[1] : '08:00',
      closeTime: timeMatch ? timeMatch[2] : '18:00',
    };
  };
  const buildOpeningHoursStr = (days, openTime, closeTime) =>
    days.length === 0 ? '' : `${days.join(', ')}: ${openTime}-${closeTime}`;

  const initialParsed = parseOpeningHours(existingLaundry?.openingHours || '');
  const [openDays, setOpenDays] = useState(initialParsed.days);
  const [openTime, setOpenTime] = useState(initialParsed.openTime);
  const [closeTime, setCloseTime] = useState(initialParsed.closeTime);

  const handleDayToggle = (day) => {
    const updated = openDays.includes(day) ? openDays.filter(d => d !== day) : [...openDays, day];
    setOpenDays(updated);
    setFormData(prev => ({ ...prev, openingHours: buildOpeningHoursStr(updated, openTime, closeTime) }));
  };
  const handleOpenTimeChange = (e) => {
    setOpenTime(e.target.value);
    setFormData(prev => ({ ...prev, openingHours: buildOpeningHoursStr(openDays, e.target.value, closeTime) }));
  };
  const handleCloseTimeChange = (e) => {
    setCloseTime(e.target.value);
    setFormData(prev => ({ ...prev, openingHours: buildOpeningHoursStr(openDays, openTime, e.target.value) }));
  };

  // Geocode address to move map
  const geocodeAddress = async (address) => {
    if (!address) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await response.json();
      if (data && data[0]) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const setAddressFromCoords = (address) => {
    setFormData(prev => ({ ...prev, address }));
  };

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

  // Save: create new or update existing
  const handleSave = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      setAlert({
        open: true,
        type: 'warning',
        title: 'Missing Fields',
        message: 'Please fill in Name, Address, and Phone.',
      });
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
      data.append('user_id', user.id);

      if (profilePhoto) data.append('logo', profilePhoto);
      if (coverPhoto) data.append('bigLogo', coverPhoto);

      let response;
      if (selectedLaundryId) {
        // Update existing laundry
        response = await API.post(`/laundries/${selectedLaundryId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Create new laundry
        response = await API.post('/laundries', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSelectedLaundryId(response.data.id);
      }

      localStorage.setItem('laundry', JSON.stringify(response.data));

      setAlert({
        open: true,
        type: 'success',
        title: 'Success!',
        message: selectedLaundryId
          ? 'Your laundry has been updated successfully.'
          : 'Your laundry has been created successfully.',
      });

      fetchUserLaundries();
    } catch (error) {
      console.error('Error saving laundry:', error.response?.data || error.message);
      setAlert({
        open: true,
        type: 'error',
        title: 'Save Failed',
        message: error.response?.data?.message || 'An error occurred. Please try again.',
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
      message: 'Are you sure you want to discard all changes?',
      confirmText: 'Discard',
      cancelText: 'Keep Editing',
      onConfirm: () => {
        setFormData({
          name: '',
          address: '',
          phone: '',
          email: '',
          description: '',
          openingHours: '',
          user_id: user.id,
          bigLogo: '',
          logo: '',
        });
        setCoverPreview(null);
        setProfilePreview(null);
        setMarkerPosition(null);
        setMapCenter([33.5731, -7.5898]);
        setApprovalStatus(null);
        setOpenDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
        setOpenTime('08:00');
        setCloseTime('18:00');
        setAlert({ open: false });
      },
    });
  };

  // Fetch user's laundries
  const fetchUserLaundries = async () => {
    try {
      const response = await API.get(`/laundries/user/${user.id}`);
      setUserLaundries(response.data);
    } catch (error) {
      console.error('Error fetching laundries:', error.response?.data || error.message);
    }
  };

  // Load existing laundry data into the form (for viewing/editing before creating a new one)
  const handleSelectLaundry = async (id) => {
    if (!id) {
      // "Create new" selected
      setSelectedLaundryId(null);
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        description: '',
        openingHours: '',
        user_id: user.id,
        bigLogo: '',
        logo: '',
      });
      setCoverPreview(null);
      setProfilePreview(null);
      setMarkerPosition(null);
      setMapCenter([33.5731, -7.5898]);
      setOpenDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
      setOpenTime('08:00');
      setCloseTime('18:00');
      setApprovalStatus(null);
      return;
    }

    setSelectedLaundryId(parseInt(id));
    try {
      const response = await API.get(`/laundries/${id}`);
      const laundry = response.data.laundry ?? response.data;
      localStorage.setItem('laundry', JSON.stringify(laundry));

      // Update approval status badge
      if (laundry.admin_approved) {
        setApprovalStatus('approved');
      } else if (laundry.is_accepted) {
        setApprovalStatus('pending');
      } else {
        setApprovalStatus('incomplete');
      }

      setFormData({
        name: laundry.name,
        address: laundry.address,
        phone: laundry.phone,
        email: laundry.email || '',
        description: laundry.description || '',
        openingHours: laundry.openingHours || '',
        user_id: user.id,
        bigLogo: laundry.bigLogo || '',
        logo: laundry.logo || '',
      });


      const parsed = parseOpeningHours(laundry.openingHours || '');
      setOpenDays(parsed.days);
      setOpenTime(parsed.openTime);
      setCloseTime(parsed.closeTime);

      // Set image previews (accessor already returns full URL)
      if (laundry.bigLogo) {
        setCoverPreview(laundry.bigLogo);
      } else {
        setCoverPreview(null);
      }
      if (laundry.logo) {
        setProfilePreview(laundry.logo);
      } else {
        setProfilePreview(null);
      }

      // Move map to address
      if (laundry.address) {
        geocodeAddress(laundry.address);
      }
    } catch (error) {
      console.error('Error fetching laundry details:', error);
    }
  };

  useEffect(() => {
    fetchUserLaundries();
    // Pre-load existing laundry into form on mount
    if (existingLaundry?.id) {
      handleSelectLaundry(existingLaundry.id);
    }
  }, [user.id]);

  return (
    <div className="laundry-page">
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

      {/* Styled dropdown */}



      <main className="laundry-main">

        {userLaundries.length > 0 && (
  <div className="laundry-card">
      <div className="laundry-card-header">
        <div className="laundry-card-icon">
            <Building2 size={20} /></div>
            <h3>Select laundry</h3>
          </div>
    <div className="laundry-field">
    <label>Select Your Laundry</label>
    <select
      value={selectedLaundryId || ''}
      onChange={(e) => handleSelectLaundry(e.target.value)}
    >
      <option value=""> Create new laundry</option>
      {userLaundries.map((laundry) => (
        <option key={laundry.id} value={laundry.id}>
           {laundry.name}
        </option>
      ))}
    </select>
    </div>

  </div>
)}
        {/* Banner */}
        <div className="laundry-banner">
          <div
            className="laundry-cover"
            style={coverPreview ? { backgroundImage: `url(${coverPreview})` } : { background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {!coverPreview && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#94a3b8', pointerEvents: 'none' }}>
                <Camera size={36} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Upload Cover Photo</span>
              </div>
            )}
            <label className="laundry-cover-upload">
              <input type="file" accept="image/*" onChange={handleCoverUpload} hidden />
              <div className="laundry-cover-overlay">
                <Camera size={22} />
                <span>{coverPreview ? 'Change Cover' : 'Add Cover'}</span>
              </div>
            </label>
          </div>
          <div className="laundry-profile-row">
            <div
              className="laundry-profile-img"
              style={profilePreview ? { backgroundImage: `url(${profilePreview})` } : { background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {!profilePreview && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', pointerEvents: 'none' }}>
                  <Camera size={24} />
                </div>
              )}
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
                {approvalStatus === 'approved' && (
                  <span className="badge badge--green">✓ Approved</span>
                )}
                {approvalStatus === 'pending' && (
                  <span className="badge badge--yellow">⏳ Pending Review</span>
                )}
                {approvalStatus === 'incomplete' && (
                  <span className="badge badge--gray">○ Incomplete Profile</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="laundry-card">
          <div className="laundry-card-header">
            <div className="laundry-card-icon">
              <Building2 size={20} /></div>
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

        {/* Contact Info with Map */}
        <div className="laundry-card">
          <div className="laundry-card-header">
            <div className="laundry-card-icon"><Phone size={20} /></div>
            <h3>Contact Information & Location</h3>
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
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn--small btn--outline"
                  onClick={() => geocodeAddress(formData.address)}
                >
                  <Crosshair size={14} /> Locate on Map
                </button>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div style={{ marginTop: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '350px', width: '100%' }}
              whenReady={() => {
                if (formData.address && !markerPosition) {
                  geocodeAddress(formData.address);
                }
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker
                position={markerPosition}
                setPosition={setMarkerPosition}
                setAddressFromCoords={setAddressFromCoords}
              />
            </MapContainer>
            <div style={{ padding: '8px 12px', background: '#f8fafc', fontSize: '12px', color: '#475569' }}>
              <MapPin size={16} /> Click on the map or drag the marker to set your laundry location.
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
              <div className="laundry-opening-days">
                {ALL_DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    className={`laundry-day-btn${openDays.includes(day) ? ' active' : ''}`}
                    onClick={() => handleDayToggle(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="laundry-opening-time">
                <div className="laundry-field">
                  <label>Opens at</label>
                  <input type="time" value={openTime} onChange={handleOpenTimeChange} className="laundry-time-input" />
                </div>
                <span className="laundry-time-sep">–</span>
                <div className="laundry-field">
                  <label>Closes at</label>
                  <input type="time" value={closeTime} onChange={handleCloseTimeChange} className="laundry-time-input" />
                </div>
              </div>
              {formData.openingHours && (
                <p className="laundry-hint">Preview: {formData.openingHours}</p>
              )}
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
            {isLoading ? 'Saving...' : <><Save size={16} /> {selectedLaundryId ? 'Update Laundry' : 'Create New Laundry'}</> }
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