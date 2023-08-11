from marshmallow import Schema, fields, validate


class UserLoginSchema(Schema):
    id = fields.Str(dump_only=True)
    email = fields.Str(required=True, validate=validate.Length(max=150))
    password = fields.Str(
        required=True, load_only=True, validate=validate.Length(max=256)
    )


class UserSignupSchema(UserLoginSchema):
    username = fields.Str(required=True, validate=validate.Length(max=100))
    confirm_password = fields.Str(
        required=True, load_only=True, validate=validate.Length(max=256)
    )


class UserResetPasswordSchema(Schema):
    email = fields.Str(required=True, validate=validate.Length(max=150))


class UserInformationSchema(UserSignupSchema):
    pass


class PlainUserSchema(Schema):
    id = fields.Str(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(max=100))
