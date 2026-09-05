import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, LogOut, LogIn, History, PlusCircle, Menu, X, MessageSquare, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
 
const Sidebar = ({ onNewChat, sessions, activeId, onSessionClick, onDelete }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`sb-sidebar-container ${isCollapsed ? 'sb-sidebar-collapsed' : 'sb-sidebar-expanded'}`}>
      
       <div className="sb-sidebar-header">
        {!isCollapsed && (
          <div className="sb-brand-section" onClick={() => navigate('/')}>
            <Sprout className="sb-brand-icon" size={28} />
            <span className="sb-brand-name">Agri Mama</span>
          </div>
        )}
        <button className="sb-icon-btn-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <Menu size={24} /> : <X size={20} />}
        </button>
      </div>

       <div className="sb-nav-section">
        <button className="sb-new-chat-btn" onClick={onNewChat}>
          <PlusCircle size={20} />
          {!isCollapsed && <span>New Chat</span>}
        </button>
        
        <div className="sb-history-area">
            {!isCollapsed ? (
                <div className="sb-history-title">Recent Logs</div>
            ) : (
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px', opacity: 0.4}}>
                   <History size={20} />
                </div>
            )}
            
            <div className="sb-session-list">
                {user ? (
                    sessions.map((s) => (
                        <div key={s._id} className={`sb-session-item ${activeId === s._id ? 'sb-session-active' : ''}`}>
                           <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: 1, overflow: 'hidden'}} onClick={() => onSessionClick(s._id)}>
                              <MessageSquare size={14} style={{opacity: 0.4, shrink: 0}} />
                              {!isCollapsed && <span className="sb-session-text">{s.sessionName}</span>}
                           </div>
                           
                           {!isCollapsed && (
                             <button className="sb-delete-btn" style={{background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', opacity: 0.6}} onClick={(e) => { e.stopPropagation(); onDelete(s._id); }}>
                               <Trash2 size={14} />
                             </button>
                           )}
                        </div>
                    ))
                ) : (
                    !isCollapsed && <div className="sb-history-guest">Sign in for history.</div>
                )}
            </div>
        </div>
      </div>

      <div className="sb-sidebar-footer">
        {user ? (<div className="sb-user-footer">
          {!isCollapsed && <div className="sb-username-display">User: {user.username}</div>}
          <button onClick={logout} className="sb-logout-btn">
            <LogOut size={20}/> 
            {!isCollapsed && <span>Logout</span>}
            </button>
            </div>) : (<button onClick={() => navigate('/login')} className="sb-signin-btn">
            <LogIn size={20}/> {!isCollapsed && <span>Sign In</span>}
          </button>)}
      </div>
    </aside>
  );
};

export default Sidebar;