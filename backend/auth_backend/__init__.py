import os
from flask import Flask
from flask_login import LoginManager
from dotenv import load_dotenv

from auth_backend.models import db, bcrypt, User
from auth_backend.config import DevelopmentConfig, ProductionConfig
from auth_backend.routes.auth import auth_bp

load_dotenv()

config_map = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}

login_manager = LoginManager()


def create_app(config_name="development"):
    app = Flask(__name__)

    app.config.from_object(config_map[config_name])

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "login"

    app.register_blueprint(auth_bp)

    with app.app_context():
        db.create_all()

    return app


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@login_manager.unauthorized_handler
def unauthorized():
    return {"error": "Login required."}, 401
