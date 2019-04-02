from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from users.views import TokenAndUserPairView

from . import views

from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/chat/', include('chat.urls')),
    path('api/user/', include('users.urls')),
    path('ping/', views.ping),
    #path('api/token/', jwt_views.TokenObtainPairView.as_view(),
    #    name='token_obtain_pair'),
    path('api/token/', TokenAndUserPairView.as_view(),
        name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(),
        name='token_refresh'),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
