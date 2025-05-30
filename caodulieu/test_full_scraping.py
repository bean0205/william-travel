#!/usr/bin/env python3
"""
Test the full scraping functionality.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from smart_scraper.main import SmartScraper
import json

def test_full_scraping():
    """Test the full scraping functionality."""
    print("Testing full scraping functionality...")
    
    try:
        scraper = SmartScraper(timeout=10)
        
        # Test with a simple HTML page
        url = "https://httpbin.org/html"
        print(f"Testing full scrape for: {url}")
        
        result = scraper.scrape(url)
        
        print("Scrape result:")
        print(json.dumps(result, indent=2, default=str))
        
        # Test with a few different types of sites
        test_urls = [
            ("https://example.com", "Testing simple site"),
            ("https://httpbin.org/json", "Testing JSON endpoint")
        ]
        
        for test_url, description in test_urls:
            print(f"\n{description}: {test_url}")
            try:
                result = scraper.scrape(test_url)
                print(f"Success: {result.get('success', False)}")
                print(f"Page type: {result.get('page_type', 'unknown')}")
                print(f"Content keys: {list(result.get('content', {}).keys())}")
            except Exception as e:
                print(f"Error: {str(e)}")
        
        scraper.close()
        print("\nFull scraping test completed")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_full_scraping()
