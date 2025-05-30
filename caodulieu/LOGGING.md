# Chi tiết về hệ thống Logging trong Smart Web Scraper

Smart Web Scraper được trang bị hệ thống logging chi tiết giúp theo dõi tiến trình và xử lý các quy trình cào dữ liệu web.

## Tính năng chính của Logging

- 📊 **Theo dõi tiến trình cào dữ liệu** cho mỗi URL và toàn bộ quá trình
- ⏱️ **Thông tin thời gian chi tiết** cho từng bước cào dữ liệu
- 📂 **Ghi log chi tiết về việc đọc và ghi file**
- 🔍 **Theo dõi thành công/thất bại** và nguyên nhân
- 📁 **Lưu log vào file** với các cấp độ chi tiết khác nhau
- 🖥️ **Hiển thị log trên console** với option verbose

## Các cấp độ log

- **DEBUG**: Thông tin chi tiết nhất, hữu ích cho phát triển và gỡ lỗi
- **INFO**: Thông tin về tiến trình thực hiện bình thường
- **WARNING**: Cảnh báo không ảnh hưởng đến kết quả chung
- **ERROR**: Lỗi khiến một URL không thể cào thành công
- **CRITICAL**: Lỗi nghiêm trọng khiến toàn bộ quá trình thất bại

## Sử dụng logging trong CLI

```bash
python cli.py --file urls.txt --verbose --log-file logs/scraping.log --log-level DEBUG
```

### Các tham số liên quan đến logging

| Tham số | Mô tả |
|---------|-------|
| `--verbose` / `-v` | Hiển thị thông tin chi tiết trên console |
| `--log-file` | Đường dẫn file để lưu log |
| `--log-level` | Mức độ chi tiết của log (DEBUG, INFO, WARNING, ERROR, CRITICAL) |

## Ví dụ log output

```
2025-05-27 22:09:04 - __main__ - INFO - Starting Smart Web Scraper CLI
2025-05-27 22:09:04 - __main__ - INFO - Reading URLs from file: demo_urls.txt
2025-05-27 22:09:04 - __main__ - INFO - Successfully read 6 URLs from demo_urls.txt in 0.02s
2025-05-27 22:09:04 - __main__ - INFO - Configuration: URLs=6, Selenium=False, Headless=True, Timeout=30s, Delay=1.0s
2025-05-27 22:09:04 - __main__ - INFO - Output format: json
2025-05-27 22:09:04 - __main__ - INFO - Output directory: scraped_data
2025-05-27 22:09:04 - __main__ - INFO - Beginning scraping process for 6 URL(s)
2025-05-27 22:09:04 - __main__ - INFO - [1/6] (16.7%) Processing: https://vnexpress.net/
2025-05-27 22:09:04 - __main__ - DEBUG - Performing full scrape for: https://vnexpress.net/
2025-05-27 22:09:06 - __main__ - INFO - Scraping completed in 2.15s
2025-05-27 22:09:06 - __main__ - INFO - Successful scrape: https://vnexpress.net/ (type: news, confidence: 0.92)
2025-05-27 22:09:06 - __main__ - DEBUG - Extracted 5 content fields
2025-05-27 22:09:06 - __main__ - INFO - URL 1/6 processing completed in 2.18s
2025-05-27 22:09:06 - __main__ - DEBUG - Waiting 1.0s before next request
```

## Dữ liệu thống kê từ logging

Logging cung cấp các thống kê hữu ích sau khi hoàn thành:

- Tổng số URL đã xử lý
- Số lượng URL thành công/thất bại
- Tỷ lệ thành công (%)
- Số lượng kết quả từ cache
- Tổng thời gian xử lý
- Thời gian trung bình mỗi URL
- Chi tiết lỗi (nếu có)

## Demo Logging

Bạn có thể chạy script demo để xem chi tiết hệ thống logging:

```bash
python demo_logging.py
```

Script này sẽ cào các URL từ file demo_urls.txt với chế độ logging chi tiết và lưu kết quả vào thư mục riêng.
