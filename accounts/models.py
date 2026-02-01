from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('customer', 'User'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')

    def __str__(self):
        return f"{self.username} ({self.role})"


class RestaurantTable(models.Model):
    """
    Defines the total capacity of the restaurant.
    """
    total_tables = models.PositiveIntegerField(default=10)

    def __str__(self):
        return f"Restaurant Capacity: {self.total_tables} Tables"


class Booking(models.Model):
    """
    Records reservations and prevents double-booking.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    booking_id = models.CharField(max_length=20, unique=True, editable=False)
    
    status = models.CharField(
    max_length=20,
    choices=[
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
    ],
    default="confirmed",
    )


    date = models.DateField()
    time = models.TimeField()
    tables_reserved = models.PositiveIntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)

   

    def save(self, *args, **kwargs):
        if not self.booking_id:
            import random
            self.booking_id = f"BK-{random.randint(100000, 999999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_id} - {self.user.username} on {self.date} at {self.time}"