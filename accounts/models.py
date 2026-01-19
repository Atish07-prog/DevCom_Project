from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # This matches the "Admin" and "User" buttons in your image
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('customer', 'User'),
    )

    # The role is now a column in the main User table
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')

    def __str__(self):
        return f"{self.username} ({self.role})"