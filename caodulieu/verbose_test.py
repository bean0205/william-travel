#!/usr/bin/env python3
"""
Verbose test to debug scraper issues.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up console logging
from smart_scraper.logging_config import setup_logging
import logging
setup_logging(level=logging.DEBUG, console=True)

from smart_scraper.main import SmartScraper
import json

def verbose_test():
    """Test with verbose logging."""
    print("Starting verbose test...")
    
    try:
        scraper = SmartScraper(timeout=10)
        print("SmartScraper initialized")
        
        # Test with a simple site
        url = "https://example.com"
        print(f"\nTesting scrape for: {url}")
        
        result = scraper.scrape(url)
        
        print("\n" + "="*50)
        print("SCRAPE RESULT:")
        print("="*50)
        print(json.dumps(result, indent=2, default=str))
        
        scraper.close()
        print("\nTest completed successfully!")
        
    except Exception as e:
        print(f"\nError occurred: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    verbose_test()
