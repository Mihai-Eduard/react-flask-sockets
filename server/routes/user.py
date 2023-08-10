from flask_smorest import Blueprint, abort
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)

from utils.blocklist import BLOCKLIST
from utils.schemas import UserSchemaSignup, UserSchemaLogin, UserInformation, UserResetPassword
from models import User
from utils.db import db
from sqlalchemy.exc import SQLAlchemyError
from passlib.hash import pbkdf2_sha256

import re
import uuid

blp = Blueprint("Users", "users", "Operations on users.")

email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"


@blp.post("/login")
@blp.arguments(UserSchemaLogin)
def user_login(user_data):
    user = User.query.filter(User.email == user_data["email"]).first()
    if not user:
        abort(400, message="No user is registered with this email.")
    if not pbkdf2_sha256.verify(user_data["password"], user.password):
        abort(400, message="The password you provided is wrong.")

    token = create_access_token(identity=user.id)
    return {"user_id": user.id, "token": token}, 200


@blp.post("/signup")
@blp.arguments(UserSchemaSignup)
def user_signup(user_data):
    if len(user_data["username"]) < 5 or len(user_data["username"]) > 17:
        abort(400, message="The username must be between 5 and 17 characters long.")
    if not re.match(email_pattern, user_data["email"]):
        abort(400, message="That is not a valid email address.")
    if len(user_data["password"]) < 5 or len(user_data["password"]) > 17:
        abort(400, message="The password must be between 5 and 24 characters long.")
    if user_data["password"] != user_data["confirm_password"]:
        abort(400, message="The confirm password is incorrect.")
    del user_data["confirm_password"]

    if User.query.filter(User.username == user_data["username"]).first():
        abort(400, message="This username is taken.")
    if User.query.filter(User.email == user_data["email"]).first():
        abort(400, message="A user with that email already exists.")

    user_data["password"] = pbkdf2_sha256.hash(user_data["password"])
    user = User(**user_data, id=str(uuid.uuid4()))
    try:
        db.session.add(user)
        db.session.commit()
        return {"message": "Your account was successfully created."}, 200
    except SQLAlchemyError as err:
        print(err)
        abort(500, message="We couldn't sign you up.")


@blp.post("/reset-password")
@blp.arguments(UserResetPassword)
def reset_password(user_data):
    if not User.query.filter(User.email == user_data["email"]).first():
        abort(400, message="A user with that email doesn't exist.")
    return {"message": "The email has been successfully sent."}, 200


@blp.get("/logout")
@jwt_required()
def user_logout():
    jwt = get_jwt()
    BLOCKLIST.add(jwt["jti"])
    return {"message": "You have been successfully logged out."}, 200


@blp.get("/user")
@blp.response(200, UserInformation)
@jwt_required()
def get_user_information():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return user, 200
