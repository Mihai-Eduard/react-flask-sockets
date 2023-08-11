import uuid

from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint

from utils.schemas import RoomID

blp = Blueprint("Rooms", "rooms", "Operations on rooms.")


@blp.get("/room/create")
@jwt_required()
def create_room():
    room_id = uuid.uuid4()
    return {"room_id": room_id}


@blp.post("/room/verify")
@blp.arguments(RoomID)
@jwt_required()
def create_room(data):
    room_id = data["room_id"]
    return {"room_id": room_id}
