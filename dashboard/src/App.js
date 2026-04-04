import React, { useState } from 'react';
import './App.css';
import PersonalInformation from './components/PersonalInformation';
import LaundryDetails from './components/LaundryDetails';
import DeliverySettings from './components/DeliverySettings';
import Services from './components/Services';
import Products from './components/Products';
const logo = '/images/imageLogo.png'
function App() {
  // Changement ici : 'personal' au lieu de 'products'
  const [currentPage, setCurrentPage] = useState('personal');

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
          
            </div>
                <div className='header-left'>
                        <img src={logo} alt="FreshFold Logo" style={{width: "45px", height: "45px",objectFit:"contain",display: "block",margin:"10px",borderRadius:'10px'}}/>
                        <h1 className='site-title'>FreshFold</h1>
                </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-link ${currentPage === 'personal' ? 'active' : ''}`}
            onClick={() => setCurrentPage('personal')}
          >
           
            <span>👤Personal Info</span>
          </button>
          
          <button 
            className={`nav-link ${currentPage === 'laundry' ? 'active' : ''}`}
            onClick={() => setCurrentPage('laundry')}
          >
            
            <span style={{fontWeight:"bold"}}>🧺 Laundry Info</span>
          </button>
          
          <button 
            className={`nav-link ${currentPage === 'delivery' ? 'active' : ''}`}
            onClick={() => setCurrentPage('delivery')}
          >
       
            <span>🚚Delivery Settings</span>
          </button>
          
          <button 
            className={`nav-link ${currentPage === 'services' ? 'active' : ''}`}
            onClick={() => setCurrentPage('services')}
          >
         
            <span>⚙️Services</span>
          </button>
          
          <button 
            className={`nav-link ${currentPage === 'products' ? 'active' : ''}`}
            onClick={() => setCurrentPage('products')}
          >
          
            <span>📦Products</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar"></div>
            <div className="user-info">
              <p className="user-name">Alex Rivera</p>
              <p className="user-role">Store Manager</p>
            </div>
            <button className="user-settings">
              <span className="material-symbols-outlined"></span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;