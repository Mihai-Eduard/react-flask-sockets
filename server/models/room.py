from utils.db import db


class Room(db.Model):
    __tablename__ = "rooms"

    id = db.Column(db.String(36), primary_key=True)
    owner_id = db.Column(
        db.String(36), db.ForeignKey("users.id"), nullable=False, unique=False
    )

    owner = db.relationship("User", back_populates="own_rooms")
    messages = db.relationship(
        "Message",
        back_populates="room",
        lazy="dynamic",
        cascade="all, delete, delete-orphan",
    )
    users = db.relationship(
        "User", back_populates="rooms", secondary="users_rooms", lazy="dynamic"
    )
