"""
MinIO Client Library
Thư viện kết nối và thao tác với MinIO
"""

import os
import logging
import base64
import io
from typing import Optional, List
from datetime import datetime, timedelta
from minio import Minio
from minio.error import S3Error
from minio.commonconfig import Tags

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MinIOClient:
    def __init__(
        self,
        endpoint: str = "localhost:9000",
        access_key: str = "minioadmin",
        secret_key: str = "minioadmin123",
        secure: bool = False
    ):
        """
        Khởi tạo MinIO client
        
        Args:
            endpoint: MinIO server endpoint
            access_key: Access key
            secret_key: Secret key
            secure: Sử dụng HTTPS hay không
        """
        self.client = Minio(
            endpoint=endpoint,
            access_key=access_key,
            secret_key=secret_key,
            secure=secure
        )
        logger.info(f"Kết nối MinIO tại: {endpoint}")
    
    def create_bucket(self, bucket_name: str) -> bool:
        """
        Tạo bucket mới
        
        Args:
            bucket_name: Tên bucket
            
        Returns:
            bool: True nếu thành công
        """
        try:
            if not self.client.bucket_exists(bucket_name):
                self.client.make_bucket(bucket_name)
                logger.info(f"Tạo bucket '{bucket_name}' thành công")
                return True
            else:
                logger.info(f"Bucket '{bucket_name}' đã tồn tại")
                return True
        except S3Error as e:
            logger.error(f"Lỗi tạo bucket: {e}")
            return False
    
    def list_buckets(self) -> List[str]:
        """
        Liệt kê tất cả buckets
        
        Returns:
            List[str]: Danh sách tên bucket
        """
        try:
            buckets = self.client.list_buckets()
            bucket_names = [bucket.name for bucket in buckets]
            logger.info(f"Tìm thấy {len(bucket_names)} buckets")
            return bucket_names
        except S3Error as e:
            logger.error(f"Lỗi liệt kê buckets: {e}")
            return []
    
    def upload_file(
        self,
        bucket_name: str,
        object_name: str,
        file_path: str,
        content_type: Optional[str] = None
    ) -> bool:
        """
        Upload file lên MinIO
        
        Args:
            bucket_name: Tên bucket
            object_name: Tên object trong bucket
            file_path: Đường dẫn file local
            content_type: Content type của file
            
        Returns:
            bool: True nếu thành công
        """
        try:
            # Tạo bucket nếu chưa tồn tại
            self.create_bucket(bucket_name)
            
            # Upload file
            self.client.fput_object(
                bucket_name=bucket_name,
                object_name=object_name,
                file_path=file_path,
                content_type=content_type
            )
            
            logger.info(f"Upload thành công: {file_path} -> {bucket_name}/{object_name}")
            return True
            
        except S3Error as e:
            logger.error(f"Lỗi upload file: {e}")
            return False
        except FileNotFoundError:
            logger.error(f"File không tồn tại: {file_path}")
            return False
    
    def download_file(
        self,
        bucket_name: str,
        object_name: str,
        file_path: str
    ) -> bool:
        """
        Download file từ MinIO
        
        Args:
            bucket_name: Tên bucket
            object_name: Tên object trong bucket
            file_path: Đường dẫn lưu file local
            
        Returns:
            bool: True nếu thành công
        """
        try:
            # Tạo thư mục nếu chưa tồn tại
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            
            # Download file
            self.client.fget_object(
                bucket_name=bucket_name,
                object_name=object_name,
                file_path=file_path
            )
            
            logger.info(f"Download thành công: {bucket_name}/{object_name} -> {file_path}")
            return True
            
        except S3Error as e:
            logger.error(f"Lỗi download file: {e}")
            return False
    
    def list_objects(self, bucket_name: str, prefix: str = "") -> List[dict]:
        """
        Liệt kê objects trong bucket
        
        Args:
            bucket_name: Tên bucket
            prefix: Tiền tố để filter
            
        Returns:
            List[dict]: Danh sách objects
        """
        try:
            objects = []
            for obj in self.client.list_objects(bucket_name, prefix=prefix):
                objects.append({
                    'name': obj.object_name,
                    'size': obj.size,
                    'last_modified': obj.last_modified,
                    'etag': obj.etag
                })
            
            logger.info(f"Tìm thấy {len(objects)} objects trong bucket '{bucket_name}'")
            return objects
            
        except S3Error as e:
            logger.error(f"Lỗi liệt kê objects: {e}")
            return []
    
    def delete_object(self, bucket_name: str, object_name: str) -> bool:
        """
        Xóa object khỏi bucket
        
        Args:
            bucket_name: Tên bucket
            object_name: Tên object
            
        Returns:
            bool: True nếu thành công
        """
        try:
            self.client.remove_object(bucket_name, object_name)
            logger.info(f"Xóa thành công: {bucket_name}/{object_name}")
            return True
            
        except S3Error as e:
            logger.error(f"Lỗi xóa object: {e}")
            return False
    
    def get_presigned_url(
        self,
        bucket_name: str,
        object_name: str,
        expires: timedelta = timedelta(hours=1)
    ) -> Optional[str]:
        """
        Tạo URL có thời hạn để truy cập object
        
        Args:
            bucket_name: Tên bucket
            object_name: Tên object
            expires: Thời hạn URL
            
        Returns:
            Optional[str]: URL hoặc None nếu lỗi
        """
        try:
            url = self.client.presigned_get_object(
                bucket_name=bucket_name,
                object_name=object_name,
                expires=expires
            )
            logger.info(f"Tạo presigned URL cho: {bucket_name}/{object_name}")
            return url
            
        except S3Error as e:
            logger.error(f"Lỗi tạo presigned URL: {e}")
            return None
    
    def get_object_info(self, bucket_name: str, object_name: str) -> Optional[dict]:
        """
        Lấy thông tin object
        
        Args:
            bucket_name: Tên bucket
            object_name: Tên object
            
        Returns:
            Optional[dict]: Thông tin object hoặc None nếu lỗi
        """
        try:
            stat = self.client.stat_object(bucket_name, object_name)
            return {
                'name': object_name,
                'size': stat.size,
                'last_modified': stat.last_modified,
                'etag': stat.etag,
                'content_type': stat.content_type
            }
            
        except S3Error as e:
            logger.error(f"Lỗi lấy thông tin object: {e}")
            return None

    def upload_base64_image(
        self,
        bucket_name: str,
        object_name: str,
        base64_data: str,
        content_type: str = "image/jpeg"
    ) -> bool:
        """
        Upload ảnh từ dữ liệu base64 lên MinIO

        Args:
            bucket_name: Tên bucket
            object_name: Tên object trong bucket
            base64_data: Dữ liệu base64 của ảnh (không bao gồm prefix như data:image/jpeg;base64,)
            content_type: Content type của ảnh

        Returns:
            bool: True nếu thành công
        """
        try:
            # Tạo bucket nếu chưa tồn tại
            self.create_bucket(bucket_name)

            # Decode dữ liệu base64
            image_data = base64.b64decode(base64_data)
            image_stream = io.BytesIO(image_data)
            file_size = len(image_data)

            # Upload ảnh
            self.client.put_object(
                bucket_name=bucket_name,
                object_name=object_name,
                data=image_stream,
                length=file_size,
                content_type=content_type
            )

            logger.info(f"Upload base64 image thành công: {bucket_name}/{object_name} ({file_size} bytes)")
            return True

        except S3Error as e:
            logger.error(f"Lỗi upload base64 image: {e}")
            return False
        except Exception as e:
            logger.error(f"Lỗi xử lý base64 image: {e}")
            return False
