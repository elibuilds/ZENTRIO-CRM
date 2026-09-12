import os
from flask import Flask
from contacts_backend.models import db
from contacts_backend.routes.contacts import contacts_bp
from dotenv import load_dotenv
from contacts_backend.config import DevelopmentConfig,ProductionConfig

load_dotenv()

config_map = {
    "develpoment":DevelopmentConfig,
    "production":ProductionConfig
}

def create_app(config_name="development"):

    app = Flask(__name__)

    app.config.from_object(config_map[config_name])

    db.init_app(app)

    app.register_blueprint(contacts_bp)

    with app.app_context():
        db.create_all()
        return app


