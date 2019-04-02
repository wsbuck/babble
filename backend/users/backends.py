from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend


class CaseInsensitiveModelBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        UserModel = get_user_model()
        if email is None:
            email = kwargs.get(UserModel.EMAIL_FIELD)
        try:
            case_insensitive_email_field = '{}__iexact'.format(
                                    UserModel.EMAIL_FIELD)
            user = UserModel._default_manager.get(
                                    **{case_insensitive_email_field: email})
        except UserModel.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a non-existing user (#20760).
            UserModel().set_password(password)
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
