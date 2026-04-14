"""
Knowledge Base Management Routes
Upload, list, delete, and manage CSV/PDF documents for RAG
"""

import os
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import JSONResponse
from typing import Optional
from pydantic import BaseModel

from app.services import rag_service
from app.services.document_processor import DocumentProcessor

router = APIRouter(prefix="/api/knowledge", tags=["knowledge"])


class UploadResponse(BaseModel):
    status: str
    message: str
    file_name: str
    file_size: int
    chunks_created: int


class DocumentInfo(BaseModel):
    name: str
    type: str
    size: int
    location: str


@router.post("/upload", response_model=UploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    category: str = Query("document", description="Category: document, dataset, or manual")
):
    """
    Upload a CSV or PDF file to the knowledge base
    
    - **file**: The CSV or PDF file to upload
    - **category**: Where to store it (document/dataset/manual)
    """
    # Validate file type
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ['.csv', '.pdf']:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file_ext}. Only CSV and PDF are supported."
        )
    
    # Validate category
    if category not in ['document', 'dataset', 'manual']:
        category = 'document'
    
    # Determine save location
    kb_path = Path("knowledge_base")
    save_dir = kb_path / f"{category}s"
    save_dir.mkdir(parents=True, exist_ok=True)
    
    file_path = save_dir / file.filename
    
    # Save file
    try:
        file_size = 0
        with open(file_path, "wb") as buffer:
            while chunk := await file.read(8192):
                buffer.write(chunk)
                file_size += len(chunk)
        
        print(f"✅ Saved file: {file_path} ({file_size} bytes)")
        
        # Process the file
        processor = DocumentProcessor(str(kb_path))
        chunks = processor.process_file(str(file_path), category)
        
        # Add chunks to ChromaDB
        if rag_service.collection is not None:
            documents = [chunk.text for chunk in chunks]
            metadatas = [chunk.metadata for chunk in chunks]
            ids = [chunk.chunk_id for chunk in chunks]
            
            if documents:
                rag_service.collection.add(
                    documents=documents,
                    metadatas=metadatas,
                    ids=ids
                )
        
        return UploadResponse(
            status="success",
            message=f"Successfully uploaded and processed {file.filename}",
            file_name=file.filename,
            file_size=file_size,
            chunks_created=len(chunks)
        )
        
    except Exception as e:
        # Clean up on error
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@router.post("/upload-batch")
async def upload_multiple_documents(
    files: list[UploadFile] = File(...),
    category: str = Query("document", description="Category: document, dataset, or manual")
):
    """Upload multiple CSV or PDF files at once"""
    results = []
    
    for file in files:
        try:
            # Re-read file for each iteration
            await file.seek(0)
            
            result = await upload_document(file=file, category=category)
            results.append({
                "file": file.filename,
                "status": "success",
                "chunks": result.chunks_created
            })
        except Exception as e:
            results.append({
                "file": file.filename,
                "status": "error",
                "error": str(e)
            })
    
    return {
        "status": "completed",
        "total": len(files),
        "results": results
    }


@router.get("/documents")
async def list_documents():
    """List all documents in the knowledge base"""
    kb_path = Path("knowledge_base")
    documents = []
    
    for category in ['documents', 'datasets', 'manuals']:
        category_path = kb_path / category
        if category_path.exists():
            for file_path in category_path.iterdir():
                if file_path.is_file():
                    stat = file_path.stat()
                    documents.append({
                        "name": file_path.name,
                        "type": file_path.suffix.lower(),
                        "category": category,
                        "size_bytes": stat.st_size,
                        "modified": stat.st_mtime
                    })
    
    return {
        "total": len(documents),
        "documents": documents
    }


@router.delete("/documents/{filename}")
async def delete_document(filename: str):
    """Delete a document from the knowledge base"""
    kb_path = Path("knowledge_base")
    
    # Find the file
    file_path = None
    for category in ['documents', 'datasets', 'manuals']:
        potential_path = kb_path / category / filename
        if potential_path.exists():
            file_path = potential_path
            break
    
    if not file_path:
        raise HTTPException(status_code=404, detail=f"File not found: {filename}")
    
    try:
        # Delete file
        file_path.unlink()
        
        # Delete from ChromaDB (all chunks with this source_file)
        if rag_service.collection is not None:
            doc_id_base = Path(filename).stem
            # Delete all chunks that start with this doc_id
            try:
                # Get all documents and filter
                all_docs = rag_service.collection.get()
                ids_to_delete = [
                    doc_id for doc_id in all_docs['ids']
                    if doc_id.startswith(doc_id_base)
                ]
                
                if ids_to_delete:
                    rag_service.collection.delete(ids=ids_to_delete)
                    print(f"🗑️  Deleted {len(ids_to_delete)} chunks from ChromaDB")
            except Exception as e:
                print(f"⚠️  Error deleting from ChromaDB: {e}")
        
        return {
            "status": "success",
            "message": f"Deleted {filename}",
            "file": filename
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting file: {str(e)}")


@router.post("/reload")
async def reload_knowledge_base():
    """
    Reload the entire knowledge base
    
    This will:
    1. Delete the current ChromaDB collection
    2. Re-process all JSON, CSV, and PDF files
    3. Rebuild the vector index
    """
    try:
        result = await rag_service.reload_knowledge_base()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reloading: {str(e)}")


@router.get("/stats")
async def knowledge_stats():
    """Get knowledge base statistics"""
    try:
        stats = await rag_service.get_knowledge_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")


@router.get("/search")
async def search_knowledge(
    query: str = Query(..., description="Search query"),
    n_results: int = Query(5, description="Number of results"),
    crop: Optional[str] = Query(None, description="Filter by crop type")
):
    """Search the knowledge base"""
    try:
        filters = {}
        if crop:
            filters["crop"] = crop
        
        results = await rag_service.retrieve(query, n_results=n_results, filters=filters)
        
        return {
            "query": query,
            "results_count": len(results),
            "documents": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")
