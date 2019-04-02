from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin

from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    objects = UserManager()

    email = models.EmailField('email_address', unique=True)
    username = models.CharField('username', max_length=30, unique=True)
    date_joined = models.DateTimeField('date_joined', auto_now_add=True)
    avatar = models.ImageField(upload_to='avatars', 
                                default="avatars/default_avatar.jpg")
    is_staff = models.BooleanField(default=False)
    first_name = models.CharField('first name', max_length=30, blank=True)
    last_name = models.CharField('last name', max_length=30, blank=True)
    is_active = models.BooleanField('active', default=True)
    

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    class Meta:
        verbose_name = ('user')
        verbose_name_plural = ('users')

    def __str__(self):
        return self.username

    @property
    def get_avatar(self):
        return self.avatar.url
    
