from rest_framework import permissions

class IsOwnerUser(permissions.BasePermission):
    """
    Custom permission to only allow OWNER or ADMIN users.
    """
    def has_permission(self, request, view):
        return (request.user.is_authenticated and 
                (request.user.user_type.english_name == 'Owner' or 
                 request.user.user_type.english_name == 'Admin'))


class AllowCashierUser(permissions.BasePermission):
    """
    Custom permission to  allow Cashier users with admin.
    """
    def has_permission(self, request, view):
        return (request.user.is_authenticated and 
                (request.user.user_type.english_name == 'Owner' or 
                 request.user.user_type.english_name == 'Admin' or
                 request.user.user_type.english_name == 'Cashier'))


class AllowCashierUserOnly(permissions.BasePermission):
    """
    Custom permission to  allow only Cashier users with admin.
    """
    def has_permission(self, request, view):
        return (request.user.is_authenticated and 
                (request.user.user_type.english_name == 'Admin' or
                 request.user.user_type.english_name == 'Cashier'))
    


class AllowCoachUser(permissions.BasePermission):
    """
    Custom permission to  allow Coach users with admin.
    """
    def has_permission(self, request, view):
        return (request.user.is_authenticated and 
                (request.user.user_type.english_name == 'Owner' or 
                 request.user.user_type.english_name == 'Admin' or
                 request.user.user_type.english_name == 'Coach'))
    


class AllowCoachUserOnly(permissions.BasePermission):
    """
    Custom permission to  allow only Cashier users with admin.
    """
    def has_permission(self, request, view):
        return (request.user.is_authenticated and 
                (request.user.user_type.english_name == 'Admin' or
                 request.user.user_type.english_name == 'Coach'))
    


class AllowAdminOnly(permissions.BasePermission):
    """
    Custom permission to  allow only Cashier users with admin.
    """
    def has_permission(self, request, view):
        return (request.user.is_authenticated and 
                (request.user.user_type.english_name == 'Admin'))