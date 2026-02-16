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

    def to_dict(self):
        return {
            "id": self.id,
            "room_id": self.room_id,
            "user_id": self.user_id,
            "check_in_date": self.check_in_date.isoformat() if self.check_in_date else None,
            "check_out_date": self.check_out_date.isoformat() if self.check_out_date else None,
            "total_price": self.total_price,
            "status": self.status,
            "guest_count": self.guest_count,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
