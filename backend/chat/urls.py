from django.urls import path, re_path

from . import views

app_name = 'chat'

urlpatterns = [
        re_path(r'^(?P<thread_id>\d+)/$', views.ChatMessageList.as_view(),
            name="message-list"),
        path(r'', views.ThreadList.as_view(), name='thread-list'),
        re_path(r'user/(?P<user_pk>\d+)/$', views.get_or_create_thread),
        ]
