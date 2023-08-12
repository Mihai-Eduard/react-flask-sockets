import uuid
from datetime import datetime
from threading import Thread

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_smorest import Blueprint, abort
from routes.sockets.room import (
    send_room_updates,
    activate_room_handler,
    send_room_finisher,
)

from utils.db import db
from utils.schemas.room_schemas import RoomIDSchema
from models import User, Room, Message
from utils.schemas.room_schemas import RoomSchema, MessageTextSchema
from utils.active_rooms import ACTIVE_ROOMS

blp = Blueprint("Rooms", "rooms", "Operations on rooms.")

TOTAL_POINTS_PER_ROUND = 10
TOTAL_TIME_PER_ROUND = 15


@blp.get("/room/create")
@jwt_required()
@blp.response(200, RoomIDSchema)
def create_room():
    room_id = uuid.uuid4()
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if not user:
        abort(404, message="User not found.")

    room = Room(id=str(room_id), owner_id=user_id)
    room.users.append(user)
    message = Message(
        text=f"* @{user.username} created the room *",
        sender_id=user_id,
        room_id=str(room_id),
        is_join_or_create_room=1,
    )

    db.session.add(room)
    db.session.add(message)
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
        message = Message(
            text=f"* @{user.username} joined the room *",
            sender_id=user_id,
            room_id=room.id,
            is_join_or_create_room=1,
        )

        db.session.add(room)
        db.session.add(message)
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

    Thread(
        target=activate_room_handler,
        args=(room_id, TOTAL_POINTS_PER_ROUND, TOTAL_TIME_PER_ROUND),
    ).start()
    return {"message": "Room started.", "room_id": room_id}, 200


@blp.get("/room/<string:room_id>/click/<string:point_id>")
@jwt_required()
def click_point(room_id, point_id):
    Room.query.get_or_404(room_id)
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    try:
        if room_id not in ACTIVE_ROOMS:
            raise ValueError("This room is not active.")

        if point_id not in ACTIVE_ROOMS[room_id]["points"]:
            raise ValueError("This point is not part of this active room.")

        if user_id in ACTIVE_ROOMS[room_id]["points"][point_id]:
            raise ValueError("You have already clicked this point.")

        ACTIVE_ROOMS[room_id]["points"][point_id][user_id] = datetime.now().timestamp()
        if user_id not in ACTIVE_ROOMS[room_id]["users"]:
            ACTIVE_ROOMS[room_id]["users"][user_id] = {}
        ACTIVE_ROOMS[room_id]["users"][user_id][point_id] = datetime.now().timestamp()

        if (
            len(ACTIVE_ROOMS[room_id]["users"][user_id].keys())
            == TOTAL_POINTS_PER_ROUND
        ):
            Thread(
                target=send_room_finisher,
                args=(
                    room_id,
                    user_id,
                    user.username,
                    ACTIVE_ROOMS[room_id]["users"][user_id][point_id]
                    - ACTIVE_ROOMS[room_id]["start_time"],
                ),
            ).start()
        return {
            "message": f"You have successfully clicked the point with the id {point_id}"
        }, 200

    except Exception as err:
        print(err)
        if isinstance(err, ValueError):
            abort(400, message=str(err))
        abort(500, message="Something went wrong.")
