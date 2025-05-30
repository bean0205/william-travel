FROM python:3.11-slim

WORKDIR /app

# Cài đặt dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY app/ .

# Tạo thư mục cho uploads và downloads
RUN mkdir -p uploads downloads

EXPOSE 8000

CMD ["python", "main.py"]