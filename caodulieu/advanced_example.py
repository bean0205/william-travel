#!/usr/bin/env python3
"""
Advanced usage example showcasing all Smart Web Scraper features
"""

import json
import time
from pathlib import Path
from smart_scraper import SmartScraper

def advanced_scraping_example():
    """
    Comprehensive example showing:
    - Custom configuration
    - Multiple extraction modes
    - Cache management
    - Error handling
    - Results analysis
    """
    
    print("🔥 Smart Web Scraper - Advanced Features Showcase")
    print("=" * 60)
    
    # Initialize with custom configuration
    scraper = SmartScraper(
        use_selenium=False,  # Start with requests mode
        cache_enabled=True,
        timeout=15,
        retries=2
    )
    
    # Test scenarios with different page types
    test_scenarios = [
        {
            "name": "Example Domain (Generic)",
            "url": "https://example.com",
            "expected_type": "unknown"
        },
        {
            "name": "HTTPBin HTML (Generic)",
            "url": "https://httpbin.org/html",
            "expected_type": "unknown"
        },
        {
            "name": "HTTPBin JSON (API)",
            "url": "https://httpbin.org/json",
            "expected_type": "unknown"
        }
    ]
    
    results = []
    
    try:
        print(f"\n🎯 Running {len(test_scenarios)} test scenarios...")
        
        for i, scenario in enumerate(test_scenarios, 1):
            print(f"\n[{i}/{len(test_scenarios)}] {scenario['name']}")
            print(f"URL: {scenario['url']}")
            
            start_time = time.time()
            
            try:
                # First attempt with requests
                result = scraper.scrape(scenario['url'])
                
                processing_time = time.time() - start_time
                
                # Analyze results
                success = result.get('success', False)
                page_type = result.get('page_type', 'unknown')
                confidence = result.get('extraction_confidence', 0)
                extractor_used = result.get('extractor_used', 'none')
                
                print(f"  ✅ Status: {'Success' if success else 'Failed'}")
                print(f"  📋 Type: {page_type} (expected: {scenario['expected_type']})")
                print(f"  🎯 Confidence: {confidence:.2f}")
                print(f"  🔧 Extractor: {extractor_used}")
                print(f"  ⏱️  Time: {processing_time:.2f}s")
                
                # Content analysis
                content = result.get('content', {})
                if content:
                    title_len = len(content.get('title', ''))
                    content_len = len(content.get('main_content', ''))
                    images_count = len(content.get('images', []))
                    links_count = len(content.get('links', []))
                    
                    print(f"  📝 Title length: {title_len}")
                    print(f"  📄 Content length: {content_len}")
                    print(f"  🖼️  Images: {images_count}")
                    print(f"  🔗 Links: {links_count}")
                
                # Store result with additional metadata
                result['scenario_name'] = scenario['name']
                result['processing_time'] = processing_time
                result['test_index'] = i
                
                results.append(result)
                
            except Exception as e:
                print(f"  ❌ Error: {str(e)}")
                results.append({
                    'scenario_name': scenario['name'],
                    'url': scenario['url'],
                    'success': False,
                    'error': str(e),
                    'test_index': i,
                    'processing_time': time.time() - start_time
                })
            
            # Small delay between requests
            if i < len(test_scenarios):
                time.sleep(0.5)
        
        # Cache statistics
        print(f"\n📊 Cache Statistics:")
        try:
            cache_stats = scraper.get_cache_stats()
            print(f"  Cache hits: {cache_stats.get('hits', 0)}")
            print(f"  Cache misses: {cache_stats.get('misses', 0)}")
            print(f"  Cache size: {cache_stats.get('size', 0)} entries")
            print(f"  Cache hit rate: {cache_stats.get('hit_rate', 0):.1%}")
        except Exception as e:
            print(f"  Cache stats unavailable: {e}")
        
        # Results summary
        print(f"\n📈 Results Summary:")
        print("-" * 30)
        
        successful = [r for r in results if r.get('success', False)]
        failed = [r for r in results if not r.get('success', False)]
        
        print(f"Total tests: {len(results)}")
        print(f"Successful: {len(successful)}")
        print(f"Failed: {len(failed)}")
        print(f"Success rate: {len(successful)/len(results)*100:.1f}%")
        
        if successful:
            avg_time = sum(r.get('processing_time', 0) for r in successful) / len(successful)
            avg_confidence = sum(r.get('extraction_confidence', 0) for r in successful) / len(successful)
            
            print(f"Average processing time: {avg_time:.2f}s")
            print(f"Average confidence: {avg_confidence:.2f}")
        
        # Save detailed results
        output_file = "advanced_test_results.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False, default=str)
        
        print(f"\n💾 Detailed results saved to: {output_file}")
        
        # Show feature usage examples
        show_feature_examples()
        
    finally:
        scraper.close()
        print(f"\n✅ Advanced showcase completed!")

def show_feature_examples():
    """Show examples of specific features"""
    
    print(f"\n🛠️  Feature Examples:")
    print("-" * 30)
    
    examples = [
        {
            "feature": "Force page type",
            "code": """scraper = SmartScraper()
result = scraper.scrape("https://any-site.com", force_type="news")
# Forces news extractor regardless of classification"""
        },
        {
            "feature": "Selenium for JavaScript sites",
            "code": """scraper = SmartScraper(use_selenium=True)
result = scraper.scrape("https://spa-website.com")
# Handles dynamic content loaded by JavaScript"""
        },
        {
            "feature": "Custom timeout and retries",
            "code": """scraper = SmartScraper(timeout=60, retries=5)
result = scraper.scrape("https://slow-website.com")
# Waits longer and retries more for slow sites"""
        },
        {
            "feature": "Disable caching",
            "code": """scraper = SmartScraper(cache_enabled=False)
result = scraper.scrape("https://news-site.com")
# Always fetches fresh content, no cache"""
        }
    ]
    
    for example in examples:
        print(f"\n📌 {example['feature']}:")
        print(f"{example['code']}")

if __name__ == "__main__":
    advanced_scraping_example()
