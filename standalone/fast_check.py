# fast_check.py - typing + music detection
# Music: PlaybackStatus enum - Playing=4, Paused=5, Stopped=3
import sys, json, subprocess

result = {"typing": False, "music": False, "fg_title": "", "debug": {}}

# ── 1. Foreground window via tasklist + process name (works from subprocess) ─
# GetForegroundWindow() returns 0 in subprocesses due to Windows security.
# Instead: check if known editor EXEs are the foreground process via
# a PowerShell one-liner that doesn't require Add-Type compilation.
# ── 1. Typing detection: check if a code editor process is running ────────────
# GetForegroundWindow() returns 0 from subprocesses (Windows security).
# Workaround: just check if editor EXEs are running. Screen vision (Gemini)
# provides accurate FLOW/BORED/PANIC context for the 20s cycle.
try:
    procs = subprocess.check_output(
        ['tasklist', '/FO', 'CSV', '/NH'],
        text=True, timeout=4, creationflags=0x08000000  # CREATE_NO_WINDOW
    ).lower()
    EDITOR_EXES = [
        'code.exe', 'cursor.exe', 'devenv.exe', 'idea64.exe',
        'pycharm64.exe', 'webstorm64.exe', 'rider64.exe',
        'sublime_text.exe', 'notepad++.exe', 'nvim.exe', 'vim.exe',
        'windowsterminal.exe', 'powershell.exe', 'cmd.exe',
    ]
    result["typing"] = any(e in procs for e in EDITOR_EXES)
except Exception as e:
    result["typing_error"] = str(e)


# ── 2. Music via Windows SMTC (winrt) — PlaybackStatus.Playing = 4 ──────────
try:
    import asyncio
    from winrt.windows.media.control import (
        GlobalSystemMediaTransportControlsSessionManager as MediaManager,
    )
    async def _check_music():
        mgr = await MediaManager.request_async()
        s = mgr.get_current_session()
        if s:
            info = s.get_playback_info()
            status = int(str(info.playback_status))
            result["debug"]["smtc_status"] = status
            # GlobalSystemMediaTransportControlsSessionPlaybackStatus:
            # 0=Unknown, 1=Opened, 2=Changing, 3=Stopped, 4=Playing, 5=Paused
            return status == 4
        return False
    result["music"] = asyncio.run(_check_music())
except Exception as e:
    result["music_error"] = str(e)
    # Fallback: detect running music player processes
    try:
        procs = subprocess.check_output(['tasklist', '/FO', 'CSV', '/NH'],
                                         text=True, timeout=3).lower()
        MUSIC_EXES = ['spotify.exe', 'vlc.exe', 'foobar2000.exe',
                      'aimp.exe', 'musicbee.exe', 'winamp.exe', 'itunes.exe',
                      'groove music', 'apple music', 'tidal.exe', 'deezer.exe']
        result["music"] = any(e in procs for e in MUSIC_EXES)
    except:
        pass

print(json.dumps(result))
