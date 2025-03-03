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
enrollment_collection = db.enrollments

def init_db():
    """Initialize database collections if they don't exist."""
    if 'teacherDirectory' not in db.list_collection_names():
        db.create_collection('teacherDirectory')
    if 'studentDirectory' not in db.list_collection_names():
        db.create_collection('studentDirectory')
    if 'courseCatalog' not in db.list_collection_names():
        db.create_collection('courseCatalog')
    if 'enrollments' not in db.list_collection_names():
        db.create_collection('enrollments') 