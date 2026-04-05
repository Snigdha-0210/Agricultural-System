// ============================================================
// KisanMitra v2 — Dashboard Renderer
// ============================================================
const Dashboard = (() => {
  let engine, profile, activeTab = 'dashboard';

  function init(farmEngine, userProfile) {
    engine = farmEngine;
    profile = userProfile;
    profile.farmTypes = profile.farmTypes || ['crop'];
    renderSidebarMeta();
    renderTab('dashboard');
    bindBottomNav();
    bindSidebarNav();
    updateAlertBadge();
  }

  function renderSidebarMeta() {
    const avatarMap = { generational:'👴', wealthy:'🧑‍💼', 'new-entrant':'🎓', agripreneur:'🚀' };
    const emoji = avatarMap[profile.persona] || '🧑‍🌾';
    document.getElementById('nav-avatar').textContent    = emoji;
    document.getElementById('sidebar-avatar').textContent= emoji;
    document.getElementById('sidebar-name').textContent  = profile.name || 'Farmer';
    document.getElementById('sidebar-tag').textContent   = profile.farmTypes.map(t=>window.FARM_DATA.FARM_TYPES[t]?.emoji).join(' ') + ' Farmer';
    document.getElementById('sidebar-location').textContent = '📍 ' + (profile.location || '—');

    // Health bars in sidebar
    const h = engine.getFarmHealth();
    document.getElementById('sidebar-health').innerHTML = `
      <div class="sh-title">Farm Health</div>
      <div class="sh-bar-row"><div class="sh-bar-label">Tasks</div><div class="sh-bar"><div class="sh-bar-fill green" style="width:${Math.round((h.done/h.total)*100)||0}%"></div></div><div class="sh-bar-val">${h.done}/${h.total}</div></div>
      <div class="sh-bar-row"><div class="sh-bar-label">Water</div><div class="sh-bar"><div class="sh-bar-fill blue" style="width:${h.resources.water}%"></div></div><div class="sh-bar-val">${h.resources.water}%</div></div>
      <div class="sh-bar-row"><div class="sh-bar-label">Soil</div><div class="sh-bar"><div class="sh-bar-fill green" style="width:${h.resources.soil}%"></div></div><div class="sh-bar-val">${h.resources.soil}%</div></div>
    `;
  }

  function updateAlertBadge() {
    const cnt = engine.getAllAlerts().filter(a=>a.type==='danger'||a.type==='warning').length;
    document.getElementById('alert-badge').textContent = cnt;
  }

  function renderTab(tab) {
    activeTab = tab;
    const main = document.getElementById('dashboard-main');
    try {
      switch(tab) {
        case 'dashboard':  main.innerHTML = renderHome();      break;
        case 'tasks':      main.innerHTML = renderTasks();     break;
        case 'alerts':     main.innerHTML = renderAlerts();    break;
        case 'profit':     main.innerHTML = renderProfit();    break;
        case 'guide':      main.innerHTML = renderGuide();     break;
        case 'learn':      main.innerHTML = renderLearn();     break;
        case 'knowledge':  main.innerHTML = renderKnowledge(); break;
        case 'market':     main.innerHTML = renderMarket();    break;
        case 'schemes':    main.innerHTML = renderSchemes();   break;
        case 'marketplace':main.innerHTML = renderMarketplace();break;
        case 'weather':    main.innerHTML = renderWeather();   break;
        case 'analytics':  main.innerHTML = renderAnalytics();  break;
        case 'sms':        main.innerHTML = renderSMS();       break;
        case 'settings':   main.innerHTML = renderSettings();  break;
        default:           main.innerHTML = renderHome();
      }
      
      // Bind apply buttons
      if (tab === 'schemes') {
        document.querySelectorAll('.scheme-apply-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            document.getElementById('scheme-modal-title').textContent = 'Apply for ' + e.target.dataset.title;
            document.getElementById('scheme-overlay').classList.remove('hidden');
          });
        });
      }
      bindTabEvents(tab);
    } catch(err) {
      console.error(err);
      main.innerHTML = `<div style="padding:24px; color:#ef4444; background:#fee2e2; border-radius:8px; font-weight:bold; word-wrap:break-word; margin:20px;">
        <h3>UI Crash in Tab: ${tab}</h3>
        <p>${err.message}</p>
        <pre style="font-size:0.8em; overflow-x:auto;">${err.stack}</pre>
      </div>`;
    }
  }

  // ════════════════════════════════════════════════════════
  // HOME DASHBOARD
  // ════════════════════════════════════════════════════════
  function renderHome() {
    const w     = engine.weather;
    const h     = engine.getFarmHealth();
    const tasks = engine.getTasks().slice(0,3);
    const alerts= engine.getAllAlerts().slice(0,1);
    const opps  = engine.getProfitOpps().slice(0,2);
    const upcoming = engine.getUpcoming().slice(0,4);
    const tips  = window.FARM_DATA.INTEGRATED_TIPS;
    const tip   = tips[Math.floor(Math.random()*tips.length)];

    const persMap = { generational:'generational', wealthy:'wealthy', 'new-entrant':'new-entrant', agripreneur:'agripreneur' };
    const persCls = persMap[profile.persona]||'generational';

    return `
    <!-- GREETING -->
    <div class="greeting-strip">
      <div>
        <div class="greeting-text">${new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
        <div class="greeting-name">Hello, ${profile.name||'Farmer'} 👋</div>
        <span class="persona-badge ${persCls}">${engine.getPersonaLabel()}</span>
      </div>
      <div class="farm-icons-row" style="margin:0">
        ${profile.farmTypes.map(t=>`<div class="farm-icon-chip">${window.FARM_DATA.FARM_TYPES[t]?.emoji||'🌾'}</div>`).join('')}
      </div>
    </div>



    <!-- WEATHER BANNER -->
    <div class="weather-banner ${w.current.bannerClass}">
      <div class="weather-banner-bg">${w.current.icon}</div>
      <div class="weather-top">
        <div>
          <div class="weather-location">📍 ${w.location}</div>
          <div class="weather-temp">${w.current.temp}</div>
          <div class="weather-condition">${w.current.condition}</div>
        </div>
        <div class="weather-icon-main">${w.current.icon}</div>
      </div>
      <div class="weather-details">
        <div class="weather-detail">💧 ${w.current.humidity}</div>
        <div class="weather-detail">💨 ${w.current.wind}</div>
        <div class="weather-detail">☀️ UV: ${w.current.uv}</div>
      </div>
      <div class="weather-advice-strip">⚡ ${w.advice}</div>
    </div>

    ${alerts.length ? `
    <!-- TOP ALERT BANNER -->
    <div class="alert-cards" style="margin-bottom:var(--s4)">
      ${alerts.map(a=>`
      <div class="alert-card ${a.type}">
        <div class="alert-icon">${a.icon}</div>
        <div class="alert-content">
          <div class="alert-title">${a.title}</div>
          <div class="alert-desc">${a.desc}</div>
          ${a.action?`<div class="alert-action">→ ${a.action}</div>`:''}
        </div>
      </div>`).join('')}
    </div>` : ''}

    <!-- TODAY'S TOP TASKS -->
    <div class="section-header">
      <div class="section-title">✅ Today's Actions</div>
      <button class="section-link" data-nav="tasks">View All</button>
    </div>
    <div class="task-list" style="margin-bottom:var(--s5)">
      ${tasks.map(t=>`
      <div class="task-item ${engine.isDone(t.id)?'done':''}" data-task-id="${t.id}">
        <div class="task-check ${engine.isDone(t.id)?'checked':''}" data-check="${t.id}"></div>
        <div class="task-icon">${t.icon}</div>
        <div class="task-content">
          <div class="task-text">${t.text}</div>
          <div class="task-time">⏰ ${t.time}</div>
        </div>
        <span class="task-priority ${t.priority}">${t.priority.toUpperCase()}</span>
      </div>`).join('')}
    </div>

    <!-- PROFIT OPPORTUNITIES -->
    <div class="section-header">
      <div class="section-title">💰 Profit Opportunities</div>
      <button class="section-link" data-nav="profit">See All</button>
    </div>
    <div class="profit-cards" style="margin-bottom:var(--s5)">
      ${opps.map(o=>`
      <div class="profit-opp-card">
        <div class="profit-opp-icon">${o.icon}</div>
        <div class="profit-opp-body">
          <div class="profit-opp-title">${o.title}</div>
          <div class="profit-opp-text">${o.text}</div>
          <div class="profit-amount">${o.amount}</div>
          <span class="profit-opp-badge ${o.badge}">${o.badge==='high-opp'?'🔥 High Opportunity':o.badge==='medium-opp'?'⚡ Medium':'📊 Low Risk'}</span>
        </div>
      </div>`).join('')}
    </div>

    <!-- LEARN FROM EXPERTS -->
    <div class="section-header">
      <div class="section-title">🎥 Learn from Experts</div>
    </div>
    <div class="videos-list" style="margin-bottom:var(--s5); display: flex; flex-direction: column; gap: var(--s3);">
      ${window.FARM_DATA.getLearnVideos(profile.farmTypes).map(v=>`
        <div class="video-card" style="display:flex; align-items:center; background:var(--surface); padding:var(--s3); border-radius:var(--radius-md); box-shadow:0 2px 5px rgba(0,0,0,0.05); cursor:pointer;">
          <div style="font-size:1.5rem; margin-right:attr(--s3); background:var(--bg-color); border-radius:50%; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">${v.icon}</div>
          <div style="flex:1;">
            <div style="font-weight:600; font-size:0.95rem; color:var(--text-primary); margin-bottom:2px;">${v.title}</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">${v.platform} • ${v.duration}</div>
          </div>
          <div style="background:var(--primary-color-light); color:var(--primary-color); font-size:0.7rem; padding:2px 8px; border-radius:12px; font-weight:600;">${v.tag}</div>
        </div>
      `).join('')}
    </div>

    <!-- QUICK ACCESS ── Schemes + Marketplace -->
    <div class="section-header"><div class="section-title">⚡ Quick Access</div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--s3);margin-bottom:var(--s5)">
      <div class="scheme-card central" style="cursor:pointer" data-nav="schemes">
        <div style="font-size:1.5rem;margin-bottom:4px">🏛️</div>
        <div style="font-weight:700;font-size:.85rem">Govt. Schemes</div>
        <div style="font-size:.72rem;color:var(--text-secondary)">PM-KISAN, PMFBY, KCC &amp; more</div>
      </div>
      <div class="scheme-card subsidy" style="cursor:pointer" data-nav="marketplace">
        <div style="font-size:1.5rem;margin-bottom:4px">🏪</div>
        <div style="font-weight:700;font-size:.85rem">Marketplace</div>
        <div style="font-size:.72rem;color:var(--text-secondary)">Mandis, buyers &amp; direct sale</div>
      </div>
    </div>

    <!-- INTEGRATED TIPS -->
    <div class="tip-banner">
      <div class="tip-emoji">${tip.icon}</div>
      <div>
        <div class="tip-label">Daily Farming Tip</div>
        <div class="tip-text"><strong>${tip.title}:</strong> ${tip.text}</div>
      </div>
    </div>
    `;
  }

  // ════════════════════════════════════════════════════════
  // TASKS
  // ════════════════════════════════════════════════════════
  function renderTasks() {
    const tasks = engine.getTasks();
    return `
    <div class="tab-page-header">
      <div class="tab-page-title">✅ Today's Actions</div>
      <div class="tab-page-sub">${profile.farmTypes.map(t=>window.FARM_DATA.FARM_TYPES[t]?.emoji+' '+window.FARM_DATA.FARM_TYPES[t]?.label).join(' • ')}</div>
    </div>
    <div class="task-list">
      ${tasks.map(t=>`
      <div class="task-item ${engine.isDone(t.id)?'done':''}" data-task-id="${t.id}">
        <div class="task-check ${engine.isDone(t.id)?'checked':''}" data-check="${t.id}"></div>
        <div class="task-icon">${t.icon}</div>
        <div class="task-content">
          <div class="task-text">${t.text}</div>
          <div class="task-time">⏰ ${t.time}</div>
          <div class="task-detail" id="det-${t.id}" style="display:none">${t.detail||'No additional details.'}</div>
          <button class="task-expand-btn" data-detid="${t.id}">ℹ️ See Details</button>
        </div>
        <span class="task-priority ${t.priority}">${t.priority.toUpperCase()}</span>
      </div>`).join('')}
    </div>
    `;
  }

  // ════════════════════════════════════════════════════════
  // ALERTS
  // ════════════════════════════════════════════════════════
  function renderAlerts() {
    const alerts = engine.getAllAlerts();
    return `
    <div class="tab-page-header"><div class="tab-page-title">⚠️ Risks & Alerts</div><div class="tab-page-sub">Weather, Disease, Pest & Market warnings</div></div>
    <div class="alert-cards">
      ${alerts.map(a=>`
      <div class="alert-card ${a.type}">
        <div class="alert-icon">${a.icon}</div>
        <div class="alert-content">
          <div class="alert-title">${a.title}</div>
          <div class="alert-desc">${a.desc}</div>
          ${a.action?`<div class="alert-action">→ Action: ${a.action}</div>`:''}
          <div class="alert-time">⏱ ${a.time||''}</div>
          ${a.gap?`<span class="task-gap-label ${a.gap}" style="margin-top:6px;display:inline-block">${{info:'🧠 Information',pred:'🔮 Prediction',access:'🔑 Access',exec:'⚡ Execution'}[a.gap]} Gap</span>`:''}
        </div>
      </div>`).join('')}
    </div>
    `;
  }

  // ════════════════════════════════════════════════════════
  // PROFIT OPPORTUNITIES
  // ════════════════════════════════════════════════════════
  function renderProfit() {
    const opps = engine.getProfitOpps();
    const estimate = engine.getProfitEstimate();
    const fmt = n => '₹'+Math.round(n).toLocaleString('en-IN');
    return `
    <div class="tab-page-header"><div class="tab-page-title">💰 Profit Opportunities</div><div class="tab-page-sub">Sell smarter, earn more this season</div></div>
    <div class="profit-card">
      <div class="profit-card-title">Season Profit Estimate (${profile.landSize||'2'} acres)</div>
      <div class="profit-card-num">${fmt(estimate.profit)}</div>
      <div class="profit-breakdown">
        <div class="profit-item"><div class="profit-item-num">${fmt(estimate.income)}</div>Est. Income</div>
        <div class="profit-item"><div class="profit-item-num">${fmt(estimate.expense)}</div>Est. Expense</div>
      </div>
      <div class="profit-note">Based on average yields. Actual results may vary.</div>
    </div>
    <div class="section-header"><div class="section-title">🔥 Live Opportunities</div></div>
    <div class="profit-cards">
      ${opps.map(o=>`
      <div class="profit-opp-card">
        <div class="profit-opp-icon">${o.icon}</div>
        <div class="profit-opp-body">
          <div class="profit-opp-title">${o.title}</div>
          <div class="profit-opp-text">${o.text}</div>
          <div class="profit-amount">${o.amount}</div>
          <span class="profit-opp-badge ${o.badge}">${o.badge==='high-opp'?'🔥 High':o.badge==='medium-opp'?'⚡ Medium':'📊 Low Risk'}</span>
          ${o.gap?`<span class="task-gap-label ${o.gap}" style="margin-left:6px">${{access:'🔑 Access',info:'🧠 Info',pred:'🔮 Predict',exec:'⚡ Execute'}[o.gap]}</span>`:''}
        </div>
      </div>`).join('')}
    </div>
    <div class="section-header" style="margin-top:var(--s5)"><div class="section-title">💡 Resource Optimization</div></div>
    <div class="advice-list">
      ${engine.getResourceTips().map(t=>`
      <div class="integrated-card">
        <div class="integrated-icon">${t.icon}</div>
        <div><div class="integrated-title">${t.title}</div><div class="integrated-text">${t.text}</div></div>
      </div>`).join('')}
    </div>
    `;
  }

  // ════════════════════════════════════════════════════════
  // GUIDE
  // ════════════════════════════════════════════════════════
  function renderGuide() {
    const guide = engine.getGuide();
    const isBeginner = profile.experience === 'beginner';
    const intTips = window.FARM_DATA.INTEGRATED_TIPS;
    return `
    <div class="tab-page-header">
      <div class="tab-page-title">📖 Beginner Guide</div>
      <div class="tab-page-sub">${guide.emoji} ${guide.title}</div>
    </div>
    ${isBeginner ? '<div class="alert-card info" style="margin-bottom:var(--s4)"><div class="alert-icon">🌱</div><div class="alert-content"><div class="alert-title">Welcome to Farming!</div><div class="alert-desc">Follow these steps carefully. You\'re doing great — every expert was once a beginner.</div></div></div>' : ''}
    <div class="guide-steps" style="margin-bottom:var(--s6)">
      ${guide.steps.map((s,i)=>`
      <div class="guide-step-item">
        <div class="guide-step-num">${i+1}</div>
        <div class="guide-step-content">
          <div class="guide-step-day">${s.day}</div>
          <div class="guide-step-title">${s.title}</div>
          <div class="guide-step-desc">${s.desc}</div>
          <div class="guide-step-actions" id="gact-${i}" style="display:none">
            ${s.actions.map(a=>`✅ ${a}`).join('<br>')}
          </div>
          <button class="guide-expand-btn" data-gid="${i}">📋 View Actions</button>
        </div>
      </div>`).join('')}
    </div>
    <div class="section-header"><div class="section-title">♻️ Integrated Farming Tips</div></div>
    ${intTips.map(tip=>`
    <div class="integrated-card">
      <div class="integrated-icon">${tip.icon}</div>
      <div><div class="integrated-title">${tip.title}</div><div class="integrated-text">${tip.text}</div></div>
    </div>`).join('')}
    `;
  }

  // ════════════════════════════════════════════════════════
  // MARKET PRICES
  // ════════════════════════════════════════════════════════
  function renderMarket() {
    const prices = window.MARKET_DATA.getMarketPricesForType(profile.farmTypes);
    return `
    <div class="tab-page-header"><div class="tab-page-title">📈 Market Prices</div><div class="tab-page-sub">Live simulated mandi rates — updated daily</div></div>
    <div class="market-grid" style="margin-bottom:var(--s5)">
      ${prices.map(p=>`
      <div class="market-card">
        <div class="market-card-bg">${p.emoji}</div>
        <div class="market-crop">${p.name}</div>
        <div class="market-price">₹${p.price} <span class="market-unit">${p.unit}</span></div>
        <div class="market-trend ${p.trend}">${p.trend==='up'?'↑':p.trend==='down'?'↓':'→'} ${p.change}</div>
        ${p.msp?`<div style="font-size:.66rem;color:var(--text-muted);margin-top:2px">MSP: ₹${p.msp}</div>`:''}
      </div>`).join('')}
    </div>
    <div class="alert-card info" style="margin-bottom:var(--s4)">
      <div class="alert-icon">💡</div>
      <div class="alert-content">
        <div class="alert-title">Sell or Hold?</div>
        <div class="alert-desc">Market rising this week. Tomato +12%, Honey +6%. Check Profit Opportunities tab for best time to sell.</div>
      </div>
    </div>
    `;
  }

  // ════════════════════════════════════════════════════════
  // GOVERNMENT SCHEMES
  // ════════════════════════════════════════════════════════
  function renderSchemes() {
    const schemes = engine.getSchemes();
    return `
    <div class="tab-page-header"><div class="tab-page-title">🏛️ Government Schemes</div><div class="tab-page-sub">Schemes you may be eligible for based on your farm type</div></div>
    <div class="alert-card success" style="margin-bottom:var(--s4)">
      <div class="alert-icon">✅</div>
      <div class="alert-content">
        <div class="alert-title">${schemes.length} schemes found for your farm type</div>
        <div class="alert-desc">These schemes are available to farmers like you. Applications are free — do not pay anyone to apply.</div>
      </div>
    </div>
    <div class="scheme-cards">
      ${schemes.map(s=>`
      <div class="scheme-card ${s.type}">
        <div class="scheme-header">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:1.4rem">${s.icon}</span>
            <div class="scheme-title">${s.title}</div>
          </div>
          <span class="scheme-badge ${s.type}">${s.badge}</span>
        </div>
        <div class="scheme-desc">${s.desc}</div>
        <div class="scheme-benefit">💰 Benefit: ${s.benefit}</div>
        <div class="scheme-eligibility">✅ Eligibility: ${s.eligibility}</div>
        <button class="scheme-action-btn scheme-apply-btn" data-title="${s.title}">⚡ Apply Now Directly</button>
      </div>`).join('')}
    </div>
    `;
  }

  // ════════════════════════════════════════════════════════
  // MARKETPLACE
  // ════════════════════════════════════════════════════════
  function renderMarketplace() {
    const mandis = window.MARKET_DATA.MANDIS.slice(0,3);
    const buyers = window.MARKET_DATA.BUYERS;
    return `
    <div class="tab-page-header"><div class="tab-page-title">🏪 Marketplace</div><div class="tab-page-sub">Nearby mandis, buyers, and direct selling connections</div></div>
    <div class="section-header"><div class="section-title">🏢 Nearby Mandis / APMCs</div></div>
    <div class="mandi-cards" style="margin-bottom:var(--s5)">
      ${mandis.map(m=>`
      <div class="mandi-card">
        <div class="mandi-icon">${m.icon}</div>
        <div class="mandi-info">
          <div class="mandi-name">${m.name}</div>
          <div class="mandi-loc">${m.location}</div>
          <div class="mandi-dist">📍 ${m.dist} away</div>
          <div class="mandi-crops">Trades: ${m.crops}</div>
        </div>
        <button class="mandi-call-btn">📞 Call</button>
      </div>`).join('')}
    </div>
    <div class="section-header"><div class="section-title">🤝 Direct Buyers (Skip the Middleman)</div></div>
    <div class="buyer-cards">
      ${buyers.map(b=>`
      <div class="buyer-card">
        <div class="buyer-icon">${b.icon}</div>
        <div class="buyer-info">
          <div class="buyer-name">${b.name}</div>
          <div class="buyer-type">${b.type}</div>
          <div class="buyer-crops">${b.crops}</div>
          <div class="buyer-price">${b.price}</div>
        </div>
      </div>`).join('')}
    </div>
    `;
  }

  // ════════════════════════════════════════════════════════
  // WEATHER
  // ════════════════════════════════════════════════════════
  function renderWeather() {
    const w = engine.weather;
    return `
    <div class="tab-page-header"><div class="tab-page-title">🌤️ Weather Forecast</div><div class="tab-page-sub">${w.location}</div></div>
    <div class="weather-banner ${w.current.bannerClass}">
      <div class="weather-banner-bg">${w.current.icon}</div>
      <div class="weather-top"><div><div class="weather-temp">${w.current.temp}</div><div class="weather-condition">${w.current.condition}</div></div><div class="weather-icon-main">${w.current.icon}</div></div>
      <div class="weather-details">
        <div class="weather-detail">💧 ${w.current.humidity}</div>
        <div class="weather-detail">💨 ${w.current.wind}</div>
        <div class="weather-detail">🌡️ Feels ${w.current.feelsLike}</div>
        <div class="weather-detail">☀️ UV: ${w.current.uv}</div>
      </div>
    </div>
    <div class="weather-forecast">
      ${w.forecast.map(f=>`
      <div class="forecast-day ${f.day==='Today'?'today':''}">
        <div class="forecast-name">${f.day}</div>
        <div class="forecast-icon">${f.icon}</div>
        <div class="forecast-temp">${f.temp}</div>
        <div class="forecast-rain">💧${f.rain}</div>
      </div>`).join('')}
    </div>
    <div class="alert-cards">
      <div class="alert-card info">
        <div class="alert-icon">🌱</div>
        <div class="alert-content"><div class="alert-title">Farming Advisory</div><div class="alert-desc">${w.advice}</div></div>
      </div>
      ${w.rainTomorrow?`<div class="alert-card warning"><div class="alert-icon">🌧️</div><div class="alert-content"><div class="alert-title">Rain Forecast</div><div class="alert-desc">Postpone spraying. Good time for transplanting seedlings.</div></div></div>`:''}
    </div>
    <div class="section-header" style="margin-top:var(--s5)"><div class="section-title">🌱 Soil Conditions</div></div>
    <div class="resource-grid">
      <div class="resource-card"><div class="resource-label">💧 Soil Moisture</div><div class="resource-bar-wrap"><div class="resource-bar blue" style="width:${w.soil.moisture}%"></div></div><div class="resource-value">${w.soil.moisture}%</div></div>
      <div class="resource-card"><div class="resource-label">🌡️ Soil Temp</div><div class="resource-value" style="margin-top:8px;font-size:1.1rem">${w.soil.temp}</div></div>
      <div class="resource-card"><div class="resource-label">⚗️ Soil pH</div><div class="resource-value" style="margin-top:8px;font-size:1.1rem">${w.soil.ph}</div><div class="resource-tip">Neutral — ideal for most crops</div></div>
      <div class="resource-card"><div class="resource-label">🧪 Nutrients</div><div style="font-size:.75rem;margin-top:6px">N: <b>${w.soil.n}</b><br>P: <b>${w.soil.p}</b><br>K: <b>${w.soil.k}</b></div></div>
    </div>
    `;
  }

  // ════════════════════════════════════════════════════════
  // ANALYTICS (Advanced / wealthy / agripreneur only)
  // ════════════════════════════════════════════════════════
  function renderAnalytics() {
    const isAdv = ['wealthy','agripreneur'].includes(profile.persona);
    const est   = engine.getProfitEstimate();
    const fmt   = n => '₹'+Math.round(n).toLocaleString('en-IN');
    if (!isAdv) return `<div class="tab-page-header"><div class="tab-page-title">📊 Analytics</div></div><div class="alert-card info"><div class="alert-icon">🔒</div><div class="alert-content"><div class="alert-title">Advanced Feature</div><div class="alert-desc">Analytics are available for Wealthy Farmers and Agripreneur profiles. Update your profile in Settings.</div></div></div>`;
    return `
    <div class="tab-page-header"><div class="tab-page-title">📊 Farm Analytics</div><div class="tab-page-sub">Season overview — ${profile.landSize||'2'} acres, ${profile.farmTypes.length} farm type(s)</div></div>
    <div class="profit-card">
      <div class="profit-card-title">Season Net Profit (Estimated)</div>
      <div class="profit-card-num">${fmt(est.profit)}</div>
      <div class="profit-breakdown">
        <div class="profit-item"><div class="profit-item-num">${fmt(est.income)}</div>Gross Income</div>
        <div class="profit-item"><div class="profit-item-num">${fmt(est.expense)}</div>Total Expense</div>
      </div>
      <div class="profit-note">Simulation based on Indian average yield & price data 2025–26</div>
    </div>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-icon">🌾</div><div class="stat-num">${profile.landSize||'2'}</div><div class="stat-unit">acres</div><div class="stat-label">Total Land</div></div>
      <div class="stat-card"><div class="stat-icon">🚜</div><div class="stat-num">${profile.farmTypes.length}</div><div class="stat-unit">types</div><div class="stat-label">Farm Types</div></div>
      <div class="stat-card"><div class="stat-icon">📈</div><div class="stat-num">${fmt(est.income/+(profile.landSize||2))}</div><div class="stat-unit">/acre</div><div class="stat-label">Income/Acre</div><div class="stat-change pos">↑ vs avg</div></div>
      <div class="stat-card"><div class="stat-icon">💧</div><div class="stat-num">68%</div><div class="stat-unit">used</div><div class="stat-label">Water Efficiency</div><div class="stat-change pos">↑ 12% saved</div></div>
    </div>
    <div class="section-header"><div class="section-title">📋 By Farm Type</div></div>
    <div style="display:flex;flex-direction:column;gap:var(--s3);margin-bottom:var(--s5)">
      ${est.breakdown.map(b=>`
      <div style="background:#fff;border-radius:var(--r-md);padding:var(--s4);box-shadow:var(--shadow-sm);display:flex;justify-content:space-between;align-items:center">
        <div><div style="font-weight:700;font-size:.9rem">${b.label}</div><div style="font-size:.75rem;color:var(--text-secondary)">Income: ${fmt(b.income)} &nbsp;|&nbsp; Cost: ${fmt(b.expense)}</div></div>
        <div style="font-weight:800;font-size:.95rem;color:var(--green-700)">${fmt(b.income-b.expense)}</div>
      </div>`).join('')}
    </div>
    `;
  }

  // ════════════════════════════════════════════════════════
  // SMS / OFFLINE
  // ════════════════════════════════════════════════════════
  function renderSMS() {
    const tasks = engine.getTasks().slice(0,3);
    const w = engine.weather;
    return `
    <div class="tab-page-header"><div class="tab-page-title">📱 SMS / Offline Mode</div><div class="tab-page-sub">Low-internet access simulation</div></div>
    <div class="sms-preview">
      <div class="sms-header">SMS from KisanMitra | Shortcode 51969 | ${new Date().toLocaleDateString('en-IN')}</div>
      <div class="sms-line"><span class="sms-highlight">🌤 Weather:</span> ${w.current.temp}, ${w.current.condition}</div>
      <div class="sms-line" style="margin-top:8px"><span class="sms-highlight">✅ Tasks:</span></div>
      ${tasks.map((t,i)=>`<div class="sms-line">${i+1}. ${t.text}</div>`).join('')}
      <div class="sms-line" style="margin-top:8px"><span class="sms-highlight">⚠ Alert:</span> ${engine.getAllAlerts()[0]?.title||'No critical alerts'}</div>
      <div class="sms-line" style="margin-top:8px;color:#64748b;font-size:.75rem">Reply HELP for more. Free service — 1906 Kisan Helpline.</div>
    </div>
    <div class="sms-number-box" style="margin-bottom:var(--s4)">
      <div class="sms-num">51969</div>
      <div class="sms-num-label">Send "KISAN" to get daily advice via SMS</div>
      <div style="margin-top:var(--s3);font-size:.78rem;color:var(--text-secondary)">Also available on 1906 (Kisan Call Centre) — 24×7, free, all languages</div>
    </div>
    <div class="section-header"><div class="section-title">📞 Offline Support Options</div></div>
    <div class="alert-cards">
      <div class="alert-card info"><div class="alert-icon">📞</div><div class="alert-content"><div class="alert-title">Kisan Call Centre — 1800-180-1551</div><div class="alert-desc">Free advisory in all Indian languages. 365 days, 8 AM to 10 PM.</div></div></div>
      <div class="alert-card success"><div class="alert-icon">🏫</div><div class="alert-content"><div class="alert-title">Krishi Vigyan Kendra (KVK)</div><div class="alert-desc">Free training, soil testing, seed, and advisory. Present in every district.</div></div></div>
    </div>
    `;
  }

  // ════════════════════════════════════════════════════════
  // SETTINGS
  // ════════════════════════════════════════════════════════
  function renderSettings() {
    return `
    <div class="tab-page-header"><div class="tab-page-title">⚙️ Settings</div></div>
    <div class="settings-group">
      <div class="settings-group-title">Profile</div>
      <div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon">👤</span><div><div class="settings-item-text">${profile.name||'Farmer'}</div><div class="settings-item-sub">${engine.getPersonaLabel()}</div></div></div><span>›</span></div>
      <div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon">📍</span><div><div class="settings-item-text">Location</div><div class="settings-item-sub">${profile.location||'Not set'}</div></div></div><span>›</span></div>
      <div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon">🌾</span><div><div class="settings-item-text">Farm Types</div><div class="settings-item-sub">${profile.farmTypes.map(t=>window.FARM_DATA.FARM_TYPES[t]?.label).join(', ')}</div></div></div><span>›</span></div>
      <div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon">📐</span><div><div class="settings-item-text">Land Size</div><div class="settings-item-sub">${profile.landSize||'2'} acres</div></div></div><span>›</span></div>
    </div>
    <div class="settings-group">
      <div class="settings-group-title">Preferences</div>
      <div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon">🔔</span><div class="settings-item-text">Push Notifications</div></div><button class="toggle on"></button></div>
      <div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon">🎙️</span><div class="settings-item-text">Voice Interaction</div></div><button class="toggle on"></button></div>
      <div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon">📱</span><div class="settings-item-text">SMS Alerts (51969)</div></div><button class="toggle"></button></div>
    </div>
    <div class="settings-group">
      <div class="settings-group-title">Account</div>
      <div class="settings-item" id="reset-btn-settings"><div class="settings-item-left"><span class="settings-item-icon">🔄</span><div class="settings-item-text" style="color:var(--red-500)">Reset Profile & Start Over</div></div></div>
    </div>
    <div style="text-align:center;margin-top:var(--s6);color:var(--text-muted);font-size:.72rem">KisanMitra v2.0 • Built for India's 140M farmers</div>
    `;
  }

  // ════════════════════════════════════════════════════════
  // EVENT BINDING
  // ════════════════════════════════════════════════════════
  function bindTabEvents(tab) {
    // Task check-off
    document.querySelectorAll('[data-check]').forEach(el =>
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = el.dataset.check;
        engine.saveTask(id, !engine.isDone(id));
        renderTab(tab);
        renderSidebarMeta();
        updateAlertBadge();
      })
    );
    // Task detail expand
    document.querySelectorAll('[data-detid]').forEach(btn =>
      btn.addEventListener('click', () => {
        const det = document.getElementById('det-'+btn.dataset.detid);
        if (!det) return;
        const open = det.style.display !== 'none';
        det.style.display = open ? 'none' : 'block';
        btn.textContent = open ? 'ℹ️ See Details' : '▲ Hide Details';
      })
    );
    // Guide expand
    document.querySelectorAll('[data-gid]').forEach(btn =>
      btn.addEventListener('click', () => {
        const det = document.getElementById('gact-'+btn.dataset.gid);
        if (!det) return;
        const open = det.style.display !== 'none';
        det.style.display = open ? 'none' : 'block';
        btn.textContent = open ? '📋 View Actions' : '▲ Hide';
      })
    );
    // Quick nav links in home
    document.querySelectorAll('[data-nav]').forEach(el =>
      el.addEventListener('click', () => renderTab(el.dataset.nav))
    );
    // Settings reset
    document.getElementById('reset-btn-settings')?.addEventListener('click', () => {
      if (confirm('Reset your profile and start over?')) { localStorage.clear(); window.location.reload(); }
    });
    // Mandi call buttons
    document.querySelectorAll('.mandi-call-btn').forEach(btn =>
      btn.addEventListener('click', () => alert('In a real app, this would dial the mandi phone number directly.'))
    );
  }

  function bindBottomNav() {
    document.querySelectorAll('.bnav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTab(btn.dataset.tab);
        closeSidebar();
      });
    });
  }

  function bindSidebarNav() {
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        renderTab(link.dataset.tab);
        closeSidebar();
        // Sync bottom nav
        document.querySelectorAll('.bnav-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.tab === link.dataset.tab);
        });
      });
    });
  }

  function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.add('hidden');
  }

  return { init, renderTab };
})();

// ════════════════════════════════════════════════════════
// LEARN
// ════════════════════════════════════════════════════════
function renderLearn() {
  const profile = JSON.parse(localStorage.getItem('km_profile')||'{}');
  return `
  <div class="tab-page-header"><div class="tab-page-title">🎥 Learn & Grow</div><div class="tab-page-sub">Watch tutorials from experts globally</div></div>
  <div class="videos-list" style="display: flex; flex-direction: column; gap: var(--s3); margin-bottom:var(--s5);">
    ${window.FARM_DATA.getLearnVideos(profile.farmTypes || ['crop']).map((v, i)=>`
      <div class="video-card" style="background:var(--surface); border-radius:var(--radius-lg); overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05); cursor:pointer;">
        <div style="height:180px; background:#e0e0e0; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;">
          <div style="font-size:3rem;">${v.platform==='YouTube'?'▶️':v.platform==='Instagram'?'📱':'👻'}</div>
          <div style="position:absolute; bottom:10px; right:10px; background:rgba(0,0,0,0.7); color:white; font-size:0.8rem; padding:2px 8px; border-radius:4px;">${v.duration}</div>
        </div>
        <div style="padding:var(--s3);">
          <div style="font-weight:700; font-size:1.1rem; color:var(--text-primary); margin-bottom:5px;">${v.title}</div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:0.8rem; color:var(--text-secondary);">${v.platform}</div>
            <div style="background:var(--primary-color-light); color:var(--primary-color); font-size:0.75rem; padding:4px 10px; border-radius:12px; font-weight:600;">${v.tag}</div>
          </div>
        </div>
      </div>
    `).join('')}
  </div>
  `;
}

// ════════════════════════════════════════════════════════
// KNOWLEDGE CENTER
// ════════════════════════════════════════════════════════
function renderKnowledge() {
  return `
  <div class="tab-page-header"><div class="tab-page-title">📚 Knowledge Center</div><div class="tab-page-sub">Comprehensive guides and global news</div></div>
  
  <div class="section-header"><div class="section-title">Agriculture Types</div></div>
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--s3); margin-bottom:var(--s5);">
    ${Object.values(window.FARM_DATA.FARM_TYPES).map(f=>`
      <div style="background:var(--surface); padding:var(--s3); border-radius:var(--radius-md); box-shadow:0 2px 4px rgba(0,0,0,0.05); text-align:center; display:flex; flex-direction:column; align-items:center;">
        <div style="font-size:2rem; margin-bottom:5px;">${f.emoji}</div>
        <div style="font-weight:600; font-size:0.9rem;">${f.label}</div>
      </div>
    `).join('')}
  </div>

  <div class="section-header"><div class="section-title">🌍 Global Farming News</div></div>
  <div class="news-list" style="display: flex; flex-direction: column; gap: var(--s3); margin-bottom:var(--s5);">
    <div style="background:var(--surface); padding:var(--s3); border-radius:var(--radius-md); box-shadow:0 2px 5px rgba(0,0,0,0.05);">
      <div style="font-weight:700; font-size:1rem; margin-bottom:5px; color:var(--text-primary)">Global Organic Market Up 15%</div>
      <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:5px;">Demand for organic produce has skyrocketed. Good time for farmers to transition to organic certification.</div>
      <a href="#" style="font-size:0.85rem; font-weight:600; color:var(--primary-color);">Read detailed report →</a>
    </div>
    <div style="background:var(--surface); padding:var(--s3); border-radius:var(--radius-md); box-shadow:0 2px 5px rgba(0,0,0,0.05);">
      <div style="font-weight:700; font-size:1rem; margin-bottom:5px; color:var(--text-primary)">Breakthrough in Hydroponics</div>
      <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:5px;">New nutrient mixing formulas have proven to reduce lettuce grow time significantly.</div>
      <a href="#" style="font-size:0.85rem; font-weight:600; color:var(--primary-color);">Read detailed report →</a>
    </div>
    <div style="background:var(--surface); padding:var(--s3); border-radius:var(--radius-md); box-shadow:0 2px 5px rgba(0,0,0,0.05);">
      <div style="font-weight:700; font-size:1rem; margin-bottom:5px; color:var(--text-primary)">Climate: Early Monsoon Predictions</div>
      <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:5px;">Meteorological departments predict an early monsoon for the subcontinent affecting crop cycles.</div>
      <a href="#" style="font-size:0.85rem; font-weight:600; color:var(--primary-color);">Read detailed report →</a>
    </div>
  </div>
  `;
}

window.Dashboard = Dashboard;
