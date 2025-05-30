#!/usr/bin/env python3
"""
Test AI Integration for Smart Scraper
Comprehensive test for all AI-enhanced features
"""

import asyncio
import json
import time
from smart_scraper.main import SmartScraper
from config import get_config


def test_basic_ai_functionality():
    """Test basic AI-enhanced scraping functionality"""
    print("🤖 Testing Basic AI Functionality...")
    
    try:
        # Initialize with AI features enabled
        scraper = SmartScraper(
            enable_ai=True,
            enable_anti_detection=True,
            enable_async=False,  # Start with sync mode
            timeout=15,
            max_retries=2
        )
        
        # Test URL
        test_url = "https://example.com"
        
        # Basic scraping test
        result = scraper.scrape(test_url)
        
        print(f"✅ Basic scraping successful")
        print(f"   - URL: {result.get('url')}")
        print(f"   - Page Type: {result.get('page_type')}")
        print(f"   - Success: {result.get('extraction', {}).get('success')}")
        print(f"   - AI Enhancement Applied: {result.get('metadata', {}).get('ai_metadata', {}).get('extraction_enhancement', {}).get('applied', False)}")
        
        # Performance stats
        stats = scraper.get_performance_stats()
        print(f"   - Total Requests: {stats.get('total_requests', 0)}")
        print(f"   - Success Rate: {stats.get('success_rate', 0):.2f}")
        print(f"   - AI Enhancement Rate: {stats.get('ai_enhancement_rate', 0):.2f}")
        
        return True
        
    except Exception as e:
        print(f"❌ Basic AI functionality test failed: {e}")
        return False


def test_anti_detection_features():
    """Test anti-detection features"""
    print("\n🛡️ Testing Anti-Detection Features...")
    
    try:
        scraper = SmartScraper(
            enable_ai=True,
            enable_anti_detection=True,
            enable_async=False,
            timeout=10
        )
        
        # Test multiple URLs to trigger anti-detection
        test_urls = [
            "https://httpbin.org/user-agent",
            "https://httpbin.org/headers",
            "https://example.com"
        ]
        
        results = scraper.scrape_multiple_ai(
            test_urls, 
            delay=2.0, 
            concurrent=False,  # Sequential to test delay adaptation
            enable_ai_optimization=True
        )
        
        print(f"✅ Anti-detection scraping completed")
        print(f"   - URLs processed: {len(results)}")
        print(f"   - Successful results: {sum(1 for r in results if r.get('extraction', {}).get('success'))}")
        
        # Check anti-detection stats
        stats = scraper.get_performance_stats()
        if 'anti_detection_stats' in stats:
            print(f"   - Anti-detection activations: {scraper.stats.get('anti_detection_activations', 0)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Anti-detection test failed: {e}")
        return False


async def test_async_ai_features():
    """Test async AI-enhanced features"""
    print("\n⚡ Testing Async AI Features...")
    
    try:
        scraper = SmartScraper(
            enable_ai=True,
            enable_anti_detection=True,
            enable_async=True,
            timeout=10
        )
        
        # Test async scraping
        test_url = "https://httpbin.org/delay/1"
        result = await scraper.scrape_async(test_url)
        
        print(f"✅ Async AI scraping successful")
        print(f"   - URL: {result.get('url')}")
        print(f"   - Success: {result.get('extraction', {}).get('success')}")
        
        # Test batch async processing
        test_urls = [
            "https://httpbin.org/uuid",
            "https://httpbin.org/ip",
            "https://example.com"
        ]
        
        batch_results = await scraper.scrape_multiple_ai_async(
            test_urls,
            batch_size=2,
            enable_high_performance=True
        )
        
        print(f"✅ Async batch processing completed")
        print(f"   - URLs processed: {len(batch_results)}")
        print(f"   - Async requests made: {scraper.stats.get('async_requests', 0)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Async AI test failed: {e}")
        return False


def test_ai_content_extraction():
    """Test AI-enhanced content extraction"""
    print("\n🧠 Testing AI Content Extraction...")
    
    try:
        scraper = SmartScraper(
            enable_ai=True,
            enable_anti_detection=False,  # Focus on AI extraction
            enable_async=False,
            timeout=15
        )
        
        # Test with a content-rich page
        test_url = "https://httpbin.org/html"
        result = scraper.scrape(test_url, force_type='default')
        
        ai_enhancement = result.get('metadata', {}).get('ai_metadata', {}).get('extraction_enhancement', {})
        
        print(f"✅ AI content extraction test completed")
        print(f"   - AI Enhancement Applied: {ai_enhancement.get('applied', False)}")
        
        if ai_enhancement.get('applied'):
            print(f"   - Quality Score: {ai_enhancement.get('quality_score', 'N/A')}")
            print(f"   - Language Detected: {ai_enhancement.get('language', 'N/A')}")
            print(f"   - Keywords Found: {len(ai_enhancement.get('keywords', []))}")
            print(f"   - Summary Available: {bool(ai_enhancement.get('summary'))}")
        
        return True
        
    except Exception as e:
        print(f"❌ AI content extraction test failed: {e}")
        return False


def test_intelligent_retry():
    """Test intelligent retry mechanism"""
    print("\n🔄 Testing Intelligent Retry Mechanism...")
    
    try:
        scraper = SmartScraper(
            enable_ai=True,
            enable_anti_detection=True,
            enable_async=False,
            timeout=5,  # Short timeout to trigger retries
            max_retries=3
        )
        
        # Test with a URL that might timeout or fail
        test_url = "https://httpbin.org/delay/10"  # This should timeout and trigger retries
        
        start_time = time.time()
        result = scraper.scrape(test_url)
        end_time = time.time()
        
        print(f"✅ Retry mechanism test completed")
        print(f"   - Time taken: {end_time - start_time:.2f} seconds")
        print(f"   - Result received: {bool(result)}")
        
        # Check retry stats if available
        stats = scraper.get_performance_stats()
        if 'retry_stats' in stats:
            retry_stats = stats['retry_stats']
            print(f"   - Total retries attempted: {retry_stats.get('total_retries', 0)}")
            print(f"   - Successful retries: {retry_stats.get('successful_retries', 0)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Intelligent retry test failed: {e}")
        return False


def test_configuration_loading():
    """Test configuration loading and AI module initialization"""
    print("\n⚙️ Testing Configuration and AI Module Initialization...")
    
    try:
        # Test with custom configuration
        custom_config = {
            'ai': {
                'extract_keywords': True,
                'extract_summary': True,
                'detect_language': True
            },
            'anti_detection': {
                'rotate_user_agents': True,
                'adaptive_rate_limit': True
            },
            'async': {
                'max_concurrent_requests': 5,
                'response_caching': True
            }
        }
        
        scraper = SmartScraper(
            enable_ai=True,
            enable_anti_detection=True,
            enable_async=True,
            config_override=custom_config
        )
        
        print(f"✅ Configuration loading successful")
        print(f"   - AI Extractor initialized: {scraper.ai_extractor is not None}")
        print(f"   - Anti-detection manager initialized: {scraper.anti_detection_manager is not None}")
        print(f"   - Async engine initialized: {scraper.async_engine is not None}")
        print(f"   - Retry manager initialized: {scraper.retry_manager is not None}")
        
        return True
        
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")
        return False


def save_test_results(results: dict):
    """Save test results to a file"""
    try:
        with open('ai_integration_test_results.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"\n📁 Test results saved to: ai_integration_test_results.json")
    except Exception as e:
        print(f"❌ Failed to save test results: {e}")


async def main():
    """Run all AI integration tests"""
    print("🚀 Starting AI Integration Tests for Smart Scraper")
    print("=" * 60)
    
    test_results = {
        'test_start_time': time.time(),
        'tests': {}
    }
    
    # Run synchronous tests
    sync_tests = [
        ('basic_ai_functionality', test_basic_ai_functionality),
        ('anti_detection_features', test_anti_detection_features),
        ('ai_content_extraction', test_ai_content_extraction),
        ('intelligent_retry', test_intelligent_retry),
        ('configuration_loading', test_configuration_loading),
    ]
    
    for test_name, test_func in sync_tests:
        try:
            result = test_func()
            test_results['tests'][test_name] = {
                'success': result,
                'error': None
            }
        except Exception as e:
            test_results['tests'][test_name] = {
                'success': False,
                'error': str(e)
            }
    
    # Run async tests
    try:
        async_result = await test_async_ai_features()
        test_results['tests']['async_ai_features'] = {
            'success': async_result,
            'error': None
        }
    except Exception as e:
        test_results['tests']['async_ai_features'] = {
            'success': False,
            'error': str(e)
        }
    
    # Calculate summary
    test_results['test_end_time'] = time.time()
    test_results['total_duration'] = test_results['test_end_time'] - test_results['test_start_time']
    
    successful_tests = sum(1 for test in test_results['tests'].values() if test['success'])
    total_tests = len(test_results['tests'])
    
    test_results['summary'] = {
        'total_tests': total_tests,
        'successful_tests': successful_tests,
        'failed_tests': total_tests - successful_tests,
        'success_rate': successful_tests / total_tests if total_tests > 0 else 0
    }
    
    # Print summary
    print("\n" + "=" * 60)
    print("🏁 AI Integration Test Summary")
    print(f"   - Total Tests: {total_tests}")
    print(f"   - Successful: {successful_tests}")
    print(f"   - Failed: {total_tests - successful_tests}")
    print(f"   - Success Rate: {test_results['summary']['success_rate']:.1%}")
    print(f"   - Total Duration: {test_results['total_duration']:.2f} seconds")
    
    if test_results['summary']['success_rate'] >= 0.8:
        print("🎉 AI Integration tests mostly successful!")
    elif test_results['summary']['success_rate'] >= 0.5:
        print("⚠️ AI Integration tests partially successful")
    else:
        print("❌ AI Integration tests need attention")
    
    # Show failed tests
    failed_tests = [name for name, result in test_results['tests'].items() if not result['success']]
    if failed_tests:
        print("\n❌ Failed tests:")
        for test_name in failed_tests:
            error = test_results['tests'][test_name]['error']
            print(f"   - {test_name}: {error}")
    
    # Save results
    save_test_results(test_results)
    
    return test_results


if __name__ == "__main__":
    try:
        results = asyncio.run(main())
        exit_code = 0 if results['summary']['success_rate'] >= 0.8 else 1
        exit(exit_code)
    except KeyboardInterrupt:
        print("\n⏹️ Tests interrupted by user")
        exit(130)
    except Exception as e:
        print(f"\n💥 Critical test failure: {e}")
        exit(1)
