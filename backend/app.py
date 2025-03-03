from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.courses import courses_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(courses_bp, url_prefix='/api/courses')

@app.route('/api/health', methods=['GET'])
def health_check():
    return {"status": "healthy"}, 200

if __name__ == '__main__':
    app.run(debug=True, port=5002) 