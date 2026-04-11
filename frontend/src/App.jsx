import React, { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Layouts
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Sidebar from './components/common/Sidebar'
import OfflineBanner from './components/common/OfflineBanner'
import DarkBackground from './components/common/DarkBackground'

// Pages
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Suggestions from './pages/Suggestions'
import Sensors from './pages/Sensors'
import Awareness from './pages/Awareness'
import About from './pages/About'
import Profile from './pages/Profile'

// Auth Pages
import LoginPage from './components/auth/LoginPage'
import SignupPage from './components/auth/SignupPage'
import OTPVerification from './components/auth/OTPVerification'

import { useTranslation } from 'react-i18next'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

const AnimatedRoutes = ({ user }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" />} />
        <Route path="/verify-otp" element={!user ? <OTPVerification /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes (config actual protection logic later) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/sensors" element={<Sensors />} />
        <Route path="/awareness" element={<Awareness />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AnimatePresence>
  );
};

// Internal wrapper to use useLocation hook securely
const AppLayout = ({ user, OfflineBanner }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-emerald-50 dark:bg-transparent font-sans text-gray-900 dark:text-emerald-50 transition-colors duration-500 ease-in-out flex flex-col relative z-10">
      <DarkBackground />
      {!isHome && <Header />}
      
      <div className="flex flex-1 relative overflow-hidden z-10">
        {!isHome && <Sidebar />}
        
        <main className={`flex-1 overflow-y-auto w-full z-10 ${!isHome ? 'sm:ml-64 h-[calc(100vh-5rem)]' : 'h-screen'}`}>
          <AnimatedRoutes user={user} />
          {!isHome && <Footer />}
        </main>
      </div>
      
      {/* Preserved from original */}
      {OfflineBanner && <OfflineBanner />}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { i18n } = useTranslation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
       setUser(JSON.parse(userData));
    }
    
    setLoading(false)
  }, [i18n])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-emerald-950">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
         <AppLayout user={user} OfflineBanner={OfflineBanner} />
      </Router>
    </AuthContext.Provider>
  )
}

export default App
