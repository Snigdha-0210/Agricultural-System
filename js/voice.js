// ============================================
// KisanMitra — Voice Interaction Module
// ============================================

const VoiceModule = (() => {
  let engine = null;
  let isListening = false;
  let recognition = null;
  let synthesisActive = false;

  function init(farmEngine) {
    engine = farmEngine;
    setupVoiceBtns();
    initSpeechRecognition();
  }

  function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        processQuery(transcript);
      };
      recognition.onerror = () => {
        stopListening();
        showListeningText('Could not understand. Please try again.');
      };
      recognition.onend = () => { stopListening(); };
    }
  }

  function setupVoiceBtns() {
    const voiceBtnNav = document.getElementById('voice-btn-nav');
    if (voiceBtnNav) voiceBtnNav.addEventListener('click', openVoice);

    const voiceClose = document.getElementById('voice-close');
    if (voiceClose) voiceClose.addEventListener('click', closeVoice);

    const voiceMic = document.getElementById('voice-mic-btn');
    if (voiceMic) voiceMic.addEventListener('click', toggleListening);

    // Voice chips (preset queries)
    document.querySelectorAll('.voice-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.query;
        processQuery(query);
      });
    });
  }

  function openVoice() {
    document.getElementById('voice-overlay').classList.remove('hidden');
    resetVoiceUI();
  }

  function closeVoice() {
    document.getElementById('voice-overlay').classList.add('hidden');
    stopListening();
  }

  function resetVoiceUI() {
    setWaveState('idle');
    showListeningText('Tap the mic or try a suggestion below');
    document.getElementById('voice-response').classList.add('hidden');
  }

  function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  function startListening() {
    isListening = true;
    const micBtn = document.getElementById('voice-mic-btn');
    if (micBtn) { micBtn.classList.add('listening'); micBtn.textContent = '⏹️'; }
    setWaveState('listening');
    showListeningText('Listening... speak now');

    if (recognition) {
      try { recognition.start(); } catch (e) { console.log('Recognition start error:', e); }
    } else {
      // Simulate listening if no browser support
      setTimeout(() => {
        stopListening();
        showListeningText('Voice not supported in this browser. Use the suggestion chips below.');
      }, 2000);
    }
  }

  function stopListening() {
    isListening = false;
    const micBtn = document.getElementById('voice-mic-btn');
    if (micBtn) { micBtn.classList.remove('listening'); micBtn.textContent = '🎙️'; }
    setWaveState('idle');
    if (recognition) { try { recognition.stop(); } catch (e) {} }
  }

  function setWaveState(state) {
    const wave = document.querySelector('.voice-wave');
    if (!wave) return;
    wave.className = 'voice-wave';
    if (state !== 'idle') wave.classList.add(state);
  }

  function showListeningText(text) {
    const el = document.getElementById('voice-listening-text');
    if (el) el.textContent = text;
  }

  function processQuery(query) {
    stopListening();
    showListeningText(`"${query}"`);
    setWaveState('speaking');

    setTimeout(() => {
      const response = engine.processVoiceQuery(query);
      showResponse(response);
      speakResponse(response);
      setWaveState('idle');
    }, 600);
  }

  function showResponse(text) {
    const responseEl = document.getElementById('voice-response');
    const textEl = document.getElementById('voice-response-text');
    if (responseEl && textEl) {
      textEl.textContent = text;
      responseEl.classList.remove('hidden');
    }
  }

  function speakResponse(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-IN';
      utter.rate = 0.9;
      utter.pitch = 1.0;
      window.speechSynthesis.speak(utter);
    }
  }

  return { init, openVoice, closeVoice, processQuery };
})();

window.VoiceModule = VoiceModule;
