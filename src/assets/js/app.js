// ============================================================
// KisanMitra v2 — Main App Controller
// ============================================================
const AppController = (() => {
  let engine = null;
  let profile = null;

  function init() {
    setTimeout(() => {
      hideSplash();
      checkExistingProfile();
    }, 1200);
  }

  function hideSplash() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.style.opacity = '0';
      splash.style.transition = 'opacity .5s ease';
      setTimeout(() => splash.classList.add('hidden'), 500);
    }
  }

  function checkExistingProfile() {
    try {
      const saved = localStorage.getItem('km_profile');
      if (saved) {
        profile = JSON.parse(saved);
        if (profile && profile.farmTypes && profile.farmTypes.length) {
          showScreen('dashboard-screen');
          initDashboard(profile);
          return;
        }
      }
    } catch(e) {}

    showScreen('language-screen');
    setupLanguageScreen();
  }

  function setupLanguageScreen() {
    // Highlight currently selected language
    const currentLang = window.I18N ? window.I18N.getLang() : 'en';
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === currentLang);
    });

    document.querySelectorAll('.lang-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lang = btn.dataset.lang;
        if (window.I18N) {
          window.I18N.setLang(lang);
          const t = window.I18N.t;
          const titleEl = document.getElementById('choose-lang-title');
          const subEl = document.getElementById('choose-lang-subtitle');
          const btnEl = document.getElementById('confirm-lang');
          if (titleEl) titleEl.textContent = t('chooseLang');
          if (subEl) subEl.textContent = t('chooseLangSub');
          if (btnEl) btnEl.textContent = t('continue');
        }
      })
    );
    document.getElementById('confirm-lang')?.addEventListener('click', () => {
      showScreen('onboarding-screen');
      window.OnboardingFlow.init();
    });
  }

  function onboardingComplete(userProfile) {
    profile = userProfile;
    showScreen('dashboard-screen');
    initDashboard(profile);
  }

  async function initDashboard(userProfile) {
    engine = new window.FarmingEngine(userProfile);
    window.Dashboard.init(engine, userProfile);
    await engine.initWeather();
    window.Dashboard.renderTab('dashboard'); // Re-render after weather loads
    window.VoiceModule.init(engine);
    setupGlobalControls();
  }

  function setupGlobalControls() {
    // Sidebar
    document.getElementById('menu-btn')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.add('open');
      document.getElementById('sidebar-overlay').classList.remove('hidden');
    });
    document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebar-overlay').classList.add('hidden');
    });
    document.getElementById('close-sidebar')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebar-overlay').classList.add('hidden');
    });

    // Alert panel
    document.getElementById('alert-btn')?.addEventListener('click', () => {
      renderAlertPanel();
      document.getElementById('alert-panel').classList.toggle('hidden');
    });
    document.getElementById('close-alert-panel')?.addEventListener('click', () =>
      document.getElementById('alert-panel').classList.add('hidden')
    );

    // One-tap
    document.getElementById('one-tap-btn')?.addEventListener('click', () => {
      renderOneTap();
      document.getElementById('one-tap-overlay').classList.remove('hidden');
    });
    document.getElementById('one-tap-close')?.addEventListener('click', () =>
      document.getElementById('one-tap-overlay').classList.add('hidden')
    );
    document.getElementById('one-tap-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'one-tap-overlay') document.getElementById('one-tap-overlay').classList.add('hidden');
    });

    // Scheme Modal
    document.getElementById('scheme-close')?.addEventListener('click', () =>
      document.getElementById('scheme-overlay').classList.add('hidden')
    );
    document.getElementById('scheme-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'scheme-overlay') document.getElementById('scheme-overlay').classList.add('hidden');
    });
    document.getElementById('scheme-submit-btn')?.addEventListener('click', () => {
      document.getElementById('scheme-overlay').classList.add('hidden');
      alert('Application submitted successfully to official portal! You will receive an SMS confirmation with tracking ID.');
    });

    // Voice overlay close on backdrop
    document.getElementById('voice-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'voice-overlay') window.VoiceModule.closeVoice();
    });

    // Reset from sidebar
    document.getElementById('reset-profile-btn')?.addEventListener('click', () => {
      if (confirm('Reset your profile and start fresh?')) { localStorage.clear(); location.reload(); }
    });

    // Nav avatar goes to settings
    document.getElementById('nav-avatar')?.addEventListener('click', () =>
      window.Dashboard.renderTab('settings')
    );
  }

  function renderAlertPanel() {
    const alerts = engine.getAllAlerts();
    document.getElementById('alert-panel-content').innerHTML = alerts.map(a=>`
      <div class="alert-card ${a.type}" style="margin-bottom:10px">
        <div class="alert-icon">${a.icon}</div>
        <div class="alert-content">
          <div class="alert-title">${a.title}</div>
          <div class="alert-desc">${a.desc}</div>
          ${a.action?`<div class="alert-action">→ ${a.action}</div>`:''}
        </div>
      </div>`).join('');
  }

  function renderOneTap() {
    const advices = engine.getQuickAdvice();
    document.getElementById('one-tap-content').innerHTML = advices.map(a=>`
      <div class="one-tap-action ${a.type}">
        <span class="one-tap-action-icon">${a.icon}</span>
        <span class="one-tap-action-text">${a.text}</span>
      </div>`).join('');
  }

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    const t = document.getElementById(id);
    if (t) { t.classList.remove('hidden'); t.classList.add('fade-in'); }
  }

  return { init, showScreen, onboardingComplete };
})();

window.AppController = AppController;

document.addEventListener('DOMContentLoaded', () => AppController.init());

