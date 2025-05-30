#!/bin/bash

# Script khởi động toàn bộ hệ thống MinIO + Python App
set -e

echo "🚀 Khởi động hệ thống MinIO + Python App..."

# Kiểm tra Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker chưa được cài đặt."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker không chạy."
    exit 1
fi

# Build và start services
echo "🔨 Build và khởi động services..."
docker-compose down --remove-orphans
docker-compose build
docker-compose up -d

# Đợi services khởi động
echo "⏳ Đợi services khởi động..."
sleep 15

# Kiểm tra health
echo "🏥 Kiểm tra health..."
if curl -s http://localhost:9000/minio/health/live > /dev/null; then
    echo "✅ MinIO đã sẵn sàng!"
else
    echo "❌ MinIO chưa sẵn sàng"
fi

if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Python App đã sẵn sàng!"
else
    echo "❌ Python App chưa sẵn sàng"
fi

echo ""
echo "🎯 Thông tin truy cập:"
echo "MinIO Console: http://localhost:9001"
echo "MinIO API: http://localhost:9000"
echo "Python API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Username: minioadmin"
echo "Password: minioadmin123"
echo ""
echo "📊 Kiểm tra logs:"
echo "docker-compose logs -f"