from django.urls import path

from . import views

app_name = 'users'

urlpatterns = [
        path('', views.current_user),
        path('create/', views.UserList.as_view()),
]
