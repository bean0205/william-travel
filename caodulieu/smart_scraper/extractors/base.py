"""
Base Extractor Module

Base class cho tất cả các content extractors
"""

from abc import ABC, abstractmethod
from typing import Dict, Optional
from bs4 import BeautifulSoup


class BaseExtractor(ABC):
    """
    Base class cho tất cả content extractors
    
    Mỗi extractor phải implement các method:
    - extract(): Trích xuất nội dung chính
    - get_confidence_score(): Tính độ tin cậy của việc extraction
    """
    
    def __init__(self):
        self.extractor_type = "base"
        self.required_elements = []  # Các elements bắt buộc phải có
        self.optional_elements = []  # Các elements tùy chọn
    
    @abstractmethod
    def extract(self, soup: BeautifulSoup, url: str = "") -> Dict:
        """
        Trích xuất nội dung từ BeautifulSoup object
        
        Args:
            soup: BeautifulSoup object
            url: URL gốc (để resolve relative URLs)
            
        Returns:
            Dict chứa nội dung đã trích xuất
        """
        pass
    
    @abstractmethod
    def get_confidence_score(self, soup: BeautifulSoup) -> float:
        """
        Tính điểm confidence cho việc extraction
        
        Args:
            soup: BeautifulSoup object
            
        Returns:
            float: Điểm confidence (0.0 - 1.0)
        """
        pass
    
    def _extract_base_info(self, soup: BeautifulSoup) -> Dict:
        """Trích xuất thông tin cơ bản chung cho tất cả loại trang"""
        return {
            'title': self._get_title(soup),
            'meta_description': self._get_meta_description(soup),
            'canonical_url': self._get_canonical_url(soup),
            'language': self._get_language(soup)
        }
    
    def _get_title(self, soup: BeautifulSoup) -> str:
        """Lấy title của trang"""
        # Thử h1 trước
        h1 = soup.find('h1')
        if h1:
            return h1.get_text(strip=True)
            
        # Sau đó thử title tag
        title = soup.find('title')
        if title:
            return title.get_text(strip=True)
            
        return ""
    
    def _get_meta_description(self, soup: BeautifulSoup) -> str:
        """Lấy meta description"""
        meta = soup.find('meta', attrs={'name': 'description'})
        if meta:
            return meta.get('content', '')
            
        # Thử Open Graph
        og_desc = soup.find('meta', attrs={'property': 'og:description'})
        if og_desc:
            return og_desc.get('content', '')
            
        return ""
    
    def _get_canonical_url(self, soup: BeautifulSoup) -> str:
        """Lấy canonical URL"""
        canonical = soup.find('link', attrs={'rel': 'canonical'})
        if canonical:
            return canonical.get('href', '')
            
        return ""
    
    def _get_language(self, soup: BeautifulSoup) -> str:
        """Lấy ngôn ngữ của trang"""
        html_tag = soup.find('html')
        if html_tag:
            return html_tag.get('lang', '')
            
        return ""
    
    def _clean_text(self, text: str) -> str:
        """Làm sạch text"""
        import re
        if not text:
            return ""
            
        # Loại bỏ whitespace thừa
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
    
    def _extract_images_from_element(self, element, base_url: str = "") -> list:
        """Trích xuất images từ một element"""
        from urllib.parse import urljoin
        
        images = []
        if not element:
            return images
            
        img_tags = element.find_all('img')
        for img in img_tags:
            src = img.get('src')
            if src:
                if base_url:
                    src = urljoin(base_url, src)
                    
                images.append({
                    'src': src,
                    'alt': img.get('alt', ''),
                    'title': img.get('title', ''),
                    'width': img.get('width'),
                    'height': img.get('height')
                })
                
        return images
    
    def _get_element_by_selectors(self, soup: BeautifulSoup, selectors: list):
        """Tìm element bằng một trong các selector"""
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                return element
        return None
    
    def _calculate_text_quality(self, text: str) -> float:
        """Tính chất lượng của text"""
        if not text:
            return 0.0
            
        # Độ dài tối thiểu
        if len(text) < 50:
            return 0.1
            
        # Tỷ lệ từ có ý nghĩa vs tổng số từ
        words = text.split()
        if len(words) < 10:
            return 0.3
            
        # Kiểm tra có quá nhiều số không
        import re
        numbers = re.findall(r'\d+', text)
        if len(numbers) / len(words) > 0.5:
            return 0.5
            
        return min(len(text) / 1000, 1.0)


class ExtractionResult:
    """Class để wrap kết quả extraction"""
    
    def __init__(self, content: Dict, confidence: float, extractor_type: str):
        self.content = content
        self.confidence = confidence
        self.extractor_type = extractor_type
        self.timestamp = self._get_timestamp()
    
    def _get_timestamp(self) -> str:
        """Lấy timestamp hiện tại"""
        from datetime import datetime
        return datetime.now().isoformat()
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            'content': self.content,
            'confidence': self.confidence,
            'extractor_type': self.extractor_type,
            'timestamp': self.timestamp
        }
