// ============================================
// KisanMitra — Weather Simulation Data
// Simulates real-time weather for Indian conditions
// ============================================

const WEATHER_PRESETS = {
  'amritsar': { city: 'Amritsar', state: 'Punjab', zone: 'north' },
  'ludhiana': { city: 'Ludhiana', state: 'Punjab', zone: 'north' },
  'jaipur': { city: 'Jaipur', state: 'Rajasthan', zone: 'arid' },
  'mumbai': { city: 'Mumbai', state: 'Maharashtra', zone: 'coastal' },
  'pune': { city: 'Pune', state: 'Maharashtra', zone: 'semi-arid' },
  'nashik': { city: 'Nashik', state: 'Maharashtra', zone: 'semi-arid' },
  'bengaluru': { city: 'Bengaluru', state: 'Karnataka', zone: 'tropical' },
  'chennai': { city: 'Chennai', state: 'Tamil Nadu', zone: 'coastal' },
  'hyderabad': { city: 'Hyderabad', state: 'Telangana', zone: 'semi-arid' },
  'kolkata': { city: 'Kolkata', state: 'West Bengal', zone: 'humid' },
  'default': { city: 'Your Location', state: 'India', zone: 'tropical' },
};

// April 2026 simulated weather fallback
function generateWeatherFallback(location) {
  const month = 4; // April
  const key = location ? location.toLowerCase().split(',')[0].trim() : 'default';
  const preset = WEATHER_PRESETS[key] || WEATHER_PRESETS.default;

  const isArid = preset.zone === 'arid';
  const isCoastal = preset.zone === 'coastal';
  const isNorth = preset.zone === 'north';

  // Seasonal temperature simulation (April = hot season in most of India)
  const baseTemp = isArid ? 38 : isNorth ? 33 : isCoastal ? 32 : 34;
  const humidity = isCoastal ? 82 : isArid ? 25 : 55;
  const rainChance = isCoastal ? 30 : isArid ? 5 : 15;

  const conditions = rainChance > 25
    ? ['Partly Cloudy', 'Cloudy', 'Light Rain', 'Partly Cloudy', 'Cloudy', 'Hazy', 'Sunny']
    : isArid
    ? ['Sunny', 'Hot & Dry', 'Sunny', 'Windy', 'Sunny', 'Hot & Dry', 'Sunny']
    : ['Sunny', 'Partly Cloudy', 'Sunny', 'Hazy', 'Sunny', 'Partly Cloudy', 'Sunny'];

  const icons = {
    'Sunny': '☀️', 'Hot & Dry': '🌵', 'Partly Cloudy': '⛅', 'Cloudy': '☁️',
    'Light Rain': '🌦️', 'Windy': '💨', 'Hazy': '🌫️',
  };
  const bannerClass = {
    'Sunny': 'sunny', 'Hot & Dry': 'sunny', 'Partly Cloudy': 'sunny-part',
    'Cloudy': 'cloudy', 'Light Rain': 'rainy', 'Windy': 'cloudy', 'Hazy': 'cloudy',
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const forecast = conditions.map((cond, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const variation = Math.floor(Math.random() * 4) - 2;
    const temp = baseTemp + variation;
    return {
      day: i === 0 ? 'Today' : days[d.getDay()],
      condition: cond,
      icon: icons[cond] || '☀️',
      temp: `${temp}°`,
      low: `${temp - 8}°`,
      rain: rainChance + (Math.random() > 0.5 ? 5 : -5) + '%',
      bannerClass: bannerClass[cond] || 'sunny',
    };
  });

  const todayWeather = forecast[0];
  const tomorrow = forecast[1];

  // Generate farming-relevant weather advice
  let advice = '';
  if (todayWeather.condition === 'Light Rain' || todayWeather.condition === 'Cloudy') {
    advice = '🚫 Do NOT spray pesticides today — rain will wash them off';
  } else if (isArid && baseTemp > 40) {
    advice = '🔥 Extreme heat — irrigate crops in early morning or evening only';
  } else if (todayWeather.condition === 'Windy') {
    advice = '💨 Avoid spraying today — wind drift. Best time: early morning';
  } else if (todayWeather.condition === 'Sunny') {
    advice = '☀️ Good day for harvesting, spraying, and outdoor farm work';
  } else {
    advice = '⛅ Moderate weather — routine farm activities can proceed';
  }

  // Will it rain tomorrow?
  const rainTomorrow = tomorrow.condition.includes('Rain') || tomorrow.condition.includes('Cloudy');

  // Mock soil data
  const soil = {
    moisture: Math.floor(40 + Math.random() * 40),
    temp: `${baseTemp - 4}°C`,
    ph: (6.5 + Math.random()).toFixed(1),
    n: 'Medium', p: 'Medium', k: 'High'
  };

  return {
    location: `${preset.city}, ${preset.state}`,
    current: {
      temp: `${baseTemp}°C`,
      feelsLike: `${baseTemp + 3}°C`,
      condition: todayWeather.condition,
      icon: todayWeather.icon,
      humidity: `${humidity}%`,
      wind: `${Math.floor(8 + Math.random() * 12)} km/h`,
      uv: isArid ? 'Very High' : 'High',
      bannerClass: todayWeather.bannerClass,
    },
    advice,
    rainTomorrow,
    forecast,
    soil
  };
}

// ── Smart alerts strictly tailored to user's selected farm types ──
function getWeatherAlerts(weather, farmTypes = ['crop']) {
  const alerts = [];
  const { current, rainTomorrow } = weather;
  const types = Array.isArray(farmTypes) ? farmTypes : ['crop'];

  if (rainTomorrow) {
    if (types.includes('bees')) {
      alerts.push({
        type: 'warning',
        icon: '🐝',
        title: 'Rain & Strong Winds Alert for Apiary',
        desc: 'Heavy rain expected tomorrow. Anchor bee boxes, reduce hive entrance size, and secure top covers.',
        time: 'Next 24 hours',
      });
    } else if (types.includes('fish')) {
      alerts.push({
        type: 'warning',
        icon: '🐟',
        title: 'Pond Runoff & Overflow Precaution',
        desc: 'Heavy rain expected tomorrow. Inspect overflow spillway and screen nets to prevent fish escape.',
        time: 'Next 24 hours',
      });
    } else if (types.includes('cattle') || types.includes('poultry')) {
      alerts.push({
        type: 'warning',
        icon: '🐄',
        title: 'Livestock Shed Dampness Advisory',
        desc: 'Rain expected tomorrow. Move animals inside dry sheds and protect fodder stacks from getting wet.',
        time: 'Next 24 hours',
      });
    } else if (types.includes('crop') || types.includes('organic')) {
      alerts.push({
        type: 'warning',
        icon: '🌧️',
        title: 'Rain Expected Tomorrow — Spraying Advisory',
        desc: 'Postpone all pesticide, fertilizer, or bio-spray application. Skip field irrigation today.',
        time: 'Next 24 hours',
      });
    }
  }

  if (parseInt(current.temp) > 38) {
    if (types.includes('bees')) {
      alerts.push({
        type: 'danger',
        icon: '🌡️',
        title: 'Apiary Heat Management',
        desc: 'Temperature above 38°C. Place shaded covers on hives and ensure fresh water source within 20 meters.',
        time: 'Today',
      });
    } else if (types.includes('cattle')) {
      alerts.push({
        type: 'danger',
        icon: '🌡️',
        title: 'Dairy Herd Thermal Stress Warning',
        desc: 'High heat index. Run shed fans, spray mist if available, and provide cold drinking water with electrolytes.',
        time: 'Today',
      });
    } else if (types.includes('fish')) {
      alerts.push({
        type: 'danger',
        icon: '🌡️',
        title: 'Pond Water Temperature Warning',
        desc: 'Surface water warming up. Run aerators early morning and maintain pond depth above 5 feet.',
        time: 'Today',
      });
    } else if (types.includes('crop')) {
      alerts.push({
        type: 'danger',
        icon: '🌡️',
        title: 'Crop Heat Stress Warning',
        desc: 'Temperature above 38°C. Irrigate early morning (before 8 AM) to protect root zone from wilting.',
        time: 'Today',
      });
    }
  }

  // Domain-specific seasonal tips (NO crop tips if user only chose bees, fish, etc.)
  if (types.includes('bees')) {
    alerts.push({
      type: 'info',
      icon: '🍯',
      title: 'Nectar Flow & Colony Expansion',
      desc: 'Active forage period. Inspect super boxes weekly and ensure queen has sufficient space to lay eggs.',
      time: 'This season',
    });
  } else if (types.includes('fish')) {
    alerts.push({
      type: 'info',
      icon: '🐟',
      title: 'Optimal Feeding Window',
      desc: 'Water temperature is favorable. Feed commercial floating pellets at 2–3% body weight twice daily.',
      time: 'Daily Schedule',
    });
  } else if (types.includes('cattle')) {
    alerts.push({
      type: 'info',
      icon: '🥛',
      title: 'Green Fodder & Mineral Mixture',
      desc: 'Maintain daily 50g mineral mixture per milking cow to sustain milk yield and fat percentage.',
      time: 'Daily Routine',
    });
  } else if (types.includes('crop')) {
    alerts.push({
      type: 'info',
      icon: '🌱',
      title: 'Seasonal Crop Advisory',
      desc: 'Check crop tillering and soil moisture level before planning next irrigation cycle.',
      time: 'This season',
    });
  }

  return alerts;
}

// ── REAL-TIME WEATHER API INTEGRATION (LIVE METEOROLOGICAL DATA) ──
async function generateWeatherRealTime(location) {
  let lat = 20.5937, lon = 78.9629; // Default India
  let resolvedLocation = "Your Farm Location";

  // If coordinates object passed directly
  if (location && typeof location === 'object' && location.lat && location.lon) {
    lat = location.lat;
    lon = location.lon;
    resolvedLocation = location.name || "Current GPS Location";
    try {
      const revRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      const revData = await revRes.json();
      if (revData.locality || revData.city) {
        resolvedLocation = `${revData.locality || revData.city}, ${revData.principalSubdivision || ''}`;
      }
    } catch(e) {}
  } else if (location && location !== 'default') {
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&format=json`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();
      if (geoData.results && geoData.results.length > 0) {
        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
        resolvedLocation = `${geoData.results[0].name}, ${geoData.results[0].admin1 || 'India'}`;
      }
    } catch (e) {
      console.warn("Geocoding fallback used");
    }
  }

  // WMO Weather interpretation codes
  const wmoCodes = {
    0: {cond: 'Sunny', icon: '☀️', banner: 'sunny'},
    1: {cond: 'Mainly Clear', icon: '⛅', banner: 'sunny'},
    2: {cond: 'Partly Cloudy', icon: '⛅', banner: 'sunny-part'},
    3: {cond: 'Cloudy', icon: '☁️', banner: 'cloudy'},
    45: {cond: 'Foggy', icon: '🌫️', banner: 'cloudy'},
    48: {cond: 'Foggy', icon: '🌫️', banner: 'cloudy'},
    51: {cond: 'Light Drizzle', icon: '🌦️', banner: 'rainy'},
    53: {cond: 'Moderate Drizzle', icon: '🌦️', banner: 'rainy'},
    55: {cond: 'Dense Drizzle', icon: '🌧️', banner: 'rainy'},
    61: {cond: 'Light Rain', icon: '🌦️', banner: 'rainy'},
    63: {cond: 'Moderate Rain', icon: '🌧️', banner: 'rainy'},
    65: {cond: 'Heavy Rain', icon: '🌧️', banner: 'rainy'},
    80: {cond: 'Rain Showers', icon: '🌦️', banner: 'rainy'},
    95: {cond: 'Thunderstorm', icon: '⛈️', banner: 'rainy'},
  };
  const getCode = (code) => wmoCodes[code] || {cond: 'Unknown', icon: '❓', banner: 'cloudy'};

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
  const res = await fetch(weatherUrl);
  if (!res.ok) throw new Error("Weather API failed");
  const wData = await res.json();
  
  const currCodeObj = getCode(wData.current.weather_code);
  
  const current = {
    temp: `${Math.round(wData.current.temperature_2m)}°C`,
    feelsLike: `${Math.round(wData.current.temperature_2m + 2)}°C`,
    condition: currCodeObj.cond,
    icon: currCodeObj.icon,
    humidity: `${wData.current.relative_humidity_2m}%`,
    wind: `${Math.round(wData.current.wind_speed_10m)} km/h`,
    uv: wData.current.is_day ? 'High' : 'Low',
    bannerClass: currCodeObj.banner,
    rawTemp: wData.current.temperature_2m,
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const forecast = wData.daily.time.map((timeStr, i) => {
    const d = new Date(timeStr);
    const codeObj = getCode(wData.daily.weather_code[i]);
    return {
      day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()],
      condition: codeObj.cond,
      icon: codeObj.icon,
      temp: `${Math.round(wData.daily.temperature_2m_max[i])}°`,
      low: `${Math.round(wData.daily.temperature_2m_min[i])}°`,
      rain: `${wData.daily.precipitation_probability_max[i]}%`,
      bannerClass: codeObj.banner,
    };
  });

  const rainTomorrow = wData.daily.precipitation_probability_max[1] > 30 || [51,53,55,61,63,65,80,95].includes(wData.daily.weather_code[1]);

  // Generate farming-relevant weather advice
  let advice = '';
  if (current.rawTemp > 40) {
    advice = '🔥 Extreme heat — irrigate crops in early morning or evening only';
  } else if (current.condition.includes('Rain') || current.condition.includes('Drizzle')) {
    advice = '🚫 Do NOT spray pesticides today — rain will wash them off';
  } else if (parseInt(current.wind) > 15) {
    advice = '💨 Avoid spraying today — wind drift. Best time: early morning';
  } else if (['Sunny', 'Mainly Clear'].includes(current.condition)) {
    advice = '☀️ Good day for harvesting, spraying, and outdoor farm work';
  } else {
    advice = '⛅ Moderate weather — routine farm activities can proceed';
  }

  // Mock soil data
  const soil = {
    moisture: 62,
    temp: `${Math.round(current.rawTemp - 4)}°C`,
    ph: (6.5 + Math.random() * 0.8).toFixed(1),
    n: 'Medium', p: 'Medium', k: 'High'
  };

  return { location: resolvedLocation, current, advice, rainTomorrow, forecast, soil };
}

window.WEATHER_DATA = { generateWeatherFallback, generateWeatherRealTime, getWeatherAlerts, WEATHER_PRESETS };
