from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# This pulls your Custom User model with the 'role' field
User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    # We explicitly tell the serializer that email is required
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')
        extra_kwargs = {
            'password': {'write_only': True},
            # This is the "Magic Line": it tells the serializer
            # NOT to fail if React doesn't send a role.
            'role': {'required': False}
        }

    def create(self, validated_data):
        # Logic to use email as username if username is missing
        if not validated_data.get('username'):
            validated_data['username'] = validated_data.get('email')

        return User.objects.create_user(**validated_data)

        return User.objects.create_user(**validated_data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Customizes the Login process so users can log in with their Email.
    """

    def validate(self, attrs):
        # 1. Grab what the user typed in the 'username' box (which is likely their email)
        email_input = attrs.get('username')

        try:
            # 2. Look in the warehouse (database) for a user with that email
            user = User.objects.get(email=email_input)
            # 3. Swap the email for the actual username so Django can finish the login
            attrs["username"] = user.username
        except User.DoesNotExist:
            # If no user found, we do nothing and let the standard login fail
            pass

        # 4. Hand the data back to the 'Big Boss' (JWT) to check the password
        return super(MyTokenObtainPairSerializer, self).validate(attrs)