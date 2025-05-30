"""
AI-Powered Content Extraction Module

Module này sử dụng machine learning và AI để:
1. Phân tích và trích xuất nội dung thông minh
2. Đánh giá chất lượng nội dung
3. Phân loại và gắn thẻ tự động
4. Tóm tắt nội dung
"""

import asyncio
import logging
import re
from typing import Dict, List, Optional, Tuple, Any
from datetime import datetime
import json
import warnings

# ML và NLP libraries
import torch
from transformers import pipeline, AutoTokenizer, AutoModel

# Suppress transformers model loading warnings
import transformers
transformers.logging.set_verbosity_error()
from sentence_transformers import SentenceTransformer
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
import numpy as np

# Content extraction libraries  
import trafilatura
from readability import Document
import justext
from boilerpy3 import extractors

# Text analysis
import textstat
from langdetect import detect, LangDetectException
import yake

# Utils
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import warnings
warnings.filterwarnings("ignore")

logger = logging.getLogger(__name__)


class AIContentExtractor:
    """
    AI-powered content extractor với machine learning capabilities
    """
    
    def __init__(self, config=None):
        # Khởi tạo với cấu hình
        self.config = config or {}
        self.logger = logging.getLogger('smart_scraper.ai_extractor')
        
        # Khởi tạo device - ưu tiên MPS (Mac GPU)
        if hasattr(torch, 'mps') and torch.mps.is_available():
            self.device = torch.device('mps')
            self.logger.info("Using MPS device (Mac GPU)")
        elif torch.cuda.is_available():
            self.device = torch.device('cuda')
            self.logger.info("Using CUDA device")
        else:
            self.device = torch.device('cpu')
            self.logger.info("Using CPU device")
        
        self.setup_models()
        self.quality_thresholds = {
            'min_word_count': 50,
            'min_readability_score': 30,
            'min_content_ratio': 0.3,
            'min_semantic_coherence': 0.6
        }
        
    def setup_models(self):
        """Khởi tạo các models AI/ML"""
        try:
            # Xác định device - ưu tiên MPS (Mac GPU)
            if hasattr(torch, 'mps') and torch.mps.is_available():
                device = torch.device('mps')
                logger.info("Device set to use Mac GPU (MPS)")
            elif torch.cuda.is_available():
                device = torch.device('cuda')
                logger.info("Device set to use CUDA GPU")
            else:
                device = torch.device('cpu')
                logger.info("Device set to use cpu")
            
            # Lưu device để sử dụng cho các mô hình khác
            self.device = device
                
            # Sentence transformer cho semantic analysis
            self.sentence_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
            
            # SpaCy cho NLP processing
            try:
                self.nlp = spacy.load("en_core_web_sm")
            except OSError:
                logger.warning("English model not found, using blank model")
                self.nlp = spacy.blank("en")
                
            # Text summarization pipeline - sử dụng MPS nếu có
            device_id = 'mps' if str(device) == 'mps' else (0 if torch.cuda.is_available() else -1)
            self.summarizer = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                device=device_id
            )
            
            # Text classification pipeline - sử dụng MPS nếu có
            self.classifier = pipeline(
                "text-classification",
                model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                device=device_id
            )
            
            logger.info("AI models loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading AI models: {e}")
            self.use_fallback_models()
    
    def use_fallback_models(self):
        """Sử dụng models đơn giản hơn nếu không load được models chính"""
        self.sentence_model = None
        self.nlp = None
        self.summarizer = None
        self.classifier = None
        logger.info("Using fallback mode without AI models")
    
    async def extract_content(self, html: str, url: str = "") -> Dict[str, Any]:
        """
        Trích xuất nội dung sử dụng multiple methods và AI analysis
        
        Args:
            html: Raw HTML content
            url: Source URL
            
        Returns:
            Dict chứa extracted content và metadata
        """
        try:
            # Multiple extraction methods
            extraction_results = await self._multi_method_extraction(html, url)
            
            # Chọn kết quả tốt nhất
            best_content = self._select_best_extraction(extraction_results)
            
            # AI enhancement
            enhanced_content = await self._enhance_with_ai(best_content, url)
            
            # Quality scoring
            quality_score = self._calculate_quality_score(enhanced_content)
            
            # Final result
            result = {
                'content': enhanced_content,
                'quality_score': quality_score,
                'extraction_methods': list(extraction_results.keys()),
                'best_method': best_content.get('method', 'unknown'),
                'url': url,
                'extracted_at': datetime.utcnow().isoformat(),
                'ai_enhanced': self.sentence_model is not None
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error in AI content extraction: {e}")
            return self._fallback_extraction(html, url)
    
    async def _multi_method_extraction(self, html: str, url: str) -> Dict[str, Dict]:
        """Sử dụng multiple methods để extract content"""
        results = {}
        
        # Method 1: Trafilatura (fast and accurate)
        try:
            trafilatura_result = trafilatura.extract(
                html,
                url=url,
                include_comments=False,
                include_tables=True,
                include_formatting=True,
                favor_precision=True
            )
            if trafilatura_result:
                results['trafilatura'] = {
                    'method': 'trafilatura',
                    'text': trafilatura_result,
                    'metadata': trafilatura.extract_metadata(html, fast=True),
                    'confidence': 0.9
                }
        except Exception as e:
            logger.warning(f"Trafilatura extraction failed: {e}")
        
        # Method 2: Readability
        try:
            doc = Document(html)
            results['readability'] = {
                'method': 'readability',
                'text': doc.summary(),
                'title': doc.title(),
                'confidence': 0.8
            }
        except Exception as e:
            logger.warning(f"Readability extraction failed: {e}")
        
        # Method 3: JusText
        try:
            paragraphs = justext.justext(html.encode('utf-8'), justext.get_stoplist("English"))
            good_paragraphs = [p.text for p in paragraphs if not p.is_boilerplate]
            if good_paragraphs:
                results['justext'] = {
                    'method': 'justext',
                    'text': '\n\n'.join(good_paragraphs),
                    'confidence': 0.7
                }
        except Exception as e:
            logger.warning(f"JusText extraction failed: {e}")
        
        # Method 4: Boilerpy3
        try:
            extractor = extractors.ArticleExtractor()
            content = extractor.get_content(html)
            if content:
                results['boilerpy3'] = {
                    'method': 'boilerpy3',
                    'text': content,
                    'confidence': 0.75
                }
        except Exception as e:
            logger.warning(f"Boilerpy3 extraction failed: {e}")
        
        # Method 5: Custom BeautifulSoup extraction
        try:
            soup = BeautifulSoup(html, 'lxml')
            custom_content = self._custom_bs_extraction(soup)
            if custom_content['text']:
                results['custom_bs'] = {
                    'method': 'custom_bs',
                    **custom_content,
                    'confidence': 0.6
                }
        except Exception as e:
            logger.warning(f"Custom BS extraction failed: {e}")
        
        return results
    
    def _custom_bs_extraction(self, soup: BeautifulSoup) -> Dict:
        """Custom BeautifulSoup-based extraction với heuristics"""
        # Remove script, style, nav, footer, sidebar elements
        for tag in soup(['script', 'style', 'nav', 'footer', 'aside', 'header']):
            tag.decompose()
        
        # Tìm main content area
        main_content = None
        
        # Thử tìm theo semantic tags
        for selector in ['main', 'article', '[role="main"]', '.content', '.post-content', '.article-content']:
            element = soup.select_one(selector)
            if element:
                main_content = element
                break
        
        if not main_content:
            # Fallback: tìm div có nhiều text nhất
            divs = soup.find_all('div')
            if divs:
                main_content = max(divs, key=lambda x: len(x.get_text(strip=True)))
        
        if not main_content:
            main_content = soup.body or soup
        
        # Extract text
        text = main_content.get_text(separator='\n', strip=True)
        
        # Extract structured data
        title = self._extract_title(soup)
        author = self._extract_author(soup)
        date = self._extract_date(soup)
        images = self._extract_images(soup, main_content)
        
        return {
            'text': text,
            'title': title,
            'author': author,
            'date': date,
            'images': images,
            'word_count': len(text.split())
        }
    
    def _extract_title(self, soup: BeautifulSoup) -> str:
        """Extract title with multiple fallbacks"""
        # Try og:title first
        og_title = soup.find('meta', property='og:title')
        if og_title:
            return og_title.get('content', '').strip()
        
        # Try h1
        h1 = soup.find('h1')
        if h1:
            return h1.get_text(strip=True)
        
        # Try title tag
        title = soup.find('title')
        if title:
            return title.get_text(strip=True)
        
        return ""
    
    def _extract_author(self, soup: BeautifulSoup) -> str:
        """Extract author information"""
        # Try multiple author selectors
        author_selectors = [
            'meta[name="author"]',
            'meta[property="article:author"]',
            '.author',
            '.byline',
            '[rel="author"]'
        ]
        
        for selector in author_selectors:
            element = soup.select_one(selector)
            if element:
                if element.name == 'meta':
                    return element.get('content', '').strip()
                else:
                    return element.get_text(strip=True)
        
        return ""
    
    def _extract_date(self, soup: BeautifulSoup) -> str:
        """Extract publication date"""
        # Try multiple date selectors
        date_selectors = [
            'meta[property="article:published_time"]',
            'meta[name="publication_date"]',
            'time[datetime]',
            '.date',
            '.published'
        ]
        
        for selector in date_selectors:
            element = soup.select_one(selector)
            if element:
                if element.name == 'meta':
                    return element.get('content', '').strip()
                elif element.name == 'time':
                    return element.get('datetime', element.get_text(strip=True))
                else:
                    return element.get_text(strip=True)
        
        return ""
    
    def _extract_images(self, soup: BeautifulSoup, content_area: BeautifulSoup) -> List[Dict]:
        """Extract images from content area"""
        images = []
        
        # Find images in content area
        for img in content_area.find_all('img'):
            src = img.get('src', '')
            alt = img.get('alt', '')
            
            if src and not src.startswith('data:'):  # Skip data URLs
                images.append({
                    'src': src,
                    'alt': alt,
                    'width': img.get('width'),
                    'height': img.get('height')
                })
        
        return images[:10]  # Limit to 10 images
    
    def _select_best_extraction(self, results: Dict[str, Dict]) -> Dict:
        """Chọn kết quả extraction tốt nhất dựa trên multiple criteria"""
        if not results:
            return {}
        
        # Score each result
        scored_results = []
        
        for method, result in results.items():
            score = 0
            text = result.get('text', '')
            
            # Base confidence score
            score += result.get('confidence', 0) * 0.3
            
            # Word count score (prefer more content, but not too much)
            word_count = len(text.split())
            if 100 <= word_count <= 5000:
                score += 0.3
            elif 50 <= word_count < 100:
                score += 0.2
            elif word_count > 5000:
                score += 0.1
            
            # Content quality indicators
            if text:
                # Paragraph structure
                paragraphs = text.split('\n\n')
                if len(paragraphs) >= 2:
                    score += 0.2
                
                # Sentence structure
                sentences = re.split(r'[.!?]+', text)
                avg_sentence_length = np.mean([len(s.split()) for s in sentences if s.strip()])
                if 10 <= avg_sentence_length <= 30:
                    score += 0.1
                
                # Language coherence
                try:
                    lang = detect(text[:1000])  # Check first 1000 chars
                    if lang in ['en', 'vi']:  # Expected languages
                        score += 0.1
                except:
                    pass
            
            scored_results.append((score, method, result))
        
        # Return best result
        scored_results.sort(reverse=True)
        best_score, best_method, best_result = scored_results[0]
        
        logger.info(f"Selected {best_method} with score {best_score:.2f}")
        return best_result
    
    async def _enhance_with_ai(self, content: Dict, url: str) -> Dict:
        """Enhance content với AI analysis"""
        if not content or not self.sentence_model:
            return content
        
        text = content.get('text', '')
        if not text or len(text.split()) < 10:
            return content
        
        try:
            # Text analysis
            enhanced = content.copy()
            
            # Language detection
            try:
                enhanced['language'] = detect(text)
            except LangDetectException:
                enhanced['language'] = 'unknown'
            
            # Readability analysis
            enhanced['readability'] = {
                'flesch_kincaid': textstat.flesch_kincaid_grade(text),
                'flesch_reading_ease': textstat.flesch_reading_ease(text),
                'automated_readability': textstat.automated_readability_index(text),
                'coleman_liau': textstat.coleman_liau_index(text)
            }
            
            # Keyword extraction
            enhanced['keywords'] = self._extract_keywords(text)
            
            # Topic modeling (if enough content)
            if len(text.split()) > 100:
                enhanced['topics'] = await self._extract_topics(text)
            
            # Summary generation (if model available and text is long enough)
            if self.summarizer and len(text.split()) > 150:
                enhanced['summary'] = await self._generate_summary(text)
            
            # Semantic embedding for similarity analysis
            if len(text) > 50:
                enhanced['embedding'] = self._get_text_embedding(text[:1000])
            
            return enhanced
            
        except Exception as e:
            logger.error(f"Error in AI enhancement: {e}")
            return content
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract keywords using YAKE"""
        try:
            # Detect language for YAKE
            try:
                lang = detect(text)
                if lang not in ['en', 'vi']:
                    lang = 'en'  # Default to English
            except:
                lang = 'en'
            
            kw_extractor = yake.KeywordExtractor(
                lan=lang,
                n=3,  # Maximum number of words in keyphrase
                dedupLim=0.7,  # Deduplication threshold
                top=10  # Number of keywords to extract
            )
            
            keywords = kw_extractor.extract_keywords(text)
            return [kw[1] for kw in keywords]  # Return just the keyword strings
            
        except Exception as e:
            logger.warning(f"Keyword extraction failed: {e}")
            return []
    
    async def _extract_topics(self, text: str) -> List[str]:
        """Extract topics using TF-IDF and clustering"""
        try:
            # Simple topic extraction using TF-IDF
            sentences = re.split(r'[.!?]+', text)
            sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
            
            if len(sentences) < 3:
                return []
            
            # TF-IDF vectorization
            vectorizer = TfidfVectorizer(
                max_features=100,
                stop_words='english',
                ngram_range=(1, 2)
            )
            
            tfidf_matrix = vectorizer.fit_transform(sentences)
            feature_names = vectorizer.get_feature_names_out()
            
            # Get top TF-IDF features as topics
            feature_scores = np.asarray(tfidf_matrix.sum(axis=0)).flatten()
            top_indices = feature_scores.argsort()[-5:][::-1]
            
            topics = [feature_names[i] for i in top_indices]
            return topics
            
        except Exception as e:
            logger.warning(f"Topic extraction failed: {e}")
            return []
    
    async def _generate_summary(self, text: str) -> str:
        """Generate summary using AI model"""
        try:
            if not self.summarizer:
                return ""
            
            # Limit input length for the model
            max_input_length = 1024
            input_text = text[:max_input_length] if len(text) > max_input_length else text
            
            # Generate summary
            summary = self.summarizer(
                input_text,
                max_length=150,
                min_length=50,
                do_sample=False
            )
            
            return summary[0]['summary_text'] if summary else ""
            
        except Exception as e:
            logger.warning(f"Summary generation failed: {e}")
            return ""
    
    def _get_text_embedding(self, text: str) -> Optional[List[float]]:
        """Get semantic embedding for text"""
        try:
            if not self.sentence_model:
                return None
            
            embedding = self.sentence_model.encode(text)
            return embedding.tolist()
            
        except Exception as e:
            logger.warning(f"Embedding generation failed: {e}")
            return None
    
    def _calculate_quality_score(self, content: Dict) -> float:
        """Calculate content quality score"""
        score = 0.0
        text = content.get('text', '')
        
        if not text:
            return 0.0
        
        # Word count score (30%)
        word_count = len(text.split())
        if word_count >= self.quality_thresholds['min_word_count']:
            word_score = min(1.0, word_count / 500)  # Max score at 500+ words
            score += word_score * 0.3
        
        # Readability score (25%)
        readability = content.get('readability', {})
        if readability:
            reading_ease = readability.get('flesch_reading_ease', 0)
            if reading_ease >= self.quality_thresholds['min_readability_score']:
                readability_score = min(1.0, reading_ease / 100)
                score += readability_score * 0.25
        
        # Structure score (20%)
        structure_score = 0
        if content.get('title'):
            structure_score += 0.3
        if content.get('author'):
            structure_score += 0.2
        if content.get('date'):
            structure_score += 0.2
        
        paragraphs = text.split('\n\n')
        if len(paragraphs) >= 3:
            structure_score += 0.3
        
        score += structure_score * 0.2
        
        # Content diversity score (15%)
        diversity_score = 0
        if content.get('keywords'):
            diversity_score += 0.4
        if content.get('topics'):
            diversity_score += 0.3
        if content.get('images'):
            diversity_score += 0.3
        
        score += diversity_score * 0.15
        
        # Language coherence score (10%)
        lang = content.get('language', 'unknown')
        if lang in ['en', 'vi']:
            score += 0.1
        
        return min(1.0, score)
    
    def _fallback_extraction(self, html: str, url: str) -> Dict:
        """Fallback extraction when AI methods fail"""
        try:
            soup = BeautifulSoup(html, 'lxml')
            content = self._custom_bs_extraction(soup)
            
            return {
                'content': content,
                'quality_score': 0.5,  # Default score for fallback
                'extraction_methods': ['fallback'],
                'best_method': 'fallback',
                'url': url,
                'extracted_at': datetime.utcnow().isoformat(),
                'ai_enhanced': False
            }
            
        except Exception as e:
            logger.error(f"Fallback extraction failed: {e}")
            return {
                'content': {'text': '', 'error': str(e)},
                'quality_score': 0.0,
                'extraction_methods': ['failed'],
                'best_method': 'failed',
                'url': url,
                'extracted_at': datetime.utcnow().isoformat(),
                'ai_enhanced': False
            }


# Global instance
ai_extractor = AIContentExtractor()
