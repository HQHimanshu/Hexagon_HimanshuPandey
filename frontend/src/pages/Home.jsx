import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../App'
import { ArrowRight, Smartphone, Brain, Languages, Bell, WifiOff, TrendingUp } from 'lucide-react'

const Home = () => {
  const { t } = useTranslation()
  const { user } = useAuth()

  const features = [
    {
      icon: Smartphone,
      title: 'Real-time Monitoring',
      description: 'Monitor soil moisture, temperature, humidity and more in real-time',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'AI-Powered Advice',
      description: 'Get intelligent recommendations powered by Qwen AI and crop knowledge',
      color: 'from-primary-500 to-green-500'
    },
    {
      icon: Languages,
      title: 'Multilingual Support',
      description: 'Available in Hindi, Marathi, and English for better understanding',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Receive alerts via WhatsApp, SMS, Email, and Voice calls',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: WifiOff,
      title: 'Offline-First Design',
      description: 'Works seamlessly in rural areas with intermittent connectivity',
      color: 'from-gray-500 to-gray-700'
    },
    {
      icon: TrendingUp,
      title: 'Resource Optimization',
      description: 'Track and optimize water, fertilizer, and energy usage',
      color: 'from-teal-500 to-emerald-500'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-7xl mb-6 animate-pulse-slow">🌾</div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {t('home.title')}
            </h1>
            <p className="text-2xl text-primary-300 mb-4">
              {t('home.subtitle')}
            </p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              {t('home.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-primary flex items-center space-x-2 text-lg px-8 py-3"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary flex items-center space-x-2 text-lg px-8 py-3"
                >
                  <span>{t('home.get_started')}</span>
                  <ArrowRight size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          {t('home.features') || 'Key Features'}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 card-hover border border-gray-700"
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* PS-301 Alignment */}
      <div className="bg-gray-800/50 border-t border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              🎯 Aligned with Smart India Hackathon PS-301
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-3xl mb-2">🤖</div>
                <h4 className="text-white font-semibold mb-2">Smart Decision Support</h4>
                <p className="text-gray-400 text-sm">RAG + Qwen AI for intelligent recommendations</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-3xl mb-2">💧</div>
                <h4 className="text-white font-semibold mb-2">Resource Optimization</h4>
                <p className="text-gray-400 text-sm">Water, fertilizer, and energy tracking</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-3xl mb-2">🌐</div>
                <h4 className="text-white font-semibold mb-2">Rural-Friendly</h4>
                <p className="text-gray-400 text-sm">Voice alerts, offline mode, regional languages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
