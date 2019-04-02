# -*- coding: utf-8 -*-
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .models import User

class NewUserAdmin(UserAdmin):
    readonly_fields = ('date_joined', )
    list_display = ('__str__', 'username', 'email', 'pk', )

admin.site.register(User, NewUserAdmin)

