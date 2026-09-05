import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Global styles (Make sure @import "tailwindcss"; is at the top of this file)
import './App.css'; 

// Context Provider
import { AuthProvider } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatWindow from './pages/ChatWindow';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Main Chat Interface */}
          <Route path="/chat" element={<ChatWindow />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;