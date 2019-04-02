import jwt

from decouple import config

from users.models import User


secret = config('DJANGO_SECRET_KEY')

class TokenAuthMiddleware:
    """
    JWT Authorization middleware for django channels 2
    """
    def __init__(self, inner):
        self.inner = inner


    def __call__(self, scope):
        query = dict(
                (x.split('=') for x in scope['query_string'].decode().split("&"))
        )
        token = query['token']
        user_id = jwt.decode(token, secret, algorithms=['HS256'])['user_id']
        scope['user'] = User.objects.get(pk=user_id)
        return self.inner(scope)
