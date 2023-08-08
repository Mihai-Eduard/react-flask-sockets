from flask_smorest import Blueprint, abort
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from utils.schemas import UserSchemaSignup, UserSchemaLogin
from models import User
from utils.db import db
from sqlalchemy.exc import SQLAlchemyError
from passlib.hash import pbkdf2_sha256

import uuid

blp = Blueprint("Users", "users", "Operations on users.")


@blp.post("/login")
@blp.arguments(UserSchemaLogin)
def user_login(user_data):
    user = User.query.filter(User.email == user_data["email"]).first()
    if not user:
        abort(400, message="No user is registered with this email.")
    if not pbkdf2_sha256.verify(user_data["password"], user.password):
        abort(400, message="The password is wrong.")

    token = create_access_token(identity=user.id)
    return {"user_id": user.id, "token": token}, 200


@blp.post("/signup")
@blp.arguments(UserSchemaSignup)
def user_signup(user_data):
    print(user_data)
    if user_data["password"] != user_data["confirm_password"]:
        abort(400, message="The confirm password is incorrect.")
    del user_data["confirm_password"]

    if User.query.filter(User.email == user_data["email"]).first():
        abort(400, message="A user with that email already exists.")

    if User.query.filter(User.username == user_data["username"]).first():
        abort(400, message="This username is taken.")

    user_data["password"] = pbkdf2_sha256.hash(user_data["password"])
    user = User(**user_data, id=str(uuid.uuid4()))
    try:
        db.session.add(user)
        db.session.commit()
        token = create_access_token(identity=user.id)
        return {"user_id": user.id, "token": token}, 200
    except SQLAlchemyError as err:
        print(err)
        abort(500, message="We couldn't sign you up.")


@blp.get("/logout")
@jwt_required()
def user_logout():
    identity = get_jwt_identity()
    print(identity)
    return {"message": "You have been successfully logged out."}, 200
