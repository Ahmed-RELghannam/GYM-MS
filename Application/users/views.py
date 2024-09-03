from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .permissions import IsOwnerUser
from .models import User,Cashier,Coach,Member,notifications
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from rest_framework.authentication import TokenAuthentication
from .serializers import *
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt



class CreateUserView(APIView):
    
    def post(self, request):
        serializer = CreateSystemUsers(data=request.data)
        if serializer.is_valid():
            user_instance = serializer.save()
            return Response({
                'message': 'User has been created successfully',
                'name': user_instance.name,
                'email': user_instance.email,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class LoginUser(APIView):
    """
    View to handle user login

        {
        "username": "User-Email",
        "password": "User-Password"
        }
    """
    
    def post(self, request):
        data = request.data
        email = data.get('email', None)
        password = data.get('password', None)

        if email is None or password is None:
            return Response({'error': 'Please provide both email and password'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=email, password=password)
        
        if user is not None:
            try:
                token, created = Token.objects.get_or_create(user=user)
            except Token.DoesNotExist:
                raise ObjectDoesNotExist(_('User type does not exist in the database'))
            
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            user_typeModel = user.user_type
            user_typeName = user_typeModel.english_name
            return Response({
                'message': 'Login successful',
                'data' : user.email,
                'token': token.key,
                'uid': uid,
                'user_type': user_typeName
                }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

 


class CheckTokenView(APIView):

    def get(self, request):
        token = request.headers.get('Authorization', None)
        uid = request.query_params.get('uid', None)
        
        if not token or not uid:
            return Response({'error': 'Token or UID not provided.'}, status=status.HTTP_400_BAD_REQUEST)

        token = token.split(' ')[1]  # Remove "Token " prefix
        id = force_str(urlsafe_base64_decode(uid))
        try:
            tokenModel = Token.objects.get(key=token)
        except Token.DoesNotExist:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if tokenModel.user_id != id:
            return Response({'error': 'Token and UID do not match.'}, status=status.HTTP_401_UNAUTHORIZED)

        user = tokenModel.user
        usertype = user.user_type

        return Response({
            'message': 'Access Allow',
            'userType': usertype.english_name,
        }, status=status.HTTP_200_OK)

    

"""



"""       
class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



class SetNewPasswordView(APIView):
    def post(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    



"""


"""



class CashierList(APIView):
    
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]

    def get(self, request):
        queryset = Cashier.objects.all()
        serializer = ListCashierSerializer(queryset, many=True)
        return Response(serializer.data)



class EditCashierUserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]

    def post(self, request, cashier_id):
        try:
            instance = Cashier.objects.get(id=cashier_id)
        except Cashier.DoesNotExist:
            return Response({"error": "Cashier not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = EditCashierUserSerializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class EditCoachUserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]

    def post(self, request, coach_id):
        try:
            instance = Coach.objects.get(id=coach_id)
        except Coach.DoesNotExist:
            return Response({"error": "Coach not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = EditCoachUserSerializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


       
class DeleteCashierUserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]


    def post(self, request):
        cashier_id = request.data.get('cashier_id')
        if not cashier_id:
            return Response({"error": "Cashier ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            instance = Cashier.objects.get(id=cashier_id)
        except Cashier.DoesNotExist:
            return Response({"error": "Cashier not found."}, status=status.HTTP_404_NOT_FOUND)

        if instance.user_id:
            user_id = instance.user_id
            User.objects.get(id=user_id).delete()
            return Response({"success": "Cashier and associated user deleted successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Cashier does not have an associated user."}, status=status.HTTP_404_NOT_FOUND)

        
class DeleteCoachUserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]


    def post(self, request):
        Coach_id = request.data.get('Coach_id')
        if not Coach_id:
            return Response({"error": "Coach ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            instance = Coach.objects.get(id=Coach_id)
        except Coach.DoesNotExist:
            return Response({"error": "Coach not found."}, status=status.HTTP_404_NOT_FOUND)

        if instance.user_id:
            user_id = instance.user_id
            User.objects.get(id=user_id).delete()
            return Response({"success": "Coach and associated user deleted successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Coach does not have an associated user."}, status=status.HTTP_404_NOT_FOUND)




class CochList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]
    
    def get(self, request):
        queryset = Coach.objects.all()
        serializer = ListCoachSerializer(queryset, many=True)
        return Response(serializer.data)
    



class MemberList(APIView):
    
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]

    def get(self, request):
        queryset = Member.objects.all()
        serializer = ListMemberSerializer(queryset, many=True)
        return Response(serializer.data)
    

class NotificationsList(APIView):
    
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]

    def get(self, request):
        queryset = notifications.objects.all()
        serializer = notificationsSerializer(queryset, many=True)
        return Response(serializer.data)
    


class ReRequestCreationsMessage(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]

    def post(self, request):
        serializer = ReRequestCreationsMessageSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.update(None, serializer.validated_data)
            return Response(serializer.to_representation(instance),status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
"""




"""

class CreateCashier(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]

    def post(self,request):

        serializer = CreateCashierUserSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                cashier = serializer.save()
                

                return Response(serializer.to_representation(cashier), status=status.HTTP_201_CREATED)
            except Exception as e: 
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class CreateCoach(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]

    def post(self,request):

        serializer = CreateCoachUserSerializer(data=request.data)

        if serializer.is_valid():
            try:
                Coach = serializer.save()
                """
                send OTP mail for create user 

                """

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e: 
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

