#!/usr/bin/env python3
"""
Advanced examples and real website testing for Smart Scraper.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from smart_scraper.main import SmartScraper
from smart_scraper.extractors.base import BaseExtractor
import json
import time

class CustomWikipediaExtractor(BaseExtractor):
    """Custom extractor for Wikipedia pages."""
    
    def __init__(self):
        super().__init__()
        self.extractor_type = "wikipedia"
    
    def extract(self, soup, url=""):
        """Extract Wikipedia content."""
        result = self._extract_base_info(soup)
        
        # Wikipedia-specific selectors
        title_elem = soup.select_one('#firstHeading')
        if title_elem:
            result['title'] = self._clean_text(title_elem.get_text())
        
        # Main content
        content_elem = soup.select_one('#mw-content-text')
        if content_elem:
            # Remove reference links and edit links
            for elem in content_elem.select('.reference, .mw-editsection'):
                elem.decompose()
            
            result['content'] = self._clean_text(content_elem.get_text())
            result['content_html'] = str(content_elem)
        
        # Categories
        categories = []
        for cat_link in soup.select('#mw-normal-catlinks a'):
            categories.append(cat_link.get_text())
        result['categories'] = categories
        
        # Infobox data
        infobox = soup.select_one('.infobox')
        if infobox:
            infobox_data = {}
            for row in infobox.select('tr'):
                th = row.select_one('th')
                td = row.select_one('td')
                if th and td:
                    key = self._clean_text(th.get_text())
                    value = self._clean_text(td.get_text())
                    if key and value:
                        infobox_data[key] = value
            result['infobox'] = infobox_data
        
        return result
    
    def get_confidence_score(self, soup):
        """Calculate confidence score for Wikipedia pages."""
        score = 0.0
        
        # Check for Wikipedia-specific elements
        if soup.select_one('#firstHeading'):
            score += 0.3
        if soup.select_one('#mw-content-text'):
            score += 0.3
        if soup.select_one('.infobox'):
            score += 0.2
        if soup.select_one('#mw-normal-catlinks'):
            score += 0.1
        if 'wikipedia.org' in soup.find('link', rel='canonical', href=True)['href'] if soup.find('link', rel='canonical', href=True) else '':
            score += 0.1
        
        return min(score, 1.0)

def test_with_real_websites():
    """Test scraper with real websites."""
    print("Testing Smart Scraper with Real Websites")
    print("=" * 50)
    
    # Initialize scraper
    scraper = SmartScraper(timeout=15)
    
    # Add custom extractor
    scraper.add_extractor("wikipedia", CustomWikipediaExtractor())
    
    # Test sites
    test_sites = [
        {
            'url': 'https://example.com',
            'description': 'Simple example site',
            'expected_type': 'general'
        },
        {
            'url': 'https://en.wikipedia.org/wiki/Python_(programming_language)',
            'description': 'Wikipedia article',
            'expected_type': 'wikipedia'
        },
        {
            'url': 'https://httpbin.org/html',
            'description': 'HTTPBin HTML test',
            'expected_type': 'general'
        }
    ]
    
    results = []
    
    for i, site in enumerate(test_sites):
        print(f"\n{i+1}. {site['description']}")
        print(f"URL: {site['url']}")
        print("-" * 30)
        
        try:
            # Test classification first
            classification = scraper.classify_page(site['url'])
            print(f"Classification: {classification.get('page_type', 'unknown')}")
            print(f"Confidence: {classification.get('confidence', 0):.2f}")
            
            # Full scrape
            result = scraper.scrape(site['url'])
            
            if result.get('success'):
                print(f"✅ Scraping successful")
                print(f"Detected type: {result.get('page_type')}")
                print(f"Extractor used: {result.get('extractor_used')}")
                print(f"Content keys: {list(result.get('content', {}).keys())}")
                
                # Show sample content
                content = result.get('content', {})
                if 'title' in content:
                    title = content['title']
                    print(f"Title: {title[:100]}{'...' if len(title) > 100 else ''}")
                
                if 'content' in content:
                    text_content = content['content']
                    print(f"Content length: {len(text_content)} characters")
                    if text_content:
                        print(f"Content sample: {text_content[:200]}{'...' if len(text_content) > 200 else ''}")
                
            else:
                print(f"❌ Scraping failed: {result.get('error')}")
            
            results.append({
                'url': site['url'],
                'expected': site['expected_type'],
                'actual': result.get('page_type'),
                'success': result.get('success'),
                'error': result.get('error')
            })
            
        except Exception as e:
            print(f"❌ Exception: {str(e)}")
            results.append({
                'url': site['url'],
                'expected': site['expected_type'],
                'actual': 'error',
                'success': False,
                'error': str(e)
            })
        
        # Be polite with requests
        if i < len(test_sites) - 1:
            time.sleep(2)
    
    # Summary
    print(f"\n{'='*50}")
    print("SUMMARY")
    print(f"{'='*50}")
    
    successful = sum(1 for r in results if r['success'])
    total = len(results)
    
    print(f"Total tests: {total}")
    print(f"Successful: {successful}")
    print(f"Success rate: {successful/total*100:.1f}%")
    
    # Cache stats
    cache_stats = scraper.get_cache_stats()
    print(f"\nCache statistics:")
    print(f"Entries: {cache_stats['total_entries']}")
    print(f"Size: {cache_stats['total_size_mb']} MB")
    
    # Save detailed results
    with open('advanced_test_results.json', 'w') as f:
        json.dump({
            'test_results': results,
            'cache_stats': cache_stats,
            'timestamp': time.time()
        }, f, indent=2, default=str)
    
    print(f"\nDetailed results saved to advanced_test_results.json")
    
    scraper.close()

def demo_custom_extractor():
    """Demonstrate creating and using custom extractors."""
    print("\nCustom Extractor Demo")
    print("=" * 30)
    
    class SimpleNewsExtractor(BaseExtractor):
        """Simple news extractor for demonstration."""
        
        def __init__(self):
            super().__init__()
            self.extractor_type = "simple_news"
        
        def extract(self, soup, url=""):
            result = self._extract_base_info(soup)
            
            # Look for common news patterns
            title_elem = soup.select_one('h1, .title, .headline')
            if title_elem:
                result['title'] = self._clean_text(title_elem.get_text())
            
            # Look for article content
            content_elem = soup.select_one('article, .content, .post-content, .entry-content')
            if content_elem:
                result['content'] = self._clean_text(content_elem.get_text())
            
            # Look for author
            author_elem = soup.select_one('.author, .byline, [rel="author"]')
            if author_elem:
                result['author'] = self._clean_text(author_elem.get_text())
            
            return result
        
        def get_confidence_score(self, soup):
            score = 0.0
            if soup.select_one('h1, .title, .headline'):
                score += 0.3
            if soup.select_one('article, .content'):
                score += 0.4
            if soup.select_one('.author, .byline'):
                score += 0.2
            if soup.select_one('time, .date'):
                score += 0.1
            return min(score, 1.0)
    
    # Test the custom extractor
    scraper = SmartScraper()
    scraper.add_extractor("simple_news", SimpleNewsExtractor())
    
    print(f"Supported types: {scraper.get_supported_types()}")
    
    # Test with forced type
    result = scraper.scrape("https://example.com", force_type="simple_news")
    print(f"Custom extractor result: {result.get('extractor_used')}")
    
    scraper.close()

if __name__ == "__main__":
    test_with_real_websites()
    demo_custom_extractor()
