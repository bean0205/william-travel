# Smart Web Scraper - Hướng Dẫn Sử Dụng Từ A Đến Z

## 📖 Mục Lục
1. [Giới Thiệu](#giới-thiệu)
2. [Cài Đặt](#cài-đặt)
3. [Bắt Đầu Nhanh](#bắt-đầu-nhanh)
4. [Hướng Dẫn Chi Tiết](#hướng-dẫn-chi-tiết)
5. [Tùy Chỉnh Nâng Cao](#tùy-chỉnh-nâng-cao)
6. [Sử Dụng Command Line](#sử-dụng-command-line)
7. [Xử Lý Lỗi](#xử-lý-lỗi)
8. [FAQ](#faq)

---

## 🌟 Giới Thiệu

Smart Web Scraper là một ứng dụng Python thông minh có khả năng:
- **Tự động nhận diện** loại trang web (tin tức, blog, thương mại điện tử)
- **Cào nội dung phù hợp** theo từng loại trang
- **Trả về kết quả dạng JSON** có cấu trúc
- **Mở rộng dễ dàng** với các extractor tùy chỉnh

### Ưu Điểm
✅ Không cần config phức tạp  
✅ Tự động xác định nội dung quan trọng  
✅ Hỗ trợ cả trang tĩnh và động (JavaScript)  
✅ Cache thông minh để tăng tốc  
✅ Interface dễ sử dụng  

---

## 🔧 Cài Đặt

### Bước 1: Chuẩn Bị Môi Trường
```bash
# Tạo môi trường ảo (khuyến nghị)
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# hoặc: venv\Scripts\activate  # Windows

# Cập nhật pip
pip install --upgrade pip
```

### Bước 2: Cài Đặt Dependencies
```bash
cd /path/to/caodulieu
pip install -r requirements.txt
```

### Bước 3: Kiểm Tra Cài Đặt
```bash
python -c "from smart_scraper import SmartScraper; print('✅ Cài đặt thành công!')"
```

---

## 🚀 Bắt Đầu Nhanh

### Ví Dụ Đầu Tiên - 30 Giây
```python
from smart_scraper import SmartScraper

# Khởi tạo scraper
scraper = SmartScraper()

# Cào một trang web
result = scraper.scrape("https://example.com")

# Xem kết quả
print(f"Loại trang: {result['page_type']}")
print(f"Tiêu đề: {result['content'].get('title', 'Không có')}")
print(f"Độ tin cậy: {result['extraction_confidence']:.2f}")

# Đóng scraper
scraper.close()
```

### Kết Quả Mẫu
```json
{
  "url": "https://example.com",
  "page_type": "unknown",
  "classification_confidence": 0.0,
  "extraction_confidence": 0.5,
  "extractor_used": "generic",
  "timestamp": "2025-05-27T21:30:00.123456",
  "content": {
    "title": "Example Domain",
    "meta_description": "This domain is for use in illustrative examples...",
    "main_content": "Example Domain. This domain is established...",
    "images": [],
    "links": ["https://www.iana.org/domains/example"],
    "headings": ["Example Domain"]
  },
  "success": true
}
```

---

## 📚 Hướng Dẫn Chi Tiết

### 1. Khởi Tạo SmartScraper

#### Cấu Hình Cơ Bản
```python
from smart_scraper import SmartScraper

# Cấu hình mặc định
scraper = SmartScraper()

# Cấu hình tùy chỉnh
scraper = SmartScraper(
    use_selenium=False,     # True nếu cần xử lý JavaScript
    headless=True,          # False để hiện trình duyệt (khi dùng Selenium)
    timeout=30,             # Timeout cho mỗi request (giây)
    max_retries=3           # Số lần thử lại khi lỗi
)
```

### 2. Cào Dữ Liệu Cơ Bản

#### Cào Một URL
```python
# Cào tự động (nhận diện loại trang)
result = scraper.scrape("https://news-website.com")

# Cào với loại trang cụ thể
result = scraper.scrape("https://blog.com", force_type="blog")

# Cào không dùng cache
result = scraper.scrape("https://example.com", use_cache=False)
```

#### Chỉ Nhận Diện Loại Trang
```python
classification = scraper.classify_page("https://example.com")
print(f"Loại trang: {classification['page_type']}")
print(f"Độ tin cậy: {classification['confidence']}")
```

### 3. Cào Nhiều URL

```python
urls = [
    "https://news-site.com/article1",
    "https://blog.com/post1",
    "https://shop.com/product1"
]

# Cào tuần tự với delay
results = scraper.scrape_multiple(urls, delay=1.0)

for result in results:
    if result['success']:
        print(f"✅ {result['url']}: {result['page_type']}")
    else:
        print(f"❌ {result['url']}: {result.get('error', 'Unknown error')}")
```

### 4. Hiểu Kết Quả Trả Về

#### Cấu Trúc JSON Chuẩn
```python
result = {
    "url": "URL gốc",
    "page_type": "news|blog|ecommerce|unknown",
    "classification_confidence": 0.95,      # Độ tin cậy nhận diện (0-1)
    "extraction_confidence": 0.87,         # Độ tin cậy trích xuất (0-1)
    "extractor_used": "news",               # Extractor đã sử dụng
    "timestamp": "2025-05-27T21:30:00Z",
    "content": {
        # Nội dung tùy theo loại trang
    },
    "html_analysis": {
        "structure_info": {},
        "content_score": 0.8,
        "metadata": {}
    },
    "success": true,
    "from_cache": false
}
```

#### Nội Dung Theo Loại Trang

**Trang Tin Tức (News):**
```json
"content": {
    "title": "Tiêu đề bài báo",
    "author": "Tên tác giả",
    "publish_date": "2025-05-27",
    "main_content": "Nội dung chính của bài báo...",
    "summary": "Tóm tắt ngắn",
    "images": ["url1.jpg", "url2.jpg"],
    "tags": ["tag1", "tag2"],
    "category": "Thể thao"
}
```

**Trang Blog:**
```json
"content": {
    "title": "Tiêu đề bài viết",
    "author": "Tác giả blog",
    "publish_date": "2025-05-27",
    "main_content": "Nội dung bài viết...",
    "excerpt": "Đoạn mở đầu",
    "images": ["featured.jpg"],
    "tags": ["travel", "tips"],
    "comments_count": 15
}
```

**Trang Thương Mại Điện Tử:**
```json
"content": {
    "product_name": "Tên sản phẩm",
    "price": "1,000,000 VND",
    "description": "Mô tả sản phẩm...",
    "images": ["product1.jpg", "product2.jpg"],
    "availability": "Còn hàng",
    "rating": "4.5/5",
    "reviews_count": 120,
    "specifications": {
        "brand": "Brand Name",
        "model": "Model ABC"
    }
}
```

---

## 🔧 Tùy Chỉnh Nâng Cao

### 1. Tạo Extractor Tùy Chỉnh

#### Bước 1: Tạo Class Extractor
```python
from smart_scraper.extractors import BaseExtractor

class ForumExtractor(BaseExtractor):
    def __init__(self):
        super().__init__()
        self.extractor_type = "forum"
    
    def extract(self, soup, url=""):
        """Trích xuất nội dung từ trang forum"""
        title = self._extract_title(soup)
        posts = self._extract_posts(soup)
        users = self._extract_users(soup)
        
        return {
            "title": title,
            "posts": posts,
            "users_online": users,
            "topics_count": len(posts)
        }
    
    def get_confidence_score(self, soup):
        """Tính độ tin cậy của extractor này với trang hiện tại"""
        score = 0
        
        # Kiểm tra các yếu tố đặc trưng của forum
        if soup.find(class_="forum-post"):
            score += 0.3
        if soup.find(class_="user-info"):
            score += 0.2
        if "forum" in soup.get_text().lower():
            score += 0.3
        if soup.find_all("div", class_="topic"):
            score += 0.2
            
        return min(score, 1.0)
    
    def _extract_title(self, soup):
        """Trích xuất tiêu đề trang"""
        title_tag = soup.find('title')
        return title_tag.get_text().strip() if title_tag else ""
    
    def _extract_posts(self, soup):
        """Trích xuất danh sách bài viết"""
        posts = []
        post_elements = soup.find_all(class_="forum-post")
        
        for post in post_elements:
            posts.append({
                "content": post.get_text().strip(),
                "author": self._extract_post_author(post)
            })
        
        return posts
    
    def _extract_users(self, soup):
        """Trích xuất thông tin users"""
        users_element = soup.find(class_="users-online")
        if users_element:
            return users_element.get_text().strip()
        return "0"
    
    def _extract_post_author(self, post_element):
        """Trích xuất tác giả của một bài post"""
        author_element = post_element.find(class_="author")
        return author_element.get_text().strip() if author_element else "Unknown"
```

#### Bước 2: Sử Dụng Extractor Tùy Chỉnh
```python
# Khởi tạo scraper
scraper = SmartScraper()

# Thêm extractor tùy chỉnh
forum_extractor = ForumExtractor()
scraper.add_extractor("forum", forum_extractor)

# Sử dụng extractor mới
result = scraper.scrape("https://forum-website.com", force_type="forum")

print(f"Loại trang: {result['page_type']}")  # "forum"
print(f"Số bài viết: {result['content']['topics_count']}")
```

### 2. Cấu Hình Selenium cho Trang Động

```python
# Khởi tạo với Selenium
scraper = SmartScraper(
    use_selenium=True,
    headless=True,          # False để debug
    timeout=60              # Timeout lớn hơn cho JS
)

# Cào trang có JavaScript
result = scraper.scrape("https://spa-website.com")

# Selenium sẽ đợi JS load xong rồi mới cào
print(f"Nội dung: {result['content']}")

scraper.close()  # Quan trọng: phải close để giải phóng browser
```

### 3. Quản Lý Cache

```python
# Xem thống kê cache
stats = scraper.cache.get_stats() if scraper.cache else {}
print(f"Số entries: {stats.get('total_entries', 0)}")
print(f"Dung lượng: {stats.get('total_size_mb', 0):.2f} MB")

# Xóa cache cũ (hết hạn)
expired_count = scraper.cleanup_cache()
print(f"Đã xóa {expired_count} entries hết hạn")

# Xóa toàn bộ cache
total_cleared = scraper.clear_cache()
print(f"Đã xóa {total_cleared} entries")
```

### 4. Cấu Hình Logging

```python
import logging
from smart_scraper.logging_config import setup_logging

# Cấu hình logging chi tiết
setup_logging(
    level=logging.DEBUG,        # DEBUG, INFO, WARNING, ERROR
    log_to_file=True,          # Ghi vào file
    log_filename="my_scraper.log"
)

# Scraper sẽ tự động log các hoạt động
scraper = SmartScraper()
result = scraper.scrape("https://example.com")

# Kiểm tra log file để debug
```

---

## 💻 Sử Dụng Command Line

Smart Web Scraper cung cấp CLI mạnh mẽ cho việc sử dụng nhanh.

### 1. Cào URL Đơn Giản
```bash
python cli.py https://example.com
```

### 2. Lưu Kết Quả Ra File
```bash
# JSON format (mặc định)
python cli.py https://news-site.com --output results.json

# CSV format
python cli.py https://blog.com --format csv --output blog_data.csv

# XML format
python cli.py https://shop.com --format xml --output products.xml
```

### 3. Chỉ Nhận Diện Loại Trang
```bash
python cli.py https://example.com --classify-only
```

### 4. Sử Dụng Selenium
```bash
python cli.py https://spa-website.com --selenium --timeout 60
```

### 5. Quản Lý Cache
```bash
# Xem thống kê cache
python cli.py --cache-stats

# Xóa toàn bộ cache
python cli.py --clear-cache

# Xóa cache hết hạn
python cli.py --cleanup-cache
```

### 6. Xử Lý Batch từ File
```bash
# Tạo file URLs
echo "https://vnexpress.net/" > urls.txt
echo "https://dantri.com.vn/" >> urls.txt
echo "https://tuoitre.vn/" >> urls.txt

# Xử lý batch cơ bản
python cli.py --file urls.txt

# Batch với cấu hình nâng cao
python cli.py --file urls.txt \
    --delay 2 \
    --format json \
    --output batch_results.json \
    --verbose

# Batch với Selenium và không cache
python cli.py --file urls.txt \
    --selenium \
    --no-cache \
    --delay 3 \
    --timeout 30
```

### 7. Cấu Hình Nâng Cao
```bash
python cli.py https://example.com \
    --timeout 45 \
    --retries 5 \
    --delay 1 \
    --force-type news \
    --no-cache \
    --verbose \
    --output detailed_result.json
```

### 8. Ví Dụ Thực Tế
```bash
# Cào tin tức và lưu CSV
python cli.py https://vnexpress.net/tin-tuc-moi \
    --format csv \
    --output news_$(date +%Y%m%d).csv \
    --verbose

# Cào sản phẩm e-commerce với Selenium
python cli.py https://shopee.vn/product/123 \
    --selenium \
    --timeout 30 \
    --format json \
    --output product_info.json

# Batch processing nhiều trang tin tức
python cli.py --file news_urls.txt \
    --delay 2 \
    --format csv \
    --output all_news.csv \
    --force-type news \
    --verbose
```

---

## 📋 CLI Reference - Tham Khảo Các Options

### Cú Pháp Cơ Bản
```bash
python cli.py [URL|--file FILE] [OPTIONS]
```

### Tham Số Bắt Buộc (chọn 1 trong 2)
- `URL` - URL trang web cần cào
- `--file FILE, -f FILE` - File chứa danh sách URLs (một URL mỗi dòng)

### Options Đầu Ra
- `--output FILE, -o FILE` - Lưu kết quả vào file
- `--format FORMAT` - Định dạng đầu ra: `json` (mặc định), `csv`, `xml`

### Options Cấu Hình
- `--timeout SECONDS` - Timeout cho mỗi request (mặc định: 30s)
- `--retries COUNT` - Số lần thử lại khi thất bại (mặc định: 3)
- `--delay SECONDS` - Độ trễ giữa các requests (mặc định: 0s)

### Options Selenium
- `--selenium` - Sử dụng Selenium WebDriver
- `--headless` - Chạy browser ẩn (mặc định khi dùng Selenium)
- `--no-headless` - Hiển thị browser (để debug)

### Options Cache
- `--no-cache` - Bỏ qua cache, luôn cào từ web
- `--cache-stats` - Hiển thị thống kê cache
- `--clear-cache` - Xóa toàn bộ cache
- `--cleanup-cache` - Xóa cache hết hạn

### Options Khác
- `--classify-only` - Chỉ phân loại trang, không cào nội dung
- `--force-type TYPE` - Ép kiểu trang: `news`, `blog`, `ecommerce`, `general`
- `--verbose, -v` - Hiển thị log chi tiết
- `--help, -h` - Hiển thị help

### Ví Dụ Options Kết Hợp
```bash
# Cào với đầy đủ options
python cli.py https://example.com \
    --selenium \
    --timeout 60 \
    --retries 5 \
    --delay 2 \
    --no-cache \
    --format json \
    --output result.json \
    --verbose

# Batch processing với rate limiting
python cli.py --file urls.txt \
    --delay 3 \
    --timeout 45 \
    --format csv \
    --output batch_results.csv \
    --force-type news \
    --verbose
```

---

## 🛠️ Xử Lý Lỗi

### 1. Các Loại Lỗi Thường Gặp

#### Lỗi Kết Nối
```python
result = scraper.scrape("https://invalid-domain.com")
if not result['success']:
    print(f"Lỗi: {result['error']}")
    # "Scraping error: HTTPSConnectionPool..."
```

#### Lỗi Timeout
```python
# Tăng timeout cho trang load chậm
scraper = SmartScraper(timeout=60)
result = scraper.scrape("https://slow-website.com")
```

#### Lỗi Selenium
```python
try:
    scraper = SmartScraper(use_selenium=True)
    result = scraper.scrape("https://example.com")
except Exception as e:
    print(f"Selenium error: {e}")
    # Thử fallback về requests
    scraper_fallback = SmartScraper(use_selenium=False)
    result = scraper_fallback.scrape("https://example.com")
```

### 2. Best Practices Xử Lý Lỗi

```python
def safe_scrape(url):
    """Hàm cào an toàn với xử lý lỗi đầy đủ"""
    scraper = None
    try:
        scraper = SmartScraper(timeout=30, max_retries=3)
        result = scraper.scrape(url)
        
        if result['success']:
            return result
        else:
            print(f"❌ Không thể cào {url}: {result.get('error')}")
            return None
            
    except Exception as e:
        print(f"❌ Lỗi bất ngờ khi cào {url}: {e}")
        return None
    
    finally:
        if scraper:
            scraper.close()

# Sử dụng
result = safe_scrape("https://example.com")
if result:
    print(f"✅ Thành công: {result['page_type']}")
```

### 3. Retry Logic Tùy Chỉnh

```python
import time
import random

def scrape_with_custom_retry(url, max_attempts=5):
    """Cào với retry logic tùy chỉnh"""
    scraper = SmartScraper()
    
    for attempt in range(max_attempts):
        try:
            result = scraper.scrape(url, use_cache=False)
            if result['success']:
                return result
            
            # Exponential backoff với jitter
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            print(f"Thử lại sau {wait_time:.1f} giây... (lần {attempt + 1})")
            time.sleep(wait_time)
            
        except Exception as e:
            print(f"Lỗi lần {attempt + 1}: {e}")
            if attempt == max_attempts - 1:
                raise
    
    scraper.close()
    return None
```

---

## ❓ FAQ - Câu Hỏi Thường Gặp

### Q1: Làm sao để cào trang web cần đăng nhập?
**A:** Sử dụng Selenium và tự động hóa đăng nhập:

```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

scraper = SmartScraper(use_selenium=True, headless=False)

# Access driver trực tiếp để đăng nhập
driver = scraper.driver
driver.get("https://website.com/login")

# Tự động đăng nhập
username_input = driver.find_element(By.NAME, "username")
password_input = driver.find_element(By.NAME, "password")

username_input.send_keys("your_username")
password_input.send_keys("your_password")
driver.find_element(By.XPATH, "//button[@type='submit']").click()

# Đợi đăng nhập xong
WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CLASS_NAME, "dashboard"))
)

# Giờ có thể cào trang protected
result = scraper.scrape("https://website.com/protected-page")
```

### Q2: Làm sao để cào nhiều trang một cách hiệu quả?
**A:** Sử dụng threading và batch processing:

```python
import threading
from concurrent.futures import ThreadPoolExecutor
import time

def scrape_batch(urls, max_workers=5, delay=1.0):
    """Cào nhiều URL song song"""
    results = []
    
    def scrape_single(url):
        scraper = SmartScraper()
        try:
            result = scraper.scrape(url)
            time.sleep(delay)  # Rate limiting
            return result
        finally:
            scraper.close()
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(scrape_single, url) for url in urls]
        results = [future.result() for future in futures]
    
    return results

# Sử dụng
urls = ["https://site1.com", "https://site2.com", "https://site3.com"]
results = scrape_batch(urls, max_workers=3, delay=2.0)
```

### Q3: Cache hoạt động như thế nào?
**A:** Cache tự động lưu kết quả để tăng tốc:

```python
# Lần đầu: cào từ web (chậm)
result1 = scraper.scrape("https://example.com")  # ~2 giây

# Lần sau: lấy từ cache (nhanh)
result2 = scraper.scrape("https://example.com")  # ~0.01 giây
print(result2['from_cache'])  # True

# Bỏ qua cache nếu cần data mới
result3 = scraper.scrape("https://example.com", use_cache=False)
```

### Q4: Làm sao để cải thiện độ chính xác?
**A:** Vài tips để tăng độ chính xác:

```python
# 1. Sử dụng Selenium cho trang có JS
scraper = SmartScraper(use_selenium=True)

# 2. Tăng timeout cho trang load chậm
scraper = SmartScraper(timeout=60)

# 3. Force type nếu biết trước loại trang
result = scraper.scrape("https://blog.com", force_type="blog")

# 4. Kiểm tra confidence score
if result['extraction_confidence'] < 0.7:
    print("⚠️ Kết quả có thể không chính xác")

# 5. Tạo extractor tùy chỉnh cho domain cụ thể
class MyNewsExtractor(BaseExtractor):
    # Custom logic cho trang tin tức cụ thể
    pass
```

### Q5: Cách debug khi có vấn đề?
**A:** Sử dụng logging và debug mode:

```python
import logging
from smart_scraper.logging_config import setup_logging

# Bật debug logging
setup_logging(level=logging.DEBUG, log_to_file=True)

# Sử dụng Selenium không headless để xem browser
scraper = SmartScraper(use_selenium=True, headless=False)

# Kiểm tra HTML thô
result = scraper.scrape("https://example.com")
print("HTML Analysis:", result['html_analysis'])

# Kiểm tra confidence scores
print(f"Classification: {result['classification_confidence']}")
print(f"Extraction: {result['extraction_confidence']}")
```

### Q6: Có thể cào dữ liệu từ API không?
**A:** Smart Scraper chuyên cho HTML, nhưng có thể mở rộng:

```python
class APIExtractor(BaseExtractor):
    def __init__(self):
        super().__init__()
        self.extractor_type = "api"
    
    def extract(self, soup, url=""):
        # Thay vì parse HTML, gọi API
        import requests
        api_url = url.replace('/page/', '/api/')
        response = requests.get(api_url)
        return response.json()
    
    def get_confidence_score(self, soup):
        # Check if this looks like an API endpoint
        return 0.9 if "/api/" in soup.get_text() else 0.0

# Sử dụng
scraper.add_extractor("api", APIExtractor())
result = scraper.scrape("https://api.example.com/data", force_type="api")
```

---

## 🎯 Kết Luận

Smart Web Scraper cung cấp giải pháp hoàn chỉnh cho việc cào dữ liệu web thông minh:

### ✅ Tính Năng Nổi Bật
- **Tự động nhận diện** loại trang web
- **Trích xuất thông minh** nội dung quan trọng  
- **Mở rộng dễ dàng** với custom extractors
- **Performance cao** với caching và retry logic
- **Dễ sử dụng** với cả API và CLI

### 🛡️ Best Practices
1. **Luôn close scraper** sau khi sử dụng (đặc biệt với Selenium)
2. **Sử dụng timeout hợp lý** tùy theo trang web
3. **Kiểm tra confidence score** để đánh giá chất lượng
4. **Implement retry logic** cho ứng dụng production
5. **Tôn trọng robots.txt** và rate limiting

### 🚀 Sẵn Sàng Sử Dụng
Bây giờ bạn đã có đầy đủ kiến thức để sử dụng Smart Web Scraper hiệu quả. Hãy bắt đầu với các ví dụ đơn giản và dần dần khám phá các tính năng nâng cao!

**Chúc bạn cào dữ liệu thành công!** 🎉

---

*Tài liệu này được cập nhật lần cuối: 27/05/2025*
