# camera_emotion.py
# Captures a webcam frame path from arg, analyzes emotion via Gemini Vision
import sys, os, json, re
import google.generativeai as genai

def analyze(img_path: str) -> dict:
    api_key = os.environ.get('GEMINI_API_KEY', '')
    if not api_key:
        return {"emotion": "neutral", "wellness": "good", "face_detected": False, "advice": ""}
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    try:
        img = genai.upload_file(path=img_path, mime_type='image/jpeg')
        resp = model.generate_content([img, """
Analyze this webcam image of a person at their computer desk.
Return ONLY a JSON object, no markdown, no explanation:
{
  "emotion": "happy|sad|tired|stressed|focused|neutral|frustrated|surprised",
  "confidence": 0.0 to 1.0,
  "wellness": "good|warning|critical",
  "face_detected": true or false,
  "visible_signs": "brief note e.g. dark circles, tense posture, smiling",
  "advice": "one 1-sentence Rick Astley style wellness tip based on their state"
}

wellness rules:
- good: happy/focused/neutral
- warning: tired/stressed
- critical: frustrated/sad with visible fatigue

If no person/face visible, set face_detected=false and use neutral defaults.
Return only the JSON object.
"""])
        text = resp.text.strip()
        # Remove markdown code blocks if present
        text = re.sub(r'^```[a-z]*\n?', '', text); text = re.sub(r'\n?```$', '', text)
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception as e:
        return {"emotion": "neutral", "wellness": "good", "face_detected": False, "advice": "", "error": str(e)}
    finally:
        try: genai.delete_file(img.name)
        except: pass
    
    return {"emotion": "neutral", "wellness": "good", "face_detected": False, "advice": ""}

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({"emotion": "neutral", "wellness": "good", "face_detected": False}))
        sys.exit(0)
    result = analyze(sys.argv[1])
    print(json.dumps(result))
