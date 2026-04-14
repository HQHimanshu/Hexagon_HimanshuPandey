"""
Quick diagnostic script to check Ollama status
"""

import requests
import sys

def check_ollama():
    print("🔍 Checking Ollama Status...")
    print("=" * 50)
    
    # Check if Ollama is running
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=3)
        if response.status_code == 200:
            print("✅ Ollama is running!")
            models = response.json().get("models", [])
            if models:
                print("\n📦 Available models:")
                for model in models:
                    print(f"   - {model['name']}")
            else:
                print("\n⚠️  No models found!")
                print("   Run: ollama pull qwen2.5:1.5b")
        else:
            print(f"❌ Ollama responded with status: {response.status_code}")
    except requests.ConnectionError:
        print("❌ Ollama is NOT running!")
        print("\n📋 To fix, run one of these:")
        print("   1. Open new terminal")
        print("   2. Run: ollama serve")
        print("   3. Keep it running in background")
        print("\n   OR just use: ollama pull qwen2.5:1.5b")
        print("   (This starts Ollama automatically)")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error checking Ollama: {e}")
        sys.exit(1)
    
    # Check if required model exists
    print("\n🎯 Checking for qwen2.5:1.5b model...")
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=3)
        models = response.json().get("models", [])
        model_names = [m['name'] for m in models]
        
        if 'qwen2.5:1.5b' in model_names or any('qwen2.5:1.5b' in m for m in model_names):
            print("✅ Model qwen2.5:1.5b found!")
        else:
            print("⚠️  Model qwen2.5:1.5b NOT found!")
            print("\n📥 To install, run:")
            print("   ollama pull qwen2.5:1.5b")
            print("\n   This may take 1-2 minutes to download")
    except Exception as e:
        print(f"⚠️  Could not check models: {e}")
    
    # Test Ollama API
    print("\n🧪 Testing Ollama API...")
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "qwen2.5:1.5b",
                "prompt": "Say 'OK' in one word",
                "stream": False
            },
            timeout=15
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Ollama API working!")
            print(f"   Response: {result.get('response', 'N/A')[:50]}")
        else:
            print(f"❌ Ollama API error: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
    except requests.Timeout:
        print("⚠️  Ollama API timeout (model may be loading)")
        print("   First request can take 10-30 seconds to load model")
    except Exception as e:
        print(f"❌ Ollama test failed: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Diagnostic complete!")
    print("\n💡 Next steps:")
    print("   1. If Ollama not running: ollama serve")
    print("   2. If model missing: ollama pull qwen2.5:1.5b")
    print("   3. Then restart your backend")

if __name__ == "__main__":
    check_ollama()
