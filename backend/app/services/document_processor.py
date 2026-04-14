"""
Document Processor for RAG Pipeline
Handles PDF and CSV parsing, chunking, and metadata extraction
"""

import os
import csv
import re
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime

try:
    import fitz  # PyMuPDF
    PDF_SUPPORT = True
except ImportError:
    PDF_SUPPORT = False
    print("Warning: PyMuPDF not installed. PDF support disabled.")

try:
    import pandas as pd
    CSV_SUPPORT = True
except ImportError:
    CSV_SUPPORT = False
    print("Warning: Pandas not installed. CSV support disabled.")


class DocumentChunk:
    """Represents a chunk of text from a document"""
    
    def __init__(self, text: str, metadata: Dict[str, Any], chunk_id: str):
        self.text = text
        self.metadata = metadata
        self.chunk_id = chunk_id


class DocumentProcessor:
    """Process PDF and CSV documents for RAG"""
    
    def __init__(self, knowledge_base_path: str = "knowledge_base"):
        self.knowledge_base_path = Path(knowledge_base_path)
        self.documents_path = self.knowledge_base_path / "documents"
        self.datasets_path = self.knowledge_base_path / "datasets"
        self.manuals_path = self.knowledge_base_path / "manuals"
        
        # Chunking parameters
        self.chunk_size = 500  # tokens
        self.chunk_overlap = 50  # tokens overlap
        
        # Ensure directories exist
        self.documents_path.mkdir(parents=True, exist_ok=True)
        self.datasets_path.mkdir(parents=True, exist_ok=True)
        self.manuals_path.mkdir(parents=True, exist_ok=True)
    
    def process_all_documents(self) -> List[DocumentChunk]:
        """Process all documents from all knowledge base folders"""
        all_chunks = []
        
        # Process PDFs from documents/
        all_chunks.extend(self._process_directory(self.documents_path, "document"))
        
        # Process CSVs from datasets/
        all_chunks.extend(self._process_directory(self.datasets_path, "dataset"))
        
        # Process PDFs from manuals/
        all_chunks.extend(self._process_directory(self.manuals_path, "manual"))
        
        print(f"✅ Processed {len(all_chunks)} chunks from all documents")
        return all_chunks
    
    def process_file(self, file_path: str, file_type: str = None) -> List[DocumentChunk]:
        """Process a single file"""
        file_path = Path(file_path)
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        ext = file_path.suffix.lower()
        file_type = file_type or ("document" if "manual" in str(file_path) else 
                                  "dataset" if "dataset" in str(file_path) else 
                                  "document")
        
        if ext == '.pdf':
            return self._process_pdf(file_path, file_type)
        elif ext == '.csv':
            return self._process_csv(file_path, file_type)
        else:
            raise ValueError(f"Unsupported file type: {ext}")
    
    def _process_directory(self, directory: Path, doc_type: str) -> List[DocumentChunk]:
        """Process all files in a directory"""
        chunks = []
        
        if not directory.exists():
            return chunks
        
        for file_path in directory.iterdir():
            if file_path.is_file():
                try:
                    chunks.extend(self.process_file(str(file_path), doc_type))
                except Exception as e:
                    print(f"⚠️  Error processing {file_path}: {e}")
        
        return chunks
    
    def _process_pdf(self, file_path: Path, doc_type: str) -> List[DocumentChunk]:
        """Extract text from PDF and chunk it"""
        if not PDF_SUPPORT:
            print(f"⚠️  Skipping PDF: {file_path} (PyMuPDF not installed)")
            return []
        
        chunks = []
        
        try:
            doc = fitz.open(str(file_path))
            full_text = ""
            
            for page_num, page in enumerate(doc):
                text = page.get_text()
                full_text += f"\n[Page {page_num + 1}]\n{text}"
            
            doc.close()
            
            # Extract metadata from filename
            metadata = self._extract_metadata(file_path, doc_type)
            metadata["total_pages"] = len(doc)
            metadata["source_type"] = "pdf"
            
            # Chunk the text
            chunks = self._chunk_text(full_text, metadata, file_path.stem)
            
            print(f"✅ Processed PDF: {file_path.name} ({len(chunks)} chunks, {len(doc)} pages)")
            
        except Exception as e:
            print(f"❌ Error processing PDF {file_path}: {e}")
        
        return chunks
    
    def _process_csv(self, file_path: Path, doc_type: str) -> List[DocumentChunk]:
        """Process CSV file and convert to structured text"""
        if not CSV_SUPPORT:
            print(f"⚠️  Skipping CSV: {file_path} (Pandas not installed)")
            return []
        
        chunks = []
        
        try:
            df = pd.read_csv(file_path)
            
            # Extract metadata
            metadata = self._extract_metadata(file_path, doc_type)
            metadata["total_rows"] = len(df)
            metadata["columns"] = list(df.columns)
            metadata["source_type"] = "csv"
            
            # Convert CSV to structured text
            structured_text = self._csv_to_structured_text(df, file_path.stem)
            
            # Chunk the structured text
            chunks = self._chunk_text(structured_text, metadata, file_path.stem)
            
            print(f"✅ Processed CSV: {file_path.name} ({len(chunks)} chunks, {len(df)} rows)")
            
        except Exception as e:
            print(f"❌ Error processing CSV {file_path}: {e}")
        
        return chunks
    
    def _csv_to_structured_text(self, df: 'pd.DataFrame', doc_name: str) -> str:
        """Convert CSV data to structured text for better RAG"""
        text_parts = [f"Dataset: {doc_name.replace('_', ' ').title()}", ""]
        
        # Add summary statistics
        text_parts.append("## Summary Statistics")
        text_parts.append("")
        
        for col in df.columns:
            text_parts.append(f"- **{col}**: {df[col].nunique()} unique values")
        
        text_parts.append("")
        text_parts.append("## Data Records")
        text_parts.append("")
        
        # Convert each row to readable text
        for idx, row in df.iterrows():
            record_parts = [f"Record {idx + 1}:"]
            for col in df.columns:
                value = row[col]
                col_display = col.replace('_', ' ').title()
                record_parts.append(f"  - {col_display}: {value}")
            text_parts.append("\n".join(record_parts))
            text_parts.append("")
        
        return "\n".join(text_parts)
    
    def _chunk_text(self, text: str, metadata: Dict, doc_id: str) -> List[DocumentChunk]:
        """Split text into overlapping chunks"""
        chunks = []
        
        # Split by paragraphs first
        paragraphs = text.split('\n\n')
        current_chunk = ""
        chunk_num = 0
        
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if not paragraph:
                continue
            
            # If adding this paragraph exceeds chunk size
            if len(current_chunk) + len(paragraph) > self.chunk_size * 4:  # Approx chars
                # Create chunk
                chunk_id = f"{doc_id}_chunk_{chunk_num}"
                chunk_metadata = metadata.copy()
                chunk_metadata["chunk_number"] = chunk_num
                chunk_metadata["source_file"] = doc_id
                
                chunks.append(DocumentChunk(
                    text=current_chunk,
                    metadata=chunk_metadata,
                    chunk_id=chunk_id
                ))
                
                # Keep overlap
                words = current_chunk.split()
                current_chunk = " ".join(words[-self.chunk_overlap:]) + "\n\n"
                chunk_num += 1
            
            current_chunk += paragraph + "\n\n"
        
        # Add remaining text
        if current_chunk.strip():
            chunk_id = f"{doc_id}_chunk_{chunk_num}"
            chunk_metadata = metadata.copy()
            chunk_metadata["chunk_number"] = chunk_num
            chunk_metadata["source_file"] = doc_id
            
            chunks.append(DocumentChunk(
                text=current_chunk,
                metadata=chunk_metadata,
                chunk_id=chunk_id
            ))
        
        return chunks
    
    def _extract_metadata(self, file_path: Path, doc_type: str) -> Dict[str, Any]:
        """Extract metadata from filename and path"""
        metadata = {
            "source_file": file_path.name,
            "document_type": doc_type,
            "file_extension": file_path.suffix.lower(),
            "processed_at": datetime.now().isoformat(),
            "crop": None,
            "region": None,
            "category": None
        }
        
        # Try to extract crop type from filename
        filename_lower = file_path.stem.lower()
        
        # Common crop patterns
        crop_patterns = {
            'wheat': ['wheat', 'gehun', 'godhuma'],
            'rice': ['rice', 'paddy', 'dhan', 'bhaat'],
            'cotton': ['cotton', 'kapas'],
            'sugarcane': ['sugarcane', 'ganna', 'shendar'],
            'maize': ['maize', 'corn', 'makka'],
            'soybean': ['soybean', 'soya'],
            'tomato': ['tomato', 'tamatar'],
            'onion': ['onion', 'pyaaz'],
            'potato': ['potato', 'aloo', 'bataata']
        }
        
        for crop, patterns in crop_patterns.items():
            if any(pattern in filename_lower for pattern in patterns):
                metadata["crop"] = crop
                break
        
        # Try to extract region
        region_patterns = ['maharashtra', 'punjab', 'haryana', 'up', 'bihar', 
                          'west_bengal', 'rajasthan', 'mp', 'gujarat']
        for region in region_patterns:
            if region in filename_lower:
                metadata["region"] = region
                break
        
        # Determine category from path
        if 'document' in str(file_path).lower():
            metadata["category"] = "research"
        elif 'dataset' in str(file_path).lower():
            metadata["category"] = "statistics"
        elif 'manual' in str(file_path).lower():
            metadata["category"] = "guide"
        
        return metadata
    
    def get_document_stats(self) -> Dict[str, Any]:
        """Get statistics about processed documents"""
        stats = {
            "documents": 0,
            "datasets": 0,
            "manuals": 0,
            "total_files": 0
        }
        
        for path, count in [
            (self.documents_path, "documents"),
            (self.datasets_path, "datasets"),
            (self.manuals_path, "manuals")
        ]:
            if path.exists():
                file_count = len(list(path.iterdir()))
                stats[count] = file_count
                stats["total_files"] += file_count
        
        return stats
