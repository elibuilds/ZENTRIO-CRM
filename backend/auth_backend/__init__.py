import os
from pathlib import Path
from flask import Flask
from flask import abort, send_from_directory
from flask_login import LoginManager
from dotenv import load_dotenv
from sqlalchemy import inspect, text

from auth_backend.models import db, bcrypt, User
from auth_backend.config import DevelopmentConfig, ProductionConfig
from auth_backend.routes.auth import auth_bp

load_dotenv()

config_map = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}

login_manager = LoginManager()

FRONTEND_DIST = Path(__file__).resolve().parents[2] / "frontend" / "dist"
USER_ROLES = ("level 1", "level 2", "admin")


def create_app(config_name="development"):
    app = Flask(__name__, static_folder=None)

    app.config.from_object(config_map[config_name])

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "login"

    app.register_blueprint(auth_bp)

    with app.app_context():
        if inspect(db.engine).has_table("user"):
            columns = {column["name"] for column in inspect(db.engine).get_columns("user")}
            if "role" not in columns:
                db.session.execute(
                    text("ALTER TABLE user ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'level 1'")
                )
                db.session.commit()
        db.create_all()

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        if path.startswith("auth"):
            abort(404)

        requested_file = FRONTEND_DIST / path
        if path and requested_file.is_file():
            return send_from_directory(str(FRONTEND_DIST), path)

        index_file = FRONTEND_DIST / "index.html"
        if index_file.is_file():
            return send_from_directory(str(FRONTEND_DIST), "index.html")

        abort(404)

    return app


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@login_manager.unauthorized_handler
def unauthorized():
    return {"error": "Login required."}, 401
