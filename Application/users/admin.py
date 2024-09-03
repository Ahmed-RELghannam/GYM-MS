from django.contrib import admin
from .user_type import UserType
from .models import User,Member,Cashier,Coach,notifications
from .forms import CustomUserCreationForm, CustomUserChangeForm



class CustomUserAdmin(admin.ModelAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    list_display = ('email', 'user_type', 'is_active', 'is_staff')  
    search_fields = ('email',)  
    ordering = ('email',)

admin.site.register(User,CustomUserAdmin)


admin.site.register(Member)
admin.site.register(UserType)
admin.site.register(Cashier)
admin.site.register(Coach)
admin.site.register(notifications)
