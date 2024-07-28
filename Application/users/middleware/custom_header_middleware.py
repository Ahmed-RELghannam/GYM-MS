from django.http import HttpResponseForbidden
from django.conf import settings

class CustomHeaderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        allowed_header = request.META.get('HTTP_X_CUSTOM_HEADER')
        if allowed_header != settings.SECRET_HEADER_VALUE:
            return HttpResponseForbidden('Access denied')
        return self.get_response(request)
