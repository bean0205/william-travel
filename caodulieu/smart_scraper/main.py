"""
Main Smart Scraper Module

Module chính điều phối toàn bộ quá trình cào dữ liệu:
1. Nhận diện loại trang web
2. Chọn extractor phù hợp
3. Trích xuất nội dung
4. Trả về kết quả JSON
"""

import requests
import time
import asyncio
import aiohttp
from datetime import datetime
from typing import Dict, Optional, Union, List, Any, Tuple
from urllib.parse import urlparse
import json
from concurrent.futures import ThreadPoolExecutor

# Selenium imports (optional)
try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from webdriver_manager.chrome import ChromeDriverManager
    from selenium.webdriver.chrome.service import Service
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False

# Try importing playwright as an alternative to Selenium
try:
    import playwright
    from playwright.async_api import async_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

from bs4 import BeautifulSoup
from .classifier import WebPageClassifier
from .html_analyzer import HTMLAnalyzer
from .logging_config import get_logger
from .extractors import NewsExtractor, BlogExtractor, EcommerceExtractor, BaseExtractor, GeneralExtractor

# Import new AI-powered modules
try:
    from .ai_extractor import AIContentExtractor
    from .retry_manager import IntelligentRetryManager, RetryConfig
    from .anti_detection import AntiDetectionManager, RateLimitConfig, UserAgentConfig, ProxyConfig
    from .async_engine import AsyncScrapingEngine, AsyncScrapingConfig
    AI_MODULES_AVAILABLE = True
except ImportError as e:
    print(f"Warning: AI modules not available: {e}")
    AI_MODULES_AVAILABLE = False

# Rate limiting and proxy rotation libraries
try:
    import random
    import backoff
    from fake_useragent import UserAgent
    ADVANCED_FEATURES = True
except ImportError:
    ADVANCED_FEATURES = False

# Configuration import
try:
    from ..config import get_config
    CONFIG_AVAILABLE = True
except ImportError:
    CONFIG_AVAILABLE = False


class SmartScraper:
    """
    Smart Web Scraper - Ứng dụng cào dữ liệu web thông minh với AI
    
    Tự động nhận diện loại trang web và sử dụng extractor phù hợp
    để trích xuất nội dung một cách tối ưu.
    
    NEW AI Features:
    - AI-powered content extraction with machine learning
    - Advanced parsing with trafilatura and readability
    - Intelligent retry mechanism with exponential backoff
    - Content quality scoring with AI
    - Smart rate limiting and anti-detection
    - Async processing for higher performance
    
    Original Features:
    - Tự động classify trang web
    - Sử dụng extractor chuyên biệt cho từng loại
    - Hỗ trợ cả requests, aiohttp, Selenium và Playwright
    - Xử lý lỗi và retry logic với backoff thông minh
    - Cache kết quả
    - Phân tích JavaScript để lấy dữ liệu động
    - Hỗ trợ luân chuyển proxy tự động
    - Hỗ trợ xử lý batch với asyncio
    """
    
    def __init__(self, 
                 use_selenium: bool = False, 
                 use_playwright: bool = False, 
                 headless: bool = True,
                 timeout: int = 30, 
                 max_retries: int = 3, 
                 proxy_list: List[str] = None,
                 respect_robots_txt: bool = True,
                 enable_ai: bool = True,
                 enable_anti_detection: bool = True,
                 enable_async: bool = False,
                 config_override: Optional[Dict] = None):
        """
        Khởi tạo Smart Scraper với AI-powered features
        
        Args:
            use_selenium: Sử dụng Selenium cho dynamic content
            use_playwright: Sử dụng Playwright cho dynamic content (ưu tiên hơn Selenium nếu cả hai được kích hoạt)
            headless: Chạy browser ở chế độ headless
            timeout: Request timeout in seconds
            max_retries: Maximum number of retry attempts
            proxy_list: Danh sách các proxy để luân chuyển (format: "http://host:port")
            respect_robots_txt: Tuân thủ robots.txt của trang web
            enable_ai: Sử dụng AI content extraction và quality scoring
            enable_anti_detection: Sử dụng anti-detection features
            enable_async: Sử dụng async engine cho high performance
            config_override: Override configuration settings
        """
        # Basic settings
        self.use_selenium = use_selenium and SELENIUM_AVAILABLE
        self.use_playwright = use_playwright and PLAYWRIGHT_AVAILABLE
        self.headless = headless
        self.timeout = timeout
        self.max_retries = max_retries
        self.driver = None
        self.playwright = None
        self.browser_context = None
        self.logger = get_logger(__name__)
        self.proxy_list = proxy_list or []
        self.respect_robots_txt = respect_robots_txt
        
        # Load configuration
        self.config = {}
        if CONFIG_AVAILABLE:
            self.config = get_config()
        if config_override:
            self._update_config(config_override)
            
        # Mac GPU specific settings
        import torch
        use_mps = False
        if hasattr(torch, 'mps') and torch.mps.is_available():
            use_mps = True
            self.logger.info("Mac GPU (MPS) được phát hiện và sẽ được sử dụng")
        
        # AI Features - Luôn bật AI nếu có sẵn
        self.enable_ai = AI_MODULES_AVAILABLE
        self.enable_anti_detection = enable_anti_detection and AI_MODULES_AVAILABLE
        self.enable_async = enable_async and AI_MODULES_AVAILABLE
        
        # Initialize AI modules
        self._initialize_ai_modules()
        
        # Initialize original modules
        self.classifier = WebPageClassifier()
        self.html_analyzer = HTMLAnalyzer()
        
        # User agent for requests
        if ADVANCED_FEATURES:
            self.ua = UserAgent()
        else:
            self.ua = None
            
        # Session for requests
        self.session = requests.Session()
        self._setup_session()
        
        # Cache initialization
        self.cache = None  # External cache instance
        self._cache = {}   # Internal simple cache
        self._cache_ttl = self.config.get('cache_ttl', 3600)  # 1 hour default
        self.robots_txt_cache = {}  # Robots.txt cache
        
        # Statistics tracking
        self.stats = {
            'total_requests': 0,
            'successful_requests': 0,
            'failed_requests': 0,
            'ai_enhanced_extractions': 0,
            'anti_detection_activations': 0,
            'async_requests': 0
        }

    def _initialize_ai_modules(self):
        """Initialize all AI-powered modules"""
        try:
            # AI Content Extractor
            if self.enable_ai and AI_MODULES_AVAILABLE:
                ai_config = self.config.get('ai', {})
                self.ai_extractor = AIContentExtractor(
                    embedding_model=ai_config.get('ai_models', {}).get('embedding_model', 'all-MiniLM-L6-v2'),
                    summarization_model=ai_config.get('ai_models', {}).get('summarization_model', 'facebook/bart-large-cnn'),
                    quality_weights=ai_config.get('quality_weights', {}),
                    extract_keywords=ai_config.get('extract_keywords', True),
                    extract_summary=ai_config.get('extract_summary', True),
                    detect_language=ai_config.get('detect_language', True)
                )
                self.logger.info("AI Content Extractor initialized successfully")
            else:
                self.ai_extractor = None
                
            # Retry Manager
            if AI_MODULES_AVAILABLE:
                retry_config_dict = self.config.get('retry', {})
                retry_config = RetryConfig(
                    max_retries=retry_config_dict.get('max_retries', 5),
                    strategy=retry_config_dict.get('strategy', 'exponential'),
                    base_delay=retry_config_dict.get('base_delay', 1.0),
                    max_delay=retry_config_dict.get('max_delay', 60.0),
                    jitter=retry_config_dict.get('jitter', True)
                )
                self.retry_manager = IntelligentRetryManager(retry_config)
                self.logger.info("Intelligent Retry Manager initialized successfully")
            else:
                self.retry_manager = None
                
            # Anti-Detection Manager
            if self.enable_anti_detection and AI_MODULES_AVAILABLE:
                anti_detection_config = self.config.get('anti_detection', {})
                
                # Rate limiting config
                rate_config = RateLimitConfig(
                    requests_per_second=anti_detection_config.get('base_delay', 1.0),
                    adaptive=anti_detection_config.get('adaptive_rate_limit', True),
                    min_delay=anti_detection_config.get('base_delay', 1.0),
                    max_delay=anti_detection_config.get('max_delay', 30.0)
                )
                
                # User agent config
                ua_config = UserAgentConfig(
                    enabled=anti_detection_config.get('rotate_user_agents', True),
                    update_interval=anti_detection_config.get('session_rotation_interval', 50)
                )
                
                # Proxy config
                proxy_config = ProxyConfig(
                    enabled=anti_detection_config.get('use_proxies', False),
                    proxies=self.proxy_list,
                    rotation_strategy='quality_based',
                    health_check_interval=300
                )
                
                self.anti_detection_manager = AntiDetectionManager(
                    rate_config=rate_config,
                    ua_config=ua_config,
                    proxy_config=proxy_config
                )
                self.logger.info("Anti-Detection Manager initialized successfully")
            else:
                self.anti_detection_manager = None
                
            # Async Engine
            if self.enable_async and AI_MODULES_AVAILABLE:
                async_config_dict = self.config.get('async', {})
                async_config = AsyncScrapingConfig(
                    max_concurrent_requests=async_config_dict.get('max_concurrent_requests', 10),
                    max_concurrent_per_domain=3,
                    connection_pool_size=async_config_dict.get('connection_pool_size', 100),
                    connection_timeout=float(self.timeout),
                    enable_response_caching=async_config_dict.get('response_caching', True),
                    cache_size=async_config_dict.get('cache_size', 1000)
                )
                self.async_engine = AsyncScrapingEngine(async_config)
                self.logger.info("Async Scraping Engine initialized successfully")
            else:
                self.async_engine = None
                
        except Exception as e:
            self.logger.error(f"Error initializing AI modules: {e}")
            # Fallback to basic mode
            self.ai_extractor = None
            self.retry_manager = None
            self.anti_detection_manager = None
            self.async_engine = None
            
    def _update_config(self, updates: Dict):
        """Update configuration with overrides"""
        for section, section_updates in updates.items():
            if section in self.config:
                self.config[section].update(section_updates)
            else:
                self.config[section] = section_updates
    
    def _setup_session(self):
        """Setup the requests session with proper headers and configuration"""
        # Set up session headers
        self.session.headers.update({
            'User-Agent': self._get_user_agent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        })
        
        # Set timeout
        self.session.timeout = self.timeout
        
        # Setup extractors
        self._setup_extractors()
    
    def _setup_extractors(self):
        """Initialize the extractors dictionary"""
        self.extractors = {
            'news': NewsExtractor(),
            'blog': BlogExtractor(),
            'ecommerce': EcommerceExtractor(),
            'default': GeneralExtractor()
        }

    def _initialize_ai_modules(self):
        """Initialize all AI-powered modules"""
        try:
            # AI Content Extractor
            if self.enable_ai and AI_MODULES_AVAILABLE:
                ai_config = self.config.get('ai', {})
                self.ai_extractor = AIContentExtractor(
                    embedding_model=ai_config.get('ai_models', {}).get('embedding_model', 'all-MiniLM-L6-v2'),
                    summarization_model=ai_config.get('ai_models', {}).get('summarization_model', 'facebook/bart-large-cnn'),
                    quality_weights=ai_config.get('quality_weights', {}),
                    extract_keywords=ai_config.get('extract_keywords', True),
                    extract_summary=ai_config.get('extract_summary', True),
                    detect_language=ai_config.get('detect_language', True)
                )
                self.logger.info("AI Content Extractor initialized successfully")
            else:
                self.ai_extractor = None
                
            # Retry Manager
            if AI_MODULES_AVAILABLE:
                retry_config_dict = self.config.get('retry', {})
                retry_config = RetryConfig(
                    max_retries=retry_config_dict.get('max_retries', 5),
                    strategy=retry_config_dict.get('strategy', 'exponential'),
                    base_delay=retry_config_dict.get('base_delay', 1.0),
                    max_delay=retry_config_dict.get('max_delay', 60.0),
                    jitter=retry_config_dict.get('jitter', True)
                )
                self.retry_manager = IntelligentRetryManager(retry_config)
                self.logger.info("Intelligent Retry Manager initialized successfully")
            else:
                self.retry_manager = None
                
            # Anti-Detection Manager
            if self.enable_anti_detection and AI_MODULES_AVAILABLE:
                anti_detection_config = self.config.get('anti_detection', {})
                
                # Rate limiting config
                rate_config = RateLimitConfig(
                    requests_per_second=anti_detection_config.get('base_delay', 1.0),
                    adaptive=anti_detection_config.get('adaptive_rate_limit', True),
                    min_delay=anti_detection_config.get('base_delay', 1.0),
                    max_delay=anti_detection_config.get('max_delay', 30.0)
                )
                
                # User agent config
                ua_config = UserAgentConfig(
                    enabled=anti_detection_config.get('rotate_user_agents', True),
                    update_interval=anti_detection_config.get('session_rotation_interval', 50)
                )
                
                # Proxy config
                proxy_config = ProxyConfig(
                    enabled=anti_detection_config.get('use_proxies', False),
                    proxies=self.proxy_list,
                    rotation_strategy='quality_based',
                    health_check_interval=300
                )
                
                self.anti_detection_manager = AntiDetectionManager(
                    rate_config=rate_config,
                    ua_config=ua_config,
                    proxy_config=proxy_config
                )
                self.logger.info("Anti-Detection Manager initialized successfully")
            else:
                self.anti_detection_manager = None
                
            # Async Engine
            if self.enable_async and AI_MODULES_AVAILABLE:
                async_config_dict = self.config.get('async', {})
                async_config = AsyncScrapingConfig(
                    max_concurrent_requests=async_config_dict.get('max_concurrent_requests', 10),
                    max_concurrent_per_domain=3,
                    connection_pool_size=async_config_dict.get('connection_pool_size', 100),
                    connection_timeout=float(self.timeout),
                    enable_response_caching=async_config_dict.get('response_caching', True),
                    cache_size=async_config_dict.get('cache_size', 1000)
                )
                self.async_engine = AsyncScrapingEngine(async_config)
                self.logger.info("Async Scraping Engine initialized successfully")
            else:
                self.async_engine = None
                
        except Exception as e:
            self.logger.error(f"Error initializing AI modules: {e}")
            # Fallback to basic mode
            self.ai_extractor = None
            self.retry_manager = None
            self.anti_detection_manager = None
            self.async_engine = None
            
    def _update_config(self, updates: Dict):
        """Update configuration with overrides"""
        for section, section_updates in updates.items():
            if section in self.config:
                self.config[section].update(section_updates)
            else:
                self.config[section] = section_updates
    
    def _setup_session(self):
        """Setup the requests session with proper headers and configuration"""
        # Set up session headers
        self.session.headers.update({
            'User-Agent': self._get_user_agent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        })
        
        # Set timeout
        self.session.timeout = self.timeout
        
        # Setup extractors
        self._setup_extractors()
    
    def _setup_extractors(self):
        """Initialize the extractors dictionary"""
        self.extractors = {
            'news': NewsExtractor(),
            'blog': BlogExtractor(),
            'ecommerce': EcommerceExtractor(),
            'default': GeneralExtractor()
        }

    def _get_user_agent(self) -> str:
        """Lấy User-Agent ngẫu nhiên để tránh phát hiện bot"""
        if ADVANCED_FEATURES:
            try:
                return UserAgent().random
            except:
                pass
        return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    
    def scrape(self, url: str, force_type: Optional[str] = None,
               use_cache: bool = True, headers: Dict = None,
               render_js: bool = False) -> Dict:
        """
        AI-Enhanced Web Scraping từ URL
        
        Args:
            url: URL cần cào
            force_type: Bắt buộc sử dụng loại extractor cụ thể
            use_cache: Sử dụng cache hay không
            headers: Custom HTTP headers
            render_js: Bắt buộc render JavaScript (sử dụng Selenium/Playwright)

        Returns:
            Dict chứa kết quả cào dữ liệu với AI enhancements
        """
        # Update statistics
        self.stats['total_requests'] += 1
        
        # Kiểm tra cache
        if use_cache:
            if self.cache:
                cached_result = self.cache.get(url)
                if cached_result:
                    self.logger.info(f"Retrieved {url} from cache")
                    return cached_result
            elif url in self._cache:
                cached_result, timestamp = self._cache[url]
                if time.time() - timestamp < self._cache_ttl:
                    cached_result['from_cache'] = True
                    return cached_result
        
        # Kiểm tra robots.txt
        if self.respect_robots_txt and not self._check_robots_permission(url):
            error_msg = "Access disallowed by robots.txt"
            self.logger.warning(f"Cannot scrape {url}: {error_msg}")
            return self._create_error_result(url, error_msg)

        try:
            self.logger.info(f"Starting AI-enhanced scrape for URL: {url}")
            
            # AI Enhancement: Anti-detection preparation
            request_config = {}
            if self.enable_anti_detection and self.anti_detection_manager:
                self.stats['anti_detection_activations'] += 1
                request_config = asyncio.run(self.anti_detection_manager.prepare_request(url))
                if request_config.get('headers'):
                    headers = {**(headers or {}), **request_config['headers']}
                self.logger.info("Anti-detection measures applied")
            
            # Bước 1: Intelligent HTML fetching with retry logic
            html_content = self._fetch_html_with_retry(url, render_js=render_js, headers=headers)
            if not html_content:
                error_msg = "Failed to fetch HTML content"
                self.logger.error(f"Error for {url}: {error_msg}")
                self.stats['failed_requests'] += 1
                return self._create_error_result(url, error_msg)
            
            # Bước 2: Nhận diện loại trang web (nếu không bắt buộc)
            if force_type and force_type in self.extractors:
                page_type = force_type
                classification_confidence = 1.0
                self.logger.info(f"Using forced page type: {page_type}")
            else:
                page_type, classification_confidence = self.classifier.classify(url, html_content)
                self.logger.info(f"Classified as {page_type} with confidence {classification_confidence:.2f}")
            
            # Bước 3: Phân tích cấu trúc HTML
            html_analysis = self.html_analyzer.analyze_page_structure(html_content, url)
            
            # Bước 4: AI-Enhanced Content Extraction
            extraction_result = self._ai_enhanced_extraction(html_content, page_type, url)
            self.logger.info(f"Extraction completed with confidence: {extraction_result.get('extraction_confidence', 0):.2f}")
            
            # Bước 5: Kiểm tra và cải thiện kết quả nếu cần
            if extraction_result.get('extraction_confidence', 0) < 0.5 and render_js is False:
                self.logger.info(f"Low confidence extraction, trying with JavaScript rendering")
                html_content = self._fetch_html_with_retry(url, render_js=True, headers=headers)
                extraction_result = self._ai_enhanced_extraction(html_content, page_type, url)
            
            # AI Enhancement: Record success for anti-detection
            if self.enable_anti_detection and self.anti_detection_manager:
                proxy = request_config.get('proxy')
                self.anti_detection_manager.record_request_result(url, True, proxy)
            
            # Bước 6: Tạo kết quả cuối cùng với AI metadata
            result = self._create_ai_enhanced_result(
                url, page_type, classification_confidence,
                html_analysis, extraction_result
            )
            
            # Cache kết quả
            if use_cache:
                if self.cache:
                    self.cache.set(url, result)
                else:
                    self._cache[url] = (result, time.time())
            
            self.stats['successful_requests'] += 1
            self.logger.info(f"Successfully scraped {url} with AI enhancements")
            return result
            
        except Exception as e:
            error_msg = f"AI-enhanced scraping error: {str(e)}"
            self.logger.error(f"Error scraping {url}: {error_msg}")
            self.stats['failed_requests'] += 1
            
            # Record failure for anti-detection
            if self.enable_anti_detection and self.anti_detection_manager:
                self.anti_detection_manager.record_request_result(url, False)
            
            return self._create_error_result(url, error_msg)
    
    def scrape_multiple(self, urls: List[str], delay: float = None,
                        concurrent: bool = True, max_concurrency: int = None) -> List[Dict]:
        """
        Cào dữ liệu từ nhiều URLs
        
        Args:
            urls: Danh sách URLs
            delay: Thời gian delay giữa các requests
            concurrent: Sử dụng xử lý đồng thời
            max_concurrency: Số lượng request đồng thời tối đa

        Returns:
            List các kết quả
        """
        if concurrent:
            return self._scrape_multiple_concurrent(urls, max_concurrency=max_concurrency)
        else:
            return self._scrape_multiple_sequential(urls, delay=delay)

    def _scrape_multiple_sequential(self, urls: List[str], delay: float = None) -> List[Dict]:
        """Cào dữ liệu tuần tự từ nhiều URL"""
        results = []
        delay = delay or self.config.get('scraper', {}).get('delay_between_requests', 1.0)
        
        for i, url in enumerate(urls):
            try:
                result = self.scrape(url)
                results.append(result)
                
                # Delay giữa các requests (trừ request cuối)
                if i < len(urls) - 1:
                    time.sleep(delay)
                    
            except Exception as e:
                error_result = self._create_error_result(url, f"Error: {str(e)}")
                results.append(error_result)
        
        return results
    
    def _scrape_multiple_concurrent(self, urls: List[str], max_concurrency: int = None) -> List[Dict]:
        """Cào dữ liệu đồng thời từ nhiều URL sử dụng ThreadPoolExecutor"""
        max_workers = max_concurrency or self.config.get('concurrency_limit', 10)
        results = []

        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_url = {executor.submit(self.scrape, url): url for url in urls}
            for future in future_to_url:
                url = future_to_url[future]
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    error_result = self._create_error_result(url, f"Error: {str(e)}")
                    results.append(error_result)

        return results
    
    async def scrape_async(self, url: str, force_type: Optional[str] = None,
                           use_cache: bool = True) -> Dict:
        """
        AI-Enhanced Async Web Scraping từ URL

        Args:
            url: URL cần cào
            force_type: Bắt buộc sử dụng loại extractor
            use_cache: Sử dụng cache

        Returns:
            Dict chứa kết quả với AI enhancements
        """
        # Update statistics
        self.stats['total_requests'] += 1
        self.stats['async_requests'] += 1
        
        # Kiểm tra cache
        if use_cache:
            if self.cache:
                cached_result = self.cache.get(url)
                if cached_result:
                    self.logger.info(f"Retrieved {url} from cache")
                    return cached_result
            elif url in self._cache:
                cached_result, timestamp = self._cache[url]
                if time.time() - timestamp < self._cache_ttl:
                    cached_result['from_cache'] = True
                    return cached_result

        try:
            self.logger.info(f"Starting AI-enhanced async scrape for URL: {url}")
            
            # AI Enhancement: Anti-detection preparation
            request_config = {}
            if self.enable_anti_detection and self.anti_detection_manager:
                self.stats['anti_detection_activations'] += 1
                request_config = await self.anti_detection_manager.prepare_request(url)
                self.logger.info("Anti-detection measures applied for async request")
            
            # Use async engine if available, otherwise fallback
            if self.enable_async and self.async_engine:
                try:
                    html_content = await self.async_engine.fetch_url(url)
                except Exception as e:
                    self.logger.warning(f"Async engine failed, falling back to traditional: {e}")
                    html_content = await self._fetch_html_async(url)
            else:
                html_content = await self._fetch_html_async(url)
                
            if not html_content:
                error_msg = "Failed to fetch HTML content"
                self.logger.error(f"Error for {url}: {error_msg}")
                self.stats['failed_requests'] += 1
                return self._create_error_result(url, error_msg)

            # Các bước tiếp theo với AI enhancement
            if force_type and force_type in self.extractors:
                page_type = force_type
                classification_confidence = 1.0
            else:
                page_type, classification_confidence = self.classifier.classify(url, html_content)

            html_analysis = self.html_analyzer.analyze_page_structure(html_content, url)
            extraction_result = self._ai_enhanced_extraction(html_content, page_type, url)

            # AI Enhancement: Record success for anti-detection
            if self.enable_anti_detection and self.anti_detection_manager:
                proxy = request_config.get('proxy')
                self.anti_detection_manager.record_request_result(url, True, proxy)

            result = self._create_ai_enhanced_result(
                url, page_type, classification_confidence,
                html_analysis, extraction_result
            )

            # Cache kết quả
            if use_cache and result:
                if self.cache:
                    self.cache.set(url, result)
                else:
                    self._cache[url] = (result, time.time())

            self.stats['successful_requests'] += 1
            return result

        except Exception as e:
            error_msg = f"AI-enhanced async scraping error: {str(e)}"
            self.logger.error(f"Error scraping {url}: {error_msg}")
            self.stats['failed_requests'] += 1
            
            # Record failure for anti-detection
            if self.enable_anti_detection and self.anti_detection_manager:
                self.anti_detection_manager.record_request_result(url, False)
            
            return self._create_error_result(url, error_msg)

    async def scrape_multiple_async(self, urls: List[str],
                                   batch_size: int = None) -> List[Dict]:
        """
        Cào dữ liệu bất đồng bộ từ nhiều URLs

        Args:
            urls: Danh sách URLs
            batch_size: Số lượng request đồng thời tối đa

        Returns:
            List kết quả
        """
        batch_size = batch_size or self.config.get('concurrency_limit', 10)
        results = []

        # Chia thành các batch để tránh quá nhiều connections
        for i in range(0, len(urls), batch_size):
            batch_urls = urls[i:i + batch_size]
            batch_tasks = [self.scrape_async(url) for url in batch_urls]
            batch_results = await asyncio.gather(*batch_tasks, return_exceptions=True)

            for j, result in enumerate(batch_results):
                if isinstance(result, Exception):
                    error_result = self._create_error_result(batch_urls[j], f"Error: {str(result)}")
                    results.append(error_result)
                else:
                    results.append(result)

        return results

    async def _fetch_html_async(self, url: str) -> str:
        """Lấy HTML bất đồng bộ với aiohttp"""
        headers = {
            'User-Agent': self._get_user_agent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5'
        }

        # Sử dụng exponential backoff cho retry
        max_retries = self.config.get('scraper', {}).get('max_retries', self.max_retries)
        for attempt in range(max_retries):
            try:
                proxy = self._get_random_proxy()
                proxy_settings = {'proxy': proxy} if proxy else {}

                async with aiohttp.ClientSession() as session:
                    async with session.get(url, headers=headers, timeout=self.timeout,
                                          **proxy_settings) as response:
                        if response.status == 200:
                            return await response.text()
                        response.raise_for_status()
            except Exception as e:
                if attempt == max_retries - 1:
                    raise e
                await asyncio.sleep(2 ** attempt)  # Exponential backoff

        return ""

    def _check_robots_permission(self, url: str) -> bool:
        """Kiểm tra quyền truy cập theo robots.txt"""
        if not self.respect_robots_txt:
            return True

        try:
            from urllib.robotparser import RobotFileParser
            from urllib.parse import urlparse

            parsed_url = urlparse(url)
            base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"

            # Kiểm tra cache
            if base_url in self.robots_txt_cache:
                rp = self.robots_txt_cache[base_url]
            else:
                # Tạo mới và parse robots.txt
                rp = RobotFileParser()
                rp.set_url(f"{base_url}/robots.txt")
                rp.read()
                self.robots_txt_cache[base_url] = rp

            # Kiểm tra quyền truy cập cho URL và user agent hiện tại
            user_agent = self.config['user_agent']
            if isinstance(user_agent, dict) and 'User-Agent' in user_agent:
                user_agent = user_agent['User-Agent']
            return rp.can_fetch(user_agent, url)
        except:
            # Nếu có lỗi, mặc định cho phép truy cập
            return True

    def _get_random_proxy(self) -> Optional[str]:
        """Lấy proxy ngẫu nhiên từ danh sách"""
        if not self.proxy_list:
            return None
        return random.choice(self.proxy_list)

    async def _setup_playwright_async(self):
        """Khởi tạo Playwright để render JavaScript bất đồng bộ"""
        if not PLAYWRIGHT_AVAILABLE:
            raise ImportError("Playwright not available. Install with: pip install playwright")

        if not self.playwright:
            self.playwright = await async_playwright().start()
            browser = await self.playwright.chromium.launch(headless=self.headless)
            self.browser_context = await browser.new_context(
                viewport={"width": 1280, "height": 800},
                user_agent=self._get_user_agent()
            )

    async def _fetch_with_playwright_async(self, url: str) -> str:
        """Lấy HTML với Playwright bất đồng bộ"""
        await self._setup_playwright_async()

        page = await self.browser_context.new_page()
        try:
            timeout_ms = self.timeout * 1000
            js_timeout = self.config.get('scraper', {}).get('js_rendering_timeout', 3) * 1000
            await page.goto(url, wait_until='networkidle', timeout=timeout_ms)
            await page.wait_for_timeout(js_timeout)
            html_content = await page.content()
            return html_content
        finally:
            await page.close()

    def classify_page(self, url: str) -> Dict:
        """
        Chỉ nhận diện loại trang web mà không cào nội dung
        
        Args:
            url: URL cần phân loại
            
        Returns:
            Dict chứa thông tin phân loại
        """
        try:
            html_content = self._fetch_html(url)
            if not html_content:
                return {'error': 'Failed to fetch content'}
            
            page_type, confidence = self.classifier.classify(url, html_content)
            
            return {
                'url': url,
                'page_type': page_type,
                'confidence': confidence,
                'supported_types': self.classifier.get_supported_types(),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {'error': f'Classification error: {str(e)}'}
    
    def add_extractor(self, page_type: str, extractor: BaseExtractor) -> None:
        """
        Thêm extractor mới cho loại trang web mới
        
        Args:
            page_type: Tên loại trang web
            extractor: Instance của extractor
        """
        self.extractors[page_type] = extractor
        print(f"Added extractor for page type: {page_type}")
    
    def get_supported_types(self) -> List[str]:
        """Trả về danh sách các loại trang web được hỗ trợ"""
        return list(self.extractors.keys())
    
    def _fetch_html(self, url: str, render_js: bool = False, headers: Dict = None) -> str:
        """Lấy HTML content từ URL"""
        max_retries = self.config.get('scraper', {}).get('max_retries', self.max_retries)
        for attempt in range(max_retries):
            try:
                if render_js or self.use_selenium or self.use_playwright:
                    if self.use_playwright and PLAYWRIGHT_AVAILABLE:
                        return self._fetch_with_playwright(url)
                    elif SELENIUM_AVAILABLE:
                        return self._fetch_with_selenium(url)
                    else:
                        self.logger.warning("JavaScript rendering requested but no suitable renderer available")

                # Fallback to regular HTTP request
                return self._fetch_with_requests(url, headers)
            except Exception as e:
                if attempt == max_retries - 1:
                    raise e
                time.sleep(2 ** attempt)  # Exponential backoff
        
        return ""
    
    def _fetch_with_requests(self, url: str, headers: Dict = None) -> str:
        """Lấy HTML bằng requests"""
        default_headers = {
            'User-Agent': self._get_user_agent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        if headers:
            default_headers.update(headers)

        proxy = self._get_random_proxy()
        proxies = {'http': proxy, 'https': proxy} if proxy else None

        response = requests.get(url, headers=default_headers, timeout=self.config['timeout'], proxies=proxies)
        response.raise_for_status()
        
        # Xử lý encoding
        if response.encoding:
            response.encoding = response.apparent_encoding
        
        return response.text
    
    def _fetch_with_selenium(self, url: str) -> str:
        """Lấy HTML bằng Selenium"""
        if not self.driver:
            self._setup_selenium()
        
        self.driver.get(url)
        
        # Đợi page load
        WebDriverWait(self.driver, self.timeout).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        # Đợi thêm cho dynamic content
        js_timeout = self.config.get('scraper', {}).get('js_rendering_timeout', 3)
        time.sleep(js_timeout)

        return self.driver.page_source
    
    def _setup_selenium(self):
        """Thiết lập Selenium WebDriver"""
        if not SELENIUM_AVAILABLE:
            raise ImportError("Selenium not available. Install with: pip install selenium webdriver-manager")
        
        options = Options()
        if self.headless:
            options.add_argument('--headless')
        
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument(f'user-agent={self._get_user_agent()}')

        # Thiết lập proxy nếu có
        proxy = self._get_random_proxy()
        if proxy:
            options.add_argument(f'--proxy-server={proxy}')

        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=options)
        self.driver.set_page_load_timeout(self.timeout)

    def _fetch_with_playwright(self, url: str) -> str:
        """Lấy HTML bằng Playwright"""
        if not PLAYWRIGHT_AVAILABLE:
            raise ImportError("Playwright not available. Install with: pip install playwright")

        import asyncio
        return asyncio.run(self._fetch_with_playwright_async(url))

    def _extract_content(self, html_content: str, page_type: str, url: str) -> Dict:
        """
        Trích xuất nội dung bằng extractor phù hợp

        Args:
            html_content: HTML content
            page_type: Loại trang web
            url: URL

        Returns:
            Dict chứa kết quả trích xuất
        """
        try:
            # Lấy extractor phù hợp hoặc dùng base extractor
            extractor = self.extractors.get(page_type, GeneralExtractor())

            # Tạo soup object cho extractor
            soup = BeautifulSoup(html_content, 'html.parser')

            # Extract content
            return extractor.extract(soup, url)
        except Exception as e:
            self.logger.error(f"Extraction error: {str(e)}")
            return {
                'extraction_success': False,
                'extraction_confidence': 0,
                'error': str(e)
            }

    def _create_final_result(self, url: str, page_type: str, 
                             classification_confidence: float,
                             html_analysis: Dict, extraction_result: Dict) -> Dict:
        """
        Tạo kết quả cuối cùng

        Args:
            url: URL
            page_type: Loại trang web
            classification_confidence: Độ tin cậy của phân loại
            html_analysis: Kết quả phân tích HTML
            extraction_result: Kết quả trích xuất

        Returns:
            Dict kết quả cuối cùng
        """
        # Parse domain từ URL
        parsed_url = urlparse(url)
        domain = parsed_url.netloc

        # Tạo timestamp
        timestamp = datetime.now().isoformat()

        # Tổng hợp kết quả
        result = {
            'url': url,
            'domain': domain,
            'page_type': page_type,
            'classification': {
                'type': page_type,
                'confidence': classification_confidence
            },
            'extraction': {
                'success': extraction_result.get('extraction_success', False),
                'confidence': extraction_result.get('extraction_confidence', 0)
            },
            'content': extraction_result.get('content', {}),
            'metadata': {
                'timestamp': timestamp,
                'html_analysis': html_analysis,
                'scraper_version': '2.0.0'  # Phiên bản mới với thuật toán nâng cấp
            }
        }

        # Thêm lỗi nếu có
        if 'error' in extraction_result:
            result['extraction']['error'] = extraction_result['error']

        return result

    def _create_error_result(self, url: str, error_msg: str) -> Dict:
        """Tạo error result"""
        parsed_url = urlparse(url)
        domain = parsed_url.netloc

        return {
            'url': url,
            'domain': domain,
            'success': False,
            'error': error_msg,
            'timestamp': datetime.now().isoformat()
        }
    
    def _fetch_html_with_retry(self, url: str, render_js: bool = False, headers: Dict = None) -> str:
        """
        AI-Enhanced HTML fetching with intelligent retry logic
        """
        if self.retry_manager:
            # Use intelligent retry manager
            def fetch_operation():
                return self._fetch_html(url, render_js=render_js, headers=headers)
            
            try:
                result = self.retry_manager.execute_with_retry(fetch_operation, url)
                return result
            except Exception as e:
                self.logger.error(f"Retry manager failed for {url}: {e}")
                return ""
        else:
            # Fallback to original method
            return self._fetch_html(url, render_js=render_js, headers=headers)
    
    def _ai_enhanced_extraction(self, html_content: str, page_type: str, url: str) -> Dict:
        """
        AI-Enhanced content extraction with quality scoring
        """
        # Start with traditional extraction
        traditional_result = self._extract_content(html_content, page_type, url)
        
        # AI Enhancement
        if self.enable_ai and self.ai_extractor:
            try:
                self.stats['ai_enhanced_extractions'] += 1
                self.logger.info("Applying AI enhancement to content extraction")
                
                # Get AI-enhanced extraction
                ai_result = self.ai_extractor.extract_content(html_content, url)
                
                # Merge results, prioritizing AI where confidence is higher
                enhanced_result = self._merge_extraction_results(traditional_result, ai_result)
                
                # Add AI metadata
                enhanced_result['ai_enhancement'] = {
                    'applied': True,
                    'quality_score': ai_result.get('quality_score', 0),
                    'language': ai_result.get('language', 'unknown'),
                    'keywords': ai_result.get('keywords', []),
                    'summary': ai_result.get('summary', ''),
                    'extraction_methods': ai_result.get('extraction_methods', [])
                }
                
                return enhanced_result
                
            except Exception as e:
                self.logger.error(f"AI enhancement failed: {e}")
                # Fallback to traditional result
                traditional_result['ai_enhancement'] = {
                    'applied': False,
                    'error': str(e)
                }
                return traditional_result
        else:
            # No AI enhancement available
            traditional_result['ai_enhancement'] = {
                'applied': False,
                'reason': 'AI modules not available'
            }
            return traditional_result
    
    def _merge_extraction_results(self, traditional: Dict, ai_result: Dict) -> Dict:
        """
        Intelligently merge traditional and AI extraction results
        """
        merged = traditional.copy()
        
        # Use AI result if confidence is significantly higher
        ai_confidence = ai_result.get('extraction_confidence', 0)
        traditional_confidence = traditional.get('extraction_confidence', 0)
        
        if ai_confidence > traditional_confidence + 0.2:  # 20% threshold
            self.logger.info(f"Using AI extraction (confidence: {ai_confidence:.2f} vs {traditional_confidence:.2f})")
            merged['content'] = ai_result.get('content', merged.get('content', {}))
            merged['extraction_confidence'] = ai_confidence
            merged['extraction_method'] = 'ai_enhanced'
        else:
            # Enhance traditional result with AI metadata
            if 'content' in merged and 'content' in ai_result:
                content = merged['content']
                ai_content = ai_result['content']
                
                # Add AI-extracted elements if missing
                for key, value in ai_content.items():
                    if key not in content and value:
                        content[key] = value
                        
            merged['extraction_method'] = 'traditional_with_ai_enhancement'
        
        return merged
    
    def _create_ai_enhanced_result(self, url: str, page_type: str, 
                                   classification_confidence: float,
                                   html_analysis: Dict, extraction_result: Dict) -> Dict:
        """
        Create final result with AI enhancements and comprehensive metadata
        """
        result = self._create_final_result(url, page_type, classification_confidence, 
                                          html_analysis, extraction_result)
        
        # Add AI-specific metadata
        ai_metadata = {
            'ai_modules_enabled': {
                'content_extraction': self.enable_ai,
                'anti_detection': self.enable_anti_detection,
                'async_processing': self.enable_async
            },
            'extraction_enhancement': extraction_result.get('ai_enhancement', {}),
            'performance_stats': self.get_performance_stats(),
            'scraper_version': '3.0.0-ai'  # AI-enhanced version
        }
        
        result['metadata']['ai_metadata'] = ai_metadata
        
        return result
    
    def get_performance_stats(self) -> Dict:
        """Get current performance statistics"""
        total = self.stats['total_requests']
        if total == 0:
            return self.stats.copy()
            
        stats = self.stats.copy()
        stats['success_rate'] = self.stats['successful_requests'] / total
        stats['failure_rate'] = self.stats['failed_requests'] / total
        stats['ai_enhancement_rate'] = self.stats['ai_enhanced_extractions'] / total
        
        # Add AI module stats if available
        if self.anti_detection_manager:
            stats['anti_detection_stats'] = self.anti_detection_manager.get_comprehensive_stats()
        
        if self.retry_manager:
            stats['retry_stats'] = self.retry_manager.get_stats()
            
        return stats
    
    def __del__(self):
        """Cleanup các resources khi đối tượng bị hủy"""
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass

        if self.playwright:
            try:
                import asyncio
                asyncio.run(self.playwright.stop())
            except:
                pass
    
    async def scrape_multiple_ai_async(self, urls: List[str], 
                                       batch_size: int = None,
                                       enable_high_performance: bool = True) -> List[Dict]:
        """
        AI-Enhanced high-performance async batch scraping
        
        Args:
            urls: List of URLs to scrape
            batch_size: Batch size for processing
            enable_high_performance: Use async engine if available
            
        Returns:
            List of scraping results with AI enhancements
        """
        if enable_high_performance and self.enable_async and self.async_engine:
            try:
                self.logger.info(f"Using high-performance async engine for {len(urls)} URLs")
                results = await self.async_engine.scrape_urls(urls)
                
                # Enhance results with AI processing
                enhanced_results = []
                for result in results:
                    if result.get('success') and result.get('html_content'):
                        # Apply AI enhancement to successful results
                        enhanced = await self._post_process_with_ai(result)
                        enhanced_results.append(enhanced)
                    else:
                        enhanced_results.append(self._create_error_result(
                            result.get('url', 'unknown'), 
                            result.get('error', 'Unknown error')
                        ))
                
                return enhanced_results
                
            except Exception as e:
                self.logger.error(f"High-performance async engine failed: {e}")
                # Fallback to traditional async processing
        
        # Traditional async processing with AI enhancements
        return await self.scrape_multiple_async(urls, batch_size)
    
    async def _post_process_with_ai(self, result: Dict) -> Dict:
        """
        Post-process async engine results with AI enhancements
        """
        try:
            url = result['url']
            html_content = result['html_content']
            
            # Classification and analysis
            page_type, classification_confidence = self.classifier.classify(url, html_content)
            html_analysis = self.html_analyzer.analyze_page_structure(html_content, url)
            
            # AI-enhanced extraction
            extraction_result = self._ai_enhanced_extraction(html_content, page_type, url)
            
            return self._create_ai_enhanced_result(
                url, page_type, classification_confidence,
                html_analysis, extraction_result
            )
            
        except Exception as e:
            return self._create_error_result(
                result.get('url', 'unknown'), 
                f"AI post-processing failed: {str(e)}"
            )
    
    def scrape_multiple_ai(self, urls: List[str], 
                          delay: float = None,
                          concurrent: bool = True, 
                          max_concurrency: int = None,
                          enable_ai_optimization: bool = True) -> List[Dict]:
        """
        AI-Enhanced multiple URL scraping with intelligent optimization
        
        Args:
            urls: List of URLs to scrape
            delay: Delay between requests
            concurrent: Use concurrent processing
            max_concurrency: Maximum concurrent requests
            enable_ai_optimization: Enable AI-based optimization
            
        Returns:
            List of AI-enhanced scraping results
        """
        if enable_ai_optimization and self.enable_anti_detection and self.anti_detection_manager:
            # Apply intelligent rate limiting
            rate_stats = self.anti_detection_manager.get_comprehensive_stats()
            success_rate = rate_stats.get('rate_limiting', {}).get('success_rate', 0.8)
            
            if success_rate < 0.7:  # Adjust parameters if success rate is low
                max_concurrency = min(max_concurrency or 10, 3)
                delay = max(delay or 1.0, 3.0)
                self.logger.warning(f"Adjusting parameters due to low success rate: {success_rate:.2f}")
        
        if concurrent:
            return self._scrape_multiple_concurrent_ai(urls, max_concurrency=max_concurrency)
        else:
            return self._scrape_multiple_sequential_ai(urls, delay=delay)
    
    def _scrape_multiple_concurrent_ai(self, urls: List[str], max_concurrency: int = None) -> List[Dict]:
        """AI-enhanced concurrent scraping with intelligent load balancing"""
        max_workers = max_concurrency or self.config.get('async', {}).get('max_concurrent_requests', 10)
        
        # Intelligent batching based on AI optimization
        if self.enable_ai and len(urls) > 50:
            # For large batches, use smaller concurrent workers to avoid detection
            max_workers = min(max_workers, 5)
            self.logger.info(f"Large batch detected, reducing concurrency to {max_workers}")
        
        results = []
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_url = {executor.submit(self.scrape, url): url for url in urls}
            for future in future_to_url:
                url = future_to_url[future]
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    error_result = self._create_error_result(url, f"Concurrent processing error: {str(e)}")
                    results.append(error_result)

        return results
    
    def _scrape_multiple_sequential_ai(self, urls: List[str], delay: float = None) -> List[Dict]:
        """AI-enhanced sequential scraping with adaptive delays"""
        results = []
        base_delay = delay or self.config.get('scraper', {}).get('delay_between_requests', 1.0)
        
        for i, url in enumerate(urls):
            try:
                result = self.scrape(url)
                results.append(result)
                
                # AI-enhanced adaptive delay
                if i < len(urls) - 1:
                    adaptive_delay = self._calculate_adaptive_delay(base_delay, result, i)
                    time.sleep(adaptive_delay)
                    
            except Exception as e:
                error_result = self._create_error_result(url, f"Sequential processing error: {str(e)}")
                results.append(error_result)
        
        return results
    
    def _calculate_adaptive_delay(self, base_delay: float, last_result: Dict, iteration: int) -> float:
        """
        Calculate adaptive delay based on AI analysis
        """
        delay = base_delay
        
        # Increase delay if anti-detection is active and success rate is low
        if self.enable_anti_detection and self.anti_detection_manager:
            stats = self.anti_detection_manager.get_comprehensive_stats()
            success_rate = stats.get('rate_limiting', {}).get('success_rate', 1.0)
            
            if success_rate < 0.8:
                delay *= 1.5  # Increase delay by 50%
            elif success_rate < 0.6:
                delay *= 2.0  # Double delay for very low success rate
        
        # Add some randomization to avoid pattern detection
        import random
        delay *= random.uniform(0.8, 1.2)
        
        return delay
