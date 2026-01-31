from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, RestaurantTable, Booking

# 1. Manage your Custom User (Role-based)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role',)}),
    )

# 2. Manage Bookings (See who reserved what)
class BookingAdmin(admin.ModelAdmin):
    # FIXED: Changed 'time_slot' to 'time' to match your updated Booking model
    list_display = ('booking_id', 'user', 'date', 'time', 'tables_reserved', 'created_at')
    list_filter = ('date', 'time')
    search_fields = ('booking_id', 'user__username')
    readonly_fields = ('booking_id', 'created_at')

# 3. Manage Restaurant Settings (Set total capacity)
class RestaurantTableAdmin(admin.ModelAdmin):
    list_display = ('total_tables',)

# Registering all models
admin.site.register(User, CustomUserAdmin)
admin.site.register(Booking, BookingAdmin)
admin.site.register(RestaurantTable, RestaurantTableAdmin)