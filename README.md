# 🌾 KrishiDrishti - AI-Powered Smart Farming Assistant

**Smart India Hackathon PS-301: IoT + AI based Smart Agriculture System**

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/react-18-blue.svg)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [PS-301 Alignment](#ps-301-alignment)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**KrishiDrishti** (कृषिदृष्टि - "Farm Vision") is a complete IoT + AI system designed for Indian farmers that provides:

- ✅ Real-time sensor data monitoring (Arduino: DHT22, soil moisture, pH, rain)
- ✅ Crop-specific AI advice using RAG + Qwen 2.5 via Ollama
- ✅ Alerts via WhatsApp/SMS/Email in Hindi/Marathi/English
- ✅ Offline-first architecture for rural connectivity
- ✅ Resource optimization (water, fertilizer, energy tracking)
- ✅ PWA support for mobile installation
- ✅ Voice alerts using text-to-speech

---

## ✨ Features

### 🤖 AI-Powered Insights
- **RAG-based Q&A**: Get farming advice using Retrieval-Augmented Generation with Qwen 2.5
- **Crop-Specific Recommendations**: Tailored advice based on crop type, sensor data, and regional knowledge
- **Structured Output**: Clear recommendations with reasons, actions, and risk warnings

### 📡 IoT Integration
- **Real-time Sensors**: Temperature, humidity, soil moisture (surface & root), pH, rain detection, water tank level
- **Arduino Compatible**: Works with DHT22, capacitive soil moisture sensors, pH sensors
- **Automatic Alerts**: Critical condition detection and multi-channel notifications

### 🌍 Multilingual Support
- **Three Languages**: English, Hindi (हिंदी), Marathi (मराठी)
- **Voice Alerts**: Text-to-speech for regional language alerts
- **UI Translation**: Complete interface localization

### 📱 Offline-First Design
- **PWA Support**: Install on mobile devices, works offline
- **Data Sync**: Queue sensor readings when offline, sync when reconnected
- **Service Workers**: Cache API responses and static assets

### 💧 Resource Optimization
- **Water Tracking**: Monitor usage vs. traditional farming methods
- **Fertilizer Management**: Track types and quantities
- **Budget Alerts**: Warnings when approaching limits
- **Savings Reports**: Show water/cost savings with smart farming

### 🔔 Multi-Channel Notifications
- **WhatsApp**: Via Twilio API
- **SMS**: Text message alerts
- **Email**: SMTP-based notifications
- **Voice Calls**: gTTS-generated voice alerts

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | FastAPI (Python 3.11+) | High-performance async API |
| **Database** | SQLite + aiosqlite | Async database operations |
| **AI/ML** | Ollama + qwen2.5:7b-instruct | Local AI inference |
| **RAG** | ChromaDB + sentence-transformers | Knowledge retrieval |
| **Frontend** | React 18 + Vite + TailwindCSS | Modern UI |
| **PWA** | Service Workers + Workbox | Offline support |
| **Notifications** | Twilio, gTTS, SMTP | Multi-channel alerts |
| **Charts** | Recharts | Data visualization |
| **i18n** | i18next | Internationalization |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Arduino + Sensors                   │
│   DHT22 | Soil Moisture | pH | Rain | Water Tank    │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP POST
                   ▼
┌─────────────────────────────────────────────────────┐
│                  FastAPI Backend                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Sensors  │  │  Auth    │  │  Notifications   │  │
│  │  Route   │  │  (OTP)   │  │  (WhatsApp/SMS)  │  │
│  └────┬─────┘  └──────────┘  └────────┬─────────┘  │
│       │                               │            │
│  ┌────▼───────────────────────────────▼─────────┐  │
│  │            SQLite Database                   │  │
│  │  Users | Sensors | Alerts | Resources        │  │
│  └──────────────────┬───────────────────────────┘  │
│                     │                              │
│  ┌──────────────────▼───────────────────────────┐  │
│  │         AI Services                          │  │
│  │  ┌────────────┐  ┌──────────────────────┐   │  │
│  │  │ RAG Engine │  │  Ollama (Qwen 2.5)   │   │  │
│  │  │ (ChromaDB) │  │  Local AI Model      │   │  │
│  │  └────────────┘  └──────────────────────┘   │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────┬─────────────────────────────────┘
                   │ REST API
                   ▼
┌─────────────────────────────────────────────────────┐
│               React Frontend (PWA)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │Dashboard │  │ AI Chat  │  │  Analytics       │  │
│  │          │  │          │  │  (Charts)        │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Offline Support | Language Toggle | PWA     │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Installation

### Prerequisites

- Python 3.11+
- Node.js 18+
- Ollama (for AI model)
- Git

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env   # Windows
cp .env.example .env     # Linux/Mac

# Edit .env and add your API keys (optional for demo)
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

### Ollama Setup

```bash
# Install Ollama from https://ollama.ai

# Pull the Qwen model
ollama pull qwen2.5:7b-instruct

# Start Ollama server
ollama serve
```

---

## 🚀 Usage

### Start Backend

```bash
cd backend
uvicorn app.main:app --reload
```

Backend runs at: **http://localhost:8000**  
API Docs: **http://localhost:8000/docs**

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at: **http://localhost:5173**

### Demo Mode (No Hardware)

The system works without Arduino for testing:
1. Login with any phone number
2. OTP for demo: `123456`
3. Use mock sensor data in dashboard
4. Test AI advice with sample questions

---

## 📚 API Documentation

Full API documentation available at **http://localhost:8000/docs** when backend is running.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/send-otp` | Send OTP to phone |
| POST | `/api/auth/verify-otp` | Verify OTP & get JWT |
| POST | `/api/sensors` | Submit sensor data |
| GET | `/api/sensors/latest` | Get latest reading |
| POST | `/api/advice` | Get AI recommendation |
| GET | `/api/weather/current` | Get weather data |
| GET | `/api/resources/summary` | Get resource usage |
| POST | `/api/notifications/test` | Send test alert |

---

## 📁 Project Structure

```
krishidrishti/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app
│   │   ├── config.py               # Settings
│   │   ├── database.py             # Async DB
│   │   ├── models.py               # SQLAlchemy models
│   │   ├── schemas.py              # Pydantic validation
│   │   ├── security.py             # JWT auth
│   │   ├── routes/                 # API endpoints
│   │   ├── services/               # Business logic
│   │   └── utils/                  # Helpers
│   ├── knowledge_base/             # Crop knowledge JSON
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── pages/                  # Page components
│   │   ├── services/               # API, offline, i18n
│   │   └── utils/                  # Helpers
│   ├── public/
│   │   ├── manifest.json           # PWA config
│   │   └── sw.js                   # Service worker
│   ├── package.json
│   └── Dockerfile
│
└── docker-compose.yml
```

---

## 🎯 PS-301 Alignment

| Requirement | Implementation |
|-------------|----------------|
| Smart decision support | RAG + Qwen AI advice |
| Resource optimization | Water/fertilizer tracking |
| Integrated data | Sensors + weather + crop knowledge |
| Simple rural interface | Voice, large buttons, regional language |
| Improved productivity | Yield predictions, early alerts |
| Sustainable farming | Resource budgets, waste reduction |

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Manual Testing

1. **Authentication**: Login with phone + OTP `123456`
2. **Sensors**: POST to `/api/sensors` with mock data
3. **AI Advice**: Use chat interface in `/advice`
4. **Notifications**: Click "Test Alert" in notifications page
5. **Offline**: Disable network, check offline banner

---

## 🐳 Deployment

### Docker Compose

```bash
docker-compose up -d
```

### Production Build

```bash
# Backend
cd backend
docker build -t krishidrishti-backend .

# Frontend
cd frontend
docker build -t krishidrishti-frontend .
```

### Environment Variables for Production

Update `.env` with:
- Twilio credentials for WhatsApp/SMS
- SMTP settings for email
- OpenWeatherMap API key
- Strong JWT secret

---

## 🔧 Troubleshooting

### Ollama Connection Error
```bash
# Check if Ollama is running
ollama list

# Restart Ollama
ollama serve
```

### Database Errors
```bash
# Delete and recreate database
rm krishidrishti.db
# Restart backend - tables will be recreated
```

### Frontend Build Fails
```bash
# Clear cache
cd frontend
rm -rf node_modules
npm install
```

### CORS Issues
Ensure `CORS_ORIGINS` in `.env` includes your frontend URL.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Team

Built for **Smart India Hackathon 2026** - Problem Statement PS-301

**KrishiDrishti** - Empowering Indian Farmers with AI 🌾🤖

---

## 📞 Support

For issues or questions:
- Open a GitHub Issue
- Check `/docs` endpoint for API details
- Review troubleshooting section above

---

**Made with ❤️ for Indian Farmers**
