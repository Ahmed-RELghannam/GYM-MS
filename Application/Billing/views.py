from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Discount
from .serializers import DiscountSerializer
from django.utils.translation import gettext_lazy as _
from rest_framework.authentication import TokenAuthentication
from users.permissions import IsOwnerUser

class DiscountCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = DiscountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class DiscountSearchView(APIView):
    def get(self, request, code):
        try:
            discount = Discount.objects.get(code=code)
        except Discount.DoesNotExist:
            return Response({"error": "Discount not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = DiscountSerializer(discount)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class DiscountListView(APIView):
    
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]

    def get(self, request):
        queryset = Discount.objects.all()
        serializer = DiscountSerializer(queryset, many=True)
        return Response(serializer.data)