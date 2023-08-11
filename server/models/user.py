from utils.db import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)

    own_rooms = db.relationship(
        "Room",
        back_populates="owner",
        lazy="dynamic",
        cascade="all, delete, delete-orphan",
    )
    messages = db.relationship(
        "Message",
        back_populates="sender",
        lazy="dynamic",
        cascade="all, delete, delete-orphan",
    )
    rooms = db.relationship(
        "Room", back_populates="users", secondary="users_rooms", lazy="dynamic"
    )
