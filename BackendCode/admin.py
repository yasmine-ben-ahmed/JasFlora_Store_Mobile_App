from django.contrib import admin
from .models import Client, Flower, Category, Order, OrderItem

admin.site.register(Client)
admin.site.register(Flower)
admin.site.register(Category)
admin.site.register(Order)
admin.site.register(OrderItem)
