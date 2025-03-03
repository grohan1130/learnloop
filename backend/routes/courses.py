from flask import Blueprint, request, g
from services.course_service import CourseService
from utils.helpers import create_response, serialize_mongo_doc
from typing import Tuple, Dict, Any
import json
from functools import wraps
from services.s3_service import S3Service
import io
from datetime import datetime
from config.database import course_collection, enrollment_collection, teacher_collection
from bson import ObjectId

courses_bp = Blueprint('courses', __name__)

s3_service = S3Service()

def teacher_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return create_response(error="No authorization provided", status_code=401)
            
        try:
            # Extract user data from token or session
            user_data = json.loads(auth_header)
            if user_data['role'] != 'teacher':
                return create_response(error="Teacher access required", status_code=403)
            g.user = user_data
            return f(*args, **kwargs)
        except Exception as e:
            return create_response(error="Invalid authorization", status_code=401)
    return decorated_function

@courses_bp.route('/create', methods=['POST'])
def create_course() -> Tuple[Dict[str, Any], int]:
    """Create a new course.
    
    Expected JSON payload:
        {
            "courseName": str,
            "department": str,
            "courseNumber": str,
            "term": str,
            "year": str,
            "teacherId": str,
            "institution": str
        }
    
    Returns:
        tuple: (response_data, status_code)
            - response_data: Dict containing success message and course ID
            - status_code: HTTP status code
            
    Raises:
        400: If required fields are missing
        500: If course creation fails
    """
    try:
        data = request.json
        print(f"Received course creation data: {data}")  # Debug log
        
        if not data.get('teacherId'):
            return create_response(error="teacherId is required", status_code=400)
            
        result = CourseService.create_course(data)
        return create_response({
            "message": "Course created successfully",
            "courseId": result['courseId']
        }, status_code=201)
    except ValueError as e:
        print(f"Validation error: {str(e)}")  # Debug log
        return create_response(error=str(e), status_code=400)
    except Exception as e:
        print(f"Error creating course: {str(e)}")  # Debug log
        return create_response(error=str(e), status_code=500)

@courses_bp.route('/teacher/<teacher_id>', methods=['GET'])
def get_teacher_courses(teacher_id: str) -> Tuple[Dict[str, Any], int]:
    """Get all courses for a specific teacher.
    
    Args:
        teacher_id (str): The ID of the teacher
        
    Returns:
        tuple: (response_data, status_code)
            - response_data: Dict containing list of courses
            - status_code: HTTP status code
            
    Raises:
        500: If fetching courses fails
    """
    try:
        print(f"Received request for teacher: {teacher_id}")
        
        if not teacher_id:
            return create_response({"courses": []})
            
        courses = CourseService.get_teacher_courses(teacher_id)
        return create_response({"courses": courses})
        
    except Exception as e:
        print(f"Error in get_teacher_courses route: {str(e)}")
        return create_response({"courses": []})  # Return empty list instead of error 

@courses_bp.route('/<course_id>', methods=['GET'])
@teacher_required
def get_course_details(course_id: str) -> Tuple[Dict[str, Any], int]:
    """Get detailed information for a specific course."""
    try:
        print(f"Fetching course with ID: {course_id}")
        
        if not course_id:
            return create_response(error="Course ID is required", status_code=400)
            
        try:
            course = CourseService.get_course_with_teacher(course_id)
        except Exception as e:
            print(f"Error retrieving course: {str(e)}")
            return create_response(error="Invalid course ID format", status_code=400)
            
        if not course:
            return create_response(error="Course not found", status_code=404)
            
        return create_response({"course": course})
        
    except Exception as e:
        print(f"Error in get_course_details: {str(e)}")
        return create_response(error="Failed to fetch course details", status_code=500) 

@courses_bp.route('/<course_id>/upload', methods=['POST'])
def upload_material(course_id):
    """Handle course material upload."""
    try:
        if 'file' not in request.files:
            return create_response(error="No file provided", status_code=400)
            
        file = request.files['file']
        if not file.filename:
            return create_response(error="No file selected", status_code=400)
            
        # Check if file is PDF
        if not file.filename.lower().endswith('.pdf'):
            return create_response(error="Only PDF files are allowed", status_code=400)

        # Get other form data
        title = request.form.get('title')
        description = request.form.get('description', '')

        if not title:
            return create_response(error="Title is required", status_code=400)

        # Upload file to S3
        file_key = s3_service.upload_file(
            file_data=file.read(),
            original_filename=title,
            course_id=course_id
        )

        return create_response({
            'message': 'Material uploaded successfully',
            'fileKey': file_key
        }, status_code=201)

    except Exception as e:
        print(f"Error uploading material: {e}")
        return create_response(error="Failed to upload material", status_code=500) 

@courses_bp.route('/<course_id>/files', methods=['GET'])
@teacher_required
def get_course_files(course_id):
    """Get all files uploaded for a course."""
    try:
        files = s3_service.list_course_files(course_id)
        return create_response({
            'files': files
        })
    except Exception as e:
        print(f"Error getting course files: {e}")
        return create_response(error="Failed to get course files", status_code=500) 

@courses_bp.route('/<course_id>/files/<path:file_key>', methods=['DELETE'])
@teacher_required
def delete_file(course_id, file_key):
    """Delete a course file."""
    try:
        # Verify the file belongs to this course
        if not file_key.startswith(f"courses/{course_id}/"):
            return create_response(error="Unauthorized access", status_code=403)

        s3_service.delete_file(file_key)
        return create_response({
            'message': 'File deleted successfully'
        })
    except Exception as e:
        print(f"Error deleting file: {e}")
        return create_response(error="Failed to delete file", status_code=500) 

@courses_bp.route('/<course_id>', methods=['PUT'])
@teacher_required
def update_course(course_id):
    try:
        data = request.json
        course = CourseService.update_course(course_id, data)
        return create_response({"course": course})
    except Exception as e:
        return create_response(error=str(e), status_code=500)

@courses_bp.route('/<course_id>/students', methods=['GET'])
@teacher_required
def get_course_students(course_id):
    try:
        students = CourseService.get_course_students(course_id)
        return create_response({"students": students})
    except Exception as e:
        return create_response(error=str(e), status_code=500)

@courses_bp.route('/<course_id>/students/<student_id>', methods=['DELETE'])
@teacher_required
def remove_student(course_id, student_id):
    try:
        CourseService.remove_student(course_id, student_id)
        return create_response({"message": "Student removed successfully"})
    except Exception as e:
        return create_response(error=str(e), status_code=500) 

@courses_bp.route('/<course_id>/code', methods=['GET'])
@teacher_required
def get_course_code(course_id):
    """Get course code for a specific course."""
    try:
        course = course_collection.find_one({"_id": ObjectId(course_id)})
        if not course:
            return create_response(error="Course not found", status_code=404)
        return create_response({"courseCode": course.get("courseCode")})
    except Exception as e:
        return create_response(error=str(e), status_code=500)

@courses_bp.route('/<course_id>/code/generate', methods=['POST'])
@teacher_required
def generate_course_code(course_id):
    """Generate a new course code."""
    try:
        new_code = CourseService.generate_course_code()
        course_collection.update_one(
            {"_id": ObjectId(course_id)},
            {"$set": {"courseCode": new_code}}
        )
        return create_response({"courseCode": new_code})
    except Exception as e:
        return create_response(error=str(e), status_code=500)

@courses_bp.route('/enroll', methods=['POST'])
def enroll_with_code():
    """Enroll in a course using a course code."""
    try:
        data = request.json
        course_code = data.get('courseCode')
        student_id = data.get('studentId')
        
        if not course_code or not student_id:
            return create_response(error="Course code and student ID required", status_code=400)

        course = CourseService.enroll_student_by_code(course_code, student_id)
        return create_response({"course": course})
    except ValueError as e:
        return create_response(error=str(e), status_code=400)
    except Exception as e:
        return create_response(error=str(e), status_code=500) 

@courses_bp.route('/student/<student_id>', methods=['GET'])
def get_student_courses(student_id):
    """Get all courses for a student."""
    try:
        print(f"Fetching courses for student: {student_id}")
        try:
            student_object_id = ObjectId(student_id)
        except Exception as e:
            print(f"Invalid student ID format: {student_id}")
            return create_response(error="Invalid student ID format", status_code=400)

        # Find all enrollments for this student
        enrollments = enrollment_collection.find({
            "studentId": student_object_id,
            "status": "active"
        })
        
        # Convert cursor to list to check if empty
        try:
            enrollments = list(enrollments)
            print(f"Found {len(enrollments)} enrollments")
        except Exception as e:
            print(f"Error converting enrollments to list: {str(e)}")
            return create_response(error="Error accessing enrollments", status_code=500)
        
        # Get course details for each enrollment
        courses = []
        for enrollment in enrollments:
            try:
                print(f"Processing enrollment: {enrollment}")
                course = course_collection.find_one({"_id": enrollment["courseId"]})
                print(f"Found course: {course}")
                if course:
                    # Get teacher info
                    teacher = teacher_collection.find_one({"_id": course["teacherId"]})
                    print(f"Found teacher: {teacher}")
                    if teacher:
                        course["teacher"] = {
                            "firstName": teacher["firstName"],
                            "lastName": teacher["lastName"]
                        }
                    courses.append(serialize_mongo_doc(course))
            except Exception as e:
                print(f"Error processing enrollment {enrollment}: {str(e)}")
                continue
        
        print(f"Returning {len(courses)} courses")
        return create_response({"courses": courses})
    except Exception as e:
        print(f"Error getting student courses: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return create_response(error=str(e), status_code=500) 