from flask import Blueprint, request, jsonify
from ..extensions import db
from app.models.Room import Room
from app.models.User import User
from flask_jwt_extended import jwt_required, get_jwt_identity

room_bp = Blueprint("room_bp", __name__)

# 🔹 Ping pour tester la route
@room_bp.route("/ping")
def ping():
    return {"msg": "pong"}


# 🔹 Récupérer toutes les rooms
@room_bp.route("/", methods=["GET"])
def get_rooms():
    rooms = Room.query.all()
    return jsonify([room.to_dict() for room in rooms])


# 🔹 Récupérer une room par ID
@room_bp.route("/<string:id>", methods=["GET"])
def get_room(id):
    room = Room.query.get_or_404(id)
    return jsonify(room.to_dict())


# 🔹 Créer une nouvelle room (admin uniquement)
@room_bp.route("/", methods=["POST"])
@jwt_required()
def create_room():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    data = request.json
    room = Room(**data)
    db.session.add(room)
    db.session.commit()
    return jsonify(room.to_dict()), 201


# 🔹 Mettre à jour une room (admin uniquement)
@room_bp.route("/<string:id>", methods=["PUT"])
@jwt_required()
def update_room(id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    room = Room.query.get_or_404(id)
    for key, value in request.json.items():
        setattr(room, key, value)
    db.session.commit()
    return jsonify(room.to_dict())


# 🔹 Supprimer une room (admin uniquement)
@room_bp.route("/<string:id>", methods=["DELETE"])
@jwt_required()
def delete_room(id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    room = Room.query.get_or_404(id)
    db.session.delete(room)
    db.session.commit()
    return jsonify({"msg": "Deleted"})
