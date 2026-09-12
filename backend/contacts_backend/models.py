from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String


db = SQLAlchemy()


class Contacts(db.Model):
    id = db.Column(db.Integer, primary_key  = True)
    name = db.Column(db. String(120), nullable = False)
    phone = db.Column(db.String(20), nullable = False)
    email = db.Column(db.String(120), nullable = False)
    address = db.Column(db.String(200), nullable = False)
