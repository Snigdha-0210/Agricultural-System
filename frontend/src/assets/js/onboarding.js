// ============================================================
// KisanMitra v2 — Onboarding Flow (5 steps)
// ============================================================
const OnboardingFlow = (() => {
  const steps = ['persona','farmtype','location','experience','summary'];
  let currentStep = 0;
  let draft = {};

  function init() {
    draft = {};
    currentStep = 0;
    renderStep();
  }

  function renderStep() {
    const t = window.I18N ? window.I18N.t : (k=>k);
    const pct = ((currentStep+1)/steps.length)*100;
    document.getElementById('progress-fill').style.width = pct+'%';
    document.getElementById('progress-text').textContent = `${t('step')} ${currentStep+1} ${t('of')} ${steps.length}`;
    const container = document.getElementById('onboarding-steps');
    container.innerHTML = '';
    const div = document.createElement('div');
    div.className = 'onboarding-step';
    switch(steps[currentStep]) {
      case 'persona':    div.innerHTML = renderPersonaStep();    break;
      case 'farmtype':   div.innerHTML = renderFarmTypeStep();   break;
      case 'location':   div.innerHTML = renderLocationStep();   break;
      case 'experience': div.innerHTML = renderExperienceStep(); break;
      case 'summary':    div.innerHTML = renderSummaryStep();    break;
    }
    container.appendChild(div);
    bindStepEvents(steps[currentStep]);
  }

  function renderPersonaStep() {
    const t = window.I18N ? window.I18N.t : (k=>k);
    const personaData = [
      { id:'generational', label: t('personaGen'), desc: t('personaGenDesc'), emoji:'👴', color:'#16a34a', tag: 'Traditional' },
      { id:'wealthy',      label: t('personaWealthy'), desc: t('personaWealthyDesc'), emoji:'🧑‍💼', color:'#0284c7', tag: 'Commercial' },
      { id:'new-entrant',  label: t('personaNew'), desc: t('personaNewDesc'), emoji:'🎓', color:'#d97706', tag: 'Learner' },
      { id:'agripreneur',  label: t('personaAgri'), desc: t('personaAgriDesc'), emoji:'🚀', color:'#7c3aed', tag: 'AgTech' }
    ];

    return `
      <div class="step-header">
        <div class="step-emoji">👤</div>
        <h2 class="step-title">${t('whoAreYou')}</h2>
        <p class="step-subtitle">${t('whoAreYouSub')}</p>
      </div>
      <div class="persona-cards">
        ${personaData.map(p=>`
        <div class="persona-card ${p.id}" data-persona="${p.id}" style="border-color:${draft.persona===p.id?p.color:'transparent'}">
          <span class="persona-icon">${p.emoji}</span>
          <div class="persona-info">
            <div class="persona-title">${p.label}</div>
            <div class="persona-desc">${p.desc}</div>
            <span class="persona-tag" style="background:${p.color}20;color:${p.color}">${p.tag}</span>
          </div>
          <div class="persona-check">${draft.persona===p.id?'✓':''}</div>
        </div>`).join('')}
      </div>
      <div class="step-nav">
        <button class="btn-primary btn-next full-width" id="step-next">${t('continue')}</button>
      </div>
    `;
  }

  function renderFarmTypeStep() {
    const t = window.I18N ? window.I18N.t : (k=>k);
    return `
      <div class="step-header">
        <div class="step-emoji">🌾</div>
        <h2 class="step-title">${t('whatDoYouFarm')}</h2>
        <p class="step-subtitle">${t('whatDoYouFarmSub')}</p>
      </div>
      <div class="farm-type-scroll-select">
        ${Object.values(window.FARM_DATA.FARM_TYPES).map(ft=>`
        <div class="ftype-chip ${draft.farmTypes?.includes(ft.id)?'selected':''}" data-ft="${ft.id}">
          <span class="chip-icon">${ft.emoji}</span>
          <span>${ft.label}</span>
        </div>`).join('')}
        <div class="ftype-chip ${draft.farmTypes?.includes('custom')?'selected':''}" data-ft="custom">
          <span class="chip-icon">✨</span>
          <span>Other (Custom)</span>
        </div>
      </div>
      
      <div style="margin-bottom:var(--s4)">
        <label class="input-label">${t('specificItemsLabel')}</label>
        <input type="text" class="input-field" id="specific-items-input" placeholder="${t('specificItemsPlaceholder')}" value="${draft.specificItems||''}"/>
      </div>
      
      <div style="margin-bottom:var(--s4)">
        <label class="input-label">${t('farmingMethod')}</label>
        <div class="farm-type-scroll-select">
          <div class="ftype-chip ${draft.farmingMethod==='traditional'?'selected':''}" data-method="traditional">${t('methodTraditional')}</div>
          <div class="ftype-chip ${draft.farmingMethod==='organic'?'selected':''}" data-method="organic">${t('methodOrganic')}</div>
          <div class="ftype-chip ${draft.farmingMethod==='hydroponics'?'selected':''}" data-method="hydroponics">${t('methodHydroponics')}</div>
          <div class="ftype-chip ${draft.farmingMethod==='sustainable'?'selected':''}" data-method="sustainable">${t('methodSustainable')}</div>
        </div>
      </div>

      <div style="margin-bottom:var(--s4)">
        <label class="input-label">${t('landSize')}</label>
        <label class="slider-label" id="land-size-label">${draft.landSize||2} ${t('acres')}</label>
        <input type="range" class="range-slider" id="land-slider" min="0.5" max="100" step="0.5" value="${draft.landSize||2}"/>
        <div class="slider-labels"><span>0.5 ${t('acres')}</span><span>100 ${t('acres')}</span></div>
      </div>
      <div class="step-nav">
        <button class="btn-back" id="step-back">${t('back')}</button>
        <button class="btn-primary btn-next" id="step-next">${t('continue')}</button>
      </div>
    `;
  }

  function renderLocationStep() {
    const t = window.I18N ? window.I18N.t : (k=>k);
    return `
      <div class="step-header">
        <div class="step-emoji">📍</div>
        <h2 class="step-title">${t('whereIsFarm')}</h2>
        <p class="step-subtitle">${t('whereIsFarmSub')}</p>
      </div>
      <div style="margin-bottom:var(--s4)">
        <button id="gps-btn" class="btn-outline full-width" style="margin-bottom:12px; font-weight:700; background:#fff; padding:12px; border-radius:var(--r-full); color:var(--primary); font-size:0.95rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:var(--shadow-sm);">
          ${t('useGPS')}
        </button>
        <label class="input-label">${t('orSelectCity')}</label>
        <div class="location-input-wrap" style="position:relative;">
          <span class="location-icon">📍</span>
          <input type="text" class="input-field" id="location-input" placeholder="e.g. Nashik, Maharashtra" autocomplete="off" value="${draft.location||''}"/>
        </div>
        <div class="location-suggestions hidden" id="location-suggestions"></div>
      </div>
      <div style="margin-bottom:var(--s5)">
        <label class="input-label">Full Name (Optional)</label>
        <input type="text" class="input-field" id="name-input" placeholder="Your name" value="${draft.name||''}"/>
      </div>
      <div class="step-nav">
        <button class="btn-back" id="step-back">${t('back')}</button>
        <button class="btn-primary btn-next" id="step-next">${t('continue')}</button>
      </div>
    `;
  }

  function renderExperienceStep() {
    const t = window.I18N ? window.I18N.t : (k=>k);
    const expData = [
      { id:'beginner', label: t('expBeginner'), desc: t('expBeginnerDesc') },
      { id:'intermediate', label: t('expIntermediate'), desc: t('expIntermediateDesc') },
      { id:'expert', label: t('expExpert'), desc: t('expExpertDesc') }
    ];
    const budgetData = [
      { id:'low', label: t('budgetLow'), desc: 'Cost-effective solutions & organic homemade fertilizers' },
      { id:'medium', label: t('budgetMed'), desc: 'Balanced inputs, hybrid seeds, and basic mechanization' },
      { id:'high', label: t('budgetHigh'), desc: 'Drip automation, solar pump, premium crop contracts' }
    ];

    return `
      <div class="step-header">
        <div class="step-emoji">💡</div>
        <h2 class="step-title">${t('experienceLevel')}</h2>
        <p class="step-subtitle">${t('experienceSub')}</p>
      </div>
      <label class="input-label">Farming Experience</label>
      <div class="exp-cards" style="margin-bottom:var(--s5)">
        ${expData.map(e=>`
        <div class="exp-card ${draft.experience===e.id?'selected':''}" data-exp="${e.id}">
          <div class="exp-card-info">
            <div class="exp-card-title">${e.label}</div>
            <div class="exp-card-desc">${e.desc}</div>
          </div>
          <span class="exp-card-check">✓</span>
        </div>`).join('')}
      </div>
      <label class="input-label">${t('budgetLabel')}</label>
      <div class="exp-cards">
        ${budgetData.map(b=>`
        <div class="exp-card ${draft.budget===b.id?'selected':''}" data-budget="${b.id}">
          <div class="exp-card-info">
            <div class="exp-card-title">${b.label}</div>
            <div class="exp-card-desc">${b.desc}</div>
          </div>
          <span class="exp-card-check">✓</span>
        </div>`).join('')}
      </div>
      <div class="step-nav">
        <button class="btn-back" id="step-back">${t('back')}</button>
        <button class="btn-primary btn-next" id="step-next">${t('continue')}</button>
      </div>
    `;
  }

  function renderSummaryStep() {
    const t = window.I18N ? window.I18N.t : (k=>k);
    const personaObj = window.FARM_DATA.PERSONAS.find(p=>p.id===draft.persona)||{};
    const ftLabels = (draft.farmTypes||[]).map(t=>window.FARM_DATA.FARM_TYPES[t]?.emoji+' '+window.FARM_DATA.FARM_TYPES[t]?.label).join(', ');
    return `
      <div class="step-header">
        <div class="step-emoji">✅</div>
        <h2 class="step-title">${t('profileReady')}</h2>
        <p class="step-subtitle">${t('profileReadySub')}</p>
      </div>
      <div class="summary-card">
        <div class="summary-row"><span class="summary-key">👤 Profile</span><span class="summary-val">${personaObj.label||'—'}</span></div>
        <div class="summary-row"><span class="summary-key">🌾 Farming</span><span class="summary-val">${ftLabels||'—'}</span></div>
        <div class="summary-row"><span class="summary-key">📍 Location</span><span class="summary-val">${draft.location||'Not set'}</span></div>
        <div class="summary-row"><span class="summary-key">📐 Land</span><span class="summary-val">${draft.landSize||'2'} ${t('acres')}</span></div>
        <div class="summary-row"><span class="summary-key">💡 Experience</span><span class="summary-val">${draft.experience||'beginner'}</span></div>
        <div class="summary-row"><span class="summary-key">💰 Budget</span><span class="summary-val">${draft.budget||'low'}</span></div>
      </div>
      <div class="step-nav">
        <button class="btn-back" id="step-back">${t('back')}</button>
        <button class="btn-primary btn-next" id="step-next">${t('startFarming')}</button>
      </div>
    `;
  }

  function bindStepEvents(step) {
    // Persona
    if (step === 'persona') {
      document.querySelectorAll('.persona-card').forEach(c =>
        c.addEventListener('click', () => { draft.persona = c.dataset.persona; renderStep(); })
      );
    }
    // Farm types
    if (step === 'farmtype') {
      document.querySelectorAll('.ftype-chip[data-ft]').forEach(c =>
        c.addEventListener('click', () => {
          draft.farmTypes = draft.farmTypes || [];
          const t = c.dataset.ft;
          draft.farmTypes = draft.farmTypes.includes(t) ? draft.farmTypes.filter(f=>f!==t) : [...draft.farmTypes, t];
          renderStep();
        })
      );
      document.querySelectorAll('.ftype-chip[data-method]').forEach(c =>
        c.addEventListener('click', () => { draft.farmingMethod = c.dataset.method; renderStep(); })
      );
      const specInp = document.getElementById('specific-items-input');
      if (specInp) { specInp.addEventListener('blur', () => { draft.specificItems = specInp.value; }); }
      const slider = document.getElementById('land-slider');
      if (slider) { slider.addEventListener('input', () => { draft.landSize = slider.value; document.getElementById('land-size-label').textContent = slider.value+' acres'; }); }
    }
    // Location
    if (step === 'location') {
      const inp = document.getElementById('location-input');
      if (inp) inp.addEventListener('input', () => {
        const v = inp.value.toLowerCase();
        const sugg = document.getElementById('location-suggestions');
        if (v.length < 2) { sugg.classList.add('hidden'); return; }
        const matches = window.FARM_DATA.INDIAN_LOCATIONS.filter(l => l.toLowerCase().includes(v)).slice(0,5);
        if (!matches.length) { sugg.classList.add('hidden'); return; }
        sugg.classList.remove('hidden');
        sugg.innerHTML = matches.map(m=>`<div class="location-suggestion-item">📍 ${m}</div>`).join('');
        sugg.querySelectorAll('.location-suggestion-item').forEach(item =>
          item.addEventListener('click', () => { inp.value = item.textContent.replace('📍 ','').trim(); draft.location = inp.value; sugg.classList.add('hidden'); })
        );
      });
      document.getElementById('gps-btn')?.addEventListener('click', () => {
        const inp = document.getElementById('location-input');
        inp.value = "Detecting GPS...";
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
               try {
                 const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
                 const data = await res.json();
                 const city = data.address.city || data.address.county || data.address.village || "Unknown";
                 const state = data.address.state || "";
                 inp.value = city + (state ? ", " + state : "");
                 draft.location = inp.value;
               } catch(e) {
                 inp.value = pos.coords.latitude.toFixed(2) + ", " + pos.coords.longitude.toFixed(2);
                 draft.location = inp.value;
               }
            },
            () => { inp.value = "GPS Denied/Failed"; }
          );
        } else {
          inp.value = "GPS Not Supported";
        }
      });
    }
    // Experience/budget cards
    if (step === 'experience') {
      document.querySelectorAll('.exp-card[data-exp]').forEach(c =>
        c.addEventListener('click', () => { draft.experience = c.dataset.exp; renderStep(); })
      );
      document.querySelectorAll('.exp-card[data-budget]').forEach(c =>
        c.addEventListener('click', () => { draft.budget = c.dataset.budget; renderStep(); })
      );
    }
    // Navigation
    document.getElementById('step-next')?.addEventListener('click', () => {
      // Collect form data before advancing
      if (step === 'location') {
        draft.location = document.getElementById('location-input')?.value || draft.location;
        draft.name     = document.getElementById('name-input')?.value     || draft.name;
      }
      if (step === 'summary') { finish(); return; }
      currentStep++;
      renderStep();
    });
    document.getElementById('step-back')?.addEventListener('click', () => {
      if (currentStep > 0) { currentStep--; renderStep(); }
    });
  }

  function finish() {
    const profile = {
      persona:       draft.persona       || 'generational',
      farmTypes:     draft.farmTypes     || ['crop'],
      specificItems: draft.specificItems || '',
      farmingMethod: draft.farmingMethod || 'traditional',
      landSize:      draft.landSize      || '2',
      location:      draft.location      || 'Nashik, Maharashtra',
      name:          draft.name          || 'Farmer',
      experience:    draft.experience    || 'beginner',
      budget:        draft.budget        || 'low',
    };
    
    const phone = localStorage.getItem('km_currentUserPhone') || 'guest';
    localStorage.setItem('km_profile_' + phone, JSON.stringify(profile));
    localStorage.setItem('km_profile', JSON.stringify(profile));
    
    window.AppController.onboardingComplete(profile);
  }

  return { init };
})();
window.OnboardingFlow = OnboardingFlow;
