from datetime import datetime
from rest_framework import status, generics
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Booking, User
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer, BookingSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(username=request.data.get('username'))
            response.data['username'] = user.username
        return response


# 3. Availability Check
class CheckAvailabilityView(APIView):
    def post(self, request):
        date = request.data.get('date')
        time_val = request.data.get('time')

        if Booking.objects.filter(date=date, time=time_val,status = "confirmed").exists():
            return Response({
                "available": False,
                "message": "This table has been booked. Choose some other time slot."
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({"available": True}, status=status.HTTP_200_OK)


# 4. Confirm Booking
class ConfirmBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        date = request.data.get('date')
        time_val = request.data.get('time')
        # React sends 'guests', ensure we capture it
        tables = request.data.get('tables') or request.data.get('guests') or 1

        try:
            # Explicit check to prevent duplicate slots
            if Booking.objects.filter(date=date, time=time_val,status="confirmed").exists():
                return Response({"error": "This slot is already booked."}, status=status.HTTP_400_BAD_REQUEST)

            booking = Booking.objects.create(
                user=request.user,
                date=date,
                time=time_val, # Ensure React sends HH:MM:SS format
                tables_reserved=tables
            )
            return Response({
                "success": True,
                "bookingId": booking.booking_id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Check your terminal/console to see the exact rejection reason!
            print(f"CRITICAL DATABASE ERROR: {e}")
            return Response({"error": f"Internal Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def booking_list(request):
    bookings = Booking.objects.all().order_by("-created_at")
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(["PATCH"])
def cancel_booking(request, booking_id):
    booking = get_object_or_404(Booking, booking_id=booking_id)
    booking.status = "cancelled"
    booking.save()
    return Response(
        {"message": "Booking cancelled"},
        status=status.HTTP_200_OK
    )