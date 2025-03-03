import boto3
import os
from dotenv import load_dotenv

load_dotenv()

def test_s3_connection():
    try:
        # Initialize S3 client
        s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION')
        )
        
        # Try to list objects in your bucket
        response = s3_client.list_objects_v2(
            Bucket=os.getenv('AWS_BUCKET_NAME'),
            MaxKeys=1
        )
        
        print("✅ S3 Connection Successful!")
        print(f"Bucket: {os.getenv('AWS_BUCKET_NAME')}")
        
    except Exception as e:
        print("❌ Connection failed:", str(e))

if __name__ == "__main__":
    test_s3_connection()