from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


# For the Sign-Up Page
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Saves Name, Email, Password, and Role into ONE table row
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'customer')
        )
        return user


# For the Login Page
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # 'username' here contains the email typed in React
        login_input = attrs.get("username")

        try:
            # Look for the user in the EMAIL column
            user_obj = User.objects.get(email=login_input)
            # Swap email for the real username (e.g., 'Chinmay') so Django can authenticate
            attrs['username'] = user_obj.username
        except User.DoesNotExist:
            # If no email matches, continue as username (covers both cases)
            pass

        return super().validate(attrs)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom data to the JWT token
        token['username'] = user.username
        token['role'] = user.role  # Helps React identify Admin vs User
        return token