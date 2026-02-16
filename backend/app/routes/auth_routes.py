from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from ..extensions import db, jwt
from ..models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already exists"}), 400

    hashed = generate_password_hash(data["password"])
    user = User(
        name=data["name"],
        email=data["email"],
        password=hashed,
        role=data.get("role", "user")
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User created"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity={"id": user.id, "role": user.role})
    return jsonify({"access_token": access_token, "user": {"id": user.id, "name": user.name, "role": user.role}})
    
@auth_bp.route("/ping", methods=["GET"])
def ping():
    return jsonify({"msg": "pong"})
