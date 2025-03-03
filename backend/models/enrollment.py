from datetime import datetime
from bson import ObjectId
from config.database import db

# Collection for enrollments
enrollment_collection = db.enrollments

# Helper function to create enrollment
def create_enrollment(course_id, student_id):
    enrollment = {
        "courseId": ObjectId(course_id),
        "studentId": ObjectId(student_id),
        "enrollDate": datetime.utcnow(),
        "status": "active"
    }
    return enrollment_collection.insert_one(enrollment) 