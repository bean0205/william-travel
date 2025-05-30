#!/usr/bin/env python3
"""
Simple test to verify the smart scraper works.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from smart_scraper.main import SmartScraper
import json

def simple_test():
    """Test scraping a simple website."""
    try:
        scraper = SmartScraper()
        
        # Test with a reliable, simple site
        url = "https://httpbin.org/html"
        print(f"Testing with: {url}")
        
        result = scraper.scrape(url)
        
        print("Result:")
        print(json.dumps(result, indent=2))
        
        return result
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    simple_test()
