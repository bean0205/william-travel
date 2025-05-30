"""
Extractors Package

Chứa tất cả các content extractors cho các loại trang web khác nhau
"""

from .base import BaseExtractor, ExtractionResult
from .news import NewsExtractor
from .blog import BlogExtractor
from .ecommerce import EcommerceExtractor
from .general import GeneralExtractor

__all__ = [
    'BaseExtractor',
    'ExtractionResult',
    'NewsExtractor',
    'BlogExtractor', 
    'EcommerceExtractor',
    'GeneralExtractor'
]
