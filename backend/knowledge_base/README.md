# 📚 KrishiDrishti Knowledge Base

This directory contains all agricultural knowledge for the RAG (Retrieval-Augmented Generation) system.

## 📁 Directory Structure

```
knowledge_base/
├── crops/              # JSON crop configuration files
├── documents/          # PDF documents (research papers, guides)
├── datasets/           # CSV files (weather data, soil data, yields)
└── manuals/            # PDF manuals (equipment, best practices)
```

## 📤 How to Add Knowledge

### **Method 1: Manual Upload (Recommended)**

Simply place your files in the appropriate folder:

1. **PDF Documents** → `documents/`
   - Research papers
   - University publications
   - Government farming guidelines
   - Crop-specific guides

2. **CSV Datasets** → `datasets/`
   - Historical weather data
   - Crop yield statistics
   - Soil test results
   - Market prices
   - Irrigation schedules

3. **PDF Manuals** → `manuals/`
   - Equipment manuals
   - Organic farming guides
   - Pest management guides
   - Government schemes info

### **Method 2: API Upload**

Use the API to upload files programmatically:

```bash
# Upload a single file
curl -X POST "http://localhost:8000/api/knowledge/upload?category=document" \
  -F "file=@/path/to/your/file.pdf"

# Upload multiple files
curl -X POST "http://localhost:8000/api/knowledge/upload-batch?category=dataset" \
  -F "files=@file1.csv" \
  -F "files=@file2.csv"
```

### **Method 3: API Endpoints**

```python
import requests

# Upload file
with open('wheat_data.csv', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/api/knowledge/upload',
        params={'category': 'dataset'},
        files={'file': f}
    )

# List all documents
response = requests.get('http://localhost:8000/api/knowledge/documents')

# Get statistics
response = requests.get('http://localhost:8000/api/knowledge/stats')

# Search knowledge
response = requests.get(
    'http://localhost:8000/api/knowledge/search',
    params={'query': 'wheat irrigation maharashtra', 'n_results': 5}
)

# Reload entire knowledge base
response = requests.post('http://localhost:8000/api/knowledge/reload')
```

## 📊 Supported File Formats

### **CSV Files**
Should contain structured agricultural data:

```csv
crop,season,temperature_min,temperature_max,rainfall_mm,yield_kg_per_acre
wheat,rabi,10,25,350,1800
rice,kharif,20,35,1200,2200
cotton,kharif,18,35,600,800
```

### **PDF Files**
Can contain:
- Research papers
- Technical guides
- Best practices
- Government publications
- University extension materials

## 🔄 Auto-Loading

The system automatically:
1. ✅ Loads all files on backend startup
2. ✅ Parses PDFs and extracts text
3. ✅ Converts CSVs to structured text
4. ✅ Chunks text intelligently (500 tokens, 50 overlap)
5. ✅ Adds to ChromaDB vector store
6. ✅ Makes available for LLM context

## 🎯 What Gets Extracted

### **From CSVs:**
- Column statistics
- Structured records
- Crop-specific data
- Regional information

### **From PDFs:**
- Full text content
- Page-by-page chunks
- Metadata extraction
- Crop & region detection

### **Smart Metadata:**
- Crop type (wheat, rice, cotton, etc.)
- Region (maharashtra, punjab, etc.)
- Document category
- Source file tracking

## 🛠️ Management Commands

```bash
# List all documents
GET /api/knowledge/documents

# Get knowledge statistics
GET /api/knowledge/stats

# Search knowledge base
GET /api/knowledge/search?query=wheat+irrigation&n_results=5

# Delete a document
DELETE /api/knowledge/documents/wheat_data.csv

# Reload entire knowledge base
POST /api/knowledge/reload
```

## 💡 Best Practices

1. **File Naming**: Include crop and region in filename
   - ✅ `wheat_maharashtra_weather.csv`
   - ✅ `rice_irrigation_guide.pdf`
   - ❌ `data123.csv`

2. **CSV Structure**: Use clear column names
   - `crop`, `season`, `temperature`, `rainfall`, `yield`

3. **PDF Quality**: Use text-based PDFs (not scanned images)

4. **Organize by Type**:
   - Research papers → `documents/`
   - Data tables → `datasets/`
   - How-to guides → `manuals/`

5. **Keep Updated**: Add new research and data regularly

## 🔍 How RAG Uses This

When a farmer asks: *"Should I irrigate my wheat crop?"*

The system:
1. Searches ChromaDB for relevant documents
2. Retrieves top 3 matching chunks from CSVs/PDFs/JSON
3. Combines with current sensor data
4. Sends rich context to LLM (Qwen 2.5)
5. Returns informed, data-driven advice

## 📈 Impact

More knowledge = Better recommendations!

- **JSON files**: Basic crop parameters (3 files)
- **CSVs**: Real data, statistics, trends
- **PDFs**: Research insights, best practices

The LLM gets smarter with every document you add! 🚀
