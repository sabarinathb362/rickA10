'use client';
import React, { useState, useEffect, useRef } from 'react';

interface RickGotchiProps {
  screenState: 'FLOW' | 'PANIC' | 'SLACKING' | 'STUDIOUS' | 'BORED' | 'ADULT';
  socialMediaTime: number;
  secondsUntilFeed: number;
  consecutiveNeglects: number;
  groove: number;
  vocal: number;
  loyalty: number;
  mood: 'DANCING' | 'TIRED' | 'ANGRY' | 'QUARANTINE' | 'DESERTED';
  statusText: string;
  isMusicPlaying: boolean;
}

// Maps mood + screenState to a sprite image
function getSpriteSrc(
  mood: RickGotchiProps['mood'],
  screenState: RickGotchiProps['screenState'],
  isMusicPlaying: boolean,
  isDragging: boolean
): string {
  if (mood === 'DESERTED') return '/rick/deserted.png';
  if (mood === 'QUARANTINE') return '/rick/quarantine.png';
  if (mood === 'ANGRY') return '/rick/angry.png';
  if (mood === 'TIRED') return '/rick/tired.png';
  if (screenState === 'STUDIOUS') return '/rick/studious.png';
  // DANCING / FLOW / BORED / PANIC / SLACKING / music → dancing
  return '/rick/dancing.png';
}

function getAnimationClass(
  mood: RickGotchiProps['mood'],
  isMusicPlaying: boolean,
  isDragging: boolean
): string {
  if (isDragging) return 'rick-spin';
  if (isMusicPlaying || mood === 'DANCING') return 'rick-bounce';
  if (mood === 'ANGRY') return 'rick-shake';
  if (mood === 'TIRED') return 'rick-sway';
  return '';
}

export default function RickGotchi({
  screenState,
  socialMediaTime,
  secondsUntilFeed,
  consecutiveNeglects,
  groove,
  vocal,
  loyalty,
  mood,
  statusText,
  isMusicPlaying,
}: RickGotchiProps) {
  const [localTimeLeft, setLocalTimeLeft] = useState(secondsUntilFeed);
  const [captchaInput, setCaptchaInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragQuote, setDragQuote] = useState<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => { setLocalTimeLeft(secondsUntilFeed); }, [secondsUntilFeed]);

  useEffect(() => {
    if (mood === 'DESERTED' || mood === 'QUARANTINE') return;
    const interval = setInterval(() => setLocalTimeLeft(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(interval);
  }, [mood]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const triggerAction = (action: string, param?: string) => {
    window.parent.postMessage({
      type: 'WIDGET_ACTION',
      action: param ? `${action} with ${param}` : action,
    }, '*');
  };

  const submitCaptcha = () => {
    window.parent.postMessage({ type: 'WIDGET_ACTION', action: `Solve lyric captcha with word: ${captchaInput}` }, '*');
    setCaptchaInput('');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mood === 'DESERTED' || mood === 'QUARANTINE') return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    setDragQuote('Whoa! Never gonna let you drop me!');
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: Math.min(Math.max(e.clientX - dragStart.current.x, -80), 80),
      y: Math.min(Math.max(e.clientY - dragStart.current.y, -60), 60),
    });
  };
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    setDragQuote('Landed safely! Never gonna give you up!');
    triggerAction('feedRick', 'Vinyl Record');
    setTimeout(() => setDragQuote(null), 2000);
  };

  const spriteSrc = getSpriteSrc(mood, screenState, isMusicPlaying, isDragging);
  const animClass = getAnimationClass(mood, isMusicPlaying, isDragging);

  const lcdBg = mood === 'ANGRY' ? '#f38ba8'
    : isMusicPlaying ? '#cba6f7'
    : consecutiveNeglects > 0 ? '#f9e2af'
    : '#a6e3a1';

  // ── QUARANTINE OVERLAY ──────────────────────────────────────────────────────
  if (mood === 'QUARANTINE') {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#0a0512', zIndex: 99999,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: 20, textAlign: 'center',
        border: '8px solid #ff0055', boxSizing: 'border-box', fontFamily: 'monospace',
      }}>
        <div style={{
          width: '100%', background: '#ef4444', color: '#fff', padding: '12px 0',
          fontWeight: 'bold', fontSize: 18, animation: 'sirenFlash 0.4s infinite alternate',
          marginBottom: 20, letterSpacing: 2, borderBottom: '4px solid #fff',
        }}>
          🚨 PROHIBITED SITE DETECTED by RICKGUARD 🚨
        </div>

        <img
          src={spriteSrc} alt="Rick blocking"
          style={{ width: 180, height: 180, objectFit: 'contain', filter: 'drop-shadow(0 0 20px #ff0055)', animation: 'sirenFlash 0.6s infinite alternate' }}
        />

        <h2 style={{ fontSize: 18, color: '#39ff14', margin: '16px 0 8px', textShadow: '0 0 8px #39ff14' }}>
          NEVER GONNA LET YOU VIEW THIS!
        </h2>
        <p style={{ fontSize: 12, color: '#a6adc8', maxWidth: 360, lineHeight: 1.5, marginBottom: 20 }}>
          Close the prohibited tab and fill in the missing lyric to restore access:
        </p>

        <div style={{ background: '#110c1f', padding: 16, borderRadius: 12, border: '2px solid #ff0055', width: 280 }}>
          <div style={{ fontSize: 12, color: '#fff', marginBottom: 10 }}>
            "Never gonna <span style={{ color: '#ff0055', fontWeight: 'bold' }}>_____</span> you up"
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <input value={captchaInput} onChange={e => setCaptchaInput(e.target.value)}
              placeholder="word..." onKeyDown={e => e.key === 'Enter' && submitCaptcha()}
              style={{ padding: 8, borderRadius: 6, border: '2px solid #89b4fa', background: '#181825', color: '#fff', width: 100, textAlign: 'center', outline: 'none' }}
            />
            <button onClick={submitCaptcha}
              style={{ padding: '8px 16px', background: '#ff0055', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 10px #ff0055' }}>
              UNLOCK
            </button>
          </div>
        </div>
        <Style />
      </div>
    );
  }

  // ── DESERTED ────────────────────────────────────────────────────────────────
  if (mood === 'DESERTED') {
    return (
      <div style={{
        position: 'fixed', bottom: 16, right: 16, zIndex: 9999,
        background: '#181825', border: '4px solid #313244', borderRadius: 20,
        padding: 20, textAlign: 'center', fontFamily: 'monospace', color: '#f38ba8',
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)', width: 220,
      }}>
        <img src={spriteSrc} alt="Rick leaving"
          style={{ width: 120, height: 120, objectFit: 'contain', opacity: 0.6, filter: 'grayscale(60%)' }} />
        <h3 style={{ fontSize: 14, margin: '10px 0 6px' }}>⚠️ DESERTED ⚠️</h3>
        <p style={{ fontSize: 11, color: '#a6adc8', lineHeight: 1.4 }}>"{statusText}"</p>
        <Style />
      </div>
    );
  }

  // ── NORMAL TAMAGOTCHI (corner-pinned) ───────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', bottom: 16, right: 16, zIndex: 9999,
      fontFamily: '"Courier New", Courier, monospace',
      userSelect: 'none',
    }}>
      {/* Tamagotchi casing */}
      <div style={{
        background: 'linear-gradient(160deg, #ff9eb8 0%, #ff4b86 100%)',
        border: '5px solid #4a0422',
        borderRadius: 28,
        boxShadow: '0 8px 0 #280212, 0 14px 28px rgba(0,0,0,0.5)',
        padding: 14,
        width: 220,
        animation: mood === 'ANGRY' ? 'rickShake 0.4s infinite' : 'none',
      }}>
        {/* LCD Screen */}
        <div style={{
          background: lcdBg,
          borderRadius: 14,
          border: '4px solid #11111b',
          padding: '10px 10px 8px',
          transition: 'background 0.5s ease',
          boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.25)',
          position: 'relative',
          minHeight: 180,
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, fontWeight: 'bold', color: '#11111b', marginBottom: 4 }}>
            <span>RICK_GOTCHI v1.0</span>
            <span style={{ animation: consecutiveNeglects > 0 || isMusicPlaying ? 'lcdFlash 0.5s infinite alternate' : 'none' }}>
              {isMusicPlaying ? '⚡MUSIC' : consecutiveNeglects > 0 ? '⚠ NEGLECTED' : '● ACTIVE'}
            </span>
          </div>

          {/* Rick sprite */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: isDragging ? 'grabbing' : 'grab',
              transform: `translate(${position.x}px, ${position.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
            }}
          >
            <img
              src={spriteSrc}
              alt={`Rick ${mood}`}
              className={animClass}
              style={{
                width: 100, height: 100,
                objectFit: 'contain',
                imageRendering: 'pixelated',
                filter: mood === 'TIRED' ? 'brightness(0.7) saturate(0.5)' : 'none',
              }}
              draggable={false}
            />
          </div>

          {/* Status dialogue */}
          <div style={{ fontSize: 10, borderTop: '1px dashed #11111b', paddingTop: 5, fontStyle: 'italic', color: '#11111b', lineHeight: 1.3, minHeight: 28 }}>
            "{dragQuote || statusText}"
          </div>

          {/* Feed timer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, borderTop: '1px solid #11111b', paddingTop: 4, marginTop: 4, color: '#11111b' }}>
            <span>FEED DUE:</span>
            <span style={{ fontWeight: 'bold', color: localTimeLeft < 60 ? '#ef4444' : '#11111b' }}>
              {formatTime(localTimeLeft)}
            </span>
          </div>
        </div>

        {/* Stat bars */}
        <div style={{ margin: '10px 0 8px', background: 'rgba(0,0,0,0.25)', padding: '8px 10px', borderRadius: 8, fontSize: 9, color: '#fff', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            { label: 'Groove', val: groove, color: '#a6e3a1' },
            { label: 'Vocals', val: vocal,  color: '#89b4fa' },
            { label: 'Loyalty', val: loyalty, color: '#f38ba8' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 40 }}>{label}</span>
              <div style={{ flex: 1, height: 7, background: '#313244', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${val}%`, height: '100%', background: color, transition: 'width 0.5s ease', borderRadius: 4 }} />
              </div>
              <span style={{ width: 24, textAlign: 'right' }}>{Math.round(val)}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {[
            { emoji: '🍵', title: 'Ginger Tea → Vocals', action: () => triggerAction('feedRick', 'Ginger Tea'), color: '#ffdd33' },
            { emoji: '🎵', title: 'Vinyl Record → Groove', action: () => triggerAction('feedRick', 'Vinyl Record'), color: '#ffdd33' },
            { emoji: '🕺', title: 'Dance! → resets feed timer', action: () => triggerAction('makeRickDance'), color: '#39ff14' },
          ].map(({ emoji, title, action, color }) => (
            <button key={emoji} onClick={action} title={title}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: color, color: '#11111b',
                border: '3px solid #4a0422', boxShadow: '0 3px 0 #280212',
                cursor: 'pointer', fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.1s', fontFamily: 'inherit',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'translateY(2px)')}
              onMouseUp={e => (e.currentTarget.style.transform = '')}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      <Style />
    </div>
  );
}

function Style() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes rickBounce {
        0%   { transform: translateY(0) scale(1); }
        50%  { transform: translateY(-8px) scale(1.06); }
        100% { transform: translateY(0) scale(1); }
      }
      @keyframes rickShake {
        0%   { transform: translate(0, 0) rotate(0deg); }
        25%  { transform: translate(-3px, 1px) rotate(-2deg); }
        75%  { transform: translate(3px, -1px) rotate(2deg); }
        100% { transform: translate(0, 0) rotate(0deg); }
      }
      @keyframes rickSway {
        0%   { transform: rotate(-3deg); }
        100% { transform: rotate(3deg); }
      }
      @keyframes rickSpin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes lcdFlash {
        from { opacity: 1; }
        to   { opacity: 0.3; }
      }
      @keyframes sirenFlash {
        from { background: #ef4444; }
        to   { background: #990000; }
      }
      .rick-bounce { animation: rickBounce 0.7s ease-in-out infinite; }
      .rick-shake  { animation: rickShake 0.35s linear infinite; }
      .rick-sway   { animation: rickSway 1.5s ease-in-out infinite alternate; }
      .rick-spin   { animation: rickSpin 0.5s linear infinite; }
    ` }} />
  );
}
