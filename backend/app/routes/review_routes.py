from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Review
from flask_jwt_extended import jwt_required, get_jwt_identity

review_bp = Blueprint("review_bp", __name__)

@review_bp.route("/ping")
def ping():
    return {"msg": "pong"}

@review_bp.route("/", methods=["GET"])
def get_reviews():
    reviews = Review.query.all()
    return jsonify([r.to_dict() for r in reviews])

@review_bp.route("/", methods=["POST"])
@jwt_required()
def create_review():
    current_user = get_jwt_identity()
    data = request.json
    review = Review(user_id=current_user["id"], **data)
    db.session.add(review)
    db.session.commit()
    return jsonify(review.to_dict()), 201
