from django.contrib import admin
from .models import Plan,Discount,Invoice,Subscription

# Register your models here.
admin.site.register(Plan)
admin.site.register(Discount)
admin.site.register(Invoice)
admin.site.register(Subscription)