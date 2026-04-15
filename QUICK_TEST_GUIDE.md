# Quick Test Guide - AI Response Improvements

## Prerequisites
- Backend running: `python app/run.py` or `python -m app.run`
- Ollama running: `ollama serve` (in separate terminal)
- Frontend running: `npm run dev` (in frontend directory)
- Optional: Arduino connected with sensor data

---

## 🚀 Quick Start Tests (5 minutes)

### Test 1: Verify Dashboard Displays Sensor Values
1. Open browser: `http://localhost:5173` (or your frontend URL)
2. Navigate to **Dashboard** page
3. Look for **Live Sensors** section
4. You should see:
   ```
   🌡️ Temperature: 33.1°C
   💧 Humidity: 60.8%
   🌱 Soil Moisture: 65%
   ☔ Rain: DRY
   ```
5. **Status**: ✅ PASS if you see actual values (not "--")

---

### Test 2: Verify Analytics Shows Historical Trends
1. Navigate to **Analytics** page
2. You should see a chart with sensor data
3. Select different time periods: **1D**, **3D**, **7D**
4. Bottom should show stats:
   ```
   Avg Temp: 33.1°C
   Avg Humidity: 60%
   Soil Reading: 650 ADC
   ```
5. **Status**: ✅ PASS if chart and stats display

---

### Test 3: AI Response with Sensor Values (CRITICAL TEST)
1. Go to **Dashboard** page
2. Look at **AI Farming Advice** section (bottom right)
3. Type question: `What is the current temperature?`
4. **Expected Response**:
   ```
   ✅ RECOMMENDATION: MONITOR (or similar)
   
   ✅ REASON: Should include "Temperature: 33.1°C" or similar number
   
   ✅ ACTION: "Given the temperature of 33.1°C..." or similar
   ```
5. **CRITICAL CHECK**: 
   - ❌ FAIL if you see: "I specialize in agriculture..." (generic)
   - ❌ FAIL if you see: "MONITOR" with no sensor values
   - ✅ PASS if you see actual temperature number mentioned

---

### Test 4: Dashboard Question Recognition
1. Ask: `Whats the current temperature in dashboard and what can you suggest about analytics?`
2. **Expected**: 
   - AI recognizes this as farm-related question (not "general")
   - Response includes current sensor values
   - Response references dashboard data
3. **FAIL**: If response is still generic or says "I specialize in agriculture"

---

### Test 5: Analytics Question (If you have 7+ days of data)
1. Go to **Analytics** page
2. Select **7D** (7 days)
3. Go back to **Dashboard** → **AI Chat**
4. Ask: `Based on my analytics trends from the last 7 days, what do you recommend?`
5. **Expected**:
   - Response should mention temperature trends
   - Should cite historical data changes
   - Specific recommendations based on trends
6. **FAIL**: If response is generic without trend information

---

## 🔍 Detailed Verification Tests (10 minutes)

### Test 6: Check Browser Console for API Calls
1. Open DevTools: `F12` or `Ctrl+Shift+I`
2. Go to **Console** tab
3. Go to Dashboard
4. You should see logs like:
   ```
   📊 Dashboard: Fetching metrics...
   ✅ Dashboard: Metrics loaded successfully
   ```
5. Open AI Chat and ask a question
6. You should see:
   ```
   🔄 Chat: Fetching latest sensor data...
   ✅ Chat: Got live sensor data: {temperature: 33.1, ...}
   💬 Chat: Sending to AI with sensor data: ...
   ✅ Chat: Got AI response: {recommendation: "IRRIGATE", ...}
   ```
7. **Status**: ✅ PASS if you see these logs without errors

---

### Test 7: Check Backend Logs for Ollama Calls
1. Look at backend terminal (where you ran `python run.py`)
2. When you ask AI a question, you should see:
   ```
   [Ollama] Calling http://localhost:11434/api/generate with model qwen2.5:1.5b
   [Ollama] Status code: 200
   [Ollama] Response length: 234, First 150 chars: ...
   [Ollama] ✅ Successfully parsed JSON response
   [Ollama] Final response: {recommendation: "IRRIGATE", reason: "Temperature: 33.1°C...", ...}
   ```
3. **FAIL Signs**:
   - ❌ `[Ollama] ⏱️ Timeout` - Ollama is too slow or crashed
   - ❌ `[Ollama] 🔌 Connection error` - Ollama not running
   - ❌ `[Ollama] JSON decode error` - Ollama returned invalid JSON

---

### Test 8: Verify Chat Session Saving
1. Go to **Suggestions** (Chat) page
2. Ask 3 questions:
   - "What is the temperature?"
   - "Should I irrigate now?"
   - "What about humidity?"
3. You should see all 3 questions + AI responses in chat
4. Click 🕐 **Clock icon** (Chat History)
5. You should see "Chat Sessions" section with your conversation
6. Click a previous session to load it
7. **Status**: ✅ PASS if session loads with all messages intact

---

### Test 9: Check Offline/Fallback Mode (Advanced)
1. Stop Ollama: Ctrl+C in Ollama terminal
2. Go to Desktop → Ask AI a question
3. Wait 40+ seconds
4. You should see fallback response:
   ```
   ⚠️ AI Service: [smart fallback message]
   ```
5. **Status**: ✅ PASS if you get smart fallback (not error)
6. Restart Ollama before continuing

---

## 📊 Response Quality Rubric

### Excellent Response (Score: 90-100)
```
✅ Includes SPECIFIC sensor values (e.g., "Temperature is 33.1°C")
✅ Reasoning references actual readings
✅ Actionable steps with quantities (e.g., "irrigate for 45 minutes")
✅ Recommendation matches conditions (e.g., IRRIGATE when soil is dry)
✅ Confidence score provided (70-90%)
```
Example:
```
IRRIGATE
Reason: Temperature 33.1°C (elevated), soil 650 ADC (~36%, dry). 
Need immediate irrigation.
Action: Irrigate for 40-45 minutes using drip system if available.
Risk: Heat stress if not irrigated soon
Confidence: 85%
```

### Good Response (Score: 70-89)
```
✅ Mentions some sensor values
✅ Has reasoning tied to farm conditions
✅ Specific next steps provided
⚠️  May lack some details or slight generic phrasing
```

### Poor Response (Score: 0-69)
```
❌ Does NOT mention any sensor values
❌ Generic language ("I specialize in agriculture")
❌ No specific actionable steps
❌ Recommendation disconnected from conditions
```

---

## 🎯 Expected vs Actual Comparison

### Question 1: "What is the current temperature?"

**BEFORE FIX** (❌ What you used to see):
```
GENERAL Response
Reason: I'm KrishiDrishti, specialized in smart farming. Please ask about your farm!
Action: Ask about: crops, soil health, irrigation, weather, pests, fertilizers...
```

**AFTER FIX** (✅ What you should see now):
```
MONITOR Response
Reason: Temperature: 33.1°C (elevated), Humidity: 60.8% (moderate). This temperature...
Action: Ensure adequate irrigation to manage heat stress. Increase watering frequency to 2-3x daily.
Risk: Heat stress on sensitive crops
Confidence: 85%
```

---

### Question 2: "Should I irrigate now?"

**BEFORE FIX** (❌):
```
IRRIGATE
Reason: [generic text]
Action: [vague irrigation advice]
```

**AFTER FIX** (✅):
```
IRRIGATE
Reason: Soil moisture 650 ADC (~36%, moderately dry). Combined with temperature 33.1°C, irrigation recommended.
Action: Irrigate for 40-45 minutes immediately using drip irrigation to minimize evaporation.
Risk: Increased evaporation if delayed
Confidence: 90%
```

---

## Troubleshooting Test Failures

### If Test 3 Fails (AI not mentioning sensor values)
**Symptom**: Response is still generic like "I specialize in agriculture"
**Diagnostics**:
1. Check backend logs: Are you seeing `[Ollama]` messages?
   - ❌ NO → Ollama not running. Start: `ollama serve`
   - ❌ TIMEOUT → Ollama slow. Try smaller model or more RAM
   - ❌ Connection Error → Check `http://localhost:11434` is accessible

2. Check `ollama_service.py` is updated:
   ```python
   # Should see:
   farming_keywords = [..., 'dashboard', 'sensor', 'reading', 'analytics', ...]
   # Should have:
   prompt = f"""...⚠️ CRITICAL INSTRUCTIONS..."""
   ```

3. Check sensor data is coming through:
   - Browser console should show: `✅ Chat: Got live sensor data: {...}`
   - If showing `undefined`, check `/sensors/latest` endpoint

### If Test 1 Fails (Dashboard shows "--")
**Symptom**: Sensor cards show "--" instead of values
**Diagnostics**:
1. Arduino not connected: Expected. Demo data should appear anyway.
2. Backend `/dashboard/metrics` failing: Check terminal for errors
3. Try manual: Open browser console, run:
   ```javascript
   fetch('/dashboard/metrics').then(r => r.json()).then(console.log)
   ```

### If Test 8 Fails (Chat sessions not saving)
**Symptom**: Click history but no sessions show up
**Diagnostics**:
1. Check localStorage is enabled: DevTools → Application → localStorage
2. Try clearing localStorage: `localStorage.clear()` in console
3. Ask new questions, then check clock icon again
4. Sessions should start saving after first question

---

## 🏁 Success Checklist

Before considering this complete, verify ALL these:

- [ ] Test 1 PASS: Dashboard shows actual sensor values (not "--")
- [ ] Test 2 PASS: Analytics shows chart with historical data
- [ ] Test 3 PASS: AI mentions actual temperature when asked
- [ ] Test 4 PASS: AI recognizes "dashboard" questions as farm-related
- [ ] Test 5 PASS: AI can discuss analytics trends
- [ ] Test 6 PASS: Browser console shows API call logs
- [ ] Test 7 PASS: Backend shows Ollama success messages
- [ ] Test 8 PASS: Chat sessions save and load correctly
- [ ] Test 9 PASS: Fallback response works when Ollama offline

---

## 🎓 Understanding the Improvements

### What Changed (Technical Summary)
1. **Keyword Detection**: Added "dashboard", "analytics", "sensor", "reading", "current", "conditions"
2. **Prompt Engineering**: Added explicit requirement for AI to cite sensor values
3. **Response Enhancement**: System automatically adds sensor values if AI response is generic
4. **Sensor Integration**: Frontend always fetches latest sensors before sending to AI

### Why This Helps
- Users get answers referencing **their actual farm data**
- AI understands **both real-time (Dashboard) and historical (Analytics) context**
- Even if AI service intermittently fails, responses still reference **actual conditions**
- System **learns farming keywords** to proper categorize questions

### What To Expect
- **Faster responses** for simple questions ("What's my temp?")
- **More detailed responses** for complex questions ("What about my trends?")
- **Consistent format** - always includes Recommendation, Reason, Action, Risk
- **Confidence scores** showing how sure the AI is about its answer

---

## 📞 Still Having Issues?

1. **Verify Ollama is running**: 
   ```bash
   curl http://localhost:11434/api/tags
   ```
   Should return model list including `qwen2.5:1.5b`

2. **Check backend routes are accessible**:
   ```bash
   curl http://localhost:8000/sensors/latest
   ```
   Should return current sensor data

3. **Test AI directly** (backend only):
   ```bash
   python backend/test_ai_with_sensors.py
   ```
   Should show 6 test questions with responses

4. **Check file modifications**:
   Look for these improvements:
   - `ollama_service.py`: Has "dashboard", "sensor", "analytics" in keywords
   - `ollama_service.py`: Prompt includes "⚠️ CRITICAL INSTRUCTIONS"
   - `AIChat.jsx`: Calls `/sensors/latest` before sending to API

---

**Document Version**: 1.0  
**Last Updated**: Quick Test Guide Session  
**Status**: Ready for Testing
