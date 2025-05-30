#!/usr/bin/env python3
"""
Quick test script to validate basic functionality.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from smart_scraper.main import SmartScraper

def test_basic_functionality():
    """Test basic scraping functionality."""
    print("🔧 Testing basic functionality...")
    
    try:
        scraper = SmartScraper()
        print("✅ Scraper created successfully")
        
        # Test with example.com
        result = scraper.scrape('https://example.com')
        print(f"✅ Scrape completed for example.com")
        print(f"   Page type: {result.get('page_type', 'unknown')}")
        print(f"   Title: {result.get('content', {}).get('title', 'N/A')}")
        
        return True
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def test_classification():
    """Test page classification."""
    print("\n🔧 Testing page classification...")
    
    try:
        scraper = SmartScraper()
        
        # Test news site
        result = scraper.scrape('https://www.bbc.com')
        print(f"✅ BBC classified as: {result.get('page_type', 'unknown')}")
        
        return True
    except Exception as e:
        print(f"❌ Classification test failed: {e}")
        return False

def test_cache():
    """Test caching functionality."""
    print("\n🔧 Testing cache functionality...")
    
    try:
        scraper = SmartScraper(enable_cache=True)
        
        # First request
        start_time = time.time()
        result1 = scraper.scrape('https://example.com')
        first_time = time.time() - start_time
        
        # Second request (should be cached)
        start_time = time.time()
        result2 = scraper.scrape('https://example.com')
        second_time = time.time() - start_time
        
        print(f"✅ First request: {first_time:.2f}s")
        print(f"✅ Second request: {second_time:.2f}s")
        print(f"   Cache working: {second_time < first_time}")
        
        return True
    except Exception as e:
        print(f"❌ Cache test failed: {e}")
        return False

if __name__ == "__main__":
    import time
    
    print("🚀 Starting Quick Test Suite\n")
    
    tests = [
        test_basic_functionality,
        test_classification,
        test_cache
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test {test.__name__} failed with exception: {e}")
    
    print(f"\n📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        sys.exit(0)
    else:
        print("😞 Some tests failed")
        sys.exit(1)
