import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // Navigation & Globals
      "nav.home": "Home",
      "nav.dashboard": "Dashboard",
      "nav.analytics": "Analytics",
      "nav.suggestions": "Suggestions",
      "nav.sensors": "Sensors",
      "nav.awareness": "Awareness",
      "nav.notifications": "Alerts",
      "nav.profile": "Profile",
      "nav.about": "About",
      "global.system_online": "SYSTEM ONLINE // KRISHI-PROTOCOL V3",
      "global.precision_agriculture": "KRISHI",
      "global.agriculture": "DRISHTI.",
      "global.desc": "Establishing neural link with global soil array... AI algorithms parsing atmospheric pressure, NPK saturation, and localized humidity. Awaiting command parameter.",
      "global.init_dashboard": "START",
      "global.user_auth": "USER AUTH",
      "global.secure_connection": "SECURE CONNECTION ESTABLISHED",
      "global.initiate_registration": "INITIATE REGISTRATION PROTOCOL",

      // Dashboard
      "dashboard.command_center": "Main Command Center",
      "dashboard.telemetry_active": "Real-time telemetry and LLM logic active.",
      "dashboard.live_sensors": "Live Sensor Array",
      "dashboard.resource_util": "Resource Utilization",
      "dashboard.neural_advice": "Neural Link Advice",
      "dashboard.moisture": "MOISTURE",
      "dashboard.npk_sync": "NPK SYNC",
      
      // Sensor Cards
      "sensor.temperature": "Temperature",
      "sensor.humidity": "Humidity",
      "sensor.soil_moisture": "Soil Moisture",
      "sensor.rain": "Rain Status",
      "sensor.status.low": "Low",
      "sensor.status.high": "High",
      "sensor.status.normal": "Normal",

      // Resource Metrics
      "resource.water_eff": "Water Usage Efficiency",
      "resource.power_con": "Power Consumption",
      "resource.fert_optimum": "Fertilizer Optimum",

      // Diagnostics Data
      "diag.title": "System Diagnostics",
      "diag.subtitle": "Active monitoring matrices initialized.",
      "diag.compute.title": "Edge Compute",
      "diag.compute.desc": "Local sensor arrays process immediate microclimate logic without latency via mainline servers.",
      "diag.mesh.title": "Mesh Telemetry",
      "diag.mesh.desc": "Acre-wide coverage via low-frequency bands establishing flawless sync between all pipelines.",
      "diag.ai.title": "Predictive AI",
      "diag.ai.desc": "Machine learning forecasting predicts potential fungal outbreaks based on atmospheric correlation.",

      // Suggestions Chat
      "chat.title": "Smart Suggestions",
      "chat.subtitle": "Powered by local LLM",
      "chat.online": "Online",
      "chat.placeholder": "Ask for farming suggestions...",
      "chat.welcome": "Hello! I am Krishi AI, your smart farming assistant. What suggestions do you need today?",

      // Alerts
      "alert.recommended": "Irrigation Recommended",
      "alert.moisture_drop": "Soil moisture has dropped below optimal levels.",
      "alert.start_pump": "Start Pump",

      // Quick Actions
      "quick.title": "Quick Actions",
      "quick.pump": "Pump Control",
      "quick.fertigate": "Fertigate",
      "quick.water": "Water Flow",
      "quick.settings": "Settings",

      // Common logic
      "common.loading": "Loading...",
      "common.error": "Error establishing connection"
    }
  },
  hi: {
    translation: {
      "nav.home": "मुख्य पृष्ठ",
      "nav.dashboard": "डैशबोर्ड",
      "nav.analytics": "एनालिटिक्स",
      "nav.suggestions": "सुझाव",
      "nav.sensors": "सेंसर",
      "nav.awareness": "जागरूकता",
      "nav.about": "हमारे बारे में",
      "global.system_online": "सिस्टम ऑनलाइन // कृषि-प्रोटोकॉल V3",
      "global.precision_agriculture": "कृषि",
      "global.agriculture": "दृष्टि।",
      "global.desc": "वैश्विक मिट्टी सरणी के साथ न्यूरल लिंक स्थापित... AI एल्गोरिदम वायुमंडलीय दबाव, एनपीके संतृप्ति, और स्थानीय आर्द्रता का विश्लेषण कर रहे हैं।",
      "global.init_dashboard": "शुरू करें",
      "global.user_auth": "उपयोगकर्ता प्रमाणीकरण",
      "global.secure_connection": "सुरक्षित कनेक्शन स्थापित",
      "global.initiate_registration": "पंजीकरण प्रोटोकॉल प्रारंभ करें",

      "dashboard.command_center": "मुख्य कमांड सेंटर",
      "dashboard.telemetry_active": "रीयल-टाइम टेलीमेट्री और LLM लॉजिक सक्रिय।",
      "dashboard.live_sensors": "लाइव सेंसर सरणी",
      "dashboard.resource_util": "संसाधन उपयोग",
      "dashboard.neural_advice": "न्यूरल लिंक सलाह",
      "dashboard.moisture": "नमी",
      "dashboard.npk_sync": "एनपीके सिंक",

      "sensor.temperature": "तापमान",
      "sensor.humidity": "नमी",
      "sensor.soil_moisture": "मिट्टी की नमी",
      "sensor.rain": "वर्षा की स्थिति",
      "sensor.status.low": "कम",
      "sensor.status.high": "उच्च",
      "sensor.status.normal": "सामान्य",

      "resource.water_eff": "जल उपयोग दक्षता",
      "resource.power_con": "बिजली की खपत",
      "resource.fert_optimum": "उर्वरक इष्टतम",

      "diag.title": "सिस्टम डायग्नोस्टिक्स",
      "diag.subtitle": "सक्रिय निगरानी मैट्रिक्स प्रारंभ की गई।",
      "diag.compute.title": "एज कंप्यूट",
      "diag.compute.desc": "स्थानीय सेंसर ऐरे मुख्य सर्वर के माध्यम से विलंबता के बिना तत्काल माइक्रॉक्लाइमेट लॉजिक को प्रोसेस करते हैं।",
      "diag.mesh.title": "मेश टेलीमेटरी",
      "diag.mesh.desc": "सभी पाइपलाइनों के बीच निर्दोष सिंक स्थापित करने वाले निम्न-आवृत्ति बैंड के माध्यम से एकड़-व्यापक कवरेज।",
      "diag.ai.title": "भविष्यवाणी करने वाला AI",
      "diag.ai.desc": "मशीन लर्निंग पूर्वानुमान वायुमंडलीय सहसंबंध के आधार पर संभावित फंगल प्रकोपों की भविष्यवाणी करता है।",

      "chat.title": "स्मार्ट सुझाव",
      "chat.subtitle": "स्थानीय LLM द्वारा संचालित",
      "chat.online": "ऑनलाइन",
      "chat.placeholder": "खेती के सुझाव पूछें...",
      "chat.welcome": "नमस्ते! मैं कृषि एआई हूँ, आपका स्मार्ट सहायक। आज आपको क्या सुझाव चाहिए?",

      "alert.recommended": "सिंचाई की सिफारिश की गई",
      "alert.moisture_drop": "मिट्टी की नमी इष्टतम स्तर से नीचे आ गई है।",
      "alert.start_pump": "पंप शुरू करें",

      "quick.title": "त्वरित क्रियाएं",
      "quick.pump": "पंप नियंत्रण",
      "quick.fertigate": "खाद देना",
      "quick.water": "जल प्रवाह",
      "quick.settings": "सेटिंग्स",

      "common.loading": "लोड हो रहा है...",
      "common.error": "कनेक्शन स्थापित करने में त्रुटि"
    }
  },
  mr: {
    translation: {
      "nav.home": "मुख्यपृष्ठ",
      "nav.dashboard": "डॅशबोर्ड",
      "nav.analytics": "विश्लेषण",
      "nav.suggestions": "सुचना",
      "nav.sensors": "सेन्सर",
      "nav.awareness": "जागरूकता",
      "nav.about": "आमच्याबद्दल",
      "global.system_online": "सिस्टम ऑनलाईन // कृषी-प्रोटोकॉल V3",
      "global.precision_agriculture": "कृषी",
      "global.agriculture": "दृष्टी.",
      "global.desc": "जागतिक माती अ‍ॅरेसह न्यूरल लिंक स्थापित करत आहे... AI अल्गोरिदम वातावरणीय दाब, NPK संपृक्तता आणि स्थानिक आर्द्रतेचे विश्लेषण करत आहे.",
      "global.init_dashboard": "सुरु करा",
      "global.user_auth": "वापरकर्ता ऑथोरायझेशन",
      "global.secure_connection": "सुरक्षित कनेक्शन स्थापित",
      "global.initiate_registration": "नोंदणी प्रक्रिया सुरू करा",

      "dashboard.command_center": "मुख्य कमांड सेंटर",
      "dashboard.telemetry_active": "रिअल-टाइम टेलीमेट्री आणि LLM लॉजिक सक्रिय.",
      "dashboard.live_sensors": "थेट सेन्सर अ‍ॅरे",
      "dashboard.resource_util": "संसाधन उपयोग",
      "dashboard.neural_advice": "न्यूरल लिंक सल्ला",
      "dashboard.moisture": "ओलावा",
      "dashboard.npk_sync": "एनपीके सिंक",

      "sensor.temperature": "तापमान",
      "sensor.humidity": "आर्द्रता",
      "sensor.soil_moisture": "मातीचा ओलावा",
      "sensor.rain": "पावसाची स्थिती",
      "sensor.status.low": "कमी",
      "sensor.status.high": "जास्त",
      "sensor.status.normal": "सामान्य",

      "resource.water_eff": "पाणी वापर कार्यक्षमता",
      "resource.power_con": "वीज वापर",
      "resource.fert_optimum": "खत इष्टतम",

      "diag.title": "सिस्टम डायग्नोस्टिक्स",
      "diag.subtitle": "सक्रिय मॉनिटरिंग मॅट्रिक्स सुरू केली.",
      "diag.compute.title": "एज कॉम्प्युट",
      "diag.compute.desc": "स्थानिक सेन्सर अ‍ॅरे मुख्य सर्व्हरद्वारे कोणत्याही विलंबाशिवाय त्वरित सूक्ष्म हवामान लॉजिकवर प्रक्रिया करतात.",
      "diag.mesh.title": "मेश टेलीमेट्री",
      "diag.mesh.desc": "सर्व जलसिंचन पाइपलाईन दरम्यान निर्दोष सिंक विनामूल्य स्थापित करणारी कमी-फ्रिक्वेन्सी बँडद्वारे एकर-व्यापक कव्हरेज.",
      "diag.ai.title": "भविष्यवाणी करणारा एआय",
      "diag.ai.desc": "मशीन लर्निंग पूर्वानुमान वातावरणातील सहसंबंधावर आधारित संभाव्य बुरशीजन्य प्रादुर्भावाचा अंदाज देते.",

      "chat.title": "स्मार्ट सुचना",
      "chat.subtitle": "स्थानिक LLM द्वारे समर्थित",
      "chat.online": "ऑनलाईन",
      "chat.placeholder": "शेतीसाठी सूचना विचारा...",
      "chat.welcome": "नमस्कार! मी कृषी एआय आहे, तुमचा स्मार्ट सहाय्यक. आज तुम्हाला काय सूचना हव्यात?",

      "alert.recommended": "सिंचनाची शिफारस",
      "alert.moisture_drop": "मातीचा ओलावा इष्टतम पातळीच्या खाली गेला आहे.",
      "alert.start_pump": "पंप सुरू करा",

      "quick.title": "त्वरित कृती",
      "quick.pump": "पंप नियंत्रण",
      "quick.fertigate": "खत देणे",
      "quick.water": "पाण्याचा प्रवाह",
      "quick.settings": "सेटिंग्ज",

      "common.loading": "लोड होत आहे...",
      "common.error": "कनेक्शन स्थापित करण्यात त्रुटी"
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
