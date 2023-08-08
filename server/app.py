from flask import Flask
from flask_smorest import Api

from routes.user import blp as user_blueprint


# function for creating the Flask app
def create_app():
    app = Flask(__name__)

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

    # register all the routes created through blueprints
    api = Api(app)
    api.register_blueprint(user_blueprint)

    return app
