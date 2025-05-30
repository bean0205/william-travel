"""
General Content Extractor

A general-purpose extractor for any type of web page
"""

from typing import Dict
from bs4 import BeautifulSoup
from .base import BaseExtractor
import re


class GeneralExtractor(BaseExtractor):
    """
    General-purpose extractor for any web page
    Falls back to basic HTML extraction when specialized extractors don't work
    """
    
    def __init__(self):
        super().__init__()
        self.extractor_type = "general"
        self.required_elements = ["title"]
        self.optional_elements = ["h1", "h2", "h3", "p", "article", "main", "content"]
    
    def extract(self, soup: BeautifulSoup, url: str = "") -> Dict:
        """
        Extract general content from any web page
        
        Args:
            soup: BeautifulSoup object
            url: Source URL
            
        Returns:
            Dict containing extracted content
        """
        try:
            # Extract basic information
            content = {
                'title': self._extract_title(soup),
                'description': self._extract_description(soup),
                'text_content': self._extract_text_content(soup),
                'headings': self._extract_headings(soup),
                'links': self._extract_links(soup, url),
                'images': self._extract_images(soup, url),
                'meta_tags': self._extract_meta_tags(soup)
            }
            
            # Calculate confidence
            confidence = self.get_confidence_score(soup)
            
            return {
                'content': content,
                'extraction_success': True,
                'extraction_confidence': confidence,
                'extractor_used': self.extractor_type
            }
            
        except Exception as e:
            return {
                'content': {},
                'extraction_success': False,
                'extraction_confidence': 0,
                'error': str(e),
                'extractor_used': self.extractor_type
            }
    
    def get_confidence_score(self, soup: BeautifulSoup) -> float:
        """
        Calculate confidence score for general extraction
        
        Args:
            soup: BeautifulSoup object
            
        Returns:
            float: Confidence score between 0 and 1
        """
        score = 0.5  # Base score for general extractor
        
        # Check for title
        if soup.find('title'):
            score += 0.1
            
        # Check for meta description
        if soup.find('meta', attrs={'name': 'description'}):
            score += 0.1
            
        # Check for main content areas
        content_elements = soup.find_all(['article', 'main', 'section'])
        if content_elements:
            score += 0.1
            
        # Check for structured data
        if soup.find_all(['h1', 'h2', 'h3']):
            score += 0.1
            
        # Check for paragraphs
        paragraphs = soup.find_all('p')
        if len(paragraphs) > 3:
            score += 0.1
            
        return min(score, 1.0)
    
    def _extract_title(self, soup: BeautifulSoup) -> str:
        """Extract page title"""
        # Try title tag first
        title_tag = soup.find('title')
        if title_tag and title_tag.get_text(strip=True):
            return title_tag.get_text(strip=True)
        
        # Try h1 tag
        h1_tag = soup.find('h1')
        if h1_tag and h1_tag.get_text(strip=True):
            return h1_tag.get_text(strip=True)
            
        # Try og:title
        og_title = soup.find('meta', property='og:title')
        if og_title and og_title.get('content'):
            return og_title['content']
            
        return ""
    
    def _extract_description(self, soup: BeautifulSoup) -> str:
        """Extract page description"""
        # Try meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            return meta_desc['content']
        
        # Try og:description
        og_desc = soup.find('meta', property='og:description')
        if og_desc and og_desc.get('content'):
            return og_desc['content']
            
        # Try first paragraph
        first_p = soup.find('p')
        if first_p and first_p.get_text(strip=True):
            text = first_p.get_text(strip=True)
            return text[:200] + "..." if len(text) > 200 else text
            
        return ""
    
    def _extract_text_content(self, soup: BeautifulSoup) -> str:
        """Extract main text content"""
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Try to find main content areas first
        main_content = None
        for tag in ['main', 'article', 'section']:
            main_content = soup.find(tag)
            if main_content:
                break
        
        if main_content:
            return main_content.get_text(separator=' ', strip=True)
        
        # Fallback to body content
        body = soup.find('body')
        if body:
            return body.get_text(separator=' ', strip=True)
        
        # Last resort: all text
        return soup.get_text(separator=' ', strip=True)
    
    def _extract_headings(self, soup: BeautifulSoup) -> Dict:
        """Extract all headings"""
        headings = {}
        for level in range(1, 7):
            tag = f'h{level}'
            elements = soup.find_all(tag)
            if elements:
                headings[tag] = [elem.get_text(strip=True) for elem in elements]
        return headings
    
    def _extract_links(self, soup: BeautifulSoup, base_url: str = "") -> list:
        """Extract all links"""
        links = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            text = link.get_text(strip=True)
            
            # Convert relative URLs to absolute
            if base_url and href.startswith('/'):
                from urllib.parse import urljoin
                href = urljoin(base_url, href)
            
            links.append({
                'url': href,
                'text': text,
                'title': link.get('title', '')
            })
        
        return links
    
    def _extract_images(self, soup: BeautifulSoup, base_url: str = "") -> list:
        """Extract all images"""
        images = []
        for img in soup.find_all('img'):
            src = img.get('src')
            if not src:
                continue
                
            # Convert relative URLs to absolute
            if base_url and src.startswith('/'):
                from urllib.parse import urljoin
                src = urljoin(base_url, src)
            
            images.append({
                'src': src,
                'alt': img.get('alt', ''),
                'title': img.get('title', ''),
                'width': img.get('width', ''),
                'height': img.get('height', '')
            })
        
        return images
    
    def _extract_meta_tags(self, soup: BeautifulSoup) -> Dict:
        """Extract meta tags"""
        meta_tags = {}
        
        # Standard meta tags
        for meta in soup.find_all('meta'):
            if meta.get('name'):
                meta_tags[meta['name']] = meta.get('content', '')
            elif meta.get('property'):
                meta_tags[meta['property']] = meta.get('content', '')
        
        return meta_tags
