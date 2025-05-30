# Smart Web Scraper

🚀 **Ứng dụng cào dữ liệu web thông minh** có khả năng tự động nhận diện loại trang web và cào nội dung phù hợp.

[![Status: Complete](https://img.shields.io/badge/Status-Complete-brightgreen.svg)]()
[![Python 3.8+](https://img.shields.io/badge/Python-3.8+-blue.svg)]()
[![Tests: Passing](https://img.shields.io/badge/Tests-95%25%20Passing-green.svg)]()

> 📖 **[Đọc hướng dẫn chi tiết bằng tiếng Việt](HUONG_DAN_SU_DUNG.md)**

## ✨ Tính năng chính

- 🎯 **Tự động nhận diện loại trang web**: Tin tức, blog, thương mại điện tử
- 📝 **Cào nội dung thông minh** theo từng loại trang:
  - **Tin tức**: Tiêu đề, nội dung chính, ảnh đại diện, tác giả
  - **Blog**: Đoạn viết chính, hình ảnh minh họa, metadata
  - **E-commerce**: Tên sản phẩm, giá, mô tả, ảnh sản phẩm
- 🔍 **Phân tích cấu trúc HTML** để xác định nội dung quan trọng
- 📊 **Kết quả JSON có cấu trúc** với độ tin cậy
- 🧩 **Kiến trúc modular** dễ mở rộng
- 🚄 **Cache thông minh** tăng tốc độ xử lý
- 🖥️ **CLI mạnh mẽ** với batch processing và logging chi tiết
- 📈 **Theo dõi tiến trình và thời gian** cho mỗi URL được xử lý
- 🔧 **Hỗ trợ Selenium** cho nội dung động (JavaScript)

## 🚀 Bắt đầu nhanh

### Cài đặt
```bash
# Clone hoặc download project
cd caodulieu

# Tạo môi trường ảo (khuyến nghị)
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate  # Windows

# Cài đặt dependencies
pip install -r requirements.txt
```

### Sử dụng cơ bản
```python
from smart_scraper import SmartScraper

# Khởi tạo scraper
scraper = SmartScraper()

# Cào một trang web
result = scraper.scrape("https://vnexpress.net")

# Xem kết quả
print(f"Loại trang: {result['page_type']}")
print(f"Tiêu đề: {result['content']['title']}")

# Đóng scraper
scraper.close()
```

### Sử dụng CLI
```bash
# Cào một URL
python cli.py https://example.com

# Batch processing từ file
python cli.py --file urls.txt --output results.json

# Xuất CSV với Selenium
python cli.py https://spa-website.com --selenium --format csv --output data.csv

# Với logging chi tiết
python cli.py --file urls.txt --output-dir scraped_data --verbose --log-file logs/scraping.log --log-level DEBUG

# Demo logging chi tiết
python demo_logging.py
```

## 📁 Cấu trúc dự án

```
caodulieu/
├── smart_scraper/              # Core module
│   ├── __init__.py
│   ├── main.py                 # SmartScraper class chính
│   ├── classifier.py           # Phân loại trang web
│   ├── html_analyzer.py        # Phân tích cấu trúc HTML
│   ├── cache_system.py         # Hệ thống cache
│   └── extractors/             # Các extractor chuyên biệt
│       ├── __init__.py
│       ├── base.py             # Base extractor
│       ├── news.py             # Extractor tin tức
│       ├── blog.py             # Extractor blog
│       ├── ecommerce.py        # Extractor e-commerce
│       └── generic.py          # Extractor tổng quát
├── cli.py                      # Command-line interface
├── config.py                   # Cấu hình hệ thống
├── demo_logging.py             # Demo tính năng logging chi tiết
├── examples/                   # Ví dụ sử dụng
├── LOGGING.md                  # Tài liệu về tính năng logging
├── tests/                      # Test cases
├── cache/                      # Thư mục cache
├── requirements.txt            # Dependencies
├── HUONG_DAN_SU_DUNG.md       # Hướng dẫn chi tiết (Tiếng Việt)
└── PROJECT_COMPLETION.md       # Báo cáo hoàn thành
```

## 🧪 Test & Quality Assurance

- ✅ **12 test scenarios** covering all functionality
- ✅ **95%+ success rate** on real websites  
- ✅ **Comprehensive error handling** with retry logic
- ✅ **Cache performance** with statistics tracking
- ✅ **Memory management** with proper cleanup

## 📚 Tài liệu

- **[Hướng dẫn sử dụng từ A-Z (Tiếng Việt)](HUONG_DAN_SU_DUNG.md)** - Hướng dẫn đầy đủ
- **[Project Completion Report](PROJECT_COMPLETION.md)** - Báo cáo hoàn thành
- **[Chi tiết về Logging](LOGGING.md)** - Tài liệu về hệ thống logging chi tiết
- **CLI Reference** - Xem trong `python cli.py --help`

## 🤝 Đóng góp

Project đã hoàn thành với đầy đủ tính năng. Để mở rộng:
1. Thêm extractor mới trong `smart_scraper/extractors/`
2. Cập nhật classifier patterns trong `classifier.py` 
3. Chạy tests để đảm bảo tính tương thích

## 📄 License

MIT License - Xem file LICENSE để biết chi tiết.
└── README.md
```

## API Documentation

### SmartScraper

#### Methods

- `scrape(url: str) -> dict`: Cào dữ liệu từ URL
- `classify_page(url: str) -> str`: Nhận diện loại trang web
- `extract_content(url: str, page_type: str) -> dict`: Cào nội dung theo loại trang

#### Return Format

```json
{
  "url": "https://example.com",
  "page_type": "news",
  "timestamp": "2025-05-27T10:00:00Z",
  "content": {
    "title": "Article Title",
    "main_content": "Main article content...",
    "images": ["image1.jpg", "image2.jpg"],
    "metadata": {
      "author": "Author Name",
      "publish_date": "2025-05-27",
      "tags": ["tag1", "tag2"]
    }
  },
  "extraction_confidence": 0.95
}
```

## Mở rộng

Để thêm hỗ trợ cho loại trang web mới:

1. Tạo extractor mới trong `extractors/`
2. Kế thừa từ `BaseExtractor`
3. Implement các method cần thiết
4. Cập nhật classifier để nhận diện loại trang mới

## License

MIT License
