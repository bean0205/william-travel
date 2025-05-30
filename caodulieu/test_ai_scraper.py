#!/usr/bin/env python3
"""
Simple AI Scraper Test

A minimal test script to verify AI scraper functionality.
"""

import sys
from smart_scraper.main import SmartScraper


def test_basic_ai_scraping():
    """Test basic AI scraping functionality"""
    print("🤖 Testing AI-Enhanced Smart Scraper...")
    
    try:
        # Initialize with AI features
        scraper = SmartScraper(enable_ai=True)
        print("✓ SmartScraper initialized with AI features")
        
        # Test URL
        test_url = "https://httpbin.org/html"
        print(f"Testing URL: {test_url}")
        
        # Scrape with AI (AI features are enabled by default when enable_ai=True)
        result = scraper.scrape(test_url)
        
        if result:
            print("✓ Scraping successful!")
            print(f"  Title: {result.get('title', 'N/A')}")
            print(f"  Content length: {len(result.get('content', ''))}")
            print(f"  AI Enhanced: {result.get('ai_enhanced', False)}")
            
            # Show basic stats
            stats = scraper.get_performance_stats()
            print(f"  Success rate: {stats.get('success_rate', 0):.1%}")
            print(f"  AI extractions: {stats.get('ai_enhanced_extractions', 0)}")
        else:
            print("✗ Scraping failed")
            return False
            
        print("\n🎉 AI scraper test passed!")
        return True
        
    except Exception as e:
        print(f"✗ Test failed with error: {e}")
        return False


if __name__ == "__main__":
    success = test_basic_ai_scraping()
    sys.exit(0 if success else 1)
