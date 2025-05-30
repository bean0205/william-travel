# 🚀 AI Scraper Shell Scripts - Usage Guide

## 📁 Available Scripts

### 1. 🎛️ `run_scraper.sh` - Interactive Menu Runner
**Mô tả**: Script tương tác đầy đủ với menu để cấu hình và chạy AI scraper.

**Cách sử dụng**:
```bash
./run_scraper.sh
```

**Tính năng**:
- ✅ Menu tương tác thân thiện
- ✅ Cấu hình chi tiết tất cả tham số
- ✅ 6 preset có sẵn (Fast, Balanced, High Performance, AI Enhanced, Analysis, Debug)
- ✅ Kiểm tra file input tự động
- ✅ Xem kết quả gần đây
- ✅ Hướng dẫn sử dụng tích hợp

**Menu chính**:
1. 📂 Set Input File - Chọn file URLs
2. 📄 Set Output File - Chọn file kết quả
3. ⚡ Configure Performance - Cấu hình hiệu suất
4. 🤖 Configure AI Settings - Cấu hình AI
5. 🔧 Configure Advanced Options - Tùy chọn nâng cao
6. 🚀 Quick Start Presets - Các preset có sẵn
7. ▶️ Run Scraper - Chạy scraper
8. 📊 Show Recent Results - Xem kết quả
9. 📖 Help - Hướng dẫn

---

### 2. ⚡ `quick_run.sh` - Quick Command Runner
**Mô tả**: Script chạy nhanh với các preset có sẵn, không cần menu.

**Cách sử dụng**:
```bash
./quick_run.sh [preset] [input_file] [output_file]
```

**Các preset có sẵn**:
- `fast` - Chế độ nhanh (batch nhỏ, tính năng cơ bản)
- `balanced` - Chế độ cân bằng (batch trung bình, tính năng tiêu chuẩn)
- `ai` - Chế độ AI nâng cao (phân tích sentiment, chất lượng cao)
- `async` - Chế độ hiệu suất cao với async
- `debug` - Chế độ debug (verbose, batch đơn)

**Ví dụ**:
```bash
# Chạy nhanh với file urls.txt
./quick_run.sh fast urls.txt results.json

# Chạy AI enhanced với file custom
./quick_run.sh ai multi_test_urls.txt ai_results.json

# Debug một URL
./quick_run.sh debug test_urls.txt debug_output.json
```

---

### 3. 🔄 `batch_run.sh` - Batch Processing Runner
**Mô tả**: Xử lý hàng loạt tất cả file .txt trong thư mục hiện tại.

**Cách sử dụng**:
```bash
./batch_run.sh [preset]
```

**Tính năng**:
- ✅ Tự động tìm tất cả file .txt
- ✅ Xử lý tuần tự với delay giữa các file
- ✅ Tạo thư mục kết quả riêng theo timestamp
- ✅ Báo cáo tổng kết sau khi hoàn thành
- ✅ Xử lý an toàn với error handling

**Ví dụ**:
```bash
# Xử lý hàng loạt với preset balanced
./batch_run.sh balanced

# Xử lý hàng loạt với AI enhanced
./batch_run.sh ai
```

---

## 🎯 Quick Start Examples

### Scenario 1: Scraping đơn giản một file URLs
```bash
# Sử dụng menu tương tác
./run_scraper.sh

# Hoặc chạy nhanh
./quick_run.sh fast urls.txt results.json
```

### Scenario 2: Phân tích AI nâng cao
```bash
# Với menu (chọn preset AI Enhanced)
./run_scraper.sh

# Hoặc chạy trực tiếp
./quick_run.sh ai urls.txt ai_analysis.json
```

### Scenario 3: Xử lý hàng loạt nhiều file
```bash
# Tạo nhiều file URLs trong thư mục
echo "https://example1.com" > file1.txt
echo "https://example2.com" > file2.txt

# Xử lý hàng loạt
./batch_run.sh balanced
```

### Scenario 4: Debug và troubleshooting
```bash
# Chạy debug mode với verbose
./quick_run.sh debug problem_urls.txt debug_results.json
```

---

## ⚙️ Configuration Details

### Performance Settings (Cấu hình hiệu suất)
- **Batch Size**: Số URLs xử lý cùng lúc (1-20)
- **Concurrency**: Số kết nối đồng thời (1-10)
- **Timeout**: Thời gian chờ mỗi request (10-120s)
- **Max Retries**: Số lần thử lại (1-10)
- **Delay Range**: Khoảng delay giữa requests (0.5-5.0s)

### AI Settings (Cấu hình AI)
- **Quality Threshold**: Ngưỡng chất lượng nội dung (0.0-1.0)
- **Sentiment Analysis**: Phân tích cảm xúc nội dung
- **JavaScript Rendering**: Render JS cho trang dynamic

### Advanced Options (Tùy chọn nâng cao)
- **Async Mode**: Xử lý bất đồng bộ hiệu suất cao
- **Cache**: Bật/tắt cache để tăng tốc
- **Robots.txt**: Tuân thủ robots.txt
- **Verbose Mode**: Hiển thị thông tin chi tiết

---

## 📊 Preset Comparison

| Preset | Batch Size | Concurrency | AI Features | Use Case |
|--------|------------|-------------|-------------|----------|
| **Fast** | 2 | 2 | Basic | Quick testing, small datasets |
| **Balanced** | 5 | 3 | Standard | General purpose, medium datasets |
| **AI Enhanced** | 5 | 3 | Full AI + Sentiment | Content analysis, quality extraction |
| **Async** | 10 | 5 | Basic + Async | Large datasets, performance focus |
| **Debug** | 1 | 1 | Basic + Verbose | Troubleshooting, error analysis |

---

## 🛠️ Troubleshooting

### Script không chạy được
```bash
# Kiểm tra quyền thực thi
ls -la *.sh

# Cấp quyền nếu cần
chmod +x run_scraper.sh quick_run.sh batch_run.sh
```

### File URLs không được tìm thấy
```bash
# Kiểm tra file có tồn tại
ls -la *.txt

# Tạo file test
echo "https://example.com" > test_urls.txt
```

### Python script không được tìm thấy
```bash
# Đảm bảo chạy trong đúng thư mục
ls -la url_to_json_ai.py

# Kích hoạt virtual environment nếu cần
source .venv/bin/activate
```

### Lỗi kết nối hoặc timeout
- Sử dụng preset `debug` để xem chi tiết lỗi
- Tăng timeout và giảm concurrency
- Kiểm tra kết nối internet

---

## 💡 Tips & Best Practices

1. **Bắt đầu nhỏ**: Sử dụng preset `fast` hoặc `debug` để test trước
2. **Tăng dần**: Từ `fast` → `balanced` → `ai` → `async`
3. **Monitor resources**: Theo dõi CPU/Memory khi dùng async mode
4. **Batch size hợp lý**: Không quá lớn để tránh overwhelm servers
5. **Delay phù hợp**: Tăng delay nếu gặp rate limiting
6. **Backup kết quả**: Scripts tự động tạo timestamp cho output files

---

## 🚀 Advanced Usage

### Kết hợp với cron job
```bash
# Chạy hàng ngày lúc 2h sáng
0 2 * * * cd /path/to/scraper && ./quick_run.sh balanced daily_urls.txt daily_$(date +\%Y\%m\%d).json
```

### Xử lý kết quả với jq
```bash
# Xem tổng quan kết quả
jq '.extraction_info' results.json

# Lọc URLs thành công
jq '.results[] | select(.extraction.success == true) | .url' results.json
```

### Monitoring và alerting
```bash
# Kiểm tra success rate
success_rate=$(jq '.extraction_info.successful_extractions / .extraction_info.total_urls * 100' results.json)
echo "Success rate: $success_rate%"
```
