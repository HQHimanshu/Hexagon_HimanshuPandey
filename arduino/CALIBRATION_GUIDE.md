# 🔧 KrishiDrishti Sensor Calibration Guide

## ⚠️ Important: Calibrate BEFORE using sensors!

---

## 📋 What You'll Need:
1. Arduino connected to sensors
2. USB cable to computer
3. Arduino IDE with Serial Monitor
4. A glass of water (for soil sensor)

**Note:** Your rain sensor module is **digital-only**, so no analog calibration needed!

---

## 🎯 Step-by-Step Calibration:

### **Step 1: Upload Calibration Sketch**
1. Open `calibrate_sensors.ino` in Arduino IDE
2. Upload to your Arduino
3. Open Serial Monitor (set baud to **115200**)

### **Step 2: Calibrate Soil Moisture Sensor**
1. **Keep sensor in AIR** (completely dry)
2. Wait 10 seconds
3. Note the **"DRY VALUE"** shown in Serial Monitor
4. **Put sensor in WATER** (fully submerged)
5. Wait 10 seconds  
6. Note the **"WET VALUE"** shown in Serial Monitor

### **Step 3: Rain Sensor (Digital - No Calibration Needed)**
Your rain sensor is digital, so it automatically calibrates itself via the onboard potentiometer:
- **If too sensitive** (false rain detection): Turn the potentiometer **clockwise** to decrease sensitivity
- **If not sensitive enough**: Turn the potentiometer **counter-clockwise** to increase sensitivity

The debouncing logic in the code already prevents false positives (needs 3 consecutive readings = 15 seconds).

### **Step 4: Update sensor_node.ino**
Open `sensor_node.ino` and update these values:

```cpp
// Soil Moisture Calibration (from Step 2)
const int SOIL_MOISTURE_DRY = 800;    // Replace with YOUR dry value
const int SOIL_MOISTURE_WET = 300;    // Replace with YOUR wet value

// Rain Sensor (Digital - No threshold needed, just debouncing)
const int RAIN_DEBOUNCE_COUNT = 3;    // Keep as is (3 consecutive readings = 15s)
```

### **Step 5: Upload Main Firmware**
1. Open `sensor_node.ino` in Arduino IDE
2. Upload to your Arduino
3. The system will now use your calibrated values!

---

## 🔍 Understanding the Values:

### **Soil Moisture:**
- **Higher ADC** = Drier soil (less conductive)
- **Lower ADC** = Wetter soil (more conductive)
- Typical range: 300 (wet) to 800 (dry)

### **Rain Sensor:**
- **Lower ADC** = Dry (no water on pads)
- **Higher ADC** = Wet (water conducts electricity)
- Set threshold BETWEEN dry and wet values

### **Rain Debouncing:**
- `RAIN_DEBOUNCE_COUNT = 3` means the sensor must detect rain for 3 consecutive readings (15 seconds) before confirming rain
- This prevents false positives from humidity/dust

---

## 🎓 Example Calibration:

**Soil Moisture:**
- In Air (Dry): 850
- In Water (Wet): 280
- Update: `SOIL_MOISTURE_DRY = 850`, `SOIL_MOISTURE_WET = 280`

**Rain Sensor:**
- Digital sensor - no calibration needed!
- Adjust sensitivity using the blue potentiometer on the module
- Debouncing is already handled in code (15 seconds confirmation)

---

## ❓ Troubleshooting:

**Problem: Rain still shows "YES" indoors**
- Solution: Turn the blue potentiometer on rain sensor module **clockwise** (decrease sensitivity)
- The debouncing already requires 15 seconds of continuous detection

**Problem: Soil moisture always shows 0% or 100%**
- Solution: Your calibration values are wrong - recalibrate!

**Problem: Sensors giving erratic readings**
- Solution: Check wiring and connections

---

## 📌 Quick Reference:

| Sensor | Pin | Type | Notes |
|--------|-----|------|-------|
| DHT11 | Pin 2 | Digital | Temperature & Humidity |
| Soil Moisture | A0 | Analog | Needs calibration |
| Rain Sensor | D3 | Digital | Debounced (15s confirmation) |

**Note:** pH level requires a dedicated pH sensor module - soil moisture sensor CANNOT measure pH!
