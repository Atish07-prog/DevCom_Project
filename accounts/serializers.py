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
        # Ensure username exists (uses email if missing)
        if not validated_data.get('username'):
            validated_data['username'] = validated_data.get('email')

        # create_user handles password hashing automatically
        return User.objects.create_user(**validated_data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Customizes the Login process so users can log in with their Email.
    """

    def validate(self, attrs):
        # We allow users to type their email into the 'username' field
        email_input = attrs.get('username')

        try:
            # Check if input is an email, then find corresponding username
            user = User.objects.get(email=email_input)
            attrs["username"] = user.username
        except User.DoesNotExist:
            pass

        # Hand over to JWT to verify password and generate tokens
        data = super().validate(attrs)

        # Add user-specific info to the response for React to use
        data['username'] = self.user.username
        data['role'] = self.user.role

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
