from flask import Blueprint, request, jsonify
from extensions import db
from models import Contacts

contacts_bp = Blueprint("contacts", __name__, url_prefix="/api/contacts")

REQUIRED_FIELDS = ["name", "phone", "email", "address"]


def _contact_to_dict(contact):
    return {
        "id": contact.id,
        "name": contact.name,
        "phone": contact.phone,
        "email": contact.email,
        "address": contact.address,
    }


@contacts_bp.route("/", methods=["GET"])
def list_contacts():
    contacts = Contacts.query.all()
    return jsonify({"contacts": [_contact_to_dict(c) for c in contacts]}), 200


@contacts_bp.route("/<int:contact_id>", methods=["GET"])
def get_contact(contact_id):
    contact = Contacts.query.get(contact_id)
    if not contact:
        return jsonify({"error": "Contact not found"}), 404
    return jsonify(_contact_to_dict(contact)), 200


@contacts_bp.route("/", methods=["POST"])
def create_contact():
    data = request.get_json(silent=True) or {}

    missing = [field for field in REQUIRED_FIELDS if not data.get(field)]
    if missing:
        return jsonify({"error": f"Missing required field(s): {', '.join(missing)}"}), 400

    contact = Contacts(
        name=data["name"],
        phone=data["phone"],
        email=data["email"],
        address=data["address"],
    )
    db.session.add(contact)
    db.session.commit()

    return jsonify(_contact_to_dict(contact)), 201


@contacts_bp.route("/<int:contact_id>", methods=["PATCH"])
def update_contact(contact_id):
    contact = Contacts.query.get(contact_id)
    if not contact:
        return jsonify({"error": "Contact not found"}), 404

    data = request.get_json(silent=True) or {}

    for field in REQUIRED_FIELDS:
        if field in data:
            setattr(contact, field, data[field])

    db.session.commit()

    return jsonify(_contact_to_dict(contact)), 200


@contacts_bp.route("/<int:contact_id>", methods=["DELETE"])
def delete_contact(contact_id):
    contact = Contacts.query.get(contact_id)
    if not contact:
        return jsonify({"error": "Contact not found"}), 404

    db.session.delete(contact)
    db.session.commit()

    return jsonify({"message": "Contact deleted"}), 200