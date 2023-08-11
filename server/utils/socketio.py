from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_socketio import SocketIO, emit

socketio = SocketIO(cors_allowed_origins="http://localhost:3000")


@socketio.on("connect")
@jwt_required()
def connected():
    """event listener when client connects to the server"""
    print(f"client with id {get_jwt_identity()} has connected")


@socketio.on("data")
def handle_message(data):
    """event listener when client types a message"""
    print("data from the front end: ", str(data))
    emit("data1", {"data": data, "id": request.sid}, broadcast=True)


@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")
    emit("disconnect", f"user {request.sid} disconnected", broadcast=True)
