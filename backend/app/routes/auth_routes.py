from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from ..extensions import db
from app.models.User import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

auth_bp = Blueprint("auth_bp", __name__)

# ---------------- Register ----------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already exists"}), 400
    if not data.get("email") or not data.get("password") or not data.get("name"):
        return jsonify({"msg": "Name, email, and password are required"}), 400

    hashed = generate_password_hash(data["password"])
    user = User(
        name=data["name"],
        email=data["email"],
        password_hash=hashed,
        role=data.get("role", "user")
    )
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )

    return jsonify({
        "access_token": access_token,
        "user": {"id": user.id, "name": user.name, "role": user.role}
    }), 201    


# ---------------- Login ----------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    
    if not user or not user.check_password(data["password"]):
        return jsonify({"msg": "Bad email or password"}), 401

    # ✅ Identity doit être une string (ici l'UUID)
    # Role stocké dans additional_claims
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )

    return jsonify({
        "access_token": access_token,
        "user": {"id": user.id, "name": user.name, "role": user.role}
    })

# ---------------- Ping ----------------
@auth_bp.route("/ping", methods=["GET"])
def ping():
    return jsonify({"msg": "pong"})
