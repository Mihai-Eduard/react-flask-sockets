import uuid

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_smorest import Blueprint, abort

from utils.db import db
from utils.schemas.room_schemas import RoomIDSchema
from models import User, Room, Message
from utils.schemas.room_schemas import RoomSchema, MessageTextSchema

blp = Blueprint("Rooms", "rooms", "Operations on rooms.")


@blp.get("/room/create")
@jwt_required()
@blp.response(200, RoomIDSchema)
def create_room():
    room_id = uuid.uuid4()
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    print(user)
    if not user:
        abort(404, message="User not found.")

    room = Room(id=str(room_id), owner_id=user_id)
    room.users.append(user)

    db.session.add(room)
    db.session.commit()

    return {"room_id": room_id}, 200


@blp.post("/room/join")
@blp.arguments(RoomIDSchema)
@jwt_required()
def join_room(data):
    room = Room.query.get_or_404(data["room_id"])
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if user not in room.users.all():
        room.users.append(user)

    db.session.add(room)
    db.session.commit()

    return {"room_id": data["room_id"]}, 200


@blp.get("/room/<string:room_id>")
@jwt_required()
@blp.response(200, RoomSchema)
def get_room(room_id):
    room = Room.query.get_or_404(room_id)
    return room, 200


@blp.post("/room/<string:room_id>/message")
@jwt_required()
@blp.arguments(MessageTextSchema)
def send_message(data, room_id):
    Room.query.get_or_404(room_id)
    user_id = get_jwt_identity()
    User.query.get_or_404(user_id)

    message = Message(text=data["text"], sender_id=user_id, room_id=room_id)
    db.session.add(message)
    db.session.commit()

    return {"message": "Message sent."}, 200
