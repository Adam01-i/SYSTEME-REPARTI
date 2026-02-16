from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Room
from flask_jwt_extended import jwt_required, get_jwt_identity

room_bp = Blueprint("room_bp", __name__)

@room_bp.route("/ping")
def ping():
    return {"msg": "pong"}

@room_bp.route("/", methods=["GET"])
def get_rooms():
    rooms = Room.query.all()
    return jsonify([room.to_dict() for room in rooms])

@room_bp.route("/<int:id>", methods=["GET"])
def get_room(id):
    room = Room.query.get_or_404(id)
    return jsonify(room.to_dict())

@room_bp.route("/", methods=["POST"])
@jwt_required()
def create_room():
    current_user = get_jwt_identity()
    if current_user["role"] != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    data = request.json
    room = Room(**data)
    db.session.add(room)
    db.session.commit()
    return jsonify(room.to_dict()), 201

@room_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_room(id):
    current_user = get_jwt_identity()
    if current_user["role"] != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    room = Room.query.get_or_404(id)
    for k, v in request.json.items():
        setattr(room, k, v)
    db.session.commit()
    return jsonify(room.to_dict())

@room_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_room(id):
    current_user = get_jwt_identity()
    if current_user["role"] != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    room = Room.query.get_or_404(id)
    db.session.delete(room)
    db.session.commit()
    return jsonify({"msg": "Deleted"})
