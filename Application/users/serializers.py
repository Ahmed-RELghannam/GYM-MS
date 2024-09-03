from rest_framework import serializers
from .models import Cashier, Coach, Member,User,notifications
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from .token import CreateUserTokenGenerator,create_user_token_generator


DEV_EMAIL = ['ahmedElghannam@outlook.com']

"""


"""
class ListCashierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cashier
        fields = "__all__"


class notificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = notifications
        fields = fields = ['name','datetime']

    


class ListCoachSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Coach
        fields = "__all__"



class ListMemberSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Member
        fields = "__all__"


"""


"""

class CreateCashierUserSerializer(serializers.Serializer):

    name = serializers.CharField(max_length=255)
    email  = serializers.EmailField(max_length=255)
    phone = serializers.IntegerField()
    nat_id = serializers.CharField(max_length=255)
    address = serializers.CharField()

    def validate_email(self, value):
        if Cashier.objects.filter(email =value).exists():
            raise serializers.ValidationError(_("Email is Exist in Cashiers"))
        if Coach.objects.filter(email =value).exists():
            raise serializers.ValidationError(_("Email is Exist in Coachs"))
        if Member.objects.filter(email =value).exists():
            raise serializers.ValidationError(_("Email is Exist in Members"))
        return value

    def create(self, validated_data):
        
        cashier = Cashier.objects.create(user=None, **validated_data)

        email = cashier.email
        token = create_user_token_generator.make_token(cashier)
        uid = urlsafe_base64_encode(force_bytes(cashier.pk))
        userType = urlsafe_base64_encode(force_bytes('Cashier'))
        confirmation_link = f"{settings.FRONTEND_URL}/create/{userType}/{uid}/{token}"

        subject = f'hi {cashier.name} Create your user'
        message = f'''
        Hi {cashier.name},
            Welcome on board!
            Please click on the link below to create your user account:
            {confirmation_link}

            thanks,
            GYM Systeam
        '''
        recipient_list = [email]

        send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)
        
        return cashier

    def to_representation(self, instance):
        
        return {
            'id': instance.id,
            'name': instance.name,
            'email': instance.email,
            'phone': instance.phone,
            'nat_id': instance.nat_id,
            'address': instance.address,
            'user': instance.user.id if instance.user else None,
        }



class EditCashierUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Cashier
        fields = ['name', 'email', 'phone', 'nat_id', 'address']

    def validate_email(self, value):
        instance = self.instance
        if instance and value != instance.email and Cashier.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.nat_id = validated_data.get('nat_id', instance.nat_id)
        instance.address = validated_data.get('address', instance.address)
        instance.save()
        return instance

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'phone': instance.phone,
            'email': instance.email,  
            'nat_id': instance.nat_id,
            'address': instance.address,
            'user': instance.user.id if instance.user else None,
        }
    

class EditCoachUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Coach
        fields = ['name', 'email', 'phone', 'nat_id', 'address']

    def validate_email(self, value):
        instance = self.instance
        if instance and value != instance.email and Coach.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.nat_id = validated_data.get('nat_id', instance.nat_id)
        instance.address = validated_data.get('address', instance.address)
        instance.save()
        return instance

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'phone': instance.phone,
            'email': instance.email,  
            'nat_id': instance.nat_id,
            'address': instance.address,
            'user': instance.user.id if instance.user else None,
        }


class CreateCoachUserSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    phone = serializers.IntegerField()
    email  = serializers.EmailField(max_length=255)  
    nat_id = serializers.CharField(max_length=255)
    address = serializers.CharField()

    def validate_email(self, value):
        if Member.objects.filter(email =value).exists():
            raise serializers.ValidationError(_("Email already exists in Members"))
        if Cashier.objects.filter(email =value).exists():
            raise serializers.ValidationError(_("Email already exists in Cashiers"))
        if Coach.objects.filter(email =value).exists():
            raise serializers.ValidationError(_("Email already exists in Coaches"))
        return value

    def create(self, validated_data):
        coach_instance = Coach.objects.create(**validated_data)

        
        email = coach_instance.email
        token = create_user_token_generator.make_token(coach_instance)
        uid = urlsafe_base64_encode(force_bytes(coach_instance.pk))
        userType = urlsafe_base64_encode(force_bytes('Coach'))
        confirmation_link = f"{settings.FRONTEND_URL}/create/{userType}/{uid}/{token}"

        subject = f'hi {coach_instance.name} Create your user'
        message = f'''
        Hi coach {coach_instance.name},
            Welcome on board!
            Please click on the link below to create your user account:
            {confirmation_link}

            thanks,
            GYM Systeam
        '''
        recipient_list = [email]

        send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)

        return coach_instance

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'phone': instance.phone,
            'email': instance.email,  
            'nat_id': instance.nat_id,
            'address': instance.address,
            'user': instance.user.id if instance.user else None,
        }



class CreateMemberUserSerializer(serializers.Serializer):
    
    class Meta:
        pass    






class ReRequestCreationsMessageSerializer(serializers.Serializer):
    email  = serializers.EmailField(max_length=255) 
    UserType = None
    ProfileModel = None
    
    def validate_email(self, value):
        if Member.objects.filter(email =value).exists():
            profile = Member.objects.get(email =value)
            if profile.user is not None:
                raise serializers.ValidationError(_("member user has created alrady"))
            self.UserType = 'Member'
            self.ProfileModel=Member
            return value   
        elif Cashier.objects.filter(email =value).exists():
            profile = Cashier.objects.get(email =value)
            if profile.user is not None:
                raise serializers.ValidationError(_("Cashier user has created alrady"))
            self.UserType = 'Cashier'
            self.ProfileModel=Cashier
            return value  
        elif Coach.objects.filter(email =value).exists():
            profile = Coach.objects.get(email = value)
            if profile.user is not None:
                raise serializers.ValidationError(_("Coach user has created alrady"))
            self.UserType = 'Coach'
            self.ProfileModel=Coach
            return value  
        else:
            raise serializers.ValidationError(_("Email Not exists in DB"))
        
    def update(self, instance, validated_data):
        if self.UserType is None or self.ProfileModel is None:
            raise serializers.ValidationError(_("Missing Data"))
        
        UserProfile = self.ProfileModel.objects.get(email=validated_data['email'])

        email = UserProfile.email
        token = create_user_token_generator.make_token(UserProfile)
        uid = urlsafe_base64_encode(force_bytes(UserProfile.pk))
        userType = urlsafe_base64_encode(force_bytes(self.UserType))
        confirmation_link = f"{settings.FRONTEND_URL}/create/{userType}/{uid}/{token}"

        subject = f'hi {UserProfile.name} Create your user'
        message = f'''
        Hi coach {UserProfile.name},
            Welcome on board!
            Please click on the link below to create your user account:
            {confirmation_link}

            thanks,
            GYM Systeam
        '''
        recipient_list = [email]

        send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)
     
        return UserProfile

    def to_representation(self, instance):
        return {
            'Email': instance.email,
            'message': 'Mail sent successfully '
        }

class CreateSystemUsers(serializers.Serializer):
    
    token = serializers.CharField()
    uid = serializers.CharField()
    userType = serializers.CharField()
    password = serializers.CharField()

    


    def validate(self, data):
        
        userType = force_str(urlsafe_base64_decode(data['userType']))
        if userType == 'Cashier':
            model = Cashier
        elif userType == 'Coach':
            model = Coach
        elif userType == 'Member':
            model = Member
        else:
            subject = '!!!!observed abuse'
            message = f'''
            Someone is trying to create data with a user type that does not exist.
            token : {data['token']}
            uid : {data['uid']}
            userType : {data['userType']}
            endPoint : /users/api/createuser/
            '''
            send_mail(subject, message, settings.EMAIL_HOST_USER, DEV_EMAIL)
            raise serializers.ValidationError(_("Not Valied Data!!"))
        
        
        

        try:
            uid = force_str(urlsafe_base64_decode(data['uid']))
            UserModel = model.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, model.DoesNotExist):
            subject = '!!!!observed abuse'
            message = f'''
            Someone is trying to create data with a uid that does not exist.
            token : {data['token']}
            uid : {data['uid']}
            userType : {data['userType']}
            endPoint : /users/api/createuser/
            '''
            send_mail(subject, message, settings.EMAIL_HOST_USER, DEV_EMAIL)
            raise serializers.ValidationError(_("Not Valied Data!!"))
        

        if not CreateUserTokenGenerator().check_token(UserModel, data['token']):
            subject = '!!!!observed abuse'
            message = f'''
            Someone is trying to create data with a token that does not exist or expiered.
            token : {data['token']}
            uid : {data['uid']}
            userType : {data['userType']}
            endPoint : /users/api/createuser/
            '''
            send_mail(subject, message, settings.EMAIL_HOST_USER, DEV_EMAIL)
            
            raise serializers.ValidationError(_("Expiered Link or Not Valied"))


        if not data['password'] : 
            raise serializers.ValidationError(_("password is requered"))
        
        return data
    


    def create(self, validated_data):

        Type = force_str(urlsafe_base64_decode(validated_data['userType']))
        if Type == 'Cashier':
            model = Cashier
            create_user_method = User.objects.create_Cashieruser
        elif Type == 'Coach':
            model = Coach
            create_user_method = User.objects.create_Coachuser
        elif Type == 'Member':
            model = Member
            create_user_method = User.objects.create_Memberuser

        uid = force_str(urlsafe_base64_decode(validated_data['uid']))
        UserModel = model.objects.get(pk=uid)
        email = UserModel.email
        password = validated_data['password']

        user = create_user_method(email=email,password=password)

        UserModel.user = user
        UserModel.save()


        return UserModel
    
    def to_representation(self, instance):
        
        return{
            'message': 'User has created successfully',
            'name' : instance.name,
            'email' : instance.email,
        }
"""     

"""




class PasswordResetRequestSerializer(serializers.Serializer):

    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError(_("No user with this email address exists."))
        return value

    
    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

        send_mail(
            'Password Reset Request',
            f'Click the link to reset your password: {reset_link}',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )



class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    token = serializers.CharField()
    uid = serializers.CharField()

    def validate(self, data):
        try:
            uid = force_str(urlsafe_base64_decode(data['uid']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError(_("Invalid user ID."))

        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError(_("Invalid token."))

        return data

    def save(self):
        password = self.validated_data['password']
        uid = force_str(urlsafe_base64_decode(self.validated_data['uid']))
        user = User.objects.get(pk=uid)
        user.set_password(password)
        user.save()
