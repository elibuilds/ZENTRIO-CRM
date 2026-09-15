"""
models/deal.py
Shared Deal model + StageLog audit table used by both the pipeline
and leads/dashboard modules.
"""

from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Deal(db.Model):
    __tablename__ = "deals"

    id = db.Column(db.Integer, primary_key=True)
    contact_id = db.Column(db.Integer, db.ForeignKey("contacts.id"), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    value = db.Column(db.Numeric(10, 2), default=0)
    stage = db.Column(db.String(20), default="NEW", nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                            onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "contact_id": self.contact_id,
            "title": self.title,
            "value": float(self.value) if self.value is not None else 0,
            "stage": self.stage,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class StageLog(db.Model):
    __tablename__ = "stage_logs"

    id = db.Column(db.Integer, primary_key=True)
    deal_id = db.Column(db.Integer, db.ForeignKey("deals.id"), nullable=False)
    old_stage = db.Column(db.String(20), nullable=False)
    new_stage = db.Column(db.String(20), nullable=False)
    changed_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
