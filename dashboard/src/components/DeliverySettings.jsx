import React, { useState } from 'react';
import './DeliverySettings.css';
import API from '../api/axiosApi';
const DeliverySettings = ({ setCurrentPage }) => {
  const [deliveryType, setDeliveryType] = useState('distance');
  const [pricePerKm, setPricePerKm] = useState(5.50);
  const [fixedPrice, setFixedPrice] = useState(10.00);
  const [minOrderAmount, setMinOrderAmount] = useState(50.00);
  const [deliveryRadius, setDeliveryRadius] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
    await API.post('deliveries', {
      laundry_id: 4,
      type: deliveryType,
      price_per_km: parseFloat(pricePerKm),
      fixed_price: parseFloat(fixedPrice),
      min_order: parseFloat(minOrderAmount),
      delivery_radius: parseFloat(deliveryRadius) 
    })
  };




  const handleDiscard = () => {
    setDeliveryType('distance');
    setPricePerKm(5.50);
    setFixedPrice(10.00);
    setMinOrderAmount(50.00);
    setDeliveryRadius(25);
  };

  // Données des sections pour la recherche
  const sections = [
    { id: 'delivery-pricing', title: 'Delivery Pricing Model', subtitle: 'Select the method that best fits your operational logistics.' },
    { id: 'distance-option', title: 'By Distance', subtitle: 'Dynamic pricing based on shop distance.' },
    { id: 'fixed-option', title: 'Fixed Price', subtitle: 'Flat rate regardless of destination.' },
    { id: 'threshold-option', title: 'Free Over Amount', subtitle: 'Incentivize larger orders.' },
    { id: 'free-option', title: 'Always Free', subtitle: 'Offer complimentary delivery.' },
    { id: 'config-details', title: 'Configuration Details', subtitle: '' },
    { id: 'delivery-radius', title: 'Delivery Radius', subtitle: 'Define your service area boundary.' },
  ];

  // Fonction pour vérifier si une section correspond à la recherche
  const matchesSearch = (texts) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return texts.some(text => text.toLowerCase().includes(searchLower));
  };

  // Filtrer les sections
  const shouldShowSection = (sectionId) => {
    if (!searchTerm) return true;
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      return matchesSearch([section.title, section.subtitle]);
    }
    return true;
  };

  // Filtrer les options de livraison
  const shouldShowDeliveryOption = (optionTitle, optionDesc) => {
    if (!searchTerm) return true;
    return matchesSearch([optionTitle, optionDesc]);
  };

  const renderConfigDetails = () => {
    switch(deliveryType) {
      case 'distance':
        return (
          <div className="config-details" id="distance-config">
            <label className="config-label">Price per kilometer (MAD)</label>
            <div className="input-with-icon">
              <span className="input-icon">💰</span>
              <input
                type="number"
                step="0.01"
                className="config-input"
                value={pricePerKm}
                onChange={(e) => setPricePerKm(parseFloat(e.target.value))}
              />
            </div>
            <p className="config-hint">Calculated automatically using Google Maps API distance.</p>
          </div>
        );
      case 'fixed':
        return (
          <div className="config-details" id="fixed-config">
            <label className="config-label">Fixed Price (MAD)</label>
            <div className="input-with-icon">
              <span className="input-icon">💰</span>
              <input
                type="number"
                step="0.01"
                className="config-input"
                value={fixedPrice}
                onChange={(e) => setFixedPrice(parseFloat(e.target.value))}
              />
            </div>
            <p className="config-hint">Flat rate applied to all deliveries.</p>
          </div>
        );
      case 'threshold':
        return (
          <div className="config-details" id="threshold-config">
            <label className="config-label">Minimum Order Amount (MAD)</label>
            <div className="input-with-icon">
              <span className="input-icon">🛒</span>
              <input
                type="number"
                step="0.01"
                className="config-input"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(parseFloat(e.target.value))}
              />
            </div>
            <p className="config-hint">Free delivery for orders above this amount.</p>
          </div>
        );
      case 'free':
        return (
          <div className="config-details" id="free-config">
            <div className="free-message">
              <span className="free-icon">🎉</span>
              <p className="free-text">Delivery is completely free for all orders!</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Vérifier si la configuration actuelle correspond à la recherche
  const shouldShowConfig = () => {
    if (!searchTerm) return true;
    const configTexts = [];
    
    switch(deliveryType) {
      case 'distance':
        configTexts.push('Price per kilometer', 'MAD', 'Calculated automatically using Google Maps API distance');
        break;
      case 'fixed':
        configTexts.push('Fixed Price', 'MAD', 'Flat rate applied to all deliveries');
        break;
      case 'threshold':
        configTexts.push('Minimum Order Amount', 'MAD', 'Free delivery for orders above this amount');
        break;
      case 'free':
        configTexts.push('Delivery is completely free for all orders');
        break;
    }
    
    return matchesSearch(configTexts);
  };

  return (
    <div className="delivery-settings-container">
      {/* Header avec onglets */}
      <div className="page-header">
        <div className="header-tabs">
        </div>
        
        <div className="header-actions">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search settings..."
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

      {/* Main Content */}
      <div className="delivery-content">
        <div className="content-wrapper">
          {/* Search Info */}
          {searchTerm && (
            <div className="search-info">
              <span>🔍</span>
              <p>Searching for: <strong>"{searchTerm}"</strong></p>
            </div>
          )}

          <div className="page-title-section">
            <h1 className="page-title">Delivery Settings</h1>
            <p className="page-subtitle">Configure how you calculate and charge shipping fees for your laundry orders.</p>
          </div>

          {/* Delivery Type Section - Filtrable */}
          {shouldShowSection('delivery-pricing') && (
            <div className="delivery-card" id="delivery-pricing">
              <div className="card-header-icon">
                <div className="icon-circle">
                  <span>⚙️</span>
                </div>
                <div>
                  <h3 className="card-title">Delivery Pricing Model</h3>
                  <p className="card-subtitle">Select the method that best fits your operational logistics.</p>
                </div>
              </div>

              {/* Radio Options Grid - Filtrable */}
              <div className="options-grid">
                {/* Option 1: Distance */}
                {shouldShowDeliveryOption('By Distance', 'Dynamic pricing based on shop distance.') && (
                  <label className="option-label">
                    <input
                      type="radio"
                      name="delivery-type"
                      value="distance"
                      checked={deliveryType === 'distance'}
                      onChange={(e) => setDeliveryType(e.target.value)}
                      className="option-radio"
                    />
                    <div className={`option-card ${deliveryType === 'distance' ? 'active' : ''}`}>
                      <div className="option-header">
                        <span className="option-icon">📍</span>
                        <div className={`radio-dot ${deliveryType === 'distance' ? 'active' : ''}`}>
                          <div className="radio-inner"></div>
                        </div>
                      </div>
                      <span className="option-title">By Distance</span>
                      <p className="option-description">Dynamic pricing based on shop distance.</p>
                    </div>
                  </label>
                )}

                {/* Option 2: Fixed Price */}
                {shouldShowDeliveryOption('Fixed Price', 'Flat rate regardless of destination.') && (
                  <label className="option-label">
                    <input
                      type="radio"
                      name="delivery-type"
                      value="fixed"
                      checked={deliveryType === 'fixed'}
                      onChange={(e) => setDeliveryType(e.target.value)}
                      className="option-radio"
                    />
                    <div className={`option-card ${deliveryType === 'fixed' ? 'active' : ''}`}>
                      <div className="option-header">
                        <span className="option-icon">💳</span>
                        <div className={`radio-dot ${deliveryType === 'fixed' ? 'active' : ''}`}>
                          <div className="radio-inner"></div>
                        </div>
                      </div>
                      <span className="option-title">Fixed Price</span>
                      <p className="option-description">Flat rate regardless of destination.</p>
                    </div>
                  </label>
                )}

                {/* Option 3: Free Above Amount */}
                {shouldShowDeliveryOption('Free Over Amount', 'Incentivize larger orders.') && (
                  <label className="option-label">
                    <input
                      type="radio"
                      name="delivery-type"
                      value="threshold"
                      checked={deliveryType === 'threshold'}
                      onChange={(e) => setDeliveryType(e.target.value)}
                      className="option-radio"
                    />
                    <div className={`option-card ${deliveryType === 'threshold' ? 'active' : ''}`}>
                      <div className="option-header">
                        <span className="option-icon">🎁</span>
                        <div className={`radio-dot ${deliveryType === 'threshold' ? 'active' : ''}`}>
                          <div className="radio-inner"></div>
                        </div>
                      </div>
                      <span className="option-title">Free Over Amount</span>
                      <p className="option-description">Incentivize larger orders.</p>
                    </div>
                  </label>
                )}

                {/* Option 4: Completely Free */}
                {shouldShowDeliveryOption('Always Free', 'Offer complimentary delivery.') && (
                  <label className="option-label">
                    <input
                      type="radio"
                      name="delivery-type"
                      value="free"
                      checked={deliveryType === 'free'}
                      onChange={(e) => setDeliveryType(e.target.value)}
                      className="option-radio"
                    />
                    <div className={`option-card ${deliveryType === 'free' ? 'active' : ''}`}>
                      <div className="option-header">
                        <span className="option-icon">🎉</span>
                        <div className={`radio-dot ${deliveryType === 'free' ? 'active' : ''}`}>
                          <div className="radio-inner"></div>
                        </div>
                      </div>
                      <span className="option-title">Always Free</span>
                      <p className="option-description">Offer complimentary delivery.</p>
                    </div>
                  </label>
                )}
              </div>

              {/* Dynamic Input Section - Filtrable */}
              {shouldShowConfig() && (
                <div className="config-section">
                  <h4 className="config-section-title">Configuration Details</h4>
                  {renderConfigDetails()}
                </div>
              )}
            </div>
          )}

          {/* Additional Options Card - Filtrable */}
          {shouldShowSection('delivery-radius') && (
            <div className="additional-card" id="delivery-radius">
              <div className="additional-content">
                <div className="additional-icon">
                  <span>🗺️</span>
                </div>
                <div>
                  <p className="additional-title">Delivery Radius</p>
                  <p className="additional-subtitle">Define your service area boundary.</p>
                </div>
              </div>
              <div className="radius-control">
                <input
                  type="number"
                  className="radius-input"
                  value={deliveryRadius}
                  onChange={(e) => setDeliveryRadius(parseFloat(e.target.value))}
                />
                <span className="radius-unit">KM</span>
              </div>
            </div>
          )}

          {/* Message quand aucun résultat trouvé */}
          {searchTerm && (
            (() => {
              const hasResults = shouldShowSection('delivery-pricing') || shouldShowSection('delivery-radius');
              if (!hasResults && !shouldShowConfig()) {
                return (
                  <div className="search-no-results">
                    <span>🔍</span>
                    <p>No results found for "<strong>{searchTerm}</strong>"</p>
                    <p className="search-suggestion">Try searching for: distance, price, free, radius, delivery, kilometer</p>
                  </div>
                );
              }
              return null;
            })()
          )}

          {/* Save Action - Toujours visible */}
          <div className="action-buttons">
            <button className="btn-discard" onClick={handleDiscard}>
              Discard Changes
            </button>
            <button className="btn-save" onClick={handleSave}>
              Save Settings
            </button>
          </div>

          {/* Save Confirmation - Affiché après sauvegarde */}
          {isSaved && (
            <div className="save-confirmation">
              <span>✅</span>
              <p>Settings saved successfully!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliverySettings;