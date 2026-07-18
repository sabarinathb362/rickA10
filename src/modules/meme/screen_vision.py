import os
import sys
import asyncio
from PIL import ImageGrab

try:
    import google.generativeai as genai
except ImportError:
    # If the library is not installed, output default and exit
    print("STATE:BORED")
    print("MUSIC:FALSE")
    sys.exit(0)

# Configure the Gemini API key
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("STATE:BORED")
    print("MUSIC:FALSE")
    sys.exit(0)

genai.configure(api_key=api_key)

async def is_music_playing():
    try:
        from winrt.windows.media.control import GlobalSystemMediaTransportControlsSessionManager as MediaManager
        manager = await MediaManager.request_async()
        session = manager.get_current_session()
        if session:
            # GlobalSystemMediaTransportControlsSessionPlaybackStatus:
            # 0=Unknown, 1=Opened, 2=Changing, 3=Stopped, 4=Playing, 5=Paused
            return int(str(session.get_playback_info().playback_status)) == 4
    except:
        pass
    return False


def analyze_screen():
    screenshot_path = "temp_capture.jpg"
    try:
        # Capture the entire primary screen
        img = ImageGrab.grab()
        img.convert('RGB').save(screenshot_path, "JPEG", quality=60)
    except Exception as e:
        return "BORED"

    try:
        # Load the Gemini 1.5 Flash Model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Upload screenshot
        image = genai.upload_file(path=screenshot_path)
        
        prompt = """
        You are the security and productivity monitoring engine for a developer's visual companion.
        Analyze this screenshot of the developer's desktop screen and classify the state into EXACTLY one of these categories:
        
        1. 'ADULT' - If you see any pornography, explicit imagery, dating platforms, or explicit adult content. (PRIORITY 1)
        2. 'SLACKING' - If you see social media feeds (Twitter/X, Reddit, Instagram, Facebook, TikTok) or YouTube entertainment videos.
        3. 'FLOW' - If you see a code editor (VS Code, IntelliJ, PyCharm, etc.) without major red highlighting or debug trace dumps.
        4. 'PANIC' - If you see compiler errors, crash logs, red exception dialogs, or trace dumps in active windows.
        5. 'STUDIOUS' - If you see documentation pages, StackOverflow technical answers, API guides, or research papers.
        6. 'BORED' - If the desktop is idle, showing just wallpaper, generic file explorers, or neutral applications.
        
        Output only the category name in single quotes.
        """
        
        response = model.generate_content([image, prompt])
        state = response.text.strip().replace("'", "").upper()
        
        # Cleanup image
        if os.path.exists(screenshot_path):
            os.remove(screenshot_path)
            
        valid_states = ['ADULT', 'SLACKING', 'FLOW', 'PANIC', 'STUDIOUS', 'BORED']
        return state if state in valid_states else "BORED"
        
    except Exception as e:
        # Cleanup image on failure
        if os.path.exists(screenshot_path):
            os.remove(screenshot_path)
        return "BORED"

async def main():
    # 1. Check music playback state
    music_state = await is_music_playing()
    # 2. Analyze screen content
    screen_state = analyze_screen()
    
    print(f"STATE:{screen_state}")
    print(f"MUSIC:{'TRUE' if music_state else 'FALSE'}")

if __name__ == "__main__":
    asyncio.run(main())
