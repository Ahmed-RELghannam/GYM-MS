from django.core.management.base import BaseCommand
from users.user_type import UserType

class Command(BaseCommand):
    help = 'Add initial data to the database'

    def handle(self, *args, **kwargs):
        UserType.objects.create(id=1, english_name='Admin')
        UserType.objects.create(id=2, english_name='Cashier')
        UserType.objects.create(id=3, english_name='Coach')
        UserType.objects.create(id=4, english_name='Member')
        UserType.objects.create(id=4, english_name='Owner')
        self.stdout.write(self.style.SUCCESS('Successfully added initial data'))