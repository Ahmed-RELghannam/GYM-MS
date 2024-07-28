from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .permissions import IsOwnerUser
from .models import User,Cashier,Coach,Member
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from rest_framework.authentication import TokenAuthentication
from .serializers import *




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
            return Response({
                'message': 'Login successful',
                'data' : user.email,
                'token': token.key,
                }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

 
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
        






        