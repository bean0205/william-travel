#!/usr/bin/env python3
"""
Test script to verify the smart scraper works with real websites.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from smart_scraper.main import SmartScraper
import json
import time

def test_website(url, expected_type=None):
    """Test scraping a specific website."""
    print(f"\n{'='*60}")
    print(f"Testing: {url}")
    print(f"Expected type: {expected_type}")
    print(f"{'='*60}")
    
    try:
        scraper = SmartScraper()
        result = scraper.scrape(url)
        
        print(f"Detected type: {result.get('page_type', 'unknown')}")
        print(f"Confidence: {result.get('confidence', 0):.2f}")
        print(f"Success: {result.get('success', False)}")
        
        if result.get('success'):
            content = result.get('content', {})
            print("\nExtracted content:")
            for key, value in content.items():
                if isinstance(value, str) and len(value) > 100:
                    print(f"  {key}: {value[:100]}...")
                elif isinstance(value, list) and len(value) > 3:
                    print(f"  {key}: {value[:3]}... ({len(value)} items)")
                else:
                    print(f"  {key}: {value}")
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
            
        return result
        
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return None

def main():
    """Test the scraper with various real websites."""
    print("Smart Scraper - Real Website Testing")
    print("====================================")
    
    # Test websites for different categories
    test_sites = [
        # News sites
        ("https://www.bbc.com/news", "news"),
        ("https://edition.cnn.com", "news"),
        
        # Blog sites
        ("https://techcrunch.com", "blog"),
        ("https://medium.com", "blog"),
        
        # E-commerce sites
        ("https://www.amazon.com", "ecommerce"),
        ("https://www.ebay.com", "ecommerce"),
        
        # General sites
        ("https://www.wikipedia.org", "general"),
        ("https://www.github.com", "general"),
    ]
    
    results = []
    
    for url, expected_type in test_sites:
        result = test_website(url, expected_type)
        if result:
            results.append({
                'url': url,
                'expected': expected_type,
                'actual': result.get('page_type'),
                'confidence': result.get('confidence'),
                'success': result.get('success')
            })
        
        # Be respectful with requests
        time.sleep(2)
    
    # Summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    
    successful = sum(1 for r in results if r['success'])
    correct_classification = sum(1 for r in results if r['success'] and r['actual'] == r['expected'])
    
    print(f"Total tests: {len(results)}")
    print(f"Successful: {successful}")
    print(f"Correct classifications: {correct_classification}")
    print(f"Success rate: {successful/len(results)*100:.1f}%")
    print(f"Classification accuracy: {correct_classification/successful*100:.1f}%" if successful > 0 else "N/A")
    
    # Save detailed results
    with open('test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\nDetailed results saved to test_results.json")

if __name__ == "__main__":
    main()
