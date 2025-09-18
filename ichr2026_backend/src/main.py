import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
from src.models.user import db
from src.models.conference import Registration, PaperSubmission, ContactMessage, ConferenceSettings, AdminUser
from src.routes.user import user_bp
from src.routes.registration import registration_bp
from src.routes.papers import papers_bp
from src.routes.contact import contact_bp
from src.routes.admin import admin_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'ichr2026_conference_secret_key_2025'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'ichr2026_jwt_secret_key_2025'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
jwt = JWTManager(app)

# Enable CORS for frontend integration
CORS(app, origins=['http://localhost:3000', 'http://localhost:5173'], supports_credentials=True)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(registration_bp, url_prefix='/api')
app.register_blueprint(papers_bp, url_prefix='/api')
app.register_blueprint(contact_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')

# uncomment if you need to use database
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()
    
    # Create default admin user if not exists
    admin = AdminUser.query.filter_by(username='admin').first()
    if not admin:
        from werkzeug.security import generate_password_hash
        default_admin = AdminUser(
            username='admin',
            email='admin@ichr2026.org',
            password_hash=generate_password_hash('admin123'),
            role='admin'
        )
        db.session.add(default_admin)
        db.session.commit()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)