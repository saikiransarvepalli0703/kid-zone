/* Smart Kids Learning World - Main Application Engine & Game Logic */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    coins: parseInt(localStorage.getItem('skl_coins') || '50'),
    stars: parseInt(localStorage.getItem('skl_stars') || '12'),
    unlockedLevels: JSON.parse(localStorage.getItem('skl_unlocked') || '[1]'),
    completedModules: JSON.parse(localStorage.getItem('skl_completed') || '[]'),
    currentScreen: 'home', // home, level1, level2, level3, level4, parent, shop
    activeCategory: 'fruits',
    activeGame: null,
    activeRhyme: null,
    rhymeInterval: null,
    parentUnlocked: false,
    screenTimeMinutes: Math.floor((Date.now() - parseInt(localStorage.getItem('skl_session_start') || Date.now())) / 60000),
    drawing: {
      color: '#FF4785',
      size: 8,
      tool: 'pen' // pen, rainbow, stamp
    }
  };

  if (!localStorage.getItem('skl_session_start')) {
    localStorage.setItem('skl_session_start', Date.now().toString());
  }

  // DOM Elements
  const appContent = document.getElementById('appContent');
  const coinsDisplay = document.getElementById('coinsDisplay');
  const starsDisplay = document.getElementById('starsDisplay');
  const mascotText = document.getElementById('mascotText');
  const mascotAvatar = document.getElementById('mascotAvatar');
  const navItems = document.querySelectorAll('.nav-item');
  const mobileFrame = document.getElementById('mobileFrame');
  const toggleMobileBtn = document.getElementById('toggleMobileView');

  // Viewport Switcher
  if (toggleMobileBtn && mobileFrame) {
    toggleMobileBtn.addEventListener('click', () => {
      mobileFrame.classList.toggle('fullscreen-mode');
      toggleMobileBtn.classList.toggle('active');
    });
  }

  // Floating Background Bubbles Canvas
  initBubbleCanvas();

  // Helper Functions
  function updateHeaderStats() {
    if (coinsDisplay) coinsDisplay.textContent = state.coins;
    if (starsDisplay) starsDisplay.textContent = state.stars;
    localStorage.setItem('skl_coins', state.coins.toString());
    localStorage.setItem('skl_stars', state.stars.toString());
    localStorage.setItem('skl_unlocked', JSON.stringify(state.unlockedLevels));
    localStorage.setItem('skl_completed', JSON.stringify(state.completedModules));
  }

  function setMascotText(text) {
    if (mascotText) {
      mascotText.textContent = text;
    }
  }

  function addReward(coins = 5, stars = 1) {
    state.coins += coins;
    state.stars += stars;
    updateHeaderStats();
    window.appAudio.playCoinSound();
  }

  function unlockLevel(lvl) {
    if (!state.unlockedLevels.includes(lvl)) {
      state.unlockedLevels.push(lvl);
      updateHeaderStats();
      window.appAudio.playFanfare();
      setMascotText(`Hooray! Level ${lvl} is now unlocked! 🎉`);
    }
  }

  // Navigation Routing
  function navigateTo(screen, params = {}) {
    window.appAudio.playPop();
    state.currentScreen = screen;

    // Update Bottom Nav active state
    navItems.forEach(item => {
      if (item.dataset.screen === screen) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    switch (screen) {
      case 'home':
        renderHomeScreen();
        break;
      case 'level1':
        renderLevel1Screen(params.sub || 'alphabets');
        break;
      case 'level2':
        renderLevel2Screen(params.sub || 'games');
        break;
      case 'level3':
        renderLevel3Screen();
        break;
      case 'level4':
        renderLevel4Screen();
        break;
      case 'parent':
        renderParentDashboard();
        break;
      case 'shop':
        renderStickerShop();
        break;
      default:
        renderHomeScreen();
    }
  }

  // Bind Navigation Clicks
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetScreen = item.dataset.screen;
      if (targetScreen === 'level2' && !state.unlockedLevels.includes(2)) {
        window.appAudio.playGentleBoing();
        setMascotText('Complete Level 1 lessons to unlock Level 2!');
        return;
      }
      if (targetScreen === 'level3' && !state.unlockedLevels.includes(3)) {
        window.appAudio.playGentleBoing();
        setMascotText('Play Level 2 games to unlock Level 3 Quiz!');
        return;
      }
      if (targetScreen === 'level4' && !state.unlockedLevels.includes(4)) {
        window.appAudio.playGentleBoing();
        setMascotText('Earn 15 stars to unlock Level 4 Drawing Canvas!');
        return;
      }
      navigateTo(targetScreen);
    });
  });

  if (mascotAvatar) {
    mascotAvatar.addEventListener('click', () => {
      window.appAudio.playPop();
      const mascotMessages = [
        "You are doing awesome! Keep exploring! 🌟",
        "Let's learn new words and play fun games! 🚀",
        "Tap on letters to hear them talk! 🗣️",
        "Don't forget to wash your hands before eating! 🧼",
        "Saying Please and Thank You makes everyone happy! 🙏"
      ];
      const msg = mascotMessages[Math.floor(Math.random() * mascotMessages.length)];
      setMascotText(msg);
      window.appAudio.speak(msg);
    });
  }

  // SCREEN RENDERING FUNCTIONS

  // 1. HOME SCREEN
  function renderHomeScreen() {
    setMascotText("Welcome to Smart Kids Learning World! Pick a Level to start!");
    
    appContent.innerHTML = `
      <div class="screen-header">
        <h1>Hi Little Explorer! 👋</h1>
        <p>Choose your learning adventure today</p>
      </div>

      <div class="levels-grid">
        <div class="level-card level-1" id="btnLvl1">
          <div class="level-info">
            <h2>Level 1: Basic Learn 📖</h2>
            <p>Alphabets, Objects, Habits & Manners</p>
          </div>
          <div class="level-icon">🔤</div>
        </div>

        <div class="level-card level-2 ${state.unlockedLevels.includes(2) ? '' : 'locked'}" id="btnLvl2">
          <div class="level-info">
            <h2>Level 2: Play & Rhymes 🎮</h2>
            <p>7 Interactive Games & Karaoke Rhymes</p>
          </div>
          <div class="level-icon">🧩</div>
          ${!state.unlockedLevels.includes(2) ? '<div class="lock-overlay">🔒 Finish Lvl 1</div>' : ''}
        </div>

        <div class="level-card level-3 ${state.unlockedLevels.includes(3) ? '' : 'locked'}" id="btnLvl3">
          <div class="level-info">
            <h2>Level 3: Quiz Challenge 🏆</h2>
            <p>Test your knowledge & win stars!</p>
          </div>
          <div class="level-icon">⭐</div>
          ${!state.unlockedLevels.includes(3) ? '<div class="lock-overlay">🔒 Locked</div>' : ''}
        </div>

        <div class="level-card level-4 ${state.unlockedLevels.includes(4) ? '' : 'locked'}" id="btnLvl4">
          <div class="level-info">
            <h2>Level 4: Creative Studio 🎨</h2>
            <p>Drawing Canvas & Magic Rainbow Pen</p>
          </div>
          <div class="level-icon">🎨</div>
          ${!state.unlockedLevels.includes(4) ? '<div class="lock-overlay">🔒 Locked</div>' : ''}
        </div>
      </div>
    `;

    document.getElementById('btnLvl1').addEventListener('click', () => navigateTo('level1'));
    document.getElementById('btnLvl2').addEventListener('click', () => {
      if (state.unlockedLevels.includes(2)) navigateTo('level2');
      else { window.appAudio.playGentleBoing(); setMascotText("Complete Level 1 first!"); }
    });
    document.getElementById('btnLvl3').addEventListener('click', () => {
      if (state.unlockedLevels.includes(3)) navigateTo('level3');
      else { window.appAudio.playGentleBoing(); setMascotText("Complete Level 2 first!"); }
    });
    document.getElementById('btnLvl4').addEventListener('click', () => {
      if (state.unlockedLevels.includes(4)) navigateTo('level4');
      else { window.appAudio.playGentleBoing(); setMascotText("Earn 15 stars to unlock!"); }
    });
  }

  // 2. LEVEL 1: BASIC LEARNING
  function renderLevel1Screen(subTab = 'alphabets') {
    setMascotText("Level 1: Tap any item to hear its voice & learn!");

    appContent.innerHTML = `
      <div class="screen-header">
        <h1>Level 1: Basic Learn 🔤</h1>
        <p>Master Alphabets, Objects & Good Habits</p>
      </div>

      <div class="pills-scroll">
        <button class="pill-btn ${subTab === 'alphabets' ? 'active' : ''}" id="tabAlphabets">🔤 Alphabets A-Z</button>
        <button class="pill-btn ${subTab === 'objects' ? 'active' : ''}" id="tabObjects">🍎 Object Names</button>
        <button class="pill-btn ${subTab === 'eating' ? 'active' : ''}" id="tabEating">🥦 Good Food Habits</button>
        <button class="pill-btn ${subTab === 'manners' ? 'active' : ''}" id="tabManners">🙏 Good Manners</button>
      </div>

      <div id="level1Container"></div>
    `;

    document.getElementById('tabAlphabets').addEventListener('click', () => renderLevel1Screen('alphabets'));
    document.getElementById('tabObjects').addEventListener('click', () => renderLevel1Screen('objects'));
    document.getElementById('tabEating').addEventListener('click', () => renderLevel1Screen('eating'));
    document.getElementById('tabManners').addEventListener('click', () => renderLevel1Screen('manners'));

    const container = document.getElementById('level1Container');

    if (subTab === 'alphabets') {
      let gridHTML = '<div class="grid-container">';
      window.appData.alphabets.forEach(item => {
        gridHTML += `
          <div class="alpha-card" data-letter="${item.letter}">
            <div class="alpha-letter">${item.letter}</div>
            <div class="alpha-emoji">${item.emoji}</div>
            <div class="alpha-word">${item.word}</div>
          </div>
        `;
      });
      gridHTML += '</div>';

      // Check level completion button
      gridHTML += `
        <div style="padding: 20px;">
          <button class="action-btn green" id="btnFinishLvl1">
            🌟 Complete Level 1 & Unlock Level 2!
          </button>
        </div>
      `;

      container.innerHTML = gridHTML;

      // Event Listeners for Alphabet Cards
      container.querySelectorAll('.alpha-card').forEach(card => {
        card.addEventListener('click', () => {
          const letterStr = card.dataset.letter;
          const item = window.appData.alphabets.find(a => a.letter === letterStr);
          if (item) showAlphabetModal(item);
        });
      });

      document.getElementById('btnFinishLvl1').addEventListener('click', () => {
        addReward(20, 5);
        unlockLevel(2);
        showAchievementModal("Level 1 Master!", "You learned all your Alphabets and Good Habits! Level 2 is unlocked!");
      });

    } else if (subTab === 'objects') {
      container.innerHTML = `
        <div class="pills-scroll" style="padding-top:0;">
          ${Object.keys(window.appData.objects).map(cat => `
            <button class="pill-btn ${state.activeCategory === cat ? 'active' : ''}" data-cat="${cat}">
              ${cat.toUpperCase()}
            </button>
          `).join('')}
        </div>
        <div class="grid-container" id="objectsGrid"></div>
      `;

      container.querySelectorAll('[data-cat]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          state.activeCategory = e.target.dataset.cat;
          renderLevel1Screen('objects');
        });
      });

      const objGrid = document.getElementById('objectsGrid');
      const categoryList = window.appData.objects[state.activeCategory] || [];
      objGrid.innerHTML = categoryList.map(obj => `
        <div class="alpha-card" data-name="${obj.name}" data-emoji="${obj.emoji}" data-desc="${obj.desc}">
          <div class="alpha-emoji" style="font-size:2.5rem;">${obj.emoji}</div>
          <div class="alpha-word" style="font-size:0.85rem; font-weight:700;">${obj.name}</div>
        </div>
      `).join('');

      objGrid.querySelectorAll('.alpha-card').forEach(card => {
        card.addEventListener('click', () => {
          window.appAudio.playPop();
          const name = card.dataset.name;
          const desc = card.dataset.desc;
          window.appAudio.speak(`${name}! ${desc}`);
          setMascotText(`${name}: ${desc}`);
        });
      });

    } else if (subTab === 'eating') {
      container.innerHTML = window.appData.eatingHabits.map(habit => `
        <div class="habit-card" data-title="${habit.title}" data-text="${habit.text}">
          <div class="habit-icon">${habit.emoji}</div>
          <div class="habit-details">
            <h3>${habit.title}</h3>
            <p>${habit.text}</p>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.habit-card').forEach(card => {
        card.addEventListener('click', () => {
          window.appAudio.playPop();
          const title = card.dataset.title;
          const text = card.dataset.text;
          window.appAudio.speak(`${title}. ${text}`);
          setMascotText(`Good Habit: ${title}`);
        });
      });

    } else if (subTab === 'manners') {
      container.innerHTML = window.appData.manners.map(m => `
        <div class="habit-card" data-title="${m.title}" data-text="${m.text}">
          <div class="habit-icon">${m.emoji}</div>
          <div class="habit-details">
            <h3>${m.title}</h3>
            <p>${m.text}</p>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.habit-card').forEach(card => {
        card.addEventListener('click', () => {
          window.appAudio.playPop();
          const title = card.dataset.title;
          const text = card.dataset.text;
          window.appAudio.speak(`${title}. ${text}`);
          setMascotText(`Good Manners: ${title}`);
        });
      });
    }
  }

  // Alphabet Detail Flashcard Modal with AI Voice Pronunciation & Speech Recognition
  function showAlphabetModal(item) {
    window.appAudio.playPop();
    window.appAudio.speak(`${item.letter}. ${item.word}. ${item.example}`);

    const modalHTML = `
      <div class="modal-overlay" id="flashModal">
        <div class="flashcard-modal">
          <button class="modal-close" id="closeModal">&times;</button>
          <div class="flashcard-letter">${item.letter}</div>
          <div class="flashcard-hero">${item.emoji}</div>
          <div class="flashcard-word">${item.word}</div>
          <div class="flashcard-desc">${item.example}</div>
          
          <div class="voice-status-box" id="voiceStatusBox" style="display:none; margin: 10px 0; padding: 10px; border-radius: 16px; background: #FFF0F5; border: 2px dashed #FF4785;">
            <div class="mic-pulse-icon" id="micPulseIcon">🎙️</div>
            <div id="voiceStatusText" style="font-family:var(--font-heading); font-size:0.95rem; color:#FF4785; font-weight:700; margin-top:4px;">
              Listening... Say "${item.word}"!
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px; margin-top:12px;">
            <button class="action-btn pink" id="btnRepeatSound">
              🔊 Listen Pronunciation
            </button>
            <button class="action-btn green" id="btnMicPractice" style="background: linear-gradient(135deg, #8A2BE2 0%, #00D2FF 100%);">
              🎙️ Speak & Practice (AI Voice Check)
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('closeModal').addEventListener('click', () => {
      window.appAudio.stopSpeech();
      document.getElementById('flashModal').remove();
    });

    document.getElementById('btnRepeatSound').addEventListener('click', () => {
      window.appAudio.speak(`${item.letter}. ${item.word}. ${item.example}`);
    });

    // AI Voice Speech Recognition Handler
    document.getElementById('btnMicPractice').addEventListener('click', () => {
      window.appAudio.stopSpeech();
      const statusBox = document.getElementById('voiceStatusBox');
      const statusText = document.getElementById('voiceStatusText');
      const micIcon = document.getElementById('micPulseIcon');
      const btnMic = document.getElementById('btnMicPractice');

      statusBox.style.display = 'block';
      micIcon.className = 'mic-pulse-icon active';
      statusText.textContent = `Listening... Say "${item.word}"!`;
      btnMic.disabled = true;

      setMascotText(`Sparky is listening! Say "${item.word}" aloud! 🐉🎙️`);

      window.appAudio.startSpeechRecognition(item.word, (res) => {
        btnMic.disabled = false;
        micIcon.className = 'mic-pulse-icon';

        if (res.isMatch) {
          statusBox.style.background = '#E8F5E9';
          statusBox.style.borderColor = '#00E676';
          statusText.innerHTML = `✅ Excellent! You said "<b>${res.spokenText || item.word}</b>"! 🎉`;
          
          // Trigger Confetti, Fanfare & Rewards
          window.appAudio.triggerConfetti();
          addReward(10, 2);
          setMascotText(`WOW! Perfect pronunciation! You earned 10 coins & 2 stars! ⭐🎉`);

        } else {
          statusBox.style.background = '#FFFDE7';
          statusBox.style.borderColor = '#FFD600';
          statusText.innerHTML = `💡 Heard "${res.spokenText || '...'}"! Let's say "<b>${item.word}</b>" together!`;
          
          window.appAudio.playGentleBoing();
          window.appAudio.speak(`Good try! Let's say ${item.word} together. ${item.word}!`);
          setMascotText(`Good try! Let's say ${item.word} together! 🤗`);
        }
      });
    });
  }


  // 3. LEVEL 2: FUN LEARNING ACTIVITIES & RHYMES
  function renderLevel2Screen(subTab = 'games') {
    setMascotText("Level 2: Play 7 fun interactive games or karaoke nursery rhymes!");

    appContent.innerHTML = `
      <div class="screen-header">
        <h1>Level 2: Play & Rhymes 🎮</h1>
        <p>Interactive Games & Animated Rhymes</p>
      </div>

      <div class="pills-scroll">
        <button class="pill-btn ${subTab === 'games' ? 'active' : ''}" id="tabGames">🎮 Learning Games</button>
        <button class="pill-btn ${subTab === 'rhymes' ? 'active' : ''}" id="tabRhymes">🎵 Animated Rhymes</button>
      </div>

      <div id="level2Container"></div>
    `;

    document.getElementById('tabGames').addEventListener('click', () => renderLevel2Screen('games'));
    document.getElementById('tabRhymes').addEventListener('click', () => renderLevel2Screen('rhymes'));

    const container = document.getElementById('level2Container');

    if (subTab === 'games') {
      container.innerHTML = `
        <div class="game-container">
          <div class="game-card-grid">
            <div class="game-tile" id="g1">
              <div class="game-icon">🔤</div>
              <div class="game-title">Match Alphabet</div>
            </div>
            <div class="game-tile" id="g2">
              <div class="game-icon">🦁</div>
              <div class="game-title">Identify Animals</div>
            </div>
            <div class="game-tile" id="g3">
              <div class="game-icon">✏️</div>
              <div class="game-title">Missing Letters</div>
            </div>
            <div class="game-tile" id="g4">
              <div class="game-icon">🎨</div>
              <div class="game-title">Color Match</div>
            </div>
            <div class="game-tile" id="g5">
              <div class="game-icon">🎴</div>
              <div class="game-title">Memory Cards</div>
            </div>
            <div class="game-tile" id="g6">
              <div class="game-icon">🥗</div>
              <div class="game-title">Food Sorter</div>
            </div>
            <div class="game-tile" id="g7">
              <div class="game-icon">🧩</div>
              <div class="game-title">Shape Puzzle</div>
            </div>
            <div class="game-tile" id="g8" style="grid-column: span 2; background: linear-gradient(135deg, #FF4785 0%, #8A2BE2 100%); color: white;">
              <div class="game-icon">🎙️</div>
              <div class="game-title" style="color:white; font-weight:700;">🎙️ AI Voice Pronunciation</div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('g1').addEventListener('click', () => startAlphabetMatchGame(container));
      document.getElementById('g2').addEventListener('click', () => startIdentifyAnimalsGame(container));
      document.getElementById('g3').addEventListener('click', () => startMissingLettersGame(container));
      document.getElementById('g4').addEventListener('click', () => startColorMatchGame(container));
      document.getElementById('g5').addEventListener('click', () => startMemoryCardGame(container));
      document.getElementById('g6').addEventListener('click', () => startFoodSorterGame(container));
      document.getElementById('g7').addEventListener('click', () => startShapePuzzleGame(container));
      document.getElementById('g8').addEventListener('click', () => startVoicePracticeGame(container));

    } else if (subTab === 'rhymes') {
      renderRhymesSection(container);
    }
  }

  // RHYMES PLAYER
  function renderRhymesSection(container) {
    const activeRhyme = state.activeRhyme || window.appData.rhymes[0];
    
    container.innerHTML = `
      <div class="rhyme-player">
        <h2 style="font-family:var(--font-heading); text-align:center; font-size:1.4rem;">
          ${activeRhyme.emoji} ${activeRhyme.title}
        </h2>
        <div class="rhyme-display" id="rhymeDisplay">
          <div class="rhyme-line active" id="currentRhymeLine">${activeRhyme.lines[0]}</div>
        </div>
        <div class="rhyme-controls">
          <button class="rhyme-btn" id="btnPlayRhyme">▶️</button>
          <button class="rhyme-btn" id="btnNextRhyme">⏭️</button>
        </div>
      </div>

      <div class="pills-scroll" style="margin-top:10px;">
        ${window.appData.rhymes.map(r => `
          <button class="pill-btn ${r.id === activeRhyme.id ? 'active' : ''}" data-rhyme="${r.id}">
            ${r.emoji} ${r.title}
          </button>
        `).join('')}
      </div>
    `;

    let lineIndex = 0;
    let isPlaying = false;
    const rhymeLineEl = document.getElementById('currentRhymeLine');
    const playBtn = document.getElementById('btnPlayRhyme');

    container.querySelectorAll('[data-rhyme]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.appAudio.stopSpeech();
        if (state.rhymeInterval) clearInterval(state.rhymeInterval);
        const rId = e.currentTarget.dataset.rhyme;
        state.activeRhyme = window.appData.rhymes.find(r => r.id === rId);
        renderRhymesSection(container);
      });
    });

    playBtn.addEventListener('click', () => {
      if (isPlaying) {
        isPlaying = false;
        playBtn.textContent = '▶️';
        window.appAudio.stopSpeech();
        if (state.rhymeInterval) clearInterval(state.rhymeInterval);
      } else {
        isPlaying = true;
        playBtn.textContent = '⏸️';
        lineIndex = 0;

        function speakNextLine() {
          if (!isPlaying) return;
          if (lineIndex >= activeRhyme.lines.length) {
            lineIndex = 0;
          }
          const textLine = activeRhyme.lines[lineIndex];
          rhymeLineEl.textContent = textLine;
          window.appAudio.speak(textLine, () => {
            if (isPlaying) {
              lineIndex++;
              setTimeout(speakNextLine, 800);
            }
          });
        }

        speakNextLine();
      }
    });

    document.getElementById('btnNextRhyme').addEventListener('click', () => {
      window.appAudio.stopSpeech();
      if (state.rhymeInterval) clearInterval(state.rhymeInterval);
      const currIdx = window.appData.rhymes.findIndex(r => r.id === activeRhyme.id);
      const nextIdx = (currIdx + 1) % window.appData.rhymes.length;
      state.activeRhyme = window.appData.rhymes[nextIdx];
      renderRhymesSection(container);
    });
  }

  // GAME 1: MATCH ALPHABET
  function startAlphabetMatchGame(container) {
    const targetItem = window.appData.alphabets[Math.floor(Math.random() * window.appData.alphabets.length)];
    const distractorOptions = window.appData.alphabets.filter(a => a.letter !== targetItem.letter);
    const choices = [targetItem, ...shuffle(distractorOptions).slice(0, 3)];
    const shuffledChoices = shuffle(choices);

    setMascotText(`Find the object starting with letter ${targetItem.letter}!`);
    window.appAudio.speak(`Find the object starting with letter ${targetItem.letter}`);

    container.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <button class="pill-btn" id="btnBackToGames" style="margin-bottom:15px;">⬅️ Back to Games</button>
        <h2 style="font-family:var(--font-heading); font-size:2.2rem; color:var(--primary-purple);">
          Which item starts with <span style="color:var(--primary-pink); font-size:3rem;">${targetItem.letter}</span>?
        </h2>

        <div class="grid-container" style="grid-template-columns: 1fr 1fr; margin-top:20px;">
          ${shuffledChoices.map(c => `
            <div class="alpha-card" data-letter="${c.letter}" style="height:120px;">
              <div class="alpha-emoji" style="font-size:3rem;">${c.emoji}</div>
              <div class="alpha-word" style="font-size:1rem; font-weight:700;">${c.word}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('btnBackToGames').addEventListener('click', () => renderLevel2Screen('games'));

    container.querySelectorAll('.alpha-card').forEach(card => {
      card.addEventListener('click', () => {
        if (card.dataset.letter === targetItem.letter) {
          window.appAudio.playSuccessDing();
          addReward(10, 2);
          showAchievementModal("Great Job!", `Correct! ${targetItem.letter} is for ${targetItem.word}!`);
          unlockLevel(3);
          setTimeout(() => startAlphabetMatchGame(container), 2000);
        } else {
          window.appAudio.playGentleBoing();
          card.style.opacity = '0.4';
          setMascotText("Oops, try another one!");
        }
      });
    });
  }

  // GAME 2: IDENTIFY ANIMALS
  function startIdentifyAnimalsGame(container) {
    const animals = window.appData.objects.animals;
    const target = animals[Math.floor(Math.random() * animals.length)];
    const distractors = shuffle(animals.filter(a => a.name !== target.name)).slice(0, 3);
    const options = shuffle([target, ...distractors]);

    setMascotText(`What animal is this ${target.emoji}?`);
    window.appAudio.speak(`What animal is this?`);

    container.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <button class="pill-btn" id="btnBackToGames" style="margin-bottom:15px;">⬅️ Back to Games</button>
        <div style="font-size: 6rem; margin: 10px 0; animation: float 3s ease-in-out infinite;">
          ${target.emoji}
        </div>
        <h2 style="font-family:var(--font-heading); font-size:1.6rem; color:#1E293B;">
          What is the name of this animal?
        </h2>

        <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
          ${options.map(opt => `
            <button class="action-btn" data-name="${opt.name}" style="background:white; color:#1E293B; border:3px solid #E2E8F0; font-size:1.3rem;">
              ${opt.name}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('btnBackToGames').addEventListener('click', () => renderLevel2Screen('games'));

    container.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.name === target.name) {
          window.appAudio.playSuccessDing();
          addReward(10, 2);
          btn.style.background = '#00E676';
          btn.style.color = 'white';
          setMascotText(`Awesome! That is a ${target.name}!`);
          setTimeout(() => startIdentifyAnimalsGame(container), 2000);
        } else {
          window.appAudio.playGentleBoing();
          btn.style.background = '#FF5252';
          btn.style.color = 'white';
        }
      });
    });
  }

  // GAME 3: MISSING LETTERS
  function startMissingLettersGame(container) {
    const words = [
      { full: 'APPLE', missing: 'P', display: 'A _ P L E', emoji: '🍎' },
      { full: 'BALL', missing: 'A', display: 'B _ L L', emoji: '⚽' },
      { full: 'CAT', missing: 'A', display: 'C _ T', emoji: '🐱' },
      { full: 'LION', missing: 'I', display: 'L _ O N', emoji: '🦁' },
      { full: 'STAR', missing: 'T', display: 'S _ A R', emoji: '⭐' }
    ];
    const item = words[Math.floor(Math.random() * words.length)];
    const options = shuffle([item.missing, 'B', 'M', 'R']).slice(0, 4);

    container.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <button class="pill-btn" id="btnBackToGames" style="margin-bottom:15px;">⬅️ Back to Games</button>
        <div style="font-size:5rem; margin:10px 0;">${item.emoji}</div>
        <h2 style="font-family:var(--font-heading); font-size:2.8rem; letter-spacing:4px; color:var(--primary-purple);">
          ${item.display}
        </h2>
        <p style="font-weight:600; color:#64748B;">Tap the missing letter to complete the word!</p>

        <div class="grid-container" style="grid-template-columns: 1fr 1fr; margin-top:20px;">
          ${options.map(l => `
            <div class="alpha-card" data-letter="${l}" style="height:90px;">
              <div class="alpha-letter">${l}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('btnBackToGames').addEventListener('click', () => renderLevel2Screen('games'));

    container.querySelectorAll('.alpha-card').forEach(card => {
      card.addEventListener('click', () => {
        if (card.dataset.letter === item.missing) {
          window.appAudio.playSuccessDing();
          addReward(10, 2);
          setMascotText(`Correct! ${item.full}!`);
          setTimeout(() => startMissingLettersGame(container), 2000);
        } else {
          window.appAudio.playGentleBoing();
          card.style.opacity = '0.3';
        }
      });
    });
  }

  // GAME 4: COLOR MATCHING
  function startColorMatchGame(container) {
    const items = [
      { name: 'Strawberry', emoji: '🍓', color: 'Red' },
      { name: 'Banana', emoji: '🍌', color: 'Yellow' },
      { name: 'Ocean Wave', emoji: '🌊', color: 'Blue' },
      { name: 'Broccoli', emoji: '🥦', color: 'Green' },
      { name: 'Grapes', emoji: '🍇', color: 'Purple' }
    ];
    const target = items[Math.floor(Math.random() * items.length)];
    const colors = ['Red', 'Yellow', 'Blue', 'Green', 'Purple'];

    container.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <button class="pill-btn" id="btnBackToGames" style="margin-bottom:15px;">⬅️ Back to Games</button>
        <div style="font-size: 5rem;">${target.emoji}</div>
        <h2 style="font-family:var(--font-heading); font-size:1.6rem;">
          What color is this ${target.name}?
        </h2>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px;">
          ${colors.slice(0, 4).map(c => `
            <button class="action-btn" data-color="${c}" style="background:white; color:#1E293B; border:3px solid #E2E8F0;">
              🎨 ${c}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('btnBackToGames').addEventListener('click', () => renderLevel2Screen('games'));

    container.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.color === target.color) {
          window.appAudio.playSuccessDing();
          addReward(10, 2);
          setMascotText(`Awesome! ${target.name} is ${target.color}!`);
          setTimeout(() => startColorMatchGame(container), 2000);
        } else {
          window.appAudio.playGentleBoing();
          btn.style.opacity = '0.4';
        }
      });
    });
  }

  // GAME 5: MEMORY CARDS
  function startMemoryCardGame(container) {
    const emojis = ['🍎', '🐶', '⚽', '🦁', '🚀', '⭐'];
    const cards = shuffle([...emojis, ...emojis]);
    let flipped = [];
    let matchedCount = 0;

    container.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <button class="pill-btn" id="btnBackToGames" style="margin-bottom:15px;">⬅️ Back to Games</button>
        <h2 style="font-family:var(--font-heading); font-size:1.5rem;">Match All Pairs! 🎴</h2>

        <div class="grid-container" style="grid-template-columns: repeat(3, 1fr); margin-top:15px;">
          ${cards.map((e, idx) => `
            <div class="alpha-card mem-card" data-emoji="${e}" data-idx="${idx}" style="height:90px; background:#8A2BE2; color:white;">
              <div class="card-inner" style="font-size:2.5rem; display:none;">${e}</div>
              <div class="card-back" style="font-size:2rem;">❓</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('btnBackToGames').addEventListener('click', () => renderLevel2Screen('games'));

    container.querySelectorAll('.mem-card').forEach(card => {
      card.addEventListener('click', () => {
        if (flipped.length >= 2 || card.classList.contains('matched')) return;
        window.appAudio.playPop();

        const inner = card.querySelector('.card-inner');
        const back = card.querySelector('.card-back');
        inner.style.display = 'block';
        back.style.display = 'none';
        card.style.background = 'white';

        flipped.push(card);

        if (flipped.length === 2) {
          const [c1, c2] = flipped;
          if (c1.dataset.emoji === c2.dataset.emoji) {
            window.appAudio.playSuccessDing();
            c1.classList.add('matched');
            c2.classList.add('matched');
            flipped = [];
            matchedCount++;
            if (matchedCount === emojis.length) {
              addReward(25, 5);
              showAchievementModal("Memory Master!", "You matched all the cards!");
            }
          } else {
            window.appAudio.playGentleBoing();
            setTimeout(() => {
              c1.querySelector('.card-inner').style.display = 'none';
              c1.querySelector('.card-back').style.display = 'block';
              c1.style.background = '#8A2BE2';
              c2.querySelector('.card-inner').style.display = 'none';
              c2.querySelector('.card-back').style.display = 'block';
              c2.style.background = '#8A2BE2';
              flipped = [];
            }, 1000);
          }
        }
      });
    });
  }

  // GAME 6: FOOD SORTER
  function startFoodSorterGame(container) {
    const items = [
      { name: 'Broccoli', emoji: '🥦', healthy: true },
      { name: 'French Fries', emoji: '🍟', healthy: false },
      { name: 'Apple', emoji: '🍎', healthy: true },
      { name: 'Soda Can', emoji: '🥤', healthy: false },
      { name: 'Carrot', emoji: '🥕', healthy: true },
      { name: 'Donut', emoji: '🍩', healthy: false }
    ];
    let index = 0;

    function renderCurrentItem() {
      if (index >= items.length) {
        addReward(20, 4);
        showAchievementModal("Healthy Hero!", "You sorted all the foods correctly!");
        return;
      }
      const item = items[index];
      container.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <button class="pill-btn" id="btnBackToGames" style="margin-bottom:15px;">⬅️ Back to Games</button>
          <h2 style="font-family:var(--font-heading); font-size:1.5rem;">Sort into Right Basket 🥗</h2>

          <div style="font-size:6rem; margin:20px 0;">${item.emoji}</div>
          <h3 style="font-family:var(--font-heading); font-size:1.8rem; color:#1E293B;">${item.name}</h3>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:30px;">
            <button class="action-btn green" id="btnHealthy" style="padding:20px; flex-direction:column;">
              <span style="font-size:2rem;">🥦</span> Healthy Food
            </button>
            <button class="action-btn pink" id="btnJunk" style="padding:20px; flex-direction:column;">
              <span style="font-size:2rem;">🍟</span> Junk Food
            </button>
          </div>
        </div>
      `;

      document.getElementById('btnBackToGames').addEventListener('click', () => renderLevel2Screen('games'));

      document.getElementById('btnHealthy').addEventListener('click', () => check(true));
      document.getElementById('btnJunk').addEventListener('click', () => check(false));

      function check(chosenHealthy) {
        if (chosenHealthy === item.healthy) {
          window.appAudio.playSuccessDing();
          index++;
          renderCurrentItem();
        } else {
          window.appAudio.playGentleBoing();
          setMascotText("Oops, try again!");
        }
      }
    }

    renderCurrentItem();
  }

  // GAME 7: SHAPE PUZZLE
  function startShapePuzzleGame(container) {
    const shapes = [
      { name: 'Star', emoji: '⭐' },
      { name: 'Heart', emoji: '❤️' },
      { name: 'Circle', emoji: '⚪' },
      { name: 'Triangle', emoji: '🔺' }
    ];
    let score = 0;

    container.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <button class="pill-btn" id="btnBackToGames" style="margin-bottom:15px;">⬅️ Back to Games</button>
        <h2 style="font-family:var(--font-heading); font-size:1.5rem;">Match Shapes to Outlines 🧩</h2>

        <div class="grid-container" style="grid-template-columns:1fr 1fr; margin-top:20px;">
          ${shapes.map(s => `
            <div class="alpha-card shape-target" data-shape="${s.name}" style="height:110px; border:3px dashed #94A3B8;">
              <div style="font-size:3rem;">❓</div>
              <div style="font-family:var(--font-heading); font-size:0.9rem;">${s.name}</div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top:20px; font-weight:700;">Tap shape below to fit into slot:</div>
        <div style="display:flex; justify-content:center; gap:15px; margin-top:10px;">
          ${shuffle(shapes).map(s => `
            <div class="shape-piece" data-shape="${s.name}" style="font-size:3rem; cursor:pointer;">${s.emoji}</div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('btnBackToGames').addEventListener('click', () => renderLevel2Screen('games'));

    let selectedPiece = null;
    container.querySelectorAll('.shape-piece').forEach(piece => {
      piece.addEventListener('click', () => {
        window.appAudio.playPop();
        container.querySelectorAll('.shape-piece').forEach(p => p.style.transform = 'scale(1)');
        piece.style.transform = 'scale(1.3)';
        selectedPiece = piece;
      });
    });

    container.querySelectorAll('.shape-target').forEach(target => {
      target.addEventListener('click', () => {
        if (!selectedPiece) {
          setMascotText("First tap a shape piece below!");
          return;
        }
        if (target.dataset.shape === selectedPiece.dataset.shape) {
          window.appAudio.playSuccessDing();
          target.innerHTML = `<div style="font-size:3.5rem;">${selectedPiece.textContent}</div>`;
          target.style.border = '3px solid #00E676';
          selectedPiece.style.visibility = 'hidden';
          selectedPiece = null;
          score++;
          if (score === shapes.length) {
            addReward(30, 5);
            showAchievementModal("Shape Genius!", "You solved the entire shape puzzle!");
          }
        } else {
          window.appAudio.playGentleBoing();
          setMascotText("That shape doesn't match this slot!");
        }
      });
    });
  }

  // GAME 8: AI VOICE PRONUNCIATION PRACTICE
  function startVoicePracticeGame(container) {
    const practiceList = window.appData.alphabets.map(a => ({
      word: a.word,
      emoji: a.emoji,
      letter: a.letter,
      desc: a.example
    }));

    let currentIdx = 0;

    function renderCard() {
      const item = practiceList[currentIdx];
      container.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <button class="pill-btn" id="btnBackToGames" style="margin-bottom:15px;">⬅️ Back to Games</button>
          <h2 style="font-family:var(--font-heading); font-size:1.5rem; color:#8A2BE2;">🎙️ AI Voice Pronunciation</h2>
          <p style="color:#64748B; font-weight:600; margin-bottom:15px;">Tap mic & speak aloud!</p>

          <div style="background:white; border-radius:32px; padding:24px; box-shadow:0 12px 30px rgba(0,0,0,0.08); border:3px solid #F1F5F9; max-width:340px; margin:0 auto;">
            <div style="font-family:var(--font-heading); font-size:2rem; color:var(--primary-pink);">${item.letter} for ${item.word}</div>
            <div style="font-size:5.5rem; margin:10px 0; animation:pop 0.4s ease;">${item.emoji}</div>
            <div style="font-size:0.95rem; color:#64748B; font-weight:600; margin-bottom:15px;">${item.desc}</div>

            <div class="voice-status-box" id="gameVoiceBox" style="display:none; margin: 10px 0; padding: 10px; border-radius: 16px; background: #FFF0F5; border: 2px dashed #FF4785;">
              <div class="mic-pulse-icon" id="gameMicIcon">🎙️</div>
              <div id="gameVoiceText" style="font-family:var(--font-heading); font-size:0.95rem; color:#FF4785; font-weight:700;">
                Listening... Say "${item.word}"!
              </div>
            </div>

            <div style="display:flex; gap:10px; justify-content:center; margin-top:15px;">
              <button class="action-btn pink" id="btnPlaySound" style="width: auto; padding:12px 18px;">
                🔊 Listen
              </button>
              <button class="action-btn green" id="btnMicSpeak" style="width: auto; padding:12px 18px; background: linear-gradient(135deg, #8A2BE2 0%, #00D2FF 100%);">
                🎙️ Speak Now!
              </button>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; max-width:340px; margin:20px auto 0 auto;">
            <button class="pill-btn" id="btnPrevCard" ${currentIdx === 0 ? 'disabled style="opacity:0.5;"' : ''}>⬅️ Previous</button>
            <span style="font-family:var(--font-heading); font-weight:700; color:#8A2BE2;">${currentIdx + 1} / ${practiceList.length}</span>
            <button class="pill-btn" id="btnNextCard" ${currentIdx === practiceList.length - 1 ? 'disabled style="opacity:0.5;"' : ''}>Next ➡️</button>
          </div>
        </div>
      `;

      document.getElementById('btnBackToGames').addEventListener('click', () => renderLevel2Screen('games'));
      
      document.getElementById('btnPlaySound').addEventListener('click', () => {
        window.appAudio.speak(`${item.letter}. ${item.word}. ${item.desc}`);
      });

      document.getElementById('btnPrevCard').addEventListener('click', () => {
        if (currentIdx > 0) { currentIdx--; renderCard(); }
      });

      document.getElementById('btnNextCard').addEventListener('click', () => {
        if (currentIdx < practiceList.length - 1) { currentIdx++; renderCard(); }
      });

      document.getElementById('btnMicSpeak').addEventListener('click', () => {
        window.appAudio.stopSpeech();
        const box = document.getElementById('gameVoiceBox');
        const text = document.getElementById('gameVoiceText');
        const icon = document.getElementById('gameMicIcon');
        const btn = document.getElementById('btnMicSpeak');

        box.style.display = 'block';
        icon.className = 'mic-pulse-icon active';
        text.textContent = `Listening... Say "${item.word}"!`;
        btn.disabled = true;

        window.appAudio.startSpeechRecognition(item.word, (res) => {
          btn.disabled = false;
          icon.className = 'mic-pulse-icon';

          if (res.isMatch) {
            box.style.background = '#E8F5E9';
            box.style.borderColor = '#00E676';
            text.innerHTML = `✅ Perfect! You said "<b>${res.spokenText || item.word}</b>"! 🎉`;
            
            window.appAudio.triggerConfetti();
            addReward(10, 2);
            setMascotText(`Awesome! Sparky loved your pronunciation of ${item.word}! ⭐+2`);

          } else {
            box.style.background = '#FFFDE7';
            box.style.borderColor = '#FFD600';
            text.innerHTML = `💡 Heard "${res.spokenText || '...'}"! Let's practice saying "<b>${item.word}</b>"!`;
            
            window.appAudio.playGentleBoing();
            window.appAudio.speak(`Let's say ${item.word} together. ${item.word}!`);
          }
        });
      });
    }

    renderCard();
  }

  // 4. LEVEL 3: QUIZ & CHALLENGES
  function renderLevel3Screen() {
    setMascotText("Level 3: Answer questions to earn stars & crowns!");

    const questions = [
      { q: "What letter does 🍎 Apple start with?", opts: ["A", "B", "C"], ans: 0 },
      { q: "Which animal says Woof Woof?", opts: ["Cat 🐱", "Dog 🐶", "Duck 🦆"], ans: 1 },
      { q: "What should you do before eating?", opts: ["Wash Hands 🧼", "Watch TV 📺", "Run outside 🏃"], ans: 0 },
      { q: "What magic word do we say when asking for help?", opts: ["Please 🙏", "No 🚫", "Go away ❌"], ans: 0 },
      { q: "What color is a ripe banana?", opts: ["Blue 🔵", "Yellow 🟡", "Red 🔴"], ans: 1 }
    ];
    let qIdx = 0;
    let score = 0;

    function renderQuestion() {
      if (qIdx >= questions.length) {
        addReward(30, 6);
        unlockLevel(4);
        appContent.innerHTML = `
          <div style="padding:40px 20px; text-align:center;">
            <div style="font-size:5rem;">🏆</div>
            <h1 style="font-family:var(--font-heading); color:var(--primary-pink); font-size:2rem;">Quiz Completed!</h1>
            <p style="font-weight:700; font-size:1.2rem; margin:15px 0;">You scored ${score} out of ${questions.length}!</p>
            <button class="action-btn green" id="btnGoLvl4">🎉 Level 4 Creative Studio Unlocked!</button>
          </div>
        `;
        document.getElementById('btnGoLvl4').addEventListener('click', () => navigateTo('level4'));
        return;
      }

      const q = questions[qIdx];
      appContent.innerHTML = `
        <div class="screen-header">
          <h1>Level 3: Quiz Challenge 🏆</h1>
          <p>Question ${qIdx + 1} of ${questions.length}</p>
        </div>

        <div style="padding:20px;">
          <div class="flashcard-modal" style="max-width:100%;">
            <h2 style="font-family:var(--font-heading); font-size:1.5rem; color:#1E293B; margin-bottom:20px;">
              ${q.q}
            </h2>

            <div style="display:flex; flex-direction:column; gap:12px;">
              ${q.opts.map((opt, i) => `
                <button class="action-btn" data-idx="${i}" style="background:white; color:#1E293B; border:3px solid #E2E8F0; font-size:1.2rem;">
                  ${opt}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      appContent.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const chosen = parseInt(btn.dataset.idx);
          if (chosen === q.ans) {
            window.appAudio.playSuccessDing();
            score++;
            setMascotText("Superstar! Correct answer!");
          } else {
            window.appAudio.playGentleBoing();
            setMascotText("Good try! Keep going!");
          }
          qIdx++;
          setTimeout(renderQuestion, 1200);
        });
      });
    }

    renderQuestion();
  }

  // 5. LEVEL 4: CREATIVITY CANVAS
  function renderLevel4Screen() {
    setMascotText("Level 4: Express yourself with magic drawing & colorful stamps!");

    appContent.innerHTML = `
      <div class="screen-header">
        <h1>Level 4: Creative Studio 🎨</h1>
        <p>Draw, paint & add stickers!</p>
      </div>

      <div class="canvas-wrapper">
        <canvas id="paintCanvas" width="320" height="340"></canvas>
        <div class="canvas-toolbar">
          <div class="color-dot active" style="background:#FF4785;" data-color="#FF4785"></div>
          <div class="color-dot" style="background:#00D2FF;" data-color="#00D2FF"></div>
          <div class="color-dot" style="background:#FFD600;" data-color="#FFD600"></div>
          <div class="color-dot" style="background:#00E676;" data-color="#00E676"></div>
          <div class="color-dot" style="background:#8A2BE2;" data-color="#8A2BE2"></div>
          <div class="color-dot" style="background:#1E293B;" data-color="#1E293B"></div>
          
          <button class="pill-btn" id="btnClearCanvas" style="padding:6px 10px;">🗑️ Clear</button>
          <button class="pill-btn" id="btnSaveCanvas" style="padding:6px 10px;">💾 Save</button>
        </div>
      </div>
    `;

    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    function getCanvasCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDraw(e) {
      isDrawing = true;
      const coords = getCanvasCoords(e);
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }

    function draw(e) {
      if (!isDrawing) return;
      const coords = getCanvasCoords(e);
      ctx.strokeStyle = state.drawing.color;
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }

    function endDraw() {
      isDrawing = false;
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);

    canvas.addEventListener('touchstart', startDraw);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', endDraw);

    appContent.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        appContent.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        state.drawing.color = dot.dataset.color;
      });
    });

    document.getElementById('btnClearCanvas').addEventListener('click', () => {
      window.appAudio.playPop();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('btnSaveCanvas').addEventListener('click', () => {
      window.appAudio.playFanfare();
      addReward(15, 3);
      setMascotText("Drawing saved! You earned 15 coins!");
    });
  }

  // 6. PARENT DASHBOARD (SECURED BY MATH GATE)
  function renderParentDashboard() {
    setMascotText("Parent Zone: Track your child's learning statistics!");

    if (!state.parentUnlocked) {
      const n1 = Math.floor(Math.random() * 5) + 2;
      const n2 = Math.floor(Math.random() * 5) + 1;
      const ans = n1 + n2;

      appContent.innerHTML = `
        <div class="parent-dashboard">
          <div class="parent-gate">
            <h2>Grown-Ups Only 🔒</h2>
            <p style="color:#64748B; font-weight:600; margin-top:5px;">Please solve to verify you are a parent:</p>
            <div class="math-question">${n1} + ${n2} = ?</div>
            <input type="number" id="parentMathAns" class="math-input" placeholder="?" autocomplete="off" />
            <br>
            <button class="action-btn pink" id="btnVerifyParent">Verify & Enter Dashboard</button>
          </div>
        </div>
      `;

      document.getElementById('btnVerifyParent').addEventListener('click', () => {
        const val = parseInt(document.getElementById('parentMathAns').value);
        if (val === ans) {
          state.parentUnlocked = true;
          window.appAudio.playSuccessDing();
          renderParentDashboard();
        } else {
          window.appAudio.playGentleBoing();
          alert("Incorrect answer. Please try again!");
        }
      });
      return;
    }

    appContent.innerHTML = `
      <div class="parent-dashboard">
        <div class="screen-header" style="padding:0 0 15px 0;">
          <h1>Parent Dashboard 📊</h1>
          <p>Child Learning Progress & Controls</p>
        </div>

        <div class="stats-card-grid">
          <div class="stat-box">
            <div class="number">${state.stars}</div>
            <div class="label">Total Stars Earned</div>
          </div>
          <div class="stat-box">
            <div class="number">${state.coins}</div>
            <div class="label">Reward Coins</div>
          </div>
          <div class="stat-box">
            <div class="number">${state.unlockedLevels.length} / 4</div>
            <div class="label">Levels Unlocked</div>
          </div>
          <div class="stat-box">
            <div class="number">${state.screenTimeMinutes} m</div>
            <div class="label">Screen Time</div>
          </div>
        </div>

        <div style="background:white; border-radius:20px; padding:16px; margin-top:15px; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
          <h3 style="font-family:var(--font-heading); color:#1E293B;">Module Mastery Breakdown</h3>
          <p style="font-size:0.85rem; color:#64748B; margin-top:4px;">Alphabets A-Z: <strong>100%</strong></p>
          <p style="font-size:0.85rem; color:#64748B;">Object Names: <strong>85%</strong></p>
          <p style="font-size:0.85rem; color:#64748B;">Good Habits & Manners: <strong>90%</strong></p>
          <p style="font-size:0.85rem; color:#64748B;">Games Completed: <strong>7 Games</strong></p>
        </div>

        <button class="action-btn" id="btnResetProgress" style="background:#FF5252; color:white; margin-top:20px;">
          🔄 Reset All Progress & Coins
        </button>
      </div>
    `;

    document.getElementById('btnResetProgress').addEventListener('click', () => {
      if (confirm("Are you sure you want to reset learning progress?")) {
        localStorage.clear();
        state.coins = 50;
        state.stars = 12;
        state.unlockedLevels = [1];
        updateHeaderStats();
        state.parentUnlocked = false;
        navigateTo('home');
      }
    });
  }

  // 7. STICKER SHOP
  function renderStickerShop() {
    setMascotText("Sticker Shop: Use your earned coins to unlock cute stickers!");

    appContent.innerHTML = `
      <div class="screen-header">
        <h1>Sticker Book & Shop 🎨</h1>
        <p>Unlock cute badges with your coins!</p>
      </div>

      <div class="grid-container" style="grid-template-columns: 1fr 1fr;">
        ${window.appData.stickers.map(stk => `
          <div class="alpha-card" style="height:130px; text-align:center;">
            <div style="font-size:3rem;">${stk.emoji}</div>
            <div style="font-family:var(--font-heading); font-size:0.9rem;">${stk.name}</div>
            <button class="pill-btn ${stk.unlocked ? 'active' : ''}" data-stkid="${stk.id}" data-price="${stk.price}" style="margin-top:5px;">
              ${stk.unlocked ? 'Unlocked' : `🪙 ${stk.price}`}
            </button>
          </div>
        `).join('')}
      </div>
    `;

    appContent.querySelectorAll('[data-stkid]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.stkid;
        const price = parseInt(btn.dataset.price);
        const item = window.appData.stickers.find(s => s.id === id);

        if (item.unlocked) {
          setMascotText(`You already have the ${item.name} sticker!`);
          return;
        }

        if (state.coins >= price) {
          state.coins -= price;
          item.unlocked = true;
          updateHeaderStats();
          window.appAudio.playFanfare();
          btn.textContent = 'Unlocked';
          btn.classList.add('active');
          showAchievementModal("New Sticker Unlocked!", `You unlocked the ${item.emoji} ${item.name} sticker!`);
        } else {
          window.appAudio.playGentleBoing();
          setMascotText("Not enough coins! Play more games to earn coins!");
        }
      });
    });
  }

  // Achievement Celebration Modal
  function showAchievementModal(title, msg) {
    const modalHTML = `
      <div class="modal-overlay" id="achieveModal">
        <div class="flashcard-modal">
          <div style="font-size:5rem;">🌟</div>
          <h2 style="font-family:var(--font-heading); color:var(--primary-pink); font-size:1.8rem; margin:10px 0;">
            ${title}
          </h2>
          <p style="font-size:1rem; font-weight:600; color:#64748B; margin-bottom:20px;">
            ${msg}
          </p>
          <button class="action-btn green" id="btnCloseAchieve">Awesome! 🎉</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('btnCloseAchieve').addEventListener('click', () => {
      document.getElementById('achieveModal').remove();
    });
  }

  // Helper Utility: Array Shuffle
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Bubble Canvas Background Animation
  function initBubbleCanvas() {
    const canvas = document.getElementById('bubbleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const bubbles = Array.from({ length: 18 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 25 + 10,
      color: ['rgba(255,71,133,0.12)', 'rgba(0,210,255,0.12)', 'rgba(255,214,0,0.12)', 'rgba(138,43,226,0.12)'][Math.floor(Math.random() * 4)],
      speedY: Math.random() * 0.6 + 0.2
    }));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach(b => {
        b.y -= b.speedY;
        if (b.y < -50) b.y = canvas.height + 50;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // Initial Load
  updateHeaderStats();
  renderHomeScreen();
});
