from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'required': False, 'default': 'customer'}
        }

    def create(self, validated_data):
        if not validated_data.get('username'):
            validated_data['username'] = validated_data.get('email')

        return User.objects.create_user(**validated_data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Customizes the Login process so users can log in with their Email.
    """

    def validate(self, attrs):
    
        email_input = attrs.get('username')

        try:
            user = User.objects.get(email=email_input)
            attrs["username"] = user.username
        except User.DoesNotExist:
            pass

        data = super().validate(attrs)

        data['username'] = self.user.username
        data['role'] = self.user.role
        data['email'] = self.user.email

        return data;
   
from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username")
    class Meta:
        model = Booking
        fields = [
            "booking_id",
            "user",
            "date",
            "time",
            "tables_reserved",
            "status",
            "created_at",
        ]
