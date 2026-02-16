# app/routes/review_routes.py
from flask import Blueprint, request, jsonify
from ..extensions import db
from app.models.Review import Review
from app.models.Booking import Booking
from flask_jwt_extended import jwt_required, get_jwt_identity

review_bp = Blueprint("review_bp", __name__)

# ---------------- Ping ----------------
@review_bp.route("/ping")
def ping():
    return {"msg": "pong"}

# ---------------- GET all reviews ----------------
@review_bp.route("/", methods=["GET"])
def get_reviews():
    reviews = Review.query.all()
    return jsonify([r.to_dict() for r in reviews])

# ---------------- GET review by ID ----------------
@review_bp.route("/<string:id>", methods=["GET"])
def get_review(id):
    review = Review.query.get_or_404(id)
    return jsonify(review.to_dict())

# ---------------- CREATE review ----------------
@review_bp.route("/", methods=["POST"])
@jwt_required()
def create_review():
    current_user_id = get_jwt_identity()
    data = request.json

    # Vérifie que le booking existe
    from app.models.Booking import Booking
    booking = Booking.query.get(data["booking_id"])
    if not booking:
        return jsonify({"msg": "Booking not found"}), 404

    review = Review(
        user_id=current_user_id,
        booking_id=data["booking_id"],
        rating=data["rating"],
        comment=data.get("comment")
    )
    db.session.add(review)
    db.session.commit()
    return jsonify(review.to_dict()), 201


# ---------------- UPDATE review ----------------
@review_bp.route("/<string:id>", methods=["PUT"])
@jwt_required()
def update_review(id):
    current_user_id = get_jwt_identity()
    review = Review.query.get_or_404(id)

    # Vérifie que l'utilisateur est le propriétaire
    if review.user_id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    data = request.json
    if "rating" in data:
        review.rating = data["rating"]
    if "comment" in data:
        review.comment = data["comment"]

    db.session.commit()
    return jsonify(review.to_dict())

# ---------------- DELETE review ----------------
@review_bp.route("/<string:id>", methods=["DELETE"])
@jwt_required()
def delete_review(id):
    current_user_id = get_jwt_identity()
    review = Review.query.get_or_404(id)

    # Vérifie que l'utilisateur est le propriétaire
    if review.user_id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    db.session.delete(review)
    db.session.commit()
    return jsonify({"msg": "Deleted"})
