# 🕺 RickGotchi — The Ultimate AI Desktop Companion

<p align="center">
  <img src="https://img.shields.io/badge/Release-v1.0.0-ff007f?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/Privacy-100%25_Local_Vision-39ff14?style=for-the-badge" alt="Privacy First" />
  <img src="https://img.shields.io/badge/AI_Advisor-Gemini_Flash-1e66f5?style=for-the-badge" alt="AI Engine" />
  <img src="https://img.shields.io/badge/Platform-Windows-89b4fa?style=for-the-badge" alt="OS" />
</p>

---

**RickGotchi** is a lightweight, interactive, transparent **Desktop Mate** featuring **on-device facial emotion recognition**, system-level coding and music monitors, and an AI-driven debugging advisor that ensures you *never give up* on your code, and *never run around and desert* your tasks!

---

## ✨ Features

### 1. Draggable Desktop Mate
- **True Transparent Overlay**: Full-screen transparent click-through window. Rick sits cleanly on your screen, fully integrated with your workspace.
- **Dynamic Placement**: Drag Rick anywhere you want. He will clamp to your screen borders and stay exactly where you drop him.
- **Drag Reward**: Moving Rick updates his stats and rewards him with groove points!
- **Interactive Triggers**: Double-click Rick to make him dance. Right-click him for classic responses.

### 2. Privacy-First Local Camera Emotion Detection 📸
- **On-Device Inference**: Powered by a highly optimized, client-side `@vladmandic/face-api` (using TensorFlow.js).
- **Zero Cloud Leakage**: Camera feeds are processed frame-by-frame inside Electron's Chromium engine. **No webcam data is sent to the cloud.**
- **Emotional States Detected**: 
  - Neutral 😐 | Happy 😊 | Sad 😢
  - Stressed 😰 | Frustrated 😤 | Tired 😴
- **Wellness Indicator**: Floats above Rick, showing a live health status dot (🟢 Good, 🟡 Warning, 🔴 Critical) depending on your facial expression.

### 3. Smart Coding & Music Detections (Fast Checks) ⌨️
- **Coding Monitor**: Automatically bobs and floats code particles (`{}`, `=>`, `++`, `;`, `let`) upward when you focus code editors, terminal sessions, or IDEs.
- **Soundtrack Grooving**: If you play system audio (Spotify, Apple Music, VLC, etc.), Rick bobs energetically and dances to the playback session.

### 4. Proactive AI Debugging Advisor & Stuck Detection 🧠
- **Error Panic System**: If Gemini Vision detects compiler errors, crash logs, or red exception trace dumps on your active screen:
  - Rick lights up with a warm **orange panic glow**.
  - **Red error particles** (`❌`, `ERR!`, `fatal`) start bursting around him.
- **Stuck Tracker**: If you are stuck on a compiler error for more than **3 minutes**, Rick auto-triggers the Gemini AI Advisor and slides out a dedicated debugging tip banner.
- **Ask Rick**: Click the 🤖 button to get contextual mental health/coding advice based on your current facial expression, workspace state, and stats.

---

## 🎨 Rick's Stat System

Keep Rick happy by monitoring his stats:

| Stat | Restored By | Impact of Depletion |
|:---:|:---|:---|
| **🍵 Vocal** | Ginger Tea | Drops below 20% → Rick gets too tired to dance. |
| **🎵 Groove** | Vinyl Records / System Music | Drops below 20% → Rick gets lazy. |
| **❤️ Loyalty** | Productive coding flow / Dragging | Reaches 0% → Rick deserts you and goes offline. |

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** (v16+)
- **Python 3** (with standard pip environment)
- **Webcam** (for local face/emotion detection)

### 1. Clone & Install dependencies
```bash
# Navigate to the standalone directory
cd standalone

# Install Electron and face-api.js
npm install
```

### 2. Configure Environment Secrets
Create a `.env` file in the **root project directory** and configure your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the App
```bash
npm start
```

---

## 🛠️ Troubleshooting

### 1. Camera Error: Hardware resources busy (`0xC00D3704`)
- **Cause**: Another app (Zoom, Teams, Discord, OBS, or Windows Camera) is holding the webcam lock.
- **Solution**: Close the conflicting app. The camera indicator dot on Rick will turn from **🔴 red** to **🟢 green** automatically within 30 seconds once the camera is freed.

### 2. Gemini API Errors
- Ensure your `.env` file is placed in the root directory (one level above `/standalone`) and that the API key is active.

---

<p align="center">
  <i>"Never gonna give you up, never gonna let you down, never gonna run around and desert you!"</i>
</p>
