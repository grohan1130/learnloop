from functools import wraps
from flask import request, g
import json
from utils.helpers import create_response

def auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return create_response(error="No authorization provided", status_code=401)
            
        try:
            # Extract user data from token or session
            user_data = json.loads(auth_header)
            g.user = user_data
            return f(*args, **kwargs)
        except Exception as e:
            return create_response(error="Invalid authorization", status_code=401)
    return decorated_function 