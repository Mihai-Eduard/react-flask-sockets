import uuid
from datetime import datetime
from random import random
from threading import Timer, Thread

from utils.socketio import socketio
from utils.active_rooms import ACTIVE_ROOMS


def send_room_updates(room_id, room):
    socketio.emit(f"room/{room_id}/messages", room)


def send_room_activate(room_id, total_time):
    socketio.emit(
        f"room/{room_id}/activate",
        {"message": "Room started.", "room_id": room_id, "total_time": total_time},
    )


def send_game_info(room_id, point):
    socketio.emit(
        f"room/{room_id}/game",
        {
            "x": point["x"],
            "y": point["y"],
            "id": str(point["id"]),
            "index": point["index"],
        },
    )


def send_game_timer(room_id, time):
    socketio.emit(f"room/{room_id}/timer", {"time": time})


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


def activate_room_handler(room_id, total_points, total_time):
    send_room_activate(room_id, total_time)
    ACTIVE_ROOMS[room_id] = {}
    ACTIVE_ROOMS[room_id]["users"] = {}
    ACTIVE_ROOMS[room_id]["points"] = {}

    Timer(1.5, start_room_handler, args=(room_id, total_points, total_time)).start()


def start_room_handler(room_id, total_points, total_time):
    ACTIVE_ROOMS[room_id]["start_time"] = datetime.now().timestamp()

    Thread(target=room_session_handler, args=(room_id, 0, total_points)).start()
    Thread(target=room_timer_handler, args=(room_id, total_time)).start()


def room_session_handler(room_id, point_index, total_points):
    if point_index >= total_points:
        return
    x = random() * 100
    y = random() * 100
    point_id = uuid.uuid4()
    ACTIVE_ROOMS[room_id]["points"][str(point_id)] = {}

    send_game_info(room_id, {"x": x, "y": y, "id": point_id, "index": point_index})

    Timer(
        0.5, room_session_handler, args=(room_id, point_index + 1, total_points)
    ).start()


def room_timer_handler(room_id, time):
    if time <= 0:
        send_game_timer(room_id, 0)
        deactivate_room_handler(room_id)
        return

    send_game_timer(room_id, time)

    Timer(1, room_timer_handler, args=(room_id, time - 1)).start()


def deactivate_room_handler(room_id):
    del ACTIVE_ROOMS[room_id]
