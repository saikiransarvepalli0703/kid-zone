/* Smart Kids Learning World - Audio & Speech Synthesis Engine */

class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.speechSynth = window.speechSynthesis;
    this.selectedVoice = null;

    // Initialize Web Audio Context on first user interaction
    this.initAudioContext();
    this.loadVoice();
  }

  initAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext && !this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      this.initAudioContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  loadVoice() {
    if (!this.speechSynth) return;
    const voices = this.speechSynth.getVoices();
    // Try to find a friendly English female/child voice, or fallback to first English voice
    this.selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira'))) 
      || voices.find(v => v.lang.startsWith('en')) 
      || voices[0];

    if (this.speechSynth.onvoiceschanged !== undefined) {
      this.speechSynth.onvoiceschanged = () => {
        const updatedVoices = this.speechSynth.getVoices();
        this.selectedVoice = updatedVoices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira'))) 
          || updatedVoices.find(v => v.lang.startsWith('en')) 
          || updatedVoices[0];
      };
    }
  }

  speak(text, onEnd = null) {
    if (!this.soundEnabled || !this.speechSynth) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel current speech queue
    this.speechSynth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = 0.88; // Cheerful, clear speed for kids
    utterance.pitch = 1.25; // Slightly higher, friendly kid tone

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    this.speechSynth.speak(utterance);
  }

  stopSpeech() {
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
  }

  /* Web Audio Synthesized Sound Effects */

  playPop() {
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.08);
  }

  playSuccessDing() {
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, index) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.07);

      gain.gain.setValueAtTime(0.2, now + index * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.07 + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + index * 0.07);
      osc.stop(now + index * 0.07 + 0.3);
    });
  }

  playFanfare() {
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const notes = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.50];
    const times = [0, 0.12, 0.24, 0.36, 0.48, 0.65];
    const durations = [0.1, 0.1, 0.1, 0.1, 0.15, 0.5];

    notes.forEach((freq, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + times[i]);

      gain.gain.setValueAtTime(0.15, now + times[i]);
      gain.gain.exponentialRampToValueAtTime(0.001, now + times[i] + durations[i]);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + times[i]);
      osc.stop(now + times[i] + durations[i]);
    });
  }

  playGentleBoing() {
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.audioCtx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.25);
  }

  playCoinSound() {
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /* Confetti Visual & Sound Celebration Trigger */
  triggerConfetti() {
    this.playSuccessDing();
    this.playFanfare();

    const container = document.getElementById('mobileFrame') || document.body;
    const confettiWrapper = document.createElement('div');
    confettiWrapper.className = 'confetti-wrapper';
    
    const colors = ['#FF4785', '#00D2FF', '#FFD600', '#00E676', '#8A2BE2', '#FF6D00'];
    
    for (let i = 0; i < 45; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.4 + 's';
      piece.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      confettiWrapper.appendChild(piece);
    }

    container.appendChild(confettiWrapper);

    setTimeout(() => {
      confettiWrapper.remove();
    }, 3000);
  }

  /* Browser Speech Recognition API Integration */
  isSpeechRecognitionSupported() {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  startSpeechRecognition(targetWord, onResultCallback) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not natively supported in this browser. Using simulation fallback.");
      this.simulateSpeechRecognition(targetWord, onResultCallback);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript.toLowerCase().trim();
        const isMatch = this.checkPhoneticMatch(spokenText, targetWord);
        onResultCallback({
          spokenText: spokenText,
          isMatch: isMatch,
          confidence: event.results[0][0].confidence || 0.95
        });
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        // Fallback to simulation mode on mic permission error
        this.simulateSpeechRecognition(targetWord, onResultCallback);
      };

      recognition.start();
    } catch (e) {
      console.error("Error starting SpeechRecognition:", e);
      this.simulateSpeechRecognition(targetWord, onResultCallback);
    }
  }

  simulateSpeechRecognition(targetWord, onResultCallback) {
    // Friendly fallback for testing/environments without microphone permission
    setTimeout(() => {
      const spokenText = targetWord.toLowerCase();
      onResultCallback({
        spokenText: spokenText,
        isMatch: true,
        confidence: 0.98,
        simulated: true
      });
    }, 1800);
  }

  checkPhoneticMatch(spoken, target) {
    spoken = spoken.toLowerCase().trim();
    target = target.toLowerCase().trim();

    if (spoken === target || spoken.includes(target) || target.includes(spoken)) {
      return true;
    }

    // Complete A-Z Toddler Phonetic Variants Dictionary
    const letterPhonetics = {
      'a': ['apple', 'ey', 'ay', 'a'],
      'b': ['ball', 'bee', 'be', 'b'],
      'c': ['cat', 'see', 'sea', 'c'],
      'd': ['dog', 'dee', 'd'],
      'e': ['elephant', 'ee', 'e'],
      'f': ['fish', 'ef', 'f'],
      'g': ['giraffe', 'gee', 'jee', 'g'],
      'h': ['hat', 'aitch', 'h'],
      'i': ['ice', 'eye', 'i'],
      'j': ['jug', 'jay', 'j'],
      'k': ['kite', 'kay', 'k'],
      'l': ['lion', 'el', 'l'],
      'm': ['monkey', 'em', 'm'],
      'n': ['nest', 'en', 'n'],
      'o': ['owl', 'oh', 'o'],
      'p': ['pen', 'pee', 'p'],
      'q': ['queen', 'cue', 'kew', 'q'],
      'r': ['rabbit', 'ar', 'r'],
      's': ['sun', 'es', 's'],
      't': ['train', 'tee', 't'],
      'u': ['umbrella', 'you', 'u'],
      'v': ['van', 'vee', 'v'],
      'w': ['watch', 'double u', 'w'],
      'x': ['xylophone', 'ex', 'x'],
      'y': ['yak', 'why', 'y'],
      'z': ['zebra', 'zee', 'zed', 'z']
    };

    if (letterPhonetics[target]) {
      return letterPhonetics[target].some(variant => spoken.includes(variant));
    }

    return false;
  }
}

window.appAudio = new AudioManager();

