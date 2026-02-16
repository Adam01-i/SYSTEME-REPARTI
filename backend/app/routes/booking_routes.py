from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Booking
from flask_jwt_extended import jwt_required, get_jwt_identity

booking_bp = Blueprint("booking_bp", __name__)

@booking_bp.route("/ping")
def ping():
    return {"msg": "pong"}

@booking_bp.route("/", methods=["GET"])
@jwt_required()
def get_bookings():
    current_user = get_jwt_identity()
    bookings = Booking.query.filter_by(user_id=current_user["id"]).all()
    return jsonify([b.to_dict() for b in bookings])

@booking_bp.route("/", methods=["POST"])
@jwt_required()
def create_booking():
    current_user = get_jwt_identity()
    data = request.json
    booking = Booking(user_id=current_user["id"], **data)
    db.session.add(booking)
    db.session.commit()
    return jsonify(booking.to_dict()), 201

@booking_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_booking(id):
    current_user = get_jwt_identity()
    booking = Booking.query.get_or_404(id)
    if booking.user_id != current_user["id"]:
        return jsonify({"msg": "Unauthorized"}), 403
    db.session.delete(booking)
    db.session.commit()
    return jsonify({"msg": "Deleted"})
