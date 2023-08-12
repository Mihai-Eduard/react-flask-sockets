from marshmallow import Schema, fields, validate

from utils.schemas.auth_schemas import PlainUserSchema


class RoomIDSchema(Schema):
    room_id = fields.Str(required=True, validate=validate.Length(max=150))


class MessageSchema(Schema):
    id = fields.Int(dump_only=True)
    text = fields.Str(required=True, validate=validate.Length(max=100))
    sender = fields.Nested(PlainUserSchema(), required=True)
    is_join_or_create_room = fields.Int(
        required=True, validate=validate.Length(max=100), dump_only=True
    )


class RoomSchema(Schema):
    id = fields.Str(required=True, validate=validate.Length(max=36))
    owner = fields.Nested(PlainUserSchema(), required=True)
    users = fields.List(fields.Nested(PlainUserSchema(), required=True))
    messages = fields.List(fields.Nested(MessageSchema(), required=True))


class MessageTextSchema(Schema):
    text = fields.Str(required=True, validate=validate.Length(max=150))
