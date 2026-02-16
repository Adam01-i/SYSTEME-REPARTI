import uuid
from datetime import datetime
from app.extensions import db

class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))

    room_id = db.Column(db.String, db.ForeignKey("rooms.id"), nullable=False)
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)

    check_in_date = db.Column(db.Date, nullable=False)
    check_out_date = db.Column(db.Date, nullable=False)

    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="pending")

    guest_count = db.Column(db.Integer, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    room = db.relationship("Room", backref="bookings")
    user = db.relationship("User", backref="bookings")
