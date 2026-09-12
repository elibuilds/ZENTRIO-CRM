import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///leads_backend.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
