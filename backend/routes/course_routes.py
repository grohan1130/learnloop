from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models.course import Course
import json

@course_routes.route('/<course_id>', methods=['GET'])
@jwt_required()
def get_course(course_id):
    try:
        # Get current user from token
        current_user = request.headers.get('Authorization')
        if not current_user:
            return jsonify({'error': 'No authorization header'}), 401
            
        user_data = json.loads(current_user)
        current_user_id = user_data.get('_id') or user_data.get('userId')
        user_role = user_data.get('role')
        
        # Find the course
        course = Course.objects(id=course_id).first()
        if not course:
            return jsonify({'error': 'Course not found'}), 404

        # Check permissions based on role
        if user_role == 'teacher':
            if str(course.teacher.id) == str(current_user_id):
                return jsonify(course.to_json()), 200
            else:
                return jsonify({'error': 'Not authorized to view this course'}), 403
        else:  # student role
            if current_user_id in [str(student.id) for student in course.students]:
                return jsonify(course.to_json()), 200
            else:
                return jsonify({'error': 'You are not enrolled in this course'}), 403
            
    except Exception as e:
        print(f"Error in get_course: {str(e)}")
        return jsonify({'error': str(e)}), 500

@course_routes.route('/<course_id>/teacher', methods=['GET'])
@jwt_required()
def get_teacher_course(course_id):
    try:
        # Get current user from token
        current_user = request.headers.get('Authorization')
        if not current_user:
            return jsonify({'error': 'No authorization header'}), 401
            
        user_data = json.loads(current_user)
        current_user_id = user_data.get('_id') or user_data.get('userId')
        
        # Find the course
        course = Course.objects(id=course_id).first()
        if not course:
            return jsonify({'error': 'Course not found'}), 404
            
        # Verify teacher owns this course
        if str(course.teacher.id) != str(current_user_id):
            return jsonify({'error': 'Not authorized to view this course'}), 403
            
        # Return full course data for teacher
        return jsonify(course.to_json()), 200
            
    except Exception as e:
        print(f"Error in get_teacher_course: {str(e)}")
        return jsonify({'error': str(e)}), 500 