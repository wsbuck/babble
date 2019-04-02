from django.conf.urls import url

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.security.websocket import OriginValidator

from chat.consumers import ChatConsumer

from .token_auth import TokenAuthMiddleware


#application = ProtocolTypeRouter({
#    # Empty for now (http->django views is added by default)
#    'websocket': AllowedHostsOriginValidator(
#        AuthMiddlewareStack(
#            URLRouter(
#                [
#                    url(r"^chat/(?P<thread_id>\d+)/$", ChatConsumer),
#                    #url(r"^notifications$", NotificationConsumer),
#                ]
#            )
#        )
#    )
#})

application = ProtocolTypeRouter({
    # Empty for now (http->django views is added by default)
    'websocket': TokenAuthMiddleware(
        AuthMiddlewareStack(
            URLRouter(
                [
                    url(r"^chat/(?P<thread_id>\d+)/$", ChatConsumer),
                    #url(r"^notifications$", NotificationConsumer),
                ]
            )
        )
    )
})

