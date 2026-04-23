import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Calendar, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',    color: '#f59e0b', bg: '#fffbeb', icon: Clock },
  confirmed: { label: 'Confirmed',  color: '#3b82f6', bg: '#eff6ff', icon: CheckCircle },
  picked_up: { label: 'Picked Up',  color: '#8b5cf6', bg: '#f5f3ff', icon: Package },
  delivered: { label: 'Delivered',  color: '#22c55e', bg: '#f0fdf4', icon: CheckCircle },
  cancelled: { label: 'Cancelled',  color: '#ef4444', bg: '#fef2f2', icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 99, background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 600 }}>
      <Icon size={13} /> {cfg.label}
    </span>
  );
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const formatPrice = (p) => p !== undefined && p !== null ? `${parseFloat(p).toFixed(2)} MAD` : '—';

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const services = (() => { try { return JSON.parse(order.services || '[]'); } catch { return []; } })();

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: 16 }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg, #0C8CE9, #06D6A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Package size={20} color="#fff" />
          </div>
          <div>
            <p style={{ fontWeight: 700, color: '#1e293b', fontSize: 15, margin: 0 }}>
              {order.laundry?.name || 'Laundry Service'}
            </p>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>Order #{order.id}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusBadge status={order.status} />
          <p style={{ fontWeight: 700, color: '#0C8CE9', fontSize: 15, margin: 0 }}>{formatPrice(order.total_price)}</p>
        </div>
      </div>

      {/* Key info row */}
      <div style={{ padding: '0 20px 16px', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
          <Calendar size={14} color="#0C8CE9" />
          Pickup: {formatDate(order.pickup_date)} {order.pickup_time && `at ${order.pickup_time}`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
          <Truck size={14} color="#06D6A0" />
          Delivery: {formatDate(order.delivery_date)} {order.delivery_time && `at ${order.delivery_time}`}
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ width: '100%', padding: '10px 20px', background: '#f8fafc', border: 'none', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: 13, color: '#64748b', fontWeight: 500 }}
      >
        <span>View details</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Pickup Address</p>
              <p style={{ fontSize: 13, color: '#475569', margin: 0, display: 'flex', gap: 4 }}><MapPin size={14} color="#0C8CE9" style={{ flexShrink: 0, marginTop: 2 }} />{order.pickup_address}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Delivery Address</p>
              <p style={{ fontSize: 13, color: '#475569', margin: 0, display: 'flex', gap: 4 }}><MapPin size={14} color="#06D6A0" style={{ flexShrink: 0, marginTop: 2 }} />{order.delivery_address}</p>
            </div>
          </div>

          {services.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Services</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {services.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#475569' }}>
                    <span>{s.name}</span>
                    <span style={{ fontWeight: 600 }}>{formatPrice(s.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {order.services_total != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b' }}>
                <span>Services total</span><span>{formatPrice(order.services_total)}</span>
              </div>
            )}
            {order.delivery_price != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b' }}>
                <span>Delivery</span><span>{parseFloat(order.delivery_price) === 0 ? 'Free' : formatPrice(order.delivery_price)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: '#1e293b', borderTop: '1px solid #e2e8f0', paddingTop: 8, marginTop: 4 }}>
              <span>Total</span><span style={{ color: '#0C8CE9' }}>{formatPrice(order.total_price)}</span>
            </div>
          </div>

          {order.laundry && (
            <Link
              to={`/${encodeURIComponent(order.laundry.name)}?laundry_id=${order.laundry.id}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#0C8CE9', fontWeight: 500, textDecoration: 'none', marginTop: 4 }}
            >
              View laundry →
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/ramassages');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  return (
    <main className="bg-background min-h-screen">
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back to home
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1e293b', margin: 0 }}>My Orders</h1>
        <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0 0' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          style={{ padding: '6px 14px', borderRadius: 99, border: filter === 'all' ? 'none' : '1px solid #e2e8f0', background: filter === 'all' ? 'linear-gradient(135deg, #0C8CE9, #06D6A0)' : '#fff', color: filter === 'all' ? '#fff' : '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          All ({orders.length})
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => counts[key] > 0 && (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{ padding: '6px 14px', borderRadius: 99, border: filter === key ? 'none' : '1px solid #e2e8f0', background: filter === key ? cfg.color : '#fff', color: filter === key ? '#fff' : '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            {cfg.label} ({counts[key]})
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #e0e0e0', borderTop: '3px solid #0C8CE9', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <Package size={40} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontWeight: 600, color: '#1e293b', fontSize: 16, margin: '0 0 8px' }}>No orders yet</p>
          <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 20px' }}>
            {filter === 'all' ? "You haven't placed any orders yet." : `No ${STATUS_CONFIG[filter]?.label.toLowerCase()} orders.`}
          </p>
          <Link to="/shops" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 10, background: 'linear-gradient(135deg, #0C8CE9, #06D6A0)', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            Find a laundry
          </Link>
        </div>
      ) : (
        filtered.map(order => <OrderCard key={order.id} order={order} />)
      )}
    </div>
    </main>
  );
};

export default MyOrders;
