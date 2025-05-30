"""
E-commerce Extractor Module

Extractor chuyên biệt cho trang thương mại điện tử
Trích xuất: tên sản phẩm, giá, mô tả, hình ảnh, đánh giá, thông tin seller
"""

import re
from typing import Dict, List, Optional
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from .base import BaseExtractor, ExtractionResult


class EcommerceExtractor(BaseExtractor):
    """
    Extractor cho trang thương mại điện tử
    
    Tìm kiếm các elements đặc trưng của sản phẩm:
    - Product name (.product-title, h1, .name)
    - Price (.price, .cost, .amount)
    - Description (.description, .details)
    - Images (.product-image, .gallery)
    - Reviews (.reviews, .rating)
    - Availability (.stock, .availability)
    """
    
    def __init__(self):
        super().__init__()
        self.extractor_type = "ecommerce"
        
        # Selectors cho product information
        self.name_selectors = [
            '.product-title', '.product-name', '.item-title', '.item-name',
            'h1.title', 'h1.name', '.product h1', '.item h1', 'h1'
        ]
        
        self.price_selectors = [
            '.price', '.cost', '.amount', '.product-price', '.item-price',
            '.current-price', '.sale-price', '.final-price', '.price-current',
            '[class*="price"]', '[id*="price"]'
        ]
        
        self.original_price_selectors = [
            '.original-price', '.old-price', '.was-price', '.price-original',
            '.regular-price', '.list-price', '.msrp'
        ]
        
        self.description_selectors = [
            '.product-description', '.item-description', '.product-details',
            '.description', '.details', '.product-info', '.product-content',
            '.product-summary', '.overview'
        ]
        
        self.image_selectors = [
            '.product-image img', '.item-image img', '.product-gallery img',
            '.gallery img', '.product-photos img', '.main-image img',
            '.product img', '.item img'
        ]
        
        self.rating_selectors = [
            '.rating', '.stars', '.score', '.product-rating',
            '.review-rating', '[class*="rating"]', '[class*="star"]'
        ]
        
        self.review_selectors = [
            '.reviews', '.review', '.feedback', '.comments',
            '.product-reviews', '.customer-reviews'
        ]
        
        self.availability_selectors = [
            '.stock', '.availability', '.in-stock', '.out-of-stock',
            '.product-availability', '.inventory'
        ]
        
        self.brand_selectors = [
            '.brand', '.manufacturer', '.product-brand', '.item-brand'
        ]
        
        self.category_selectors = [
            '.breadcrumb', '.breadcrumbs', '.category', '.product-category',
            '.navigation', 'nav'
        ]
    
    def extract(self, soup: BeautifulSoup, url: str = "") -> Dict:
        """Trích xuất thông tin sản phẩm"""
        result = self._extract_base_info(soup)
        
        # Product name
        name_element = self._get_element_by_selectors(soup, self.name_selectors)
        if name_element:
            result['name'] = self._clean_text(name_element.get_text())
        
        # Price information
        result.update(self._extract_price_info(soup))
        
        # Description
        description_element = self._get_element_by_selectors(soup, self.description_selectors)
        if description_element:
            # Làm sạch description
            for tag in description_element.find_all(['script', 'style']):
                tag.decompose()
            result['description'] = self._clean_text(description_element.get_text())
            result['description_html'] = str(description_element)
        
        # Images
        result['images'] = self._extract_product_images(soup, url)
        
        # Main/Featured image
        main_img = self._get_element_by_selectors(soup, self.image_selectors)
        if main_img:
            src = main_img.get('src')
            if src and url:
                src = urljoin(url, src)
            result['main_image'] = {
                'src': src,
                'alt': main_img.get('alt', ''),
                'title': main_img.get('title', '')
            }
        
        # Brand
        brand_element = self._get_element_by_selectors(soup, self.brand_selectors)
        if brand_element:
            result['brand'] = self._clean_text(brand_element.get_text())
        
        # Category
        result['category'] = self._extract_category(soup)
        
        # Availability
        result['availability'] = self._extract_availability(soup)
        
        # Rating and reviews
        result['rating'] = self._extract_rating(soup)
        result['reviews'] = self._extract_reviews(soup)
        
        # Product specifications
        result['specifications'] = self._extract_specifications(soup)
        
        # Seller information
        result['seller'] = self._extract_seller_info(soup)
        
        # Related products
        result['related_products'] = self._extract_related_products(soup, url)
        
        # Schema.org structured data
        result['structured_data'] = self._extract_structured_data(soup)
        
        return result
    
    def get_confidence_score(self, soup: BeautifulSoup) -> float:
        """Tính confidence score cho ecommerce extraction"""
        score = 0.0
        
        # Kiểm tra có product name không (25%)
        name_element = self._get_element_by_selectors(soup, self.name_selectors)
        if name_element:
            score += 0.25
        
        # Kiểm tra có price không (35%)
        price_found = False
        for selector in self.price_selectors:
            if soup.select_one(selector):
                price_found = True
                break
        if price_found:
            score += 0.35
        
        # Kiểm tra có description không (20%)
        description_element = self._get_element_by_selectors(soup, self.description_selectors)
        if description_element:
            desc_text = description_element.get_text(strip=True)
            if len(desc_text) > 50:
                score += 0.20
        
        # Kiểm tra có product images không (20%)
        product_images = soup.select('.product-image img, .item-image img, .gallery img')
        if product_images:
            score += 0.20
        
        # Bonus cho ecommerce-specific elements
        ecommerce_indicators = [
            '.add-to-cart', '.buy-now', '.purchase', '.checkout',
            '.shopping-cart', '.add-to-basket', '.quantity'
        ]
        for indicator in ecommerce_indicators:
            if soup.select_one(indicator):
                score += 0.05
                break
        
        # Bonus cho structured data
        if (soup.find(attrs={'itemtype': re.compile(r'Product', re.I)}) or
            soup.find('script', attrs={'type': 'application/ld+json'})):
            score += 0.1
        
        # Bonus cho rating/reviews
        if (self._get_element_by_selectors(soup, self.rating_selectors) or
            self._get_element_by_selectors(soup, self.review_selectors)):
            score += 0.05
        
        return min(score, 1.0)
    
    def _extract_price_info(self, soup: BeautifulSoup) -> Dict:
        """Trích xuất thông tin giá cả"""
        price_info = {}
        
        # Current price
        price_element = self._get_element_by_selectors(soup, self.price_selectors)
        if price_element:
            price_text = price_element.get_text(strip=True)
            price_info['current_price'] = self._clean_price(price_text)
            price_info['currency'] = self._extract_currency(price_text)
        
        # Original price (if on sale)
        original_price_element = self._get_element_by_selectors(soup, self.original_price_selectors)
        if original_price_element:
            original_price_text = original_price_element.get_text(strip=True)
            price_info['original_price'] = self._clean_price(original_price_text)
            
            # Calculate discount
            if 'current_price' in price_info and price_info['original_price']:
                try:
                    current = float(re.sub(r'[^\d.]', '', price_info['current_price']))
                    original = float(re.sub(r'[^\d.]', '', price_info['original_price']))
                    if original > current:
                        discount = ((original - current) / original) * 100
                        price_info['discount_percentage'] = round(discount, 1)
                except:
                    pass
        
        return price_info
    
    def _clean_price(self, price_text: str) -> str:
        """Làm sạch text giá"""
        if not price_text:
            return ""
        
        # Loại bỏ whitespace thừa
        price_text = re.sub(r'\s+', ' ', price_text).strip()
        
        # Tìm pattern giá (số + ký hiệu tiền tệ)
        price_pattern = r'[\d,]+\.?\d*'
        match = re.search(price_pattern, price_text)
        if match:
            return match.group()
        
        return price_text
    
    def _extract_currency(self, price_text: str) -> str:
        """Trích xuất ký hiệu tiền tệ"""
        currency_symbols = {
            '$': 'USD', '€': 'EUR', '£': 'GBP', '¥': 'JPY', '₹': 'INR',
            '₫': 'VND', '₩': 'KRW', '₽': 'RUB', '¢': 'USD'
        }
        
        for symbol, code in currency_symbols.items():
            if symbol in price_text:
                return code
        
        # Tìm mã tiền tệ (VND, USD, etc.)
        currency_match = re.search(r'\b[A-Z]{3}\b', price_text)
        if currency_match:
            return currency_match.group()
        
        return ""
    
    def _extract_product_images(self, soup: BeautifulSoup, base_url: str) -> List[Dict]:
        """Trích xuất tất cả hình ảnh sản phẩm"""
        images = []
        
        # Tìm tất cả product images
        img_elements = soup.select('.product-image img, .item-image img, .gallery img, .product-photos img')
        
        for img in img_elements:
            src = img.get('src')
            if src:
                if base_url:
                    src = urljoin(base_url, src)
                
                # Tìm các size khác nếu có
                srcset = img.get('srcset', '')
                data_src = img.get('data-src', '')
                
                images.append({
                    'src': src,
                    'alt': img.get('alt', ''),
                    'title': img.get('title', ''),
                    'srcset': srcset,
                    'data_src': data_src,
                    'width': img.get('width'),
                    'height': img.get('height')
                })
        
        return images
    
    def _extract_category(self, soup: BeautifulSoup) -> str:
        """Trích xuất category sản phẩm"""
        # Thử breadcrumb trước
        breadcrumb = soup.select('.breadcrumb a, .breadcrumbs a')
        if breadcrumb and len(breadcrumb) > 1:
            # Lấy item cuối cùng trước product name
            return breadcrumb[-2].get_text(strip=True)
        
        # Thử category element
        category_element = self._get_element_by_selectors(soup, self.category_selectors)
        if category_element:
            return self._clean_text(category_element.get_text())
        
        return ""
    
    def _extract_availability(self, soup: BeautifulSoup) -> Dict:
        """Trích xuất thông tin availability"""
        availability = {
            'in_stock': None,
            'stock_quantity': None,
            'availability_text': ""
        }
        
        availability_element = self._get_element_by_selectors(soup, self.availability_selectors)
        if availability_element:
            availability_text = availability_element.get_text(strip=True).lower()
            availability['availability_text'] = availability_text
            
            # Phân tích in_stock
            if any(phrase in availability_text for phrase in ['in stock', 'available', 'còn hàng']):
                availability['in_stock'] = True
            elif any(phrase in availability_text for phrase in ['out of stock', 'sold out', 'hết hàng']):
                availability['in_stock'] = False
            
            # Tìm số lượng
            quantity_match = re.search(r'(\d+)', availability_text)
            if quantity_match:
                availability['stock_quantity'] = int(quantity_match.group(1))
        
        return availability
    
    def _extract_rating(self, soup: BeautifulSoup) -> Dict:
        """Trích xuất thông tin đánh giá"""
        rating = {
            'average_rating': None,
            'rating_count': None,
            'max_rating': 5
        }
        
        rating_element = self._get_element_by_selectors(soup, self.rating_selectors)
        if rating_element:
            rating_text = rating_element.get_text(strip=True)
            
            # Tìm số điểm
            rating_match = re.search(r'(\d+\.?\d*)', rating_text)
            if rating_match:
                rating['average_rating'] = float(rating_match.group(1))
            
            # Đếm số sao (nếu có)
            stars = rating_element.select('.star, .fa-star, [class*="star"]')
            if stars:
                filled_stars = len([s for s in stars if 'active' in s.get('class', []) or 'filled' in s.get('class', [])])
                if filled_stars > 0:
                    rating['average_rating'] = filled_stars
        
        # Tìm số lượng đánh giá
        review_count_patterns = [
            r'(\d+)\s*(?:reviews?|đánh giá|nhận xét)',
            r'\((\d+)\)',
            r'(\d+)\s*(?:ratings?|điểm)'
        ]
        
        for pattern in review_count_patterns:
            match = re.search(pattern, soup.get_text(), re.I)
            if match:
                rating['rating_count'] = int(match.group(1))
                break
        
        return rating
    
    def _extract_reviews(self, soup: BeautifulSoup) -> List[Dict]:
        """Trích xuất một số reviews mẫu"""
        reviews = []
        
        review_elements = soup.select('.review, .comment, .feedback')[:5]  # Giới hạn 5 reviews
        
        for review_elem in review_elements:
            review = {}
            
            # Review text
            review_text = review_elem.get_text(strip=True)
            if len(review_text) > 20:  # Filter quá ngắn
                review['text'] = review_text[:200] + ('...' if len(review_text) > 200 else '')
            
            # Reviewer name
            author_elem = review_elem.select_one('.author, .reviewer, .name')
            if author_elem:
                review['author'] = author_elem.get_text(strip=True)
            
            # Review rating
            rating_elem = review_elem.select_one('.rating, .stars, [class*="star"]')
            if rating_elem:
                rating_text = rating_elem.get_text(strip=True)
                rating_match = re.search(r'(\d+)', rating_text)
                if rating_match:
                    review['rating'] = int(rating_match.group(1))
            
            if review:
                reviews.append(review)
        
        return reviews
    
    def _extract_specifications(self, soup: BeautifulSoup) -> Dict:
        """Trích xuất thông số kỹ thuật"""
        specs = {}
        
        # Tìm bảng specifications
        spec_table = soup.select_one('.specifications table, .specs table, .product-details table')
        if spec_table:
            rows = spec_table.find_all('tr')
            for row in rows:
                cells = row.find_all(['td', 'th'])
                if len(cells) >= 2:
                    key = cells[0].get_text(strip=True)
                    value = cells[1].get_text(strip=True)
                    if key and value:
                        specs[key] = value
        
        # Tìm definition list
        spec_dl = soup.select_one('.specifications dl, .specs dl, .product-details dl')
        if spec_dl:
            dts = spec_dl.find_all('dt')
            dds = spec_dl.find_all('dd')
            for dt, dd in zip(dts, dds):
                key = dt.get_text(strip=True)
                value = dd.get_text(strip=True)
                if key and value:
                    specs[key] = value
        
        return specs
    
    def _extract_seller_info(self, soup: BeautifulSoup) -> Dict:
        """Trích xuất thông tin người bán"""
        seller = {}
        
        # Seller name
        seller_selectors = [
            '.seller', '.vendor', '.merchant', '.store', '.shop',
            '.sold-by', '.fulfilled-by'
        ]
        seller_element = self._get_element_by_selectors(soup, seller_selectors)
        if seller_element:
            seller['name'] = self._clean_text(seller_element.get_text())
        
        # Seller rating
        seller_rating = soup.select_one('.seller-rating, .vendor-rating')
        if seller_rating:
            rating_text = seller_rating.get_text(strip=True)
            rating_match = re.search(r'(\d+\.?\d*)', rating_text)
            if rating_match:
                seller['rating'] = float(rating_match.group(1))
        
        return seller
    
    def _extract_related_products(self, soup: BeautifulSoup, base_url: str) -> List[Dict]:
        """Trích xuất sản phẩm liên quan"""
        related = []
        
        # Tìm sections có related products
        related_sections = soup.select('.related-products, .similar-items, .recommendations')
        
        for section in related_sections:
            products = section.select('.product, .item')[:5]  # Giới hạn 5 sản phẩm
            
            for product in products:
                product_info = {}
                
                # Product name
                name_elem = product.select_one('h3, h4, .name, .title')
                if name_elem:
                    product_info['name'] = name_elem.get_text(strip=True)
                
                # Product link
                link_elem = product.select_one('a[href]')
                if link_elem and base_url:
                    href = link_elem.get('href')
                    product_info['url'] = urljoin(base_url, href)
                
                # Product price
                price_elem = product.select_one('.price, .cost')
                if price_elem:
                    product_info['price'] = self._clean_price(price_elem.get_text())
                
                if product_info and 'name' in product_info:
                    related.append(product_info)
        
        return related
    
    def _extract_structured_data(self, soup: BeautifulSoup) -> Dict:
        """Trích xuất structured data (JSON-LD, microdata)"""
        structured = {}
        
        # JSON-LD
        json_ld_scripts = soup.find_all('script', attrs={'type': 'application/ld+json'})
        for script in json_ld_scripts:
            try:
                import json
                data = json.loads(script.string)
                if isinstance(data, dict) and data.get('@type') == 'Product':
                    structured['json_ld'] = data
                    break
            except:
                pass
        
        # Microdata
        product_microdata = soup.find(attrs={'itemtype': re.compile(r'Product', re.I)})
        if product_microdata:
            microdata = {}
            for elem in product_microdata.find_all(attrs={'itemprop': True}):
                prop = elem.get('itemprop')
                if elem.name == 'meta':
                    value = elem.get('content')
                else:
                    value = elem.get_text(strip=True)
                if prop and value:
                    microdata[prop] = value
            structured['microdata'] = microdata
        
        return structured


# Test function
if __name__ == "__main__":
    extractor = EcommerceExtractor()
    
    # Test với HTML mẫu của trang sản phẩm
    sample_html = """
    <html>
        <head>
            <title>Amazing Product - Best Price</title>
        </head>
        <body>
            <div class="product">
                <h1 class="product-title">Amazing Smartphone XY</h1>
                <div class="price-info">
                    <span class="current-price">$299.99</span>
                    <span class="original-price">$399.99</span>
                </div>
                <div class="product-description">
                    <p>This is an amazing smartphone with great features...</p>
                </div>
                <div class="product-gallery">
                    <img src="phone1.jpg" alt="Smartphone front view" class="product-image">
                    <img src="phone2.jpg" alt="Smartphone back view" class="product-image">
                </div>
                <div class="brand">TechBrand</div>
                <div class="availability in-stock">In Stock - 15 items available</div>
                <div class="rating">
                    <span class="score">4.5</span>
                    <span class="review-count">(123 reviews)</span>
                </div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </body>
    </html>
    """
    
    soup = BeautifulSoup(sample_html, 'html.parser')
    result = extractor.extract(soup, "https://example-shop.com")
    confidence = extractor.get_confidence_score(soup)
    
    print(f"Confidence: {confidence:.2f}")
    print("Extracted content:")
    for key, value in result.items():
        print(f"{key}: {value}")
