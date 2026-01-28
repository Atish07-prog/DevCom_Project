from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Registration View
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # Log what React is sending
        print(f"Login attempt received: {request.data}")
        return super().post(request, *args, **kwargs)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # 1. Standard login process
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            from .models import User
            # 2. Find the user by the email they sent
            user = User.objects.get(email=request.data.get('username'))

            # 3. Add the user's role and staff status to the response
            response.data['role'] = user.role
            response.data['is_staff'] = user.is_staff

        return response