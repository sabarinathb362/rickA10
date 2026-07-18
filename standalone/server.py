import os
import sys
import json
import time
import subprocess
from http.server import BaseHTTPRequestHandler, HTTPServer

# Global in-memory state
state = {
    "screenState": "BORED",
    "socialMediaTime": 0,
    "secondsUntilFeed": 600,
    "consecutiveNeglects": 0,
    "groove": 80,
    "vocal": 70,
    "loyalty": 90,
    "mood": "DANCING",
    "statusText": "Never gonna give you up, buddy!",
    "isMusicPlaying": False
}

last_update_time = time.time()

def decay_stats(seconds_elapsed):
    global state
    if state["mood"] == "DESERTED":
        return

    state["secondsUntilFeed"] -= seconds_elapsed
    
    if state["secondsUntilFeed"] <= 0:
        state["consecutiveNeglects"] += 1
        state["loyalty"] = max(0, state["loyalty"] - 25)
        state["secondsUntilFeed"] = 600
        
        if state["consecutiveNeglects"] >= 4 or state["loyalty"] <= 0:
            state["mood"] = "DESERTED"
            state["statusText"] = "You gave me up... I ran around and deserted you. Bye."
            return
            
        state["statusText"] = "🚨 I feel neglected! Feed me tea or records before I desert you!"

    multiplier = 2 if state["consecutiveNeglects"] > 0 else 1

    if state["isMusicPlaying"]:
        state["groove"] = min(100, state["groove"] + (0.33 * seconds_elapsed))
    else:
        state["groove"] = max(0, state["groove"] - (0.16 * seconds_elapsed * multiplier))
        
    state["vocal"] = max(0, state["vocal"] - (0.10 * seconds_elapsed * multiplier))
    state["loyalty"] = max(0, state["loyalty"] - (0.10 * seconds_elapsed * multiplier))

    if state["loyalty"] <= 0:
        state["mood"] = "DESERTED"
        state["statusText"] = "You gave me up... I ran around and deserted you. Bye."
    elif state["mood"] not in ["QUARANTINE", "ANGRY"]:
        if state["vocal"] < 20 or state["groove"] < 20:
            state["mood"] = "TIRED"
            if state["consecutiveNeglects"] > 0:
                state["statusText"] = "So neglected... too weak to dance."
            else:
                state["statusText"] = "Need some tea or a record... too tired to groove."
        else:
            state["mood"] = "DANCING"

class GotchiHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Suppress request logs to keep terminal clean
        return

    def do_GET(self):
        global state, last_update_time
        
        # Serve static frontend page
        if self.path == "/" or self.path == "/index.html":
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            
            html_path = os.path.join(os.path.dirname(__file__), "index.html")
            with open(html_path, "r", encoding="utf-8") as f:
                self.wfile.write(f.read().encode("utf-8"))
            return

        # API: get status
        if self.path == "/api/status":
            now = time.time()
            elapsed = now - last_update_time
            last_update_time = now
            
            decay_stats(elapsed)
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(state).encode("utf-8"))
            return

        # API: trigger screen sync
        if self.path == "/api/sync":
            now = time.time()
            elapsed = now - last_update_time
            last_update_time = now
            decay_stats(elapsed)

            if state["mood"] != "DESERTED":
                # Execute screen_vision.py
                try:
                    script_path = os.path.join(os.path.dirname(__file__), "..", "src", "modules", "meme", "screen_vision.py")
                    result = subprocess.run([sys.executable, script_path], capture_output=True, text=True, timeout=15)
                    
                    detected_state = "BORED"
                    music_playing = False
                    
                    for line in result.stdout.strip().split("\n"):
                        if line.startswith("STATE:"):
                            detected_state = line.split(":")[1].strip()
                        elif line.startswith("MUSIC:"):
                            music_playing = line.split(":")[1].strip() == "TRUE"
                            
                    state["screenState"] = detected_state
                    state["isMusicPlaying"] = music_playing

                    # 1. Quarantine trigger
                    if state["screenState"] == "ADULT":
                        state["mood"] = "QUARANTINE"
                        state["statusText"] = "🚨 BLOCKOUT! Never gonna let you view this! 🚨"
                        state["socialMediaTime"] = 0
                    # 2. Slacking aggro meter
                    elif state["screenState"] == "SLACKING":
                        state["socialMediaTime"] += 30
                        if state["socialMediaTime"] >= 120:
                            state["mood"] = "ANGRY"
                            state["statusText"] = "⚠️ CLOSE THE TAB! You are running around and deserting your task!"
                            state["loyalty"] = max(0, state["loyalty"] - 10)
                        else:
                            state["mood"] = "TIRED"
                            state["statusText"] = "Watching videos? Go back to coding, buddy."
                    # 3. Productive flow
                    else:
                        state["socialMediaTime"] = max(0, state["socialMediaTime"] - 30)
                        if state["mood"] == "ANGRY" and state["socialMediaTime"] == 0:
                            state["mood"] = "DANCING"
                            
                        if state["mood"] != "QUARANTINE":
                            if state["isMusicPlaying"]:
                                state["statusText"] = "🎧 Grooving to the system audio beat! Keep it up!"
                                state["mood"] = "DANCING"
                            elif state["screenState"] == "FLOW":
                                state["statusText"] = "Excellent code flow! We know the game."
                                state["loyalty"] = min(100, state["loyalty"] + 2)
                            elif state["screenState"] == "PANIC":
                                state["statusText"] = "Let's fix this error together. Don't say goodbye."
                                state["loyalty"] = max(0, state["loyalty"] - 1)
                            elif state["screenState"] == "STUDIOUS":
                                state["statusText"] = "Research! We're studying the code rules."
                                state["vocal"] = min(100, state["vocal"] + 2)
                            else:
                                state["statusText"] = "Steady as we go."
                except Exception as e:
                    print("Error in vision run:", e)

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(state).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        global state
        
        # API: feed pet
        if self.path == "/api/feed":
            content_length = int(self.headers['Content-Length'])
            post_data = json.loads(self.rfile.read(content_length).decode('utf-8'))
            item = post_data.get("item")
            
            if state["mood"] != "DESERTED":
                state["secondsUntilFeed"] = 600
                state["consecutiveNeglects"] = 0
                
                if item == "Ginger Tea":
                    state["vocal"] = min(100, state["vocal"] + 35)
                    state["statusText"] = "Ah, warm tea! My vocal cords are ready for high notes!"
                elif item == "Vinyl Record":
                    state["groove"] = min(100, state["groove"] + 30)
                    state["statusText"] = "Spinning those 80s records! Let's dance!"
                elif item == "Microphone Upgrade":
                    state["loyalty"] = min(100, state["loyalty"] + 20)
                    state["statusText"] = "Gold plated mic! I'll never give this up."
                elif item == "Water":
                    state["vocal"] = min(100, state["vocal"] + 15)
                    state["statusText"] = "Pure hydration! Singing is a sport."

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(state).encode("utf-8"))
            return

        # API: trigger dance
        if self.path == "/api/dance":
            if state["mood"] != "DESERTED":
                if state["vocal"] >= 15:
                    state["secondsUntilFeed"] = 600
                    state["consecutiveNeglects"] = 0
                    state["groove"] = min(100, state["groove"] + 30)
                    state["vocal"] = max(0, state["vocal"] - 15)
                    state["statusText"] = "*Does the iconic sideways slide* We know the game!"
                else:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(json.dumps({"message": "Too tired"}).encode("utf-8"))
                    return

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(state).encode("utf-8"))
            return

        # API: solve captcha
        if self.path == "/api/captcha":
            content_length = int(self.headers['Content-Length'])
            post_data = json.loads(self.rfile.read(content_length).decode('utf-8'))
            word = post_data.get("word", "")
            
            if word.lower().strip() == "give":
                state["mood"] = "DANCING"
                state["screenState"] = "BORED"
                state["secondsUntilFeed"] = 600
                state["consecutiveNeglects"] = 0
                state["statusText"] = "Unlocked! Thanks for staying loyal. Now back to code!"
                self.send_response(200)
            else:
                self.send_response(400)
            
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(state).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

def run(port=3001):
    # Load dotenv key
    dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(dotenv_path):
        with open(dotenv_path, "r") as f:
            for line in f:
                if "=" in line:
                    key, val = line.strip().split("=", 1)
                    os.environ[key.strip()] = val.strip()

    server_address = ('', port)
    httpd = HTTPServer(server_address, GotchiHandler)
    print(f"RickGotchi Standalone Server running at http://localhost:{port}/")
    print("Press Ctrl+C to stop.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")

if __name__ == '__main__':
    run()
