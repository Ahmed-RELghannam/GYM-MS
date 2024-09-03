from django.urls import path
from .views import *

urlpatterns = [
    path('create_discount/', DiscountCreateView.as_view(), name='create_discount'),
    path('discount/search/<str:code>/', DiscountSearchView.as_view(), name='discount-search'),
    path('discount/', DiscountListView.as_view(), name='DiscountList'),
    path('DashbordCards/', DashbordCardsView.as_view(), name='DashbordCards'),
    path('MonthlySubscriptions/', MonthlySubscriptionsView.as_view(), name='MonthlySubscriptions'),
    

    path('api/memberList/', MemberListView.as_view(), name='MemberList'),

    path('api/MemberAttandance/', MemberAttandanceView.as_view(), name='MemberAttandance'),
    
    path('api/allPlanList/', AllPlanListView.as_view(), name='PlanList'),

    path('api/AddNewPlan/', AddNewPlanView.as_view(), name='AddNewPlan'),  
    path('api/NewInvoice/', NewInvoiceView.as_view(), name='NewInvoice'),  
    path('api/SubscriptionsList/', SubscriptionsListView.as_view(), name='SubscriptionsList'), 
    path('api/refundSubscriptions/', refundSubscriptionsView.as_view(), name='refundSubscriptions'), 




    path('api/EditNewPlan/<int:plan_id>/', EditNewPlanView.as_view(), name='EditNewPlan'),  
    
    path('api/MemberBillingData/<int:member_id>/', GetMemberBillingData.as_view(), name='MemberBillingData'), 
    

    
    
]
