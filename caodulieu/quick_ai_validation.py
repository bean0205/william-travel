#!/usr/bin/env python3
"""
Quick AI Integration Validation Test
Simple test to verify AI components are working
"""

import sys
import traceback
from smart_scraper.main import SmartScraper

def test_basic_initialization():
    """Test basic initialization with AI components"""
    print("🔧 Testing Basic AI Component Initialization...")
    
    try:
        # Test with minimal AI features
        scraper = SmartScraper(
            enable_ai=True,
            enable_anti_detection=False,  # Disable to reduce complexity
            enable_async=False,
            timeout=10,
            max_retries=2
        )
        
        print(f"✅ SmartScraper initialized successfully")
        print(f"   - AI Extractor: {'✓' if scraper.ai_extractor else '✗'}")
        print(f"   - Retry Manager: {'✓' if scraper.retry_manager else '✗'}")
        print(f"   - Anti-Detection: {'✓' if scraper.anti_detection_manager else '✗'}")
        print(f"   - Async Engine: {'✓' if scraper.async_engine else '✗'}")
        
        return True
        
    except Exception as e:
        print(f"❌ Initialization failed: {e}")
        traceback.print_exc()
        return False

def test_simple_scraping():
    """Test simple scraping without complex features"""
    print("\n🌐 Testing Simple Scraping...")
    
    try:
        # Minimal configuration
        scraper = SmartScraper(
            enable_ai=False,  # Start without AI to test basic functionality
            enable_anti_detection=False,
            enable_async=False,
            timeout=15
        )
        
        # Simple test URL
        test_url = "https://httpbin.org/html"
        
        result = scraper.scrape(test_url)
        
        print(f"✅ Basic scraping successful")
        print(f"   - URL: {result.get('url', 'N/A')}")
        print(f"   - Success: {result.get('extraction', {}).get('success', False)}")
        print(f"   - Page Type: {result.get('page_type', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Simple scraping failed: {e}")
        traceback.print_exc()
        return False

def test_ai_enabled_scraping():
    """Test scraping with AI enabled"""
    print("\n🤖 Testing AI-Enabled Scraping...")
    
    try:
        scraper = SmartScraper(
            enable_ai=True,
            enable_anti_detection=False,
            enable_async=False,
            timeout=15
        )
        
        test_url = "https://httpbin.org/html"
        
        result = scraper.scrape(test_url)
        
        print(f"✅ AI-enabled scraping successful")
        print(f"   - URL: {result.get('url', 'N/A')}")
        print(f"   - Success: {result.get('extraction', {}).get('success', False)}")
        
        # Check AI enhancement
        ai_meta = result.get('metadata', {}).get('ai_metadata', {})
        ai_enhancement = ai_meta.get('extraction_enhancement', {})
        
        print(f"   - AI Enhancement Applied: {ai_enhancement.get('applied', False)}")
        if ai_enhancement.get('applied'):
            print(f"   - Quality Score: {ai_enhancement.get('quality_score', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"❌ AI-enabled scraping failed: {e}")
        traceback.print_exc()
        return False

def main():
    """Run quick validation tests"""
    print("🚀 Quick AI Integration Validation")
    print("=" * 40)
    
    tests = [
        test_basic_initialization,
        test_simple_scraping,
        test_ai_enabled_scraping,
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            results.append(False)
    
    # Summary
    successful = sum(results)
    total = len(results)
    
    print("\n" + "=" * 40)
    print(f"📊 Validation Summary: {successful}/{total} tests passed")
    
    if successful == total:
        print("🎉 All validations passed!")
        return 0
    else:
        print("⚠️ Some validations failed")
        return 1

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n⏹️ Test interrupted")
        sys.exit(130)
    except Exception as e:
        print(f"\n💥 Critical error: {e}")
        traceback.print_exc()
        sys.exit(1)
