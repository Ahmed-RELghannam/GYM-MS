from django.contrib import admin
from .models import Plan,Discount,Invoice,Subscription,withdraw, MemberAttandance

# Register your models here.
admin.site.register(Plan)
admin.site.register(Discount)
admin.site.register(Invoice)
admin.site.register(Subscription)
admin.site.register(withdraw)
admin.site.register(MemberAttandance)

