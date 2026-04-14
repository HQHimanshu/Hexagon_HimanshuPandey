# 📷 Sensor Wiring Diagram Images

## Where to Drop Your Images

Place your sensor wiring diagram images in this directory:

```
frontend/public/images/sensors/
```

## Required Image Files

You need to create/add these 3 images:

### 1. DHT11 Wiring Diagram
- **Filename:** `dht11-wiring.jpg` (or `.png`)
- **Content:** Photo/diagram showing DHT11 connections to Arduino
  - VCC → 5V
  - GND → GND  
  - DATA → Digital Pin 2
- **Recommended size:** 800x600 pixels
- **Format:** JPG or PNG

### 2. Soil Moisture Sensor Wiring Diagram
- **Filename:** `soil-moisture-wiring.jpg` (or `.png`)
- **Content:** Photo/diagram showing soil moisture sensor connections
  - VCC → 5V
  - GND → GND
  - AOUT → Analog Pin A0
- **Recommended size:** 800x600 pixels
- **Format:** JPG or PNG

### 3. Rain Sensor Wiring Diagram
- **Filename:** `rain-sensor-wiring.jpg` (or `.png`)
- **Content:** Photo/diagram showing rain sensor connections
  - VCC → 5V
  - GND → GND
  - D0 → Digital Pin 3
- **Recommended size:** 800x600 pixels
- **Format:** JPG or PNG

---

## How to Add Images

### Option 1: Take Photos
1. Set up your Arduino with the sensor
2. Take a clear photo of the wiring connections
3. Rename the file to match the required filename
4. Copy it to: `frontend/public/images/sensors/`

### Option 2: Use Fritzing Diagrams
1. Download [Fritzing](https://fritzing.org/) (free software)
2. Create wiring diagrams for each sensor
3. Export as PNG/JPG
4. Save to this directory

### Option 3: Use Existing Diagrams
1. If you have existing wiring diagrams from tutorials
2. Rename them to match the required filenames
3. Place them in this folder

---

## Current Directory Structure

```
frontend/
  public/
    images/
      sensors/
        ├── dht11-wiring.jpg        ← Add this
        ├── soil-moisture-wiring.jpg ← Add this
        └── rain-sensor-wiring.jpg   ← Add this
```

---

## Tips for Good Images

✅ **DO:**
- Use good lighting (natural light is best)
- Show all wires clearly
- Label wires if possible
- Include both Arduino and sensor module in frame
- Keep background simple/contrasting

❌ **DON'T:**
- Use blurry or dark photos
- Cut off any connections
- Show only part of the circuit
- Use busy/cluttered backgrounds

---

## After Adding Images

1. Images will automatically appear on the Sensor Guide pages
2. Visit `http://localhost:5173/sensors` to see the Sensors page
3. Click on any sensor to view its detailed guide with wiring diagram

---

## Optional: Additional Images

You can also add these for better documentation:

- `dht11-module.jpg` - Close-up of DHT11 module
- `soil-moisture-probe.jpg` - Close-up of soil moisture probe
- `rain-sensor-pad.jpg` - Close-up of rain detection pad
- `arduino-complete.jpg` - Full setup with all sensors connected

These can be linked from the individual sensor detail pages.
