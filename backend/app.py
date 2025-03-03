from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.courses import courses_bp

def create_app():
    app = Flask(__name__)
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Origin"]
        }
    })

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(courses_bp, url_prefix='/api/courses')

    @app.route('/health')
    def health_check():
        return {"status": "healthy"}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5002) 