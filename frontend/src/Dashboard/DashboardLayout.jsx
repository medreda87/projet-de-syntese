import React, { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';
import './dashboard-base.css';
import PersonalInformation from './components/PersonalInformation';
import LaundryDetails from './components/LaundryDetails';
import DeliverySettings from './components/DeliverySettings';
import FixedServices from './components/FixedServices';
import FixedProducts from './components/FixedProducts';
import Ramassages from './components/Ramassages';
import Comments from './components/Comments';
import {
  User, Store, Truck, Settings, Package,
  Menu, X, LogOut, ChevronRight, ClipboardList, MessageSquare
} from 'lucide-react';
import API from './api/axiosApi';
import { useAuth } from '../contexts/AuthContext';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import BrandLogo from '../Components/BrandLogo';

const navItems = [
  { path: '/dashboard/personal', label: 'Personal Info', icon: User },
  { path: '/dashboard/laundry', label: 'Laundry Info', icon: Store },
  { path: '/dashboard/delivery', label: 'Delivery Settings', icon: Truck },
  { path: '/dashboard/services', label: 'Services', icon: Settings },
  { path: '/dashboard/products', label: 'Products', icon: Package },
  { path: '/dashboard/ramassages', label: 'Pickups', icon: ClipboardList, badgeKey: 'ramassages' },
  { path: '/dashboard/comments', label: 'Reviews', icon: MessageSquare, badgeKey: 'comments' },
];

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [badges, setBadges] = useState({ ramassages: 0, comments: 0 });
  const { user, logout } = useAuth();
  const location = useLocation();

  const laundry = JSON.parse(localStorage.getItem('laundry') || '{}');
  const laundryId = laundry.id;

  const fetchBadges = useCallback(async () => {
    if (!laundryId) return;
    try {
      const [rRes, cRes] = await Promise.all([
        API.get(`/ramassages/laundry/${laundryId}`),
        API.get(`/comments/laundry/${laundryId}`)
      ]);
      const rCount = (rRes.data || []).length;
      const cCount = (cRes.data || []).length;
      const seenR = parseInt(localStorage.getItem(`seen_ramassages_${laundryId}`) || '0', 10);
      const seenC = parseInt(localStorage.getItem(`seen_comments_${laundryId}`) || '0', 10);
      setBadges({
        ramassages: Math.max(0, rCount - seenR),
        comments: Math.max(0, cCount - seenC),
      });
    } catch (_) {}
  }, [laundryId]);

  useEffect(() => { fetchBadges(); }, [fetchBadges]);

  // Clear badge when user visits the page
  useEffect(() => {
    if (!laundryId) return;
    const mark = async (key, endpoint, stateKey) => {
      try {
        const res = await API.get(endpoint);
        const count = (res.data || []).length;
        localStorage.setItem(`seen_${stateKey}_${laundryId}`, count);
        setBadges(prev => ({ ...prev, [stateKey]: 0 }));
      } catch (_) {}
    };
    if (location.pathname === '/dashboard/ramassages')
      mark('ramassages', `/ramassages/laundry/${laundryId}`, 'ramassages');
    if (location.pathname === '/dashboard/comments')
      mark('comments', `/comments/laundry/${laundryId}`, 'comments');
  }, [location.pathname, laundryId]);

  return (
    <div className="app-layout">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: 16, padding: 24, width: '90%', maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', background: '#fee2e2', margin: '0 auto 16px' }}>
              <LogOut size={22} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', textAlign: 'center', margin: '0 0 8px' }}>Logout</h3>
            <p style={{ fontSize: 14, color: '#64748b', textAlign: 'center', margin: '0 0 24px' }}>Are you sure you want to logout from the dashboard?</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{ flex: 1, padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#1e293b', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowLogoutModal(false); logout(); }}
                style={{ flex: 1, padding: '10px 16px', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <BrandLogo
              imgClassName="sidebar-logo"
              nameTag="h1"
              nameClassName="sidebar-title"
              showSubtitle
              subtitleClassName="sidebar-subtitle"
            />
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-label">Menu</div>

        <nav className="sidebar-nav">
          {navItems.map(({ path, label, icon: Icon, badgeKey }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-link-icon">
                <Icon size={20} />
              </span>
              <span className="nav-link-label">{label}</span>
              {badgeKey && badges[badgeKey] > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  minWidth: 20,
                  height: 20,
                  borderRadius: 99,
                  background: '#22c55e',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 6px',
                }}>
                  {badges[badgeKey]}
                </span>
              )}
              {location.pathname === path && <ChevronRight size={16} className="nav-link-arrow" />}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <p className="user-name">{user?.name || user?.provider_name || 'User'}</p>
              <p className="user-role">Store Manager</p>
            </div>
            <button className="user-logout" title="Logout" onClick={() => setShowLogoutModal(true)}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        {/* Mobile top bar */}
        <header className="mobile-topbar">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          {/* <div className="mobile-brand">
            <img src={logo} alt="Mesbanati" className="mobile-logo" />
            <span>Mesbanati</span>
          </div> */}
          <div className="mobile-avatar">
            <User size={18} />
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route index element={<Navigate to="/dashboard/personal" replace />} />
            <Route path="personal" element={<PersonalInformation />} />
            <Route path="laundry" element={<LaundryDetails />} />
            <Route path="delivery" element={<DeliverySettings />} />
            <Route path="services" element={<FixedServices />} />
            <Route path="products" element={<FixedProducts />} />
            <Route path="ramassages" element={<Ramassages />} />
            <Route path="comments" element={<Comments />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
