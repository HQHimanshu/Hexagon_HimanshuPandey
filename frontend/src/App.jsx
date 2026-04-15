import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
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
import SensorDetail from './pages/SensorDetail'
import Awareness from './pages/Awareness'
import About from './pages/About'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import Account from './pages/Account'

import { useTranslation } from 'react-i18next'

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* All Routes - No Authentication Required */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/sensors" element={<Sensors />} />
        <Route path="/sensors/:sensorId" element={<SensorDetail />} />
        <Route path="/awareness" element={<Awareness />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </AnimatePresence>
  );
};

// Internal wrapper to use useLocation hook securely
const AppLayout = ({ OfflineBanner }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-emerald-50 dark:bg-transparent font-sans text-gray-900 dark:text-emerald-50 transition-colors duration-500 ease-in-out flex flex-col relative z-10">
      <DarkBackground />
      {!isHome && <Header />}
      
      <div className="flex flex-1 relative overflow-hidden z-10">
        {!isHome && <Sidebar />}
        
        <main className={`flex-1 overflow-y-auto w-full z-10 ${!isHome ? 'sm:ml-64 h-[calc(100vh-5rem)]' : 'h-screen'}`}>
          <AnimatedRoutes />
          {!isHome && <Footer />}
        </main>
      </div>
      
      {/* Preserved from original */}
      {OfflineBanner && <OfflineBanner />}
    </div>
  );
};

function App() {
  const { i18n } = useTranslation()

  return (
    <Router>
       <AppLayout OfflineBanner={OfflineBanner} />
    </Router>
  )
}

export default App
