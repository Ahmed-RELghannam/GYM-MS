from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [

    path('api/createuser/',CreateUserView.as_view(),name='CreateUser'),

    path('api/login/',LoginUser.as_view(),name='login'),
    path('api/check-token/', CheckTokenView.as_view(), name='check-token'),
    path('api/PasswordResetRequest/',PasswordResetRequestView.as_view(),name='PasswordResetRequest'),
    path('api/SetNewPassword/',SetNewPasswordView.as_view(),name='SetNewPassword'),

    path('api/CashierList/',CashierList.as_view(),name='CashierList'),
    path('api/CochList/',CochList.as_view(),name='CochList'),
    path('api/MemberList/',MemberList.as_view(),name='MemberList'),
    path('api/ReRequestCreationsMessage/',ReRequestCreationsMessage.as_view(),name='ReRequestCreationsMessage'),
    path('api/NotificationsList/',NotificationsList.as_view(),name='NotificationsList'),

    path('api/EditCashierUser/<int:cashier_id>/', EditCashierUserView.as_view(), name='EditCashierUser'),
    path('api/EditCoachUser/<int:coach_id>/', EditCoachUserView.as_view(), name='EditCoachUser'),

    
    
    path('api/DeleteCashierUser/',DeleteCashierUserView.as_view(),name='DeleteCashierUser'),
    path('api/DeleteCoachUser/',DeleteCoachUserView.as_view(),name='DeleteCoachUser'),


    path('api/CreateCashier/',CreateCashier.as_view(),name='CreateCashier'),
    path('api/CreateCoach/',CreateCoach.as_view(),name='CreateCoach'),
    path('api/CreateMember/',MemberList.as_view(),name='CreateMember'),
]
