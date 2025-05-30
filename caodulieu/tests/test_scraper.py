"""
Test Suite for Smart Web Scraper

Bộ test để kiểm tra các chức năng của Smart Web Scraper
"""

import unittest
import sys
import os
from unittest.mock import Mock, patch

# Thêm parent directory vào path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from smart_scraper import SmartScraper, WebPageClassifier, HTMLAnalyzer
from smart_scraper.extractors import NewsExtractor, BlogExtractor, EcommerceExtractor
from bs4 import BeautifulSoup


class TestWebPageClassifier(unittest.TestCase):
    """Test Web Page Classifier"""
    
    def setUp(self):
        self.classifier = WebPageClassifier()
    
    def test_news_classification(self):
        """Test phân loại trang tin tức"""
        news_html = """
        <html>
            <head>
                <title>Breaking News</title>
                <meta property="og:type" content="article">
                <meta property="article:published_time" content="2025-05-27">
            </head>
            <body>
                <article>
                    <h1>News Title</h1>
                    <div class="article-content">News content...</div>
                    <span class="author">Reporter Name</span>
                </article>
            </body>
        </html>
        """
        
        page_type, confidence = self.classifier.classify("https://news-site.com/article", news_html)
        self.assertEqual(page_type, "news")
        self.assertGreater(confidence, 0.5)
    
    def test_ecommerce_classification(self):
        """Test phân loại trang thương mại điện tử"""
        ecommerce_html = """
        <html>
            <head><title>Amazing Product - Buy Now</title></head>
            <body>
                <div class="product">
                    <h1 class="product-title">Product Name</h1>
                    <span class="price">$99.99</span>
                    <button class="add-to-cart">Add to Cart</button>
                    <div class="product-description">Product details...</div>
                </div>
            </body>
        </html>
        """
        
        page_type, confidence = self.classifier.classify("https://shop.com/product/123", ecommerce_html)
        self.assertEqual(page_type, "ecommerce")
        self.assertGreater(confidence, 0.5)
    
    def test_blog_classification(self):
        """Test phân loại blog"""
        blog_html = """
        <html>
            <head><title>My Personal Blog Post</title></head>
            <body>
                <article class="post">
                    <h1 class="post-title">Blog Post Title</h1>
                    <div class="post-content">Blog content with personal thoughts...</div>
                    <div class="post-author">Blogger Name</div>
                    <div class="comments">Comments section</div>
                </article>
            </body>
        </html>
        """
        
        page_type, confidence = self.classifier.classify("https://myblog.com/post", blog_html)
        self.assertEqual(page_type, "blog")
        self.assertGreater(confidence, 0.3)


class TestHTMLAnalyzer(unittest.TestCase):
    """Test HTML Analyzer"""
    
    def setUp(self):
        self.analyzer = HTMLAnalyzer()
    
    def test_analyze_page_structure(self):
        """Test phân tích cấu trúc trang"""
        html = """
        <html>
            <head><title>Test Page</title></head>
            <body>
                <header>Header</header>
                <nav>Navigation</nav>
                <main>
                    <article>
                        <h1>Main Title</h1>
                        <p>Content paragraph 1</p>
                        <img src="image.jpg" alt="Test image">
                        <p>Content paragraph 2</p>
                    </article>
                </main>
                <footer>Footer</footer>
            </body>
        </html>
        """
        
        result = self.analyzer.analyze_page_structure(html, "https://test.com")
        
        self.assertIn('title', result)
        self.assertIn('main_content', result)
        self.assertIn('images', result)
        self.assertIn('structure_info', result)
        
        self.assertEqual(result['title'], "Main Title")
        self.assertTrue(result['structure_info']['has_header'])
        self.assertTrue(result['structure_info']['has_nav'])
        self.assertTrue(result['structure_info']['has_main'])
        self.assertTrue(result['structure_info']['has_footer'])


class TestNewsExtractor(unittest.TestCase):
    """Test News Extractor"""
    
    def setUp(self):
        self.extractor = NewsExtractor()
    
    def test_news_extraction(self):
        """Test trích xuất nội dung tin tức"""
        html = """
        <html>
            <body>
                <article>
                    <h1 class="title">Breaking News Title</h1>
                    <div class="article-meta">
                        <span class="author">John Reporter</span>
                        <time datetime="2025-05-27">May 27, 2025</time>
                    </div>
                    <div class="article-content">
                        <p>This is the news content...</p>
                        <img src="news.jpg" alt="News image">
                    </div>
                </article>
            </body>
        </html>
        """
        
        soup = BeautifulSoup(html, 'html.parser')
        result = self.extractor.extract(soup, "https://news.com")
        
        self.assertIn('title', result)
        self.assertIn('content', result)
        self.assertIn('author', result)
        self.assertIn('publish_date', result)
        self.assertIn('images', result)
        
        self.assertEqual(result['title'], "Breaking News Title")
        self.assertEqual(result['author'], "John Reporter")
    
    def test_confidence_score(self):
        """Test tính confidence score"""
        html = """
        <article>
            <h1>News Title</h1>
            <div class="article-content">Long news content here...</div>
            <span class="author">Reporter</span>
            <time datetime="2025-05-27">Today</time>
        </article>
        """
        
        soup = BeautifulSoup(html, 'html.parser')
        confidence = self.extractor.get_confidence_score(soup)
        
        self.assertGreater(confidence, 0.8)  # Should be high confidence


class TestEcommerceExtractor(unittest.TestCase):
    """Test E-commerce Extractor"""
    
    def setUp(self):
        self.extractor = EcommerceExtractor()
    
    def test_product_extraction(self):
        """Test trích xuất thông tin sản phẩm"""
        html = """
        <div class="product">
            <h1 class="product-title">Amazing Product</h1>
            <span class="price">$99.99</span>
            <span class="original-price">$149.99</span>
            <div class="product-description">Product description here...</div>
            <img src="product.jpg" alt="Product image" class="product-image">
            <div class="brand">BrandName</div>
            <div class="availability in-stock">In Stock</div>
        </div>
        """
        
        soup = BeautifulSoup(html, 'html.parser')
        result = self.extractor.extract(soup, "https://shop.com")
        
        self.assertIn('name', result)
        self.assertIn('current_price', result)
        self.assertIn('original_price', result)
        self.assertIn('description', result)
        self.assertIn('brand', result)
        self.assertIn('availability', result)
        
        self.assertEqual(result['name'], "Amazing Product")
        self.assertEqual(result['current_price'], "99.99")
        self.assertEqual(result['original_price'], "149.99")


class TestSmartScraper(unittest.TestCase):
    """Test Smart Scraper chính"""
    
    def setUp(self):
        self.scraper = SmartScraper()
    
    def tearDown(self):
        self.scraper.close()
    
    @patch('requests.get')
    def test_scrape_success(self, mock_get):
        """Test cào dữ liệu thành công"""
        # Mock response
        mock_response = Mock()
        mock_response.text = """
        <html>
            <head><title>Test News</title></head>
            <body>
                <article>
                    <h1>News Title</h1>
                    <div class="article-content">News content...</div>
                </article>
            </body>
        </html>
        """
        mock_response.raise_for_status.return_value = None
        mock_response.apparent_encoding = 'utf-8'
        mock_get.return_value = mock_response
        
        result = self.scraper.scrape("https://test-news.com")
        
        self.assertTrue(result['success'])
        self.assertIn('content', result)
        self.assertIn('page_type', result)
        self.assertIn('timestamp', result)
    
    def test_supported_types(self):
        """Test lấy danh sách types được hỗ trợ"""
        types = self.scraper.get_supported_types()
        self.assertIn('news', types)
        self.assertIn('blog', types) 
        self.assertIn('ecommerce', types)
    
    def test_add_custom_extractor(self):
        """Test thêm custom extractor"""
        from smart_scraper.extractors.base import BaseExtractor
        
        class TestExtractor(BaseExtractor):
            def __init__(self):
                super().__init__()
                self.extractor_type = "test"
            
            def extract(self, soup, url=""):
                return {"test": "data"}
            
            def get_confidence_score(self, soup):
                return 1.0
        
        self.scraper.add_extractor("test", TestExtractor())
        self.assertIn("test", self.scraper.get_supported_types())


class TestIntegration(unittest.TestCase):
    """Test tích hợp các components"""
    
    def test_end_to_end_workflow(self):
        """Test workflow từ đầu đến cuối"""
        html = """
        <html>
            <head>
                <title>Test Blog Post</title>
                <meta name="author" content="Blogger">
            </head>
            <body>
                <article class="post">
                    <h1 class="post-title">My Blog Post</h1>
                    <div class="post-content">
                        <p>This is my personal blog post content...</p>
                        <img src="blog-image.jpg" alt="Blog image">
                    </div>
                    <div class="post-author">By Blogger</div>
                </article>
            </body>
        </html>
        """
        
        # Test classifier
        classifier = WebPageClassifier()
        page_type, confidence = classifier.classify("https://myblog.com/post", html)
        self.assertEqual(page_type, "blog")
        
        # Test extractor
        extractor = BlogExtractor()
        soup = BeautifulSoup(html, 'html.parser')
        content = extractor.extract(soup, "https://myblog.com")
        self.assertIn('title', content)
        self.assertEqual(content['title'], "My Blog Post")


def run_tests():
    """Chạy tất cả tests"""
    # Tạo test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Thêm test classes
    test_classes = [
        TestWebPageClassifier,
        TestHTMLAnalyzer,
        TestNewsExtractor,
        TestEcommerceExtractor,
        TestSmartScraper,
        TestIntegration
    ]
    
    for test_class in test_classes:
        tests = loader.loadTestsFromTestCase(test_class)
        suite.addTests(tests)
    
    # Chạy tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()


if __name__ == "__main__":
    print("Running Smart Web Scraper Tests...")
    print("=" * 50)
    
    success = run_tests()
    
    if success:
        print("\n✅ All tests passed!")
    else:
        print("\n❌ Some tests failed!")
        sys.exit(1)
