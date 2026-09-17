from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

# Create your models here.
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, blank=True, null=True)
    name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')], null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    location = models.JSONField(default=list, blank=True)
    product = models.JSONField(default=list, blank=True)
    trade = models.JSONField(default=list, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    groups = models.ManyToManyField(Group, related_name="customuser_set")
    user_permissions = models.ManyToManyField(Permission, related_name="customuser_permissions_set")