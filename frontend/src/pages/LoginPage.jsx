import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast, { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const handleVisionScroll = () => {
    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const loadingToast = toast.loading("Checking credentials...");

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        email: identifier.trim(), 
        password: password 
      });

      toast.success(`Welcome back, ${res.data.username || "Mama"}!`, {
        id: loadingToast, 
        duration: 8000,
      });

      setUser(res.data); 
      
      setTimeout(() => {
        navigate('/chat');
      }, 1000);

    } catch (err) { 
      toast.error(err.response?.data?.error || "Invalid login credentials!", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <main className="auth-screen">
        <div className="auth-card">
          <h2 className="auth-title">Authorized Access</h2>
          <form onSubmit={handleLogin}>
             <input 
                type="text" 
                placeholder="Username or Email" 
                className="auth-form-field" 
                value={identifier} 
                onChange={e => setIdentifier(e.target.value)} 
                required 
             />
             <div className="auth-form-group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="auth-form-field" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
             </div>
             <button className="auth-main-btn" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
             </button>
          </form>

          <div className="auth-divider-container">
            <div className="auth-divider-line"></div>
            <span className="auth-divider-text">OR</span>
            <div className="auth-divider-line"></div>
          </div>

          <button className="auth-google-btn" type="button">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="auth-google-icon" alt="G"/> 
            Continue with Google
          </button>

          <p className="auth-footer-link">
            New User? <span onClick={() => navigate('/signup')} className="auth-link-highlight">Register</span>
          </p>
        </div>
      </main>

      <Footer onVisionClick={handleVisionScroll} />
    </div>
  );
};

export default LoginPage;