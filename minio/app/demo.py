"""
Demo script để test MinIO operations
"""

import os
import time
from minio_client import MinIOClient

def main():
    print("🚀 Bắt đầu demo MinIO...")
    
    # Khởi tạo client
    client = MinIOClient()
    
    # 1. Tạo bucket
    print("\n1. Tạo bucket...")
    bucket_name = "demo-bucket"
    client.create_bucket(bucket_name)
    
    # 2. Liệt kê buckets
    print("\n2. Liệt kê buckets...")
    buckets = client.list_buckets()
    print(f"Buckets: {buckets}")
    
    # 3. Tạo file demo
    print("\n3. Tạo file demo...")
    demo_file = "demo.txt"
    with open(demo_file, "w") as f:
        f.write("Hello MinIO!\nThis is a demo file.\n")
        f.write(f"Created at: {time.ctime()}")
    
    # 4. Upload file
    print("\n4. Upload file...")
    success = client.upload_file(
        bucket_name=bucket_name,
        object_name="demo/demo.txt",
        file_path=demo_file,
        content_type="text/plain"
    )
    print(f"Upload success: {success}")
    
    # 5. Liệt kê objects
    print("\n5. Liệt kê objects...")
    objects = client.list_objects(bucket_name)
    for obj in objects:
        print(f"- {obj['name']} ({obj['size']} bytes)")
    
    # 6. Get object info
    print("\n6. Thông tin object...")
    info = client.get_object_info(bucket_name, "demo/demo.txt")
    if info:
        print(f"File info: {info}")
    
    # 7. Tạo presigned URL
    print("\n7. Tạo presigned URL...")
    url = client.get_presigned_url(bucket_name, "demo/demo.txt")
    if url:
        print(f"Presigned URL: {url}")
    
    # 8. Download file
    print("\n8. Download file...")
    download_path = "downloaded_demo.txt"
    success = client.download_file(
        bucket_name=bucket_name,
        object_name="demo/demo.txt",
        file_path=download_path
    )
    
    if success and os.path.exists(download_path):
        print("Download thành công!")
        with open(download_path, "r") as f:
            print("Nội dung file:")
            print(f.read())
    
    # Cleanup
    os.remove(demo_file)
    if os.path.exists(download_path):
        os.remove(download_path)
    
    print("\n✅ Demo hoàn tất!")

if __name__ == "__main__":
    main()