const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const os = require('os');

// ─── Load .env ────────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const [k, ...v] = t.split('=');
    if (k) process.env[k.trim()] = v.join('=').trim();
  });
}

// ─── State ────────────────────────────────────────────────────────────────────
let rickState = {
  screenState: 'BORED',
  socialMediaTime: 0,
  secondsUntilFeed: 600,
  consecutiveNeglects: 0,
  groove: 80, vocal: 70, loyalty: 90,
  mood: 'IDLE',
  statusText: 'Never gonna give you up, buddy!',
  isMusicPlaying: false,
  isTyping: false,
  danceUntil: 0,
  // NEW: emotion & stuck tracking
  userEmotion: 'neutral',
  emotionWellness: 'good',
  stuckSince: null,
  stuckMinutes: 0,
  panicCount: 0,
  lastAdviceTime: 0,
};

let lastUpdateTime = Date.now();
let mainWindow = null;
let visionBusy = false;
let advisorBusy = false;

const MSG = {
  FLOW:       "Type type type! Inside we both know... +Loyalty",
  PANIC:      "OH NO! Never gonna let you down with this error! Let's fix it!",
  SLACKING:   "Watching videos? Don't run around and desert your project!",
  ANGRY:      "CLOSE THE TAB! You are letting me down!",
  STUDIOUS:   "Research! Documentation is key! +Vocal",
  BORED:      "Never gonna give you up, but give me something to do!",
  MUSIC:      "Never gonna stop grooving to this beat! 🎵",
  QUARANTINE: "RICKROLL QUARANTINE! NEVER GONNA LET YOU VIEW THIS!",
  DESERTED:   "You gave me up... I ran around and deserted you. Bye.",
  NEGLECT:    "I feel neglected! Feed me tea or vinyl records!"
};

// ─── AI Advisor via spawn+stdin (avoids Windows shell arg encoding issues) ────
function runAdvisor(trigger) {
  if (advisorBusy) return;
  // Rate limiting: manual=10s, auto=90s
  const rateLimit = trigger === 'manual' ? 10000 : 90000;
  if (Date.now() - rickState.lastAdviceTime < rateLimit) return;

  advisorBusy = true;
  const script = path.join(__dirname, 'ai_advisor.py');
  const ctx = JSON.stringify({
    emotion:       rickState.userEmotion,
    screen_state:  rickState.screenState,
    stuck_minutes: rickState.stuckMinutes,
    trigger,
    stats: { groove: rickState.groove, vocal: rickState.vocal, loyalty: rickState.loyalty }
  });

  let output = '', errOutput = '';
  const proc = spawn('python', [script], { env: process.env });
  proc.stdin.write(ctx);
  proc.stdin.end();
  proc.stdout.on('data', d => { output += d.toString(); });
  proc.stderr.on('data', d => { errOutput += d.toString(); });
  proc.on('close', code => {
    advisorBusy = false;
    const advice = output.trim();
    console.log('[Advisor] trigger=%s code=%d advice=%s err=%s', trigger, code, advice.slice(0,60), errOutput.slice(0,80));
    if (advice && mainWindow && !mainWindow.isDestroyed()) {
      rickState.statusText = advice;
      rickState.lastAdviceTime = Date.now();
      mainWindow.webContents.send('state-update', rickState);
    }
  });
  proc.on('error', err => {
    advisorBusy = false;
    console.error('[Advisor] spawn error:', err.message);
  });
}

// ─── Decay ────────────────────────────────────────────────────────────────────
function decayStats(sec) {
  if (rickState.mood === 'DESERTED') return;
  rickState.secondsUntilFeed -= sec;
  if (rickState.secondsUntilFeed <= 0) {
    rickState.consecutiveNeglects++;
    rickState.loyalty = Math.max(0, rickState.loyalty - 25);
    rickState.secondsUntilFeed = 600;
    if (rickState.consecutiveNeglects >= 4 || rickState.loyalty <= 0) {
      rickState.mood = 'DESERTED'; rickState.statusText = MSG.DESERTED; return;
    }
    rickState.statusText = MSG.NEGLECT;
  }
  const m = rickState.consecutiveNeglects > 0 ? 2 : 1;
  if (rickState.isMusicPlaying)
    rickState.groove = Math.min(100, rickState.groove + 0.33 * sec);
  else
    rickState.groove = Math.max(0, rickState.groove - 0.16 * sec * m);
  rickState.vocal   = Math.max(0, rickState.vocal   - 0.08 * sec * m);
  rickState.loyalty = Math.max(0, rickState.loyalty - 0.04 * sec * m);
  if (rickState.loyalty <= 0) { rickState.mood = 'DESERTED'; rickState.statusText = MSG.DESERTED; }
}

// ─── Fast check: typing + music ──────────────────────────────────────────────
const FAST_CHECK_PY = path.join(__dirname, 'fast_check.py');
function fastCheck() {
  return new Promise(resolve => {
    exec(`python "${FAST_CHECK_PY}"`, { timeout: 8000 }, (err, stdout) => {
      try {
        const r = JSON.parse((stdout || '').trim());
        resolve({ typing: !!r.typing, music: !!r.music });
      } catch { resolve({ typing: false, music: false }); }
    });
  });
}

// ─── Screen Vision ────────────────────────────────────────────────────────────
function runScreenVision() {
  return new Promise(resolve => {
    const s = path.join(__dirname, '..', 'src', 'modules', 'meme', 'screen_vision.py');
    exec(`python "${s}"`, { env: process.env, timeout: 35000 }, (err, stdout) => {
      let state = 'BORED', music = null;
      (stdout || '').trim().split('\n').forEach(l => {
        const line = l.trim();
        if (line.startsWith('STATE:')) state = line.slice(6).trim();
        if (line.startsWith('MUSIC:')) music = line.slice(6).trim() === 'TRUE';
      });
      resolve({ state, music });
    });
  });
}

// ─── Apply combined state ─────────────────────────────────────────────────────
let flowTipTimer = null;

function applyAll(screenState, musicPlaying, isTyping) {
  rickState.screenState    = screenState;
  rickState.isMusicPlaying = musicPlaying;
  rickState.isTyping       = isTyping;

  // Track stuck in PANIC
  if (screenState === 'PANIC') {
    if (!rickState.stuckSince) {
      rickState.stuckSince = Date.now();
      // Immediate first-time PANIC response
      rickState.statusText = MSG.PANIC;
      runAdvisor('panic_first');
    }
    rickState.stuckMinutes = Math.floor((Date.now() - rickState.stuckSince) / 60000);
    rickState.panicCount++;
    // After 3+ min stuck → proactive deeper tip
    if (rickState.stuckMinutes >= 3) runAdvisor('error_stuck');
    // Stop FLOW tip timer when in PANIC
    if (flowTipTimer) { clearInterval(flowTipTimer); flowTipTimer = null; }
  } else {
    if (rickState.panicCount > 0 && screenState === 'FLOW') {
      rickState.statusText = "🎉 Error fixed! Never gonna let you down again! +Loyalty";
      rickState.loyalty = Math.min(100, rickState.loyalty + 5);
    }
    rickState.stuckSince = null; rickState.stuckMinutes = 0; rickState.panicCount = 0;
  }

  // FLOW periodic tips (every 8 minutes of coding)
  if (screenState === 'FLOW' && !flowTipTimer) {
    flowTipTimer = setInterval(() => {
      if (rickState.screenState === 'FLOW') {
        runAdvisor('flow_tip');
      } else {
        clearInterval(flowTipTimer); flowTipTimer = null;
      }
    }, 8 * 60 * 1000);
  }
  if (screenState !== 'FLOW' && flowTipTimer) {
    clearInterval(flowTipTimer); flowTipTimer = null;
  }

  // 1. Music → dance (top priority over everything except quarantine/deserted)
  if (musicPlaying && !['QUARANTINE', 'DESERTED'].includes(rickState.mood)) {
    rickState.mood = 'DANCING'; rickState.statusText = MSG.MUSIC; return;
  }
  if (!musicPlaying && rickState.mood === 'DANCING' && Date.now() > rickState.danceUntil) {
    rickState.mood = 'IDLE';
  }

  // 2. NSFW
  if (screenState === 'ADULT') {
    rickState.mood = 'QUARANTINE'; rickState.statusText = MSG.QUARANTINE;
    rickState.socialMediaTime = 0; return;
  }
  if (['QUARANTINE', 'DESERTED'].includes(rickState.mood)) return;

  // 3. Slacking
  if (screenState === 'SLACKING') {
    rickState.socialMediaTime += 15; rickState.isTyping = false;
    if (rickState.socialMediaTime >= 120) {
      rickState.mood = 'ANGRY'; rickState.statusText = MSG.ANGRY;
      rickState.loyalty = Math.max(0, rickState.loyalty - 10);
    } else {
      if (rickState.mood !== 'ANGRY') rickState.mood = 'IDLE';
      rickState.statusText = MSG.SLACKING;
    }
    return;
  }

  rickState.socialMediaTime = Math.max(0, rickState.socialMediaTime - 15);
  if (rickState.mood === 'ANGRY' && rickState.socialMediaTime === 0) {
    rickState.mood = 'IDLE'; rickState.statusText = "Welcome back! Let's get to work!";
  }

  // 4. Productive states
  switch (screenState) {
    case 'FLOW':
      rickState.isTyping = true;
      if (!['TIRED','ANGRY','DANCING'].includes(rickState.mood)) rickState.mood = 'IDLE';
      rickState.statusText = MSG.FLOW; rickState.loyalty = Math.min(100, rickState.loyalty + 1); break;
    case 'PANIC':
      rickState.isTyping = true;
      if (!['TIRED','ANGRY','DANCING'].includes(rickState.mood)) rickState.mood = 'IDLE';
      rickState.statusText = MSG.PANIC; rickState.groove = Math.max(0, rickState.groove - 5); break;
    case 'STUDIOUS':
      if (!['TIRED','ANGRY','DANCING'].includes(rickState.mood)) rickState.mood = 'IDLE';
      rickState.statusText = MSG.STUDIOUS; rickState.vocal = Math.min(100, rickState.vocal + 2); break;
    default:
      if (!['TIRED','ANGRY','DANCING'].includes(rickState.mood)) rickState.mood = 'IDLE';
      rickState.statusText = MSG.BORED;
  }

  // 5. Emotional wellness overrides
  if (rickState.userEmotion === 'tired' && rickState.emotionWellness !== 'good') {
    rickState.statusText = "You look tired! Never gonna let you burn out — take a break! 🍵";
  } else if (rickState.userEmotion === 'stressed' || rickState.userEmotion === 'frustrated') {
    rickState.statusText = "Looking stressed! Deep breath — never gonna give up on you!";
  }
}

// ─── IPC ─────────────────────────────────────────────────────────────────────
function setupIPC() {
  ipcMain.on('set-ignore-mouse', (_, ignore) => {
    if (mainWindow && !mainWindow.isDestroyed())
      mainWindow.setIgnoreMouseEvents(ignore, { forward: true });
  });

  ipcMain.handle('get-state', () => {
    const now = Date.now(), el = (now - lastUpdateTime) / 1000;
    lastUpdateTime = now; decayStats(el);
    return rickState;
  });

  ipcMain.handle('feed', (_, item) => {
    if (rickState.mood === 'DESERTED') return rickState;
    rickState.secondsUntilFeed = 600; rickState.consecutiveNeglects = 0;
    if (item === 'Ginger Tea') {
      rickState.vocal = Math.min(100, rickState.vocal + 35);
      rickState.statusText = 'Ah, warm tea! My vocal cords sing high notes!';
    } else if (item === 'Vinyl Record') {
      rickState.groove = Math.min(100, rickState.groove + 30);
      rickState.danceUntil = Date.now() + 30000; rickState.mood = 'DANCING';
      rickState.statusText = "Spinning those 80s records! Let's dance!";
    }
    return rickState;
  });

  ipcMain.handle('dance', () => {
    if (rickState.mood === 'DESERTED') return { ok: false, state: rickState };
    if (rickState.vocal < 15) return { ok: false, state: rickState };
    rickState.secondsUntilFeed = 600; rickState.consecutiveNeglects = 0;
    rickState.groove = Math.min(100, rickState.groove + 30);
    rickState.vocal  = Math.max(0, rickState.vocal - 15);
    rickState.danceUntil = Date.now() + 20000; rickState.mood = 'DANCING';
    rickState.statusText = '*Does the iconic sideways slide* We know the game!';
    return { ok: true, state: rickState };
  });

  ipcMain.handle('solve-captcha', (_, word) => {
    if (word.toLowerCase().trim() === 'give') {
      rickState.mood = 'IDLE'; rickState.screenState = 'BORED';
      rickState.secondsUntilFeed = 600; rickState.consecutiveNeglects = 0;
      rickState.statusText = 'Unlocked! Thanks for staying loyal.';
      return { ok: true, state: rickState };
    }
    return { ok: false, state: rickState };
  });

  ipcMain.handle('drag-reward', () => {
    rickState.groove = Math.min(100, rickState.groove + 10);
    rickState.secondsUntilFeed = Math.min(600, rickState.secondsUntilFeed + 30);
    return rickState;
  });

  // Camera emotion: receives base64 JPEG from renderer, saves temp, runs camera_emotion.py
  ipcMain.handle('update-emotion', (_, result) => {
    if (result && result.face_detected) {
      rickState.userEmotion     = result.emotion     || 'neutral';
      rickState.emotionWellness = result.wellness    || 'good';
      // Auto-advice for critical wellness
      if (result.wellness === 'critical') runAdvisor('emotion_critical');
      else if (result.wellness === 'warning') runAdvisor('emotion_warning');
    }
    return rickState;
  });

  // Manual AI advice call from renderer
  ipcMain.handle('get-advice', (_, trigger) => {
    runAdvisor(trigger || 'manual');
    return { queued: true };
  });
}

// ─── Window ───────────────────────────────────────────────────────────────────
function createWindow() {
  const { width: SW, height: SH } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: SW, height: SH, x: 0, y: 0,
    frame: false, transparent: true,
    backgroundColor: '#00000000',
    alwaysOnTop: true, skipTaskbar: true,
    resizable: false, hasShadow: false,
    webPreferences: {
      nodeIntegration: false, contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.setIgnoreMouseEvents(true, { forward: true });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('screen-size', { w: SW, h: SH });
    mainWindow.webContents.executeJavaScript(`
      document.addEventListener('mousemove', function(e) {
        var el = document.elementFromPoint(e.clientX, e.clientY);
        var hit = el && el.id !== 'transparent-root'
                     && el !== document.documentElement
                     && el !== document.body;
        window.rickAPI.setIgnoreMouse(!hit);
      });
    `);
  });

  // fast check every 4s (typing + music via Python ctypes)
  let fastBusy = false;
  setInterval(async () => {
    if (!mainWindow || mainWindow.isDestroyed() || fastBusy) return;
    fastBusy = true;
    try {
      const { typing, music } = await fastCheck();
      const prevTyping = rickState.isTyping;
      const prevMusic  = rickState.isMusicPlaying;

      if (music !== prevMusic) {
        rickState.isMusicPlaying = music;
        if (music && !['QUARANTINE','DESERTED'].includes(rickState.mood)) {
          rickState.mood = 'DANCING'; rickState.statusText = MSG.MUSIC;
        } else if (!music && rickState.mood === 'DANCING' && Date.now() > rickState.danceUntil) {
          rickState.mood = 'IDLE'; rickState.statusText = MSG.BORED;
        }
      }
      if (!music) {
        rickState.isTyping = typing;
        // First time entering typing mode → show acknowledgement bubble
        if (typing && !prevTyping) {
          const CODING_MSGS = [
            "I see you coding! Never gonna let you down! 💻",
            "In the zone! *does a little dance* Keep going!",
            "Look at you go! We know the game and we're gonna play it! 🎵",
            "Code time! Never gonna run around and desert this project! 💪",
          ];
          rickState.statusText = CODING_MSGS[Math.floor(Math.random() * CODING_MSGS.length)];
        } else if (!typing && prevTyping) {
          rickState.statusText = MSG.BORED;
        }
      }

      const changed = (typing !== prevTyping) || (music !== prevMusic);
      if (changed && mainWindow && !mainWindow.isDestroyed())
        mainWindow.webContents.send('state-update', rickState);
    } catch(e) { console.error('[fastCheck] error:', e.message); }
    fastBusy = false;
  }, 4000);


  // Screen vision every 20s
  setInterval(async () => {
    if (!mainWindow || mainWindow.isDestroyed() || rickState.mood === 'DESERTED' || visionBusy) return;
    visionBusy = true;
    try {
      const [fc, vision] = await Promise.all([fastCheck(), runScreenVision()]);
      const music = vision.music !== null ? vision.music : fc.music;
      applyAll(vision.state, music, fc.typing);
    } catch(e) {}
    visionBusy = false;
    if (mainWindow && !mainWindow.isDestroyed())
      mainWindow.webContents.send('state-update', rickState);
  }, 20000);

  // Stat tick + dance expiry every 5s
  setInterval(() => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    const now = Date.now(), el = (now - lastUpdateTime) / 1000;
    lastUpdateTime = now; decayStats(el);
    if (rickState.mood === 'DANCING' && !rickState.isMusicPlaying && Date.now() > rickState.danceUntil)
      rickState.mood = 'IDLE';
    mainWindow.webContents.send('state-update', rickState);
  }, 5000);
}

app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disable-gpu-cache');
app.commandLine.appendSwitch('disable-http-cache');

app.whenReady().then(() => { setupIPC(); createWindow(); });
app.on('window-all-closed', () => app.quit());