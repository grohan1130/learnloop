"""Database configuration module.

This module handles MongoDB connection setup and provides access to collections.

Environment Variables:
    MONGODB_URI (str): MongoDB connection string

Collections:
    - teacherDirectory: Collection for teacher documents
    - studentDirectory: Collection for student documents
    - courseCatalog: Collection for course documents

Raises:
    ValueError: If MONGODB_URI environment variable is not set
"""

from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# MongoDB connection
uri = os.getenv('MONGODB_URI')
if not uri:
    raise ValueError("No MongoDB URI found in environment variables")

client = MongoClient(uri)
db = client.learnloopcluster1db

# Collections
teacher_collection = db.teacherDirectory
student_collection = db.studentDirectory
course_collection = db.courseCatalog 