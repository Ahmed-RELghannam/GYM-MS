from django.urls import path
from .views import *

urlpatterns = [
    path('create_discount/', DiscountCreateView.as_view(), name='create_discount'),
    path('discount/search/<str:code>/', DiscountSearchView.as_view(), name='discount-search'),
    path('discount/', DiscountListView.as_view(), name='DiscountList'),


]
