import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Sprout, Ruler, Languages, Bell, LogOut, Save, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location_lat: '',
    location_lng: '',
    crop_type: 'wheat',
    farm_area_acres: '',
    language: 'en',
    whatsapp_opt_in: true,
    sms_opt_in: true,
    email_opt_in: false,
    voice_opt_in: true
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setFormData(prev => ({
          ...prev,
          name: parsed.name || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          location_lat: parsed.location_lat || '',
          location_lng: parsed.location_lng || '',
          crop_type: parsed.crop_type || 'wheat',
          farm_area_acres: parsed.farm_area_acres || '',
          language: parsed.language || 'en',
          whatsapp_opt_in: parsed.whatsapp_opt_in !== false,
          sms_opt_in: parsed.sms_opt_in !== false,
          email_opt_in: parsed.email_opt_in || false,
          voice_opt_in: parsed.voice_opt_in !== false
        }));
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put('/auth/me', formData);
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      if (formData.language && formData.language !== i18n.language) {
        i18n.changeLanguage(formData.language);
      }
      alert('Profile saved successfully!');
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          location_lat: position.coords.latitude,
          location_lng: position.coords.longitude
        }));
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between mb-8 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl border border-emerald-500/50 flex items-center justify-center">
            <User size={24} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {t('nav.profile')}
            </h1>
            <p className="text-emerald-600 dark:text-emerald-400 mt-1 font-mono text-sm tracking-widest uppercase">
              {user?.phone || 'Manage your account'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-500/30 hover:bg-red-500/20 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-semibold">{t('nav.logout')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-[1px] bg-emerald-500" />
          <div className="bg-gray-800/80 px-6 py-2 border-b border-gray-700/50 w-full inline-block backdrop-blur-md">
            <h2 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Personal Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/30 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email (Optional)</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Language</label>
              <div className="relative">
                <Languages size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Farm Details */}
        <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-[1px] bg-orange-500" />
          <div className="bg-gray-800/80 px-6 py-2 border-b border-gray-700/50 w-full inline-block backdrop-blur-md">
            <h2 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
              Farm Details
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Crop Type</label>
              <div className="relative">
                <Sprout size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select
                  name="crop_type"
                  value={formData.crop_type}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="wheat">🌾 Wheat</option>
                  <option value="rice">🌾 Rice</option>
                  <option value="cotton">🌿 Cotton</option>
                  <option value="soybean">🫘 Soybean</option>
                  <option value="sugarcane">🌿 Sugarcane</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Farm Area (Acres)</label>
              <div className="relative">
                <Ruler size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  name="farm_area_acres"
                  value={formData.farm_area_acres}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g., 5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Location (Lat, Lng)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="number"
                    step="any"
                    name="location_lat"
                    value={formData.location_lat}
                    onChange={handleChange}
                    className="w-full pl-10 pr-2 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none text-sm"
                    placeholder="Latitude"
                  />
                </div>
                <div className="relative flex-1">
                  <input
                    type="number"
                    step="any"
                    name="location_lng"
                    value={formData.location_lng}
                    onChange={handleChange}
                    className="w-full px-2 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none text-sm"
                    placeholder="Longitude"
                  />
                </div>
                <button
                  onClick={handleLocate}
                  className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                  title="Get my location"
                >
                  <MapPin size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-[1px] bg-blue-500" />
        <div className="bg-gray-800/80 px-6 py-2 border-b border-gray-700/50 w-full inline-block backdrop-blur-md">
          <h2 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <Bell size={14} />
            Notification Preferences
          </h2>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-700 cursor-pointer hover:border-emerald-500/50 transition-colors">
            <input type="checkbox" name="whatsapp_opt_in" checked={formData.whatsapp_opt_in} onChange={handleChange} className="w-5 h-5 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500" />
            <span className="text-gray-300">WhatsApp</span>
          </label>
          <label className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-700 cursor-pointer hover:border-emerald-500/50 transition-colors">
            <input type="checkbox" name="sms_opt_in" checked={formData.sms_opt_in} onChange={handleChange} className="w-5 h-5 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500" />
            <span className="text-gray-300">SMS</span>
          </label>
          <label className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-700 cursor-pointer hover:border-emerald-500/50 transition-colors">
            <input type="checkbox" name="email_opt_in" checked={formData.email_opt_in} onChange={handleChange} className="w-5 h-5 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500" />
            <span className="text-gray-300">Email</span>
          </label>
          <label className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-700 cursor-pointer hover:border-emerald-500/50 transition-colors">
            <input type="checkbox" name="voice_opt_in" checked={formData.voice_opt_in} onChange={handleChange} className="w-5 h-5 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500" />
            <span className="text-gray-300">Voice Calls</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-500/20"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </motion.div>
  );
};

export default Profile;
