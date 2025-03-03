from models.user import User
from database import db

class UserService:
    @staticmethod
    def get_user_profile(user_id):
        """Get user profile by ID."""
        try:
            user = User.query.get(user_id)
            if not user:
                raise ValueError("User not found")
            return user.to_dict()
        except Exception as e:
            raise Exception(f"Error getting user profile: {str(e)}")

    @staticmethod
    def update_user(user_id, user_data):
        """Update user profile."""
        try:
            user = User.query.get(user_id)
            if not user:
                raise ValueError("User not found")
            
            # Update allowed fields
            allowed_fields = ['firstName', 'lastName', 'email']
            for field in allowed_fields:
                if field in user_data:
                    setattr(user, field, user_data[field])
            
            db.session.commit()
            return user.to_dict()
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error updating user: {str(e)}")

    @staticmethod
    def update_password(user_id, new_password):
        """Update user password."""
        try:
            user = User.query.get(user_id)
            if not user:
                raise ValueError("User not found")
            
            user.set_password(new_password)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error updating password: {str(e)}") 