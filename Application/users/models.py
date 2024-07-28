from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import UserManager
from .user_type import UserType
from django.conf import settings
from django.utils.timezone import now



"""
    Defining Model 'User' for custom Authentication 
    REQUIRED_FIELDS are 'Email' and 'user type' 
    For handle permission in app as type as business need
    User manager has defined in managers.py 
"""


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True, verbose_name=_('Email address'))
    user_type = models.ForeignKey(UserType, on_delete=models.CASCADE)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    last_login = models.DateTimeField(auto_now=True)
    password = models.EmailField(max_length=64)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS  = ['user_type']

    objects = UserManager()
    
    def __str__(self):
        return self.email
    


"""


"""

# Cashier Definition
class Cashier(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True, verbose_name=_('Email address'))
    phone = models.BigIntegerField(unique=True)
    nat_id = models.CharField(max_length=255, unique=True)
    address = models.TextField()
    user = models.ForeignKey(User, null=True, blank=True , on_delete=models.SET_NULL, related_name='cashiers')
    create_date = models.DateTimeField(default=now)
    edite_date = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name
    



# Member definition
class Member(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(max_length=255, unique=True, verbose_name=_('Email address'),blank=True,null=True)
    phone = models.BigIntegerField(unique=True)
    age = models.SmallIntegerField(null=True, blank=True)
    weight = models.SmallIntegerField(null=True, blank=True)
    height = models.SmallIntegerField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, null=True, blank=True , on_delete=models.SET_NULL, related_name='members')
    create_date = models.DateTimeField(default=now)
    edite_date = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name



# Coach definition
class Coach(models.Model):
    name = models.CharField(max_length=255)
    phone = models.BigIntegerField(unique=True)
    email = models.EmailField(max_length=255, unique=True, verbose_name=_('Email address'))
    nat_id = models.CharField(max_length=255, unique=True)
    address = models.TextField()
    user = models.ForeignKey(User, null=True, blank=True , on_delete=models.SET_NULL, related_name='coaches')
    create_date = models.DateTimeField(default=now)
    edite_date = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name