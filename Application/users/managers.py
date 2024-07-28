from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from .user_type import UserType
from django.core.validators import validate_email

class UserManager(BaseUserManager):

    # def email_validator(self, email):
    #     try:
    #         CustomEmailValidator(email)
    #     except ValidationError:
    #         raise ValidationError(_('Please enter a valid email address'))

    def create_user(self, email, user_type_id=None, password=None, **extra_fields):
        if email:
            try:
                validate_email(email)
            except ValidationError:
                raise ValidationError(_('Please enter a valid email address'))
        else:
            raise ValidationError(_('An Email address is required'))
        
        if user_type_id:
            try:
                user_type = UserType.objects.get(id=user_type_id)
            except UserType.DoesNotExist:
                raise ObjectDoesNotExist(_('User type does not exist in the database'))
        else:
            raise ValidationError(_('A UserType is required'))
        extra_fields.pop('user_type', None)        
        user = self.model(email=email, user_type=user_type, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user



    def create_Cashieruser(self, email, user_type_id=2, password=None, **extra_fields):
        """Create a cashier user with the given email and default user type id of 2."""        
        return self.create_user(email, user_type_id, password, **extra_fields)
    

    
    def create_Coachuser(self, email, user_type_id=2, password=None, **extra_fields):
        """Create a coach user with the given email and default user type id of 3."""
        return self.create_user(email, user_type_id, password, **extra_fields)
    
    def create_Memberuser(self, email, user_type_id=4, password=None, **extra_fields):
        """Create a member user with the given email and default user type id of 4."""
        return self.create_user(email, user_type_id, password, **extra_fields)
    


    def create_superuser(self, email, password=None, **extra_fields):
        """Create a superuser with the given email and default user type id of 1."""
        user_type_id=1
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, user_type_id, password, **extra_fields)
