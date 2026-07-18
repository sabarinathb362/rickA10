# ai_advisor.py
# Generates personalized Rick Astley-style advice using Gemini
import sys, os, json, re
import google.generativeai as genai

def get_advice(context: dict) -> str:
    api_key = os.environ.get('GEMINI_API_KEY', '')
    if not api_key:
        return "Never gonna give up on you! Keep going!"
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    emotion       = context.get('emotion', 'neutral')
    screen_state  = context.get('screen_state', 'BORED')
    stuck_minutes = context.get('stuck_minutes', 0)
    trigger       = context.get('trigger', 'manual')
    stats         = context.get('stats', {})
    groove        = stats.get('groove', 80)
    vocal         = stats.get('vocal', 70)
    loyalty       = stats.get('loyalty', 90)
    
    # Build contextual prompt
    context_notes = []
    if screen_state == 'PANIC' and stuck_minutes >= 2:
        context_notes.append(f"They have a compiler error/exception and have been stuck for {stuck_minutes} minutes.")
    if screen_state == 'PANIC' and stuck_minutes >= 5:
        context_notes.append("Suggest concrete debugging techniques: check console logs, rubber duck debug, check types, search the error message.")
    if emotion in ('tired', 'stressed', 'frustrated'):
        context_notes.append(f"Their webcam shows they look {emotion}. Prioritize wellness over code.")
    if emotion == 'sad':
        context_notes.append("They look sad. Be extra warm and encouraging.")
    if screen_state == 'SLACKING' and trigger == 'auto':
        context_notes.append("They've been on social media. Gently redirect to work.")
    if groove < 30:
        context_notes.append("Their groove is low — they need motivation.")
    if loyalty < 40:
        context_notes.append("Their loyalty to Rick is critically low — be extra charming.")
    
    context_str = '\n'.join(f"- {n}" for n in context_notes) if context_notes else "- Everything seems fine."
    
    prompt = f"""You are Rick Astley as a caring AI desktop companion for a developer.

Developer's current state:
- Emotion detected by webcam: {emotion}
- What's on screen: {screen_state}
- Stuck duration: {stuck_minutes} minutes
- Stats — Groove: {groove:.0f}%, Vocal: {vocal:.0f}%, Loyalty: {loyalty:.0f}%

Key context:
{context_str}

Write a SHORT (2-3 sentences MAX) message that:
1. Directly addresses their situation with warmth
2. Gives ONE actionable, specific tip if they're stuck/stressed
3. Ends with a natural (not forced) Rick Astley lyric reference
4. Sounds human and caring, not AI-generated

Output ONLY the message. No quotes, no labels."""
    
    try:
        resp = model.generate_content(prompt)
        return resp.text.strip()
    except Exception as e:
        return f"Never gonna give you up! Keep debugging — you've got this! (error: {str(e)[:50]})"

if __name__ == '__main__':
    ctx = {}
    if len(sys.argv) > 1:
        try:
            import base64
            ctx = json.loads(base64.b64decode(sys.argv[1]).decode())
        except:
            try: ctx = json.loads(sys.argv[1])
            except: pass
    advice = get_advice(ctx)
    print(advice)
