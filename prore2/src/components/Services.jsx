import React, { useState } from 'react';
import './Services.css';

const Services = ({ setCurrentPage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('local_laundry_service');
  const [newService, setNewService] = useState({
    name: '',
    category: 'Laundry',
    description: '',
    price: '',
    unit: 'Per Item'
  });

  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Dry Cleaning',
      description: 'Professional eco-friendly solvent cleaning for delicate and high-end fabrics.',
      price: 15.00,
      unit: '/ item',
      icon: 'dry_cleaning',
      category: 'Cleaning',
      image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=500&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Ironing',
      description: 'Crisp steam pressing for shirts, trousers, and linens. Hand-finished detail.',
      price: 5.00,
      unit: '/ item',
      icon: 'iron',
      category: 'Pressing',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Stain Removal',
      description: 'Targeted chemical treatment for stubborn oil, wine, and grass stains.',
      price: 10.00,
      unit: '/ treatment',
      icon: 'cleaning_services',
      category: 'Cleaning',
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&h=300&fit=crop'
    }
  ]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const stats = {
    totalServices: services.length,
    avgPrice: (services.reduce((sum, s) => sum + s.price, 0) / services.length).toFixed(2),
    activeBookings: 148
  };

  const iconOptions = [
    { value: 'local_laundry_service', emoji: '🧺', label: 'Laundry' },
    { value: 'dry_cleaning', emoji: '👔', label: 'Dry Cleaning' },
    { value: 'iron', emoji: '👕', label: 'Iron' },
    { value: 'cleaning_services', emoji: '🧹', label: 'Cleaning' },
    { value: 'checkroom', emoji: '👗', label: 'Checkroom' },
    { value: 'soap', emoji: '🧼', label: 'Soap' },
    { value: 'styler', emoji: '💇', label: 'Styler' },
    { value: 'wash', emoji: '✨', label: 'Wash' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditServiceId(null);
    setNewService({
      name: '',
      category: 'Laundry',
      description: '',
      price: '',
      unit: 'Per Item'
    });
    setSelectedIcon('local_laundry_service');
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setIsEditMode(true);
    setEditServiceId(service.id);
    setNewService({
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price.toString(),
      unit: service.unit === '/ item' ? 'Per Item' : 
            service.unit === '/ kg' ? 'Per KG' :
            service.unit === '/ service' ? 'Flat Rate' : 'Per Load'
    });
    setSelectedIcon(service.icon);
    setIsModalOpen(true);
  };

  const handleSaveService = () => {
    if (newService.name && newService.price) {
      const serviceData = {
        id: isEditMode ? editServiceId : services.length + 1,
        name: newService.name,
        description: newService.description,
        price: parseFloat(newService.price),
        unit: newService.unit === 'Per Item' ? '/ item' : 
              newService.unit === 'Per KG' ? '/ kg' :
              newService.unit === 'Flat Rate' ? '/ service' : '/ load',
        icon: selectedIcon,
        category: newService.category,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&h=300&fit=crop'
      };

      if (isEditMode) {
        setServices(services.map(service => 
          service.id === editServiceId ? serviceData : service
        ));
      } else {
        setServices([...services, serviceData]);
      }
      
      setIsModalOpen(false);
      setNewService({ name: '', category: 'Laundry', description: '', price: '', unit: 'Per Item' });
      setSelectedIcon('local_laundry_service');
    }
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setServices(services.filter(service => service.id !== serviceToDelete.id));
    setShowDeleteConfirm(false);
    setServiceToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setServiceToDelete(null);
  };

  const highlightText = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? <mark key={i} className="search-highlight">{part}</mark> : part
    );
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasSearchResults = filteredServices.length > 0;

  return (
    <div className="services-container">
      {/* Header avec onglets de navigation */}
      <div className="page-header">
        <div className="header-tabs">
         </div>
        
        <div className="header-actions">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="search-clear"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
          <button className="icon-btn">
            🔔
          </button>
          <div className="user-avatar">
            👨
          </div>
        </div>
      </div>

      <div className="services-content">
        {/* Search Info */}
        {searchTerm && (
          <div className="search-info">
            <span>🔍</span>
            <p>Searching for: <strong>"{searchTerm}"</strong></p>
            <span className="search-results-count">{filteredServices.length} result(s) found</span>
          </div>
        )}

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Services</p>
            <h3 className="stat-value">{stats.totalServices}</h3>
            <div className="stat-trend positive">
              <span>📈</span>
              +2 this month
            </div>
          </div>
          <div className="stat-card">
            <p className="stat-label">Avg. Service Price</p>
            <h3 className="stat-value">${stats.avgPrice}</h3>
            <div className="stat-sub">Across all categories</div>
          </div>
          <div className="stat-card">
            <p className="stat-label">Active Bookings</p>
            <h3 className="stat-value">{stats.activeBookings}</h3>
            <div className="stat-trend positive">
              <span>📈</span>
              15% increase
            </div>
          </div>
        </div>

        {/* Add Service Button Row */}
        <div className="add-service-row">
          <button className="add-service-btn" onClick={openAddModal}>
            <span>➕</span>
            Add New Service
          </button>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {filteredServices.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-image-wrapper">
                <div className="image-overlay"></div>
                <img className="service-image" src={service.image} alt={service.name} />
                <div className="service-badge">
                  <div className="badge-icon">
                    <span>
                      {service.icon === 'dry_cleaning' ? '👔' : 
                       service.icon === 'iron' ? '👕' : 
                       service.icon === 'cleaning_services' ? '🧹' : '🧺'}
                    </span>
                  </div>
                  <span className="badge-text">{service.name}</span>
                </div>
              </div>
              <div className="service-info">
                <p className="service-description">{highlightText(service.description)}</p>
                <div className="service-category">
                  <span className={`category-tag ${service.category === 'Laundry' ? 'tag-laundry' : 
                                    service.category === 'Cleaning' ? 'tag-cleaning' : 'tag-pressing'}`}>
                    {service.category}
                  </span>
                </div>
                <div className="service-footer">
                  <div className="service-price">
                    ${service.price}<span className="price-unit">{service.unit}</span>
                  </div>
                  <div className="service-actions">
                    <button className="edit-btn" onClick={() => openEditModal(service)}>
                      <span>✏️</span>
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteClick(service)}>
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <div className="add-card" onClick={openAddModal}>
            <div className="add-icon">
              <span>➕</span>
            </div>
            <p className="add-text">Create New Service</p>
            <p className="add-subtext">Configure pricing and images</p>
          </div>
        </div>

        {/* No Results Message */}
        {searchTerm && !hasSearchResults && (
          <div className="no-results">
            <span>🔍</span>
            <p>No services found for "<strong>{searchTerm}</strong>"</p>
            <p className="no-results-suggestion">Try searching for: wash, dry, iron, clean, stain</p>
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{isEditMode ? 'Edit Service' : 'Add New Service'}</h3>
                <p className="modal-subtitle">
                  {isEditMode ? 'Update your service details.' : 'Define your service details and pricing model.'}
                </p>
              </div>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <span>✕</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Service Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="e.g. Wash & Fold"
                    value={newService.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-select"
                    value={newService.category}
                    onChange={handleInputChange}
                  >
                    <option>Laundry</option>
                    <option>Cleaning</option>
                    <option>Pressing</option>
                    <option>Alteration</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Describe the service process..."
                  rows="3"
                  value={newService.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <div className="price-input-wrapper">
                    <span className="price-currency">$</span>
                    <input
                      type="number"
                      name="price"
                      className="price-input"
                      placeholder="0.00"
                      value={newService.price}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Unit Type</label>
                  <select
                    name="unit"
                    className="form-select"
                    value={newService.unit}
                    onChange={handleInputChange}
                  >
                    <option>Per Item</option>
                    <option>Per KG</option>
                    <option>Flat Rate</option>
                    <option>Per Load</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Service Icon</label>
                <div className="icon-grid">
                  {iconOptions.map(icon => (
                    <button
                      key={icon.value}
                      className={`icon-btn ${selectedIcon === icon.value ? 'active' : ''}`}
                      onClick={() => setSelectedIcon(icon.value)}
                      title={icon.label}
                    >
                      <span>{icon.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSaveService}>
                {isEditMode ? 'Update Service' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3 className="modal-title">Delete Service</h3>
              <button className="modal-close" onClick={cancelDelete}>
                <span>✕</span>
              </button>
            </div>
            <div className="modal-body delete-body">
              <div className="delete-icon">🗑️</div>
              <p className="delete-message">
                Are you sure you want to delete <strong>"{serviceToDelete?.name}"</strong>?
              </p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="modal-footer delete-footer">
              <button className="btn-cancel" onClick={cancelDelete}>Cancel</button>
              <button className="btn-delete" onClick={confirmDelete}>Delete Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;