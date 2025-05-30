#!/usr/bin/env python3
"""Debug test for custom extractor force_type functionality"""

from smart_scraper import SmartScraper
from smart_scraper.extractors import BaseExtractor

class TestExtractor(BaseExtractor):
    def __init__(self):
        super().__init__()
        self.extractor_type = "test"
    
    def extract(self, soup, url=""):
        print(f"TestExtractor.extract() called for URL: {url}")
        return {
            "test_field": "test_value",
            "title": soup.find('title').get_text() if soup.find('title') else "No title"
        }
    
    def get_confidence_score(self, soup):
        print(f"TestExtractor.get_confidence_score() called")
        return 0.8

def main():
    print("Debug test for custom extractor")
    print("=" * 50)
    
    try:
        scraper = SmartScraper(timeout=10)
        print("SmartScraper created successfully")
        
        scraper.add_extractor("test", TestExtractor())
        print("TestExtractor added successfully")
        
        # Test that the extractor was added
        types = scraper.get_supported_types()
        print(f"Supported types: {types}")
        print(f"Has test type: {'test' in types}")
        
        # Test using the custom extractor
        print(f"\nTesting force_type='test' with example.com...")
        result = scraper.scrape("https://example.com", force_type="test")
        
        print(f"Result keys: {list(result.keys())}")
        print(f"Page type: {result.get('page_type')}")
        print(f"Extractor used: {result.get('extractor_used')}")
        print(f"Success: {result.get('success')}")
        
        if 'content' in result:
            print(f"Content keys: {list(result['content'].keys())}")
        
        scraper.close()
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
