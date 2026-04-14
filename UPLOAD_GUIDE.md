# 📤 Quick Upload Guide for RAG Knowledge Base

## Where to Upload What

### 📊 **CSV Files** → `backend/knowledge_base/datasets/`

Upload CSVs containing:

| Data Type | Example Filename | What It Contains |
|-----------|-----------------|------------------|
| **Weather Data** | `maharashtra_weather_2024.csv` | Monthly temperature, rainfall by district |
| **Crop Yields** | `crop_yields_by_district.csv` | Production statistics by crop and location |
| **Soil Tests** | `soil_health_cards.csv` | NPK values, pH, micronutrients |
| **Market Prices** | `apmc_prices_2024.csv` | Mandi prices for different crops |
| **Irrigation** | `irrigation_schedules.csv` | Water requirements by crop stage |
| **Fertilizer** | `fertilizer_recommendations.csv` | NPK by crop and soil type |
| **Pest Data** | `pest_incidence_data.csv` | Pest outbreaks by season |

**CSV Format Example:**
```csv
crop,district,season,yield_kg_per_hectare,avg_price_per_quintal
wheat,nashik,rabi,2500,2200
rice,thane,kharif,3200,2000
cotton,amravati,kharif,850,6500
```

---

### 📄 **PDF Documents** → `backend/knowledge_base/documents/`

Upload PDFs containing:

| Document Type | Example Filename | Content |
|---------------|-----------------|---------|
| **Research Papers** | `wheat_irrigation_research.pdf` | University studies on crop management |
| **Government Guidelines** | `icar_wheat_recommendations.pdf` | ICAR official farming guidelines |
| **Crop Guides** | `maharashtra_crop_calendar.pdf` | Sowing/harvesting timelines |
| **Climate Studies** | `maharashtra_rainfall_analysis.pdf` | Weather pattern research |
| **Soil Studies** | `soil_health_maharashtra.pdf` | Regional soil health reports |

---

### 📚 **PDF Manuals** → `backend/knowledge_base/manuals/`

Upload PDFs containing:

| Manual Type | Example Filename | Content |
|-------------|-----------------|---------|
| **Equipment Guides** | `drip_irrigation_manual.pdf` | How to setup/maintain irrigation |
| **Organic Farming** | `organic_farming_guide.pdf` | Natural pest control, composting |
| **Pest Management** | `integrated_pest_management.pdf` | IPM strategies |
| **Government Schemes** | `pm_kisan_scheme.pdf` | Subsidy information, eligibility |
| **Best Practices** | `best_practices_cotton.pdf` | Proven farming techniques |

---

## 🚀 How to Upload

### **Method 1: Manual (Drag & Drop)**

Simply copy your files to the appropriate folder:

```bash
# Example: Copy CSV files
copy "C:\Downloads\weather_data.csv" "D:\Himanshu_Project\KrishiDrishti\backend\knowledge_base\datasets\"

# Example: Copy PDF files  
copy "C:\Downloads\crop_guide.pdf" "D:\Himanshu_Project\KrishiDrishti\backend\knowledge_base\documents\"
```

### **Method 2: API Upload**

```bash
# Upload a CSV file
curl -X POST "http://localhost:8000/api/knowledge/upload?category=dataset" \
  -F "file=@weather_data.csv"

# Upload a PDF document
curl -X POST "http://localhost:8000/api/knowledge/upload?category=document" \
  -F "file=@research_paper.pdf"

# Upload a PDF manual
curl -X POST "http://localhost:8000/api/knowledge/upload?category=manual" \
  -F "file=@farming_guide.pdf"
```

### **Method 3: Multiple Files at Once**

```bash
# Upload multiple CSVs
curl -X POST "http://localhost:8000/api/knowledge/upload-batch?category=dataset" \
  -F "files=@weather.csv" \
  -F "files=@yields.csv" \
  -F "files=@prices.csv"
```

---

## ✅ After Uploading

### **Option 1: Restart Backend**
```bash
# Stop current backend (Ctrl+C)
# Restart
cd backend
python run.py
```

The system will automatically:
- ✅ Detect new files
- ✅ Parse CSVs/PDFs
- ✅ Chunk text intelligently
- ✅ Add to ChromaDB
- ✅ Make available for LLM

### **Option 2: API Reload (No Restart)**
```bash
curl -X POST http://localhost:8000/api/knowledge/reload
```

---

## 🔍 Verify Upload

```bash
# List all documents
curl http://localhost:8000/api/knowledge/documents

# Check statistics
curl http://localhost:8000/api/knowledge/stats

# Test search
curl "http://localhost:8000/api/knowledge/search?query=wheat+irrigation"
```

---

## 💡 Naming Best Practices

### ✅ **Good Names (Auto-detects crop & region):**
```
wheat_maharashtra_weather.csv
rice_punjab_yield_data.csv
cotton_irrigation_guide.pdf
maharashtra_soil_health.pdf
pm_kisan_scheme_details.pdf
```

### ❌ **Bad Names (No metadata extraction):**
```
data.csv
file123.pdf
document.pdf
untitled.csv
```

---

## 📝 Sample Files You Should Have

### **Minimum Viable Knowledge Base:**

**CSVs (5 files):**
1. ✅ `crop_statistics_maharashtra.csv` - Already added!
2. ⬜ `weather_data_maharashtra.csv` - Historical weather
3. ⬜ `soil_test_results.csv` - Soil health data
4. ⬜ `market_prices_2024.csv` - APMC prices
5. ⬜ `fertilizer_recommendations.csv` - NPK data

**PDFs (5 files):**
1. ⬜ `wheat_growing_guide.pdf` - Wheat cultivation
2. ⬜ `rice_cultivation_manual.pdf` - Rice growing
3. ⬜ `pest_management.pdf` - Pest control
4. ⬜ `organic_farming_guide.pdf` - Organic methods
5. ⬜ `government_schemes.pdf` - Subsidies info

**Each file adds 10-50 chunks to the knowledge base!**

---

## 🎯 Real-World Impact

### **Before (JSON only - 3 files):**
- Basic crop parameters
- Generic recommendations
- Limited context

### **After (JSON + CSV + PDF - 20+ files):**
- Real yield data from Maharashtra
- Actual weather patterns
- Current market prices
- Research-backed recommendations
- Government scheme awareness
- **10x better LLM answers!**

---

## 🔧 Troubleshooting

### **File Not Loading?**
```bash
# Check file format
- CSV: Must have headers row
- PDF: Must be text-based (not scanned images)
```

### **Chunk Count Seems Low?**
```bash
# Check file size
- Small files (< 1KB) may produce few chunks
- Add more comprehensive data files
```

### **Backend Shows Errors?**
```bash
# Check error messages
- Pandas error: CSV format issue
- PyMuPDF error: Corrupted PDF
- Check file is not open in another program
```

---

## 📞 Quick Commands Reference

```bash
# Upload
POST /api/knowledge/upload?category=dataset

# List
GET /api/knowledge/documents

# Stats
GET /api/knowledge/stats

# Search
GET /api/knowledge/search?query=YOUR_QUERY

# Reload
POST /api/knowledge/reload

# Delete
DELETE /api/knowledge/documents/filename.csv
```

---

**Start uploading your CSV and PDF files now to supercharge your RAG system! 🚀**
