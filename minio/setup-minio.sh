#!/bin/bash

# Script cài đặt MinIO trên macOS với Docker
# Author: bean0205
# Date: 2025-05-29

set -e

echo "🚀 Bắt đầu cài đặt MinIO trên macOS..."

# Kiểm tra Docker đã được cài đặt chưa
if ! command -v docker &> /dev/null; then
    echo "❌ Docker chưa được cài đặt. Vui lòng cài đặt Docker Desktop trước."
    echo "Tải về tại: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Kiểm tra Docker đang chạy
if ! docker info &> /dev/null; then
    echo "❌ Docker không chạy. Vui lòng khởi động Docker Desktop."
    exit 1
fi

# Tạo thư mục cho MinIO data
MINIO_DATA_DIR="$HOME/minio-data"
mkdir -p "$MINIO_DATA_DIR"

echo "📁 Tạo thư mục data tại: $MINIO_DATA_DIR"

# MinIO credentials
MINIO_ROOT_USER="minioadmin"
MINIO_ROOT_PASSWORD="minioadmin123"
MINIO_PORT="9000"
MINIO_CONSOLE_PORT="9001"

echo "🔧 Cấu hình MinIO..."
echo "Root User: $MINIO_ROOT_USER"
echo "Root Password: $MINIO_ROOT_PASSWORD"
echo "API Port: $MINIO_PORT"
echo "Console Port: $MINIO_CONSOLE_PORT"

# Tạo Docker network nếu chưa có
if ! docker network ls | grep -q "minio-network"; then
    docker network create minio-network
    echo "🌐 Tạo Docker network: minio-network"
fi

# Dừng và xóa container cũ nếu có
if docker ps -a | grep -q "minio-server"; then
    echo "🛑 Dừng và xóa MinIO container cũ..."
    docker stop minio-server || true
    docker rm minio-server || true
fi

# Chạy MinIO container
echo "🐳 Khởi động MinIO container..."
docker run -d \
    --name minio-server \
    --network minio-network \
    -p $MINIO_PORT:9000 \
    -p $MINIO_CONSOLE_PORT:9001 \
    -v "$MINIO_DATA_DIR:/data" \
    -e "MINIO_ROOT_USER=$MINIO_ROOT_USER" \
    -e "MINIO_ROOT_PASSWORD=$MINIO_ROOT_PASSWORD" \
    quay.io/minio/minio server /data --console-address ":9001"

# Đợi MinIO khởi động
echo "⏳ Đợi MinIO khởi động..."
sleep 10

# Kiểm tra MinIO đã chạy thành công
if curl -s http://localhost:$MINIO_PORT/minio/health/live > /dev/null; then
    echo "✅ MinIO đã cài đặt và chạy thành công!"
    echo ""
    echo "📊 Thông tin kết nối:"
    echo "API Endpoint: http://localhost:$MINIO_PORT"
    echo "Web Console: http://localhost:$MINIO_CONSOLE_PORT"
    echo "Username: $MINIO_ROOT_USER"
    echo "Password: $MINIO_ROOT_PASSWORD"
    echo ""
    echo "📂 Data directory: $MINIO_DATA_DIR"
    echo ""
    echo "🎯 Bạn có thể truy cập Web Console tại: http://localhost:$MINIO_CONSOLE_PORT"
else
    echo "❌ MinIO không thể khởi động. Kiểm tra logs:"
    docker logs minio-server
    exit 1
fi

echo "🎉 Cài đặt hoàn tất!"