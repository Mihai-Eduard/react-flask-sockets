from utils.db import db


# the many-to-many relationship table between items and tags
class UserRoom(db.Model):
    __tablename__ = "users_rooms"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    room_id = db.Column(db.String(36), db.ForeignKey("rooms.id"), nullable=False)
