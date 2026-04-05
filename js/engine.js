// ============================================================
// KisanMitra v2 — Adaptive Intelligence Engine
// Addresses all 4 Farmer Gaps
// ============================================================

class FarmingEngine {
  constructor(profile) {
    this.profile = profile;
    this.weather = window.WEATHER_DATA.generateWeatherFallback(profile.location);
    this._taskStates = this._loadStates();
  }

  async initWeather() {
    try {
      this.weather = await window.WEATHER_DATA.generateWeatherRealTime(this.profile.location);
    } catch (e) {
      console.warn("Failed to fetch real-time weather, using fallback.", e);
    }
  }

  _loadStates()   { try { return JSON.parse(localStorage.getItem('km_tasks_v2')||'{}'); } catch { return {}; } }
  saveTask(id,done){ this._taskStates[id]=done; localStorage.setItem('km_tasks_v2',JSON.stringify(this._taskStates)); }
  isDone(id)       { return !!this._taskStates[id]; }

  // ── Today's Tasks (weather-aware) ──
  getTasks() {
    let rawTasks = window.FARM_DATA.getTasksForProfile(this.profile);
    
    // Dynamically insert high-priority weather-based tasks
    if (this.weather.rainTomorrow) {
      if (this.profile.experience === 'expert') {
        rawTasks.unshift({ id:'wt_rain_e', text:'Rain expected tomorrow → delay irrigation and pesticide application', icon:'🌧️', time:'Next 24h', priority:'high' });
      } else {
        rawTasks.unshift({ id:'wt_rain_b', text:'Do not water the crops or spray chemicals today because it will rain tomorrow', icon:'🌧️', time:'Today', priority:'high' });
      }
    } else if (this.weather.heatAlert) {
      if (this.profile.experience === 'expert') {
        rawTasks.unshift({ id:'wt_heat_e', text:'Extreme heat → mandate early irrigation cycle & monitor livestock thermal stress', icon:'🔥', time:'Before 8 AM', priority:'high' });
      } else {
        rawTasks.unshift({ id:'wt_heat_b', text:'Very hot today! Make sure to water early and keep animals in the shade', icon:'🔥', time:'Morning', priority:'high' });
      }
    }

    // Dynamically insert Custom Items tasks based on universal input
    if (this.profile.specificItems && typeof this.profile.specificItems === 'string' && this.profile.specificItems.trim() !== '') {
      const items = this.profile.specificItems.split(',').map(s=>s.trim()).filter(Boolean);
      items.forEach((item, index) => {
        if (this.profile.experience === 'expert') {
          rawTasks.unshift({ id:'custom_'+index, text:`Monitor parameters and market prices for your custom crop: ${item.toUpperCase()}`, icon:'🔍', time:'Regularly', priority:'medium' });
        } else {
          rawTasks.unshift({ id:'custom_'+index+'_b', text:`Check your ${item} carefully today for any signs of disease or pests.`, icon:'🔍', time:'Today', priority:'medium' });
        }
      });
    }

    return rawTasks;
  }

  // ── Farm Health Score (0–100) ──
  getFarmHealth() {
    const tasks = this.getTasks();
    const done  = tasks.filter(t => this.isDone(t.id)).length;
    const total = tasks.length || 1;
    const taskScore = Math.round((done / total) * 40);
    const alertPenalty = this.getAllAlerts().filter(a => a.type === 'danger').length * 8;
    const weatherBonus = this.weather.heatAlert ? -10 : 5;
    const score = Math.min(100, Math.max(20, 55 + taskScore + weatherBonus - alertPenalty));
    const label = score >= 80 ? 'Excellent 🌟' : score >= 60 ? 'Good 👍' : score >= 40 ? 'Fair ⚠️' : 'Needs Attention 🔴';
    return { score, label, done, total,
      resources: { water: 68, soil: 75, budget: Math.round(40 + Math.random()*30), productivity: Math.round(55 + Math.random()*35) } };
  }

  // ── All Alerts + Disease ──
  getAllAlerts() {
    const { farmTypes } = this.profile;
    const weatherAlerts  = window.WEATHER_DATA.getWeatherAlerts(this.weather);
    const diseaseAlerts  = window.MARKET_DATA.DISEASE_ALERTS.filter(a =>
      a.affectedTypes.some(t => farmTypes.includes(t))
    );
    return [...weatherAlerts, ...diseaseAlerts];
  }

  // ── Upcoming Schedule ──
  getUpcoming() {
    const { farmTypes } = this.profile;
    const items = [];
    if (farmTypes.includes('crop'))   { items.push({ date:'In 3 Days', icon:'🌱', text:'Apply next fertilizer dose' }); items.push({ date:'Apr 10', icon:'💧', text:'Next irrigation cycle due' }); items.push({ date:'Apr 15', icon:'🔍', text:'Pest scouting — monthly check' }); }
    if (farmTypes.includes('cattle')) { items.push({ date:'Apr 8',  icon:'💉', text:'FMD vaccination #2 due' }); items.push({ date:'Apr 20', icon:'💊', text:'Calf deworming schedule' }); }
    if (farmTypes.includes('fish'))   { items.push({ date:'Apr 10', icon:'⚖️', text:'Monthly fish weight sampling' }); items.push({ date:'Apr 14', icon:'🧪', text:'Full water quality test' }); }
    if (farmTypes.includes('poultry')){ items.push({ date:'This Week', icon:'💉', text:'Newcastle disease vaccine' }); }
    if (farmTypes.includes('bees'))   { items.push({ date:'Next Week', icon:'🌼', text:'Move hives to mustard field' }); }
    if (farmTypes.includes('plants')) { items.push({ date:'Apr 12', icon:'🌿', text:'Aloe harvest — buyer arrival' }); }
    if (farmTypes.includes('hydroponics')){ items.push({ date:'Apr 7', icon:'🥬', text:'Lettuce harvest — batch ready' }); }
    if (farmTypes.includes('organic')){ items.push({ date:'Apr 15', icon:'📋', text:'PGS Organic certification visit' }); }
    return items.slice(0,5);
  }

  // ── Profit Opportunities ──
  getProfitOpps() { return window.FARM_DATA.getProfitOpps(this.profile.farmTypes); }

  // ── Profit Estimate (advanced) ──
  getProfitEstimate() {
    const { farmTypes, landSize } = this.profile;
    const acres = parseFloat(landSize) || 2;
    let income=0, expense=0;
    const breakdown = [];
    const map = { crop:45000, fish:80000, cattle:90000, poultry:55000, plants:120000, bees:35000, hydroponics:150000, organic:55000, urban:80000, sustainable:40000 };
    const expMap = { crop:18000, fish:30000, cattle:60000, poultry:22000, plants:40000, bees:12000, hydroponics:55000, organic:16000, urban:30000, sustainable:15000 };
    farmTypes.forEach(t => {
      const inc = (map[t]||40000)*acres; const exp = (expMap[t]||15000)*acres;
      income+=inc; expense+=exp; breakdown.push({ label:window.FARM_DATA.FARM_TYPES[t]?.label||t, income:inc, expense:exp });
    });
    return { income, expense, profit:income-expense, breakdown };
  }

  // ── Beginner Guide ──
  getGuide() {
    const { farmTypes } = this.profile;
    const type = farmTypes[0]||'crop';
    return window.FARM_DATA.BEGINNER_GUIDES[type] || window.FARM_DATA.BEGINNER_GUIDES.crop;
  }

  // ── Government Schemes ──
  getSchemes() { return window.SCHEMES_DATA.getSchemesForTypes(this.profile.farmTypes); }

  // ── Resource Tips ──
  getResourceTips() { return window.MARKET_DATA.RESOURCE_TIPS[this.profile.budget]||window.MARKET_DATA.RESOURCE_TIPS.low; }

  // ── One-Tap Quick Advice ──
  getQuickAdvice() {
    const { farmTypes } = this.profile;
    const advices = [{ type:'weather', icon:'🌤️', text:this.weather.advice }];
    const tips = {
      crop:`Irrigate ${ this.weather.rainTomorrow ? 'SKIP today — rain coming' : 'field tomorrow 6 AM — 2 hours'}`,
      fish:'Feed fish at 6 AM — check dissolved oxygen before feeding',
      cattle:'Morning milking 5:30 AM — record yield and check for mastitis',
      poultry:'Check shed temp — target 28–30°C. Check egg production records',
      bees:'Inspect hive this morning — watch for swarm signs and mite count',
      plants:'Market alert: Aloe Vera price at seasonal HIGH. Harvest ready leaves now',
      hydroponics:'Check EC and pH of reservoir. Harvest lettuce if 28+ days old',
      organic:'Apply biofertilizer or jeevamrut this morning for best absorption',
      urban:'Water containers, check microgreen harvest readiness',
      sustainable:'Check rainwater tank level. Record soil moisture reading',
    };
    farmTypes.forEach(t => { if(tips[t]) advices.push({ type:t, icon:window.FARM_DATA.FARM_TYPES[t]?.emoji||'🌱', text:tips[t] }); });
    return advices;
  }

  // ── Voice Query Processor ──
  processVoiceQuery(q) {
    q = q.toLowerCase();
    if (q.includes('today') || q.includes('do'))    return `Top 3 tasks: ${this.getTasks().slice(0,3).map((t,i)=>`${i+1}. ${t.text}`).join('. ')}.`;
    if (q.includes('weather') || q.includes('rain'))return `Weather at ${this.weather.location}: ${this.weather.current.temp}, ${this.weather.current.condition}, humidity ${this.weather.current.humidity}. ${this.weather.advice}`;
    if (q.includes('pest') || q.includes('alert'))  return `Current alerts: ${this.getAllAlerts().slice(0,2).map(a=>a.title).join(', ')}.`;
    if (q.includes('market') || q.includes('price'))return `Market prices: ${window.MARKET_DATA.getMarketPricesForType(this.profile.farmTypes).slice(0,3).map(p=>`${p.name} ₹${p.price}`).join(', ')}.`;
    if (q.includes('scheme') || q.includes('govt')) return `Top scheme: PM-KISAN gives ₹6000/year directly to your bank. Register at pmkisan.gov.in.`;
    if (q.includes('profit') || q.includes('sell')) { const o=this.getProfitOpps()[0]; return o ? `${o.title}: ${o.text}` : 'Check the Profit Opportunities tab for current selling opportunities.'; }
    if (q.includes('irrigat') || q.includes('water'))return this.weather.rainTomorrow ? 'Skip irrigation today — rain expected tomorrow. Save water.' : 'Irrigate in early morning before 8 AM to reduce evaporation by 30%.';
    return `I can help with: today's tasks, weather, market prices, alerts, schemes, and profit tips. Try asking "What should I do today?"`;
  }

  // ── Persona label ──
  getPersonaLabel() {
    const labelMap = { generational:'Generational Farmer', wealthy:'Wealthy Farmer', 'new-entrant':'New Entrant', agripreneur:'Agripreneur' };
    return labelMap[this.profile.persona] || this.profile.experience;
  }
}

window.FarmingEngine = FarmingEngine;
