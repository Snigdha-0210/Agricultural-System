# 🌾 KisanMitra v2.0 — Real-Time Smart Agriculture Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20Cloud-forestgreen.svg)](https://www.mongodb.com/atlas)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-blue.svg)](https://ai.google.dev/)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet.js-brightgreen.svg)](https://leafletjs.com/)

> **Next-Generation Multilingual Agricultural Operating System & AI Geo-Agronomy Advisory Platform for Indian Farmers.**

---

## 🌟 Key Highlights & Features

- 🌍 **AI Land & Soil Geo-Agronomy Advisor**:
  - Auto-detects regional soil properties (Black Cotton Regur, Alluvial, Red Soil, Desert Sand, Mountain Forest Humus), soil pH, and annual precipitation via GPS / city coordinates.
  - Scalable acreage profit engine for any land tract (e.g. `1 km²` / `247.1 Acres`, `10 Acres`, `2 Acres`, hectares, or bighas).
  - Ranks top 3 highest profit agricultural models with projected revenue, net profit, capital investment, payback period, and verified buyback linkages (Patanjali, Dabur, KVIC, Amul, Blinkit).

- 🗺️ **Interactive Leaflet India Weather Map & GPS Satellite Meter**:
  - Click anywhere on the map of India or select from 15 agricultural hubs to get instant real-time satellite forecasts.
  - 100% domain-specific weather alerts (e.g. beehive wind anchors, fish pond DO aeration, livestock heat stress).

- 📚 **Deep Offline Knowledge Hub + Research Portals**:
  - 5 structured foundational modules per farming domain readable directly inside the app offline.
  - Authoritative links to ICAR institutes, NMPB, NDDB, CARI, KVIC, and NABARD.

- 🌾 **10 Agricultural Archetypes Supported**:
  - Crop Farming (`crop`) • Dairy & Cattle (`cattle`) • Poultry (`poultry`) • Aquaculture (`fish`) • Beekeeping (`bees`) • Medicinal & Aromatic Plants (`plants`) • Mushroom Farming (`mushroom`) • Hydroponics (`hydroponics`) • Certified Organic (`organic`) • Regenerative Agriculture (`sustainable`).

- 💡 **Domain-Specific Smart Farmer Tips**:
  - Zero cross-domain leakage — medicinal plant farmers get herbal root drying tips; apiculturists get honey capping and nectar dearth guides.

- 🎥 **YouTube Masterclasses & Live Search**:
  - Embedded YouTube video tutorials and live YouTube Data API v3 search for any agricultural query.

- 🗣️ **Multilingual Voice Assistant**:
  - Voice query engine supporting English, Hindi, Punjabi, Marathi, Telugu, Tamil, and Bengali.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: Vanilla HTML5, CSS3 Glassmorphism design system, Modular Vanilla JavaScript, Leaflet.js Interactive Maps, YouTube IFrame API.
- **Backend**: Node.js, Express.js REST API daemon.
- **Database**: MongoDB Atlas Cloud DB.
- **AI / APIs**: Google Gemini Pro API, OpenWeatherMap API, Open-Meteo Satellite API, YouTube Data API v3.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/Snigdha-0210/Agricultural-System.git
cd Agricultural-System
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the backend folder:
```bash
cp backend/.env.example backend/.env
```
Fill in your API keys:
- `MONGO_URI`
- `GEMINI_API_KEY`
- `OPENWEATHER_API_KEY`
- `YOUTUBE_API_KEY`

### 3. Start Backend Server
```bash
cd backend
npm install
npm start
# -> Backend active on http://localhost:5000
```

### 4. Start Frontend Application
In a new terminal:
```bash
cd frontend
npm install
npm run dev -- --host
# -> Frontend active on http://localhost:5173
```

---

## 📜 License
Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 🤝 Acknowledgements
- Indian Council of Agricultural Research (ICAR)
- National Medicinal Plants Board (NMPB)
- National Dairy Development Board (NDDB)
- OpenWeatherMap & Open-Meteo
- Google Gemini AI
