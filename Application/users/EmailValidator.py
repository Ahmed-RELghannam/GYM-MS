from django.core.validators import EmailValidator

class CustomEmailValidator(EmailValidator):
    domain_allowlist = ["*"]
    def __init__(self, message=None, code=None, allowlist=domain_allowlist):
        if allowlist is None:
            allowlist = ['*']  # Allow any email domain
        super().__init__(message=message, code=code, allowlist=allowlist)
    
    def __call__(self, value):
        # Bypass domain validation if allowlist contains '*'
        if self.allowlist == ['*']:
            value = self.clean(value)
            return
        super().__call__(value)