"""
FastAPI Application cho MinIO
Web API để upload/download files
"""

import os
import shutil
import re
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Body
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import sys

# Thêm thư mục gốc vào đường dẫn để tìm module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Sửa đường dẫn import để chạy trong nhiều ngữ cảnh
try:
    from app.minio_client import MinIOClient
except ImportError:
    from minio_client import MinIOClient

# Khởi tạo FastAPI app
app = FastAPI(
    title="MinIO File Management API",
    description="API để quản lý files với MinIO",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Khởi tạo MinIO client
minio_client = MinIOClient(
    endpoint=os.getenv("MINIO_ENDPOINT", "localhost:9000"),
    access_key=os.getenv("MINIO_ACCESS_KEY", "minioadmin"),
    secret_key=os.getenv("MINIO_SECRET_KEY", "minioadmin123"),
    secure=os.getenv("MINIO_SECURE", "false").lower() == "true"
)

# Tạo thư mục cần thiết
os.makedirs("uploads", exist_ok=True)
os.makedirs("downloads", exist_ok=True)

# Model cho upload ảnh base64
class Base64ImageUpload(BaseModel):
    bucket_name: str
    file_name: str
    base64_data: str
    content_type: str = "image/jpeg"

@app.get("/")
async def root():
    """Trang chủ API"""
    return {
        "message": "MinIO File Management API",
        "version": "1.0.0",
        "endpoints": {
            "buckets": "/buckets",
            "upload": "/upload",
            "download": "/download/{bucket_name}/{object_name}",
            "files": "/files/{bucket_name}",
            "delete": "/delete/{bucket_name}/{object_name}"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        buckets = minio_client.list_buckets()
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "minio_connected": True,
            "buckets_count": len(buckets)
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "timestamp": datetime.now().isoformat(),
                "minio_connected": False,
                "error": str(e)
            }
        )

@app.get("/buckets")
async def list_buckets():
    """Liệt kê tất cả buckets"""
    try:
        buckets = minio_client.list_buckets()
        return {
            "buckets": buckets,
            "count": len(buckets)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/buckets/{bucket_name}")
async def create_bucket(bucket_name: str):
    """Tạo bucket mới"""
    try:
        success = minio_client.create_bucket(bucket_name)
        if success:
            return {"message": f"Bucket '{bucket_name}' được tạo thành công"}
        else:
            raise HTTPException(status_code=500, detail="Không thể tạo bucket")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_file(
    bucket_name: str = Form(...),
    file: UploadFile = File(...)
):
    """Upload file lên MinIO"""
    try:
        # Lưu file tạm thời
        temp_file_path = f"uploads/{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Upload lên MinIO
        object_name = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        success = minio_client.upload_file(
            bucket_name=bucket_name,
            object_name=object_name,
            file_path=temp_file_path,
            content_type=file.content_type
        )
        
        # Xóa file tạm
        os.remove(temp_file_path)
        
        if success:
            return {
                "message": "Upload thành công",
                "bucket": bucket_name,
                "object_name": object_name,
                "original_filename": file.filename,
                "size": file.size,
                "content_type": file.content_type
            }
        else:
            raise HTTPException(status_code=500, detail="Upload thất bại")
            
    except Exception as e:
        # Cleanup nếu có lỗi
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{bucket_name}/{object_name}")
async def download_file(bucket_name: str, object_name: str):
    """Download file từ MinIO"""
    try:
        # Download từ MinIO
        download_path = f"downloads/{object_name}"
        success = minio_client.download_file(
            bucket_name=bucket_name,
            object_name=object_name,
            file_path=download_path
        )
        
        if success and os.path.exists(download_path):
            return FileResponse(
                path=download_path,
                filename=object_name,
                media_type='application/octet-stream'
            )
        else:
            raise HTTPException(status_code=404, detail="File không tồn tại")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/files/{bucket_name}")
async def list_files(bucket_name: str, prefix: str = ""):
    """Liệt kê files trong bucket"""
    try:
        objects = minio_client.list_objects(bucket_name, prefix)
        return {
            "bucket": bucket_name,
            "prefix": prefix,
            "objects": objects,
            "count": len(objects)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/delete/{bucket_name}/{object_name}")
async def delete_file(bucket_name: str, object_name: str):
    """Xóa file khỏi MinIO"""
    try:
        success = minio_client.delete_object(bucket_name, object_name)
        if success:
            return {"message": f"Xóa thành công: {bucket_name}/{object_name}"}
        else:
            raise HTTPException(status_code=500, detail="Xóa thất bại")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/info/{bucket_name}/{object_name}")
async def get_file_info(bucket_name: str, object_name: str):
    """Lấy thông tin file"""
    try:
        info = minio_client.get_object_info(bucket_name, object_name)
        if info:
            return info
        else:
            raise HTTPException(status_code=404, detail="File không tồn tại")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/presigned-url/{bucket_name}/{object_name}")
async def get_presigned_url(bucket_name: str, object_name: str, expires_hours: int = 1):
    """Tạo URL có thời hạn để truy cập file"""
    try:
        from datetime import timedelta
        url = minio_client.get_presigned_url(
            bucket_name=bucket_name,
            object_name=object_name,
            expires=timedelta(hours=expires_hours)
        )
        if url:
            return {
                "url": url,
                "expires_in_hours": expires_hours,
                "bucket": bucket_name,
                "object": object_name
            }
        else:
            raise HTTPException(status_code=404, detail="Không thể tạo URL")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-base64")
async def upload_base64_image(data: Base64ImageUpload):
    """Upload ảnh từ dữ liệu base64 lên MinIO"""
    try:
        # Xử lý dữ liệu base64
        base64_data = data.base64_data

        # Kiểm tra và xóa prefix của data URL nếu có
        pattern = r'^data:image\/\w+;base64,'
        base64_data = re.sub(pattern, '', base64_data)

        # Tạo tên file dựa trên timestamp và tên file gốc
        object_name = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{data.file_name}"

        # Upload lên MinIO
        success = minio_client.upload_base64_image(
            bucket_name=data.bucket_name,
            object_name=object_name,
            base64_data=base64_data,
            content_type=data.content_type
        )

        if success:
            return {
                "message": "Upload base64 image thành công",
                "bucket": data.bucket_name,
                "object_name": object_name,
                "original_filename": data.file_name,
                "content_type": data.content_type
            }
        else:
            raise HTTPException(status_code=500, detail="Upload base64 image thất bại")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
