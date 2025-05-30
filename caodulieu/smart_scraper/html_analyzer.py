"""
HTML Analyzer Module

Module phân tích cấu trúc HTML để xác định nội dung chính,
loại bỏ noise (quảng cáo, sidebar, footer, etc.)
"""

import re
from bs4 import BeautifulSoup, Tag, NavigableString
from typing import List, Dict, Optional, Tuple
from urllib.parse import urljoin, urlparse


class HTMLAnalyzer:
    """
    Analyzer để phân tích cấu trúc HTML và xác định nội dung chính
    
    Sử dụng các kỹ thuật:
    - Content scoring dựa trên text density
    - Phân tích DOM structure
    - Loại bỏ noise elements
    - Xác định main content area
    """
    
    def __init__(self):
        # Các selector của noise elements cần loại bỏ
        self.noise_selectors = [
            'nav', 'header', 'footer', 'aside', 'script', 'style',
            '.nav', '.navigation', '.menu', '.sidebar', '.ads', '.advertisement',
            '.footer', '.header', '.popup', '.modal', '.social', '.share',
            '.comment', '.comments', '.related', '.recommendation'
        ]
        
        # Các selector của content elements
        self.content_selectors = [
            'article', 'main', '.content', '.post', '.entry', '.article',
            '.main-content', '.post-content', '.article-content', '.entry-content',
            '.blog-post', '.news-content', '.product-description'
        ]
        
        # Patterns cho việc detect text density
        self.text_patterns = {
            'paragraph_min_length': 50,  # Độ dài tối thiểu của paragraph
            'link_density_threshold': 0.3,  # Tỷ lệ link tối đa
            'text_to_tag_ratio': 5  # Tỷ lệ text/tag tối thiểu
        }
    
    def analyze_page_structure(self, html_content: str, base_url: str = "") -> Dict:
        """
        Phân tích cấu trúc trang và trích xuất thông tin chính
        
        Args:
            html_content: Nội dung HTML
            base_url: URL gốc để resolve relative URLs
            
        Returns:
            Dict chứa thông tin đã phân tích
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Làm sạch HTML
        cleaned_soup = self._clean_html(soup)
        
        # Tìm main content
        main_content = self._find_main_content(cleaned_soup)
        
        # Trích xuất các elements
        result = {
            'title': self._extract_title(soup),
            'meta_description': self._extract_meta_description(soup),
            'main_content': self._extract_text_content(main_content),
            'images': self._extract_images(main_content, base_url),
            'links': self._extract_links(main_content, base_url),
            'headings': self._extract_headings(main_content),
            'metadata': self._extract_metadata(soup),
            'content_score': self._calculate_content_score(main_content),
            'structure_info': self._analyze_structure(soup)
        }
        
        return result
    
    def _clean_html(self, soup: BeautifulSoup) -> BeautifulSoup:
        """Loại bỏ các elements không cần thiết"""
        # Tạo copy để không thay đổi original
        cleaned = BeautifulSoup(str(soup), 'html.parser')
        
        # Loại bỏ noise elements
        for selector in self.noise_selectors:
            elements = cleaned.select(selector)
            for element in elements:
                element.decompose()
        
        # Loại bỏ hidden elements
        hidden_elements = cleaned.find_all(style=re.compile(r'display\s*:\s*none'))
        for element in hidden_elements:
            element.decompose()
            
        return cleaned
    
    def _find_main_content(self, soup: BeautifulSoup) -> Tag:
        """Tìm main content area"""
        # Thử tìm bằng content selectors trước
        for selector in self.content_selectors:
            content = soup.select_one(selector)
            if content and self._is_valid_content(content):
                return content
        
        # Nếu không tìm thấy, sử dụng content scoring
        candidates = soup.find_all(['div', 'section', 'article', 'main'])
        best_candidate = None
        best_score = 0
        
        for candidate in candidates:
            score = self._calculate_content_score(candidate)
            if score > best_score:
                best_score = score
                best_candidate = candidate
        
        return best_candidate if best_candidate else soup.body or soup
    
    def _is_valid_content(self, element: Tag) -> bool:
        """Kiểm tra element có phải là content hợp lệ không"""
        if not element:
            return False
            
        text = element.get_text(strip=True)
        if len(text) < 100:  # Quá ngắn
            return False
            
        # Kiểm tra text density
        links = element.find_all('a')
        link_text_length = sum(len(link.get_text(strip=True)) for link in links)
        
        if len(text) > 0:
            link_density = link_text_length / len(text)
            return link_density < self.text_patterns['link_density_threshold']
            
        return True
    
    def _calculate_content_score(self, element: Tag) -> float:
        """Tính điểm content score cho element"""
        if not element:
            return 0.0
            
        score = 0.0
        text = element.get_text(strip=True)
        
        # Điểm cho độ dài text
        score += min(len(text) / 1000, 10)
        
        # Điểm cho số lượng paragraphs
        paragraphs = element.find_all('p')
        valid_paragraphs = [p for p in paragraphs 
                          if len(p.get_text(strip=True)) >= self.text_patterns['paragraph_min_length']]
        score += len(valid_paragraphs) * 2
        
        # Trừ điểm cho link density cao
        links = element.find_all('a')
        if text:
            link_text = sum(len(link.get_text(strip=True)) for link in links)
            link_density = link_text / len(text)
            score -= link_density * 5
        
        # Điểm cho các semantic tags
        semantic_tags = element.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        score += len(semantic_tags) * 0.5
        
        return max(score, 0)
    
    def _extract_title(self, soup: BeautifulSoup) -> str:
        """Trích xuất title của trang"""
        # Thử h1 trước
        h1 = soup.find('h1')
        if h1:
            return h1.get_text(strip=True)
            
        # Sau đó thử title tag
        title = soup.find('title')
        if title:
            return title.get_text(strip=True)
            
        return ""
    
    def _extract_meta_description(self, soup: BeautifulSoup) -> str:
        """Trích xuất meta description"""
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            return meta_desc.get('content', '')
            
        # Thử Open Graph description
        og_desc = soup.find('meta', attrs={'property': 'og:description'})
        if og_desc:
            return og_desc.get('content', '')
            
        return ""
    
    def _extract_text_content(self, element: Tag) -> str:
        """Trích xuất nội dung text chính"""
        if not element:
            return ""
            
        # Loại bỏ các elements không cần thiết
        for tag in element.find_all(['script', 'style', 'nav', 'footer']):
            tag.decompose()
            
        # Lấy text và làm sạch
        text = element.get_text(separator=' ', strip=True)
        # Loại bỏ whitespace thừa
        text = re.sub(r'\s+', ' ', text)
        
        return text
    
    def _extract_images(self, element: Tag, base_url: str) -> List[Dict]:
        """Trích xuất danh sách images"""
        images = []
        
        if not element:
            return images
            
        img_tags = element.find_all('img')
        for img in img_tags:
            src = img.get('src')
            if src:
                # Resolve relative URL
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
    
    def _extract_links(self, element: Tag, base_url: str) -> List[Dict]:
        """Trích xuất danh sách links"""
        links = []
        
        if not element:
            return links
            
        link_tags = element.find_all('a', href=True)
        for link in link_tags:
            href = link.get('href')
            text = link.get_text(strip=True)
            
            if href and text:
                # Resolve relative URL
                if base_url:
                    href = urljoin(base_url, href)
                    
                links.append({
                    'url': href,
                    'text': text,
                    'title': link.get('title', '')
                })
                
        return links
    
    def _extract_headings(self, element: Tag) -> List[Dict]:
        """Trích xuất các headings (h1-h6)"""
        headings = []
        
        if not element:
            return headings
            
        for i in range(1, 7):
            heading_tags = element.find_all(f'h{i}')
            for heading in heading_tags:
                text = heading.get_text(strip=True)
                if text:
                    headings.append({
                        'level': i,
                        'text': text,
                        'id': heading.get('id', '')
                    })
                    
        return headings
    
    def _extract_metadata(self, soup: BeautifulSoup) -> Dict:
        """Trích xuất metadata từ trang"""
        metadata = {}
        
        # Open Graph data
        og_tags = soup.find_all('meta', attrs={'property': re.compile(r'^og:')})
        for tag in og_tags:
            prop = tag.get('property')
            content = tag.get('content')
            if prop and content:
                metadata[prop] = content
        
        # Twitter Card data
        twitter_tags = soup.find_all('meta', attrs={'name': re.compile(r'^twitter:')})
        for tag in twitter_tags:
            name = tag.get('name')
            content = tag.get('content')
            if name and content:
                metadata[name] = content
        
        # Schema.org microdata
        schema_items = soup.find_all(attrs={'itemscope': True})
        for item in schema_items:
            item_type = item.get('itemtype')
            if item_type:
                metadata['schema_type'] = item_type
                break
        
        # Publication date
        date_selectors = [
            'meta[name="publish_date"]',
            'meta[property="article:published_time"]',
            'time[datetime]',
            '.date', '.published', '.timestamp'
        ]
        
        for selector in date_selectors:
            element = soup.select_one(selector)
            if element:
                if element.name == 'meta':
                    metadata['publish_date'] = element.get('content')
                elif element.name == 'time':
                    metadata['publish_date'] = element.get('datetime') or element.get_text(strip=True)
                else:
                    metadata['publish_date'] = element.get_text(strip=True)
                break
        
        # Author
        author_selectors = [
            'meta[name="author"]',
            'meta[property="article:author"]',
            '.author', '.byline', '[rel="author"]'
        ]
        
        for selector in author_selectors:
            element = soup.select_one(selector)
            if element:
                if element.name == 'meta':
                    metadata['author'] = element.get('content')
                else:
                    metadata['author'] = element.get_text(strip=True)
                break
        
        return metadata
    
    def _analyze_structure(self, soup: BeautifulSoup) -> Dict:
        """Phân tích cấu trúc tổng thể của trang"""
        structure = {
            'has_header': bool(soup.find(['header', '.header'])),
            'has_nav': bool(soup.find(['nav', '.nav', '.navigation'])),
            'has_main': bool(soup.find(['main', '.main', '.content'])),
            'has_aside': bool(soup.find(['aside', '.sidebar'])),
            'has_footer': bool(soup.find(['footer', '.footer'])),
            'total_elements': len(soup.find_all()),
            'total_text_length': len(soup.get_text()),
            'has_forms': bool(soup.find('form')),
            'has_tables': bool(soup.find('table')),
            'script_count': len(soup.find_all('script')),
            'css_count': len(soup.find_all('link', rel='stylesheet'))
        }
        
        return structure


# Test function
if __name__ == "__main__":
    analyzer = HTMLAnalyzer()
    
    # Test với HTML mẫu
    sample_html = """
    <html>
        <head>
            <title>Test Article</title>
            <meta name="description" content="This is a test article">
        </head>
        <body>
            <header>Header content</header>
            <nav>Navigation</nav>
            <main>
                <article>
                    <h1>Main Article Title</h1>
                    <p>This is the main content of the article...</p>
                    <img src="image.jpg" alt="Test image">
                </article>
            </main>
            <footer>Footer content</footer>
        </body>
    </html>
    """
    
    result = analyzer.analyze_page_structure(sample_html)
    print("Analyzed structure:")
    for key, value in result.items():
        print(f"{key}: {value}")
