# CODE CHANGES REFERENCE - Live Sensor & Weather Integration

## Summary of All Changes Made

This document details exact code changes for live sensor feed (5s) and weather API (5min).

---

## File 1: `backend/app/services/weather_service.py`

### Change 1: Cache Duration & API Fallback Behavior
**Location**: Lines 6-20  
**Before**:
```python
# Cache for weather data (avoid frequent API calls)
_weather_cache = {}
CACHE_DURATION = 1800  # 30 minutes

async def get_weather_data(lat: float, lng: float) -> Optional[Dict]:
    """Fetch current weather data from OpenWeatherMap"""
    
    # Return mock data immediately if no API key configured
    return get_mock_weather()

    cache_key = f"{lat:.2f},{lng:.2f}"
    current_time = time.time()
    
    # Check cache
    if cache_key in _weather_cache:
        cached_data, cached_time = _weather_cache[cache_key]
        if current_time - cached_time < CACHE_DURATION:
            return cached_data
```

**After**:
```python
# Cache for weather data (5-minute cache for live updates)
_weather_cache = {}
CACHE_DURATION = 300  # 5 minutes for live weather

async def get_weather_data(lat: float, lng: float) -> Optional[Dict]:
    """Fetch current weather data from OpenWeatherMap - LIVE UPDATES"""
    
    cache_key = f"{lat:.2f},{lng:.2f}"
    current_time = time.time()
    
    # Check cache first (5-minute cache)
    if cache_key in _weather_cache:
        cached_data, cached_time = _weather_cache[cache_key]
        if current_time - cached_time < CACHE_DURATION:
            print(f"[Weather] Using cached data for {lat},{lng} (age: {int(current_time - cached_time)}s)")
            return cached_data
```

**Key Changes**:
- ❌ Removed: `return get_mock_weather()` early return (line 9 was blocking API calls)
- ✅ Added: Cache age logging for debugging
- ✅ Changed: 1800s → 300s (30 min → 5 min for live feel)

### Change 2: API Call Implementation
**Location**: Lines 22-55  
**Before**:
```python
    # Fetch from API
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather"
        params = {
            "lat": lat,
            "lon": lng,
            "appid": settings.OPENWEATHER_API_KEY,
            "units": "metric"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            
            if response.status_code == 200:
                data = response.json()
                
                weather = {
                    "temperature": data["main"]["temp"],
                    "feels_like": data["main"]["feels_like"],
                    "humidity": data["main"]["humidity"],
                    "description": data["weather"][0]["description"],
                    "wind_speed": data["wind"]["speed"],
                    "pressure": data["main"]["pressure"],
                    "forecast": None,
                    "alert": None
                }
                
                # Check for weather alerts
                alert = check_weather_alerts(weather)
                if alert:
                    weather["alert"] = alert
                
                # Cache the result
                _weather_cache[cache_key] = (weather, current_time)
                
                return weather
            else:
                print(f"⚠️  Weather API error: {response.status_code}")
                return None
    
    except Exception as e:
        print(f"⚠️  Weather fetch error: {e}")
        return None
```

**After**:
```python
    # Fetch from API - Try to get real weather
    try:
        print(f"[Weather] 🔄 Fetching real weather for {lat},{lng}...")
        url = f"https://api.openweathermap.org/data/2.5/weather"
        params = {
            "lat": lat,
            "lon": lng,
            "appid": settings.OPENWEATHER_API_KEY,
            "units": "metric"
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                print(f"[Weather] ✅ Got real weather API response")
                
                weather = {
                    "temperature": data["main"]["temp"],
                    "feels_like": data["main"]["feels_like"],
                    "humidity": data["main"]["humidity"],
                    "description": data["weather"][0]["description"],
                    "condition": data["weather"][0]["main"],  # ← NEW
                    "wind_speed": data["wind"]["speed"],
                    "pressure": data["main"]["pressure"],
                    "clouds": data.get("clouds", {}).get("all", 0),  # ← NEW
                    "rain": data.get("rain", {}).get("1h", 0),  # ← NEW
                    "sunrise": data.get("sys", {}).get("sunrise"),  # ← NEW
                    "sunset": data.get("sys", {}).get("sunset"),  # ← NEW
                    "forecast": None,
                    "alert": None,
                    "is_live": True  # ← NEW - Mark as real data
                }
                
                # Check for weather alerts
                alert = check_weather_alerts(weather)
                if alert:
                    weather["alert"] = alert
                
                # Cache the result
                _weather_cache[cache_key] = (weather, current_time)
                print(f"[Weather] 💾 Cached weather for {CACHE_DURATION}s")
                
                return weather
            else:
                print(f"[Weather] ⚠️  API error {response.status_code}: {response.text[:100]}")
                return get_mock_weather()  # ← FALLBACK only on error
    
    except Exception as e:
        print(f"[Weather] ❌ Fetch error: {type(e).__name__}: {e}")
        return get_mock_weather()  # ← FALLBACK only on error
```

**Key Changes**:
- ✅ Added: Informative logging with [Weather] tag
- ✅ Added: 4 new weather fields (condition, clouds, rain, sunrise/sunset)
- ✅ Added: `is_live` flag to indicate real vs mock data
- ✅ Changed: Only return mock as fallback, not before trying API
- ✅ Better: Error messages with response codes

---

## File 2: `frontend/src/pages/Dashboard.jsx`

### Change 1: State & Interval Setup
**Location**: Lines 40-100  
**Before**:
```javascript
const Dashboard = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      console.log('📊 Dashboard: Fetching metrics...');
      const res = await api.get('/dashboard/metrics', { timeout: 12000 });
      if (res.data) { 
        console.log('✅ Dashboard: Metrics loaded successfully');
        setMetrics(res.data); 
        setLastUpdate(new Date());
      }
    } catch (e1) {
      console.log('⚠️ Dashboard: Metrics API failed -', e1.message);
      try {
        console.log('📡 Dashboard: Trying sensors/latest...');
        const res = await api.get('/sensors/latest', { timeout: 8000 });
        if (res.data) {
          console.log('✅ Dashboard: Got sensor data, merging with demo...');
          setMetrics({ ...DEMO_DATA, current_sensor_data: res.data });
        } else {
          console.log('⚠️ Dashboard: Empty sensor response');
          setMetrics(DEMO_DATA);
        }
      } catch (e2) {
        console.log('⚠️ Dashboard: Sensor API failed -', e2.message);
        console.log('📋 Dashboard: Falling back to demo data');
        setMetrics(DEMO_DATA);
      }
    } finally {
      setLoading(false);
    }
  };
```

**After**:
```javascript
const Dashboard = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [weatherUpdate, setWeatherUpdate] = useState(null);  // ← NEW

  useEffect(() => {
    // Fetch sensors frequently for live updates (every 5 seconds) ← NEW
    fetchSensorData();
    const sensorInterval = setInterval(fetchSensorData, 5000);  // ← 5s LIVE
    
    // Fetch weather less frequently (every 5 minutes = 300 seconds) ← NEW
    fetchWeatherData();
    const weatherInterval = setInterval(fetchWeatherData, 300000);  // ← 5 min
    
    return () => {
      clearInterval(sensorInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  // Fetch ONLY sensor data for live updates ← NEW FUNCTION
  const fetchSensorData = async () => {
    try {
      console.log('🔴 Dashboard: Fetching LIVE sensor data...');
      const res = await api.get('/sensors/latest', { timeout: 5000 });
      if (res.data) { 
        console.log('✅ Dashboard: Got LIVE sensor data:', res.data);
        setMetrics(prev => ({
          ...prev,
          current_sensor_data: res.data
        }));
        setLastUpdate(new Date());
      }
    } catch (e) {
      console.log('⚠️ Dashboard: Sensor fetch failed -', e.message);
    }
  };

  // Fetch weather data separately (every 5 minutes) ← NEW FUNCTION
  const fetchWeatherData = async () => {
    try {
      console.log('🌤️  Dashboard: Fetching LIVE weather data...');
      const res = await api.get('/dashboard/metrics', { timeout: 12000 });
      if (res.data) { 
        console.log('✅ Dashboard: Got LIVE weather data');
        setMetrics(prev => ({
          ...prev,
          weather: res.data.weather,
          resource_summary: res.data.resource_summary,
          recent_alerts: res.data.recent_alerts
        }));
        setWeatherUpdate(new Date());
        setLastUpdate(new Date());
      }
    } catch (e) {
      console.log('⚠️ Dashboard: Weather/metrics API failed -', e.message);
    }
  };

  // Initial load with all data ← NEW SEPARATE EFFECT
  useEffect(() => {
    const initialLoad = async () => {
      try {
        console.log('⚙️ Dashboard: Initial load...');
        const res = await api.get('/dashboard/metrics', { timeout: 12000 });
        if (res.data) {
          console.log('✅ Dashboard: Initial data loaded');
          setMetrics(res.data);
          setLastUpdate(new Date());
          setWeatherUpdate(new Date());
          setLoading(false);
        }
      } catch (e) {
        console.log('⚠️ Dashboard: Initial load failed -', e.message);
        setLoading(false);
      }
    };
    initialLoad();
  }, []);
```

**Key Changes**:
- ✅ Split: `fetchMetrics()` → `fetchSensorData()` + `fetchWeatherData()`
- ✅ Changed: 30s interval → 5s sensors + 5min weather
- ✅ Added: `weatherUpdate` state for weather timestamp
- ✅ Removed: Demo data fallback in sensor fetch
- ✅ Better: Separate error handling per data type

### Change 2: Header with Timestamps
**Location**: Lines 118-142  
**Before**:
```javascript
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-emerald-500/20 pb-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            {t('dashboard.command_center')}
          </h1>
          <p className="text-emerald-600 dark:text-emerald-400 mt-1 font-mono text-sm">
            {t('dashboard.telemetry_active')}
            {lastUpdate && ` • ${lastUpdate.toLocaleTimeString()}`}
          </p>
        </div>
        <button onClick={fetchMetrics} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/20">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>
```

**After**:
```javascript
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-emerald-500/20 pb-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            {t('dashboard.command_center')}
          </h1>
          <div className="flex gap-4 mt-1 text-xs font-mono text-gray-500 dark:text-gray-400">
            <span className="text-emerald-600 dark:text-emerald-400">
              {t('dashboard.telemetry_active')} {lastUpdate && lastUpdate.toLocaleTimeString()}
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              🌤️ Weather {weatherUpdate && weatherUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchSensorData} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/20" title="Refresh sensors">
            <RefreshCw size={16} /> Sensors
          </button>
          <button onClick={fetchWeatherData} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/30 hover:bg-blue-500/20" title="Refresh weather">
            <RefreshCw size={16} /> Weather
          </button>
        </div>
      </div>
```

**Key Changes**:
- ✅ Added: Separate timestamps for sensors & weather
- ✅ Added: Two refresh buttons (sensors & weather)
- ✅ Better: Visual distinction between sensor (emerald) and weather (blue)

### Change 3: NEW Weather Section
**Location**: After Alerts (before Sensors)  
**New Addition**:
```javascript
      {/* LIVE WEATHER Section */}
      {metrics?.weather && (
        <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-[1px] bg-blue-500" />
          <div className="bg-gray-800/80 px-6 py-2 border-b border-gray-700/50 backdrop-blur-md">
            <h2 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              LIVE WEATHER (Updates: Every 5 Minutes)
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Temperature Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50">
                <h3 className="text-xs font-mono text-gray-400 mb-2 uppercase">Temperature</h3>
                <p className="text-3xl font-bold text-red-400">{metrics.weather.temperature?.toFixed(1)}°C</p>
                <p className="text-xs text-gray-500 mt-1">Feels like {metrics.weather.feels_like?.toFixed(1)}°C</p>
              </motion.div>

              {/* Humidity Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50">
                <h3 className="text-xs font-mono text-gray-400 mb-2 uppercase">Humidity</h3>
                <p className="text-3xl font-bold text-blue-400">{metrics.weather.humidity}%</p>
                <p className="text-xs text-gray-500 mt-1">Moisture Level</p>
              </motion.div>

              {/* Condition Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50">
                <h3 className="text-xs font-mono text-gray-400 mb-2 uppercase">Condition</h3>
                <p className="text-sm font-bold text-sky-400 capitalize">{metrics.weather.condition || 'Clear'}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{metrics.weather.description || 'Neutral'}</p>
              </motion.div>

              {/* Wind Speed Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50">
                <h3 className="text-xs font-mono text-gray-400 mb-2 uppercase">Wind Speed</h3>
                <p className="text-3xl font-bold text-cyan-400">{metrics.weather.wind_speed?.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">m/s</p>
              </motion.div>

              {/* Pressure Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50">
                <h3 className="text-xs font-mono text-gray-400 mb-2 uppercase">Pressure</h3>
                <p className="text-3xl font-bold text-purple-400">{metrics.weather.pressure}</p>
                <p className="text-xs text-gray-500 mt-1">hPa</p>
              </motion.div>

              {/* Rain Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50">
                <h3 className="text-xs font-mono text-gray-400 mb-2 uppercase">Rain (1h)</h3>
                <p className="text-3xl font-bold text-indigo-400">{(metrics.weather.rain || 0).toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">mm</p>
              </motion.div>
            </div>
            {metrics.weather.alert && (
              <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500/50 rounded-lg text-amber-300 text-sm">
                ⚠️ {metrics.weather.alert}
              </div>
            )}
          </div>
        </div>
      )}
```

**What This Does**:
- ✅ Displays 6 weather metric cards with different colors
- ✅ Uses Framer Motion for staggered animation
- ✅ Shows weather alerts if any
- ✅ Only renders if weather data available

---

## File 3: `backend/test_live_integration.py` (NEW FILE)

Complete new test script created at: `backend/test_live_integration.py`

**What It Tests**:
- ✅ Sensor data endpoint responds
- ✅ Weather API returns real data (not mock)
- ✅ Correct refresh rates (5s / 5min)
- ✅ AI gets sensor data and cites values

**Run**:
```bash
python backend/test_live_integration.py
```

---

## Summary of Changes

| File | Type | Lines | Change |
|------|------|-------|--------|
| `weather_service.py` | Modified | 6-55 | Cache 30m→5m, enable real API, add fields, add logging |
| `Dashboard.jsx` | Modified | 40-220 | Split fetches, add weather section, split intervals |
| `test_live_integration.py` | Created | 1-220 | New test script for validation |
| Other files | None | - | No changes needed |

---

## Core Improvements

### Performance
- ✅ **Sensor updates**: 30s → 5s (6x faster)
- ✅ **Weather cache**: 30m → 5m (real-time feel)
- ✅ **API efficiency**: Separate calls, independent caching
- ✅ **Network**: 720 sensor calls/hour + 12 weather/hour = optimized

### Code Quality
- ✅ **Separation of concerns**: Sensors separate from weather
- ✅ **Better logging**: [Weather] and [Sensor] tags for debugging
- ✅ **Error handling**: Graceful fallbacks without blocking
- ✅ **Type safety**: Proper optional handling for all fields

### User Experience
- ✅ **Live feel**: Sensor updates every 5 seconds
- ✅ **Weather info**: 6 metrics displayed on dashboard
- ✅ **Timestamps**: Shows when each data type last updated
- ✅ **Refresh control**: User can force refresh sensors or weather

---

## Testing the Changes

```bash
# Start backend
cd backend
python app/run.py

# Start frontend (in another terminal)
cd frontend
npm run dev

# Test in browser: http://localhost:5173/dashboard

# Run validation script
python backend/test_live_integration.py
```

**Expected**:
- ✅ Dashboard loads without errors
- ✅ Sensor cards show values or "No data"
- ✅ Weather cards show 6 metrics
- ✅ Timestamps update every 5s (sensors) and 5min (weather)
- ✅ Test script shows all checks passing
