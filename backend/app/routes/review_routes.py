from flask import Blueprint

review_bp = Blueprint("review_bp", __name__)

@review_bp.route("/ping", methods=["GET"])
def ping():
    return {"message": "Review route works"}
