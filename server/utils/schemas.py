from marshmallow import Schema, fields, validate


class UserSchemaLogin(Schema):
    id = fields.Str(dump_only=True)
    email = fields.Str(required=True, validate=validate.Length(max=150))
    password = fields.Str(
        required=True, load_only=True, validate=validate.Length(max=256)
    )


class UserSchemaSignup(UserSchemaLogin):
    username = fields.Str(required=True, validate=validate.Length(max=100))
    confirm_password = fields.Str(required=True, validate=validate.Length(max=256))
