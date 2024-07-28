"""
    Defineng user type 
    UserType model for handle access must to insert 4 data as English name
        - Owner
        - Cashier 
        - Coach
        - Member 
"""


from django.db import models



class UserType(models.Model):
    english_name = models.CharField(max_length=255)
    arabic_name = models.CharField(max_length=255)
    france_name = models.CharField(max_length=255)
    indonesian_name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.english_name} | {self.arabic_name} | {self.france_name} | {self.indonesian_name}"
