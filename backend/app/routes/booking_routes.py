from flask import Blueprint, request, jsonify
from ..extensions import db
from app.models.Booking import Booking

from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

booking_bp = Blueprint("booking_bp", __name__)

# ---------------- Ping ----------------
@booking_bp.route("/ping")
def ping():
    return {"msg": "pong"}

# ---------------- GET Bookings ----------------
@booking_bp.route("/", methods=["GET"])
@jwt_required()
def get_bookings():
    current_user_id = get_jwt_identity()  # UUID de l'utilisateur
    claims = get_jwt()
    role = claims.get("role")

    bookings = Booking.query.filter_by(user_id=current_user_id).all()
    return jsonify([b.to_dict() for b in bookings])

# ---------------- CREATE Booking ----------------
@booking_bp.route("/", methods=["POST"])
@jwt_required()
def create_booking():
    current_user_id = get_jwt_identity()
    data = request.json

    # Vérifie les champs obligatoires
    required_fields = ["room_id", "check_in_date", "check_out_date", "total_price", "guest_count"]
    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing field: {field}"}), 400

    booking = Booking(
        user_id=current_user_id,
        room_id=data["room_id"],
        check_in_date=data["check_in_date"],
        check_out_date=data["check_out_date"],
        total_price=data["total_price"],
        guest_count=data["guest_count"],
        status=data.get("status", "pending")
    )

    db.session.add(booking)
    db.session.commit()
    return jsonify(booking.to_dict()), 201

# ---------------- DELETE Booking ----------------
@booking_bp.route("/<string:id>", methods=["DELETE"])
@jwt_required()
def delete_booking(id):
    current_user_id = get_jwt_identity()
    booking = Booking.query.get_or_404(id)

    # Vérifie que l'utilisateur est bien le propriétaire
    if booking.user_id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    db.session.delete(booking)
    db.session.commit()
    return jsonify({"msg": "Deleted"})
