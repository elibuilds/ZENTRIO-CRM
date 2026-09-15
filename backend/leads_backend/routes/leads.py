"""
leads.py
Bismark's part: Lead/deal creation, editing, deletion, and listing.
"""

from datetime import datetime, timezone
from flask import Blueprint, request, jsonify

from ..deals import db, Deal

leads_bp = Blueprint("leads", __name__)


@leads_bp.route("/leads", methods=["POST"])
def create_lead():
    """Create a new lead/deal."""
    data = request.get_json(silent=True) or {}

    title = data.get("title")
    contact_id = data.get("contact_id")
    value = data.get("value", 0)

    if not title or not contact_id:
        return jsonify({"error": "'title' and 'contact_id' are required"}), 400

    lead = Deal(
        title=title,
        contact_id=contact_id,
        value=value,
        stage="NEW",
    )

    db.session.add(lead)
    db.session.commit()

    return jsonify(lead.to_dict()), 201


@leads_bp.route("/leads/<int:deal_id>", methods=["PATCH"])
def update_lead_details(deal_id):
    """Update editable fields on a lead (title, value, contact_id)."""
    lead = Deal.query.get(deal_id)
    if not lead:
        return jsonify({"error": "Lead not found"}), 404

    data = request.get_json(silent=True) or {}

    if "title" in data:
        lead.title = data["title"]
    if "value" in data:
        lead.value = data["value"]
    if "contact_id" in data:
        lead.contact_id = data["contact_id"]

    lead.updated_at = datetime.now(timezone.utc)

    db.session.commit()

    return jsonify(lead.to_dict()), 200


@leads_bp.route("/leads/<int:deal_id>", methods=["DELETE"])
def delete_lead(deal_id):
    """Delete a lead/deal."""
    lead = Deal.query.get(deal_id)
    if not lead:
        return jsonify({"error": "Lead not found"}), 404

    db.session.delete(lead)
    db.session.commit()

    return jsonify({"message": "Lead deleted"}), 200


@leads_bp.route("/leads", methods=["GET"])
def list_leads():
    """List leads, with optional filters: contact_id, min_value, max_value."""
    query = Deal.query

    contact_id = request.args.get("contact_id", type=int)
    min_value = request.args.get("min_value", type=float)
    max_value = request.args.get("max_value", type=float)

    if contact_id is not None:
        query = query.filter(Deal.contact_id == contact_id)
    if min_value is not None:
        query = query.filter(Deal.value >= min_value)
    if max_value is not None:
        query = query.filter(Deal.value <= max_value)

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)

    paginated = query.order_by(Deal.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        "leads": [lead.to_dict() for lead in paginated.items],
        "page": page,
        "per_page": per_page,
        "total": paginated.total,
    }), 200
