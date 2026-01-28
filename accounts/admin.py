from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
#This is a "pre-built template" for managing users. It already knows how to handle passwords, usernames, and permissions.
from .models import User
#.models import User: This brings in your specific User model (the one that contains the role field).

# This makes the "Role" visible when you log into the Django Admin panel
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )

admin.site.register(User, CustomUserAdmin)