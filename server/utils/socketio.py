from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_socketio import SocketIO

socketio = SocketIO(cors_allowed_origins="http://localhost:3000")


@socketio.on("connect")
@jwt_required()
def connected():
    print(f"client with id {get_jwt_identity()} has connected")


@socketio.on("disconnect")
@jwt_required()
def disconnected():
    print(f"client with id {get_jwt_identity()} has connected")
