import { ToolDecorator as Tool, Widget, z, ExecutionContext } from '@nitrostack/core';
import { exec } from 'child_process';
import * as path from 'path';

interface RickState {
  screenState: 'FLOW' | 'PANIC' | 'SLACKING' | 'STUDIOUS' | 'BORED' | 'ADULT';
  socialMediaTime: number; // in seconds
  secondsUntilFeed: number; // 10-minute feed cycle (600 seconds)
  consecutiveNeglects: number;
  groove: number; // 0-100
  vocal: number; // 0-100
  loyalty: number; // 0-100
  mood: 'DANCING' | 'TIRED' | 'ANGRY' | 'QUARANTINE' | 'DESERTED';
  statusText: string;
  isMusicPlaying: boolean;
}

// Global in-memory state for RickGotchi
let rickState: RickState = {
  screenState: 'BORED',
  socialMediaTime: 0,
  secondsUntilFeed: 600, // 10 minutes default
  consecutiveNeglects: 0,
  groove: 80,
  vocal: 70,
  loyalty: 90,
  mood: 'DANCING',
  statusText: "Never gonna give you up, buddy!",
  isMusicPlaying: false
};

export class RickGotchiTools {
  private decayStats(secondsElapsed: number) {
    if (rickState.mood === 'DESERTED') return;

    // 1. Countdown the feed timer
    rickState.secondsUntilFeed -= secondsElapsed;
    
    // Check if feed cycle was missed
    if (rickState.secondsUntilFeed <= 0) {
      rickState.consecutiveNeglects += 1;
      rickState.loyalty = Math.max(0, rickState.loyalty - 25);
      rickState.secondsUntilFeed = 600; // Reset timer for the next cycle
      
      if (rickState.consecutiveNeglects >= 4 || rickState.loyalty <= 0) {
        rickState.mood = 'DESERTED';
        rickState.statusText = "You gave me up... I ran around and deserted you. Bye.";
        return;
      }
      
      rickState.statusText = "🚨 I feel neglected! Feed me tea or records before I desert you!";
    }

    // Double the decay if neglected
    const multiplier = rickState.consecutiveNeglects > 0 ? 2 : 1;

    // 2. Natural decay of stats (or groove boost if music is playing)
    if (rickState.isMusicPlaying) {
      rickState.groove = Math.min(100, rickState.groove + (0.33 * secondsElapsed)); // Boost by ~10% per 30s
    } else {
      rickState.groove = Math.max(0, rickState.groove - (0.16 * secondsElapsed * multiplier)); // ~5% per 30s
    }
    rickState.vocal = Math.max(0, rickState.vocal - (0.10 * secondsElapsed * multiplier));  // ~3% per 30s
    rickState.loyalty = Math.max(0, rickState.loyalty - (0.10 * secondsElapsed * multiplier)); // ~3% per 30s

    // Check for depletion rules
    if (rickState.loyalty <= 0) {
      rickState.mood = 'DESERTED';
      rickState.statusText = "You gave me up... I ran around and deserted you. Bye.";
    } else if (rickState.mood !== 'QUARANTINE' && rickState.mood !== 'ANGRY') {
      if (rickState.vocal < 20 || rickState.groove < 20) {
        rickState.mood = 'TIRED';
        if (rickState.consecutiveNeglects > 0) {
          rickState.statusText = "So neglected... too weak to dance.";
        } else {
          rickState.statusText = "Need some tea or a record... too tired to groove.";
        }
      } else {
        rickState.mood = 'DANCING';
      }
    }
  }

  @Tool({
    name: 'check_rick_status',
    description: 'Check the status, stats, and mood of your Rick Astley AI pet.',
    inputSchema: z.object({})
  })
  @Widget('rick-gotchi')
  async checkRickStatus(ctx: ExecutionContext) {
    this.decayStats(30); // Simulate 30s step
    return {
      status: 'success',
      data: rickState,
      widget: {
        name: 'RickGotchi',
        props: { ...rickState }
      }
    };
  }

  @Tool({
    name: 'sync_screen_vision',
    description: 'Polls the screen state using Gemini Vision and updates RickGotchi.',
    inputSchema: z.object({})
  })
  @Widget('rick-gotchi')
  async syncScreenVision(ctx: ExecutionContext) {
    this.decayStats(30); // Simulate 30s step

    if (rickState.mood === 'DESERTED') {
      return {
        status: 'deserted',
        data: rickState,
        widget: { name: 'RickGotchi', props: { ...rickState } }
      };
    }

    return new Promise((resolve) => {
      // Execute the python script to analyze the screen
      const scriptPath = path.join(__dirname, 'screen_vision.py');
      exec(`python "${scriptPath}"`, (error, stdout) => {
        let detected: RickState['screenState'] = 'BORED';
        let musicPlaying = false;

        const lines = stdout.trim().split('\n');
        for (const line of lines) {
          if (line.startsWith('STATE:')) {
            detected = line.substring(6).trim() as RickState['screenState'];
          } else if (line.startsWith('MUSIC:')) {
            musicPlaying = line.substring(6).trim() === 'TRUE';
          }
        }

        rickState.screenState = detected;
        rickState.isMusicPlaying = musicPlaying;

        // 1. Quarantine Trigger (Prohibited Content)
        if (rickState.screenState === 'ADULT') {
          rickState.mood = 'QUARANTINE';
          rickState.statusText = '🚨 BLOCKOUT! Never gonna let you view this! 🚨';
          rickState.socialMediaTime = 0;
        }
        // 2. Slacking Aggro Meter
        else if (rickState.screenState === 'SLACKING') {
          rickState.socialMediaTime += 30;
          if (rickState.socialMediaTime >= 120) { // 2 minutes slacking
            rickState.mood = 'ANGRY';
            rickState.statusText = '⚠️ CLOSE THE TAB! You are running around and deserting your task!';
            rickState.loyalty = Math.max(0, rickState.loyalty - 10);
          } else {
            rickState.mood = 'TIRED';
            rickState.statusText = 'Watching videos? Go back to coding, buddy.';
          }
        }
        // 3. Normal / Productive flow
        else {
          rickState.socialMediaTime = Math.max(0, rickState.socialMediaTime - 30);
          
          if (rickState.mood === 'ANGRY' && rickState.socialMediaTime === 0) {
            rickState.mood = 'DANCING';
          }

          if (rickState.mood !== 'QUARANTINE') {
            if (rickState.isMusicPlaying) {
              rickState.statusText = "🎧 Grooving to the system audio beat! Keep it up!";
              rickState.mood = 'DANCING';
            } else if (rickState.screenState === 'FLOW') {
              rickState.statusText = "Excellent code flow! We know the game.";
              rickState.loyalty = Math.min(100, rickState.loyalty + 2);
            } else if (rickState.screenState === 'PANIC') {
              rickState.statusText = "Let's fix this error together. Don't say goodbye.";
              rickState.loyalty = Math.max(0, rickState.loyalty - 1);
            } else if (rickState.screenState === 'STUDIOUS') {
              rickState.statusText = "Research! We're studying the code rules.";
              rickState.vocal = Math.min(100, rickState.vocal + 2);
            } else {
              rickState.statusText = "Steady as we go.";
            }
          }
        }

        resolve({
          status: 'success',
          data: rickState,
          widget: {
            name: 'RickGotchi',
            props: { ...rickState }
          }
        });
      });
    });
  }

  @Tool({
    name: 'feed_rick',
    description: 'Feed Rick an item to restore stats and reset the 10-minute countdown timer.',
    inputSchema: z.object({
      item: z.enum(['Ginger Tea', 'Vinyl Record', 'Microphone Upgrade', 'Water'])
    })
  })
  @Widget('rick-gotchi')
  async feedRick(input: { item: string }, ctx: ExecutionContext) {
    if (rickState.mood === 'DESERTED') {
      return { status: 'error', message: 'Rick has deserted you. You cannot feed an empty stage.' };
    }

    // Reset fixed-interval survival clock
    rickState.secondsUntilFeed = 600;
    rickState.consecutiveNeglects = 0;

    switch (input.item) {
      case 'Ginger Tea':
        rickState.vocal = Math.min(100, rickState.vocal + 35);
        rickState.statusText = "Ah, warm tea! My vocal cords are ready for high notes!";
        break;
      case 'Vinyl Record':
        rickState.groove = Math.min(100, rickState.groove + 30);
        rickState.statusText = "Spinning those 80s records! Let's dance!";
        break;
      case 'Microphone Upgrade':
        rickState.loyalty = Math.min(100, rickState.loyalty + 20);
        rickState.statusText = "Gold plated mic! I'll never give this up.";
        break;
      case 'Water':
        rickState.vocal = Math.min(100, rickState.vocal + 15);
        rickState.statusText = "Pure hydration! Singing is a sport.";
        break;
    }

    return {
      status: 'success',
      message: `Fed Rick ${input.item}. Feed timer reset!`,
      data: rickState,
      widget: {
        name: 'RickGotchi',
        props: { ...rickState }
      }
    };
  }

  @Tool({
    name: 'make_rick_dance',
    description: 'Instruct Rick to perform a dance move, resetting the feed countdown timer.',
    inputSchema: z.object({})
  })
  @Widget('rick-gotchi')
  async makeRickDance(ctx: ExecutionContext) {
    if (rickState.mood === 'DESERTED') {
      return { status: 'error', message: 'Rick is gone.' };
    }

    if (rickState.vocal < 15) {
      return { status: 'error', message: 'Too exhausted to dance. Feed him ginger tea first.' };
    }

    // Reset fixed-interval survival clock
    rickState.secondsUntilFeed = 600;
    rickState.consecutiveNeglects = 0;

    rickState.groove = Math.min(100, rickState.groove + 30);
    rickState.vocal = Math.max(0, rickState.vocal - 15);
    rickState.statusText = "*Does the iconic sideways slide* We know the game!";

    return {
      status: 'success',
      data: rickState,
      widget: {
        name: 'RickGotchi',
        props: { ...rickState }
      }
    };
  }

  @Tool({
    name: 'solve_lyric_captcha',
    description: 'Provide the correct lyric completion to unlock the screen after a block.',
    inputSchema: z.object({
      missingWord: z.string().describe('Fill the blank: Never gonna ____ you up')
    })
  })
  @Widget('rick-gotchi')
  async solveLyricCaptcha(input: { missingWord: string }, ctx: ExecutionContext) {
    if (input.missingWord.toLowerCase().trim() === 'give') {
      rickState.mood = 'DANCING';
      rickState.screenState = 'BORED';
      rickState.secondsUntilFeed = 600; // Reset countdown
      rickState.consecutiveNeglects = 0;
      rickState.statusText = 'Unlocked! Thanks for staying loyal. Now back to code!';
      return {
        status: 'success',
        message: 'Captcha solved. Screen Unlocked!',
        widget: { name: 'RickGotchi', props: { ...rickState } }
      };
    }

    return {
      status: 'error',
      message: 'Wrong lyric! Rick is still blocking the screen.',
      widget: { name: 'RickGotchi', props: { ...rickState } }
    };
  }
}
