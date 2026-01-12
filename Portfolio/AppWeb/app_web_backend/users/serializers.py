from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .roles import ROLES

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only':True}
        }

    def create(self, validated_data):
        user= User.objects.create_user(
            username = validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user
    
class UserAdminSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True,
        slug_field="name",
        queryset=Group.objects.all(),
        required=False
    )
    
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "groups",
            "is_active",
            "is_superuser",
            "is_staff",
        ]
        extra_kwargs = {
            'username': {'required':False},
            'email': {'required':False},
            'is_active': {'required':False},
            'is_superuser': {'required':False},
            'is_staff': {'required':False},
        }

    def update(self, instance, validated_data):
        groups = validated_data.pop("groups", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if groups is not None:
            instance.groups.clear()
            for g_name in groups:
                group, created = Group.objects.get_or_create(name=g_name)
                instance.groups.add(group)
        return instance
    
class AdminUserRoleSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(
        choices=[(v, v) for v in ROLES.values()],
        write_only=True
    )
    groups = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "role", "groups")
        read_only_fields = ("id", "username", "email", "groups")

    def get_groups(self, obj):
        return [g.name for g in obj.groups.all()]

    def validate_role(self, value):
        request = self.context["request"]

        if (
            request.user == self.instance
            and value != "Admin"
        ):
            raise serializers.ValidationError(
                "No puedes quitarte tu propio rol de admin"
            )
        
        return value
    
    def update(self, instance, validated_data):
        role_name = validated_data.get("role")

        if not role_name:
            return instance

        instance.groups.clear()
        group = Group.objects.get(name=role_name)
        instance.groups.add(group)

        return instance