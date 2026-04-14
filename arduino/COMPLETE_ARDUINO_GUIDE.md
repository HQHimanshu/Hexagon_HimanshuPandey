# 🔧 KrishiDrishti Arduino Code - Complete Reference

## For Farmers Who Want to Calibrate Their Sensors

This document contains the complete Arduino code and step-by-step instructions for setting up your KrishiDrishti sensor system.

---

## 📦 What You Need

### Hardware
- Arduino Uno/Nano/Mega (1x)
- DHT11 Temperature & Humidity Sensor (1x)
- Soil Moisture Sensor Module (1x)
- Rain Detection Sensor Module (1x)
- Jumper wires (Female-to-Female, at least 9)
- USB cable for Arduino
- Breadboard (optional, for cleaner connections)

### Software
- [Arduino IDE](https://www.arduino.cc/en/software) (download and install)
- DHT Library (install via Arduino IDE Library Manager)
- ArduinoJson Library (install via Arduino IDE Library Manager)

---

## 🔌 Complete Wiring Guide

### DHT11 Connections
| DHT11 Pin | Arduino Pin | Wire Color |
|-----------|-------------|------------|
| VCC       | 5V          | Red        |
| GND       | GND         | Black      |
| DATA      | Digital 2   | Yellow     |

### Soil Moisture Sensor Connections
| Soil Sensor Pin | Arduino Pin | Wire Color |
|-----------------|-------------|------------|
| VCC             | 5V          | Red        |
| GND             | GND         | Black      |
| AOUT            | Analog A0   | Green      |

### Rain Sensor Connections
| Rain Sensor Pin | Arduino Pin | Wire Color |
|-----------------|-------------|------------|
| VCC             | 5V          | Red        |
| GND             | GND         | Black      |
| D0 (Digital Out)| Digital 3   | Yellow     |

---

## 📄 Complete Arduino Code

The complete code is located at: `arduino/sensor_node.ino`

### Key Features:
✅ Reads DHT11 temperature & humidity every 5 seconds
✅ Reads soil moisture analog value (live)
✅ Reads rain sensor digital value with 15-second debouncing
✅ Outputs JSON over USB serial (9600 baud)
✅ Error handling with last valid value recovery

### Code Location in Project:
```
KrishiDrishti/
  arduino/
    ├── sensor_node.ino       ← Main firmware
    ├── calibrate_sensors.ino ← Calibration tool
    └── CALIBRATION_GUIDE.md  ← Detailed guide
```

---

## 🎯 Step-by-Step Calibration

### Step 1: Install Libraries
1. Open Arduino IDE
2. Go to **Sketch → Include Library → Manage Libraries**
3. Search for "DHT sensor library" by Adafruit → Install
4. Search for "ArduinoJson" → Install

### Step 2: Calibrate Soil Moisture
1. Open `calibrate_sensors.ino` from `arduino/` folder
2. Upload to Arduino
3. Open Serial Monitor (Ctrl+Shift+M)
4. Set baud rate to **115200**
5. Hold sensor in AIR → Note DRY value
6. Put sensor in WATER → Note WET value
7. Open `sensor_node.ino`
8. Update these lines:
   ```cpp
   const int SOIL_MOISTURE_DRY = 850;  // Your dry value
   const int SOIL_MOISTURE_WET = 280;  // Your wet value
   ```

### Step 3: Test Rain Sensor
1. Upload `sensor_node.ino` to Arduino
2. Open Serial Monitor at **9600 baud**
3. Keep rain sensor dry → Should show "NO"
4. Add water drops → After 15 seconds, should show "YES"
5. If too sensitive: Turn potentiometer CLOCKWISE
6. If not sensitive: Turn potentiometer COUNTER-CLOCKWISE

### Step 4: Start USB Bridge
1. Close Serial Monitor (important!)
2. Run `start_arduino_bridge.bat` from project root
3. The bridge will connect to COM5 and send data to backend

---

## 📊 Understanding Your Sensor Readings

### Temperature (DHT11)
- **Range:** 0-50°C
- **Accuracy:** ±2°C
- **Good for crops:** 15-35°C
- **Alert if:** >40°C (heat stress)

### Humidity (DHT11)
- **Range:** 20-90%
- **Accuracy:** ±5%
- **Good for crops:** 40-70%
- **Alert if:** >80% (disease risk)

### Soil Moisture
- **Range:** 0-1023 ADC (converted to 0-100%)
- **Dry soil:** 700-1023 ADC
- **Wet soil:** 0-400 ADC
- **Alert if:** >700 ADC (needs irrigation)

### Rain Detection
- **Digital:** YES or NO
- **Debouncing:** 15 seconds (prevents false alarms)
- **Use:** Disable irrigation when raining

---

## 🛠️ Troubleshooting

### No Data in Dashboard
1. Check Arduino is powered and connected
2. Verify USB Serial Bridge is running (`start_arduino_bridge.bat`)
3. Check backend is running on port 8000
4. Verify you're logged in at `http://localhost:5173`

### Wrong Temperature/Humidity
1. Check DHT11 wiring (DATA → Pin 2)
2. Ensure DHT library is installed
3. Move sensor away from heat sources
4. Allow 2-3 minutes for stabilization

### Soil Moisture Always 0% or 100%
1. **Re-calibrate!** - Your soil sensor is unique
2. Run `calibrate_sensors.ino`
3. Update DRY and WET values in `sensor_node.ino`
4. Check AOUT wire connection to Pin A0

### Rain Always YES or NO
1. Adjust the blue potentiometer on rain sensor module
2. **CLOCKWISE** = Less sensitive
3. **COUNTER-CLOCKWISE** = More sensitive
4. Clean sensor pad if dirty

---

## 📱 Where to Get Help

1. **Sensor Guide Page:** Visit `http://localhost:5173/sensors` in your app
2. **Individual Sensor Guides:** Click on any sensor for detailed wiring, code, and troubleshooting
3. **Arduino Documentation:** [arduino.cc](https://www.arduino.cc/)
4. **DHT11 Datasheet:** Included in library examples

---

## 🔄 Updating Code

If you need to modify the sensor code:

1. Edit `arduino/sensor_node.ino`
2. Change pin numbers or calibration values as needed
3. Upload to Arduino via Arduino IDE
4. Restart USB Serial Bridge
5. New readings will appear in dashboard

**Important:** After any code changes, always:
- Close Serial Monitor before starting bridge
- Verify baud rate is 9600 in code
- Check all sensor values appear correctly

---

## 🌾 Happy Farming!

Your KrishiDrishti system is now ready to help you make smart farming decisions!

For detailed visual guides with wiring diagrams, visit the **Sensors** page in your app.
