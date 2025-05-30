"""
Web Page Classifier Module

Module này chịu trách nhiệm nhận diện loại trang web dựa trên:
- Cấu trúc HTML
- Meta tags
- URL patterns
- Content indicators
"""

import re
import requests
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from typing import Dict, List, Tuple


class WebPageClassifier:
    """
    Classifier để nhận diện loại trang web
    
    Supported page types:
    - news: Trang tin tức
    - blog: Blog cá nhân
    - ecommerce: Trang thương mại điện tử
    - article: Bài viết/Wikipedia
    - forum: Diễn đàn
    - social: Mạng xã hội
    - unknown: Không xác định
    """
    
    def __init__(self):
        self.page_type_indicators = {
            'news': {
                'meta_patterns': [
                    r'news', r'article', r'journalism', r'newspaper',
                    r'press', r'media', r'breaking'
                ],
                'url_patterns': [
                    r'/news/', r'/article/', r'/story/', r'/post/',
                    r'vnexpress', r'dantri', r'tuoitre', r'thanhnien'
                ],
                'html_indicators': [
                    'article', 'time', 'author', 'byline',
                    '.article-content', '.news-content', '.post-content'
                ],
                'meta_tags': [
                    'article:published_time', 'article:author',
                    'article:section', 'og:type'
                ]
            },
            'blog': {
                'meta_patterns': [
                    r'blog', r'personal', r'diary', r'journal'
                ],
                'url_patterns': [
                    r'/blog/', r'blogger', r'wordpress', r'medium',
                    r'/post/', r'/entry/'
                ],
                'html_indicators': [
                    '.blog-post', '.entry', '.post', '.content',
                    'article', 'time'
                ],
                'meta_tags': [
                    'article:published_time', 'author'
                ]
            },
            'ecommerce': {
                'meta_patterns': [
                    r'shop', r'store', r'buy', r'sell', r'product',
                    r'ecommerce', r'shopping', r'retail'
                ],
                'url_patterns': [
                    r'/product/', r'/item/', r'/shop/', r'/store/',
                    r'shopee', r'lazada', r'tiki', r'sendo'
                ],
                'html_indicators': [
                    '.price', '.product', '.add-to-cart', '.buy-now',
                    '.product-price', '.product-title', '.product-description'
                ],
                'meta_tags': [
                    'product:price:amount', 'product:availability',
                    'og:type'
                ]
            },
            'article': {
                'meta_patterns': [
                    r'article', r'wiki', r'encyclopedia', r'reference'
                ],
                'url_patterns': [
                    r'wikipedia', r'/wiki/', r'/article/', r'/entry/'
                ],
                'html_indicators': [
                    'article', '.content', '.article-body',
                    '.mw-parser-output'  # Wikipedia specific
                ],
                'meta_tags': [
                    'article:published_time'
                ]
            }
        }
    
    def classify(self, url: str, html_content: str = None) -> Tuple[str, float]:
        """
        Nhận diện loại trang web
        
        Args:
            url: URL của trang web
            html_content: Nội dung HTML (tùy chọn)
            
        Returns:
            Tuple[str, float]: (page_type, confidence_score)
        """
        if html_content is None:
            html_content = self._fetch_html(url)
            
        if not html_content:
            return 'unknown', 0.0
            
        soup = BeautifulSoup(html_content, 'html.parser')
        
        scores = {}
        for page_type in self.page_type_indicators:
            score = self._calculate_type_score(url, soup, page_type)
            scores[page_type] = score
            
        # Tìm loại có điểm cao nhất
        best_type = max(scores, key=scores.get)
        best_score = scores[best_type]
        
        # Nếu điểm quá thấp, trả về unknown
        if best_score < 0.3:
            return 'unknown', best_score
            
        return best_type, best_score
    
    def _fetch_html(self, url: str) -> str:
        """Lấy nội dung HTML từ URL"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"Error fetching HTML: {e}")
            return ""
    
    def _calculate_type_score(self, url: str, soup: BeautifulSoup, page_type: str) -> float:
        """Tính điểm cho một loại trang web cụ thể"""
        indicators = self.page_type_indicators[page_type]
        total_score = 0.0
        max_score = 4.0  # Có 4 loại indicator
        
        # 1. Kiểm tra URL patterns (25% trọng số)
        url_score = self._check_url_patterns(url, indicators['url_patterns'])
        total_score += url_score * 0.25
        
        # 2. Kiểm tra meta patterns (20% trọng số)  
        meta_score = self._check_meta_patterns(soup, indicators['meta_patterns'])
        total_score += meta_score * 0.20
        
        # 3. Kiểm tra HTML indicators (35% trọng số)
        html_score = self._check_html_indicators(soup, indicators['html_indicators'])
        total_score += html_score * 0.35
        
        # 4. Kiểm tra meta tags (20% trọng số)
        meta_tag_score = self._check_meta_tags(soup, indicators['meta_tags'])
        total_score += meta_tag_score * 0.20
        
        return total_score
    
    def _check_url_patterns(self, url: str, patterns: List[str]) -> float:
        """Kiểm tra URL có khớp với patterns không"""
        url_lower = url.lower()
        matches = 0
        
        for pattern in patterns:
            if re.search(pattern, url_lower):
                matches += 1
                
        return min(matches / len(patterns), 1.0) if patterns else 0.0
    
    def _check_meta_patterns(self, soup: BeautifulSoup, patterns: List[str]) -> float:
        """Kiểm tra meta description và title có chứa keywords không"""
        text_to_check = ""
        
        # Lấy title
        title = soup.find('title')
        if title:
            text_to_check += title.get_text().lower() + " "
            
        # Lấy meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            text_to_check += meta_desc.get('content', '').lower() + " "
            
        # Lấy meta keywords
        meta_keywords = soup.find('meta', attrs={'name': 'keywords'})
        if meta_keywords:
            text_to_check += meta_keywords.get('content', '').lower() + " "
        
        matches = 0
        for pattern in patterns:
            if re.search(pattern, text_to_check):
                matches += 1
                
        return min(matches / len(patterns), 1.0) if patterns else 0.0
    
    def _check_html_indicators(self, soup: BeautifulSoup, indicators: List[str]) -> float:
        """Kiểm tra các HTML elements/classes đặc trưng"""
        matches = 0
        
        for indicator in indicators:
            if indicator.startswith('.'):
                # CSS class selector
                class_name = indicator[1:]
                if soup.find(class_=class_name):
                    matches += 1
            elif indicator.startswith('#'):
                # ID selector
                id_name = indicator[1:]
                if soup.find(id=id_name):
                    matches += 1
            else:
                # Tag name
                if soup.find(indicator):
                    matches += 1
                    
        return min(matches / len(indicators), 1.0) if indicators else 0.0
    
    def _check_meta_tags(self, soup: BeautifulSoup, meta_tags: List[str]) -> float:
        """Kiểm tra các meta tags đặc biệt"""
        matches = 0
        
        for tag in meta_tags:
            # Kiểm tra Open Graph tags
            if soup.find('meta', attrs={'property': tag}):
                matches += 1
            # Kiểm tra meta name tags
            elif soup.find('meta', attrs={'name': tag}):
                matches += 1
            # Kiểm tra schema.org microdata
            elif soup.find(attrs={'itemprop': tag}):
                matches += 1
                
        return min(matches / len(meta_tags), 1.0) if meta_tags else 0.0
    
    def get_supported_types(self) -> List[str]:
        """Trả về danh sách các loại trang web được hỗ trợ"""
        return list(self.page_type_indicators.keys())
    
    def add_page_type(self, page_type: str, indicators: Dict) -> None:
        """
        Thêm loại trang web mới
        
        Args:
            page_type: Tên loại trang web
            indicators: Dictionary chứa các indicators
        """
        self.page_type_indicators[page_type] = indicators
        print(f"Added new page type: {page_type}")


# Test function
if __name__ == "__main__":
    classifier = WebPageClassifier()
    
    # Test với một số URL mẫu
    test_urls = [
        "https://vnexpress.net/thoi-su/",
        "https://shopee.vn/product/123",
        "https://medium.com/@user/article-title"
    ]
    
    for url in test_urls:
        page_type, confidence = classifier.classify(url)
        print(f"URL: {url}")
        print(f"Type: {page_type}, Confidence: {confidence:.2f}")
        print("-" * 50)
