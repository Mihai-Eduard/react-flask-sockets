from utils.db import db


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(100), nullable=False)
    is_join_or_create_room = db.Column(db.Integer, nullable=False, default=0)
    sender_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    room_id = db.Column(db.String(36), db.ForeignKey("rooms.id"), nullable=False)

    sender = db.relationship("User", back_populates="messages")
    room = db.relationship("Room", back_populates="messages")
