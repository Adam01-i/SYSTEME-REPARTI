from flask import Blueprint

booking_bp = Blueprint("booking_bp", __name__)

@booking_bp.route("/ping", methods=["GET"])
def ping():
    return {"message": "Booking route works"}
