import boto3
from botocore.exceptions import ClientError
import os
from datetime import datetime
import uuid

class S3Service:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION')
        )
        self.bucket_name = os.getenv('AWS_BUCKET_NAME')

    def generate_presigned_url(self, file_key, expiration=3600):
        """Generate a presigned URL for downloading a file."""
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': file_key
                },
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            print(f"Error generating presigned URL: {e}")
            return None

    def upload_file(self, file_data, original_filename, course_id):
        """Upload a file to S3 and return the file key."""
        try:
            # Generate unique filename
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            unique_id = str(uuid.uuid4())[:8]
            # Get extension from the actual file name, not the title
            file_extension = 'pdf'  # Since we're only handling PDFs
            file_key = f"courses/{course_id}/{timestamp}_{unique_id}.{file_extension}"

            # Upload file
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=file_key,
                Body=file_data,
                ContentType='application/pdf',
                Metadata={
                    'title': original_filename,  # This is actually the title from the form
                    'original_filename': original_filename
                }
            )

            return file_key
        except Exception as e:
            print(f"Error uploading file: {e}")
            raise

    def list_course_files(self, course_id):
        """List all files in a course directory."""
        try:
            # List objects with course prefix
            prefix = f"courses/{course_id}/"
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )

            files = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    # Get object metadata
                    metadata = self.s3_client.head_object(
                        Bucket=self.bucket_name,
                        Key=obj['Key']
                    )
                    
                    # Generate a presigned URL for each file
                    file_key = obj['Key']
                    url = self.generate_presigned_url(file_key)
                    
                    # Get title from metadata or fallback to filename
                    title = metadata.get('Metadata', {}).get('title', file_key.split('/')[-1])
                    
                    files.append({
                        'key': file_key,
                        'title': title,
                        'url': url,
                        'size': obj['Size'],
                        'lastModified': obj['LastModified'].isoformat()
                    })

            return files
        except Exception as e:
            print(f"Error listing files: {e}")
            raise

    def delete_file(self, file_key):
        """Delete a file from S3."""
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=file_key
            )
            return True
        except Exception as e:
            print(f"Error deleting file: {e}")
            raise 