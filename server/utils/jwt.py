from flask_jwt_extended import JWTManager

from utils.blocklist import BLOCKLIST

jwt = JWTManager()


@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    print(jwt_header)
    print(jwt_payload)
    return jwt_payload["jti"] in BLOCKLIST
