'use client';

import { useEffect, useState } from 'react';
import RickGotchi from '../../RickGotchi';

interface RickState {
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

const DEFAULT_STATE: RickState = {
  screenState: 'BORED',
  socialMediaTime: 0,
  secondsUntilFeed: 600,
  consecutiveNeglects: 0,
  groove: 80,
  vocal: 70,
  loyalty: 90,
  mood: 'DANCING',
  statusText: 'Never gonna give you up, buddy!',
  isMusicPlaying: false,
};

export default function RickGotchiPage() {
  const [state, setState] = useState<RickState>(DEFAULT_STATE);

  useEffect(() => {
    // Read initial props injected by NitroStack via the URL hash or search params
    const tryParse = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const raw = params.get('props') || params.get('data');
        if (raw) {
          setState({ ...DEFAULT_STATE, ...JSON.parse(decodeURIComponent(raw)) });
          return;
        }
        const hash = window.location.hash.slice(1);
        if (hash) {
          setState({ ...DEFAULT_STATE, ...JSON.parse(decodeURIComponent(hash)) });
        }
      } catch {
        // keep defaults
      }
    };

    tryParse();

    // Listen for prop updates posted by the NitroStudio parent frame
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NITROSTACK_PROPS' || event.data?.props) {
        const incoming = event.data.props ?? event.data;
        setState(prev => ({ ...prev, ...incoming }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'transparent',
    }}>
      <RickGotchi {...state} />
    </div>
  );
}
