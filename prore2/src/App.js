// App.js
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginPage from './auth/LoginPage';
import './App.css';
import PersonalInformation from './components/PersonalInformation';
import LaundryDetails from './components/LaundryDetails';
import DeliverySettings from './components/DeliverySettings';
import Services from './components/Services';
import Products from './components/Products';

// Composant Dashboard (l'application principale après connexion)
const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('personal');
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'personal':
        return <PersonalInformation setCurrentPage={setCurrentPage} />;
      case 'laundry':
        return <LaundryDetails setCurrentPage={setCurrentPage} />;
      case 'delivery':
        return <DeliverySettings setCurrentPage={setCurrentPage} />;
      case 'services':
        return <Services setCurrentPage={setCurrentPage} />;
      case 'products':
        return <Products setCurrentPage={setCurrentPage} />;
      default:
        return <PersonalInformation setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1>SaaS Cloud</h1>
            </div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-link ${currentPage === 'personal' ? 'active' : ''}`}
            onClick={() => setCurrentPage('personal')}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">Personal Info</span>
          </button>
          
          <button 
            className={`nav-link ${currentPage === 'laundry' ? 'active' : ''}`}
            onClick={() => setCurrentPage('laundry')}
          >
            <span className="nav-icon">🧺</span>
            <span className="nav-text">Laundry Info</span>
          </button>
          
          <button 
            className={`nav-link ${currentPage === 'delivery' ? 'active' : ''}`}
            onClick={() => setCurrentPage('delivery')}
          >
            <span className="nav-icon">🚚</span>
            <span className="nav-text">Delivery Settings</span>
          </button>
          
          <button 
            className={`nav-link ${currentPage === 'services' ? 'active' : ''}`}
            onClick={() => setCurrentPage('services')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Services</span>
          </button>
          
          <button 
            className={`nav-link ${currentPage === 'products' ? 'active' : ''}`}
            onClick={() => setCurrentPage('products')}
          >
            <span className="nav-icon">📦</span>
            <span className="nav-text">Products</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="user-info">
              <p className="user-name">{user?.name || 'Utilisateur'}</p>
              <p className="user-role">{user?.role || 'Admin'}</p>
            </div>
          </div>
          
          {/* Nouveau bouton de déconnexion stylisé */}
          <button className="logout-button" onClick={handleLogout}>
            <svg className="logout-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={cancelLogout}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Déconnexion</h3>
            <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="modal-buttons">
              <button className="modal-btn cancel" onClick={cancelLogout}>
                Annuler
              </button>
              <button className="modal-btn confirm" onClick={confirmLogout}>
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant qui décide d'afficher Login ou Dashboard
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LoginPage />;
};

// Composant principal
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;