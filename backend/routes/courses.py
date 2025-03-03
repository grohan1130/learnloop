from flask import Blueprint, request, g
from services.course_service import CourseService
from utils.helpers import create_response
from typing import Tuple, Dict, Any
import json
from functools import wraps

courses_bp = Blueprint('courses', __name__)

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