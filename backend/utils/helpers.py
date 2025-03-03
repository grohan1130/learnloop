from typing import Dict, Any, Tuple, Optional
from flask import jsonify
from bson import ObjectId

def create_response(
    data: Optional[Dict[str, Any]] = None, 
    error: Optional[str] = None, 
    status_code: int = 200
) -> Tuple[Dict[str, Any], int]:
    """Create a standardized JSON response.
    
    Args:
        data (Optional[Dict[str, Any]]): The data to return in the response
        error (Optional[str]): Error message if any
        status_code (int): HTTP status code
        
    Returns:
        tuple: (response_data, status_code)
            - response_data: Dict containing either data or error
            - status_code: HTTP status code
            
    Example:
        >>> response = create_response({"message": "Success"}, None, 200)
        >>> error_response = create_response(None, "Not found", 404)
    """
    if error:
        return jsonify({"error": error}), status_code
    return jsonify(data), status_code

def serialize_object_id(obj: Dict[str, Any]) -> Dict[str, Any]:
    """Convert MongoDB ObjectId to string in a dictionary.
    
    Args:
        obj (Dict[str, Any]): Dictionary containing MongoDB document data
        
    Returns:
        Dict[str, Any]: Dictionary with ObjectId converted to string
        
    Example:
        >>> doc = {"_id": ObjectId("507f1f77bcf86cd799439011"), "name": "Test"}
        >>> serialized = serialize_object_id(doc)
        >>> print(serialized)
        {"_id": "507f1f77bcf86cd799439011", "name": "Test"}
    """
    if '_id' in obj:
        obj['_id'] = str(obj['_id'])
    return obj 