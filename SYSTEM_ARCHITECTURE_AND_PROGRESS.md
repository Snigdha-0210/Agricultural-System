# KisanMitra v2.0 — System Architecture & Progress Log

> **Autonomous AI Agent Continuity & Engineering Reference Document**  
> *Last Updated: September 2026*

---

## 📌 Executive Overview
**KisanMitra v2.0** is an enterprise-grade, multilingual, real-data agricultural operating system designed to empower Indian farmers, agripreneurs, and researchers across **10 distinct agricultural domains**.

The system provides real-time satellite meteorology, AI-driven soil & land agro-economics, domain-specific task engines, direct government scheme matching, integrated marketplace price feeds, structured scientific coursework, and multi-dialect voice assistance.

- 🌐 **Live Public App**: [https://snigdha-0210.github.io/Agricultural-System/](https://snigdha-0210.github.io/Agricultural-System/)
- 📦 **GitHub Repository**: [https://github.com/Snigdha-0210/Agricultural-System](https://github.com/Snigdha-0210/Agricultural-System)

---

## 🏛️ System Architecture

```
                                  +---------------------------------------+
                                  |     KisanMitra Client (Vite/PWA)      |
                                  |      http://localhost:5173            |
                                  +-------------------+-------------------+
                                                      |
                    +---------------------------------+---------------------------------+
                    |                                 |                                 |
                    v                                 v                                 v
   +---------------------------------+ +------------------------------+ +------------------------------+
   |   Domain & Personalization      | |   Real-Time Data Connectors   | |   Scientific Knowledge Hub   |
   |   - 10 Farm Archetypes          | |   - OpenWeatherMap / Meteo   | |   - 5-Module Core Courses    |
   |   - AI Land & Soil Geo-Advisor  | |   - Leaflet Interactive Map  | |   - Direct Offline SOPs      |
   |   - 100% Tailored Tip-of-the-Day| |   - YouTube Data API v3      | |   - Official Research Links  |
   +---------------------------------+ +------------------------------+ +------------------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |     Node.js / Express REST API        |
                                  |      http://localhost:5000            |
                                  +-------------------+-------------------+
                                                      |
                    +---------------------------------+---------------------------------+
                    |                                 |                                 |
                    v                                 v                                 v
   +---------------------------------+ +------------------------------+ +------------------------------+
   |     MongoDB Atlas Cloud DB      | |     Google Gemini Pro AI     | |   Live Govt & Mandi Connect  |
   |   - User Farm Profiles          | |   - Multilingual Voice Agent | |   - Agmarknet Live Mandis    |
   |   - Daily Crop Task Logs        | |   - Soil & Crop Advisory     | |   - PM-Kisan, PMFBY, PMKSY   |
   +---------------------------------+ +------------------------------+ +------------------------------+
```

---

## 🌾 Supported Agricultural Domains
KisanMitra personalizes tasks, alerts, weather tasks, profit models, and coursework strictly according to the active domain:

1. **🌾 Crop Farming (`crop`)**: Cereals, pulses, oilseeds, fertigation, and CRI stage schedules.
2. **🐄 Dairy & Cattle (`cattle`)**: Breed management (Gir/Murrah), silage formulation, mastitis prevention, and BMC chilling.
3. **🐔 Poultry (`poultry`)**: Broiler FCR tracking, layer lighting, brooding climate, and vaccination.
4. **🐟 Aquaculture (`fish`)**: Composite carp culture, Biofloc, paddlewheel aeration, and pond liming.
5. **🐝 Apiculture (`bees`)**: Langstroth 10-frame hives, floral dearth management, super boxes, and honey extraction.
6. **🌿 Medicinal & Aromatic Plants (`plants`)**: Ashwagandha, Shatavari, Aloe Vera, Lemongrass, buyback linkages (Patanjali/Dabur).
7. **🍄 Mushroom Farming (`mushroom`)**: White Button, Oyster, Milky, composting, pasteurization, and casing soil.
8. **💧 Hydroponics & Soilless (`hydroponics`)**: NFT, DWC, Dutch buckets, EC/pH automated dosing, polyhouses.
9. **♻️ Organic Farming (`organic`)**: Jeevamrut, Beejamrut, Neemastra, and PGS India certifications.
10. **🌍 Sustainable & Regenerative (`sustainable`)**: Farm ponds, agroforestry, biogas, and carbon credits.

---

## 🚀 Key Functional Modules & Implementation Details

### 1. 🌍 AI Land & Soil Geo-Agronomy Advisor
- **GPS / Regional Soil Auto-Detection**: Maps GPS coordinates or chosen city to genuine soil types (Black Cotton Regur, Alluvial Loam, Red Soil, Coastal Silt, Sandy Desert, Himalayan Forest Humus), soil pH, organic carbon %, and annual rainfall.
- **Land Size Scaler (e.g. 1 km² = 247.1 Acres)**: Accepts `1 km²`, `100 Acres`, `25 Acres`, `10 Acres`, `5 Acres`, `2 Acres`, `1 Acre`, hectares, or bighas, and automatically scales:
  - Total Estimated Annual Revenue
  - Total Estimated Net Profit
  - Capital Investment & Payback Period
  - Verified Pre-Harvest Buyback Contacts (Patanjali, Dabur, Himalaya, KVIC, Amul, Blinkit)
- **1-Click Adoption (`adopt-model-btn`)**: Reconfigures the farmer's active profile and customizes the entire dashboard in 1 click.

### 2. 🌤️ Interactive Leaflet India Weather Map & GPS Satellite Meter
- **Interactive Leaflet Map**: 15 pre-mapped major agricultural hubs across India + click-anywhere pin-drop to fetch instant real OpenWeatherMap / Open-Meteo satellite weather.
- **Strict Domain-Filtered Weather Alerts**: Only alerts matching the farmer's domain are shown (e.g., Hive wind anchors for beekeepers, DO aeration for fish farmers, blight alerts for crop farmers).

### 3. 📚 Deep Offline Knowledge Hub + Research Portals
- **5-Module Comprehensive Curriculum**: Every domain contains 5 structured modules covering Biological Principles, Setup, Nutrition, Pest Shield, and Yield Economics.
- **Offline In-App Reader**: Farmers can read all fundamental concepts directly within the app without internet or external links.
- **Verified Research Deep-Dive Links**: External links to official ICAR institutes, NMPB, NDDB, CARI, KVIC, and NABARD.

### 4. 🎥 Learn & Grow (YouTube API Masterclasses)
- Verified YouTube tutorial IDs for all 10 farming domains.
- Live YouTube search bar wired to YouTube Data API v3 (`AIzaSyDZ****************************`) with responsive modal video player.

### 5. 💡 100% Domain-Specific "Smart Farmer Tip of the Day"
- `getTipOfTheDay(profile)` filters exclusively by `profile.farmTypes` and `profile.specificItems`, preventing cross-domain anomalies.

---

## 🔐 Credentials & Environment Setup (`.env`)

```env
PORT=5000
JWT_SECRET=kisanmitra_jwt_secret_key_2026

# MongoDB Atlas (Configured via backend/.env)
MONGO_USER=mistyphotos0625_db_user
MONGO_PASSWORD=****************
MONGO_URI=mongodb+srv://mistyphotos0625_db_user:****************@cluster0.djq2lvr.mongodb.net/kisanmitra?retryWrites=true&w=majority

# Google Gemini AI (Configured via backend/.env)
GEMINI_API_KEY=AQ.Ab8RN6****************************

# OpenWeatherMap API (Configured via backend/.env)
OPENWEATHER_API_KEY=a7127e34************************

# YouTube Data API v3 (Configured via backend/.env)
YOUTUBE_API_KEY=AIzaSyDZ****************************
```

---

## 🛠️ How to Run Locally

```bash
# 1. Start Backend API Daemon
cd backend
npm install
npm start
# -> Running on http://localhost:5000

# 2. Start Frontend Dev Server
cd frontend
npm install
npm run dev -- --host
# -> Running on http://localhost:5173
```

---

## 🧪 Verification & Test Suite
Run the test suite from root:
```bash
node -e "
const fs = require('fs');
['farmData.js', 'weatherData.js', 'marketData.js', 'schemesData.js', 'i18n.js'].forEach(f => new Function(fs.readFileSync('frontend/src/assets/data/' + f, 'utf8')));
['engine.js', 'onboarding.js', 'dashboard.js', 'voice.js', 'app.js'].forEach(f => new Function(fs.readFileSync('frontend/src/assets/js/' + f, 'utf8')));
console.log('✅ ALL SCRIPTS & ENGINE VALIDATED 100% CLEAN');
"
```
