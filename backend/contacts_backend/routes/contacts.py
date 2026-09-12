from flask import Blueprint, request
from contacts_backend.models import Contacts,db


contacts_bp = Blueprint("contacts", __name__, url_prefix="/api/contacts")

@contacts_bp.route("/", methods=["GET"])
def list_contacts():
    return {"contacts": [c.name for c in Contacts.query.all()]}


@contacts_bp.route("/", methods=["POST"])
def create_contact():
    data = request.get_json()
    contact = Contacts(name=data["name"], phone=data["phone"], email=data["email"], address=data["address"])
    db.session.add(contact)
    db.session.commit()
    return {"id": contact.id}, 201
