from flask import Blueprint

auth_bp = Blueprint("auth_bp", __name__)

# Exemple route
@auth_bp.route("/ping", methods=["GET"])
def ping():
    return {"message": "Auth route works"}
