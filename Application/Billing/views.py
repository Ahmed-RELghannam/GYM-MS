from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Discount
from .serializers import *
from django.utils.translation import gettext_lazy as _
from rest_framework.authentication import TokenAuthentication
from users.permissions import IsOwnerUser,AllowCashierUser
from .models import Invoice,withdraw,Subscription, MemberAttandance,Plan,Discount
from django.db.models import Sum, Count,Max, OuterRef, Subquery
from django.utils import timezone
from users.models import Member,Coach
from users.serializers import ListCoachSerializer
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from users.models import User,Cashier
from django.db.models import Q



today = timezone.now().date()


class DiscountCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]

    def post(self, request, *args, **kwargs):
        serializer = DiscountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class DiscountSearchView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowCashierUser]  # Adjust to your specific permission class

    def get(self, request, code):
        try:
            discount = Discount.objects.get(code=code)
        except Discount.DoesNotExist:
            return Response({"error": "Discount not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = DiscountSerializer(discount)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class DiscountListView(APIView):
    
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowCashierUser]

    def get(self, request):
        queryset = Discount.objects.all()
        serializer = DiscountSerializer(queryset, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    

class DashbordCardsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowCashierUser]

    def get(self, request):
        today = timezone.now().date()
        
        total = Invoice.objects.filter(has_refunded=False).aggregate(total_amount=Sum('amount'))['total_amount'] or 0
        total_withdraw = withdraw.objects.aggregate(total_value=Sum('value'))['total_value'] or 0
        total_cash = total - total_withdraw
        total_today_amount = Invoice.objects.filter(datetime__date=today, has_refunded=False).aggregate(total_amount=Sum('amount'))['total_amount'] or 0
        total_today_count = Invoice.objects.filter(datetime__date=today, has_refunded=False).count()
        
        latest_subscriptions = Subscription.objects.filter(
            end_date__gte=today,
            was_refunded=False
        ).values('member').annotate(
            latest_end_date=Max('end_date')
        ).values('member', 'latest_end_date')

        active_subscriptions_count = len(latest_subscriptions)


        Members_Checked_In_Today = MemberAttandance.objects.filter(datetime__date=today).count()
        
        data = {
            'total_cash': total_cash,
            'total_today_amount': total_today_amount,
            'total_today_count': total_today_count,
            'Active_subscrption': active_subscriptions_count,
            'Members_Checked_In_Today': Members_Checked_In_Today
        }
        
        return Response(data,status=status.HTTP_200_OK)
    



class MonthlySubscriptionsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowCashierUser]

    def get(self, request):
        now = timezone.now()
        current_year = now.year
        current_month = now.month

        # Get all subscriptions for the current month
        subscriptions = Subscription.objects.filter(
            start_date__year=current_year,
            start_date__month=current_month
        )

        # Prepare the data for each day of the month
        days_in_month = (now.replace(month=current_month % 12 + 1, day=1) - timezone.timedelta(days=1)).day
        daily_subscriptions = {day: 0 for day in range(1, days_in_month + 1)}

        for subscription in subscriptions:
            day = subscription.start_date.day
            daily_subscriptions[day] += 1

        return Response(daily_subscriptions,status=status.HTTP_200_OK)






"""

"""



class MemberListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]

    def get(self, request):
        members = Member.objects.all()
        serializer = MemberSerializer(members, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class MemberAttandanceView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]


    def post(self, request):
        member_id = request.data.get('member_id')
        if member_id:
            try:
                member = Member.objects.get(id=member_id)
                attendance = MemberAttandance.objects.create(member=member)
                return Response(f'Attendance recorded for {member.name}', status=status.HTTP_201_CREATED)
            except Member.DoesNotExist:
                return Response('Member does not exist', status=status.HTTP_404_NOT_FOUND)
        else:
            return Response("Missing attributes", status=status.HTTP_400_BAD_REQUEST)
        









class AllPlanListView(APIView):
    
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]

    def get(self, request):
        queryset = Plan.objects.all()
        serializer = PlanSerializer(queryset, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


class ActivePlanListView(APIView):
    
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowCashierUser]

    def get(self, request):
        queryset = Plan.objects.filter(Archived=False)
        serializer = PlanSerializer(queryset, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    

class AddNewPlanView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]

    def post(self, request):
        serializer = PlanSerializer(data=request.data)
        if serializer.is_valid():
            try: 
                newplan = serializer.save() 
                return Response(serializer.data,status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class EditNewPlanView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOwnerUser]

    def post(self, request, plan_id):
        try:
            instance = Plan.objects.get(id=plan_id)
        except Plan.DoesNotExist:
            return Response({"error": "Plan not found."}, status=status.HTTP_404_NOT_FOUND)
        
        
        data = {}
        period = request.data.get('period')
        cost = request.data.get('cost')
        Archived = request.data.get('Archived')

        if Archived is not None:
            data['Archived'] = Archived
        if period is not None:
            data['period'] = period
        if cost is not None:
            data['cost'] = cost

        serializer = PlanSerializer(instance, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class GetMemberBillingData(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowCashierUser]

    def get(self, request, member_id):
        

        try:
            member = Member.objects.get(id=member_id)
        except Member.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Filter subscriptions that have not been refunded
        subscriptions = Subscription.objects.filter(member=member, was_refunded=False)

        if subscriptions.exists():
            last_subscription = subscriptions.order_by('-end_date').first()
            last_subscription_end_date = last_subscription.end_date

            # Determine the next subscription start date
            if last_subscription_end_date >= today:
                start_next_subscription_day = last_subscription_end_date + timedelta(days=1)
            else:
                start_next_subscription_day = today
        else:
            start_next_subscription_day = today

        plan_queryset = Plan.objects.filter(Archived=False)
        plan_serializer = PlanSerializer(plan_queryset, many=True)

        Couch_queryset = Coach.objects.filter

        Couch_queryset = Coach.objects.all()
        Couch_serializer = ListCoachSerializer(Couch_queryset, many=True)

        # Return the response with member's next subscription start date and name
        return Response({
            "member_id": member_id,
            "member_name": member.name,  # Fixed the comma and naming convention
            "start_next_subscription_day": start_next_subscription_day,
            "Plans" : plan_serializer.data,
            "Coachs" : Couch_serializer.data,
        },status=status.HTTP_200_OK)





class NewInvoiceView(APIView):


    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowCashierUser]

    def post(self, request):
        member_id = request.data.get('member_id')
        
        uid = force_str(urlsafe_base64_decode(request.data.get('uid')))
        selected_plan_id = request.data.get('selected_plan_id')
        discount_Code = request.data.get('discount_Code')
        Coach_Id = request.data.get('Coach_Id')
        
        
        
        try:
            user = User.objects.get(id=uid)

        except user.DoesNotExist :
            return Response({"error": "somthing went wrong"}, status=status.HTTP_404_NOT_FOUND)

        try: 
            cashier = Cashier.objects.get(user=user)
        except Cashier.DoesNotExist :
            return Response({"error": "user not have cashir profile"}, status=status.HTTP_404_NOT_FOUND)

        try:
            
            member = Member.objects.get(id=member_id)
            plan = Plan.objects.get(id=selected_plan_id)


        except Exception as e:
            return Response({'error': f"missing data {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        subscriptions = Subscription.objects.filter(member=member, was_refunded=False)
        
        if subscriptions.exists():
            last_subscription = subscriptions.order_by('-end_date').first()
            last_subscription_end_date = last_subscription.end_date

            # Determine the next subscription start date
            if last_subscription_end_date >= today:
                start_next_subscription_day = last_subscription_end_date + timedelta(days=1)
            else:
                start_next_subscription_day = today
        else:
            start_next_subscription_day = today

        end_date = start_next_subscription_day + timedelta(days=plan.period-1)

        discount = None 

        if discount_Code:
            try:
                discount = Discount.objects.get(code=discount_Code)
                
                
                
                # التحقق من صلاحية الخصم
                if discount.expierd_date and discount.expierd_date < today:
                    return Response({"error": "discount is expired"}, status=status.HTTP_406_NOT_ACCEPTABLE)

                # التحقق من عدد الاستخدامات المسموح بها
                if discount.allow_of_using is not None and discount.allow_of_using <= discount.number_of_using:
                    return Response({"error": "discount is expired"}, status=status.HTTP_406_NOT_ACCEPTABLE)
            
            except Discount.DoesNotExist:
                return Response({"error": "discount not found"}, status=status.HTTP_404_NOT_FOUND)
            
            # حساب قيمة الخصم
            if discount.is_percentage:
                discount_value = (plan.cost * discount.value) / 100
            else:
                discount_value = discount.value

            have_discount = True
        else:
            discount_value = 0
            have_discount = False

        
        if Coach_Id :
            try : 
                couch = Coach.objects.get(id=Coach_Id)
                have_private_coach = True

            except couch.DoesNotExist:
                return Response({"error": "couch not found"}, status=status.HTTP_404_NOT_FOUND)

        else: 
            couch = None
            have_private_coach = False

        value = plan.cost - discount_value

        invoice = Invoice.objects.create(
            have_discount = have_discount,
            have_private_coach = have_private_coach,
            amount = value,
            member = member,
            coach = couch,
            discount = discount,
            plan = plan,
            cashier = cashier
        )
        invoice.save()

        subscription =  Subscription.objects.create(
            member = member,
            start_date = start_next_subscription_day,
            end_date = end_date,
            invoice = invoice
        )
        subscription.save()

        if discount != None:
            discount.number_of_using = discount.number_of_using + 1 
            discount.save()


        

        return Response({"message":"invoice has created"},status=status.HTTP_201_CREATED)
    

class SubscriptionsListView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowCashierUser]


    def get(self, request):
        queryset = Subscription.objects.all()
        serializer = SubscriptionsListSerializer(queryset, many=True)

        return Response(serializer.data,status=status.HTTP_200_OK)
    

class refundSubscriptionsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowCashierUser]

    def post(self, request):
        subscription_id = request.data.get('subscription_id')
        invoice_id = request.data.get('invoice_id')
        user_type = request.data.get('user_type') 

        try:
            subscription = Subscription.objects.get(id=subscription_id,was_refunded=False)
        except Subscription.DoesNotExist:
            return Response({"error":"Cant Found subscription able to "},status=status.HTTP_404_NOT_FOUND)


        try:
            invoice = Invoice.objects.get(id=invoice_id,has_refunded=False)
        except Invoice.DoesNotExist:
            return Response({"error":"Cant Found invoice able to "},status=status.HTTP_404_NOT_FOUND)

        if invoice.datetime.date() < today and user_type == 'Cashier':

            return Response({"error":"you have no access to refund it"},status=status.HTTP_406_NOT_ACCEPTABLE)
        
        elif subscription.end_date < today :

            return Response({"error":"subscription is already expired can't refund"},status=status.HTTP_406_NOT_ACCEPTABLE)

        else :
            invoice.has_refunded = True
            subscription.was_refunded = True
            
            invoice.save()
            subscription.save()

            return Response({"message":"has refunded successful"},status=status.HTTP_202_ACCEPTED)