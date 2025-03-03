from flask import Blueprint, request
from services.auth_service import AuthService
from utils.helpers import create_response
from typing import Tuple, Dict, Any

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register() -> Tuple[Dict[str, Any], int]:
    """Handle user registration.
    
    Expected JSON payload:
        {
            "username": str,
            "password": str,
            "role": str,
            "firstName": str,
            "lastName": str,
            "institution": str
        }
    
    Returns:
        tuple: (response_data, status_code)
            - response_data: Dict containing success message and user ID
            - status_code: HTTP status code
            
    Raises:
        400: If username already exists
        500: If registration fails
    """
    try:
        data = request.json
        # Check existing user
        if AuthService.get_user_by_username(data['username'], data['role']):
            return create_response(error="Username already exists", status_code=400)
        
        result = AuthService.create_user(data)
        return create_response({
            "message": f"Registration successful as {data['role']}",
            "userId": result['userId']
        }, status_code=201)
    except Exception as e:
        return create_response(error=str(e), status_code=500)

@auth_bp.route('/login', methods=['POST'])
def login() -> Tuple[Dict[str, Any], int]:
    """Handle user login."""
    try:
        data = request.json
        if not data:
            return create_response(error="No data provided", status_code=400)

        required_fields = ['username', 'password', 'role']
        for field in required_fields:
            if field not in data:
                return create_response(error=f"Missing {field}", status_code=400)

        username = data['username']
        password = data['password']
        role = data['role']

        # Get user from database
        user = AuthService.get_user_by_username(username, role)
        if not user:
            return create_response(error="Invalid username or role", status_code=401)

        # Verify password
        if not AuthService.check_password(password, user['password']):
            return create_response(error="Invalid password", status_code=401)

        # Remove password from response
        del user['password']
        
        return create_response(user)

    except Exception as e:
        print(f"Login error: {str(e)}")
        return create_response(error="Login failed", status_code=500) 