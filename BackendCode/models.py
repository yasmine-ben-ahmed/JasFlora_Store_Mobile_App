from django.db import models
from django.contrib.auth.models import User

class Client(models.Model):
    firstName = models.CharField(max_length=100, null=True, blank=True)
    lastName = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=100, null=True)
    address = models.CharField(max_length=100, null=True)
    email = models.EmailField(max_length=100, null=True)
    password = models.CharField(max_length=100, null=True)
    image = models.FileField( upload_to='client_images/', blank=True,null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)

    

    def __str__(self):
        return f"{self.firstName} {self.lastName}"
    
class Category(models.Model):
    name = models.CharField(max_length=100, null=True)  # Category name

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'BackendCode_category' 


class Flower(models.Model):
    name = models.CharField(max_length=100)  # Flower name
    scientific_name = models.CharField(max_length=150, blank=True, null=True)  # Scientific name (optional)
    color = models.CharField(max_length=50)  # Color of the flower
    blooming_season = models.CharField(max_length=50)  # Season when the flower blooms
    petal_count = models.IntegerField(blank=True, null=True)  # Number of petals (optional)
    height = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)  # Height in cm (optional)
    image = models.ImageField(upload_to='flower_images/', blank=True, null=True)  # Image of the flower
    care_instructions = models.TextField(blank=True, null=True)  # Care tips
    price = models.DecimalField(max_digits=6, decimal_places=2)  # Price of the flower
    availability = models.BooleanField(default=True)  # Availability status
    categoryId = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='flowers', null=True)  # New field

    def __str__(self):
        return self.name

    
    
    class Meta:
        db_table = 'BackendCode_flower' 


class Order(models.Model):
    customer_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    address = models.TextField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.customer_name}"
