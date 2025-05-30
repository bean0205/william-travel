#!/usr/bin/env python3
"""
AI-Powered Smart Scraper Demonstration

This script demonstrates the advanced AI features of the Smart Scraper system:
1. AI-enhanced content extraction
2. Anti-detection mechanisms
3. Intelligent retry strategies
4. Async batch processing
5. Content quality scoring
6. Performance monitoring
"""

import asyncio
import json
import time
from smart_scraper.main import SmartScraper
from smart_scraper.ai_extractor import AIContentExtractor


def demo_basic_ai_scraping():
    """Demo basic AI-enhanced scraping"""
    print("=== DEMO: Basic AI-Enhanced Scraping ===")
    
    # Initialize scraper with AI features
    scraper = SmartScraper(
        enable_ai=True,
        enable_anti_detection=True,
        enable_async=False
    )
    
    # Test URL
    test_url = "https://httpbin.org/html"
    
    print(f"Scraping: {test_url}")
    start_time = time.time()
    
    # Perform AI-enhanced scraping (AI is enabled automatically)
    result = scraper.scrape(test_url)
    
    end_time = time.time()
    
    if result:
        print(f"✓ Successfully scraped in {end_time - start_time:.2f} seconds")
        print(f"Title: {result.get('title', 'N/A')}")
        print(f"Content length: {len(result.get('content', ''))}")
        print(f"AI enhanced: {result.get('ai_enhanced', False)}")
        
        # Show AI metadata if available
        if 'ai_metadata' in result:
            ai_meta = result['ai_metadata']
            print(f"Language detected: {ai_meta.get('language', 'N/A')}")
            print(f"Content quality score: {ai_meta.get('content_quality_score', 'N/A')}")
            print(f"Readability score: {ai_meta.get('readability', {}).get('flesch_reading_ease', 'N/A')}")
    else:
        print("✗ Scraping failed")
    
    print()


def demo_batch_ai_scraping():
    """Demo intelligent batch scraping with AI"""
    print("=== DEMO: Intelligent Batch AI Scraping ===")
    
    scraper = SmartScraper(
        enable_ai=True,
        enable_anti_detection=True,
        enable_async=False
    )
    
    # Test URLs
    test_urls = [
        "https://httpbin.org/html",
        "https://httpbin.org/json",
        "https://httpbin.org/xml"
    ]
    
    print(f"Batch scraping {len(test_urls)} URLs with AI optimization...")
    start_time = time.time()
    
    # Perform intelligent batch scraping (AI optimization enabled by default)
    results = scraper.scrape_multiple_ai(test_urls, max_concurrency=2)
    
    end_time = time.time()
    
    successful = sum(1 for r in results if r is not None)
    print(f"✓ Completed batch scraping in {end_time - start_time:.2f} seconds")
    print(f"Success rate: {successful}/{len(test_urls)} ({successful/len(test_urls)*100:.1f}%)")
    
    for i, result in enumerate(results):
        if result:
            print(f"URL {i+1}: {result.get('url', 'N/A')} - Success")
        else:
            print(f"URL {i+1}: Failed")
    
    print()


async def demo_async_ai_scraping():
    """Demo async AI-enhanced scraping"""
    print("=== DEMO: Async AI-Enhanced Scraping ===")
    
    scraper = SmartScraper(
        enable_ai=True,
        enable_anti_detection=True,
        enable_async=True
    )
    
    # Test URLs for async processing
    test_urls = [
        "https://httpbin.org/html",
        "https://httpbin.org/json",
        "https://httpbin.org/xml",
        "https://httpbin.org/user-agent"
    ]
    
    print(f"Async scraping {len(test_urls)} URLs with AI enhancement...")
    start_time = time.time()
    
    # Perform async batch scraping (AI enhancement enabled by default)
    results = await scraper.scrape_multiple_ai_async(test_urls)
    
    end_time = time.time()
    
    successful = sum(1 for r in results if r is not None)
    print(f"✓ Completed async scraping in {end_time - start_time:.2f} seconds")
    print(f"Success rate: {successful}/{len(test_urls)} ({successful/len(test_urls)*100:.1f}%)")
    
    # Show detailed results
    for i, result in enumerate(results):
        if result:
            ai_enhanced = result.get('ai_enhanced', False)
            print(f"URL {i+1}: Success (AI Enhanced: {ai_enhanced})")
        else:
            print(f"URL {i+1}: Failed")
    
    print()


async def demo_ai_content_analysis():
    """Demo AI content analysis features"""
    print("=== DEMO: AI Content Analysis ===")
    
    # Initialize AI extractor directly
    ai_extractor = AIContentExtractor()
    
    # Sample HTML content
    sample_html = """
    <html>
    <head><title>AI Technology Advances</title></head>
    <body>
        <h1>The Future of Artificial Intelligence</h1>
        <p>Artificial Intelligence (AI) is rapidly transforming industries across the globe. 
        From healthcare to finance, AI technologies are enabling unprecedented automation 
        and decision-making capabilities.</p>
        <p>Machine learning algorithms are becoming more sophisticated, allowing computers 
        to learn from data without explicit programming. This has led to breakthroughs in 
        natural language processing, computer vision, and predictive analytics.</p>
        <h2>Key Benefits</h2>
        <ul>
            <li>Increased efficiency and productivity</li>
            <li>Enhanced decision-making through data analysis</li>
            <li>Automation of repetitive tasks</li>
            <li>Improved customer experiences</li>
        </ul>
    </body>
    </html>
    """
    
    print("Performing AI content analysis...")
    
    # Extract and analyze content (await the async method)
    extracted = await ai_extractor.extract_content(sample_html, "https://example.com")
    
    if extracted:
        print(f"✓ Content extracted successfully")
        print(f"Title: {extracted.get('title', 'N/A')}")
        print(f"Word count: {len(extracted.get('content', '').split())}")
        
        # Show AI enhancements
        if 'ai_metadata' in extracted:
            ai_meta = extracted['ai_metadata']
            print(f"Language: {ai_meta.get('language', 'N/A')}")
            print(f"Sentiment: {ai_meta.get('sentiment', {}).get('label', 'N/A')}")
            print(f"Quality Score: {ai_meta.get('content_quality_score', 'N/A'):.2f}")
            
            # Show keywords
            if 'keywords' in ai_meta:
                keywords = ai_meta['keywords'][:5]  # Top 5 keywords
                print(f"Top Keywords: {', '.join(keywords)}")
        
        # Show content categorization
        if 'categories' in extracted:
            print(f"Categories: {', '.join(extracted['categories'])}")
    else:
        print("✗ Content extraction failed")
    
    print()


def demo_performance_monitoring():
    """Demo performance monitoring features"""
    print("=== DEMO: Performance Monitoring ===")
    
    scraper = SmartScraper(
        enable_ai=True,
        enable_anti_detection=True,
        enable_async=False
    )
    
    # Perform some scraping operations
    test_urls = [
        "https://httpbin.org/html",
        "https://httpbin.org/json"
    ]
    
    print("Performing monitored scraping operations...")
    
    for url in test_urls:
        result = scraper.scrape(url)
        if result:
            print(f"✓ {url} - Success")
        else:
            print(f"✗ {url} - Failed")
    
    # Get performance statistics
    stats = scraper.get_performance_stats()
    
    print("\n--- Performance Statistics ---")
    print(f"Total requests: {stats.get('total_requests', 0)}")
    print(f"Successful requests: {stats.get('successful_requests', 0)}")
    print(f"Success rate: {stats.get('success_rate', 0):.1%}")
    print(f"Average response time: {stats.get('average_response_time', 0):.2f}s")
    print(f"AI enhanced extractions: {stats.get('ai_enhanced_extractions', 0)}")
    print(f"Anti-detection activations: {stats.get('anti_detection_activations', 0)}")
    
    # Show cache statistics
    cache_stats = stats.get('cache_stats', {})
    if cache_stats:
        print(f"Cache hits: {cache_stats.get('hits', 0)}")
        print(f"Cache misses: {cache_stats.get('misses', 0)}")
        print(f"Cache hit rate: {cache_stats.get('hit_rate', 0):.1%}")
    
    print()


async def main():
    """Run all AI scraper demonstrations"""
    print("🤖 AI-Powered Smart Scraper Demonstration\n")
    
    # Demo 1: Basic AI scraping
    demo_basic_ai_scraping()
    
    # Demo 2: Batch AI scraping
    demo_batch_ai_scraping()
    
    # Demo 3: AI content analysis (async)
    await demo_ai_content_analysis()
    
    # Demo 4: Performance monitoring
    demo_performance_monitoring()
    
    # Demo 5: Async AI scraping
    print("Running async demo...")
    await demo_async_ai_scraping()
    
    print("🎉 All AI features demonstrated successfully!")
    print("\nTo use these features in your own code:")
    print("1. Import: from smart_scraper.main import SmartScraper")
    print("2. Initialize: scraper = SmartScraper(enable_ai=True)")
    print("3. Scrape: result = scraper.scrape(url)  # AI enhancement automatic")


if __name__ == "__main__":
    asyncio.run(main())
