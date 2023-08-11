import os

from app import create_app
from utils.socketio import socketio

app = create_app()
socketio.init_app(app)

if __name__ == "__main__":
    socketio.run(app, debug=os.getenv("DEBUG_MODE"))
