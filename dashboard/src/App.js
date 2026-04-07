import React, { useState } from 'react';
import './App.css';
import PersonalInformation from './components/PersonalInformation';
import LaundryDetails from './components/LaundryDetails';
import DeliverySettings from './components/DeliverySettings';
import FixedServices from './components/FixedServices';
import FixedProducts from './components/FixedProducts';
import { 
  User, Store, Truck, Settings, Package, 
  Menu, X, LogOut, ChevronRight
} from 'lucide-react';

const logo = '/images/imageLogo.png';

const navItems = [
  { key: 'personal', label: 'Personal Info', icon: User },
  { key: 'laundry', label: 'Laundry Info', icon: Store },
  { key: 'delivery', label: 'Delivery Settings', icon: Truck },
  { key: 'services', label: 'Services', icon: Settings },
  { key: 'products', label: 'Products', icon: Package },
];

function App() {
  const [currentPage, setCurrentPage] = useState('personal');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch(currentPage) {
      case 'personal':
        return <PersonalInformation setCurrentPage={setCurrentPage} />;
      case 'laundry':
        return <LaundryDetails setCurrentPage={setCurrentPage} />;
      case 'delivery':
        return <DeliverySettings setCurrentPage={setCurrentPage} />;
      case 'services':
        return <FixedServices setCurrentPage={setCurrentPage} />;
      case 'products':
        return <FixedProducts setCurrentPage={setCurrentPage} />;
      default:
        return <PersonalInformation setCurrentPage={setCurrentPage} />;
    }
  };

  const handleNav = (key) => {
    setCurrentPage(key);
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
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
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`nav-link ${currentPage === key ? 'active' : ''}`}
              onClick={() => handleNav(key)}
            >
              <span className="nav-link-icon">
                <Icon size={20} />
              </span>
              <span className="nav-link-label">{label}</span>
              {currentPage === key && <ChevronRight size={16} className="nav-link-arrow" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <p className="user-name">Alex Rivera</p>
              <p className="user-role">Store Manager</p>
            </div>
            <button className="user-logout" title="Logout">
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
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;