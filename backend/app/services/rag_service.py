import json
import os
from typing import List, Dict, Optional
import chromadb
from chromadb.config import Settings as ChromaSettings
from app.config import settings


# Initialize ChromaDB client
client = chromadb.PersistentClient(
    path="./chroma_db",
    settings=ChromaSettings(anonymized_telemetry=False)
)

collection = None


async def init_knowledge_base():
    """Initialize the RAG knowledge base with crop data"""
    global collection
    
    collection_name = settings.RAG_COLLECTION_NAME
    
    # Get or create collection
    try:
        collection = client.get_collection(name=collection_name)
        print(f"✅ Loaded existing collection: {collection_name}")
    except:
        collection = client.create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        print(f"📚 Created new collection: {collection_name}")
        
        # Load knowledge base from JSON files
        await load_crop_knowledge()


async def load_crop_knowledge():
    """Load crop knowledge from JSON files into ChromaDB"""
    global collection
    
    if collection is None:
        print("⚠️  Collection not initialized")
        return
    
    # Load from knowledge_base directory
    kb_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "knowledge_base", "crops")
    
    if not os.path.exists(kb_dir):
        print(f"⚠️  Knowledge base directory not found: {kb_dir}")
        return
    
    documents = []
    metadatas = []
    ids = []
    
    # Load each JSON file
    for filename in os.listdir(kb_dir):
        if filename.endswith('.json'):
            filepath = os.path.join(kb_dir, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    crop_data = json.load(f)
                
                # Create document from crop data
                doc_parts = []
                crop_name = crop_data.get("crop", "unknown")
                region = crop_data.get("region", "unknown")
                
                doc_parts.append(f"Crop: {crop_name}")
                doc_parts.append(f"Region: {region}")
                
                if "temperature" in crop_data:
                    temp = crop_data["temperature"]
                    doc_parts.append(f"Temperature range: {temp.get('min', 'N/A')}°C - {temp.get('max', 'N/A')}°C")
                
                if "soil_moisture" in crop_data:
                    moisture = crop_data["soil_moisture"]
                    doc_parts.append(f"Soil moisture: {moisture.get('optimal_min', 'N/A')}% - {moisture.get('optimal_max', 'N/A')}%")
                
                if "ph_range" in crop_data:
                    ph = crop_data["ph_range"]
                    doc_parts.append(f"pH range: {ph.get('min', 'N/A')} - {ph.get('max', 'N/A')}")
                
                if "irrigation" in crop_data:
                    irr = crop_data["irrigation"]
                    doc_parts.append(f"Irrigation: {irr.get('frequency', 'N/A')}, {irr.get('method', 'N/A')}")
                
                if "fertilizer" in crop_data:
                    fert = crop_data["fertilizer"]
                    doc_parts.append(f"Fertilizer: {fert.get('type', 'N/A')}, {fert.get('amount', 'N/A')} per acre")
                
                if "alerts" in crop_data:
                    alerts = crop_data["alerts"]
                    doc_parts.append(f"Critical alerts: {', '.join(alerts)}")
                
                document = ". ".join(doc_parts)
                
                documents.append(document)
                metadatas.append({
                    "crop": crop_name,
                    "region": region,
                    "source": filename
                })
                ids.append(f"{crop_name}_{region}")
                
            except Exception as e:
                print(f"⚠️  Error loading {filename}: {e}")
    
    # Add to collection
    if documents:
        collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        print(f"✅ Loaded {len(documents)} crop knowledge documents")


async def retrieve(query: str, n_results: int = 3, filters: Optional[Dict] = None) -> List[str]:
    """Retrieve relevant crop knowledge from ChromaDB"""
    global collection
    
    if collection is None:
        return []
    
    where = None
    if filters:
        where = {}
        for key, value in filters.items():
            where[key] = {"$eq": value}
    
    try:
        results = collection.query(
            query_texts=[query],
            n_results=n_results,
            where=where
        )
        
        if results and results.get('documents'):
            return results['documents'][0]
        return []
    except Exception as e:
        print(f"⚠️  RAG retrieval error: {e}")
        return []


async def add_document(document: str, metadata: Dict, doc_id: str):
    """Add a new document to the knowledge base"""
    global collection
    
    if collection is None:
        return
    
    collection.add(
        documents=[document],
        metadatas=[metadata],
        ids=[doc_id]
    )
