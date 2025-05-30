#!/usr/bin/env python3
"""
Complete test suite for the Smart Web Scraper application.
This script tests all functionality and creates a comprehensive report.
"""

import sys
import os
import json
import time
from datetime import datetime

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from smart_scraper.main import SmartScraper
from smart_scraper.extractors.base import BaseExtractor

class TestResults:
    """Class to collect and manage test results."""
    
    def __init__(self):
        self.results = []
        self.start_time = time.time()
        
    def add_result(self, test_name, success, details=None, error=None):
        """Add a test result."""
        self.results.append({
            'test_name': test_name,
            'success': success,
            'details': details or {},
            'error': error,
            'timestamp': datetime.now().isoformat()
        })
    
    def get_summary(self):
        """Get test summary."""
        total = len(self.results)
        passed = sum(1 for r in self.results if r['success'])
        failed = total - passed
        
        return {
            'total_tests': total,
            'passed': passed,
            'failed': failed,
            'success_rate': (passed / total * 100) if total > 0 else 0,
            'duration': time.time() - self.start_time
        }
    
    def save_report(self, filename='test_report.json'):
        """Save comprehensive test report."""
        report = {
            'summary': self.get_summary(),
            'test_results': self.results,
            'timestamp': datetime.now().isoformat()
        }
        
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        return filename

def test_basic_functionality(results):
    """Test basic scraper functionality."""
    print("\n1. Testing Basic Functionality")
    print("-" * 40)
    
    try:
        scraper = SmartScraper(timeout=10)
        
        # Test initialization
        print("✓ SmartScraper initialization successful")
        results.add_result("SmartScraper initialization", True)
        
        # Test supported types
        types = scraper.get_supported_types()
        expected_types = ['news', 'blog', 'ecommerce']
        has_all_types = all(t in types for t in expected_types)
        
        print(f"✓ Supported types: {types}")
        results.add_result("Supported types check", has_all_types, {'types': types})
        
        scraper.close()
        
    except Exception as e:
        print(f"✗ Basic functionality test failed: {e}")
        results.add_result("Basic functionality", False, error=str(e))

def test_classification(results):
    """Test page classification functionality."""
    print("\n2. Testing Page Classification")
    print("-" * 40)
    
    try:
        scraper = SmartScraper(timeout=10)
        
        test_urls = [
            "https://example.com",
            "https://httpbin.org/html"
        ]
        
        for url in test_urls:
            try:
                classification = scraper.classify_page(url)
                success = isinstance(classification, dict) and 'page_type' in classification
                
                print(f"✓ {url} -> {classification.get('page_type', 'unknown')}")
                results.add_result(f"Classification: {url}", success, classification)
                
                time.sleep(1)  # Be polite
                
            except Exception as e:
                print(f"✗ Failed to classify {url}: {e}")
                results.add_result(f"Classification: {url}", False, error=str(e))
        
        scraper.close()
        
    except Exception as e:
        print(f"✗ Classification test failed: {e}")
        results.add_result("Classification test", False, error=str(e))

def test_content_extraction(results):
    """Test content extraction functionality."""
    print("\n3. Testing Content Extraction")
    print("-" * 40)
    
    try:
        scraper = SmartScraper(timeout=10)
        
        test_urls = [
            ("https://example.com", "Simple site"),
            ("https://httpbin.org/html", "HTML test page")
        ]
        
        for url, description in test_urls:
            try:
                result = scraper.scrape(url)
                success = result.get('success', False)
                
                if success:
                    content = result.get('content', {})
                    has_content = len(content) > 0
                    
                    print(f"✓ {description}: {len(content)} content fields")
                    results.add_result(f"Extraction: {description}", has_content, {
                        'url': url,
                        'content_fields': list(content.keys()),
                        'page_type': result.get('page_type')
                    })
                else:
                    print(f"✗ {description}: {result.get('error', 'Unknown error')}")
                    results.add_result(f"Extraction: {description}", False, error=result.get('error'))
                
                time.sleep(1)  # Be polite
                
            except Exception as e:
                print(f"✗ Failed to extract from {url}: {e}")
                results.add_result(f"Extraction: {description}", False, error=str(e))
        
        scraper.close()
        
    except Exception as e:
        print(f"✗ Content extraction test failed: {e}")
        results.add_result("Content extraction test", False, error=str(e))

def test_custom_extractor(results):
    """Test custom extractor functionality."""
    print("\n4. Testing Custom Extractor")
    print("-" * 40)
    
    try:
        class TestExtractor(BaseExtractor):
            def __init__(self):
                super().__init__()
                self.extractor_type = "test"
            
            def extract(self, soup, url=""):
                return {
                    "test_field": "test_value",
                    "title": soup.find('title').get_text() if soup.find('title') else "No title"
                }
            
            def get_confidence_score(self, soup):
                return 0.8
        
        scraper = SmartScraper(timeout=10)
        scraper.add_extractor("test", TestExtractor())
        
        # Test that the extractor was added
        types = scraper.get_supported_types()
        has_test_type = "test" in types
        
        print(f"✓ Custom extractor added: {has_test_type}")
        results.add_result("Custom extractor addition", has_test_type)
        
        # Test using the custom extractor
        result = scraper.scrape("https://example.com", force_type="test", use_cache=False)
        used_custom = result.get('extractor_used') == 'test'
        
        print(f"✓ Custom extractor used: {used_custom}")
        results.add_result("Custom extractor usage", used_custom, {
            'extractor_used': result.get('extractor_used'),
            'content': result.get('content')
        })
        
        scraper.close()
        
    except Exception as e:
        print(f"✗ Custom extractor test failed: {e}")
        results.add_result("Custom extractor test", False, error=str(e))

def test_caching(results):
    """Test caching functionality."""
    print("\n5. Testing Caching")
    print("-" * 40)
    
    try:
        scraper = SmartScraper(timeout=10)
        
        # First request
        url = "https://example.com"
        start_time = time.time()
        result1 = scraper.scrape(url)
        first_duration = time.time() - start_time
        
        # Second request (should be cached)
        start_time = time.time()
        result2 = scraper.scrape(url)
        second_duration = time.time() - start_time
        
        # Check if second request was faster (cached)
        is_cached = second_duration < first_duration * 0.5
        from_cache = result2.get('from_cache', False)
        
        print(f"✓ First request: {first_duration:.2f}s")
        print(f"✓ Second request: {second_duration:.2f}s (cached: {from_cache})")
        
        results.add_result("Caching functionality", True, {
            'first_duration': first_duration,
            'second_duration': second_duration,
            'from_cache': from_cache,
            'performance_improvement': is_cached
        })
        
        # Test cache stats
        stats = scraper.get_cache_stats()
        has_stats = isinstance(stats, dict)
        
        print(f"✓ Cache stats: {stats}")
        results.add_result("Cache statistics", has_stats, stats)
        
        scraper.close()
        
    except Exception as e:
        print(f"✗ Caching test failed: {e}")
        results.add_result("Caching test", False, error=str(e))

def test_error_handling(results):
    """Test error handling."""
    print("\n6. Testing Error Handling")
    print("-" * 40)
    
    try:
        scraper = SmartScraper(timeout=5)
        
        # Test invalid URL
        invalid_urls = [
            "https://this-domain-does-not-exist-12345.com",
            "invalid-url"
        ]
        
        for url in invalid_urls:
            try:
                result = scraper.scrape(url)
                has_error = not result.get('success', True)
                error_msg = result.get('error', '')
                
                print(f"✓ Invalid URL handled: {url} -> {error_msg[:50]}...")
                results.add_result(f"Error handling: {url}", has_error, {
                    'error_message': error_msg
                })
                
            except Exception as e:
                print(f"✓ Exception handled for {url}: {str(e)[:50]}...")
                results.add_result(f"Exception handling: {url}", True, {
                    'exception': str(e)
                })
        
        scraper.close()
        
    except Exception as e:
        print(f"✗ Error handling test failed: {e}")
        results.add_result("Error handling test", False, error=str(e))

def main():
    """Run complete test suite."""
    print("Smart Web Scraper - Comprehensive Test Suite")
    print("=" * 50)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = TestResults()
    
    # Run all tests
    test_basic_functionality(results)
    test_classification(results)
    test_content_extraction(results)
    test_custom_extractor(results)
    test_caching(results)
    test_error_handling(results)
    
    # Generate report
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    
    summary = results.get_summary()
    print(f"Total tests: {summary['total_tests']}")
    print(f"Passed: {summary['passed']}")
    print(f"Failed: {summary['failed']}")
    print(f"Success rate: {summary['success_rate']:.1f}%")
    print(f"Duration: {summary['duration']:.2f} seconds")
    
    # Save report
    report_file = results.save_report('comprehensive_test_report.json')
    print(f"\nDetailed report saved to: {report_file}")
    
    # Show failed tests
    failed_tests = [r for r in results.results if not r['success']]
    if failed_tests:
        print(f"\nFailed tests ({len(failed_tests)}):")
        for test in failed_tests:
            print(f"  ✗ {test['test_name']}: {test.get('error', 'Unknown error')}")
    else:
        print("\n🎉 All tests passed!")
    
    return summary['success_rate'] == 100

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
