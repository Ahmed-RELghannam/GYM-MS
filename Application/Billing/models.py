from django.db import models
from users.models import Member,Cashier,Coach


# Plan definition
class Plan(models.Model):
    name = models.CharField(max_length=255, unique=True)
    period = models.IntegerField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    Archived = models.BooleanField(default=False)
    def __str__(self):
        return self.name
    


#  Definition of Discount
class Discount(models.Model):
    code = models.CharField(max_length=255, unique=True)
    value = models.SmallIntegerField()
    is_percentage = models.BooleanField(default=False)
    expierd_date = models.DateField(null=True,blank=True)
    number_of_using = models.PositiveIntegerField(default=0)
    allow_of_using = models.PositiveIntegerField(null=True,blank=True)
    has_expierd = models.BooleanField(default=False)
    def __str__(self):
        return self.code
    


# Definition of invoice
class Invoice(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    have_taxs = models.BooleanField(default=False)
    datetime = models.DateTimeField(auto_now=True)
    have_discount = models.BooleanField(default=False)
    have_private_coach = models.BooleanField(default=False)
    cashier = models.ForeignKey(Cashier, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    coach = models.ForeignKey(Coach, on_delete=models.SET_NULL, null=True,blank=True)
    discount = models.ForeignKey(Discount, on_delete=models.SET_NULL, null=True,blank=True)
    has_refunded = models.BooleanField(default=False)

    def __str__(self):
        return f"Invoice {self.id}"
    


# Subscription definition
class Subscription(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    was_refunded = models.BooleanField(default=False)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)

    def __str__(self):
        return f"Subscription {self.id}"