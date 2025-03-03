from typing import Dict, Any, List
from bson import ObjectId
from config.database import course_collection, teacher_collection
from utils.helpers import serialize_object_id

class CourseService:
    @staticmethod
    def create_course(course_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new course in the database.
        
        Args:
            course_data (Dict[str, Any]): Course information including:
                - courseName (str): Name of the course
                - department (str): Department offering the course
                - courseNumber (str): Course number/code
                - term (str): Academic term
                - year (str): Academic year
                - teacherId (str): ID of the teacher
                - institution (str): Institution name
                
        Returns:
            Dict[str, Any]: Dictionary containing the created course's ID
            
        Raises:
            ValueError: If required fields are missing
            Exception: If database operation fails
            
        Example:
            >>> course = CourseService.create_course({
            ...     "courseName": "Intro to Programming",
            ...     "department": "CS",
            ...     "courseNumber": "101",
            ...     "term": "Fall",
            ...     "year": "2024",
            ...     "teacherId": "123",
            ...     "institution": "University"
            ... })
        """
        try:
            # Validate required fields
            required_fields = ['courseName', 'department', 'courseNumber', 'term', 'year', 'teacherId', 'institution']
            for field in required_fields:
                if field not in course_data:
                    raise ValueError(f"Missing required field: {field}")
            
            # Convert teacherId to ObjectId
            try:
                course_data['teacherId'] = ObjectId(course_data['teacherId'])
            except Exception as e:
                raise ValueError(f"Invalid teacherId format: {course_data.get('teacherId', 'missing')}")

            result = course_collection.insert_one(course_data)
            return {"courseId": str(result.inserted_id)}
        except Exception as e:
            raise Exception(f"Failed to create course: {str(e)}")

    @staticmethod
    def get_teacher_courses(teacher_id: str) -> List[Dict[str, Any]]:
        """Get all courses taught by a specific teacher.
        
        Args:
            teacher_id (str): The ID of the teacher
            
        Returns:
            List[Dict[str, Any]]: List of courses taught by the teacher
            
        Example:
            >>> courses = CourseService.get_teacher_courses("507f1f77bcf86cd799439011")
        """
        try:
            print(f"Raw teacher_id received: {teacher_id}")
            
            # Clean up the ID - remove any truncation
            teacher_id = teacher_id.split('...')[0]
            
            try:
                teacher_object_id = ObjectId(teacher_id)
            except Exception as e:
                print(f"Failed to convert to ObjectId: {teacher_id}")
                return []  # Return empty list instead of raising error
            
            print(f"Querying with teacher_id: {teacher_object_id}")
            
            # Try to find courses
            courses = list(course_collection.find({"teacherId": teacher_object_id}))
            print(f"Found {len(courses)} courses for teacher")
            
            # Convert ObjectIds to strings in the response
            serialized_courses = []
            for course in courses:
                serialized_course = {
                    **course,
                    '_id': str(course['_id']),
                    'teacherId': str(course['teacherId'])
                }
                serialized_courses.append(serialized_course)
            
            return serialized_courses
            
        except Exception as e:
            print(f"Error in get_teacher_courses: {str(e)}")
            return []  # Return empty list on error

    @staticmethod
    def get_course(course_id: str) -> Dict[str, Any]:
        """Get a specific course by its ID.
        
        Args:
            course_id (str): The ID of the course to retrieve
            
        Returns:
            Dict[str, Any]: Course information if found, None otherwise
            
        Example:
            >>> course = CourseService.get_course("507f1f77bcf86cd799439011")
        """
        try:
            # Clean up the ID - remove any truncation
            course_id = course_id.split('...')[0]
            
            # Convert to ObjectId
            course_object_id = ObjectId(course_id)
            
            # Find the course
            course = course_collection.find_one({"_id": course_object_id})
            if not course:
                return None
            
            # Convert ObjectIds to strings in the response
            serialized_course = {
                **course,
                '_id': str(course['_id']),
                'teacherId': str(course['teacherId'])
            }
            
            print(f"Found course: {serialized_course}")
            return serialized_course
            
        except Exception as e:
            print(f"Error in get_course: {str(e)}")
            raise 

    @staticmethod
    def get_course_with_teacher(course_id: str) -> Dict[str, Any]:
        """Get a course and its teacher's information.
        
        Args:
            course_id (str): The ID of the course
            
        Returns:
            Dict[str, Any]: Course and teacher information if found, None otherwise
        """
        try:
            course_id = course_id.split('...')[0]
            course_object_id = ObjectId(course_id)
            
            # Get the course
            course = course_collection.find_one({"_id": course_object_id})
            if not course:
                return None
            
            # Get the teacher
            teacher = teacher_collection.find_one({"_id": course['teacherId']})
            if teacher:
                course['teacher'] = {
                    'firstName': teacher['firstName'],
                    'lastName': teacher['lastName']
                }
            
            # Convert ObjectIds to strings
            serialized_course = {
                **course,
                '_id': str(course['_id']),
                'teacherId': str(course['teacherId'])
            }
            
            return serialized_course
            
        except Exception as e:
            print(f"Error in get_course_with_teacher: {str(e)}")
            raise 