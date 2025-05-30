"""
Blog Extractor Module

Extractor chuyên biệt cho blog cá nhân
Trích xuất: tiêu đề bài viết, nội dung chính, hình ảnh minh họa, tác giả, ngày đăng
"""

import re
from typing import Dict, List
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from .base import BaseExtractor, ExtractionResult


class BlogExtractor(BaseExtractor):
    """
    Extractor cho blog cá nhân
    
    Đặc điểm của blog posts:
    - Có tính cá nhân cao
    - Nội dung dài, có nhiều đoạn văn
    - Thường có comments
    - Có thể có nhiều hình ảnh minh họa
    - Tác giả thường cố định
    """
    
    def __init__(self):
        super().__init__()
        self.extractor_type = "blog"
        
        # Selectors cho blog posts
        self.title_selectors = [
            '.post-title h1', '.entry-title h1', '.blog-title h1',
            'h1.title', 'article h1', '.post h1', 'h1'
        ]
        
        self.content_selectors = [
            '.post-content', '.entry-content', '.blog-content',
            '.post-body', '.entry-body', '.blog-post .content',
            'article .content', '.post', '.entry', 'article'
        ]
        
        self.author_selectors = [
            '.post-author', '.entry-author', '.blog-author',
            '.author', '.byline', '[rel="author"]', '.writer'
        ]
        
        self.date_selectors = [
            '.post-date', '.entry-date', '.blog-date',
            'time[datetime]', '.date', '.published', '.timestamp'
        ]
        
        self.image_selectors = [
            '.post-image img', '.entry-image img', '.blog-image img',
            '.featured-image img', 'article img', '.post img'
        ]
        
        self.excerpt_selectors = [
            '.post-excerpt', '.entry-excerpt', '.blog-excerpt',
            '.excerpt', '.summary', '.intro'
        ]
        
        self.category_selectors = [
            '.post-category', '.entry-category', '.blog-category',
            '.categories', '.category'
        ]
        
        self.tag_selectors = [
            '.post-tags', '.entry-tags', '.blog-tags',
            '.tags', '.tag'
        ]
    
    def extract(self, soup: BeautifulSoup, url: str = "") -> Dict:
        """Trích xuất nội dung blog"""
        result = self._extract_base_info(soup)
        
        # Title
        title_element = self._get_element_by_selectors(soup, self.title_selectors)
        if title_element:
            result['title'] = self._clean_text(title_element.get_text())
        
        # Content
        content_element = self._get_element_by_selectors(soup, self.content_selectors)
        if content_element:
            # Làm sạch content
            self._clean_content_element(content_element)
            
            result['content'] = self._clean_text(content_element.get_text())
            result['content_html'] = str(content_element)
            
            # Trích xuất images
            result['images'] = self._extract_images_from_element(content_element, url)
            
            # Phân tích content structure
            result['content_structure'] = self._analyze_content_structure(content_element)
        
        # Excerpt/Summary
        excerpt_element = self._get_element_by_selectors(soup, self.excerpt_selectors)
        if excerpt_element:
            result['excerpt'] = self._clean_text(excerpt_element.get_text())
        else:
            # Tạo excerpt từ đoạn đầu
            if 'content' in result and result['content']:
                result['excerpt'] = self._generate_excerpt(result['content'])
        
        # Author
        author_element = self._get_element_by_selectors(soup, self.author_selectors)
        if author_element:
            result['author'] = self._clean_text(author_element.get_text())
        else:
            # Thử meta tag
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
        
        # Categories
        result['categories'] = self._extract_categories(soup)
        
        # Tags
        result['tags'] = self._extract_tags(soup)
        
        # Comments
        result['comments_info'] = self._extract_comments_info(soup)
        
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
        
        # Blog metadata
        result['blog_info'] = self._extract_blog_info(soup, url)
        
        return result
    
    def get_confidence_score(self, soup: BeautifulSoup) -> float:
        """Tính confidence score cho blog extraction"""
        score = 0.0
        
        # Kiểm tra có title không (20%)
        title_element = self._get_element_by_selectors(soup, self.title_selectors)
        if title_element:
            score += 0.20
        
        # Kiểm tra có content không (40%)
        content_element = self._get_element_by_selectors(soup, self.content_selectors)
        if content_element:
            content_text = content_element.get_text(strip=True)
            if len(content_text) > 500:  # Blog thường có nội dung dài
                score += 0.40
            elif len(content_text) > 200:
                score += 0.25
        
        # Kiểm tra có author không (15%)
        author_element = self._get_element_by_selectors(soup, self.author_selectors)
        if author_element or soup.find('meta', attrs={'name': 'author'}):
            score += 0.15
        
        # Kiểm tra có date không (15%)
        date_element = self._get_element_by_selectors(soup, self.date_selectors)
        if date_element:
            score += 0.15
        
        # Kiểm tra có categories/tags không (10%)
        if (soup.select('.category, .categories, .tag, .tags') or 
            soup.find('meta', attrs={'name': 'keywords'})):
            score += 0.10
        
        # Bonus cho blog-specific indicators
        blog_indicators = soup.select('.blog, .post, .entry')
        if blog_indicators:
            score += 0.1
        
        # Bonus cho comments section
        comments = soup.select('.comments, .comment, #comments')
        if comments:
            score += 0.05
        
        return min(score, 1.0)
    
    def _clean_content_element(self, element):
        """Làm sạch content element"""
        # Loại bỏ các elements không cần thiết
        for tag in element.find_all(['script', 'style', '.ads', '.advertisement', 
                                   '.social-share', '.related-posts']):
            tag.decompose()
    
    def _analyze_content_structure(self, content_element) -> Dict:
        """Phân tích cấu trúc nội dung"""
        structure = {
            'paragraph_count': len(content_element.find_all('p')),
            'heading_count': len(content_element.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])),
            'image_count': len(content_element.find_all('img')),
            'link_count': len(content_element.find_all('a')),
            'list_count': len(content_element.find_all(['ul', 'ol'])),
            'quote_count': len(content_element.find_all('blockquote')),
            'word_count': len(content_element.get_text().split()),
            'has_code': bool(content_element.find_all(['code', 'pre']))
        }
        
        # Tính reading time (giả sử 200 từ/phút)
        structure['estimated_reading_time'] = max(1, structure['word_count'] // 200)
        
        return structure
    
    def _generate_excerpt(self, content: str, length: int = 150) -> str:
        """Tạo excerpt từ nội dung"""
        if not content:
            return ""
            
        # Lấy câu đầu tiên hoặc 150 ký tự đầu
        sentences = content.split('. ')
        if sentences and len(sentences[0]) <= length:
            return sentences[0] + '.'
        
        # Cắt tại từ gần nhất với length
        if len(content) <= length:
            return content
            
        truncated = content[:length]
        last_space = truncated.rfind(' ')
        if last_space > 0:
            truncated = truncated[:last_space]
            
        return truncated + '...'
    
    def _extract_categories(self, soup: BeautifulSoup) -> List[str]:
        """Trích xuất categories"""
        categories = []
        
        # Tìm trong category elements
        category_elements = soup.select('.category a, .categories a, .post-category a')
        for element in category_elements:
            cat_text = element.get_text(strip=True)
            if cat_text:
                categories.append(cat_text)
        
        # Tìm trong breadcrumb
        breadcrumb = soup.select('.breadcrumb a, .breadcrumbs a')
        if breadcrumb and len(breadcrumb) > 1:
            # Bỏ qua Home và page title
            for crumb in breadcrumb[1:-1]:
                cat_text = crumb.get_text(strip=True)
                if cat_text and cat_text not in categories:
                    categories.append(cat_text)
        
        return categories
    
    def _extract_tags(self, soup: BeautifulSoup) -> List[str]:
        """Trích xuất tags"""
        tags = []
        
        # Tìm trong tag elements
        tag_elements = soup.select('.tag a, .tags a, .post-tags a')
        for element in tag_elements:
            tag_text = element.get_text(strip=True)
            if tag_text:
                tags.append(tag_text)
        
        # Tìm trong meta keywords
        meta_keywords = soup.find('meta', attrs={'name': 'keywords'})
        if meta_keywords:
            keywords = meta_keywords.get('content', '')
            for tag in keywords.split(','):
                tag = tag.strip()
                if tag and tag not in tags:
                    tags.append(tag)
        
        return tags
    
    def _extract_comments_info(self, soup: BeautifulSoup) -> Dict:
        """Trích xuất thông tin về comments"""
        comments_info = {
            'has_comments': False,
            'comment_count': 0,
            'comments_enabled': False
        }
        
        # Tìm comments section
        comments_section = soup.select_one('.comments, #comments, .comment-section')
        if comments_section:
            comments_info['has_comments'] = True
            
            # Đếm số comments
            comment_items = comments_section.select('.comment, .comment-item, li[id*="comment"]')
            comments_info['comment_count'] = len(comment_items)
        
        # Tìm comment form
        comment_form = soup.find('form', id=re.compile(r'comment', re.I))
        if comment_form:
            comments_info['comments_enabled'] = True
        
        return comments_info
    
    def _extract_blog_info(self, soup: BeautifulSoup, url: str) -> Dict:
        """Trích xuất thông tin về blog"""
        blog_info = {}
        
        # Blog title (thường ở header)
        blog_title_selectors = [
            '.site-title', '.blog-title', 'header h1', '.logo'
        ]
        blog_title = self._get_element_by_selectors(soup, blog_title_selectors)
        if blog_title:
            blog_info['blog_title'] = self._clean_text(blog_title.get_text())
        
        # Blog description
        blog_desc_selectors = [
            '.site-description', '.blog-description', 'header .description'
        ]
        blog_desc = self._get_element_by_selectors(soup, blog_desc_selectors)
        if blog_desc:
            blog_info['blog_description'] = self._clean_text(blog_desc.get_text())
        
        # RSS feed
        rss_link = soup.find('link', attrs={'type': 'application/rss+xml'})
        if rss_link:
            blog_info['rss_feed'] = rss_link.get('href')
        
        # Blog platform detection
        blog_info['platform'] = self._detect_blog_platform(soup, url)
        
        return blog_info
    
    def _detect_blog_platform(self, soup: BeautifulSoup, url: str) -> str:
        """Phát hiện platform của blog"""
        # WordPress
        if (soup.find('meta', attrs={'name': 'generator', 'content': re.compile(r'WordPress', re.I)}) or
            'wp-content' in url or 'wordpress' in url.lower()):
            return 'WordPress'
        
        # Blogger
        if ('blogger' in url.lower() or 'blogspot' in url.lower() or
            soup.find('meta', attrs={'content': re.compile(r'Blogger', re.I)})):
            return 'Blogger'
        
        # Medium
        if 'medium.com' in url.lower():
            return 'Medium'
        
        # Ghost
        if soup.find('meta', attrs={'name': 'generator', 'content': re.compile(r'Ghost', re.I)}):
            return 'Ghost'
        
        # Jekyll
        if soup.find('meta', attrs={'name': 'generator', 'content': re.compile(r'Jekyll', re.I)}):
            return 'Jekyll'
        
        return 'Unknown'


# Test function
if __name__ == "__main__":
    extractor = BlogExtractor()
    
    # Test với HTML mẫu của blog
    sample_html = """
    <html>
        <head>
            <title>My Personal Blog - Interesting Post</title>
            <meta name="author" content="Jane Blogger">
            <meta name="keywords" content="technology, programming, life">
        </head>
        <body>
            <header>
                <h1 class="site-title">My Personal Blog</h1>
                <p class="site-description">Thoughts on tech and life</p>
            </header>
            <article class="post">
                <h1 class="post-title">My Thoughts on Modern Technology</h1>
                <div class="post-meta">
                    <span class="post-author">By Jane Blogger</span>
                    <time class="post-date" datetime="2025-05-27">May 27, 2025</time>
                    <div class="categories">
                        <a href="/category/tech">Technology</a>
                    </div>
                </div>
                <div class="post-content">
                    <p>This is the beginning of my blog post about technology...</p>
                    <img src="tech-image.jpg" alt="Technology illustration">
                    <p>Here's more content with my personal thoughts...</p>
                    <h2>My Experience</h2>
                    <p>Let me share my personal experience...</p>
                </div>
                <div class="post-tags">
                    <a href="/tag/tech">tech</a>
                    <a href="/tag/programming">programming</a>
                </div>
            </article>
            <div class="comments">
                <h3>Comments</h3>
                <div class="comment">
                    <p>Great post!</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    soup = BeautifulSoup(sample_html, 'html.parser')
    result = extractor.extract(soup, "https://myblog.com")
    confidence = extractor.get_confidence_score(soup)
    
    print(f"Confidence: {confidence:.2f}")
    print("Extracted content:")
    for key, value in result.items():
        print(f"{key}: {value}")
