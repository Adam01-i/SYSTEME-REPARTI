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
    search = request.args.get("search", type=str)
    min_price = request.args.get("min_price", type=float)
    max_price = request.args.get("max_price", type=float)
    capacity = request.args.get("capacity", type=int)
    room_type = request.args.get("room_type", type=str)

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    query = Room.query

    # 🔎 Filtres dynamiques
    if search:
        query = query.filter(Room.name.ilike(f"%{search}%"))

    if min_price is not None:
        query = query.filter(Room.price_per_night >= min_price)

    if max_price is not None:
        query = query.filter(Room.price_per_night <= max_price)

    if capacity is not None:
        query = query.filter(Room.capacity >= capacity)

    if room_type:
        query = query.filter(Room.room_type == room_type)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "items": [room.to_dict() for room in pagination.items],
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages,
    })


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
