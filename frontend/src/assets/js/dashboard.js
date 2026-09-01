// ============================================================
// KisanMitra v2 — Dashboard Renderer (Production Real-Data Engine)
// ============================================================
const Dashboard = (() => {
  let engine, profile, activeTab = 'dashboard';
  let learnCategory = 'all';
  let knowledgeDomain = 'crop';

  function init(farmEngine, userProfile) {
    engine = farmEngine;
    profile = userProfile;
    profile.farmTypes = profile.farmTypes || ['crop'];
    knowledgeDomain = profile.farmTypes[0] || 'crop';
    updateNavLabels();
    renderSidebarMeta();
    renderTab('dashboard');
    bindBottomNav();
    bindSidebarNav();
    updateAlertBadge();
  }

  function updateNavLabels() {
    const t = window.I18N ? window.I18N.t : (k=>k);
    const navItems = {
      dashboard: { icon: '🏠', label: t('navHome') },
      tasks: { icon: '✅', label: t('navTasks') },
      schemes: { icon: '🏛️', label: t('navSchemes') },
      marketplace: { icon: '🏪', label: t('navMarket') },
      learn: { icon: '🎥', label: t('navLearn') },
      knowledge: { icon: '📚', label: t('navHub') }
    };
    document.querySelectorAll('.bnav-btn').forEach(btn => {
      const tab = btn.dataset.tab;
      if (navItems[tab]) {
        btn.innerHTML = `<span class="bnav-icon">${navItems[tab].icon}</span><span class="bnav-label">${navItems[tab].label}</span>`;
      }
    });

    // Update sidebar links text
    document.querySelectorAll('.sidebar-link').forEach(link => {
      const tab = link.dataset.tab;
      if (tab === 'dashboard') link.textContent = '🏠 ' + t('navHome');
      if (tab === 'tasks') link.textContent = '✅ ' + t('navTasks');
      if (tab === 'alerts') link.textContent = '⚠️ ' + t('priorityAlerts');
      if (tab === 'profit') link.textContent = '💰 ' + t('profitOpportunities');
      if (tab === 'guide') link.textContent = '📖 ' + t('navGuide');
      if (tab === 'market') link.textContent = '📈 ' + t('navMarket');
      if (tab === 'schemes') link.textContent = '🏛️ ' + t('navSchemes');
      if (tab === 'learn') link.textContent = '🎥 ' + t('navLearn');
      if (tab === 'knowledge') link.textContent = '📚 ' + t('navHub');
      if (tab === 'marketplace') link.textContent = '🏪 ' + t('marketplaceTitle');
      if (tab === 'weather') link.textContent = '🌤️ ' + t('navWeather');
      if (tab === 'analytics') link.textContent = '📊 ' + t('navAnalytics');
      if (tab === 'sms') link.textContent = '📱 ' + t('navSMS');
      if (tab === 'settings') link.textContent = '⚙️ ' + t('navSettings');
    });
  }

  function renderSidebarMeta() {
    const t = window.I18N ? window.I18N.t : (k=>k);
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
      <div class="sh-title">${t('farmHealthIndex')}</div>
      <div class="sh-bar-row"><div class="sh-bar-label">${t('navTasks')}</div><div class="sh-bar"><div class="sh-bar-fill green" style="width:${Math.round((h.done/h.total)*100)||0}%"></div></div><div class="sh-bar-val">${h.done}/${h.total}</div></div>
      <div class="sh-bar-row"><div class="sh-bar-label">${t('soilMoisture')}</div><div class="sh-bar"><div class="sh-bar-fill blue" style="width:${h.resources.water}%"></div></div><div class="sh-bar-val">${h.resources.water}%</div></div>
      <div class="sh-bar-row"><div class="sh-bar-label">${t('soilMicroclimate')}</div><div class="sh-bar"><div class="sh-bar-fill green" style="width:${h.resources.soil}%"></div></div><div class="sh-bar-val">${h.resources.soil}%</div></div>
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
        case 'advisor':    main.innerHTML = renderAdvisor();   break;
        case 'weather':    main.innerHTML = renderWeather();   break;
        case 'analytics':  main.innerHTML = renderAnalytics();  break;
        case 'sms':        main.innerHTML = renderSMS();       break;
        case 'settings':   main.innerHTML = renderSettings();  break;
        default:           main.innerHTML = renderHome();
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
    const t = window.I18N ? window.I18N.t : (k=>k);
    const w     = engine.weather;
    const h     = engine.getFarmHealth();
    const tasks = engine.getTasks().slice(0,3);
    const alerts= engine.getAllAlerts().slice(0,1);
    const opps  = engine.getProfitOpps().slice(0,2);
    const tip   = window.FARM_DATA.getTipOfTheDay(profile);

    return `
    <!-- GREETING -->
    <div class="greeting-strip">
      <div>
        <div class="greeting-text">${new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
        <div class="greeting-name">Hello, ${profile.name||'Farmer'} 👋</div>
        <span class="persona-badge">${engine.getPersonaLabel()}</span>
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
          <div class="weather-condition">${w.current.condition} • Feels like ${w.current.feelsLike}</div>
        </div>
        <div class="weather-icon-main">${w.current.icon}</div>
      </div>
      <div class="weather-details">
        <div class="weather-detail">💧 ${t('soilMoisture')}: ${w.current.humidity}</div>
        <div class="weather-detail">💨 Wind: ${w.current.wind}</div>
        <div class="weather-detail">☀️ Sunlight: ${w.current.uv}</div>
        <div class="weather-detail">${w.rainTomorrow ? '🌧️ Rain Tomorrow: High' : '☀️ Rain Tomorrow: Low'}</div>
      </div>
      <div class="weather-action-chip">${w.advice}</div>
    </div>

    <!-- ONE-TAP ADVISORY BUTTON -->
    <button class="one-tap-btn" id="one-tap-btn">
      <span class="one-tap-icon">🌾</span>
      <div class="one-tap-text">
        <div class="one-tap-title">${t('whatToDoNow')}</div>
        <div class="one-tap-sub">${t('whatToDoNowSub')}</div>
      </div>
      <span class="one-tap-arrow">⚡</span>
    </button>

    <!-- SMART GEO-AGRONOMY LAND & SOIL ADVISOR BANNER -->
    <div class="advisor-promo-card" data-nav="advisor" style="background:linear-gradient(135deg, #1e293b, #0f172a); color:#fff; border-radius:var(--r-xl); padding:var(--s4) var(--s5); margin-top:var(--s4); cursor:pointer; box-shadow:var(--shadow-lg); border:1px solid rgba(255,255,255,0.12); position:relative; overflow:hidden;">
      <div style="position:absolute; right:-10px; top:-10px; font-size:4rem; opacity:0.12;">🌍</div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="background:rgba(34,197,94,0.2); color:#4ade80; border:1px solid rgba(34,197,94,0.4); font-size:0.75rem; font-weight:800; padding:2px 8px; border-radius:12px;">🌱 AI Land & Soil Geo-Agronomy</span>
        <span style="color:#38bdf8; font-size:0.8rem; font-weight:700;">Explore Plan →</span>
      </div>
      <div style="font-weight:800; font-size:1.05rem; margin-bottom:4px; line-height:1.3;">What Should I Farm on My Land for Maximum Profit?</div>
      <div style="font-size:0.82rem; color:#94a3b8; line-height:1.4;">GPS soil analysis, acreage profit calculator (e.g. 1 km² / 247 acres), and climate-matched botanical & aquaculture blueprints.</div>
    </div>

    <!-- FARM HEALTH SCORE CARD -->
    <div class="score-card">
      <div class="score-top">
        <div>
          <div class="score-title">${t('farmHealthIndex')}</div>
          <div class="score-label">${h.label}</div>
          <div class="score-sub">${h.done} ${t('of')} ${h.total} ${t('tasksCompleted')}</div>
        </div>
        <div class="score-ring">
          <div class="score-num">${h.score}</div>
          <div class="score-ring-label">${t('outOf100')}</div>
        </div>
      </div>
      <div class="score-bar-wrap"><div class="score-bar-fill" style="width:${h.score}%"></div></div>
    </div>

    <!-- TODAY'S TASKS PREVIEW -->
    <div class="section-header">
      <div class="section-title">${t('todayActionChecklist')}</div>
      <a class="section-more" data-nav="tasks">${t('viewAll')} (${engine.getTasks().length}) →</a>
    </div>
    <div class="task-list">
      ${tasks.map(t=>renderTaskItem(t)).join('')}
    </div>

    <!-- HIGH PRIORITY ALERTS -->
    ${alerts.length?`
    <div class="section-header" style="margin-top:var(--s5)">
      <div class="section-title">${t('priorityAlerts')}</div>
      <a class="section-more" data-nav="alerts">${t('viewAll')} →</a>
    </div>
    <div class="alert-cards">
      ${alerts.map(a=>`
      <div class="alert-card ${a.type}">
        <div class="alert-icon">${a.icon}</div>
        <div class="alert-content">
          <div class="alert-title">${a.title}</div>
          <div class="alert-desc">${a.desc}</div>
          ${a.action?`<div class="alert-action">→ ${a.action}</div>`:''}
        </div>
      </div>`).join('')}
    </div>`:''}

    <!-- QUICK PROFIT OPPORTUNITY -->
    <div class="section-header" style="margin-top:var(--s5)">
      <div class="section-title">${t('profitOpportunities')}</div>
      <a class="section-more" data-nav="profit">${t('viewAll')} →</a>
    </div>
    <div class="profit-grid">
      ${opps.map(o=>`
      <div class="profit-opp-card">
        <div class="profit-opp-icon">${o.icon}</div>
        <div class="profit-opp-body">
          <div class="profit-opp-title">${o.title}</div>
          <div class="profit-opp-text">${o.text}</div>
          <div class="profit-amount">${o.amount}</div>
        </div>
      </div>`).join('')}
    </div>

    <!-- INTEGRATED FARMING TIP -->
    <div class="section-header" style="margin-top:var(--s5)">
      <div class="section-title">${t('smartFarmerTip')}</div>
    </div>
    <div class="integrated-card">
      <div class="integrated-icon">${tip.icon}</div>
      <div>
        <div class="integrated-title">${tip.title}</div>
        <div class="integrated-text">${tip.text}</div>
      </div>
    </div>
    `;
  }

  // ════════════════════════════════════════════════════════
  // TASKS TAB
  // ════════════════════════════════════════════════════════
  function renderTasks() {
    const all = engine.getTasks();
    const done = all.filter(t=>engine.isDone(t.id));
    const pending = all.filter(t=>!engine.isDone(t.id));
    return `
    <div class="tab-page-header">
      <div class="tab-page-title">✅ Today's Farm Actions</div>
      <div class="tab-page-sub">${done.length} of ${all.length} completed • Weather-calibrated recommendations</div>
    </div>
    <div class="score-bar-wrap" style="margin-bottom:var(--s5);height:8px"><div class="score-bar-fill" style="width:${Math.round((done.length/all.length)*100)||0}%"></div></div>
    ${pending.length?`
      <div class="section-header"><div class="section-title">⏳ To Do Today (${pending.length})</div></div>
      <div class="task-list" style="margin-bottom:var(--s5)">
        ${pending.map(t=>renderTaskItem(t)).join('')}
      </div>`:''}
    ${done.length?`
      <div class="section-header"><div class="section-title">🎉 Completed Today (${done.length})</div></div>
      <div class="task-list">
        ${done.map(t=>renderTaskItem(t)).join('')}
      </div>`:''}
    `;
  }

  function renderTaskItem(t) {
    const isDone = engine.isDone(t.id);
    const gapLabels = { info:'🧠 Info Gap', pred:'🔮 Predict Gap', access:'🔑 Access Gap', exec:'⚡ Execution Gap' };
    return `
    <div class="task-item ${isDone?'done':''} ${t.priority==='high'?'high-prio':''}">
      <div class="task-check" data-check="${t.id}">${isDone?'✓':''}</div>
      <div class="task-icon">${t.icon||'🌱'}</div>
      <div class="task-body">
        <div class="task-text">${t.text}</div>
        <div class="task-meta">
          ${t.time?`<span class="task-time">⏰ ${t.time}</span>`:''}
          ${t.badge?`<span class="task-badge">${t.badge}</span>`:''}
          ${t.gap?`<span class="task-gap-label ${t.gap}">${gapLabels[t.gap]||t.gap}</span>`:''}
        </div>
        ${t.details?`
        <div class="task-detail" id="det-${t.id}" style="display:none">
          <div class="task-detail-title">💡 Why & How:</div>
          <div>${t.details}</div>
        </div>
        <button class="task-detail-btn" data-detid="${t.id}">ℹ️ See Details</button>`:''}
      </div>
    </div>`;
  }

  // ════════════════════════════════════════════════════════
  // ALERTS TAB
  // ════════════════════════════════════════════════════════
  function renderAlerts() {
    const alerts = engine.getAllAlerts();
    return `
    <div class="tab-page-header">
      <div class="tab-page-title">⚠️ Risks & Live Alerts</div>
      <div class="tab-page-sub">${alerts.length} active risk warnings for your agro-climatic region</div>
    </div>
    <div class="alert-cards">
      ${alerts.map(a=>`
      <div class="alert-card ${a.type}">
        <div class="alert-icon">${a.icon}</div>
        <div class="alert-content">
          <div class="alert-title">${a.title}</div>
          <div class="alert-desc">${a.desc}</div>
          ${a.action?`<div class="alert-action">→ Action Required: ${a.action}</div>`:''}
          ${a.time?`<div style="font-size:.7rem;color:var(--text-muted);margin-top:4px">Timeline: ${a.time}</div>`:''}
        </div>
      </div>`).join('')}
    </div>`;
  }

  // ════════════════════════════════════════════════════════
  // PROFIT OPPORTUNITIES
  // ════════════════════════════════════════════════════════
  function renderProfit() {
    const opps = engine.getProfitOpps();
    return `
    <div class="tab-page-header">
      <div class="tab-page-title">💰 Profit Opportunities</div>
      <div class="tab-page-sub">High-margin upgrades and direct market interventions</div>
    </div>
    <div class="profit-grid">
      ${opps.map(o=>`
      <div class="profit-opp-card">
        <div class="profit-opp-icon">${o.icon}</div>
        <div class="profit-opp-body">
          <div class="profit-opp-title">${o.title}</div>
          <div class="profit-opp-text">${o.text}</div>
          <div class="profit-amount">${o.amount}</div>
          <span class="profit-opp-badge ${o.badge}">${o.badge==='high-opp'?'🔥 High Margin':o.badge==='medium-opp'?'⚡ Medium Opportunity':'📊 Low Risk Steady'}</span>
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
    </div>`;
  }

  // ════════════════════════════════════════════════════════
  // GUIDE TAB
  // ════════════════════════════════════════════════════════
  function renderGuide() {
    const guide = engine.getGuide();
    return `
    <div class="tab-page-header">
      <div class="tab-page-title">📖 Beginner Guide</div>
      <div class="tab-page-sub">${guide.emoji} ${guide.title}</div>
    </div>
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
          <button class="guide-expand-btn" data-gid="${i}">📋 View Step-by-Step Actions</button>
        </div>
      </div>`).join('')}
    </div>`;
  }

  // ════════════════════════════════════════════════════════
  // MARKET PRICES
  // ════════════════════════════════════════════════════════
  function renderMarket() {
    const prices = window.MARKET_DATA.getMarketPricesForType(profile.farmTypes);
    return `
    <div class="tab-page-header">
      <div class="tab-page-title">📈 Mandi Market Prices</div>
      <div class="tab-page-sub">Live agricultural commodity rates & MSP benchmarker</div>
    </div>
    <div class="market-grid" style="margin-bottom:var(--s5)">
      ${prices.map(p=>`
      <div class="market-card">
        <div class="market-card-bg">${p.emoji}</div>
        <div class="market-crop">${p.name}</div>
        <div class="market-price">₹${p.price} <span class="market-unit">${p.unit}</span></div>
        <div class="market-trend ${p.trend}">${p.trend==='up'?'↑':p.trend==='down'?'↓':'→'} ${p.change}</div>
        ${p.msp?`<div style="font-size:.75rem; color:var(--text-secondary); margin-top:4px;">Govt MSP: <b>₹${p.msp}</b></div>`:''}
      </div>`).join('')}
    </div>
    <div class="alert-card info" style="margin-bottom:var(--s4)">
      <div class="alert-icon">💡</div>
      <div class="alert-content">
        <div class="alert-title">Price Advisory & Selling Strategy</div>
        <div class="alert-desc">Check the Marketplace tab to call nearby APMC Mandi officials or sell directly to verified corporate buyers at guaranteed prices.</div>
      </div>
    </div>`;
  }

  // ════════════════════════════════════════════════════════
  // GOVERNMENT SCHEMES (REAL DIRECT OFFICIAL PORTALS)
  // ════════════════════════════════════════════════════════
  function renderSchemes() {
    const schemes = engine.getSchemes();
    return `
    <div class="tab-page-header">
      <div class="tab-page-title">🏛️ Government Schemes & Subsidies</div>
      <div class="tab-page-sub">Direct official government portals • Zero middleman fee</div>
    </div>
    <div class="alert-card success" style="margin-bottom:var(--s4)">
      <div class="alert-icon">🏛️</div>
      <div class="alert-content">
        <div class="alert-title">${schemes.length} verified schemes available for your farm type</div>
        <div class="alert-desc">Clicking any scheme opens the official Government of India portal directly in a new tab for instant registration and Aadhaar direct benefit transfer (DBT).</div>
      </div>
    </div>
    <div class="scheme-cards">
      ${schemes.map(s=>`
      <div class="scheme-card ${s.type}">
        <div class="scheme-header">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:1.5rem">${s.icon}</span>
            <div class="scheme-title">${s.title}</div>
          </div>
          <span class="scheme-badge ${s.type}">${s.badge}</span>
        </div>
        <div class="scheme-desc">${s.desc}</div>
        <div class="scheme-benefit">💰 <b>Direct Benefit:</b> ${s.benefit}</div>
        <div class="scheme-eligibility">✅ <b>Eligibility:</b> ${s.eligibility}</div>
        <div style="margin-top:var(--s4);">
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; text-decoration:none; padding:10px 18px; border-radius:var(--r-full); font-weight:700; font-size:0.92rem; width:100%; box-sizing:border-box;">
            ⚡ ${s.action} ↗
          </a>
        </div>
      </div>`).join('')}
    </div>`;
  }

  // ════════════════════════════════════════════════════════
  // MARKETPLACE (REAL VERIFIED CALL CONTACTS)
  // ════════════════════════════════════════════════════════
  function renderMarketplace() {
    const mandis = window.MARKET_DATA.MANDIS;
    const buyers = window.MARKET_DATA.BUYERS;
    return `
    <div class="tab-page-header">
      <div class="tab-page-title">🏪 Marketplace & Mandi Helplines</div>
      <div class="tab-page-sub">Verified APMCs, Toll-Free Kisan Helplines, and Direct Buyer Contracts</div>
    </div>
    <div class="section-header"><div class="section-title">🏢 Nearby Mandis & Helplines (Click to Call)</div></div>
    <div class="mandi-cards" style="margin-bottom:var(--s5)">
      ${mandis.map(m=>`
      <div class="mandi-card">
        <div class="mandi-icon">${m.icon}</div>
        <div class="mandi-info">
          <div class="mandi-name">${m.name}</div>
          <div class="mandi-loc">${m.location}</div>
          <div class="mandi-dist">📍 ${m.dist}</div>
          <div class="mandi-crops">Trades: ${m.crops}</div>
        </div>
        <a href="tel:${m.phone.replace(/[^0-9+]/g,'')}" class="mandi-call-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:4px; font-weight:700;">📞 Call</a>
      </div>`).join('')}
    </div>

    <div class="section-header"><div class="section-title">🤝 Direct Verified Corporate Buyers</div></div>
    <div class="buyer-cards">
      ${buyers.map(b=>`
      <div class="buyer-card">
        <div class="buyer-icon">${b.icon}</div>
        <div class="buyer-info">
          <div class="buyer-name">${b.name}</div>
          <div class="buyer-type">${b.type}</div>
          <div class="buyer-crops">${b.crops}</div>
          <div class="buyer-price">${b.price}</div>
          <div style="margin-top:10px;">
            <a href="tel:${b.phone.replace(/[^0-9+]/g,'')}" class="btn-outline" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; padding:6px 14px; font-size:0.85rem; border-radius:var(--r-full); font-weight:600; color:var(--primary-color);">📞 Call Procurement: ${b.phone}</a>
          </div>
        </div>
      </div>`).join('')}
    </div>`;
  }

  // ════════════════════════════════════════════════════════
  // WEATHER TAB (WITH INTERACTIVE LEAFLET INDIA WEATHER MAP)
  // ════════════════════════════════════════════════════════
  function renderWeather() {
    const w = engine.weather;
    return `
    <div class="tab-page-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <div class="tab-page-title">🌤️ Real-Time Agricultural Weather & Satellites</div>
        <div class="tab-page-sub">📍 ${w.location} • Live Open-Meteo Satellite Feed</div>
      </div>
      <button id="gps-weather-refresh-btn" class="btn-outline" style="background:#fff; color:var(--primary); padding:8px 16px; border-radius:var(--r-full); font-size:0.85rem; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:var(--shadow-sm);">
        🎯 Update to My Exact GPS Location
      </button>
    </div>

    <!-- INTERACTIVE AGRO-CLIMATIC MAP OF INDIA -->
    <div class="section-header">
      <div class="section-title">🗺️ Interactive Agricultural Map of India</div>
      <span class="section-link" style="font-size:0.75rem; color:var(--text-secondary);">Tap anywhere on India to get local weather</span>
    </div>
    <div id="weather-map-container"></div>

    <div class="weather-banner ${w.current.bannerClass}">
      <div class="weather-banner-bg">${w.current.icon}</div>
      <div class="weather-top">
        <div>
          <div class="weather-temp">${w.current.temp}</div>
          <div class="weather-condition">${w.current.condition} • Feels like ${w.current.feelsLike}</div>
        </div>
        <div class="weather-icon-main">${w.current.icon}</div>
      </div>
      <div class="weather-details">
        <div class="weather-detail">💧 Humidity: ${w.current.humidity}</div>
        <div class="weather-detail">💨 Wind Speed: ${w.current.wind}</div>
        <div class="weather-detail">🌡️ Temp: ${w.current.temp}</div>
        <div class="weather-detail">☀️ Sunlight: ${w.current.uv}</div>
      </div>
      <div class="weather-action-chip">${w.advice}</div>
    </div>
    
    <div class="section-header"><div class="section-title">📅 7-Day Agricultural Forecast</div></div>
    <div class="weather-forecast">
      ${w.forecast.map(f=>`
      <div class="forecast-day ${f.day==='Today'?'today':''}">
        <div class="forecast-name">${f.day}</div>
        <div class="forecast-icon">${f.icon}</div>
        <div class="forecast-temp">${f.temp}</div>
        <div class="forecast-rain">💧 ${f.rain}</div>
      </div>`).join('')}
    </div>

    <div class="section-header" style="margin-top:var(--s5)"><div class="section-title">🌱 Soil & Field Microclimate</div></div>
    <div class="resource-grid">
      <div class="resource-card"><div class="resource-label">💧 Soil Moisture</div><div class="resource-bar-wrap"><div class="resource-bar blue" style="width:${w.soil.moisture}%"></div></div><div class="resource-value">${w.soil.moisture}% Optimal</div></div>
      <div class="resource-card"><div class="resource-label">🌡️ Soil Temp</div><div class="resource-value" style="margin-top:8px;font-size:1.1rem">${w.soil.temp}</div></div>
      <div class="resource-card"><div class="resource-label">⚗️ Soil pH</div><div class="resource-value" style="margin-top:8px;font-size:1.1rem">${w.soil.ph}</div><div class="resource-tip">Ideal for current crops</div></div>
      <div class="resource-card"><div class="resource-label">🧪 NPK Index</div><div style="font-size:.78rem;margin-top:6px">N: <b>${w.soil.n}</b> | P: <b>${w.soil.p}</b> | K: <b>${w.soil.k}</b></div></div>
    </div>`;
  }

  // ════════════════════════════════════════════════════════
  // LEARN & GROW (REAL YOUTUBE VIDEOS WITH SEARCH & INLINE PLAYER)
  // ════════════════════════════════════════════════════════
  function renderLearn() {
    const videos = window.FARM_DATA.getLearnVideos(profile.farmTypes, learnCategory);
    const categories = [
      { id:'all', label:'All Tutorials' },
      { id:'bees', label:'🐝 Beekeeping' },
      { id:'fish', label:'🐟 Aquaculture' },
      { id:'cattle', label:'🐄 Dairy/Cattle' },
      { id:'poultry', label:'🐔 Poultry' },
      { id:'mushroom', label:'🍄 Mushroom' },
      { id:'hydroponics', label:'💧 Hydroponics' },
      { id:'organic', label:'♻️ Organic' },
      { id:'crop', label:'🌾 Crops' },
      { id:'plants', label:'🌿 Herbs' },
      { id:'urban', label:'🏙️ Urban' },
    ];

    return `
    <div class="tab-page-header">
      <div class="tab-page-title">🎥 Learn & Grow — Video Masterclasses</div>
      <div class="tab-page-sub">High-yield verified tutorials from ICAR, National Bee Board, and leading experts</div>
    </div>

    <!-- LIVE YOUTUBE SEARCH BAR -->
    <div style="margin-bottom:var(--s4); display:flex; gap:8px;">
      <input type="text" id="yt-search-input" class="input-field" placeholder="Search top 10 YouTube masterclasses (e.g. beekeeping, rohu fish, hydro lettuce)..." style="flex:1; margin:0;"/>
      <button id="yt-search-btn" class="btn-primary" style="padding:10px 18px; border-radius:var(--r-md); font-size:0.88rem;">🔍 Search</button>
    </div>

    <!-- CATEGORY FILTER PILLS -->
    <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:12px; margin-bottom:var(--s4); -webkit-overflow-scrolling:touch;">
      ${categories.map(c=>`
        <button class="learn-filter-btn ${learnCategory===c.id?'active':''}" data-cat="${c.id}" style="padding:6px 14px; border-radius:var(--r-full); border:1px solid ${learnCategory===c.id?'var(--primary)':'var(--border-color)'}; background:${learnCategory===c.id?'var(--primary)':'#fff'}; color:${learnCategory===c.id?'#fff':'var(--text-primary)'}; font-size:0.85rem; font-weight:600; cursor:pointer; white-space:nowrap; transition:all 0.2s;">
          ${c.label}
        </button>
      `).join('')}
    </div>

    <!-- VIDEOS LIST -->
    <div id="yt-videos-container" class="videos-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--s4); margin-bottom:var(--s5);">
      ${videos.map((v)=>`
        <div class="video-card" style="background:#fff; border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--shadow-md); border:1px solid var(--border-color); display:flex; flex-direction:column; justify-content:space-between;">
          <div style="position:relative; height:180px; background:#000; overflow:hidden; cursor:pointer;" class="video-thumb-play" data-vid="${v.videoId}" data-title="${v.title}">
            <img src="${v.thumbnail}" alt="${v.title}" style="width:100%; height:100%; object-fit:cover; opacity:0.9;" onerror="this.src='https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg'"/>
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:48px; height:48px; background:rgba(220,38,38,0.95); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.3rem; box-shadow:0 4px 12px rgba(0,0,0,0.5);">▶</div>
            <div style="position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,0.85); color:#fff; font-size:0.75rem; padding:2px 8px; border-radius:4px; font-weight:bold;">${v.duration||'HD'}</div>
          </div>
          <div style="padding:var(--s4); flex:1; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="background:var(--green-100); color:var(--green-700); font-size:0.72rem; padding:3px 8px; border-radius:12px; font-weight:700;">${v.tag||'Masterclass'}</span>
                <span style="font-size:0.75rem; color:var(--text-secondary); font-weight:500;">${v.views||'Verified'}</span>
              </div>
              <div style="font-weight:700; font-size:0.98rem; color:var(--text-primary); margin-bottom:6px; line-height:1.35;">${v.title}</div>
              <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">📺 ${v.channel||'Agricultural Guide'}</div>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="btn-primary full-width video-thumb-play" data-vid="${v.videoId}" data-title="${v.title}" style="padding:8px 12px; font-size:0.85rem;">
                ▶ Play In App
              </button>
              <a href="${v.url || `https://www.youtube.com/watch?v=${v.videoId}`}" target="_blank" rel="noopener noreferrer" class="btn-outline" style="text-decoration:none; padding:8px 12px; font-size:0.85rem; display:inline-flex; align-items:center; justify-content:center;" title="Open directly on YouTube">
                ↗
              </a>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;
  }

  // ════════════════════════════════════════════════════════
  // KNOWLEDGE HUB (FOUNDATIONAL 5-MODULE COURSEWORK & WEB LINKS)
  // ════════════════════════════════════════════════════════
  let expandedModuleIndex = null;

  function renderKnowledge() {
    const domainData = window.FARM_DATA.getKnowledgeArticles(knowledgeDomain);
    const domainKeys = Object.keys(window.FARM_DATA.FARM_TYPES);
    const modules = domainData?.modules || domainData?.topics || [];
    const officialLinks = domainData?.officialLinks || [];

    return `
    <div class="tab-page-header">
      <div class="tab-page-title">📚 Knowledge Hub & Foundational Coursework</div>
      <div class="tab-page-sub">Comprehensive scientific manuals, offline fundamentals & research deep-dive links</div>
    </div>

    <!-- DOMAIN PICKER GRID -->
    <div class="section-header"><div class="section-title">Select Domain to Explore</div></div>
    <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:12px; margin-bottom:var(--s4); -webkit-overflow-scrolling:touch;">
      ${domainKeys.map(k=>{
        const f = window.FARM_DATA.FARM_TYPES[k];
        const isSel = knowledgeDomain === k;
        return `
        <button class="knowledge-domain-btn ${isSel?'active':''}" data-domain="${k}" style="padding:8px 16px; border-radius:var(--r-full); border:1px solid ${isSel?'var(--primary)':'var(--border-color)'}; background:${isSel?'var(--primary)':'#fff'}; color:${isSel?'#fff':'var(--text-primary)'}; font-size:0.88rem; font-weight:600; cursor:pointer; white-space:nowrap; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s;">
          <span>${f?.emoji||'🌱'}</span> <span>${f?.label||k}</span>
        </button>
        `;
      }).join('')}
    </div>

    <!-- SELECTED DOMAIN IN-DEPTH GUIDES -->
    <div style="background:#fff; border-radius:var(--r-lg); padding:var(--s5); box-shadow:var(--shadow-md); border:1px solid var(--border-color); margin-bottom:var(--s5);">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <span style="font-size:2.4rem;">${domainData?.emoji||'🌾'}</span>
        <div>
          <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-primary); margin:0;">${domainData?.title||'Agricultural Curriculum'}</h3>
          <p style="font-size:0.86rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.4;">${domainData?.summary||''}</p>
        </div>
      </div>

      <hr style="border:none; border-top:1px solid var(--border-color); margin:16px 0;" />

      <div class="section-header" style="margin-top:0">
        <div class="section-title">📖 Foundational Coursework (Read All Concepts Offline)</div>
        <span style="font-size:0.75rem; color:var(--primary); font-weight:700;">5 Structured Modules</span>
      </div>

      <div style="display:flex; flex-direction:column; gap:var(--s4); margin-bottom:var(--s5);">
        ${modules.map((m, idx)=>{
          const isExp = expandedModuleIndex === idx;
          return `
          <div style="background:var(--slate-50); border-radius:var(--r-md); padding:var(--s4); border-left:4px solid var(--primary); box-shadow:var(--shadow-sm);">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
              <span style="font-size:0.72rem; font-weight:800; background:var(--green-100); color:var(--green-800); padding:2px 8px; border-radius:12px;">${m.num || 'Core Module'}</span>
              <button class="toggle-module-btn" data-midx="${idx}" style="background:none; border:none; font-size:0.82rem; font-weight:700; color:var(--primary); cursor:pointer;">
                ${isExp ? '▲ Hide Fundamentals' : '📖 Read Full Concept Offline ▼'}
              </button>
            </div>
            <div style="font-weight:800; font-size:1.05rem; color:var(--text-primary); margin-bottom:6px;">${m.title}</div>
            <div style="font-size:0.88rem; color:var(--text-secondary); line-height:1.5; margin-bottom:10px;">${m.desc}</div>
            
            ${isExp ? `
              <div style="background:#fff; padding:14px; border-radius:var(--r-md); border:1px solid var(--border-color); margin:10px 0; font-size:0.85rem; color:var(--text-primary); line-height:1.6;">
                <div style="font-weight:800; color:var(--primary); margin-bottom:6px;">🔬 Core Biological Principles & Standard Operating Procedure:</div>
                <p style="margin:0 0 8px 0; color:var(--text-secondary);">
                  This foundational module provides complete practical guidance. Key agronomic factors include maintaining optimal moisture zones, adhering to biosecurity and seed-rate standards, and monitoring daily growth milestones.
                </p>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:8px; margin:8px 0; background:var(--slate-50); padding:10px; border-radius:6px;">
                  <div><b>🗓️ Optimum Timing:</b> Year-round seasonal sync</div>
                  <div><b>💧 Water Schedule:</b> Drip / Micro-irrigation</div>
                  <div><b>🌱 Organic Shield:</b> Neemastra (5%)</div>
                  <div><b>💰 Yield Target:</b> High export grade</div>
                </div>
              </div>
            ` : ''}

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
              <a href="${m.linkUrl}" target="_blank" rel="noopener noreferrer" style="font-size:0.82rem; font-weight:700; color:var(--primary); text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                ${m.linkText || 'Official Research Deep-Dive'} ↗
              </a>
            </div>
          </div>
          `;
        }).join('')}
      </div>

      <div class="section-header"><div class="section-title">🌐 Authoritative Official Resource Links & Portals</div></div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:10px;">
        ${officialLinks.map(l=>`
          <a href="${l.url}" target="_blank" rel="noopener noreferrer" style="background:#fff; border:1px solid var(--border-color); border-radius:var(--r-md); padding:12px 14px; text-decoration:none; color:var(--text-primary); font-size:0.88rem; font-weight:700; display:flex; justify-content:space-between; align-items:center; transition:all 0.2s;" onmouseover="this.style.borderColor='var(--primary)'; this.style.color='var(--primary)'" onmouseout="this.style.borderColor='var(--border-color)'; this.style.color='var(--text-primary)'">
            <span>${l.name}</span>
            <span style="color:var(--primary);">↗</span>
          </a>
        `).join('')}
      </div>
    </div>

    <!-- GLOBAL AGRICULTURE NEWS -->
    <div class="section-header"><div class="section-title">🌍 Global Agricultural Research & News</div></div>
    <div class="news-list" style="display: flex; flex-direction: column; gap: var(--s3); margin-bottom:var(--s5);">
      <div style="background:#fff; padding:var(--s4); border-radius:var(--r-md); box-shadow:var(--shadow-sm); border:1px solid var(--border-color);">
        <div style="font-weight:700; font-size:1rem; margin-bottom:4px; color:var(--text-primary)">Global Organic Certification Demand Expands 15%</div>
        <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:8px;">Global export demand for PGS-certified organic pulses, spices, and cereals hits all-time high with price premiums exceeding 30%.</div>
        <a href="https://apeda.gov.in/" target="_blank" rel="noopener noreferrer" style="font-size:0.85rem; font-weight:700; color:var(--primary); text-decoration:none;">Read APEDA Export Report ↗</a>
      </div>
      <div style="background:#fff; padding:var(--s4); border-radius:var(--r-md); box-shadow:var(--shadow-sm); border:1px solid var(--border-color);">
        <div style="font-weight:700; font-size:1rem; margin-bottom:4px; color:var(--text-primary)">Solar Cold Storage for Perishable Horticultural Crops</div>
        <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:8px;">ICAR-CIPHET publishes guidelines on decentralized 5MT solar micro-cold rooms cutting post-harvest vegetable wastage from 25% down to under 3%.</div>
        <a href="https://icar.org.in/" target="_blank" rel="noopener noreferrer" style="font-size:0.85rem; font-weight:700; color:var(--primary); text-decoration:none;">Read ICAR Research Report ↗</a>
      </div>
    </div>`;
  }

  // ════════════════════════════════════════════════════════
  // AI GEO-AGRONOMY LAND & SOIL ADVISOR TAB
  // ════════════════════════════════════════════════════════
  let advisorLandSize = '1 km² (247 Acres)';
  let advisorDomainFilter = 'all';

  function renderAdvisor() {
    const loc = profile.location || engine.weather?.location || 'Nashik, Maharashtra';
    const adv = window.FARM_DATA.getGeoAgronomyAdvisory(loc, advisorLandSize, advisorDomainFilter);

    const domainFilters = [
      { id:'all', label:'🌟 All Highest Profit' },
      { id:'plants', label:'🌿 Medicinal Plants' },
      { id:'bees', label:'🐝 Apiculture' },
      { id:'fish', label:'🐟 Aquaculture' },
      { id:'mushroom', label:'🍄 Mushrooms' },
      { id:'hydroponics', label:'💧 Hydroponics' },
      { id:'cattle', label:'🐄 Dairy' }
    ];

    return `
    <div class="tab-page-header">
      <div class="tab-page-title">🌍 AI Land & Soil Geo-Agronomy Advisor</div>
      <div class="tab-page-sub">GPS soil intelligence & max-profit agricultural blueprints for any land tract</div>
    </div>

    <!-- GEOGRAPHY & SOIL ANALYSIS CARD -->
    <div style="background:linear-gradient(135deg, var(--green-900), var(--green-700)); color:#fff; border-radius:var(--r-xl); padding:var(--s5); box-shadow:var(--shadow-lg); margin-bottom:var(--s5);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
        <div>
          <span style="background:rgba(255,255,255,0.2); color:#bbf7d0; font-size:0.75rem; font-weight:800; padding:3px 10px; border-radius:12px;">📍 GPS Regional Geo-Agronomy</span>
          <h2 style="font-size:1.35rem; font-weight:800; margin:6px 0 2px 0;">${adv.location}</h2>
          <div style="font-size:0.85rem; color:#dcfce7;">Climate Zone: <b>${adv.climateZone}</b></div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.75rem; color:#bbf7d0; font-weight:600;">Detected Soil Type</div>
          <div style="font-size:1.15rem; font-weight:800;">${adv.soilType}</div>
        </div>
      </div>

      <div style="font-size:0.86rem; color:#f0fdf4; line-height:1.45; background:rgba(0,0,0,0.2); padding:10px 14px; border-radius:var(--r-md); margin-bottom:14px;">
        🧪 <b>Soil Properties:</b> ${adv.soilDesc}
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">
        <div style="background:rgba(255,255,255,0.12); padding:8px 12px; border-radius:var(--r-md);">
          <div style="font-size:0.72rem; color:#bbf7d0;">Soil pH Range</div>
          <div style="font-size:0.95rem; font-weight:800;">${adv.phRange}</div>
        </div>
        <div style="background:rgba(255,255,255,0.12); padding:8px 12px; border-radius:var(--r-md);">
          <div style="font-size:0.72rem; color:#bbf7d0;">Organic Carbon</div>
          <div style="font-size:0.95rem; font-weight:800;">${adv.organicCarbon}</div>
        </div>
        <div style="background:rgba(255,255,255,0.12); padding:8px 12px; border-radius:var(--r-md);">
          <div style="font-size:0.72rem; color:#bbf7d0;">Annual Rainfall</div>
          <div style="font-size:0.95rem; font-weight:800;">${adv.annualRainfall}</div>
        </div>
        <div style="background:rgba(255,255,255,0.12); padding:8px 12px; border-radius:var(--r-md);">
          <div style="font-size:0.72rem; color:#bbf7d0;">Assessed Land Area</div>
          <div style="font-size:0.95rem; font-weight:800; color:#fef08a;">${adv.landDisplay}</div>
        </div>
      </div>
    </div>

    <!-- DOMAIN / BOTANICAL INTEREST FILTER -->
    <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; margin-bottom:var(--s4); -webkit-overflow-scrolling:touch;">
      ${domainFilters.map(df => `
        <button class="advisor-domain-pill ${advisorDomainFilter === df.id ? 'active' : ''}" data-domain="${df.id}" style="padding:6px 14px; border-radius:var(--r-full); border:1px solid ${advisorDomainFilter === df.id ? 'var(--primary)' : 'var(--border-color)'}; background:${advisorDomainFilter === df.id ? 'var(--primary)' : '#fff'}; color:${advisorDomainFilter === df.id ? '#fff' : 'var(--text-primary)'}; font-size:0.82rem; font-weight:700; cursor:pointer; white-space:nowrap; transition:all 0.2s;">
          ${df.label}
        </button>
      `).join('')}
    </div>

    <!-- LAND SIZE SELECTOR / CALCULATOR -->
    <div style="background:#fff; border-radius:var(--r-lg); padding:var(--s4); border:1px solid var(--border-color); box-shadow:var(--shadow-sm); margin-bottom:var(--s5);">
      <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary); margin-bottom:8px;">📐 Select or Enter Your Land Size to Recalculate Profits:</div>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
        ${['1 km² (247 Acres)', '100 Acres', '25 Acres', '10 Acres', '5 Acres', '2 Acres', '1 Acre'].map(sz => `
          <button class="advisor-size-btn ${advisorLandSize === sz ? 'active' : ''}" data-size="${sz}" style="padding:8px 14px; border-radius:var(--r-full); border:1.5px solid ${advisorLandSize === sz ? 'var(--primary)' : 'var(--border-color)'}; background:${advisorLandSize === sz ? 'var(--primary)' : '#fff'}; color:${advisorLandSize === sz ? '#fff' : 'var(--text-primary)'}; font-size:0.85rem; font-weight:700; cursor:pointer; transition:all 0.2s; box-shadow:${advisorLandSize === sz ? '0 2px 8px rgba(22,163,74,0.3)' : 'none'};">
            ${sz}
          </button>
        `).join('')}
      </div>
      <div style="display:flex; gap:8px; align-items:center;">
        <input type="text" id="custom-land-input" class="input-field" placeholder="Or type custom size (e.g. 1 sq km, 15 hectares, 8 acres)..." style="flex:1; margin:0; font-size:0.88rem; padding:10px 14px;" value="${advisorLandSize}"/>
        <button id="custom-land-btn" class="btn-primary" style="padding:10px 18px; font-size:0.88rem; border-radius:var(--r-md); white-space:nowrap;">⚡ Calculate</button>
      </div>
    </div>

    <!-- TOP RECOMMENDED FARMING MODELS RANKED BY PROFIT -->
    <div class="section-header">
      <div class="section-title">🏆 Top Max-Profit Farming Models for Your Soil</div>
      <span class="section-link" style="font-size:0.75rem; color:var(--text-secondary);">Scaled to ${adv.landDisplay}</span>
    </div>

    <div style="display:flex; flex-direction:column; gap:var(--s4); margin-bottom:var(--s5);">
      ${adv.recommendations.map((rec, idx) => `
        <div class="advisor-card" style="border-left: 5px solid ${idx===0 ? '#16a34a' : idx===1 ? '#0284c7' : '#d97706'};">
          <div class="advisor-badge-row">
            <div>
              <span style="background:${idx===0 ? 'var(--green-100)' : 'var(--slate-100)'}; color:${idx===0 ? 'var(--green-800)' : 'var(--text-primary)'}; font-size:0.75rem; font-weight:800; padding:3px 10px; border-radius:12px;">
                ${idx===0 ? '🌟 #1 Highest Profit Match' : `#${idx+1} Alternative Model`}
              </span>
              <span style="background:#e0f2fe; color:#0369a1; font-size:0.75rem; font-weight:700; padding:3px 8px; border-radius:12px; margin-left:6px;">
                ${rec.suitability.split('—')[0]}
              </span>
            </div>
            <div style="font-weight:900; color:var(--green-600); font-size:1.15rem;">
              ${rec.calculatedTotalProfitBadge}
            </div>
          </div>

          <h3 style="font-size:1.18rem; font-weight:800; color:var(--text-primary); margin:0 0 6px 0;">${rec.title}</h3>
          <div style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:10px; line-height:1.45;">
            🌱 <b>Recommended Varieties:</b> <span style="color:var(--text-primary); font-weight:700;">${rec.varieties}</span><br/>
            💡 <b>Agronomy Rationale:</b> ${rec.suitability.split('—')[1] || rec.suitability}
          </div>

          <div class="advisor-metric-grid">
            <div class="advisor-metric-box">
              <div class="advisor-metric-lbl">Total Annual Revenue (${rec.scaledLandDisplay})</div>
              <div class="advisor-metric-val" style="color:var(--primary); font-size:0.95rem;">${rec.totalEstimatedAnnualRevenue}</div>
            </div>
            <div class="advisor-metric-box">
              <div class="advisor-metric-lbl">Total Net Profit (${rec.scaledLandDisplay})</div>
              <div class="advisor-metric-val" style="color:#16a34a; font-size:0.95rem;">${rec.totalEstimatedAnnualProfit}</div>
            </div>
            <div class="advisor-metric-box">
              <div class="advisor-metric-lbl">Capital Investment</div>
              <div class="advisor-metric-val">${rec.investmentRequired}</div>
            </div>
            <div class="advisor-metric-box">
              <div class="advisor-metric-lbl">Payback Period</div>
              <div class="advisor-metric-val">${rec.paybackPeriod}</div>
            </div>
          </div>

          <div style="background:var(--slate-50); padding:10px 12px; border-radius:var(--r-md); font-size:0.82rem; color:var(--text-secondary); margin-bottom:14px; line-height:1.4;">
            🤝 <b>Verified Buyers & Buyback:</b> <span style="color:var(--text-primary); font-weight:600;">${rec.marketBuyers}</span><br/>
            💧 <b>Water Needs:</b> ${rec.waterRequirement}
          </div>

          <div style="display:flex; gap:8px;">
            <button class="btn-primary full-width adopt-model-btn" data-domain="${rec.domain}" data-varieties="${rec.varieties}" style="padding:10px 16px; font-size:0.88rem;">
              ⚡ Adopt This Farming Plan (Personalize Dashboard)
            </button>
          </div>
        </div>
      `).join('')}
    </div>
    `;
  }

  // ════════════════════════════════════════════════════════
  // ANALYTICS TAB
  // ════════════════════════════════════════════════════════
  function renderAnalytics() {
    const est = engine.getProfitEstimate();
    const fmt = n => '₹'+Math.round(n).toLocaleString('en-IN');
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
    </div>`;
  }

  // ════════════════════════════════════════════════════════
  // SMS / OFFLINE
  // ════════════════════════════════════════════════════════
  function renderSMS() {
    const tasks = engine.getTasks().slice(0,3);
    const w = engine.weather;
    return `
    <div class="tab-page-header"><div class="tab-page-title">📱 SMS / Offline Mode</div><div class="tab-page-sub">Low-internet access and 24x7 voice helpline</div></div>
    <div class="sms-preview">
      <div class="sms-header">SMS from KisanMitra | Shortcode 51969 | ${new Date().toLocaleDateString('en-IN')}</div>
      <div class="sms-line"><span class="sms-highlight">🌤 Weather:</span> ${w.current.temp}, ${w.current.condition}</div>
      <div class="sms-line" style="margin-top:8px"><span class="sms-highlight">✅ Tasks:</span></div>
      ${tasks.map((t,i)=>`<div class="sms-line">${i+1}. ${t.text}</div>`).join('')}
      <div class="sms-line" style="margin-top:8px"><span class="sms-highlight">⚠ Alert:</span> ${engine.getAllAlerts()[0]?.title||'No critical alerts'}</div>
      <div class="sms-line" style="margin-top:8px;color:#64748b;font-size:.75rem">Reply HELP for more. Free service — 1800-180-1551 Kisan Helpline.</div>
    </div>
    <div class="section-header"><div class="section-title">📞 24x7 Free Agriculture Helplines</div></div>
    <div class="alert-cards">
      <div class="alert-card info">
        <div class="alert-icon">📞</div>
        <div class="alert-content">
          <div class="alert-title">Kisan Call Centre — 1800-180-1551</div>
          <div class="alert-desc">Free advisory in 22 regional languages. Open 365 days from 6:00 AM to 10:00 PM.</div>
          <div style="margin-top:8px;"><a href="tel:18001801551" class="btn-primary" style="text-decoration:none; display:inline-flex; padding:6px 14px; border-radius:var(--r-full); font-size:0.85rem;">📞 Call 1800-180-1551 Free</a></div>
        </div>
      </div>
    </div>`;
  }

  // ════════════════════════════════════════════════════════
  // SETTINGS
  // ════════════════════════════════════════════════════════
  function renderSettings() {
    const t = window.I18N ? window.I18N.t : (k=>k);
    const languages = window.I18N ? window.I18N.getAvailableLanguages() : [];
    const curLang = window.I18N ? window.I18N.getLang() : 'en';

    return `
    <div class="tab-page-header"><div class="tab-page-title">${t('settingsTitle')}</div></div>
    
    <!-- LANGUAGE SELECTOR IN SETTINGS -->
    <div class="settings-group">
      <div class="settings-group-title">🌐 ${t('languageSetting')}</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; padding: 4px;">
        ${languages.map(l => `
          <button class="settings-lang-btn ${curLang===l.code?'active':''}" data-lang="${l.code}" style="padding:10px 12px; border-radius:var(--r-md); border:1px solid ${curLang===l.code?'var(--primary)':'var(--border-color)'}; background:${curLang===l.code?'var(--primary)':'#fff'}; color:${curLang===l.code?'#fff':'var(--text-primary)'}; font-weight:700; font-size:0.88rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:all 0.2s;">
            <span>${l.flag}</span> <span>${l.nativeName}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">${t('activeProfile')}</div>
      <div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon">👤</span><div><div class="settings-item-text">${profile.name||'Farmer'}</div><div class="settings-item-sub">${engine.getPersonaLabel()}</div></div></div></div>
      <div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon">📍</span><div><div class="settings-item-text">Location</div><div class="settings-item-sub">${profile.location||'Not set'}</div></div></div></div>
      <div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon">🌾</span><div><div class="settings-item-text">Farm Types</div><div class="settings-item-sub">${profile.farmTypes.map(t=>window.FARM_DATA.FARM_TYPES[t]?.label).join(', ')}</div></div></div></div>
      <div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon">📐</span><div><div class="settings-item-text">${t('landSize')}</div><div class="settings-item-sub">${profile.landSize||'2'} ${t('acres')}</div></div></div></div>
    </div>
    <div class="settings-group">
      <div class="settings-group-title">Account Actions</div>
      <div class="settings-item" id="reset-btn-settings" style="cursor:pointer;"><div class="settings-item-left"><span class="settings-item-icon">🔄</span><div class="settings-item-text" style="color:var(--red-500); font-weight:700;">${t('reconfigureProfile')}</div></div></div>
    </div>
    <div style="text-align:center;margin-top:var(--s6);color:var(--text-muted);font-size:.75rem">KisanMitra v2.0 • Real-Time Multilingual Smart Agriculture Platform</div>`;
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
        btn.textContent = open ? '📋 View Step-by-Step Actions' : '▲ Hide';
      })
    );
    // Quick nav links in home
    document.querySelectorAll('[data-nav]').forEach(el =>
      el.addEventListener('click', () => renderTab(el.dataset.nav))
    );
    // Settings reset
    document.getElementById('reset-btn-settings')?.addEventListener('click', () => {
      if (confirm('Reconfigure your farm profile and choose new domains?')) { localStorage.clear(); window.location.reload(); }
    });

    // Settings language switcher
    if (tab === 'settings') {
      document.querySelectorAll('.settings-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const lang = btn.dataset.lang;
          if (window.I18N) {
            window.I18N.setLang(lang);
            updateNavLabels();
            renderSidebarMeta();
            renderTab('settings');
          }
        });
      });
    }

    // Learn category buttons & Live YouTube search
    if (tab === 'learn') {
      document.querySelectorAll('.learn-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          learnCategory = btn.dataset.cat;
          renderTab('learn');
        });
      });
      document.querySelectorAll('.video-thumb-play').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const vid = btn.dataset.vid;
          const title = btn.dataset.title;
          openVideoModal(vid, title);
        });
      });

      // Live YouTube Search Feature using YouTube API key
      const searchInput = document.getElementById('yt-search-input');
      const searchBtn = document.getElementById('yt-search-btn');
      const handleYtSearch = async () => {
        const query = (searchInput?.value || '').trim();
        if (!query) return;
        const container = document.getElementById('yt-videos-container');
        if (container) {
          container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:30px; font-weight:700; color:var(--primary);">⏳ Searching top YouTube masterclasses for "' + query + '"...</div>';
        }
        try {
          const ytKey = window.ENV_CONFIG?.YOUTUBE_API_KEY || (typeof atob !== 'undefined' ? atob('QUl6YVN5RFpGXzZiUXU3NTlpNkp0ZmtnQUVRd0ZlMHFvYWQ2UWcw') : '');
          const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' farming tutorial')}&type=video&order=viewCount&maxResults=10&key=${ytKey}`;
          const res = await fetch(apiUrl);
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            container.innerHTML = data.items.map(item => `
              <div class="video-card" style="background:#fff; border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--shadow-md); border:1px solid var(--border-color); display:flex; flex-direction:column; justify-content:space-between;">
                <div style="position:relative; height:180px; background:#000; overflow:hidden; cursor:pointer;" class="video-thumb-play" data-vid="${item.id.videoId}" data-title="${item.snippet.title.replace(/"/g, '&quot;')}">
                  <img src="${item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url}" alt="${item.snippet.title}" style="width:100%; height:100%; object-fit:cover; opacity:0.9;"/>
                  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:48px; height:48px; background:rgba(220,38,38,0.95); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.3rem; box-shadow:0 4px 12px rgba(0,0,0,0.5);">▶</div>
                  <div style="position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,0.85); color:#fff; font-size:0.75rem; padding:2px 8px; border-radius:4px; font-weight:bold;">HD</div>
                </div>
                <div style="padding:var(--s4); flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                      <span style="background:var(--green-100); color:var(--green-700); font-size:0.72rem; padding:3px 8px; border-radius:12px; font-weight:700;">Top Video</span>
                      <span style="font-size:0.75rem; color:var(--text-secondary); font-weight:500;">YouTube</span>
                    </div>
                    <div style="font-weight:700; font-size:0.98rem; color:var(--text-primary); margin-bottom:6px; line-height:1.35;">${item.snippet.title}</div>
                    <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">📺 ${item.snippet.channelTitle}</div>
                  </div>
                  <div style="display:flex; gap:8px;">
                    <button class="btn-primary full-width video-thumb-play" data-vid="${item.id.videoId}" data-title="${item.snippet.title.replace(/"/g, '&quot;')}" style="padding:8px 12px; font-size:0.85rem;">
                      ▶ Play In App
                    </button>
                    <a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank" rel="noopener noreferrer" class="btn-outline" style="text-decoration:none; padding:8px 12px; font-size:0.85rem; display:inline-flex; align-items:center; justify-content:center;" title="Open directly on YouTube">
                      ↗
                    </a>
                  </div>
                </div>
              </div>
            `).join('');

            container.querySelectorAll('.video-thumb-play').forEach(btn => {
              btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openVideoModal(btn.dataset.vid, btn.dataset.title);
              });
            });
          } else {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:30px; color:var(--text-secondary);">No YouTube videos found for that search. Try another topic!</div>';
          }
        } catch(err) {
          console.error('YouTube search error:', err);
        }
      };

      searchBtn?.addEventListener('click', handleYtSearch);
      searchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleYtSearch();
      });
    }

    // Knowledge domain buttons & offline accordion toggle
    if (tab === 'knowledge') {
      document.querySelectorAll('.knowledge-domain-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          knowledgeDomain = btn.dataset.domain;
          expandedModuleIndex = null;
          renderTab('knowledge');
        });
      });
      document.querySelectorAll('.toggle-module-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.midx, 10);
          expandedModuleIndex = expandedModuleIndex === idx ? null : idx;
          renderTab('knowledge');
        });
      });
    }

    // Advisor land size, domain filtering, and model adoption
    if (tab === 'advisor') {
      document.querySelectorAll('.advisor-domain-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          advisorDomainFilter = btn.dataset.domain;
          renderTab('advisor');
        });
      });

      document.querySelectorAll('.advisor-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          advisorLandSize = btn.dataset.size;
          renderTab('advisor');
        });
      });

      const landInp = document.getElementById('custom-land-input');
      const landBtn = document.getElementById('custom-land-btn');
      const handleCustomLand = () => {
        const val = (landInp?.value || '').trim();
        if (val) {
          advisorLandSize = val;
          renderTab('advisor');
        }
      };
      landBtn?.addEventListener('click', handleCustomLand);
      landInp?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleCustomLand();
      });

      document.querySelectorAll('.adopt-model-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const dom = btn.dataset.domain;
          const vars = btn.dataset.varieties;
          profile.farmTypes = [dom];
          profile.specificItems = vars;
          localStorage.setItem('km_profile', JSON.stringify(profile));
          engine.profile = profile;
          renderSidebarMeta();
          alert(`✅ Successfully adopted ${dom.toUpperCase()} model (${vars})! Your dashboard, tasks, alerts, and market linkages are now 100% personalized.`);
          renderTab('dashboard');
        });
      });
    }

    // Weather GPS refresh & Leaflet Interactive India Map
    if (tab === 'weather') {
      initWeatherMap();
      document.getElementById('gps-weather-refresh-btn')?.addEventListener('click', () => {
        const btn = document.getElementById('gps-weather-refresh-btn');
        btn.textContent = '⏳ Querying Satellites...';
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              try {
                await engine.initWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                profile.location = engine.weather.location;
                localStorage.setItem('km_profile', JSON.stringify(profile));
                renderSidebarMeta();
                renderTab('weather');
              } catch(e) {
                alert('Could not update weather for GPS coordinates: ' + e.message);
                renderTab('weather');
              }
            },
            (err) => {
              alert('GPS Permission Denied or Unavailable: ' + err.message);
              renderTab('weather');
            }
          );
        } else {
          alert('Geolocation not supported by your browser.');
          renderTab('weather');
        }
      });
    }
  }

  // ════════════════════════════════════════════════════════
  // INTERACTIVE LEAFLET WEATHER MAP OF INDIA
  // ════════════════════════════════════════════════════════
  let weatherMapInstance = null;
  function initWeatherMap() {
    if (!window.L) return;
    const container = document.getElementById('weather-map-container');
    if (!container) return;

    if (weatherMapInstance) {
      weatherMapInstance.remove();
      weatherMapInstance = null;
    }

    const defaultLat = 22.5937;
    const defaultLon = 78.9629;
    weatherMapInstance = L.map('weather-map-container').setView([defaultLat, defaultLon], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(weatherMapInstance);

    // 15 Major agricultural regional hubs across all regions of India
    const agriHubs = [
      { name: 'Nashik (Grapes, Onions & Wine)', lat: 19.9975, lon: 73.7898 },
      { name: 'Ludhiana (Wheat & Rice Granary)', lat: 30.9010, lon: 75.8573 },
      { name: 'Karnal (ICAR-NDRI Dairy Hub)', lat: 29.6857, lon: 76.9905 },
      { name: 'Anand (Amul Cooperative Hub)', lat: 22.5645, lon: 72.9289 },
      { name: 'Guntur (Asia Largest Chilli Mandi)', lat: 16.3067, lon: 80.4365 },
      { name: 'Coimbatore (Poultry & Cotton)', lat: 11.0168, lon: 76.9558 },
      { name: 'Nadia (Fishery & Jute Basin)', lat: 23.4710, lon: 88.5565 },
      { name: 'Shimla (Apple Orchards & Honey)', lat: 31.1048, lon: 77.1734 },
      { name: 'Nagpur (Citrus & Orange Belt)', lat: 21.1458, lon: 79.0882 },
      { name: 'Varanasi (Vegetables & Gangetic Silt)', lat: 25.3176, lon: 82.9739 },
      { name: 'Bhopal (Soybean & Pulses Heart)', lat: 23.2599, lon: 77.4126 },
      { name: 'Jaipur (Mustard & Arid MAPs)', lat: 26.9124, lon: 75.7873 },
      { name: 'Guwahati (Tea & Organic Spices)', lat: 26.1445, lon: 91.7362 },
      { name: 'Bengaluru (Hydroponics & Silk)', lat: 12.9716, lon: 77.5946 },
      { name: 'Patna (Makhana & Alluvial Veg)', lat: 25.5941, lon: 85.1376 },
      { name: 'Hyderabad (Poultry & Hybrid Seeds)', lat: 17.3850, lon: 78.4867 }
    ];

    agriHubs.forEach(hub => {
      const marker = L.marker([hub.lat, hub.lon]).addTo(weatherMapInstance);
      marker.bindPopup(`
        <div style="font-family:sans-serif; text-align:center;">
          <b style="color:#15803d;">🌾 ${hub.name}</b><br/>
          <span style="font-size:0.75rem; color:#64748b;">Agri Hub</span><br/>
          <button onclick="window.Dashboard.selectMapLocation(${hub.lat}, ${hub.lon}, '${hub.name}')" style="margin-top:8px; background:#16a34a; color:#fff; border:none; padding:6px 12px; border-radius:6px; font-size:0.8rem; font-weight:700; cursor:pointer;">
            📍 Get Live Weather
          </button>
        </div>
      `);
    });

    // Click anywhere across India to drop pin and get live satellite weather
    weatherMapInstance.on('click', (e) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`
          <div style="font-family:sans-serif; text-align:center;">
            <b>📍 Dropped Farm Pin</b><br/>
            <span style="font-size:0.75rem; color:#64748b;">Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}</span><br/>
            <button onclick="window.Dashboard.selectMapLocation(${lat}, ${lon}, 'Pinned Location (${lat.toFixed(2)}, ${lon.toFixed(2)})')" style="margin-top:8px; background:#16a34a; color:#fff; border:none; padding:6px 12px; border-radius:6px; font-size:0.8rem; font-weight:700; cursor:pointer;">
              ⚡ Get Satellite Weather
            </button>
          </div>
        `)
        .openOn(weatherMapInstance);
    });

    setTimeout(() => {
      if (weatherMapInstance) weatherMapInstance.invalidateSize();
    }, 300);
  }

  async function selectMapLocation(lat, lon, name) {
    try {
      await engine.initWeather({ lat, lon });
      profile.location = name || engine.weather.location;
      localStorage.setItem('km_profile', JSON.stringify(profile));
      renderSidebarMeta();
      renderTab('weather');
    } catch(err) {
      alert('Could not fetch satellite weather: ' + err.message);
    }
  }

  function openVideoModal(videoId, title) {
    let modal = document.getElementById('video-modal-overlay');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'video-modal-overlay';
      modal.className = 'voice-overlay';
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div class="voice-modal" style="max-width:700px; width:95%; padding:16px; text-align:left;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="font-size:1.1rem; font-weight:700; margin:0; color:var(--text-primary); line-height:1.3;">${title}</h3>
          <button id="close-video-modal" style="background:none; border:none; font-size:1.4rem; cursor:pointer; color:var(--text-secondary);">&times;</button>
        </div>
        <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:12px; background:#000;">
          <iframe 
            src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1" 
            title="${title}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen 
            style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;">
          </iframe>
        </div>
        <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.8rem; color:var(--text-secondary);">Powered by YouTube & Agricultural Extension Services</span>
          <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer" class="btn-outline" style="font-size:0.82rem; padding:6px 12px; text-decoration:none;">Watch on YouTube ↗</a>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
    document.getElementById('close-video-modal')?.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.innerHTML = '';
    });
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'video-modal-overlay') {
        modal.classList.add('hidden');
        modal.innerHTML = '';
      }
    });
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

  return { init, renderTab, selectMapLocation };
})();

window.Dashboard = Dashboard;
