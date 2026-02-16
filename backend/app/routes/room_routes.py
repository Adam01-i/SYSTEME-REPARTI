from flask import Blueprint

room_bp = Blueprint("room_bp", __name__)

@room_bp.route("/ping", methods=["GET"])
def ping():
    return {"message": "Room route works"}
