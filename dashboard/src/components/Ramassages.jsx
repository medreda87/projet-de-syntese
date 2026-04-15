import React, { useState, useEffect, useCallback } from 'react';
import API from '../api/axiosApi';
import AlertModal from './AlertModal';
import {
  ClipboardList, Search, Trash2, MapPin, Truck, Clock, Phone, User,
  ChevronDown, Package, ExternalLink, RefreshCw,
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: '#f59e0b', bg: '#fef3c7' },
  { value: 'confirmed', label: 'Confirmed', color: '#3b82f6', bg: '#dbeafe' },
  { value: 'picked_up', label: 'Picked Up', color: '#8b5cf6', bg: '#ede9fe' },
  { value: 'delivered', label: 'Delivered', color: '#10b981', bg: '#d1fae5' },
  { value: 'cancelled', label: 'Cancelled', color: '#ef4444', bg: '#fee2e2' },
];

const getStatusInfo = (status) => STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];

const Ramassages = () => {
  const laundry = JSON.parse(localStorage.getItem('laundry') || '{}');
  const laundryId = laundry.id;

  const [ramassages, setRamassages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const [expandedId, setExpandedId] = useState(null);

  const fetchRamassages = useCallback(async () => {
    if (!laundryId) return;
    setLoading(true);
    try {
      const res = await API.get(`/ramassages/laundry/${laundryId}`);
      setRamassages(res.data);
    } catch (err) {
      setAlert({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to load pickups.' });
    }
    setLoading(false);
  }, [laundryId]);

  useEffect(() => { fetchRamassages(); }, [fetchRamassages]);

  useEffect(() => {
    let result = ramassages;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.full_name?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q) ||
        r.pickup_address?.toLowerCase().includes(q) ||
        r.delivery_address?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }
    setFiltered(result);
  }, [ramassages, searchTerm, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/ramassages/${id}/status`, { status: newStatus });
      setRamassages(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      setAlert({ isOpen: true, type: 'success', title: 'Updated', message: `Status changed to ${getStatusInfo(newStatus).label}.` });
    } catch {
      setAlert({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to update status.' });
    }
  };

  const handleDelete = async () => {
    const { id } = confirmDelete;
    try {
      await API.delete(`/ramassages/${id}`);
      setRamassages(prev => prev.filter(r => r.id !== id));
      setConfirmDelete({ isOpen: false, id: null });
      setAlert({ isOpen: true, type: 'success', title: 'Deleted', message: 'Pickup has been deleted.' });
    } catch {
      setConfirmDelete({ isOpen: false, id: null });
      setAlert({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to delete pickup.' });
    }
  };

  const openMap = (lat, lng) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    }
  };

  const parseServices = (services) => {
    if (!services) return [];
    if (Array.isArray(services)) return services;
    try { return JSON.parse(services); } catch { return []; }
  };

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s.value] = ramassages.filter(r => r.status === s.value).length;
    return acc;
  }, {});

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert(a => ({ ...a, isOpen: false }))}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        autoClose={3000}
      />

      <AlertModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        type="warning"
        title="Delete Pickup"
        message="Are you sure you want to delete this pickup? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
      />

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <ClipboardList size={28} color="#0ea5c9" /> Pickups & Deliveries
            </h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0 0' }}>Manage your pickup and delivery orders</p>
          </div>
          <button
            onClick={fetchRamassages}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {STATUS_OPTIONS.map(s => (
          <div
            key={s.value}
            onClick={() => setStatusFilter(statusFilter === s.value ? 'all' : s.value)}
            style={{
              padding: '16px', borderRadius: 12, border: statusFilter === s.value ? `2px solid ${s.color}` : '1px solid #e2e8f0',
              background: statusFilter === s.value ? s.bg : '#fff', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <p style={{ fontSize: 24, fontWeight: 700, color: s.color, margin: 0 }}>{statusCounts[s.value] || 0}</p>
            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by name, phone, address..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        {statusFilter !== 'all' && (
          <button
            onClick={() => setStatusFilter('all')}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f1f5f9', color: '#475569', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
          >
            Clear filter
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
          <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: 12 }}>Loading pickups...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
          <Package size={48} />
          <p style={{ fontSize: 16, fontWeight: 500, marginTop: 12, color: '#64748b' }}>No pickups found</p>
          <p style={{ fontSize: 13 }}>Pickups from customers will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(r => {
            const status = getStatusInfo(r.status);
            const isExpanded = expandedId === r.id;
            const services = parseServices(r.services);

            return (
              <div key={r.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', transition: 'box-shadow 0.2s' }}>
                {/* Card Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : r.id)}
                  style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
                >
                  {/* Name & Phone */}
                  <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <User size={16} color="#64748b" />
                      <span style={{ fontWeight: 600, fontSize: 15, color: '#1e293b' }}>{r.full_name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <Phone size={13} color="#94a3b8" />
                      <span style={{ fontSize: 13, color: '#64748b' }}>{r.phone}</span>
                    </div>
                  </div>

                  {/* Services */}
                  <div style={{ flex: '1 1 120px', minWidth: 0 }}>
                    {services.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {services.map((svc, i) => (
                          <span key={i} style={{ background: '#f0f9ff', color: '#0284c7', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                            {typeof svc === 'object' ? svc.name : `Service #${svc}`}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>No services</span>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={14} color="#94a3b8" />
                    <span style={{ fontSize: 13, color: '#64748b' }}>{r.pickup_date} · {r.pickup_time}</span>
                  </div>

                  {/* Price */}
                  {r.total_price != null && (
                    <div style={{ flex: '0 0 auto' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0ea5c9' }}>
                        {parseFloat(r.total_price).toFixed(2)} DH
                      </span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div style={{ flex: '0 0 auto' }}>
                    <span style={{
                      display: 'inline-block', padding: '4px 12px', borderRadius: 20,
                      background: status.bg, color: status.color, fontSize: 12, fontWeight: 600,
                    }}>
                      {status.label}
                    </span>
                  </div>

                  {/* Chevron */}
                  <ChevronDown size={18} color="#94a3b8" style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }} />
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 16 }}>
                      {/* Pickup Info */}
                      <div style={{ padding: 16, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 600, color: '#0ea5c9', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MapPin size={16} /> Pickup Details
                        </h4>
                        <p style={{ margin: '0 0 6px 0', fontSize: 13, color: '#475569' }}>
                          <strong>Address:</strong> {r.pickup_address}
                        </p>
                        <p style={{ margin: '0 0 6px 0', fontSize: 13, color: '#475569' }}>
                          <strong>Date:</strong> {r.pickup_date}
                        </p>
                        <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#475569' }}>
                          <strong>Time:</strong> {r.pickup_time}
                        </p>
                        {r.pickup_latitude && r.pickup_longitude ? (
                          <button
                            onClick={() => openMap(r.pickup_latitude, r.pickup_longitude)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
                              background: '#0ea5c9', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                            }}
                          >
                            <ExternalLink size={14} /> View on Map
                          </button>
                        ) : (
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>No map coordinates</span>
                        )}
                      </div>

                      {/* Delivery Info */}
                      <div style={{ padding: 16, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Truck size={16} /> Delivery Details
                        </h4>
                        <p style={{ margin: '0 0 6px 0', fontSize: 13, color: '#475569' }}>
                          <strong>Address:</strong> {r.delivery_address}
                        </p>
                        <p style={{ margin: '0 0 6px 0', fontSize: 13, color: '#475569' }}>
                          <strong>Date:</strong> {r.delivery_date}
                        </p>
                        <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#475569' }}>
                          <strong>Time:</strong> {r.delivery_time}
                        </p>
                        {r.delivery_latitude && r.delivery_longitude ? (
                          <button
                            onClick={() => openMap(r.delivery_latitude, r.delivery_longitude)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
                              background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                            }}
                          >
                            <ExternalLink size={14} /> View on Map
                          </button>
                        ) : (
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>No map coordinates</span>
                        )}
                      </div>
                    </div>

                    {/* Pricing Summary */}
                    {r.total_price != null && (
                      <div style={{ marginTop: 16, padding: 16, borderRadius: 10, background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 600, color: '#0284c7' }}>💰 Pricing</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#475569' }}>
                            <span>Services total</span>
                            <span style={{ fontWeight: 500 }}>{parseFloat(r.services_total || 0).toFixed(2)} DH</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#475569' }}>
                            <span>Delivery fee</span>
                            <span style={{ fontWeight: 500, color: parseFloat(r.delivery_price) === 0 ? '#10b981' : '#475569' }}>
                              {parseFloat(r.delivery_price) === 0 ? 'Free' : `${parseFloat(r.delivery_price || 0).toFixed(2)} DH`}
                            </span>
                          </div>
                          <div style={{ borderTop: '1px solid #bae6fd', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: '#0ea5c9' }}>
                            <span>Total</span>
                            <span>{parseFloat(r.total_price).toFixed(2)} DH</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 12 }}>
                      {/* Status Update */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Update status:</span>
                        <select
                          value={r.status}
                          onChange={e => handleStatusChange(r.id, e.target.value)}
                          style={{
                            padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0',
                            fontSize: 13, background: '#fff', cursor: 'pointer', outline: 'none',
                          }}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => setConfirmDelete({ isOpen: true, id: r.id })}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
                          background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Ramassages;
