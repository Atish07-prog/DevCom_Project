from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User  # Import our Single Table User model

# This makes the "Role" visible when you log into the Django Admin panel
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )

admin.site.register(User, CustomUserAdmin)