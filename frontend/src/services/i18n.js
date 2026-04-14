import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.dashboard": "Dashboard",
      "nav.analytics": "Analytics",
      "nav.advice": "AI Advice",
      "nav.resources": "Resources",
      "nav.notifications": "Notifications",
      "nav.profile": "Profile",
      "nav.login": "Login",
      "nav.logout": "Logout",
      
      // Home page
      "home.title": "KrishiDrishti",
      "home.subtitle": "AI-Powered Smart Farming Assistant",
      "home.description": "Empowering Indian farmers with real-time insights, multilingual support, and intelligent resource optimization.",
      "home.get_started": "Get Started",
      "home.features": "Features",
      "home.feature_1": "Real-time sensor monitoring",
      "home.feature_2": "AI-powered crop recommendations",
      "home.feature_3": "Multilingual support (Hindi, Marathi, English)",
      "home.feature_4": "WhatsApp/SMS/Email alerts",
      "home.feature_5": "Offline-first design",
      "home.feature_6": "Resource optimization tracking",

      // Dashboard
      "dashboard.title": "Dashboard",
      "dashboard.sensor_data": "Sensor Data",
      "dashboard.weather": "Weather",
      "dashboard.quick_actions": "Quick Actions",
      "dashboard.recent_alerts": "Recent Alerts",
      "dashboard.latest_advice": "Latest Advice",

      // Sensors
      "sensor.temperature": "Temperature",
      "sensor.humidity": "Humidity",
      "sensor.soil_moisture": "Soil Moisture",
      "sensor.ph_level": "pH Level",
      "sensor.rain": "Rain Detected",
      "sensor.water_tank": "Water Tank Level",

      // Common
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.view": "View",
      "common.close": "Close",
      "common.offline": "You're offline",
      "common.online": "Back online",
      "common.sync": "Syncing data...",

      // Auth
      "auth.login": "Login",
      "auth.phone": "Phone Number",
      "auth.send_otp": "Send OTP",
      "auth.verify_otp": "Verify OTP",
      "auth.otp_sent": "OTP sent successfully",
      "auth.otp_verified": "OTP verified successfully",

      // Language
      "language.en": "English",
      "language.hi": "हिंदी (Hindi)",
      "language.mr": "मराठी (Marathi)",
    }
  },
  hi: {
    translation: {
      "nav.home": "होम",
      "nav.dashboard": "डैशबोर्ड",
      "nav.analytics": "एनालिटिक्स",
      "nav.advice": "AI सलाह",
      "nav.resources": "संसाधन",
      "nav.notifications": "सूचनाएं",
      "nav.profile": "प्रोफ़ाइल",
      "nav.login": "लॉगिन",
      "nav.logout": "लॉगआउट",

      "home.title": "कृषिदृष्टि",
      "home.subtitle": "AI-संचालित स्मार्ट खेती सहायक",
      "home.description": "भारतीय किसानों को वास्तविक समय की अंतर्दृष्टि, बहुभाषी समर्थन और बुद्धिमान संसाधन अनुकूलन के साथ सशक्त बनाना।",
      "home.get_started": "शुरू करें",

      "dashboard.title": "डैशबोर्ड",
      "dashboard.sensor_data": "सेंसर डेटा",
      "dashboard.weather": "मौसम",

      "sensor.temperature": "तापमान",
      "sensor.humidity": "नमी",
      "sensor.soil_moisture": "मिट्टी की नमी",
      "sensor.ph_level": "pH स्तर",
      "sensor.rain": "बारिश का पता चला",
      "sensor.water_tank": "पानी की टंकी",

      "common.loading": "लोड हो रहा है...",
      "common.error": "त्रुटि",
      "common.success": "सफलता",
      "common.save": "सहेजें",
      "common.cancel": "रद्द करें",

      "language.en": "English",
      "language.hi": "हिंदी",
      "language.mr": "मराठी",
    }
  },
  mr: {
    translation: {
      "nav.home": "होम",
      "nav.dashboard": "डॅशबोर्ड",
      "nav.analytics": "ॲनालिटिक्स",
      "nav.advice": "AI सल्ला",
      "nav.resources": "संसाधने",
      "nav.notifications": "सूचना",
      "nav.profile": "प्रोफाइल",
      "nav.login": "लॉगिन",
      "nav.logout": "लॉगआउट",

      "home.title": "कृषिदृष्टी",
      "home.subtitle": "AI-संचालित स्मार्ट शेती सहाय्यक",
      "home.description": "भारतीय शेतकऱ्यांना रिअल-टाइम अंतर्दृष्टी, बहुभाषिक समर्थन आणि हुशार संसाधन ऑप्टिमायझेशनसहित सक्षम करणे.",
      "home.get_started": "सुरू करा",

      "dashboard.title": "डॅशबोर्ड",
      "dashboard.sensor_data": "सेन्सर डेटा",
      "dashboard.weather": "हवामान",

      "sensor.temperature": "तापमान",
      "sensor.humidity": "ओलावा",
      "sensor.soil_moisture": "मातीची ओलावा",
      "sensor.ph_level": "pH स्तर",
      "sensor.rain": "पाऊस आढळला",
      "sensor.water_tank": "पाणी टाकी",

      "common.loading": "लोड होत आहे...",
      "common.error": "त्रुटी",
      "common.success": "यश",
      "common.save": "जतन करा",
      "common.cancel": "रद्द करा",

      "language.en": "English",
      "language.hi": "हिंदी",
      "language.mr": "मराठी",
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
