import bcrypt
from typing import Dict, Any, Optional, Tuple
from bson import ObjectId
from bson.objectid import ObjectId
from config.database import teacher_collection, student_collection
from utils.helpers import serialize_object_id

class AuthService:
    @staticmethod
    def hash_password(password: str) -> bytes:
        """Hash a password using bcrypt.
        
        Args:
            password (str): The plain text password to hash
            
        Returns:
            bytes: The hashed password
            
        Example:
            >>> hashed = AuthService.hash_password("mypassword123!")
        """
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    @staticmethod
    def check_password(password: str, hashed: bytes) -> bool:
        """Verify a password against its hash.
        
        Args:
            password (str): The plain text password to verify
            hashed (bytes): The hashed password to check against
            
        Returns:
            bool: True if password matches, False otherwise
            
        Example:
            >>> is_valid = AuthService.check_password("mypassword123!", hashed_password)
        """
        try:
            return bcrypt.checkpw(password.encode('utf-8'), hashed)
        except Exception as e:
            print(f"Error checking password: {str(e)}")
            return False

    @staticmethod
    def get_user_by_username(username: str, role: str) -> Optional[Dict[str, Any]]:
        """Retrieve a user by their username and role.
        
        Args:
            username (str): The username to search for
            role (str): The role of the user ('teacher' or 'student')
            
        Returns:
            Optional[Dict[str, Any]]: User data if found, None otherwise
            
        Raises:
            Exception: If database operation fails
            
        Example:
            >>> user = AuthService.get_user_by_username("johndoe", "teacher")
        """
        try:
            collection = teacher_collection if role == 'teacher' else student_collection
            user = collection.find_one({"username": username})
            if user:
                # Keep the original password hash for verification
                password_hash = user['password']
                
                # Create a clean user object without password
                user_without_password = {k: v for k, v in user.items() if k != 'password'}
                
                # Add string versions of IDs
                serialized_user = {
                    **user_without_password,
                    '_id': str(user['_id']),
                    'userId': str(user['_id'])
                }
                
                # Add back the password hash for verification
                serialized_user['password'] = password_hash
                
                print(f"Found user: {username}, role: {role}")
                return serialized_user
            return None
        except Exception as e:
            print(f"Error in get_user_by_username: {str(e)}")
            raise

    @staticmethod
    def create_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user in the database.
        
        Args:
            user_data (Dict[str, Any]): User information including:
                - username (str): User's username
                - password (str): User's plain text password
                - role (str): User's role ('teacher' or 'student')
                - firstName (str): User's first name
                - lastName (str): User's last name
                - institution (str): User's institution
                
        Returns:
            Dict[str, Any]: Dictionary containing the created user's ID
            
        Raises:
            Exception: If database operation fails
            
        Example:
            >>> user = AuthService.create_user({
            ...     "username": "johndoe",
            ...     "password": "password123!",
            ...     "role": "teacher",
            ...     "firstName": "John",
            ...     "lastName": "Doe",
            ...     "institution": "University"
            ... }) 
        """
        collection = teacher_collection if user_data['role'] == 'teacher' else student_collection
        user_data['password'] = AuthService.hash_password(user_data['password'])
        result = collection.insert_one(user_data)
        return {"userId": str(result.inserted_id)}

    @staticmethod
    def register_teacher(data: Dict[str, Any]) -> Dict[str, Any]:
        """Register a new teacher."""
        try:
            # Add institution to required fields
            required_fields = ['email', 'password', 'firstName', 'lastName', 'institution']
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Missing required field: {field}")

            # Hash the password
            hashed_password = AuthService.hash_password(data['password'])

            teacher_data = {
                'email': data['email'],
                'password': hashed_password,
                'firstName': data['firstName'],
                'lastName': data['lastName'],
                'institution': data['institution'],
                'role': 'teacher'
            }
            
            result = teacher_collection.insert_one(teacher_data)
            teacher_data['_id'] = str(result.inserted_id)
            del teacher_data['password']
            return teacher_data
            
        except ValueError as e:
            print(f"Validation error in register_teacher: {str(e)}")
            raise
        except Exception as e:
            print(f"Error in register_teacher: {str(e)}")
            raise

    @staticmethod
    def register_student(data: Dict[str, Any]) -> Dict[str, Any]:
        """Register a new student."""
        try:
            # Add institution to required fields
            required_fields = ['email', 'password', 'firstName', 'lastName', 'institution']
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Missing required field: {field}")

            # Hash the password
            hashed_password = AuthService.hash_password(data['password'])

            student_data = {
                'email': data['email'],
                'password': hashed_password,
                'firstName': data['firstName'],
                'lastName': data['lastName'],
                'institution': data['institution'],
                'role': 'student'
            }
            
            result = student_collection.insert_one(student_data)
            student_data['_id'] = str(result.inserted_id)
            del student_data['password']
            return student_data
            
        except ValueError as e:
            print(f"Validation error in register_student: {str(e)}")
            raise
        except Exception as e:
            print(f"Error in register_student: {str(e)}")
            raise 