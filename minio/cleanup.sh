#!/bin/bash

# Script dọn dẹp MinIO system
echo "🧹 Dọn dẹp hệ thống MinIO..."

# Stop và remove containers
docker-compose down --remove-orphans

# Remove images (optional)
read -p "Xóa Docker images? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker rmi $(docker images | grep minio | awk '{print $3}') 2>/dev/null || true
fi

# Remove volumes (optional)
read -p "Xóa MinIO data volumes? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker volume rm $(docker volume ls | grep minio | awk '{print $2}') 2>/dev/null || true
fi

echo "✅ Dọn dẹp hoàn tất!"