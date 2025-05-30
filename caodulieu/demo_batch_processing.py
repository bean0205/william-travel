#!/usr/bin/env python3
"""
Demo script showcasing the enhanced batch processing capabilities of Smart Web Scraper
"""

import json
import time
from smart_scraper import SmartScraper

def demo_batch_processing():
    """Demonstrate batch processing with various options"""
    
    print("🚀 Smart Web Scraper - Enhanced Batch Processing Demo")
    print("=" * 60)
    
    # Sample URLs for demonstration
    demo_urls = [
        "https://example.com",
        "https://httpbin.org/html",
        "https://httpbin.org/json",
    ]
    
    # Initialize scraper
    scraper = SmartScraper()
    
    try:
        results = []
        
        print(f"\n📋 Processing {len(demo_urls)} URLs...")
        print("-" * 40)
        
        for i, url in enumerate(demo_urls, 1):
            print(f"\n[{i}/{len(demo_urls)}] Processing: {url}")
            
            try:
                # Add delay between requests (good practice)
                if i > 1:
                    time.sleep(1)
                
                result = scraper.scrape(url)
                
                print(f"  ✅ Success - Type: {result['page_type']}")
                print(f"     Confidence: {result['extraction_confidence']:.2f}")
                print(f"     Extractor: {result['extractor_used']}")
                
                # Add some metadata for batch processing
                result['batch_index'] = i
                result['batch_timestamp'] = time.time()
                
                results.append(result)
                
            except Exception as e:
                print(f"  ❌ Failed: {str(e)}")
                results.append({
                    'url': url,
                    'success': False,
                    'error': str(e),
                    'batch_index': i,
                    'batch_timestamp': time.time()
                })
        
        # Summary
        print(f"\n📊 Batch Processing Summary")
        print("-" * 40)
        successful = sum(1 for r in results if r.get('success', False))
        print(f"Total URLs: {len(demo_urls)}")
        print(f"Successful: {successful}")
        print(f"Failed: {len(demo_urls) - successful}")
        print(f"Success Rate: {(successful/len(demo_urls)*100):.1f}%")
        
        # Save results to file
        output_file = "demo_batch_results.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False, default=str)
        
        print(f"\n💾 Results saved to: {output_file}")
        
        # Show sample result
        if results and results[0].get('success'):
            print(f"\n📄 Sample Result:")
            sample = results[0]
            print(f"  URL: {sample['url']}")
            print(f"  Title: {sample['content'].get('title', 'N/A')}")
            print(f"  Content Length: {len(sample['content'].get('main_content', ''))}")
        
    finally:
        scraper.close()
        print(f"\n✅ Demo completed!")

def demo_cli_features():
    """Showcase CLI features with examples"""
    
    print("\n" + "=" * 60)
    print("🖥️  CLI Features Demo")
    print("=" * 60)
    
    cli_examples = [
        {
            "description": "Basic URL scraping",
            "command": "python cli.py https://example.com"
        },
        {
            "description": "Batch processing from file",
            "command": "python cli.py --file urls.txt --output batch_results.json"
        },
        {
            "description": "CSV output with custom delay",
            "command": "python cli.py --file urls.txt --format csv --delay 2.0 --output results.csv"
        },
        {
            "description": "Selenium mode with headless browser",
            "command": "python cli.py https://spa-website.com --selenium --headless"
        },
        {
            "description": "Force specific page type",
            "command": "python cli.py https://any-site.com --force-type news"
        },
        {
            "description": "Disable caching for fresh results",
            "command": "python cli.py https://news-site.com --no-cache --verbose"
        },
        {
            "description": "Classification only (no content extraction)",
            "command": "python cli.py https://website.com --classify-only"
        },
        {
            "description": "Cache management",
            "command": "python cli.py --cache-stats"
        }
    ]
    
    for example in cli_examples:
        print(f"\n📌 {example['description']}:")
        print(f"   {example['command']}")
    
    print(f"\n💡 Tip: Use 'python cli.py --help' to see all available options!")

if __name__ == "__main__":
    demo_batch_processing()
    demo_cli_features()
