from django.utils import timezone
from rest_framework import serializers
from .models import Plan, Invoice, Subscription, Discount



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
    class Meta:
        model = Plan
        fields = ['name', 'period', 'cost', 'Archived']

    def validate_period(self, value):
        if value <= 0:
            raise serializers.ValidationError("The period must be a positive integer.")
        return value

    def validate_cost(self, value):
        if value <= 0:
            raise serializers.ValidationError("The cost must be a positive number.")
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
    
    
