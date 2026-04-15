import React, { useState } from 'react';
import './App.css';
import PersonalInformation from './components/PersonalInformation';
import LaundryDetails from './components/LaundryDetails';
import DeliverySettings from './components/DeliverySettings';
import FixedServices from './components/FixedServices';
import FixedProducts from './components/FixedProducts';
import Ramassages from './components/Ramassages';
import { 
  User, Store, Truck, Settings, Package, 
  Menu, X, LogOut, ChevronRight, ClipboardList
} from 'lucide-react';
import { useAuth } from './context/AppProvider';
import { Routes, Route, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';

const logo = '/images/imageLogo.png';
  const user =JSON.parse(localStorage.getItem('user') || '{}');

const navItems = [
  { path: '/personal', label: 'Personal Info', icon: User },
  { path: '/laundry', label: 'Laundry Info', icon: Store },
  { path: '/delivery', label: 'Delivery Settings', icon: Truck },
  { path: '/services', label: 'Services', icon: Settings },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/ramassages', label: 'Pickups', icon: ClipboardList },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const {user, logout} = useAuth();
  const location = useLocation();


  return (
    <div className="app-layout">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setShowLogoutModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: '90%', maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
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
            <img src={logo} alt="FreshFold Logo" className="sidebar-logo" />
            <div>
              <h1 className="sidebar-title">FreshFold</h1>
              <span className="sidebar-subtitle">Dashboard</span>
            </div>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-label">Menu</div>

        <nav className="sidebar-nav">
          {navItems.map(({ path, label, icon: Icon }) => (
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
              <p className="user-name">{user.name}</p>
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
          <div className="mobile-brand">
            <img src={logo} alt="FreshFold" className="mobile-logo" />
            <span>FreshFold</span>
          </div>
          <div className="mobile-avatar">
            <User size={18} />
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/personal" replace />} />
            <Route path="/personal" element={<PersonalInformation />} />
            <Route path="/laundry" element={<LaundryDetails />} />
            <Route path="/delivery" element={<DeliverySettings />} />
            <Route path="/services" element={<FixedServices />} />
            <Route path="/products" element={<FixedProducts />} />
            <Route path="/ramassages" element={<Ramassages />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;