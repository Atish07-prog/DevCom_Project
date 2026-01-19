from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Registration View
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

# Login View (Token Generation)
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # Log what React is sending
        print(f"Login attempt received: {request.data}")
        return super().post(request, *args, **kwargs)