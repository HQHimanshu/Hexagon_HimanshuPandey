import React, { useState } from 'react'
import { useAuth } from '../../App'
import { authAPI } from '../../services/api'
import { CROP_TYPES } from '../../utils/constants'
import { User, MapPin, Sprout, Ruler } from 'lucide-react'

const ProfileSetup = ({ onComplete }) => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    crop_type: user?.crop_type || '',
    farm_area_acres: user?.farm_area_acres || '',
    location_lat: user?.location_lat || '',
    location_lng: user?.location_lng || ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await authAPI.updateProfile(formData)
      updateUser(formData)
      onComplete?.()
    } catch (err) {
      console.error('Failed to update profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Complete Your Profile</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">
            <User size={16} className="inline mr-2" />
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            className="input-field"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            <Sprout size={16} className="inline mr-2" />
            Crop Type
          </label>
          <select
            value={formData.crop_type}
            onChange={handleChange('crop_type')}
            className="input-field"
          >
            <option value="">Select crop</option>
            {CROP_TYPES.map(crop => (
              <option key={crop.value} value={crop.value}>
                {crop.icon} {crop.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            <Ruler size={16} className="inline mr-2" />
            Farm Area (acres)
          </label>
          <input
            type="number"
            value={formData.farm_area_acres}
            onChange={handleChange('farm_area_acres')}
            className="input-field"
            placeholder="e.g., 5"
            step="0.1"
            min="0"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            <MapPin size={16} className="inline mr-2" />
            Location (optional)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={formData.location_lat}
              onChange={handleChange('location_lat')}
              className="input-field"
              placeholder="Latitude"
              step="0.0001"
            />
            <input
              type="number"
              value={formData.location_lng}
              onChange={handleChange('location_lng')}
              className="input-field"
              placeholder="Longitude"
              step="0.0001"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                  setFormData(prev => ({
                    ...prev,
                    location_lat: pos.coords.latitude,
                    location_lng: pos.coords.longitude
                  }))
                })
              }
            }}
            className="btn-secondary mt-2 text-sm"
          >
            Use Current Location
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}

export default ProfileSetup
