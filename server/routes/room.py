import uuid
from datetime import datetime
from random import random
from threading import Thread, Timer

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_smorest import Blueprint, abort

from utils.db import db
from utils.schemas.room_schemas import RoomIDSchema
from models import User, Room, Message
from utils.schemas.room_schemas import RoomSchema, MessageTextSchema
from utils.socketio import socketio
from utils.active_rooms import ACTIVE_ROOMS

blp = Blueprint("Rooms", "rooms", "Operations on rooms.")

TOTAL_POINTS_PER_ROUND = 1


def send_room_updates(room_id, room):
    socketio.emit(f"room/{room_id}/messages", room)


def send_game_info(room_id, index):
    if index == TOTAL_POINTS_PER_ROUND:
        return
    x = random() * 100
    y = random() * 100
    point_id = uuid.uuid4()
    ACTIVE_ROOMS[room_id]["points"][str(point_id)] = {}

    socketio.emit(f"room/{room_id}/game", {"x": x, "y": y, "id": str(point_id)})

    interval_thread = Timer(0.3, send_game_info, args=(room_id, index + 1))
    interval_thread.daemon = True
    interval_thread.start()


def deactivate_room(room_id):
    del ACTIVE_ROOMS[room_id]


def send_room_activate(room_id):
    socketio.emit(
        f"room/{room_id}/activate", {"message": "Room started.", "room_id": room_id}
    )
    ACTIVE_ROOMS[room_id] = {}
    ACTIVE_ROOMS[room_id]["users"] = {}
    ACTIVE_ROOMS[room_id]["points"] = {}

    time_expired_thread = Timer(30, deactivate_room, args=(room_id,))
    time_expired_thread.daemon = True
    time_expired_thread.start()

    send_points_thread = Timer(0.3, send_game_info, args=(room_id, 0))
    send_points_thread.daemon = True
    send_points_thread.start()


def send_room_finisher(room_id, user_id, username, score):
    socketio.emit(
        f"room/{room_id}/finish",
        {
            "message": "Room finished.",
            "room_id": room_id,
            "user_id": user_id,
            "username": username,
            "score": score,
        },
    )


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

    room_schema = RoomSchema()
    room = room_schema.dump(room)
    Thread(target=send_room_updates, args=(data["room_id"], room)).start()

    return {"room_id": data["room_id"]}, 200


@blp.get("/room/<string:room_id>")
@jwt_required()
@blp.response(200, RoomSchema)
def get_room(room_id):
    room = Room.query.get_or_404(room_id)
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    if user not in room.users.all():
        room.users.append(user)

        db.session.add(room)
        db.session.commit()

        room_schema = RoomSchema()
        room_json = room_schema.dump(room)
        Thread(target=send_room_updates, args=(room.id, room_json)).start()

    return room, 200


@blp.post("/room/<string:room_id>/message")
@jwt_required()
@blp.arguments(MessageTextSchema)
def send_message(data, room_id):
    room = Room.query.get_or_404(room_id)
    user_id = get_jwt_identity()
    User.query.get_or_404(user_id)

    message = Message(text=data["text"], sender_id=user_id, room_id=room_id)
    db.session.add(message)
    db.session.commit()

    room_schema = RoomSchema()
    room = room_schema.dump(room)
    Thread(target=send_room_updates, args=(room_id, room)).start()

    return {"message": "Message sent."}, 200


@blp.get("/room/<string:room_id>/start")
@jwt_required()
def start_room(room_id):
    room = Room.query.get_or_404(room_id)
    user_id = get_jwt_identity()
    User.query.get_or_404(user_id)

    if room.owner_id != user_id:
        abort(403, message="You are not the owner of this room.")

    if room_id in ACTIVE_ROOMS:
        abort(400, message="This room is already active.")

    Thread(target=send_room_activate, args=(room_id,)).start()

    return {"message": "Room started.", "room_id": room_id}, 200


@blp.get("/room/<string:room_id>/click/<string:point_id>")
@jwt_required()
def click_point(room_id, point_id):
    Room.query.get_or_404(room_id)
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    if room_id not in ACTIVE_ROOMS:
        abort(400, message="This room is not active.")

    if point_id not in ACTIVE_ROOMS[room_id]["points"]:
        abort(400, message="This point is not part of this active room.")

    if user_id in ACTIVE_ROOMS[room_id]["points"][point_id]:
        abort(400, message="You have already clicked this point.")

    ACTIVE_ROOMS[room_id]["points"][point_id][user_id] = datetime.now().timestamp()
    if user_id not in ACTIVE_ROOMS[room_id]["users"]:
        ACTIVE_ROOMS[room_id]["users"][user_id] = {}
    ACTIVE_ROOMS[room_id]["users"][user_id][point_id] = datetime.now().timestamp()

    if len(ACTIVE_ROOMS[room_id]["users"][user_id].keys()) == TOTAL_POINTS_PER_ROUND:
        Thread(target=send_room_finisher, args=(room_id, user_id, user.username, 10)).start()

    return {
        "message": f"You have successfully clicked the point with the id {point_id}"
    }, 200
