from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import Client, Flower, Category, Order

from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class ClientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Client
        fields = ['id', 'firstName', 'lastName', 'phone', 'address', 'email','password','image', 'user']


        

class FlowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flower
        fields = ['id', 'name', 'scientific_name', 'color', 'blooming_season', 'petal_count', 'height', 'image', 'care_instructions', 'price', 'availability','categoryId']


class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["id", "address","phone","email"]