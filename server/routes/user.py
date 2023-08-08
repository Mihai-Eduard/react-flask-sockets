from flask_smorest import Blueprint

blp = Blueprint("Users", "users", "Operations on users.")


@blp.get("/users")
def get_users():
    return [], 200
