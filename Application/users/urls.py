from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [

    path('api/createuser/',CreateUserView.as_view(),name='CreateUser'),

    path('api/login/',LoginUser.as_view(),name='login'),
    path('api/PasswordResetRequest/',PasswordResetRequestView.as_view(),name='PasswordResetRequest'),
    path('api/SetNewPassword/',SetNewPasswordView.as_view(),name='SetNewPassword'),

    path('api/CashierList/',CashierList.as_view(),name='CashierList'),
    path('api/CochList/',CochList.as_view(),name='CochList'),
    path('api/MemberList/',MemberList.as_view(),name='MemberList'),
    path('api/ReRequestCreationsMessage/',ReRequestCreationsMessage.as_view(),name='ReRequestCreationsMessage'),

    path('api/CreateCashier/',CreateCashier.as_view(),name='CreateCashier'),
    path('api/CreateCoach/',CreateCoach.as_view(),name='CreateCoach'),
    path('api/CreateMember/',MemberList.as_view(),name='CreateMember'),
]
