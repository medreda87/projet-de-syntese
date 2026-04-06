import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Services.css';
import API from '../api/axiosApi';
import { FaChartBar, FaTshirt, FaConciergeBell, FaCut, FaShower, FaTrash, FaUtensils } from 'react-icons/fa';


import { AiOutlineDollarCircle } from "react-icons/ai";
import { FaChartLine } from "react-icons/fa";
import { MdLocalLaundryService, MdSoap } from 'react-icons/md';

const Services = ({ setCurrentPage }) => {
  // Icon map: key (string for API) -> React element
  const iconMap = {
    'laundry': <MdLocalLaundryService />,
    'tshirt': <FaTshirt />,
    'iron': <FaUtensils />,
    'soap': <MdSoap />,
    'bell': <FaConciergeBell />,
    'cut': <FaCut />,
    'shower': <FaShower />,
  };


  const iconOptions = [
    { key: 'laundry', label: 'Laundry Service' },
    { key: 'tshirt', label: 'Dry Cleaning' },
    { key: 'iron', label: 'Ironing' },
    { key: 'soap', label: 'Soap Wash' },
    { key: 'bell', label: 'Checkroom' },
    { key: 'cut', label: 'Styling' },
    { key: 'shower', label: 'Shower Wash' },
  ];

  // Core state with iconKey (string)
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedIconKey, setSelectedIconKey] = useState('laundry'); // string key
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'Per Item',
    category: 'Laundry',
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const successTimeoutRef = useRef(null);

  // Get laundry_id from localStorage or default (TODO: use AuthContext)
  const getLaundryId = useCallback(() => {
    return parseInt(localStorage.getItem('laundry_id')) || 5;
  }, []);

  // Fetch services
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/services');
      // Map backend icon strings to enriched data
      const enrichedServices = (response.data || []).map(service => ({
        ...service,
        iconElement: iconMap[service.icon] || iconMap['laundry']
      }));
      setServices(enrichedServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please check backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Search filter
  useEffect(() => {
    const filtered = services.filter(
      (service) =>
        (service.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (service.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    );
    setFilteredServices(filtered);
  }, [services, searchTerm]);

  // Success toast auto-dismiss
  useEffect(() => {
    if (success) {
      successTimeoutRef.current = setTimeout(() => {
        setSuccess(null);
      }, 4000);
    }
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, [success]);

  // Stats calculation
  const stats = {
    totalServices: services.length,
    avgPrice: services.length > 0
      ? (services.reduce((sum, s) => sum + parseFloat(s.price || 0), 0) / services.length).toFixed(2)
      : '0.00',
    activeBookings: 148, // TODO: Fetch real data
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!newService.name?.trim()) {
      setError('Service name is required');
      return false;
    }
    if (!newService.price || parseFloat(newService.price) <= 0) {
      setError('Valid price greater than 0 is required');
      return false;
    }
    return true;
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditServiceId(null);
    setNewService({ name: '', description: '', price: '', unit: 'Per Item', category: 'Laundry' });
    setSelectedIconKey('laundry');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setIsEditMode(true);
    setEditServiceId(service.id);
    setNewService({
      name: service.name || '',
      description: service.description || '',
      price: service.price?.toString() || '',
      unit: service.unit === '/ item' ? 'Per Item' :
            service.unit === '/ kg' ? 'Per KG' :
            service.unit === '/ service' ? 'Flat Rate' : 
            service.unit === '/ load' ? 'Per Load' : 'Per Item',
      category: service.category || 'Laundry',
    });
    setSelectedIconKey(service.icon || 'laundry'); // string key from backend
    setError(null);
    setIsModalOpen(true);
  };

  const handleSaveService = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    const serviceData = {
      name: newService.name.trim(),
      description: newService.description.trim(),
      icon: selectedIconKey, // string key
      unit: newService.unit === 'Per Item' ? '/ item' :
            newService.unit === 'Per KG' ? '/ kg' :
            newService.unit === 'Flat Rate' ? '/ service' : '/ load',
      price: parseFloat(newService.price),
      laundry_id: getLaundryId(),
    };

    try {
      let updatedServices;
      if (isEditMode && editServiceId) {
        await API.put(`/services/${editServiceId}`, serviceData);
        updatedServices = services.map((s) => 
          s.id === editServiceId 
            ? { ...s, ...serviceData, iconElement: iconMap[selectedIconKey] || iconMap['laundry'] }
            : s
        );
      } else {
        const response = await API.post('/services', serviceData);
        updatedServices = [...services, { ...response.data, iconElement: iconMap[selectedIconKey] || iconMap['laundry'] }];
      }
      setServices(updatedServices);
      setSuccess(isEditMode ? 'Service updated successfully!' : 'Service created successfully!');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving service:', err);
      setError(`Failed to save service: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete?.id) return;
    setLoading(true);
    try {
      await API.delete(`/services/${serviceToDelete.id}`);
      setServices(services.filter((s) => s.id !== serviceToDelete.id));
      setSuccess('Service deleted successfully!');
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(`Failed to delete: ${err.response?.data?.message || err.message}`);
    } finally {
      setShowDeleteConfirm(false);
      setServiceToDelete(null);
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setServiceToDelete(null);
  };

  const highlightText = (text) => {
    if (!searchTerm || !text) return text || '';
    try {
      const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.split(regex).map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="search-highlight">{part}</mark>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  const getIconElement = (iconKey) => iconMap[iconKey] || iconMap['laundry'];

  return (
    <div className="services-container">
      {/* Stats Dashboard */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaChartBar /></div>
          <div>
            <div className="stat-value">{stats.totalServices}</div>
            <div className="stat-label">Total Services</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><AiOutlineDollarCircle /></div>
          <div>
            <div className="stat-value">{stats.avgPrice}€</div>
            <div className="stat-label">Avg Price</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaChartLine /></div>
          <div>
            <div className="stat-value">{stats.activeBookings}</div>
            <div className="stat-label">Active Bookings</div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="services-header">
        <h2>Services Management</h2>
        <button className="add-service-btn" onClick={openAddModal} disabled={loading}>
          <span>+</span> Add Service
        </button>
      </div>

      {/* Search */}
      <div className="services-search">
        <input
          type="text"
          placeholder="Search services by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Services Grid */}
      <div className="services-list">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading services...</p>
          </div>
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">
                {service.iconElement || getIconElement('laundry')}
              </div>
              <div className="service-info">
                <h3>{highlightText(service.name || 'Unnamed')}</h3>
                <p>{highlightText(service.description || 'No description')}</p>
                <p className="service-price">
                  {service.price || 0}€ <span className="service-unit">{service.unit || ''}</span>
                </p>
              </div>
              <div className="service-actions">
                <button 
                  className="edit-btn" 
                  onClick={() => openEditModal(service)}
                  disabled={loading}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeleteClick(service)}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">{getIconElement('laundry')}</div>
            <h3>No services found</h3>
            <p>{searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first service.'}</p>
            {!searchTerm && (
              <button className="add-service-btn" onClick={openAddModal}>
                Create First Service
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !loading && setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditMode ? 'Edit Service' : 'Add New Service'}</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={newService.name}
                onChange={handleInputChange}
                placeholder="Enter service name"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={newService.description}
                onChange={handleInputChange}
                placeholder="Service description (optional)"
                rows="3"
                disabled={loading}
              />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Price (€) *</label>
                <input
                  type="number"
                  name="price"
                  value={newService.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select name="unit" value={newService.unit} onChange={handleInputChange} disabled={loading}>
                  <option value="Per Item">Per Item (/ item)</option>
                  <option value="Per KG">Per KG (/ kg)</option>
                  <option value="Flat Rate">Flat Rate (/ service)</option>
                  <option value="Per Load">Per Load (/ load)</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Icon</label>
              <div className="icon-options">
                {iconOptions.map((option) => (
                  <div
                    key={option.key} // string key
                    className={`icon-option ${selectedIconKey === option.key ? 'selected' : ''}`}
                    onClick={() => setSelectedIconKey(option.key)}
                    title={option.label}
                  >
                    <span className="icon-emoji">{iconMap[option.key]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="save-btn" 
                onClick={handleSaveService}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm">
              <div className="delete-icon"><FaTrash /></div>
              <h3>Delete Service?</h3>
              <p>
                Are you sure you want to delete "<strong>{serviceToDelete?.name}</strong>"? 
                This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={cancelDelete} disabled={loading}>
                  Cancel
                </button>
                <button className="delete-btn confirm-delete-btn" onClick={confirmDelete} disabled={loading}>
                  {loading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Toasts */}
      {success && (
        <div className="toast success-toast">
          {success}
          <button onClick={() => setSuccess(null)}>&times;</button>
        </div>
      )}
      {error && (
        <div className="toast error-toast">
          {error}
          <button onClick={() => setError(null)}>&times;</button>
        </div>
      )}
    </div>
  );
};

export default Services;

