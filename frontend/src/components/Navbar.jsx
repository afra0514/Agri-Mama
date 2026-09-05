import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sprout } from 'lucide-react';
 
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const user = JSON.parse(localStorage.getItem('user'));

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <nav className="nb-agri-navbar">
      <div className="nb-logo-section" onClick={() => navigate('/')}>
        <Sprout size={32} className="nb-logo-icon"/>
        <span className="nb-logo-text">Agri Mama</span>
      </div>

      <div className="nb-actions-section">
        {user ? (
          <button 
            onClick={() => navigate('/chat')} 
            className="nb-btn-primary"
          >
            Go to Chat
          </button>
        ) : (
          <>
            {!isAuthPage && (
              <button 
                onClick={() => navigate('/login')} 
                className="nb-btn-secondary"
              >
                Log in
              </button>
            )}
            
            <button 
              onClick={() => navigate('/chat')} 
              className="nb-btn-primary"
            >
              Try Now
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;