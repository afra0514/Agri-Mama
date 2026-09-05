import React, { useState, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast, { Toaster } from 'react-hot-toast';
 
const SignupPage = () => {
  const { setUser } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });

  const getPasswordStrength = (pw) => {
    if (!pw) return { label: "", score: 0, hex: "#e5e7eb" };
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[a-zA-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[!@#$%^&*]/.test(pw)) s++;
    if (s <= 2) return { label: "Weak", score: s, hex: "#ef4444" };
    if (s === 3) return { label: "Medium", score: s, hex: "#eab308" };
    return { label: "Strong", score: s, hex: "#22c55e" };
  };

  const handleVisionScroll = (id) => {
    navigate('/');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!"); 
    }

    const loadingToast = toast.loading("Creating account...");

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      toast.success(`Welcome to the family, ${res.data.username}!`, {
        id: loadingToast,
      });

      setUser(res.data); 

      setTimeout(() => {
        navigate('/chat');
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed", {
        id: loadingToast,
      });
    }
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="auth-page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      
      <Navbar />
      <main className="auth-screen">
        <div className="auth-card">
          <h2 className="auth-title">Join Agri Mama</h2>
          
          {showEmailForm ? (
            <form onSubmit={handleSignup}>
              <input type="text" placeholder="Username" className="auth-form-field" onChange={e => setFormData({...formData, username: e.target.value})} required />
              <input type="email" placeholder="Email" className="auth-form-field" onChange={e => setFormData({...formData, email: e.target.value})} required />
              <input type="password" placeholder="Password" className="auth-form-field" onChange={e => setFormData({...formData, password: e.target.value})} required />
              
              {formData.password && (
                <div className="auth-strength-container">
                  <div className="auth-strength-meter">
                    <div className="auth-strength-fill" style={{width:`${(strength.score/4)*100}%`, backgroundColor: strength.hex}}></div>
                  </div>
                  <p className="auth-strength-text" style={{color: strength.hex}}>Strength: {strength.label}</p>
                </div>
              )}
              
              <input type="password" placeholder="Confirm Password" className="auth-form-field" onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
              
              <button className="auth-main-btn">Create Account</button>
              <button type="button" onClick={()=>setShowEmailForm(false)} className="auth-back-btn">← Back</button>
            </form>
          ) : (
            <div>
              <button className="auth-google-btn">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="auth-google-icon" alt="G"/> Continue with Google
              </button>
              <div className="auth-divider-container">
                <div className="auth-divider-line"></div><span className="auth-divider-text">OR</span><div className="auth-divider-line"></div>
              </div>
              <button onClick={()=>setShowEmailForm(true)} className="auth-main-btn">Sign Up with Email</button>
            </div>
          )}

          <p className="auth-footer-link">
            Already a member? <span onClick={()=>navigate('/login')} className="auth-link-highlight">Sign In</span>
          </p>
        </div>
      </main>
      <Footer onVisionClick={handleVisionScroll} />
    </div>
  );
};

export default SignupPage;