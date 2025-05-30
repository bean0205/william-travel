"""
Smart Web Scraper - Ứng dụng cào dữ liệu web thông minh

Tự động nhận diện loại trang web và cào nội dung phù hợp.
"""

from .main import SmartScraper
from .classifier import WebPageClassifier
from .html_analyzer import HTMLAnalyzer

__version__ = "1.0.0"
__author__ = "William Nguyen"

__all__ = [
    "SmartScraper",
    "WebPageClassifier", 
    "HTMLAnalyzer"
]
