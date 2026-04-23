import React, { useState } from 'react';
import './DeliverySettings.css';
import { Search, DollarSign, ShoppingCart, MapPin, CreditCard, Gift, Cake, Settings2, Map, X, Bell, User } from 'lucide-react';
import AlertModal from './AlertModal';
import API from '../api/axiosApi';

const DeliverySettings = ({ setCurrentPage }) => {
  const laundry = JSON.parse(localStorage.getItem('laundry') || '{}');
  const existingDelivery = laundry.delivery ?? null;

  const [deliveryType, setDeliveryType] = useState(existingDelivery?.type || 'distance');
  const [pricePerKm, setPricePerKm] = useState(parseFloat(existingDelivery?.price_per_km) || 5.50);
  const [fixedPrice, setFixedPrice] = useState(parseFloat(existingDelivery?.fixed_price) || 10.00);
  const [minOrderAmount, setMinOrderAmount] = useState(parseFloat(existingDelivery?.min_order) || 50.00);
  const [deliveryRadius, setDeliveryRadius] = useState(parseFloat(existingDelivery?.delivery_radius) || 25);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const handleSave = async () => {
    try {
      await API.post('deliveries', {
        laundry_id: laundry.id,
        type: deliveryType,
        price_per_km: deliveryType === 'distance' ? parseFloat(pricePerKm) : null,
        fixed_price: ['fixed', 'free_above'].includes(deliveryType) ? parseFloat(fixedPrice) : null,
        min_order: deliveryType === 'free_above' ? parseFloat(minOrderAmount) : null,
        delivery_radius: parseFloat(deliveryRadius),
      });
      setAlert({ isOpen: true, type: 'success', title: 'Saved!', message: 'Delivery settings saved successfully.' });
    } catch (err) {
      setAlert({ isOpen: true, type: 'error', title: 'Save Failed', message: err.response?.data?.message || 'An error occurred. Please try again.' });
    }
  };

  const handleDiscard = () => {
    setAlert({
      isOpen: true,
      type: 'warning',
      title: 'Discard Changes?',
      message: 'All unsaved changes will be reset to defaults.',
      confirmText: 'Discard',
      cancelText: 'Keep Editing',
      onConfirm: () => {
        setDeliveryType(existingDelivery?.type || 'distance');
        setPricePerKm(parseFloat(existingDelivery?.price_per_km) || 5.50);
        setFixedPrice(parseFloat(existingDelivery?.fixed_price) || 10.00);
        setMinOrderAmount(parseFloat(existingDelivery?.min_order) || 50.00);
        setDeliveryRadius(parseFloat(existingDelivery?.delivery_radius) || 25);
      },
    });
  };

  const sections = [
    { id: 'delivery-pricing', title: 'Delivery Pricing Model', subtitle: 'Select the method that best fits your operational logistics.' },
    { id: 'distance-option', title: 'By Distance', subtitle: 'Dynamic pricing based on shop distance.' },
    { id: 'fixed-option', title: 'Fixed Price', subtitle: 'Flat rate regardless of destination.' },
    { id: 'free_above-option', title: 'Free Over Amount', subtitle: 'Incentivize larger orders.' },
    { id: 'free-option', title: 'Always Free', subtitle: 'Offer complimentary delivery.' },
    { id: 'config-details', title: 'Configuration Details', subtitle: '' },
    { id: 'delivery-radius', title: 'Delivery Radius', subtitle: 'Define your service area boundary.' },
  ];

  const matchesSearch = (texts) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return texts.some(text => text.toLowerCase().includes(searchLower));
  };

  const shouldShowSection = (sectionId) => {
    if (!searchTerm) return true;
    const section = sections.find(s => s.id === sectionId);
    if (section) return matchesSearch([section.title, section.subtitle]);
    return true;
  };

  const shouldShowDeliveryOption = (optionTitle, optionDesc) => {
    if (!searchTerm) return true;
    return matchesSearch([optionTitle, optionDesc]);
  };

  const shouldShowConfig = () => {
    if (!searchTerm) return true;
    const configTexts = [];
    switch (deliveryType) {
      case 'distance': configTexts.push('Price per kilometer', 'MAD', 'Google Maps API'); break;
      case 'fixed': configTexts.push('Fixed Price', 'MAD', 'Flat rate'); break;
      case 'free_above': configTexts.push('Minimum Order Amount', 'MAD', 'Free delivery'); break;
      case 'free': configTexts.push('free for all orders'); break;
      default: break;
    }
    return matchesSearch(configTexts);
  };

  const deliveryOptions = [
    { value: 'distance', icon: MapPin, title: 'By Distance', desc: 'Dynamic pricing based on shop distance.' },
    { value: 'fixed', icon: CreditCard, title: 'Fixed Price', desc: 'Flat rate regardless of destination.' },
    { value: 'free_above', icon: Gift, title: 'Free Over Amount', desc: 'Incentivize larger orders.' },
    { value: 'free', icon: Cake, title: 'Always Free', desc: 'Offer complimentary delivery.' },
  ];

  const renderConfigDetails = () => {
    switch (deliveryType) {
      case 'distance':
        return (
          <div className="ds-config-details">
            <label className="ds-config-label">Price per kilometer (MAD)</label>
            <div className="ds-input-icon">
              <DollarSign size={16} />
              <input type="number" step="0.01" className="ds-config-input" value={pricePerKm} onChange={(e) => setPricePerKm(parseFloat(e.target.value))} />
            </div>
            <p className="ds-config-hint">Calculated automatically using Google Maps API distance.</p>
          </div>
        );
      case 'fixed':
        return (
          <div className="ds-config-details">
            <label className="ds-config-label">Fixed Price (MAD)</label>
            <div className="ds-input-icon">
              <DollarSign size={16} />
              <input type="number" step="0.01" className="ds-config-input" value={fixedPrice} onChange={(e) => setFixedPrice(parseFloat(e.target.value))} />
            </div>
            <p className="ds-config-hint">Flat rate applied to all deliveries.</p>
          </div>
        );
      case 'free_above':
        return (
          <div className="ds-config-details">
            <label className="ds-config-label">Minimum Order Amount (MAD)</label>
            <div className="ds-input-icon">
              <ShoppingCart size={16} />
              <input type="number" step="0.01" className="ds-config-input" value={minOrderAmount} onChange={(e) => setMinOrderAmount(parseFloat(e.target.value))} />
            </div>
            <p className="ds-config-hint">Free delivery for orders above this amount.</p>
            <label className="ds-config-label" style={{ marginTop: '1rem', display: 'block' }}>Fee charged below minimum (MAD)</label>
            <div className="ds-input-icon">
              <DollarSign size={16} />
              <input type="number" step="0.01" className="ds-config-input" value={fixedPrice} onChange={(e) => setFixedPrice(parseFloat(e.target.value))} />
            </div>
            <p className="ds-config-hint">Delivery fee when order total is below the minimum.</p>
          </div>
        );
      case 'free':
        return (
          <div className="ds-config-details">
            <div className="ds-free-message">
              <Gift size={20} />
              <p>Delivery is completely free for all orders!</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ds-page">
      <AlertModal isOpen={alert.isOpen} onClose={() => setAlert({ ...alert, isOpen: false })} type={alert.type} title={alert.title} message={alert.message} confirmText={alert.confirmText} cancelText={alert.cancelText} onConfirm={alert.onConfirm} autoClose={alert.type === 'success' ? 3000 : 0} />

      {/* Topbar */}
      <div className="ds-topbar">
        <div>
          <h1 className="ds-topbar-title">Delivery Settings</h1>
          <p className="ds-topbar-sub">Configure shipping fees and delivery zones</p>
        </div>
        <div className="ds-topbar-actions">
          <div className="ds-search">
            <Search size={16} />
            <input type="text" placeholder="Search settings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            {searchTerm && <button className="ds-search-clear" onClick={() => setSearchTerm('')}><X size={14} /></button>}
          </div>
          <button className="ds-topbar-btn"><Bell size={18} /></button>
          <button className="ds-topbar-btn"><User size={18} /></button>
        </div>
      </div>

      {/* Content */}
      <div className="ds-content">
        {searchTerm && (
          <div className="ds-search-info">
            <Search size={14} />
            <p>Searching for: <strong>"{searchTerm}"</strong></p>
          </div>
        )}

        {/* Pricing Model Card */}
        {shouldShowSection('delivery-pricing') && (
          <div className="ds-card">
            <div className="ds-card-header">
              <div className="ds-card-icon"><Settings2 size={20} /></div>
              <div>
                <h3 className="ds-card-title">Delivery Pricing Model</h3>
                <p className="ds-card-sub">Select the method that best fits your operational logistics.</p>
              </div>
            </div>

            <div className="ds-options-grid">
              {deliveryOptions.map((opt) => {
                if (!shouldShowDeliveryOption(opt.title, opt.desc)) return null;
                const Icon = opt.icon;
                const isActive = deliveryType === opt.value;
                return (
                  <label className="ds-option-label" key={opt.value}>
                    <input type="radio" name="delivery-type" value={opt.value} checked={isActive} onChange={(e) => setDeliveryType(e.target.value)} className="ds-option-radio" />
                    <div className={`ds-option-card${isActive ? ' active' : ''}`}>
                      <div className="ds-option-top">
                        <Icon size={22} />
                        <div className={`ds-radio-dot${isActive ? ' active' : ''}`}><div className="ds-radio-inner" /></div>
                      </div>
                      <span className="ds-option-title">{opt.title}</span>
                      <p className="ds-option-desc">{opt.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            {shouldShowConfig() && (
              <div className="ds-config-section">
                <h4 className="ds-config-section-title">Configuration Details</h4>
                {renderConfigDetails()}
              </div>
            )}
          </div>
        )}

        {/* Delivery Radius Card */}
        {shouldShowSection('delivery-radius') && (
          <div className="ds-radius-card">
            <div className="ds-radius-left">
              <div className="ds-card-icon"><Map size={20} /></div>
              <div>
                <p className="ds-radius-title">Delivery Radius</p>
                <p className="ds-radius-sub">Define your service area boundary.</p>
              </div>
            </div>
            <div className="ds-radius-control">
              <input type="number" className="ds-radius-input" value={deliveryRadius} onChange={(e) => setDeliveryRadius(parseFloat(e.target.value))} />
              <span className="ds-radius-unit">KM</span>
            </div>
          </div>
        )}

        {/* No results */}
        {searchTerm && !shouldShowSection('delivery-pricing') && !shouldShowSection('delivery-radius') && !shouldShowConfig() && (
          <div className="ds-no-results">
            <Search size={24} />
            <p>No results for "<strong>{searchTerm}</strong>"</p>
            <p className="ds-no-results-hint">Try: distance, price, free, radius, delivery</p>
          </div>
        )}

        {/* Actions */}
        <div className="ds-actions">
          <button className="btn btn--outline" onClick={handleDiscard}>Discard Changes</button>
          <button className="btn btn--primary" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default DeliverySettings;