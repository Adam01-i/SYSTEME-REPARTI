import uuid
from datetime import datetime
from app.extensions import db

class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))

    booking_id = db.Column(db.String, db.ForeignKey("bookings.id"), nullable=False)
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)

    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    booking = db.relationship("Booking", backref="review")
    user = db.relationship("User", backref="reviews")
