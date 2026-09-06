import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUp, Leaf, Sprout, Landmark, TrendingUp, CloudSun, BookOpen, Search,
  Info, Target, Mail, Shield, AlertCircle, Zap
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeHighlight, setActiveHighlight] = useState(null);

  const modules = [
    { id: "m0", title: "AgriGuard", desc: "Specialized in diagnosing diseases for Bangladeshi Paddy and Jute crops.", img: "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { id: "m1", title: "BioComp", desc: "Step-by-step guidance on creating organic compost suited for local soil health restoration.", img: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=800" },
    { id: "m2", title: "Ag-Gov Support", desc: "Instant access to Bangladeshi government subsidies, agri-loans, and latest policies.", img: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800" },
    { id: "m3", title: "SeedGuard", desc: "Ensures high-yield harvests by verifying the authenticity of local seed packets.", img: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800&auto=format&fit=crop" },
    { id: "m4", title: "PestSafe", desc: "Scans pesticide labels to provide safe application protocols specifically for tropical Bangladeshi farming.", img: "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { id: "m5", title: "ClimateSmart Planner", desc: "Get real-time monsoon weather alerts and live bazaar prices from local Bangladeshi markets.", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80" },
    { id: "m6", title: "AgriScholar", desc: "Summarizes complex agri-journals and assists in local research paper drafting for students and scientists.", img: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800" }
  ];

  const quickLinks = [
    { name: "Paddy Disease", icon: <Leaf size={16} /> },
    { name: "Jute Farming", icon: <Sprout size={16} /> },
    { name: "Agri Loans", icon: <Landmark size={16} /> },
    { name: "Market Prices", icon: <TrendingUp size={16} /> },
    { name: "Weather Updates", icon: <CloudSun size={16} /> },
    { name: "Research Help", icon: <BookOpen size={16} /> }
  ];

  const mainVision = [
    { 
        id: "why-use", 
        title: "Why use?", 
        icon: <AlertCircle size={32} />, 
        desc: "Traditional farming in Bangladesh faces a massive information gap. Small-scale farmers often lose 30-40% of their yield due to misdiagnosed crop diseases and counterfeit seeds. Researchers struggle to synthesize data scattered across fragmented portals." 
    },
    { 
        id: "our-mission", 
        title: "Our Mission!", 
        icon: <Zap size={32} />, 
        desc: "Agri Mama deploys an intelligent multi-agent AI system. Using Computer Vision for disease diagnosis and RAG-based retrieval for subsidies, we turn complex agricultural data into simple, automated workflows for farmers and scientists." 
    }
  ];

  const supportVision = [
    { id: "contact-us", title: "Contact Us", icon: <Mail size={24} />, desc: "Need technical help or local agri-partnership? Our 24/7 team is here." },
    { id: "privacy", title: "Privacy Policy", icon: <Shield size={24} />, desc: "Your farm data and research papers are secured with bank-grade encryption." }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % modules.length), 3000);
    return () => clearInterval(timer);
  }, [modules.length]);

  useEffect(() => {
    const container = document.querySelector('.lp-sidebar-scroll');
    const activeCard = document.getElementById(`sidebar-card-${currentSlide}`);
    if (container && activeCard) {
      container.scrollTo({ top: activeCard.offsetTop - 10, behavior: 'smooth' });
    }
  }, [currentSlide]);

  const handleVisionScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveHighlight(id);
      setTimeout(() => setActiveHighlight(null), 2500);
    }
  };

  return (
    <div className="lp-outer-container">
      <div className="lp-gradient-bg"></div>
      <div className="lp-landing-wrapper">
        <Navbar />
        
        <header className="lp-hero-section">
          <h1 className="lp-hero-title">One Solution for Every<br/> <span>Agri Source</span></h1>
          <p className="lp-hero-subtitle">Smart AI assistance for Farmers and Researchers.</p>
          <div className="lp-search-container" onClick={() => navigate('/chat')}>
            <div className="lp-search-icon-left"><Search size={20}/></div>
            <input type="text" placeholder="Ask about crops, prices, or research..." className="lp-search-box-fake" readOnly />
            <div className="lp-search-submit-btn"><ArrowUp size={24}/></div>
          </div>
          <div className="lp-pill-list">
            {quickLinks.map((pill, idx) => (
              <div key={idx} className="lp-pill-item"><span>{pill.icon}</span> {pill.name}</div>
            ))}
          </div>
        </header>

        <section className="lp-main-content-grid">
          <div className="lp-slider-container" onClick={() => navigate('/chat')}>
            {modules.map((m, idx) => (
              <div key={idx} className={`lp-slide-item ${idx === currentSlide ? 'lp-active' : ''}`}>
                <img src={m.img} alt={m.title} className="lp-slide-img" />
              </div>
            ))}
          </div>
          <div className="lp-sidebar-scroll">
            <div className="lp-sidebar-inner">
              {modules.map((item, index) => (
                <div key={index} id={`sidebar-card-${index}`} className={`lp-module-card ${index === currentSlide ? 'lp-active' : ''}`} onClick={() => setCurrentSlide(index)}>
                  <h3 className="lp-card-title">{item.title}</h3>
                  <p className="lp-card-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-vision-section">
          <h2 className="lp-section-label">Trust & Transparency</h2>
          
          <div className="lp-vision-grid-main">
            {mainVision.map((v) => (
              <div key={v.id} id={v.id} onClick={() => handleVisionScroll(v.id)} className={`lp-vision-card-large ${activeHighlight === v.id ? 'lp-highlight-pulse' : ''}`}>
                <div className="lp-vision-icon-wrap-large">{v.icon}</div>
                <div className="lp-vision-content-large">
                    <span className="lp-vision-caption">{v.caption}</span>
                    <h3 className="lp-vision-card-title-large">{v.title}</h3>
                    <p className="lp-vision-card-desc-large">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lp-vision-grid-small">
            {supportVision.map((v) => (
              <div key={v.id} id={v.id} onClick={() => handleVisionScroll(v.id)} className={`lp-vision-card-small ${activeHighlight === v.id ? 'lp-highlight-pulse' : ''}`}>
                <div className="lp-vision-icon-wrap-small">{v.icon}</div>
                <div className="lp-vision-content-small">
                    <h3 className="lp-vision-card-title-small">{v.title}</h3>
                    <p className="lp-vision-card-desc-small">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Footer onVisionClick={handleVisionScroll} />
      </div>
    </div>
  );
};

export default LandingPage;