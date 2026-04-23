import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Services.css';
import API from '../api/axiosApi';
import AlertModal from './AlertModal';
import {
  BarChart3, DollarSign, TrendingUp, Plus, Search, Pencil, Trash2, X,
  WashingMachine, Shirt, UtensilsCrossed, Droplets, BellRing, Scissors, ShowerHead,
} from 'lucide-react';

const Services = ({ setCurrentPage }) => {
  const iconMap = {
    laundry: WashingMachine,
    tshirt: Shirt,
    iron: UtensilsCrossed,
    soap: Droplets,
    bell: BellRing,
    cut: Scissors,
    shower: ShowerHead,
  };
  const laundry = JSON.parse(localStorage.getItem('laundry') || '{}');

  const iconOptions = [
    { key: 'laundry', label: 'Laundry' },
    { key: 'tshirt', label: 'Dry Cleaning' },
    { key: 'iron', label: 'Ironing' },
    { key: 'soap', label: 'Soap Wash' },
    { key: 'bell', label: 'Checkroom' },
    { key: 'cut', label: 'Styling' },
    { key: 'shower', label: 'Shower' },
  ];

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [selectedIconKey, setSelectedIconKey] = useState('laundry');
  const [newService, setNewService] = useState({ name: '', description: '', price: '', unit: 'Per Item', category: 'Laundry' });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [alert, setAlert] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const successTimeoutRef = useRef(null);

  const getLaundryId = laundry.id

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get(`/services/laundry/${getLaundryId}`);
      setServices(response.data);
    } catch (err) {
      setAlert({ isOpen: true, type: 'error', title: 'Error', message: `Failed to load services: ${err.response?.data?.message || err.message}` });
    }
    setLoading(false);
  }, [getLaundryId]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  useEffect(() => {
    const filtered = services.filter(
      (s) => (s.name?.toLowerCase().includes(searchTerm.toLowerCase())) || (s.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredServices(filtered);
  }, [services, searchTerm]);

  const stats = {
    totalServices: services.length,
    avgPrice: services.length > 0 ? (services.reduce((sum, s) => sum + parseFloat(s.price || 0), 0) / services.length).toFixed(2) : '0.00',
    activeBookings: 148,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const validateForm = () => {
    if (!newService.name?.trim()) { setFormError('Service name is required'); return false; }
    if (!newService.price || parseFloat(newService.price) <= 0) { setFormError('Valid price greater than 0 is required'); return false; }
    return true;
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditServiceId(null);
    setNewService({ name: '', description: '', price: '', unit: 'Per Item', category: 'Laundry' });
    setSelectedIconKey('laundry');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setIsEditMode(true);
    setEditServiceId(service.id);
    setNewService({
      name: service.name || '',
      description: service.description || '',
      price: service.price?.toString() || '',
      unit: service.unit === '/ item' ? 'Per Item' : service.unit === '/ kg' ? 'Per KG' : service.unit === '/ service' ? 'Flat Rate' : service.unit === '/ load' ? 'Per Load' : 'Per Item',
      category: service.category || 'Laundry',
    });
    setSelectedIconKey(service.icon || 'laundry');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveService = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setFormError(null);
    const serviceData = {
      name: newService.name.trim(),
      description: newService.description.trim(),
      icon: selectedIconKey,
      unit: newService.unit === 'Per Item' ? '/ item' : newService.unit === 'Per KG' ? '/ kg' : newService.unit === 'Flat Rate' ? '/ service' : '/ load',
      price: parseFloat(newService.price),
      laundry_id: getLaundryId,
    };
    try {
      if (isEditMode && editServiceId) {
        await API.put(`/services/${editServiceId}`, serviceData);
        setServices(services.map((s) => s.id === editServiceId ? { ...s, ...serviceData } : s));
      } else {
        const response = await API.post('/services', serviceData);
        setServices([...services, response.data]);
      }
      setAlert({ isOpen: true, type: 'success', title: 'Success', message: isEditMode ? 'Service updated successfully!' : 'Service created successfully!' });
      setIsModalOpen(false);
    } catch (err) {
      setFormError(`Failed to save: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (service) => {
    setAlert({
      isOpen: true,
      type: 'warning',
      title: 'Delete Service?',
      message: `Are you sure you want to delete "${service.name}"? This cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => confirmDelete(service.id),
    });
  };

  const confirmDelete = async (id) => {
    setLoading(true);
    try {
      await API.delete(`/services/${id}`);
      setServices(services.filter((s) => s.id !== id));
      setAlert({ isOpen: true, type: 'success', title: 'Deleted', message: 'Service deleted successfully.' });
    } catch (err) {
      setAlert({ isOpen: true, type: 'error', title: 'Error', message: `Failed to delete: ${err.response?.data?.message || err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const highlightText = (text) => {
    if (!searchTerm || !text) return text || '';
    try {
      const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.split(regex).map((part, i) => regex.test(part) ? <mark key={i} className="svc-highlight">{part}</mark> : part);
    } catch { return text; }
  };

  const getIcon = (key, size = 20) => {
    const Icon = iconMap[key] || iconMap['laundry'];
    return <Icon size={size} />;
  };

  return (
    <div className="svc-page">
      <AlertModal isOpen={alert.isOpen} onClose={() => setAlert({ ...alert, isOpen: false })} type={alert.type} title={alert.title} message={alert.message} confirmText={alert.confirmText} cancelText={alert.cancelText} onConfirm={alert.onConfirm} autoClose={alert.type === 'success'} />

      {/* Topbar */}
      <div className="svc-topbar">
        <div>
          <h1 className="svc-topbar-title">Services</h1>
          <p className="svc-topbar-sub">Manage your laundry service catalog</p>
        </div>
        <button className="btn btn--primary" onClick={openAddModal} disabled={loading}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Stats */}
      <div className="svc-body">
        <div className="svc-stats">
          <div className="svc-stat">
            <div className="svc-stat-icon"><BarChart3 size={20} /></div>
            <div>
              <div className="svc-stat-value">{stats.totalServices}</div>
              <div className="svc-stat-label">Total Services</div>
            </div>
          </div>
          <div className="svc-stat">
            <div className="svc-stat-icon svc-stat-icon--green"><DollarSign size={20} /></div>
            <div>
              <div className="svc-stat-value">{stats.avgPrice}€</div>
              <div className="svc-stat-label">Avg Price</div>
            </div>
          </div>
          <div className="svc-stat">
            <div className="svc-stat-icon svc-stat-icon--amber"><TrendingUp size={20} /></div>
            <div>
              <div className="svc-stat-value">{stats.activeBookings}</div>
              <div className="svc-stat-label">Active Bookings</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="svc-search">
          <Search size={16} />
          <input type="text" placeholder="Search services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={loading} />
          {searchTerm && <button className="svc-search-clear" onClick={() => setSearchTerm('')}><X size={14} /></button>}
        </div>

        {/* Grid */}
        {loading && services.length === 0 ? (
          <div className="svc-loading">
            <div className="svc-spinner" />
            <p>Loading services...</p>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="svc-grid">
            {filteredServices.map((service) => (
              <div key={service.id} className="svc-card">
                <div className="svc-card-top">
                  <div className="svc-card-icon">{getIcon(service.icon)}</div>
                  <div className="svc-card-actions">
                    <button className="svc-action-btn" onClick={() => openEditModal(service)} disabled={loading} title="Edit"><Pencil size={14} /></button>
                    <button className="svc-action-btn svc-action-btn--danger" onClick={() => handleDeleteClick(service)} disabled={loading} title="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 className="svc-card-name">{highlightText(service.name || 'Unnamed')}</h3>
                <p className="svc-card-desc">{highlightText(service.description || 'No description')}</p>
                <div className="svc-card-price">
                  {service.price || 0}€ <span className="svc-card-unit">{service.unit || ''}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="svc-empty">
            <WashingMachine size={48} strokeWidth={1} />
            <h3>No services found</h3>
            <p>{searchTerm ? 'Try adjusting your search.' : 'Add your first service to get started.'}</p>
            {!searchTerm && <button className="btn btn--primary" onClick={openAddModal}><Plus size={16} /> Create Service</button>}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="svc-modal-overlay" onClick={() => !loading && setIsModalOpen(false)}>
          <div className="svc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="svc-modal-header">
              <h2>{isEditMode ? 'Edit Service' : 'New Service'}</h2>
              <button className="svc-modal-close" onClick={() => !loading && setIsModalOpen(false)}><X size={18} /></button>
            </div>
            {formError && <div className="svc-form-error">{formError}</div>}
            <div className="svc-form-group">
              <label>Name *</label>
              <input type="text" name="name" value={newService.name} onChange={handleInputChange} placeholder="Service name" disabled={loading} />
            </div>
            <div className="svc-form-group">
              <label>Description</label>
              <textarea name="description" value={newService.description} onChange={handleInputChange} placeholder="Brief description (optional)" rows="3" disabled={loading} />
            </div>
            <div className="svc-form-row">
              <div className="svc-form-group">
                <label>Price (€) *</label>
                <input type="number" name="price" value={newService.price} onChange={handleInputChange} min="0" step="0.01" placeholder="0.00" disabled={loading} />
              </div>
              <div className="svc-form-group">
                <label>Unit</label>
                <select name="unit" value={newService.unit} onChange={handleInputChange} disabled={loading}>
                  <option value="Per Item">Per Item (/ item)</option>
                  <option value="Per KG">Per KG (/ kg)</option>
                  <option value="Flat Rate">Flat Rate (/ service)</option>
                  <option value="Per Load">Per Load (/ load)</option>
                </select>
              </div>
            </div>
            <div className="svc-form-group">
              <label>Icon</label>
              <div className="svc-icon-picker">
                {iconOptions.map((opt) => {
                  const Icon = iconMap[opt.key];
                  return (
                    <div key={opt.key} className={`svc-icon-opt${selectedIconKey === opt.key ? ' active' : ''}`} onClick={() => setSelectedIconKey(opt.key)} title={opt.label}>
                      <Icon size={18} />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="svc-modal-footer">
              <button className="btn btn--outline" onClick={() => setIsModalOpen(false)} disabled={loading}>Cancel</button>
              <button className="btn btn--primary" onClick={handleSaveService} disabled={loading}>{loading ? 'Saving...' : 'Save Service'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
