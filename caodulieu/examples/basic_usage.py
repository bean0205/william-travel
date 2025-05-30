"""
Basic Usage Examples for Smart Web Scraper

Ví dụ cơ bản về cách sử dụng Smart Web Scraper
"""

import json
import sys
import os

# Thêm parent directory vào path để import smart_scraper
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from smart_scraper import SmartScraper, scrape_url, scrape_urls


def example_1_basic_scraping():
    """Ví dụ 1: Cào dữ liệu cơ bản từ một URL"""
    print("=== Example 1: Basic Scraping ===")
    
    # Cách 1: Sử dụng convenience function
    result = scrape_url("https://vnexpress.net")
    print(f"Page type: {result.get('page_type')}")
    print(f"Title: {result.get('content', {}).get('title', 'N/A')}")
    print(f"Success: {result.get('success')}")
    
    # In ra kết quả JSON (chỉ một phần)
    print("\nSample result structure:")
    sample_keys = ['url', 'page_type', 'classification_confidence', 'success']
    sample_result = {k: result.get(k) for k in sample_keys}
    print(json.dumps(sample_result, indent=2, ensure_ascii=False))


def example_2_using_context_manager():
    """Ví dụ 2: Sử dụng context manager"""
    print("\n=== Example 2: Using Context Manager ===")
    
    with SmartScraper() as scraper:
        # Phân loại trang web trước
        classification = scraper.classify_page("https://shopee.vn")
        print(f"Classification result: {classification}")
        
        # Cào dữ liệu
        result = scraper.scrape("https://shopee.vn")
        print(f"Scraping success: {result.get('success')}")


def example_3_multiple_urls():
    """Ví dụ 3: Cào nhiều URLs cùng lúc"""
    print("\n=== Example 3: Multiple URLs ===")
    
    urls = [
        "https://vnexpress.net",
        "https://dantri.com.vn", 
        "https://thanhnien.vn"
    ]
    
    results = scrape_urls(urls, delay=2)  # 2 giây delay giữa các requests
    
    for result in results:
        url = result.get('url', 'Unknown')
        page_type = result.get('page_type', 'Unknown') 
        success = result.get('success', False)
        print(f"URL: {url} | Type: {page_type} | Success: {success}")


def example_4_force_extractor_type():
    """Ví dụ 4: Bắt buộc sử dụng extractor cụ thể"""
    print("\n=== Example 4: Force Extractor Type ===")
    
    with SmartScraper() as scraper:
        # Bắt buộc sử dụng news extractor
        result = scraper.scrape("https://some-blog.com", force_type="news")
        print(f"Forced extractor: {result.get('extractor_used')}")
        print(f"Page type detected: {result.get('page_type')}")


def example_5_with_selenium():
    """Ví dụ 5: Sử dụng Selenium cho trang có JavaScript"""
    print("\n=== Example 5: Using Selenium ===")
    
    try:
        with SmartScraper(use_selenium=True, headless=True) as scraper:
            result = scraper.scrape("https://example-spa.com")
            print(f"Selenium scraping success: {result.get('success')}")
    except ImportError:
        print("Selenium not installed. Install with: pip install selenium webdriver-manager")


def example_6_analyze_extraction_details():
    """Ví dụ 6: Phân tích chi tiết kết quả extraction"""
    print("\n=== Example 6: Analyze Extraction Details ===")
    
    result = scrape_url("https://vnexpress.net")
    
    if result.get('success'):
        content = result.get('content', {})
        html_analysis = result.get('html_analysis', {})
        
        print(f"Classification confidence: {result.get('classification_confidence'):.2f}")
        print(f"Extraction confidence: {result.get('extraction_confidence'):.2f}")
        print(f"Extractor used: {result.get('extractor_used')}")
        
        # Content details
        if 'title' in content:
            print(f"Title: {content['title'][:50]}...")
        
        if 'content' in content:
            print(f"Content length: {len(content['content'])} characters")
        
        if 'images' in content:
            print(f"Images found: {len(content['images'])}")
        
        # HTML analysis
        structure = html_analysis.get('structure_info', {})
        print(f"Total elements: {structure.get('total_elements', 0)}")
        print(f"Has navigation: {structure.get('has_nav', False)}")
        print(f"Has main content: {structure.get('has_main', False)}")


def example_7_custom_extractor():
    """Ví dụ 7: Thêm custom extractor"""
    print("\n=== Example 7: Custom Extractor ===")
    
    from smart_scraper.extractors.base import BaseExtractor
    from bs4 import BeautifulSoup
    
    class ForumExtractor(BaseExtractor):
        """Custom extractor cho diễn đàn"""
        
        def __init__(self):
            super().__init__()
            self.extractor_type = "forum"
        
        def extract(self, soup: BeautifulSoup, url: str = "") -> dict:
            result = self._extract_base_info(soup)
            
            # Tìm các thread/post
            threads = soup.select('.thread, .topic, .post')
            result['threads'] = []
            
            for thread in threads[:5]:  # Giới hạn 5 threads
                title_elem = thread.select_one('h3, h4, .title')
                if title_elem:
                    result['threads'].append({
                        'title': title_elem.get_text(strip=True),
                        'content': thread.get_text(strip=True)[:200]
                    })
            
            return result
        
        def get_confidence_score(self, soup: BeautifulSoup) -> float:
            # Đơn giản: kiểm tra có elements forum-like không
            forum_indicators = soup.select('.thread, .topic, .post, .forum')
            return min(len(forum_indicators) / 10, 1.0)
    
    # Sử dụng custom extractor
    with SmartScraper() as scraper:
        # Thêm custom extractor
        scraper.add_extractor("forum", ForumExtractor())
        
        print(f"Supported types: {scraper.get_supported_types()}")
        
        # Test với force type
        # result = scraper.scrape("https://some-forum.com", force_type="forum")
        # print(f"Custom extraction result: {result.get('success')}")


def example_8_error_handling():
    """Ví dụ 8: Xử lý lỗi"""
    print("\n=== Example 8: Error Handling ===")
    
    # URL không tồn tại
    result = scrape_url("https://this-url-does-not-exist-12345.com")
    if not result.get('success'):
        print(f"Error occurred: {result.get('error')}")
    
    # URL không hợp lệ
    result = scrape_url("invalid-url")
    if not result.get('success'):
        print(f"Invalid URL error: {result.get('error')}")


def main():
    """Chạy tất cả examples"""
    print("Smart Web Scraper - Usage Examples")
    print("=" * 50)
    
    try:
        example_1_basic_scraping()
        example_2_using_context_manager()
        example_3_multiple_urls()
        example_4_force_extractor_type()
        # example_5_with_selenium()  # Comment out vì cần Selenium
        example_6_analyze_extraction_details()
        example_7_custom_extractor()
        example_8_error_handling()
        
    except Exception as e:
        print(f"Error running examples: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
