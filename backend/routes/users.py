from flask import Blueprint, request, g
from utils.helpers import create_response
from services.user_service import UserService
from functools import wraps
from backend.decorators import auth_required

users_bp = Blueprint('users', __name__)

@users_bp.route('/<user_id>', methods=['GET'])
@auth_required  # Add authentication requirement
def get_user_profile(user_id):
    """Get user profile."""
    try:
        # Verify user is accessing their own profile or is a teacher
        if g.user['_id'] != user_id and g.user['role'] != 'teacher':
            return create_response(error="Unauthorized access", status_code=403)

        user = UserService.get_user_profile(user_id)
        return create_response({"user": user})
    except ValueError as e:
        return create_response(error=str(e), status_code=404)
    except Exception as e:
        return create_response(error=str(e), status_code=500)

@users_bp.route('/<user_id>', methods=['PUT'])
@auth_required
def update_profile(user_id):
    """Update user profile."""
    try:
        # Verify user is updating their own profile
        if g.user['_id'] != user_id:
            return create_response(error="Unauthorized access", status_code=403)

        data = request.json
        user = UserService.update_user(user_id, data)
        return create_response({"user": user})
    except ValueError as e:
        return create_response(error=str(e), status_code=404)
    except Exception as e:
        return create_response(error=str(e), status_code=500)

@users_bp.route('/<user_id>/password', methods=['PUT'])
@auth_required
def change_password(user_id):
    """Change user password."""
    try:
        # Verify user is changing their own password
        if g.user['_id'] != user_id:
            return create_response(error="Unauthorized access", status_code=403)

        data = request.json
        if 'password' not in data:
            return create_response(error="Password is required", status_code=400)

        UserService.update_password(user_id, data['password'])
        return create_response({"message": "Password updated successfully"})
    except ValueError as e:
        return create_response(error=str(e), status_code=404)
    except Exception as e:
        return create_response(error=str(e), status_code=500) 