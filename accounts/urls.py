from django.urls import path
from .views import (
    RegisterView,
    MyTokenObtainPairView,
    CheckAvailabilityView,
    ConfirmBookingView,
    booking_list,
    cancel_booking
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('check-availability/', CheckAvailabilityView.as_view(), name='check-availability'),
    path('confirm-booking/', ConfirmBookingView.as_view(), name='confirm-booking'),
    path("bookings/", booking_list, name="booking-list"),
    path("bookings/<str:booking_id>/cancel/", cancel_booking, name="cancel-booking"),
]

