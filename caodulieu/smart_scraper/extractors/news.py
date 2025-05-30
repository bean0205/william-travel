"""
News Extractor Module

Extractor chuyên biệt cho các trang tin tức
Trích xuất: tiêu đề, nội dung chính, ảnh đại diện, tác giả, ngày đăng
"""

import re
from typing import Dict, List
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from .base import BaseExtractor, ExtractionResult


class NewsExtractor(BaseExtractor):
    """
    Extractor cho trang tin tức
    
    Tìm kiếm các elements đặc trưng của tin tức:
    - Article title (h1, .title, .headline)
    - Article content (.article-content, .post-content, article)
    - Author (.author, .byline, [rel="author"])
    - Publish date (time, .date, .published)
    - Featured image (.featured-image, article img)
    """
    
    def __init__(self):
        super().__init__()
        self.extractor_type = "news"
        
        # Selectors cho các elements của tin tức
        self.title_selectors = [
            'h1.title', 'h1.headline', '.article-title h1', 
            '.post-title h1', 'article h1', 'h1'
        ]
        
        self.content_selectors = [
            '.article-content', '.post-content', '.entry-content',
            '.news-content', '.article-body', 'article .content',
            '.story-content', '.article-text', 'article'
        ]
        
        self.author_selectors = [
            '.author', '.byline', '.article-author', '.post-author',
            '[rel="author"]', '.writer', '.journalist'
        ]
        
        self.date_selectors = [
            'time[datetime]', '.date', '.published', '.publish-date',
            '.article-date', '.post-date', '.timestamp'
        ]
        
        self.image_selectors = [
            '.featured-image img', '.article-image img', 
            '.post-image img', 'article img', '.hero-image img'
        ]
        
        self.summary_selectors = [
            '.article-summary', '.post-summary', '.excerpt',
            '.lead', '.intro', '.article-intro'
        ]
    
    def extract(self, soup: BeautifulSoup, url: str = "") -> Dict:
        """Trích xuất nội dung tin tức"""
        result = self._extract_base_info(soup)
        
        # Title
        title_element = self._get_element_by_selectors(soup, self.title_selectors)
        if title_element:
            result['title'] = self._clean_text(title_element.get_text())
        
        # Content
        content_element = self._get_element_by_selectors(soup, self.content_selectors)
        if content_element:
            # Loại bỏ các elements không cần thiết
            for tag in content_element.find_all(['script', 'style', '.ads', '.advertisement']):
                tag.decompose()
                
            result['content'] = self._clean_text(content_element.get_text())
            result['content_html'] = str(content_element)
            
            # Trích xuất images từ content
            result['images'] = self._extract_images_from_element(content_element, url)
        
        # Summary/Lead
        summary_element = self._get_element_by_selectors(soup, self.summary_selectors)
        if summary_element:
            result['summary'] = self._clean_text(summary_element.get_text())
        
        # Author
        author_element = self._get_element_by_selectors(soup, self.author_selectors)
        if author_element:
            result['author'] = self._clean_text(author_element.get_text())
        else:
            # Thử tìm trong meta tags
            author_meta = soup.find('meta', attrs={'name': 'author'})
            if author_meta:
                result['author'] = author_meta.get('content', '')
        
        # Publish date
        date_element = self._get_element_by_selectors(soup, self.date_selectors)
        if date_element:
            if date_element.name == 'time':
                result['publish_date'] = date_element.get('datetime') or date_element.get_text(strip=True)
            else:
                result['publish_date'] = self._clean_text(date_element.get_text())
        else:
            # Thử tìm trong meta tags
            date_meta = soup.find('meta', attrs={'property': 'article:published_time'})
            if date_meta:
                result['publish_date'] = date_meta.get('content', '')
        
        # Featured image
        featured_img = self._get_element_by_selectors(soup, self.image_selectors)
        if featured_img:
            src = featured_img.get('src')
            if src and url:
                src = urljoin(url, src)
            result['featured_image'] = {
                'src': src,
                'alt': featured_img.get('alt', ''),
                'title': featured_img.get('title', '')
            }
        
        # Tags/Categories
        result['tags'] = self._extract_tags(soup)
        result['category'] = self._extract_category(soup)
        
        # Related articles
        result['related_articles'] = self._extract_related_articles(soup, url)
        
        return result
    
    def get_confidence_score(self, soup: BeautifulSoup) -> float:
        """Tính confidence score cho news extraction"""
        score = 0.0
        
        # Kiểm tra có title không (25%)
        title_element = self._get_element_by_selectors(soup, self.title_selectors)
        if title_element:
            score += 0.25
        
        # Kiểm tra có content không (40%)
        content_element = self._get_element_by_selectors(soup, self.content_selectors)
        if content_element:
            content_text = content_element.get_text(strip=True)
            if len(content_text) > 200:  # Nội dung đủ dài
                score += 0.40
            elif len(content_text) > 50:
                score += 0.20
        
        # Kiểm tra có author không (15%)
        author_element = self._get_element_by_selectors(soup, self.author_selectors)
        if author_element or soup.find('meta', attrs={'name': 'author'}):
            score += 0.15
        
        # Kiểm tra có date không (20%)
        date_element = self._get_element_by_selectors(soup, self.date_selectors)
        if date_element or soup.find('meta', attrs={'property': 'article:published_time'}):
            score += 0.20
        
        # Bonus cho Open Graph article type
        og_type = soup.find('meta', attrs={'property': 'og:type'})
        if og_type and og_type.get('content') == 'article':
            score += 0.1
        
        # Bonus cho schema.org NewsArticle
        schema_type = soup.find(attrs={'itemtype': re.compile(r'NewsArticle|Article')})
        if schema_type:
            score += 0.1
        
        return min(score, 1.0)
    
    def _extract_tags(self, soup: BeautifulSoup) -> List[str]:
        """Trích xuất tags/keywords"""
        tags = []
        
        # Thử tìm trong meta keywords
        meta_keywords = soup.find('meta', attrs={'name': 'keywords'})
        if meta_keywords:
            keywords = meta_keywords.get('content', '')
            tags.extend([tag.strip() for tag in keywords.split(',') if tag.strip()])
        
        # Thử tìm trong article:tag
        article_tags = soup.find_all('meta', attrs={'property': 'article:tag'})
        for tag_meta in article_tags:
            tag_content = tag_meta.get('content', '')
            if tag_content:
                tags.append(tag_content)
        
        # Thử tìm trong .tags, .categories
        tag_elements = soup.select('.tags a, .tag a, .categories a')
        for element in tag_elements:
            tag_text = element.get_text(strip=True)
            if tag_text:
                tags.append(tag_text)
        
        return list(set(tags))  # Loại bỏ duplicate
    
    def _extract_category(self, soup: BeautifulSoup) -> str:
        """Trích xuất category/section"""
        # Thử tìm trong article:section
        section_meta = soup.find('meta', attrs={'property': 'article:section'})
        if section_meta:
            return section_meta.get('content', '')
        
        # Thử tìm trong breadcrumb
        breadcrumb = soup.select('.breadcrumb a, .breadcrumbs a, nav a')
        if breadcrumb and len(breadcrumb) > 1:
            return breadcrumb[-2].get_text(strip=True)  # Lấy item gần cuối
        
        # Thử tìm trong URL path
        canonical = soup.find('link', attrs={'rel': 'canonical'})
        if canonical:
            href = canonical.get('href', '')
            if href:
                from urllib.parse import urlparse
                path = urlparse(href).path
                parts = [p for p in path.split('/') if p]
                if len(parts) > 1:
                    return parts[0]  # Lấy phần đầu của path
        
        return ""
    
    def _extract_related_articles(self, soup: BeautifulSoup, base_url: str) -> List[Dict]:
        """Trích xuất danh sách bài viết liên quan"""
        related = []
        
        # Tìm sections có related articles
        related_sections = soup.select('.related, .related-articles, .similar-posts')
        
        for section in related_sections:
            articles = section.find_all('a', href=True)
            for article_link in articles:
                href = article_link.get('href')
                title = article_link.get_text(strip=True)
                
                if href and title and len(title) > 10:  # Filter out short/meaningless titles
                    if base_url:
                        href = urljoin(base_url, href)
                    
                    related.append({
                        'title': title,
                        'url': href
                    })
        
        return related[:5]  # Giới hạn 5 bài liên quan


# Test function
if __name__ == "__main__":
    extractor = NewsExtractor()
    
    # Test với HTML mẫu của trang tin tức
    sample_html = """
    <html>
        <head>
            <title>Breaking News: Important Event</title>
            <meta name="author" content="John Doe">
            <meta property="article:published_time" content="2025-05-27T10:00:00Z">
            <meta property="og:type" content="article">
        </head>
        <body>
            <article>
                <h1 class="title">Breaking News: Important Event Happened</h1>
                <div class="article-meta">
                    <span class="author">By John Doe</span>
                    <time datetime="2025-05-27T10:00:00Z">May 27, 2025</time>
                </div>
                <div class="article-content">
                    <p>This is the main content of the news article...</p>
                    <img src="news-image.jpg" alt="News image">
                    <p>More content here...</p>
                </div>
            </article>
        </body>
    </html>
    """
    
    soup = BeautifulSoup(sample_html, 'html.parser')
    result = extractor.extract(soup, "https://example.com")
    confidence = extractor.get_confidence_score(soup)
    
    print(f"Confidence: {confidence:.2f}")
    print("Extracted content:")
    for key, value in result.items():
        print(f"{key}: {value}")
