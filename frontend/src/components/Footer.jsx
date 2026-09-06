import React from 'react';
import { FaLinkedin, FaGithub, FaYoutube } from 'react-icons/fa'; 
import { 
  Sprout, ShieldCheck, Recycle, Landmark, Leaf, ShieldAlert, 
  CloudSun, BookOpen, Info, Target, Mail, Shield 
} from 'lucide-react';

const Footer = ({ onVisionClick }) => {
  
  const handleLinkClick = (e, id) => {
    e.preventDefault(); 
    if (onVisionClick) {
      onVisionClick(id); 
    }
  };

  return (
    <footer className="ft-agri-footer">
      <div className="ft-footer-container">
        <div className="ft-footer-column">
          <h4 className="ft-footer-column-title">Features</h4>
          <a href="/chat" className="ft-footer-link"><ShieldCheck size={16} /> AgriGuard</a>
          <a href="/chat" className="ft-footer-link"><Recycle size={16} /> BioComp</a>
          <a href="/chat" className="ft-footer-link"><Landmark size={16} /> Ag-Gov Support</a>
          <a href="/chat" className="ft-footer-link"><Leaf size={16} /> SeedGuard</a>
          <a href="/chat" className="ft-footer-link"><ShieldAlert size={16} /> PestSafe</a>
          <a href="/chat" className="ft-footer-link"><CloudSun size={16} /> Climate Planner</a>
          <a href="/chat" className="ft-footer-link"><BookOpen size={16} /> AgriScholar</a>
        </div>

        <div className="ft-footer-column">
          <h4 className="ft-footer-column-title">Company</h4>
          <a href="#why-use" onClick={(e) => handleLinkClick(e, 'why-use')} className="ft-footer-link">
            <Info size={16} /> Why Use?
          </a>
          <a href="#our-mission" onClick={(e) => handleLinkClick(e, 'our-mission')} className="ft-footer-link">
            <Target size={16} /> Our Mission
          </a>
          <a href="#contact-us" onClick={(e) => handleLinkClick(e, 'contact-us')} className="ft-footer-link">
            <Mail size={16} /> Contact Us
          </a>
          <a href="#privacy" onClick={(e) => handleLinkClick(e, 'privacy')} className="ft-footer-link">
            <Shield size={16} /> Privacy Policy
          </a>
        </div>

        <div className="ft-footer-column">
          <h4 className="ft-footer-column-title">Follow Us</h4>
          <a href="https://linkedin.com/in/syedaafraanam" target="_blank" rel="noreferrer" className="ft-footer-link">
            <FaLinkedin size={18} /> LinkedIn
          </a>
          <a href="https://github.com/syedaafraanam" target="_blank" rel="noreferrer" className="ft-footer-link">
            <FaGithub size={18} /> GitHub
          </a>
          <a href="https://youtube.com/@syedaafraanam" target="_blank" rel="noreferrer" className="ft-footer-link">
            <FaYoutube size={18} /> YouTube
          </a>
        </div>
      </div>
      
      <div className="ft-footer-bottom">
        <div className="ft-footer-bottom-content">
          <div className="ft-brand-wrap">
            <Sprout size={24} className="ft-footer-icon"/>
            <strong>Agri Mama</strong>
          </div>
          <div className="ft-copyright">© 2026 All rights reserved.</div>
          <div className="ft-developer-tag">Developed by Syeda Afra Anam</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;