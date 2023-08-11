import os
from datetime import timedelta

from flask import Flask
from flask_smorest import Api
from flask_cors import CORS
from flask_migrate import Migrate

from routes.user import blp as user_blueprint
from routes.room import blp as room_blueprint
from dotenv import load_dotenv

import models  # noqa - for creating the tables beforehand
from utils.db import db
from utils.jwt import jwt


# function for creating the Flask app
def create_app():
    app = Flask(__name__)
    load_dotenv()
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    # configurations for the Swagger UI
    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["API_TITLE"] = "SERVER REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config[
        "OPENAPI_SWAGGER_UI_URL"
    ] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

    # set up the configurations for the sqlalchemy orm (we have connected it to a sqlite database in this case)
    # we don't want to track the modifications of the records
    # connect it to our Flask app
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)

    # set up the migrations of the database within the app
    Migrate(app, db)

    # set up the secret key for our JWT and connect it to our Flask app
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
    jwt.init_app(app)

    # register all the routes created through blueprints
    api = Api(app)
    api.register_blueprint(user_blueprint, url_prefix="/api")
    api.register_blueprint(room_blueprint, url_prefix="/api")

    return app
