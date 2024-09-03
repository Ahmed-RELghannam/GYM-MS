from django.utils import timezone
from rest_framework import serializers
from .models import Plan, Invoice, Subscription, Discount
from users.models import Member



class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['code', 'value', 'is_percentage', 'expierd_date', 'number_of_using', 'allow_of_using', 'has_expierd']




    def validate(self, data):
        
        if data.get('expierd_date') and data['expierd_date'] < timezone.now().date():
            raise serializers.ValidationError("The expiration date must be in the future.")
        
    
        if data['is_percentage'] is True and data['value'] > 100 :
            raise serializers.ValidationError("if percentage It should not exceed 100")
        
        if data['value'] < 0 :
            raise serializers.ValidationError("The value cannot be negative.")
        
        if Discount.objects.filter(code = data['code']).exists():
            raise serializers.ValidationError("This code already exists.")

        return data
    

    def create(self, validated_data):
        
        return Discount.objects.create(**validated_data)
    




    

    
    



class PlanSerializer(serializers.ModelSerializer):
    has_used = serializers.SerializerMethodField()

    class Meta:
        model = Plan
        fields = ['id', 'name', 'period', 'cost', 'Archived', 'has_used']

    def get_has_used(self, obj):
        has_used = obj.invoice_set.filter(has_refunded=False).exists()
        return has_used

    def validate_period(self, value):
        if value <= 0:
            raise serializers.ValidationError("The period must be a positive integer.")
        return value

    def validate_cost(self, value):
        if value <= 0:
            raise serializers.ValidationError("The cost must be a positive number.")
        return value  # تأكد من إرجاع القيمة الصحيحة

    def validate_name(self, value):
        if Plan.objects.filter(name=value).exists():
            raise serializers.ValidationError("A plan with this name already exists.")
        return value

    def create(self, validated_data):
        return Plan.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.period = validated_data.get('period', instance.period)
        instance.cost = validated_data.get('cost', instance.cost)
        instance.Archived = validated_data.get('Archived', instance.Archived)
        instance.save()
        return instance

    


class MemberSerializer(serializers.ModelSerializer):
    last_subscription_end_date = serializers.SerializerMethodField()
    last_subscription_type = serializers.SerializerMethodField()
    last_invoice_date = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = ['id', 'name', 'email', 'phone', 'age', 'weight', 'height', 'address', 'last_subscription_end_date', 'last_subscription_type', 'last_invoice_date']

    def get_last_subscription_end_date(self, obj):
        last_subscription = obj.subscription_set.filter(was_refunded=False).order_by('-end_date').first()
        if last_subscription:
            return last_subscription.end_date
        return None

    def get_last_subscription_type(self, obj):
        last_subscription = obj.subscription_set.filter(was_refunded=False).order_by('-end_date').first()
        if last_subscription and last_subscription.invoice:
            return last_subscription.invoice.plan.name
        return None

    def get_last_invoice_date(self, obj):
        last_subscription = obj.subscription_set.filter(was_refunded=False).order_by('-end_date').first()
        if last_subscription and last_subscription.invoice:
            return last_subscription.invoice.datetime
        return None



class SubscriptionsListSerializer(serializers.ModelSerializer):
    member_id = serializers.SerializerMethodField()
    member_name = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    invoice_id = serializers.SerializerMethodField()
    plan_name = serializers.SerializerMethodField()
    amount = serializers.SerializerMethodField()
    discount = serializers.SerializerMethodField()
    coach = serializers.SerializerMethodField()
    cashier = serializers.SerializerMethodField()
    creation_date = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = [
            'id', 'member_id', 'member_name', 'start_date', 'end_date',
            'invoice_id', 'status', 'plan_name', 'amount', 'discount', 'coach',
            'cashier',"creation_date"
        ]

    def get_member_id(self, obj):
        return obj.member.id
    
    def get_creation_date(self, obj):
        return obj.invoice.datetime if obj.invoice else None
    
    
    def get_member_name(self, obj):
        return obj.member.name

    def get_status(self, obj):
        was_refunded = obj.was_refunded
        end_date = obj.end_date

        if was_refunded:
            return 'Refunded'
        elif end_date >= timezone.now().date():
            return 'Active'
        else:
            return 'Expired'

    def get_invoice_id(self, obj):
        return obj.invoice.id if obj.invoice else None

    def get_amount(self, obj):
        return obj.invoice.amount if obj.invoice else None

    def get_discount(self, obj):
        if obj.invoice and obj.invoice.have_discount and obj.invoice.discount:
            return obj.invoice.discount.code
        return None

    def get_plan_name(self, obj):
        return obj.invoice.plan.name if obj.invoice and obj.invoice.plan else None

    def get_coach(self, obj):
        return obj.invoice.coach.name if obj.invoice and obj.invoice.coach else None
   
    def get_cashier(self, obj):
        return obj.invoice.cashier.name if obj.invoice and obj.invoice.cashier else None
