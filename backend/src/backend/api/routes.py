"""
API Routes for MySafePass
Implements the API endpoints for frontend-backend communication.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from dotenv import load_dotenv
from ..database.connection import DatabaseManager
from ..database.models import VaultEntry
from ..auth.auth_service import AuthService

# Load environment variables
load_dotenv()

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    app.config['DATABASE_PATH'] = os.getenv('DATABASE_PATH', 'data/mysafepass.db')
    app.config['DATABASE_ENCRYPTION_KEY'] = os.getenv('DATABASE_ENCRYPTION_KEY', 'dev-encryption-key-32-chars-long')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', '3600'))
    
    # CORS configuration
    cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
    CORS(app, origins=cors_origins, supports_credentials=True)
    
    # Rate limiting
    limiter = Limiter(
        key_func=get_remote_address,
        default_limits=[os.getenv('RATE_LIMIT_DEFAULT', '100 per hour')],
        storage_uri="memory://"
    )
    limiter.init_app(app)
    
    # Initialize database and services
    db_manager = DatabaseManager(
        database_path=app.config['DATABASE_PATH'],
        encryption_key=app.config['DATABASE_ENCRYPTION_KEY']
    )
    
    auth_service = AuthService(db_manager)
    
    # Error handlers
    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify(error="Trop de requêtes. Veuillez réessayer plus tard."), 429
    
    @app.errorhandler(404)
    def not_found(e):
        return jsonify(error="Endpoint non trouvé"), 404
    
    @app.errorhandler(500)
    def internal_error(e):
        return jsonify(error="Erreur interne du serveur"), 500
    
    # Authentication routes
    @app.route('/api/auth/register', methods=['POST'])
    @limiter.limit(os.getenv('RATE_LIMIT_AUTH', '5 per minute'))
    def register():
        """Register a new user."""
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['username', 'email', 'password']
            for field in required_fields:
                if field not in data:
                    return jsonify({"success": False, "error": f"Champ {field} requis"}), 400
            
            # Validate email format
            import re
            if not re.match(r"[^@]+@[^@]+\.[^@]+", data['email']):
                return jsonify({"success": False, "error": "Format d'email invalide"}), 400
            
            # Register user
            result = auth_service.register_user(
                username=data['username'],
                email=data['email'],
                password=data['password']
            )
            
            if result['success']:
                return jsonify(result), 201
            else:
                return jsonify(result), 400
                
        except Exception as e:
            app.logger.error(f"Registration error: {str(e)}")
            return jsonify({"success": False, "error": "Erreur lors de l'enregistrement"}), 500

    @app.route('/api/auth/login', methods=['POST'])
    @limiter.limit(os.getenv('RATE_LIMIT_AUTH', '5 per minute'))
    def login():
        """Authenticate a user."""
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['username', 'password']
            for field in required_fields:
                if field not in data:
                    return jsonify({"success": False, "error": f"Champ {field} requis"}), 400
            
            # Authenticate user
            result = auth_service.authenticate_user(
                username=data['username'],
                password=data['password'],
                ip_address=request.remote_addr
            )
            
            if result['success']:
                return jsonify(result), 200
            else:
                return jsonify(result), 401
                
        except Exception as e:
            app.logger.error(f"Login error: {str(e)}")
            return jsonify({"success": False, "error": "Erreur lors de l'authentification"}), 500

    @app.route('/api/auth/change-password', methods=['POST'])
    def change_password():
        """Change user's master password."""
        try:
            # Verify JWT token (simplified for this example)
            # In a real implementation, you would use flask-jwt-extended
            
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['user_id', 'old_password', 'new_password']
            for field in required_fields:
                if field not in data:
                    return jsonify({"success": False, "error": f"Champ {field} requis"}), 400
            
            # Change password
            result = auth_service.change_password(
                user_id=data['user_id'],
                old_password=data['old_password'],
                new_password=data['new_password']
            )
            
            if result['success']:
                return jsonify(result), 200
            else:
                return jsonify(result), 400
                
        except Exception as e:
            app.logger.error(f"Password change error: {str(e)}")
            return jsonify({"success": False, "error": "Erreur lors de la modification du mot de passe"}), 500

    # Vault routes
    @app.route('/api/vault/entries', methods=['GET'])
    def get_entries():
        """Get all vault entries for the authenticated user."""
        try:
            # Verify authentication (simplified)
            user_id = request.args.get('user_id')
            if not user_id:
                return jsonify({"error": "Non authentifié"}), 401
            
            # Get user entries (simplified)
            with db_manager.get_session() as session:
                entries = session.query(VaultEntry).filter(
                    VaultEntry.user_id == user_id
                ).all()
                
                result = []
                for entry in entries:
                    result.append({
                        "id": entry.id,
                        "service": entry.service,  # This would be decrypted
                        "username": entry.username,  # This would be decrypted
                        "password_score": entry.password_score,
                        "category": entry.category,
                        "created_at": entry.created_at.isoformat()
                    })
                
                return jsonify({"entries": result}), 200
                
        except Exception as e:
            app.logger.error(f"Get entries error: {str(e)}")
            return jsonify({"error": "Erreur lors de la récupération des entrées"}), 500

    @app.route('/api/vault/entries', methods=['POST'])
    def add_entry():
        """Add a new vault entry."""
        try:
            # Verify authentication (simplified)
            user_id = request.args.get('user_id')
            if not user_id:
                return jsonify({"error": "Non authentifié"}), 401
            
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['service', 'username', 'password']
            for field in required_fields:
                if field not in data:
                    return jsonify({"success": False, "error": f"Champ {field} requis"}), 400
            
            # Encrypt entry data
            encryption_salt = auth_service.refresh_encryption_keys(user_id)
            if not encryption_salt['success']:
                return jsonify({"success": False, "error": "Erreur lors de la récupération des clés"}), 500
            
            # In a real implementation, you would:
            # 1. Derive encryption key from master password + salt
            # 2. Encrypt the entry data with AES-256-GCM
            # 3. Store the encrypted data in the database
            
            return jsonify({"success": True, "message": "Entrée ajoutée avec succès"}), 201
            
        except Exception as e:
            app.logger.error(f"Add entry error: {str(e)}")
            return jsonify({"error": "Erreur lors de l'ajout de l'entrée"}), 500

    # Utility routes
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint."""
        try:
            # Test database connection
            is_db_connected = db_manager.test_connection()
            
            return jsonify({
                "status": "healthy",
                "database": "connected" if is_db_connected else "disconnected"
            }), 200
            
        except Exception as e:
            return jsonify({
                "status": "unhealthy",
                "error": str(e)
            }), 503

    @app.route('/api/version', methods=['GET'])
    def version():
        """Get API version."""
        return jsonify({
            "version": "1.0.0",
            "name": "MySafePass Backend"
        }), 200

    return app
