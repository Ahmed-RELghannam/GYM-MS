from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six


class CreateUserTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, modele, timestamp):
        return (
            six.text_type(modele.pk) + six.text_type(timestamp) +
            six.text_type(modele.create_date)+
            six.text_type(modele.edite_date)
        )
    
create_user_token_generator = CreateUserTokenGenerator()